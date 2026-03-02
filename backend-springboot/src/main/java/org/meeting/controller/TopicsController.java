package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.Result;
import org.meeting.pojo.Topics;
import org.meeting.service.TopicsService;

import java.util.List;

@RestController
@RequestMapping("/topics")
@Tag(name = "议题", description = "议题相关接口")
public class TopicsController {
    @Autowired
    private TopicsService topicsService;

    @PostMapping("/add")
    @Operation(summary = "添加议题")
    public Result addTopic(@RequestBody Topics topics) {
        topicsService.addTopic(topics);
        return Result.success();
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除议题")
    public Result deleteTopic(Integer topicId) {
        topicsService.deleteTopic(topicId);
        return Result.success();
    }

    @PostMapping("/update")
    @Operation(summary = "更新议题")
    public Result updateTopic(@RequestBody Topics topics) {
        topicsService.updateTopic(topics);
        return Result.success();
    }

    @PostMapping("/updateClickCount")
    @Operation(summary = "更新议题点击次数(+1)")
    public Result updateClickCount(Integer topicId) {
        topicsService.updateClickCount(topicId);
        return Result.success();
    }

    @GetMapping("/getTopics")
    @Operation(summary = "获取会议议题")
    public Result<List<Topics>> getTopics(Integer meetingId) {
        List<Topics> topics = topicsService.getTopics(meetingId);
        return Result.success(topics);
    }

    @GetMapping("/detail")
    @Operation(summary = "获取议题详情")
    public Result<Topics> getTopic(Integer topicId) {
        Topics topic = topicsService.getTopic(topicId);
        return Result.success(topic);
    }

    @GetMapping("/topicSort")
    @Operation(summary = "获取议题排行榜")
    public Result<List<Topics>> topicSort(Integer meetingId, Integer sortType) {
        List<Topics> topics = topicsService.topicSort(meetingId, sortType);//1:热度(点击量)排序 2:兴趣（个性化推荐）排序 3:评分排序
        return Result.success(topics);
    }

    @GetMapping("/topicInterest")
    @Operation(summary = "议题个性化推荐")
    public Result<List<Topics>> topicInterest() {
        List<Topics> topics = topicsService.topicInterest();//个性化推荐
        return Result.success(topics);
    }
}
