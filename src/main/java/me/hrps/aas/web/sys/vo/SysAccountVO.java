package me.hrps.aas.web.sys.vo;

import me.hrps.aas.web.sys.domain.SysAccount;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午1:05
 */
public class SysAccountVO extends SysAccount{

    private String roleNames;
    private String roleIds;

    public String getRoleNames() {
        return roleNames;
    }

    public void setRoleNames(String roleNames) {
        this.roleNames = roleNames;
    }

    public String getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(String roleIds) {
        this.roleIds = roleIds;
    }
}
