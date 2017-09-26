package me.hrps.aas.core.mvc.advice;

import com.google.common.collect.Maps;
import me.hrps.aas.core.exception.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import sun.security.validator.ValidatorException;

import java.util.Map;

/**
 * Description:
 * <pre>
 *     统一处理所有的异常，方便业务类直接处理
 * </pre>
 * Author: javahuang
 * Create: 17/9/16 上午4:28
 */
@RestControllerAdvice
public class ServiceExceptionHandler {

    private Logger logger = LoggerFactory.getLogger(ServiceException.class);

    private final Environment env;

    @Autowired
    public ServiceExceptionHandler(Environment env) {
        this.env = env;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handlerError(Exception ex, WebRequest request) {
        Map<String, Object> resp = Maps.newHashMap();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String url = ((ServletWebRequest) request).getRequest().getRequestURI();    // 当前请求url
        String msg = env.getProperty("err.default");
        if (ex instanceof UncategorizedSQLException) {
            // sql 异常
            msg = env.getProperty("err.sql");
        } else if (ex instanceof ValidatorException) {
            // 表单校验异常
            msg = ex.getMessage();
            status = HttpStatus.BAD_REQUEST;
        } else if (ex instanceof HttpMediaTypeNotSupportedException) {
            // 媒体类型不被支持
        } else {
            msg = ex.getMessage();
        }
        ex.printStackTrace();
        resp.put("message", msg);
        logger.error("url:{},error:{}", url, ex.getMessage());
        return ResponseEntity.status(status).body(resp);
    }
}