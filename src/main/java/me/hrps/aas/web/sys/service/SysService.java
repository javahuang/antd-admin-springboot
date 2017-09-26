package me.hrps.aas.web.sys.service;


import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import me.hrps.aas.core.constant.AppConsts;
import me.hrps.aas.core.exception.ValidatorException;
import me.hrps.aas.core.utils.*;
import me.hrps.aas.web.sys.domain.*;
import me.hrps.aas.web.sys.filter.AccountFilter;
import me.hrps.aas.web.sys.filter.RoleFilter;
import me.hrps.aas.web.sys.mapper.*;
import me.hrps.aas.web.sys.qo.TreeSortQO;
import me.hrps.aas.web.sys.vo.MenuPermissionTreeVO;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午12:58
 */
@Service
public class SysService {

    @Autowired
    private SysAccountMapper sysAccountMapper;

    @Autowired
    private SysAccountRoleMapper sysAccountRoleMapper;

    @Autowired
    private SysMenuMapper sysMenuMapper;

    @Autowired
    private SysPermissionMapper sysPermissionMapper;

    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Autowired
    private SysRolePermissionMapper sysRolePermissionMapper;


    public List<SysAccount> selectByFilter(AccountFilter filter) {
        return sysAccountMapper.selectByFilter(filter);
    }

    
    public List<SysAccount> selectRoleUsers(String roleName) {
        return sysAccountMapper.selectRoleUsers(roleName);
    }

    
    public void createAccount(SysAccount account, String[] roleIds) {
        account.setId(Utils.generateUUID());
        account.setCreateTime(new Date());
        account.setCreateBy(Securitys.getAccountId());
        byte[] salt = Digests.generateSalt(8);
        account.setSalt(PasswordUtils.encodeHex(salt));
        account.setPassword(PasswordUtils.getEncodePassWord(account.getPassword(), salt));
        sysAccountMapper.insertSelective(account);

        if (roleIds != null) {
            createAccountRole(account.getId(), roleIds);
        }
    }

    
    public void updateAccount(SysAccount account, String[] roleIds) {
        account.setUpdateTime(new Date());
        account.setUpdateBy(Securitys.getAccountId());
        if (StringUtils.isNotBlank(account.getPassword())) {
            byte[] salt = Digests.generateSalt(8);
            account.setSalt(PasswordUtils.encodeHex(salt));
            account.setPassword(PasswordUtils.getEncodePassWord(account.getPassword(), salt));
        }
        sysAccountMapper.updateByPrimaryKeySelective(account);

        SysAccountRoleExample exp = new SysAccountRoleExample();
        exp.createCriteria().andAccountIdEqualTo(account.getId());
        sysAccountRoleMapper.deleteByExample(exp);
        if (roleIds != null) {
            createAccountRole(account.getId(), roleIds);
        }
    }

    // 创建角色账号关联关系
    private void createAccountRole(String accountId, String[] roleIds) {
        for (String roleId : roleIds) {
            SysAccountRoleKey roleKey = new SysAccountRoleKey();
            roleKey.setAccountId(accountId);
            roleKey.setRoleId(roleId);
            sysAccountRoleMapper.insert(roleKey);
        }
    }

    
    public void deleteAccount(String id) {
        sysAccountMapper.deleteByPrimaryKey(id);
    }

    
    public void selectAccountByLoginName(String q) {
        if (StringUtils.isBlank(q)) {
            throw new ValidatorException("账户名不能为空");
        }
        SysAccountExample exp = new SysAccountExample();
        exp.createCriteria().andLoginNameEqualTo(q);
        List<SysAccount> accounts = sysAccountMapper.selectByExample(exp);
        if (accounts.size() > 0) {
            throw new ValidatorException("账户名已存在");
        }
    }

    
    public Map<String, Object> queryMenus() {
        Map<String, Object> trees = Maps.newHashMap();
        SysMenuExample menuExample = new SysMenuExample();
        menuExample.setOrderByClause("MENU_LEVEL, SEQUENCE asc");
        trees.put("menuTree", sysMenuMapper.selectByExample(menuExample));

        SysPermissionExample permissionExample = new SysPermissionExample();
        permissionExample.createCriteria().andIsResourceEqualTo(AppConsts.IS_RESOURCE_MENU);
        permissionExample.setOrderByClause("PERMISSION_LEVEL, SEQUENCE asc");
        List<MenuPermissionTreeVO> menuPermissionTree = Lists.newArrayList();
        sysPermissionMapper.selectByExample(permissionExample).forEach(el -> {
            MenuPermissionTreeVO treeVO = new MenuPermissionTreeVO();
            treeVO.setLabel(el.getName());
            treeVO.setValue(el.getId() + "");
            treeVO.setParentId(el.getParentId());
            menuPermissionTree.add(treeVO);
        });
        trees.put("menuPermissionTree", menuPermissionTree);
        return trees;
    }

    
    public void createMenu(SysMenu menu) {
        menu.setId(Utils.generateUUID());
        menu.setCreateBy(Securitys.getAccountId());
        menu.setCreateTime(new Date());
        SysMenuExample exp = new SysMenuExample();
        if (StringUtils.isBlank(menu.getMpid())) {
            exp.createCriteria().andMpidIsNull();
        } else {
            exp.createCriteria().andMpidEqualTo(menu.getMpid());
        }
        List<SysMenu> menus = sysMenuMapper.selectByExample(exp);
        menu.setSequence((byte)(menus.size() + 1));
        // 1级菜单的面包屑导航根节点都是管理控制台
        if (StringUtils.isBlank(menu.getMpid())) {
            menu.setBpid(AppConsts.MENU_ROOT_BPID);
        } else {
            menu.setBpid(menu.getMpid());
        }
        menu.setMenuLevel((byte)getMenuLevel(menu));
        sysMenuMapper.insertSelective(menu);
    }

    
    public void updateMenu(SysMenu menu) {
        menu.setUpdateBy(Securitys.getAccountId());
        menu.setUpdateTime(new Date());
        menu.setMenuLevel((byte)getMenuLevel(menu));
        sysMenuMapper.updateByPrimaryKeySelective(menu);
    }

    private int getMenuLevel(SysMenu menu) {
        int menuLevel = 1;  // 默认是1级菜单
        if (StringUtils.isNotBlank(menu.getMpid())  // 父菜单非空 当前菜单menuLevel有值且非-1或者当前菜单 menuLevel 为空
                && ((menu.getMenuLevel() != null && menu.getMenuLevel() != -1) || menu.getMenuLevel() == null)) {
            // 非一级菜单且是导航菜单
            menuLevel = sysMenuMapper.selectByPrimaryKey(menu.getMpid()).getMenuLevel() + 1;
        } else if (menu.getMenuLevel() != null && menu.getMenuLevel() == -1) {
            menuLevel = -1;
        }
        return menuLevel;
    }

    
    public void deleteMenu(String id) {
        SysMenuExample exp = new SysMenuExample();
        exp.createCriteria().andMpidEqualTo(id);
        List<SysMenu> menus = sysMenuMapper.selectByExample(exp);
        if (menus.size() > 0) {
            throw new ValidatorException("有子节点不能删除");
        }
        sysMenuMapper.deleteByPrimaryKey(id);
    }

    
    public void sortMenu(TreeSortQO sortQO) {
        String dragKey = sortQO.getDragKey();
        SysMenu dragMenu = sysMenuMapper.selectByPrimaryKey(dragKey);
        String parentId = dragMenu.getMpid();
        SysMenuExample exp = new SysMenuExample();
        if (StringUtils.isBlank(parentId)) {
            exp.createCriteria().andMpidIsNull();
        } else {
            exp.createCriteria().andMpidEqualTo(parentId);
        }
        exp.setOrderByClause("SEQUENCE asc");
        List menus = sysMenuMapper.selectByExample(exp);
        menus.remove(dragMenu.getSequence() - 1);
        sortAndUpdate(sortQO, menus, dragMenu);
    }

    
    public void menuNameValidation(String q) {
        SysMenuExample exp = new SysMenuExample();
        exp.createCriteria().andNameEqualTo(q);
        List<SysMenu> menus = sysMenuMapper.selectByExample(exp);
        if (menus.size() > 0) {
            throw new ValidatorException("菜单名称不能重复");
        }
    }

    
    public List<?> queryPermissions() {
        SysPermissionExample exp = new SysPermissionExample();
        exp.setOrderByClause("PERMISSION_LEVEL, SEQUENCE asc");
        return sysPermissionMapper.selectByExample(exp);
    }

    
    public void createPermission(SysPermission permission) {
        SysPermissionExample exp = new SysPermissionExample();
        int permissionLevel = 1;//默认1级权限
        if (StringUtils.isBlank(permission.getParentId())) {
            exp.createCriteria().andParentIdIsNull();
        } else {
            exp.createCriteria().andParentIdEqualTo(permission.getParentId());
            permissionLevel = sysPermissionMapper.selectByPrimaryKey(permission.getParentId()).getPermissionLevel() + 1;
        }
        List<SysPermission> permissions = sysPermissionMapper.selectByExample(exp);
        permission.setPermissionLevel((byte)permissionLevel);
        permission.setSequence((byte)(permissions.size() + 1));
        permission.setCreateBy(Securitys.getAccountId());
        permission.setCreateTime(new Date());
        permission.setId(Utils.generateUUID());
        sysPermissionMapper.insertSelective(permission);
    }

    
    public void updatePermission(SysPermission permission) {
        permission.setUpdateBy(Securitys.getAccountId());
        permission.setUpdateTime(new Date());
        sysPermissionMapper.updateByPrimaryKeySelective(permission);
    }

    
    public void deletePermission(String id) {
        // 如果当前节点有子节点，则不能删除
        SysPermissionExample exp = new SysPermissionExample();
        exp.createCriteria().andParentIdEqualTo(id);
        List<SysPermission> permissions = sysPermissionMapper.selectByExample(exp);
        if (permissions.size() > 0) {
            throw new ValidatorException("有子节点不能删除");
        }
        sysPermissionMapper.deleteByPrimaryKey(id);
    }

    /**
     * 重新排列菜单顺序
     *
     * @param sortQO
     */
    
    public void sortPermission(TreeSortQO sortQO) {
        String dragKey = sortQO.getDragKey();
        SysPermission dragPermission = sysPermissionMapper.selectByPrimaryKey(dragKey);
        String parentId = dragPermission.getParentId();
        SysPermissionExample exp = new SysPermissionExample();
        if (parentId == null) {
            exp.createCriteria().andParentIdIsNull();
        } else {
            exp.createCriteria().andParentIdEqualTo(parentId);
        }
        exp.setOrderByClause("SEQUENCE asc");
        List permissions = sysPermissionMapper.selectByExample(exp);
        permissions.remove(dragPermission.getSequence() - 1);
        sortAndUpdate(sortQO, permissions, dragPermission);
    }

    
    public void permissionNameValidation(String q) {
        SysPermissionExample exp = new SysPermissionExample();
        exp.createCriteria().andNameEqualTo(q);
        List<SysPermission> permissions = sysPermissionMapper.selectByExample(exp);
        if (permissions.size() > 0) {
            throw new ValidatorException("权限名称已经存在");
        }
    }

    
    public List<?> queryRoles(RoleFilter roleFilter) {
        return sysRoleMapper.selectByFilter(roleFilter);
    }

    
    public void createRole(SysRole role, String[] permissions) {
        role.setCreateBy(Securitys.getAccountId());
        role.setCreateTime(new Date());
        role.setId(Utils.generateUUID());
        sysRoleMapper.insertSelective(role);

        createRolePermissions(role, permissions);
    }

    
    public void updateRole(SysRole role, String[] permissions) {
        role.setUpdateBy(Securitys.getAccountId());
        role.setUpdateTime(new Date());
        sysRoleMapper.updateByPrimaryKeySelective(role);

        // 删除关联关系之后创建
        deleteRolePermissionsByRoleId(role.getId());
        createRolePermissions(role, permissions);
    }

    // 添加角色权限关联关系
    private void createRolePermissions(SysRole role, String[] permissionIds) {
        for (String permissionId : permissionIds) {
            SysRolePermissionKey rolePermission = new SysRolePermissionKey();
            rolePermission.setRoleId(role.getId());
            rolePermission.setPermissionId(permissionId);
            sysRolePermissionMapper.insert(rolePermission);
        }
    }

    // 删除角色权限关联关系
    private void deleteRolePermissionsByRoleId(String roleId) {
        SysRolePermissionExample exp = new SysRolePermissionExample();
        exp.createCriteria().andRoleIdEqualTo(roleId);
        sysRolePermissionMapper.deleteByExample(exp);
    }

    
    public void deleteRole(String id) {
        sysRoleMapper.deleteByPrimaryKey(id);
        deleteRolePermissionsByRoleId(id);
    }

    
    public void selectRoleByRoleName(String q) {
        SysRoleExample exp = new SysRoleExample();
        exp.createCriteria().andNameEqualTo(q);
        List<SysRole> roles = sysRoleMapper.selectByExample(exp);
        if (roles.size() > 0) {
            throw new ValidatorException("角色名称已存在");
        }
    }


    /**
     * //TODO
     * 对 permission 和 menu 排序，因为逻辑一致，就报代码重复，只好用下面的代码整合一下
     * 但是还是很难看，日后再想办法
     *
     * @param sortQO
     * @param sortObjs
     * @param dragObj
     */
    private void sortAndUpdate(TreeSortQO sortQO, List<Object> sortObjs, Object dragObj) {
        try {
            final boolean forceAccessField = true;
            String dropKey = sortQO.getDropKey();
            for (int i = 0; i < sortObjs.size(); i++) {
                Object sortObj = sortObjs.get(i);
                String fieldName = "id";
                String id = (String) FieldUtils.readField(sortObj, fieldName, forceAccessField);
                if (id.equals(dropKey)) {
                    if (sortQO.getDropPosition() == 1) {
                        sortObjs.add(i + 1, dragObj);
                        break;
                    } else {
                        sortObjs.add(i, dragObj);
                        break;
                    }
                }
            }
            for (int i = 1; i <= sortObjs.size(); i++) {
                Object sortObj = sortObjs.get(i - 1);
                int sequence = (int) FieldUtils.readField(sortObj, "sequence", forceAccessField);
                if (sequence != i) {
                    FieldUtils.writeField(sortObj, "sequence", i, forceAccessField);
                    FieldUtils.writeField(sortObj, "updateDatetime", new Date(), forceAccessField);
                    FieldUtils.writeField(sortObj, "updateUser", Securitys.getAccountId(), forceAccessField);
                    if (sortObj instanceof SysPermission) {
                        SysPermission realSortObj = (SysPermission) sortObj;
                        sysPermissionMapper.updateByPrimaryKeySelective(realSortObj);
                    }
                    if (sortObj instanceof SysMenu) {
                        SysMenu realSortObj = (SysMenu) sortObj;
                        sysMenuMapper.updateByPrimaryKeySelective(realSortObj);
                    }
                }
            }
        } catch (IllegalAccessException e) {
            throw Exceptions.unchecked(e);
        }
    }

}
