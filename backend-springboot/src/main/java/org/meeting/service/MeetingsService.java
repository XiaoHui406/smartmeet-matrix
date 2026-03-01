package org.meeting.service;

import org.meeting.pojo.Meetings;

import java.util.List;

public interface MeetingsService {
    List<Meetings> getAllMeetings(Integer id);

    Meetings getMeetingById(Integer meetingId);

    void addMeeting(Meetings meetings);

    void updateMeeting(Meetings meetings);

    void deleteMeeting(Integer meetingId);

    void updateStatus(Integer meetingId, Integer meetingStatus);

    void updateClickCount(Integer meetingId);

    List<Meetings> getMyMeetings(Integer meetingId);

    List<Meetings> getPublicMeetings(Integer sortType);
}
