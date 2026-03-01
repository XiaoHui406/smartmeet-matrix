package org.meeting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.Result;
import org.meeting.pojo.Topics;
import org.meeting.service.TopicsService;

import java.util.List;

@RestController
@RequestMapping("/topics")
public class TopicsController {
    @Autowired
    private TopicsService topicsService;

    @PostMapping("/add")
    public Result addTopic(@RequestBody Topics topics) {
        topicsService.addTopic(topics);
        return Result.success();
    }

    @DeleteMapping("/delete")
    public Result deleteTopic(Integer topicId) {
        topicsService.deleteTopic(topicId);
        return Result.success();
    }

    @PostMapping("/update")
    public Result updateTopic(@RequestBody Topics topics) {
        topicsService.updateTopic(topics);
        return Result.success();
    }

    @PostMapping("/updateClickCount")
    public Result updateClickCount(Integer topicId) {
        topicsService.updateClickCount(topicId);
        return Result.success();
    }

    @GetMapping("/getTopics")
    public Result<List<Topics>> getTopics(Integer meetingId) {
        List<Topics> topics = topicsService.getTopics(meetingId);
        return Result.success(topics);
    }

    @GetMapping("/detail")
    public Result<Topics> getTopic(Integer topicId) {
        Topics topic = topicsService.getTopic(topicId);
        return Result.success(topic);
    }

    @GetMapping("/topicSort")
    public Result<List<Topics>> topicSort(Integer meetingId, Integer sortType) {
        List<Topics> topics = topicsService.topicSort(meetingId, sortType);//1:热度(点击量)排序 2:兴趣（个性化推荐）排序 3:评分排序
        return Result.success(topics);
    }

    @GetMapping("/topicInterest")
    public Result<List<Topics>> topicInterest() {
        List<Topics> topics = topicsService.topicInterest();//个性化推荐
        return Result.success(topics);
    }
}
