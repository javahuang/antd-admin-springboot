package me.hrps.aas.web.sys.filter;

import me.hrps.aas.core.mybatis.domain.PageFilter;

/**
 * Description:
 * <pre>
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午1:55
 */
public class RoleFilter extends PageFilter{

    private String searchId;

    public String getSearchId() {
        return searchId;
    }

    public void setSearchId(String searchId) {
        this.searchId = searchId;
    }
}
