package me.hrps.aas.core.mybatis.domain;

import java.util.List;

/**
 * Description:
 * <pre>
 *     封装的页面表格数据
 * </pre>
 * Author: javahuang
 * Create: 2017/9/26 下午1:01
 */
public class TableResponse<T> {

    private Long total;
    private List<T> list;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }
}
