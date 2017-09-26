package me.hrps.aas.core.utils;

/**
 * Description:
 * <pre>
 *     异常转化
 * </pre>
 * Author: javahuang
 * Create: 17/5/23 上午9:43
 */
public class Exceptions {

    /**
     * 将 CheckedException 转换为 UncheckedException
     *
     * @param e CheckedException
     * @return UncheckedException
     */
    public static RuntimeException unchecked(Exception e) {
        if (e instanceof RuntimeException) {
            return (RuntimeException) e;
        } else {
            return new RuntimeException(e);
        }
    }
}
