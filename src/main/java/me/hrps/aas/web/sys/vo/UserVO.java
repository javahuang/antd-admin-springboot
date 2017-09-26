package me.hrps.aas.web.sys.vo;

import me.hrps.aas.core.utils.Securitys;

import java.util.List;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午12:55
 */
public class UserVO {

    private String name;
    private String accountId;
    private Boolean isAdmin;
    private List<String> roles;
    private List<String> permissions;

    public static UserVO buildUser() {
        if (!Securitys.isAuthenticatedOrRemembered()) {
            return null;
        }
        UserVO user = new UserVO();
        user.setName(Securitys.getName());
        user.setAccountId(Securitys.getAccountId());
        user.setAdmin(Securitys.isAdmin());
        return user;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
