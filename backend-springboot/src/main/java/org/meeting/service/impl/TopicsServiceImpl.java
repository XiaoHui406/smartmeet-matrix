package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.MeetingsMapper;
import org.meeting.mapper.TopicsMapper;
import org.meeting.mapper.UserMapper;
import org.meeting.pojo.Meetings;
import org.meeting.pojo.Topics;
import org.meeting.pojo.Users;
import org.meeting.service.TopicsService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TopicsServiceImpl implements TopicsService {
    @Autowired
    private TopicsMapper topicsMapper;
    @Autowired
    private UserMapper usermapper;
    @Autowired
    private MeetingsMapper meetingsMapper;

    @Override
    public void addTopic(Topics topics) {
        topicsMapper.addTopic(topics);
    }

    @Override
    public void deleteTopic(Integer topicId) {
        topicsMapper.deleteTopic(topicId);
    }

    @Override
    public void updateTopic(Topics topics) {
        topicsMapper.updateTopic(topics);
    }

    @Override
    public void updateClickCount(Integer topicId) {
        topicsMapper.updateClickCount(topicId);
    }

    @Override
    public List<Topics> getTopics(Integer meetingId) {
        return topicsMapper.getTopicsByMeetingId(meetingId);
    }

    @Override
    public Topics getTopic(Integer topicId) {
        return topicsMapper.getTopicById(topicId);
    }

    @Override
    public List<Topics> topicSort(Integer meetingId, Integer sortType) {
        if (sortType == 1) {
            return topicsMapper.topicHot(meetingId);
        } else if (sortType == 2) {
            Map<String, Object> map = ThreadLocalUtil.get();
            Integer userId = (Integer) map.get("id");
            Users user = usermapper.findById(userId);
            if (user.getInterest() == null || user.getInterest().isEmpty()) {
                return Collections.emptyList();
            }
            List<String> interests = Arrays.stream(user.getInterest().split("\\s+"))
                    .distinct()
                    .collect(Collectors.toList());
            return topicsMapper.topicInterest(meetingId, interests);
        } else if (sortType == 3) {
            return topicsMapper.topicSortByScore(meetingId);
        } else {
            return topicsMapper.getTopicsByMeetingId(meetingId);
        }
    }

    @Override
    public List<Topics> topicInterest() {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        Users user = usermapper.findById(userId);
        if (user.getInterest() == null || user.getInterest().isEmpty()) {
            return Collections.emptyList();
        }
        List<String> interests = Arrays.stream(user.getInterest().split("\\s+"))
                .distinct()
                .collect(Collectors.toList());
        List<Meetings> meetings = meetingsMapper.getPublicMeetings(0);
        return topicsMapper.publicTopicInterest(meetings, interests);
    }
}
