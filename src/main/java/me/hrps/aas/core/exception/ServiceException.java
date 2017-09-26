package me.hrps.aas.core.exception;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 17/9/16 上午4:30
 */
public class ServiceException extends RuntimeException{

    public ServiceException() {
        super();
    }

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public ServiceException(Throwable cause) {
        super(cause);
    }
}
