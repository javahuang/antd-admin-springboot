package me.hrps.aas.web.sys.vo;

/**
 * Description:
 * <pre>
 *     用于 SysPermission 数据转换成 tree-select 能够识别的数据结构
 *     类型定义为 String,是因为 TreeNode 的参数类型都是 string
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午1:43
 */
public class MenuPermissionTreeVO {

    private String value;
    private String label;
    private String parentId;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
}
