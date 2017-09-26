package me.hrps.aas.core.mvc.advice;

import com.github.pagehelper.Page;
import com.google.common.collect.Maps;
import me.hrps.aas.core.mybatis.domain.TableResponse;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.List;
import java.util.Map;

/**
 * Description:
 * <pre>
 *    包装返回资源 匹配前端
 * </pre>
 * Author: javahuang
 * Create: 17/9/16 上午4:21
 */
@ControllerAdvice
public class MyResponseBodyAdvice implements ResponseBodyAdvice{

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // 静态页面无需拦截
        if (body instanceof Resource) {
            return body;
        }
        if (body == null) {
            return null;
        }
        // 分页
        if (body instanceof Page) {
            Page page = (Page) body;
            TableResponse<Page> result = new TableResponse<>();
            result.setTotal(page.getTotal());
            result.setList(page);
            return result;
        }
        // 如果返回的是数组，前端通过 data.array 来获取
        if (body instanceof List || body.getClass().isArray()) {
            Map<String, Object> result = Maps.newHashMap();
            result.put("array", body);
            return result;
        }
        return body;
    }
}
