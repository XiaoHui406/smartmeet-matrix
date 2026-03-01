package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Messages {
    @NotNull
    private Integer messageId;
    // 接收用户id，非空，对应用户表的user_id
    private Integer userId;
    // 消息内容，非空
    private String messageContent;
    // 消息标题，非空
    private String messageTitle;
    // 发送方id，非空，对应用户表的user_id
    private Integer senderId;
    // 发送时间，非空
    private Date sendTime;
    // 是否已读，非空，默认为0，0表示未读，1表示已读
    private Integer isRead;
}