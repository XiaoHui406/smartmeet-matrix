package org.meeting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.AttendMeeting;
import org.meeting.pojo.Result;
import org.meeting.service.AttendMeetingService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendMeeting")
public class AttendMeetingController {
    // 自动注入AttendMeetingService服务类
    @Autowired
    private AttendMeetingService attendMeetingService;

    // 处理POST请求，用于添加参会记录
    @PostMapping("/add")
    public Result add(AttendMeeting attendMeeting) {
        // 调用服务类的add方法添加参会记录
        attendMeetingService.add(attendMeeting);
        // 返回成功结果
        return Result.success();
    }

    // 处理POST请求，用于更新参会记录
    @PostMapping("/update")
    public Result update(AttendMeeting attendMeeting) {
        System.out.println("userId=" + attendMeeting.getUserId());
        System.out.println("meetingId=" + attendMeeting.getMeetingId());
        System.out.println("attendTime=" + attendMeeting.getAttendTime());
        System.out.println("leaveTime=" + attendMeeting.getLeaveTime());
        // 调用服务类的update方法更新参会记录
        attendMeetingService.update(attendMeeting);
        // 返回成功结果
        return Result.success();
    }

    // 处理DELETE请求，用于删除参会记录
    @DeleteMapping("/delete")
    public Result delete(Integer attendId) {
        // 调用服务类的delete方法删除参会记录
        attendMeetingService.delete(attendId);
        // 返回成功结果
        return Result.success();
    }

    // 处理GET请求，用于获取某个会议的参会记录
    @GetMapping("/userAttendMeeting")
    public Result<List<AttendMeeting>> attend(Integer meetingId) {
        // 调用服务类的attend方法获取参会记录
        List<AttendMeeting> attendMeeting = attendMeetingService.attend(meetingId);
        // 返回成功结果，包含参会记录列表
        return Result.success(attendMeeting);
    }

    // 处理GET请求，用于根据用户ID获取参会记录
    @GetMapping("/findByUserId")
    public Result<List<AttendMeeting>> findByUserId() {
        // 从ThreadLocal中获取当前用户的ID
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        // 调用服务类的findByUserId方法获取参会记录
        List<AttendMeeting> attendMeeting = attendMeetingService.findByUserId(userId);
        // 返回成功结果，包含参会记录列表
        return Result.success(attendMeeting);
    }

    @DeleteMapping("/deleteByMeetingId")
    public Result deleteByMeetingId(Integer meetingId) {
        attendMeetingService.deleteByMeetingId(meetingId);
        return Result.success();
    }
}
