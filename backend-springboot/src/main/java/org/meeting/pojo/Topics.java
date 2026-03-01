package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Topics {
    @NotNull
    private Integer topicId;
    private Integer meetingId;
    private String meetingName;
    private Date startTime;
    private Date endTime;
    private String topicName;
    private String content;
    private String speaker;
    private Integer clickCount;
    private Double totalScore;
}