package me.hrps.aas.core.constant;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 17/9/16 上午4:17
 */
public class AppConsts {
    /**
     * 系统里面所有 true 对应 1，数据库表字段类型为 number(1)
     */
    public static final Short TRUE = 1;
    /**
     * 系统里面所有 false 对应 0，数据库表字段类型为 number(1)
     */
    public static final Short FALSE = 0;

    /**
     * 菜单
     */
    public static final Byte IS_RESOURCE_MENU = 1;
    /**
     * 有路由配置，但不在导航栏显示的菜单
     */
    public static final String SUB_MENU = "submenu";
    /**
     * 面包屑菜单导航父节点 ID
     */
    public static final String MENU_ROOT_BPID = "4dcab7f2ad5f4166996de3ff910ac8c2";

    /**
     * 登录URI
     */
    public static final String QUERY_USER_URI = "/user";

}
