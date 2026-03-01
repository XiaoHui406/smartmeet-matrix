package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.AttendMeetingMapper;
import org.meeting.pojo.AttendMeeting;
import org.meeting.service.AttendMeetingService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.List;
import java.util.Map;

@Service
public class AttendMeetingServiceImpl implements AttendMeetingService {
    @Autowired
    private AttendMeetingMapper attendMeetingMapper;

    @Override
    public void add(AttendMeeting attendMeeting) {
        attendMeetingMapper.add(attendMeeting);
    }

    @Override
    public void update(AttendMeeting attendMeeting) {
        attendMeetingMapper.update(attendMeeting);
    }

    @Override
    public void delete(Integer attendId) {
        attendMeetingMapper.delete(attendId);
    }

    @Override
    public List<AttendMeeting> attend(Integer meetingId) {
        return attendMeetingMapper.attend(meetingId);
    }

    @Override
    public List<AttendMeeting> findByUserId(Integer userId) {
        return attendMeetingMapper.findByUserId(userId);
    }

    @Override
    public void deleteByMeetingId(Integer meetingId) {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        attendMeetingMapper.deleteByMeetingId(meetingId, userId);
    }
}
