package me.hrps.aas.web.sys.mapper;

import me.hrps.aas.web.sys.domain.SysAccount;
import me.hrps.aas.web.sys.domain.SysAccountExample;
import me.hrps.aas.web.sys.filter.AccountFilter;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysAccountMapper {
    long countByExample(SysAccountExample example);

    int deleteByExample(SysAccountExample example);

    int deleteByPrimaryKey(String id);

    int insert(SysAccount record);

    int insertSelective(SysAccount record);

    List<SysAccount> selectByExample(SysAccountExample example);

    SysAccount selectByPrimaryKey(String id);

    int updateByExampleSelective(@Param("record") SysAccount record, @Param("example") SysAccountExample example);

    int updateByExample(@Param("record") SysAccount record, @Param("example") SysAccountExample example);

    int updateByPrimaryKeySelective(SysAccount record);

    int updateByPrimaryKey(SysAccount record);

    List<SysAccount> selectByFilter(AccountFilter filter);

    List<SysAccount> selectRoleUsers(String roleName);
}