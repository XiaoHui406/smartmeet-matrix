package org.meeting.service;

import org.meeting.pojo.Topics;

import java.util.List;

public interface TopicsService {
    void addTopic(Topics topics);

    void deleteTopic(Integer topicId);

    void updateTopic(Topics topics);

    void updateClickCount(Integer topicId);

    List<Topics> getTopics(Integer meetingId);

    Topics getTopic(Integer topicId);

    List<Topics> topicSort(Integer meetingId, Integer sortType);

    List<Topics> topicInterest();
}
