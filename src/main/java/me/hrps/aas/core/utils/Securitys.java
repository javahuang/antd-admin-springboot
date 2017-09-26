package me.hrps.aas.core.utils;

import me.hrps.aas.core.shiro.domain.ShiroUser;
import me.hrps.aas.web.sys.vo.MenuVO;
import org.apache.shiro.SecurityUtils;

import java.util.List;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午12:56
 */
public class Securitys extends SecurityUtils {

    public static ShiroUser getUser() {
        if (isAuthenticatedOrRemembered()) {
            return (ShiroUser) getSubject().getPrincipal();
        }
        return new ShiroUser();
    }

    public static boolean isAuthenticatedOrRemembered() {
        return getSubject().isAuthenticated() || getSubject().isRemembered();
    }

    public static List<MenuVO> getMenus() {
        return getUser().getMenus();
    }

    public static String getName() {
        return getUser().getName();
    }

    public static String getAccountId() {
        return getUser().getAccountId();
    }

    public static boolean isAdmin() {
        return getUser().isAdmin();
    }
}
