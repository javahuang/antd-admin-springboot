package me.hrps.aas.core.shiro.filter;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * Description:
 * <pre>
 *
 * </pre>
 * Author: javahuang
 * Create: 17/9/16 上午4:05
 */
public class MyFormAuthenticationFilter extends FormAuthenticationFilter {

    @Override
    protected boolean executeLogin(ServletRequest request, ServletResponse response) throws Exception {
        AuthenticationToken token = createToken(request, response);
        if (token == null) {
            String msg = "createToken method implementation returned null. A valid non-null AuthenticationToken " +
                    "must be created in order to execute a login attempt.";
            throw new IllegalStateException(msg);
        }
        try {
            Subject subject = getSubject(request, response);
            subject.login(token);
            // 初始化授权操作
            subject.isPermitted(" init");
            return onLoginSuccess(token, subject, request, response);
        } catch (AuthenticationException e) {
            //throw e;
            return onLoginFailure(token, e, request, response);
        }
    }

    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject,
                                     ServletRequest request, ServletResponse response) throws Exception {
        //we handled the success redirect directly, prevent the chain from continuing:
        return false;
    }

}
