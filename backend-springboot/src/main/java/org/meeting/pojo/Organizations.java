package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Organizations {
    @NotNull
    private Integer organizationId;
    // 组织名称，非空
    private String organizationName;
    // 组织介绍
    private String organizationDescribe;
}
