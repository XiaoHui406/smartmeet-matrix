package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeetingMaterials {
    @NotNull
    private Integer materialId;
    // 会议id，非空，对应会议表的meeting_id
    private Integer meetingId;
    // 资料名称，非空
    private String materialName;
    // 资料路径，通过路径访问服务端的文件，并进行浏览或下载
    private String materialPath;
    // 资料编号，非空，用于保存恒脑大模型上传文件返回的文件编号
    private String materialCode;
    // 资料类型，非空
    private String materialType;
}