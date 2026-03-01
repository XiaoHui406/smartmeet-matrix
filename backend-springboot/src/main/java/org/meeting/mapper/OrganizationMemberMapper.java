package org.meeting.mapper;

import org.apache.ibatis.annotations.*;
import org.meeting.pojo.OrganizationMember;

import java.util.List;

@Mapper
public interface OrganizationMemberMapper {

    @Insert("INSERT into organization_member (organization_id, member_id) VALUES (#{organizationId}, #{userId})")
    void add(Integer organizationId, Integer userId);

    @Delete("delete from organization_member where relation_id = #{relationId}")
    void delete(Integer relationId);

    @Select("select * from organization_member where member_id = #{id}")
    List<OrganizationMember> findByUserId(Integer id);

    @Select("SELECT om.relation_id, om.organization_id, om.member_id, " +
            "u.user_name AS memberName, u.account AS memberPhone, u.user_pic AS userPic " +
            "FROM organization_member om " +
            "LEFT JOIN users u ON om.member_id = u.user_id " +
            "WHERE om.organization_id = #{organizationId}")
    @Results({
            @Result(property = "relationId", column = "relation_id"),
            @Result(property = "organizationId", column = "organization_id"),
            @Result(property = "memberId", column = "member_id"),
            @Result(property = "memberName", column = "memberName"),
            @Result(property = "memberPhone", column = "memberPhone"),
            @Result(property = "userPic", column = "userPic")
    })
    List<OrganizationMember> findAllByOrganizationId(Integer organizationId);

}
