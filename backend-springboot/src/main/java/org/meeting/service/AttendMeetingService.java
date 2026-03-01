package org.meeting.service;

import org.meeting.pojo.AttendMeeting;

import java.util.List;

public interface AttendMeetingService {
    void add(AttendMeeting attendMeeting);

    void update(AttendMeeting attendMeeting);

    void delete(Integer attendId);

    List<AttendMeeting> attend(Integer meetingId);

    List<AttendMeeting> findByUserId(Integer userId);


    void deleteByMeetingId(Integer meetingId);
}
