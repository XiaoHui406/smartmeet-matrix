package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.MeetingsMapper;
import org.meeting.mapper.UserMapper;
import org.meeting.pojo.Meetings;
import org.meeting.pojo.Users;
import org.meeting.service.MeetingsService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service

public class MeetingsServiceImpl implements MeetingsService {
    @Autowired
    private MeetingsMapper meetingsMapper;
    @Autowired
    private UserMapper usermapper;

    @Override
    public List<Meetings> getAllMeetings(Integer id) {
        return meetingsMapper.getAllMeetings(id);
    }

    @Override
    public Meetings getMeetingById(Integer meetingId) {
        return meetingsMapper.getMeetingById(meetingId);
    }

    @Override
    public void addMeeting(Meetings meetings) {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer Id = (Integer) map.get("id");
        meetings.setOrganizerId(Id);
        meetingsMapper.addMeeting(meetings);
    }

    @Override
    public void updateMeeting(Meetings meetings) {
        meetingsMapper.updateMeeting(meetings);
    }

    @Override
    public void deleteMeeting(Integer meetingId) {
        meetingsMapper.deleteMeeting(meetingId);
    }

    @Override
    public void updateStatus(Integer meetingId, Integer meetingStatus) {
        meetingsMapper.updateStatus(meetingId, meetingStatus);
    }

    @Override
    public void updateClickCount(Integer meetingId) {
        meetingsMapper.updateClickCount(meetingId);
    }

    @Override
    public List<Meetings> getMyMeetings(Integer meetingId) {
        return meetingsMapper.getMyMeetings(meetingId);
    }

    @Override
    public List<Meetings> getPublicMeetings(Integer sortType) {
        if (sortType == 3) {
            Map<String, Object> map = ThreadLocalUtil.get();
            Integer userId = (Integer) map.get("id");
            Users user = usermapper.findById(userId);
            if (user.getInterest() == null || user.getInterest().isEmpty()) {
                return Collections.emptyList();
            }
            List<String> interests = Arrays.stream(user.getInterest().split("\\s+"))
                    .distinct()
                    .collect(Collectors.toList());
            return meetingsMapper.getPublicMeetingsByInterest(interests);
        } else if (sortType == 4) {
            return meetingsMapper.getPublicMeetingsByAttendees();
        } else if (sortType == 5) {
            return meetingsMapper.getMeetingsOrderByWeightScore();
        } else {
            return meetingsMapper.getPublicMeetings(sortType);
        }
    }
}
