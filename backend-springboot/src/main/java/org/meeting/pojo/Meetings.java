package org.meeting.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Meetings {
    @NotNull
    private Integer meetingId;
    // 会议名称，非空
    private String meetingName;
    // 发起者id，非空，对应用户表的user_id
    private Integer organizerId;
    // 开始时间，非空
    private Date startTime;
    // 结束时间，非空
    private Date endTime;
    // 会议状态，非空，1.未开始，2.进行中，3.已结束
    private Integer meetingStatus;
    // 最大人数，为空则为无限制
    private Integer maxNumber;
    // 会议类型，非空，1.线上，2.线下，3.线上和线下
    private Integer meetingType;
    // 会议地点，非空，线上会议则该字段的值为“线上会议”
    private String meetingLocation;
    // 会场规则
    private String rule;
    // 餐饮服务
    private String diningService;
    // 会议主题，非空
    private String theme;
    // 会议议程，非空
    private String agenda;
    // 大致内容，非空
    private String generalContent;
    // 主要参会人员，非空，主持、嘉宾等
    private String keyAttendees;
    // 会议布局，图片形式，存放会议布局图的路径
    private String layout;
    // 点击次数，初始为0，用于分析议题关注度
    private Integer clickCount;
    // 会议类别，非空，0.私密，1.公开
    private Integer isPublic;
    // 参会密码，当会议为公开时为空
    private String meetingPassword;
    @TableField(exist = false)
    private Integer attendeeCount;
    @TableField(exist = false)
    private Integer weightScore;  // 权重总分
}