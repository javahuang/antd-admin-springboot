package me.hrps.aas.web.sys.mapper;

import me.hrps.aas.web.sys.domain.SysRolePermissionExample;
import me.hrps.aas.web.sys.domain.SysRolePermissionKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysRolePermissionMapper {
    long countByExample(SysRolePermissionExample example);

    int deleteByExample(SysRolePermissionExample example);

    int deleteByPrimaryKey(SysRolePermissionKey key);

    int insert(SysRolePermissionKey record);

    int insertSelective(SysRolePermissionKey record);

    List<SysRolePermissionKey> selectByExample(SysRolePermissionExample example);

    int updateByExampleSelective(@Param("record") SysRolePermissionKey record, @Param("example") SysRolePermissionExample example);

    int updateByExample(@Param("record") SysRolePermissionKey record, @Param("example") SysRolePermissionExample example);
}