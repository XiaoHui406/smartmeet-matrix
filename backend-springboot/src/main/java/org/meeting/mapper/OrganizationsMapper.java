package org.meeting.mapper;

import org.apache.ibatis.annotations.*;
import org.meeting.pojo.Organizations;

import java.util.List;

@Mapper
public interface OrganizationsMapper {
    @Insert("INSERT INTO organizations (organization_name, organization_describe) VALUES (#{organizationName}, #{organizationDescribe})")
    @Options(useGeneratedKeys = true, keyProperty = "organizationId")
    void add(Organizations organizations);

    @Select("SELECT * FROM organizations WHERE organization_id = #{organizationId}")
    List<Organizations> findById(Integer organizationId);

    @Update("UPDATE organizations SET organization_name = #{organizationName}, organization_describe = #{organizationDescribe} WHERE organization_id = #{organizationId}")
    void update(Organizations organizations);

    @Delete("DELETE FROM organizations WHERE organization_id = #{organizationId}")
    void delete(Integer organizationId);

    @Select("select * from organizations")
    List<Organizations> findAll();
}
