package org.meeting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.AttendMeeting;
import org.meeting.pojo.Meetings;
import org.meeting.pojo.Result;
import org.meeting.service.AttendMeetingService;
import org.meeting.service.MeetingsService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/meeting")
public class MeetingsController {
    // 自动注入MeetingsService，用于处理会议相关的业务逻辑
    @Autowired
    private MeetingsService meetingsService;
    // 自动注入AttendMeetingService，用于处理用户参加会议相关的业务逻辑
    @Autowired
    private AttendMeetingService attendMeetingService;

    // 处理GET请求，路径为"/all"，用于获取所有会议信息
    @GetMapping("/all")
    public Result<List<Meetings>> getAllMeetings() {
        // 从ThreadLocal中获取当前线程的用户信息
        Map<String, Object> map = ThreadLocalUtil.get();
        // 获取用户ID
        Integer Id = (Integer) map.get("id");
        // 调用服务层方法获取所有会议信息
        List<Meetings> meetings = meetingsService.getAllMeetings(Id);
        // 返回成功结果，包含会议列表
        return Result.success(meetings);
    }

    // 处理POST请求，路径为"/detail"，用于根据会议ID获取会议详细信息
    @PostMapping("/detail")
    public Result<Meetings> getMeetingById(Integer meetingId) {
        // 调用服务层方法根据会议ID获取会议信息
        Meetings meetings = meetingsService.getMeetingById(meetingId);
        // 如果会议不存在，返回错误信息
        if (meetings == null) {
            return Result.error("会议不存在");
        }
        // 返回成功结果，包含会议信息
        return Result.success(meetings);
    }

    // 处理POST请求，路径为"/add"，用于添加新的会议
    @PostMapping("/add")
    public Result addMeeting(@RequestBody Meetings meetings) {
        // 调用服务层方法添加会议
        meetingsService.addMeeting(meetings);
        // 返回成功结果
        Map<String, Object> resultData = new HashMap<>();
        resultData.put("meetingId", meetings.getMeetingId());
        return Result.success(resultData);
    }

    // 处理PUT请求，路径为"/update"，用于更新会议信息
    @PutMapping("/update")
    public Result updateMeeting(@RequestBody Meetings meetings) {
        // 调用服务层方法更新会议信息
        meetingsService.updateMeeting(meetings);
        // 返回成功结果
        return Result.success();
    }

    // 处理DELETE请求，路径为"/delete"，用于删除会议
    @DeleteMapping("/delete")
    public Result deleteMeeting(Integer meetingId) {
        // 调用服务层方法删除会议
        meetingsService.deleteMeeting(meetingId);
        // 返回成功结果
        return Result.success();
    }

    // 处理PUT请求，路径为"/updateStatus"，用于更新会议状态
    @PutMapping("/updateStatus")
    public Result updateStatus(Integer meetingId, Integer meetingStatus) {
        // 调用服务层方法更新会议状态
        meetingsService.updateStatus(meetingId, meetingStatus);
        // 返回成功结果
        return Result.success();
    }

    // 处理PUT请求，路径为"/updateClickCount"，用于更新会议点击次数
    @PutMapping("/updateClickCount")
    public Result updateClickCount(Integer meetingId) {
        // 调用服务层方法更新会议点击次数
        meetingsService.updateClickCount(meetingId);
        // 返回成功结果
        return Result.success();
    }

    // 处理GET请求，路径为"/getMyMeetings"，用于获取用户参加的所有会议
    @GetMapping("/getMyMeetings")
    public Result<List<Meetings>> getMyMeetings() {
        // 从ThreadLocal中获取当前线程的用户信息
        Map<String, Object> map = ThreadLocalUtil.get();
        // 获取用户ID
        Integer userId = (Integer) map.get("id");
        // 查询用户参加的所有会议记录
        List<AttendMeeting> attendMeetings = attendMeetingService.findByUserId(userId);
        // 初始化会议列表
        List<Meetings> meetings = new ArrayList<>();
        // 遍历用户参加的会议记录，获取会议信息并添加到列表中
        for (AttendMeeting attendMeeting : attendMeetings) {
            Integer meetingId = attendMeeting.getMeetingId();
            meetings.addAll(meetingsService.getMyMeetings(meetingId));
        }
        // 返回成功结果，包含会议列表
        return Result.success(meetings);
    }

    @GetMapping("/getPublicMeetings")
    public Result<List<Meetings>> getPublicMeetings(@RequestParam(required = false, defaultValue = "0") Integer sortType) {
        //sortType为0时或者为空时，按照数据库里排序默认输出，为1时按照click_count降序，为2时按照start_time升序，为3的时候为个性化推荐会议列表，为4的时候按照参会人数降序，为5的时候按照点击次数和参会人数综合排序。
        List<Meetings> meetings = meetingsService.getPublicMeetings(sortType);
        return Result.success(meetings);
    }
}
