package me.hrps.aas.core.shiro.realm;

import me.hrps.aas.core.shiro.domain.ShiroUser;
import me.hrps.aas.web.sys.service.AccountService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Description:
 * <pre>
 *
 * </pre>
 * Author: javahuang
 * Create: 17/5/16 下午12:59
 */
public class ShiroDbRealm extends AuthorizingRealm {

    @Autowired
    private AccountService accountService;

    /**
     * 认证
     *
     * @param token
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) {
        UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) token;
        String username = usernamePasswordToken.getUsername();
        String password = new String(usernamePasswordToken.getPassword());
        return new SimpleAuthenticationInfo(accountService.login(username, password),
                usernamePasswordToken.getPassword(), getName());
    }

    /**
     * 授权，只有代码中第一次鉴权的时候才会触发此方法的执行
     *
     * @param principals
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        ShiroUser shiroUser = (ShiroUser) principals.getPrimaryPrincipal();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.addRoles(shiroUser.getRoles());
        info.addStringPermissions(shiroUser.getPermissions());
        return info;
    }

}
