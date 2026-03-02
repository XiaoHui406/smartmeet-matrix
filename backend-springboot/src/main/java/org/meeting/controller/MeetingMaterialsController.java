package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.AttendMeeting;
import org.meeting.pojo.MeetingMaterials;
import org.meeting.pojo.Result;
import org.meeting.service.AttendMeetingService;
import org.meeting.service.MeetingMaterialsService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/meetingMaterials")
@Tag(name = "会议资料", description = "会议资料相关接口")
public class MeetingMaterialsController {
    @Autowired
    private MeetingMaterialsService meetingMaterialsService;
    @Autowired
    private AttendMeetingService attendMeetingService;

    @GetMapping("/findById")
    @Operation(summary = "根据会议ID获取资料列表")
    public Result<List<MeetingMaterials>> getAllMeetingMaterials(Integer meetingId) {
        List<MeetingMaterials> meetingMaterials = meetingMaterialsService.getAllMeetingMaterials(meetingId);
        return Result.success(meetingMaterials);
    }

    @PostMapping("/add")
    @Operation(summary = "添加会议资料")
    public Result addMeetingMaterials(@RequestBody MeetingMaterials meetingMaterials) {
        meetingMaterialsService.addMeetingMaterials(meetingMaterials);
        return Result.success();
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除会议资料")
    public Result deleteMeetingMaterials(Integer materialId) {
        meetingMaterialsService.deleteMeetingMaterials(materialId);
        return Result.success();
    }

    @GetMapping("/myMaterials")
    @Operation(summary = "获取我的会议资料")
    public Result<List<MeetingMaterials>> getMyMaterials() {
        Map<String, Object> map = ThreadLocalUtil.get();
        // 获取用户ID
        Integer userId = (Integer) map.get("id");
        List<AttendMeeting> attendMeetings = attendMeetingService.findByUserId(userId);
        List<MeetingMaterials> materials = new ArrayList<>();
        // 遍历用户参加的会议记录，获取会议信息并添加到列表中
        for (AttendMeeting attendMeeting : attendMeetings) {
            Integer meetingId = attendMeeting.getMeetingId();
            materials.addAll(meetingMaterialsService.getAllMeetingMaterials(meetingId));
        }
        return Result.success(materials);
    }
}
