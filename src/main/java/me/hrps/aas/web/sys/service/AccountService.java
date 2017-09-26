package me.hrps.aas.web.sys.service;

import com.google.common.collect.Maps;
import me.hrps.aas.core.shiro.domain.ShiroUser;
import me.hrps.aas.core.utils.PasswordUtils;
import me.hrps.aas.core.utils.Securitys;
import me.hrps.aas.web.sys.domain.*;
import me.hrps.aas.web.sys.mapper.*;
import me.hrps.aas.web.sys.vo.MenuVO;
import me.hrps.aas.web.sys.vo.UserVO;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UnknownAccountException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 17/9/18 下午10:15
 */
@Service
public class AccountService {

    @Autowired
    private SysAccountMapper sysAccountMapper;
    @Autowired
    private SysAccountRoleMapper sysAccountRoleMapper;
    @Autowired
    private SysRoleMapper sysRoleMapper;
    @Autowired
    private SysRolePermissionMapper sysRolePermissionMapper;
    @Autowired
    private SysPermissionMapper sysPermissionMapper;
    @Autowired
    private SysMenuMapper sysMenuMapper;


    public ShiroUser login(String username, String password) {
        SysAccountExample exp = new SysAccountExample();
        exp.createCriteria().andLoginNameEqualTo(username);
        List<SysAccount> accounts = sysAccountMapper.selectByExample(exp);
        if (accounts.size() > 0) {
            SysAccount account = accounts.get(0);
            String currPassword = PasswordUtils.getEncodePassWord(password, PasswordUtils.decodeHex(account.getSalt()));
            if (!account.getPassword().equals(currPassword)) {
                throw new AuthenticationException("密码错误");
            }
        } else {
            throw new UnknownAccountException("账号不存在");
        }
        SysAccount account = accounts.get(0);
        ShiroUser shiroUser = new ShiroUser();
        shiroUser.setAccountId(account.getId());
        shiroUser.setAdmin(account.getIsAdmin() == 1);
        shiroUser.setName(account.getName());
        shiroUser.setLoginName(account.getLoginName());
        setShiroUserExtraInfo(shiroUser);
        return shiroUser;
    }

    public void setShiroUserExtraInfo(ShiroUser shiroUser) {
        List<SysRole> roles;
        List<SysPermission> permissions;
        List<SysMenu> menus;
        SysMenuExample menuExample = new SysMenuExample();
        menuExample.setOrderByClause("MENU_LEVEL, SEQUENCE asc");
        if (shiroUser.isAdmin()) {
            roles = sysRoleMapper.selectByExample(null);
            permissions = sysPermissionMapper.selectByExample(null);
            menus = sysMenuMapper.selectByExample(menuExample);
        } else {
            SysAccountRoleExample sysAccountRoleExample = new SysAccountRoleExample();
            sysAccountRoleExample.createCriteria().andAccountIdEqualTo(shiroUser.getAccountId());
            List<SysAccountRoleKey> sysAccountRoleKeys = sysAccountRoleMapper.selectByExample(sysAccountRoleExample);

            SysRoleExample roleExample = new SysRoleExample();
            List<String> roleIds = sysAccountRoleKeys.stream().map(SysAccountRoleKey::getRoleId).collect(Collectors.toList());
            roleExample.createCriteria().andIdIn(roleIds);
            if(roleIds.size() == 0) {
                throw new AuthenticationException("该账号无登录系统权限!");
            }
            roles = sysRoleMapper.selectByExample(roleExample);

            SysRolePermissionExample rolePermissionExample = new SysRolePermissionExample();
            rolePermissionExample.createCriteria().andRoleIdIn(roleIds);
            List<SysRolePermissionKey> rolePermissionKeys = sysRolePermissionMapper.selectByExample(rolePermissionExample);
            List<String> permissionIds = rolePermissionKeys.stream().map(SysRolePermissionKey::getPermissionId).collect(Collectors.toList());
            SysPermissionExample sysPermissionExample = new SysPermissionExample();
            sysPermissionExample.createCriteria().andIdIn(permissionIds);
            permissions = sysPermissionMapper.selectByExample(sysPermissionExample);

            menuExample.createCriteria().andPermissionIn(permissionIds);
            menus = sysMenuMapper.selectByExample(menuExample);
        }
        List<String> rolesStr = roles.stream().map(SysRole::getName).collect(Collectors.toList());
        List<String> permissionsStr = permissions.stream().map(SysPermission::getCode).collect(Collectors.toList());

        shiroUser.setRoles(rolesStr);
        shiroUser.setPermissions(permissionsStr);
        shiroUser.setMenus(menus.stream().map(menu -> {
            MenuVO menuVO = new MenuVO();
            BeanUtils.copyProperties(menu, menuVO);
            return menuVO;
        }).collect(Collectors.toList()));
    }

    public Map<String,Object> getUser() {
        Map<String, Object> res = Maps.newHashMap();
        res.put("user", UserVO.buildUser());
        if (Securitys.isAuthenticatedOrRemembered() && Securitys.getMenus() == null) {
            setShiroUserExtraInfo(Securitys.getUser());
        }
        res.put("menu", Securitys.getMenus());
        return res;
    }
}
