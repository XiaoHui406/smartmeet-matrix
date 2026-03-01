package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.MeetingMaterialsMapper;
import org.meeting.pojo.MeetingMaterials;
import org.meeting.service.MeetingMaterialsService;

import java.util.List;

@Service

public class MeetingMaterialsServiceImpl implements MeetingMaterialsService {
    @Autowired
    private MeetingMaterialsMapper meetingMaterialsMapper;

    @Override
    public List<MeetingMaterials> getAllMeetingMaterials(Integer meetingId) {
        return meetingMaterialsMapper.getAllMeetingMaterials(meetingId);
    }

    @Override
    public void addMeetingMaterials(MeetingMaterials meetingMaterials) {
        meetingMaterialsMapper.addMeetingMaterials(meetingMaterials);
    }

    @Override
    public void deleteMeetingMaterials(Integer materialId) {
        meetingMaterialsMapper.deleteMeetingMaterials(materialId);
    }
}
