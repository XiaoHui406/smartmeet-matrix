package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendMeeting {
    @NotNull
    private Integer attendId;
    // 用户id，非空，对应用户表的user_id
    private Integer userId;
    // 会议id，非空，对应会议表的meeting_id
    private Integer meetingId;
    // 签到状态，非空，1.会议未设置签到，2.未签到，3.已签到
    private Integer attendanceStatus;
    // 入会时间，为空则表示该用户未加入会议
    private Date attendTime;
    // 离会时间，为空则表示该用户未加入会议
    private Date leaveTime;
    // 缺席原因，未缺席则为空
    private String absentReason;
}