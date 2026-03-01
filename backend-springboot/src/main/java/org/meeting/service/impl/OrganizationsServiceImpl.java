package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.OrganizationsMapper;
import org.meeting.pojo.Organizations;
import org.meeting.service.OrganizationsService;

import java.util.List;

@Service
public class OrganizationsServiceImpl implements OrganizationsService {
    @Autowired
    private OrganizationsMapper organizationsMapper;

    @Override
    public void add(Organizations organizations) {
        organizationsMapper.add(organizations);
    }

    @Override
    public void update(Organizations organizations) {
        organizationsMapper.update(organizations);
    }

    @Override
    public void delete(Integer organizationId) {
        organizationsMapper.delete(organizationId);
    }

    @Override
    public List<Organizations> findById(Integer organizationId) {
        return organizationsMapper.findById(organizationId);
    }

    @Override
    public List<Organizations> findAll() {
        return organizationsMapper.findAll();
    }
}
