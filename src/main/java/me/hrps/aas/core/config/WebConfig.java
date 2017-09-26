package me.hrps.aas.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 17/9/16 上午3:59
 */
@Configuration
@RestController
public class WebConfig extends WebMvcConfigurerAdapter {

    @Value("classpath:/static/index.html")
    private Resource indexHtml;

    // 匹配类型的静态资源都会被 ResourceHandler 来处理
    private static final String[] STATIC_RESOURCES = {
            "/**/*.css", "/**/*.js",
            "/**/*.jpg", "/**/*.png", "/**/*.svg",    // 图片
            "/**/*.eot", "/**/*.ttf", "/**/*.woff"    // 字体文件
    };

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.setOrder(-1)  // 设置静态资源映射优先级高于下面配置的 @GetMapping
                .addResourceHandler(STATIC_RESOURCES)
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseSuffixPatternMatch(false); // 默认 /index 会匹配 /index.js
    }

    /**
     * @return
     */
    @GetMapping
    public Object index() {
        return ResponseEntity.ok().body(indexHtml);
    }

}
