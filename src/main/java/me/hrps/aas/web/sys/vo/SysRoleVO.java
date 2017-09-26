package me.hrps.aas.web.sys.vo;

import me.hrps.aas.web.sys.domain.SysRole;

/**
 * Description:
 * <pre>
 *     添加角色对应的权限列表
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午2:02
 */
public class SysRoleVO extends SysRole{

    private String permissionNames;
    private String permissionIds;

    public String getPermissionNames() {
        return permissionNames;
    }

    public void setPermissionNames(String permissionNames) {
        this.permissionNames = permissionNames;
    }

    public String getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(String permissionIds) {
        this.permissionIds = permissionIds;
    }
}
