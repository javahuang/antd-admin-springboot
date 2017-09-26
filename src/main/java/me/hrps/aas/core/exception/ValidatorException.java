package me.hrps.aas.core.exception;

/**
 * Description:
 * <pre>
 *     表单远程校验异常
 * </pre>
 * Author: javahuang
 * Create: 17/9/26 下午5:38
 */
public class ValidatorException extends RuntimeException {

    public ValidatorException() {
    }

    public ValidatorException(String message) {
        super(message);
    }

    public ValidatorException(String message, Throwable cause) {
        super(message, cause);
    }

    public ValidatorException(Throwable cause) {
        super(cause);
    }
}
