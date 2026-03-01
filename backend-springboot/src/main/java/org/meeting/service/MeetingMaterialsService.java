package org.meeting.service;

import org.meeting.pojo.MeetingMaterials;

import java.util.List;

public interface MeetingMaterialsService {
    List<MeetingMaterials> getAllMeetingMaterials(Integer meetingId);

    void addMeetingMaterials(MeetingMaterials meetingMaterials);

    void deleteMeetingMaterials(Integer materialId);
}
