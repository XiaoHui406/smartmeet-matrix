package org.meeting.controller;

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
public class MeetingMaterialsController {
    @Autowired
    private MeetingMaterialsService meetingMaterialsService;
    @Autowired
    private AttendMeetingService attendMeetingService;

    @GetMapping("/findById")
    public Result<List<MeetingMaterials>> getAllMeetingMaterials(Integer meetingId) {
        List<MeetingMaterials> meetingMaterials = meetingMaterialsService.getAllMeetingMaterials(meetingId);
        return Result.success(meetingMaterials);
    }

    @PostMapping("/add")
    public Result addMeetingMaterials(@RequestBody MeetingMaterials meetingMaterials) {
        meetingMaterialsService.addMeetingMaterials(meetingMaterials);
        return Result.success();
    }

    @DeleteMapping("/delete")
    public Result deleteMeetingMaterials(Integer materialId) {
        meetingMaterialsService.deleteMeetingMaterials(materialId);
        return Result.success();
    }

    @GetMapping("/myMaterials")
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
