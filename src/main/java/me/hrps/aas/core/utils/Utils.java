package me.hrps.aas.core.utils;

import java.util.UUID;

/**
 * Description:
 * <pre>
 *     系统常用的一些工具类
 * </pre>
 * Author: javahuang
 * Create: 17/9/26 下午1:40
 */
public class Utils {

    /**
     * @return 返回UUID作为主键
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

}
