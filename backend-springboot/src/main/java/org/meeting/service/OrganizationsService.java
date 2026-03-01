package org.meeting.service;

import org.meeting.pojo.Organizations;

import java.util.List;

public interface OrganizationsService {
    void add(Organizations organizations);

    void update(Organizations organizations);

    void delete(Integer organizationId);

    List<Organizations> findById(Integer organizationId);

    List<Organizations> findAll();
}
