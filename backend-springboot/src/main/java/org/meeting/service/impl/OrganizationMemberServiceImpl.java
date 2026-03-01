package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.OrganizationMemberMapper;
import org.meeting.pojo.OrganizationMember;
import org.meeting.service.OrganizationMemberService;

import java.util.List;

@Service
public class OrganizationMemberServiceImpl implements OrganizationMemberService {
    @Autowired
    private OrganizationMemberMapper organizationMemberMapper;

    @Override
    public List<OrganizationMember> findAllByOrganizationId(Integer organizationId) {
        return organizationMemberMapper.findAllByOrganizationId(organizationId);
    }

    @Override
    public void add(Integer organizationId, Integer userId) {
        organizationMemberMapper.add(organizationId, userId);
    }

    @Override
    public void delete(Integer relationId) {
        organizationMemberMapper.delete(relationId);
    }

    @Override
    public List<OrganizationMember> findByUserId(Integer id) {
        return organizationMemberMapper.findByUserId(id);
    }


}
