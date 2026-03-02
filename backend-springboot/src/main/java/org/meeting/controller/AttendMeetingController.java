package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "会议参与", description = "会议参与相关接口")
public class AttendMeetingController {
    @Autowired
    private AttendMeetingService attendMeetingService;

    @PostMapping("/add")
    @Operation(summary = "添加参会记录")
    public Result add(AttendMeeting attendMeeting) {
        attendMeetingService.add(attendMeeting);
        return Result.success();
    }

    @PostMapping("/update")
    @Operation(summary = "更新参会记录")
    public Result update(AttendMeeting attendMeeting) {
        attendMeetingService.update(attendMeeting);
        return Result.success();
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除参会记录")
    public Result delete(Integer attendId) {
        attendMeetingService.delete(attendId);
        return Result.success();
    }

    @GetMapping("/userAttendMeeting")
    @Operation(summary = "获取会议的参会记录")
    public Result<List<AttendMeeting>> attend(Integer meetingId) {
        List<AttendMeeting> attendMeeting = attendMeetingService.attend(meetingId);
        return Result.success(attendMeeting);
    }

    @GetMapping("/findByUserId")
    @Operation(summary = "获取我的参会记录")
    public Result<List<AttendMeeting>> findByUserId() {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        List<AttendMeeting> attendMeeting = attendMeetingService.findByUserId(userId);
        return Result.success(attendMeeting);
    }

    @DeleteMapping("/deleteByMeetingId")
    @Operation(summary = "根据会议ID删除参会记录")
    public Result deleteByMeetingId(Integer meetingId) {
        attendMeetingService.deleteByMeetingId(meetingId);
        return Result.success();
    }
}
