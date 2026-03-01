package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comments {
    @NotNull
    private Integer commentId;
    private Integer topicId;
    private Integer userId;
    private String userName;
    private String userPic;
    private Integer score;
    private String content;
    private Date commentTime;
}
