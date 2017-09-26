package me.hrps.aas.core.config;

import me.hrps.aas.core.shiro.filter.MyFormAuthenticationFilter;
import me.hrps.aas.core.shiro.filter.MyLogoutFilter;
import me.hrps.aas.core.shiro.filter.MyUserFilter;
import me.hrps.aas.core.shiro.realm.ShiroDbRealm;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.codec.Base64;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.AnonymousFilter;
import org.apache.shiro.web.filter.authz.RolesAuthorizationFilter;
import org.apache.shiro.web.mgt.CookieRememberMeManager;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.servlet.Filter;
import java.util.HashMap;
import java.util.Map;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 17/5/16 下午12:59
 */
@Configuration
public class ShrioConfig {

    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean shiroFilter() {
        ShiroFilterFactoryBean shiroFilter = new ShiroFilterFactoryBean();
        // 权限控制放在前端页面
        shiroFilter.setLoginUrl("/user/login");
        shiroFilter.setSuccessUrl("/index");
        Map<String, String> filterChainDefinitionMapping = new HashMap<>();
        filterChainDefinitionMapping.put("/user/login", "authc");
        filterChainDefinitionMapping.put("/user/logout", "logout");
        filterChainDefinitionMapping.put("/user", "anon");
        filterChainDefinitionMapping.put("/login", "anon");
        filterChainDefinitionMapping.put("/**", "user");
        shiroFilter.setFilterChainDefinitionMap(filterChainDefinitionMapping);
        shiroFilter.setSecurityManager(securityManager());

        Map<String, Filter> filters = new HashMap<>();
        filters.put("anon", new AnonymousFilter());
        filters.put("authc", new MyFormAuthenticationFilter());
        filters.put("logout", new MyLogoutFilter());
        filters.put("roles", new RolesAuthorizationFilter());
        filters.put("user", new MyUserFilter());
        shiroFilter.setFilters(filters);

        return shiroFilter;
    }

    @Bean(name = "securityManager")
    public SecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(realm());
        securityManager.setCacheManager(ehCacheManager());
        securityManager.setRememberMeManager(rememberMeManager());
        return securityManager;
    }

    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    public EhCacheManager ehCacheManager() {
        EhCacheManager ehCacheManager = new EhCacheManager();
        ehCacheManager.setCacheManagerConfigFile("classpath:security/ehcache-shiro.xml");
        return ehCacheManager;
    }

    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    public ShiroDbRealm realm() {
        return new ShiroDbRealm();
    }

    /**
     * Enable Shiro Annotations
     */
    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator creator = new DefaultAdvisorAutoProxyCreator();
        creator.setProxyTargetClass(true);
        return creator;
    }

    /**
     * Enable Shiro Annotations
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager());
        return authorizationAttributeSourceAdvisor;
    }

    /**
     * 实现了Initializable或者Destroyable的shiro对象将会自动调用init() and/or destory()方法
     * 所以这个Bean需要使用 @DependsOn 在其它对象之前初始化
     *
     * @return
     */
    @Bean
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

    @Bean
    public SimpleCookie rememberMeCookie() {
        SimpleCookie rememberCookie = new SimpleCookie("rememberMe");
        rememberCookie.setHttpOnly(true);
        rememberCookie.setMaxAge(86400);  // 修改为只能一天有效
        return rememberCookie;
    }

    @Bean
    public CookieRememberMeManager rememberMeManager() {
        CookieRememberMeManager rememberMeManager = new CookieRememberMeManager();
        rememberMeManager.setCipherKey(Base64.decode("4AvVhmFLUs0KTA3Kprsdag=="));
        rememberMeManager.setCookie(rememberMeCookie());
        return rememberMeManager;
    }
}
