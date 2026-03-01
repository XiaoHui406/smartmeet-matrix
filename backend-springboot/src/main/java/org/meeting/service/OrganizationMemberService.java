package org.meeting.service;

import org.meeting.pojo.OrganizationMember;

import java.util.List;

public interface OrganizationMemberService {
    void add(Integer organizationId, Integer userId);

    void delete(Integer relationId);

    List<OrganizationMember> findByUserId(Integer id);

    List<OrganizationMember> findAllByOrganizationId(Integer organizationId);
}
