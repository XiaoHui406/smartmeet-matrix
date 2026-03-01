package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeAttention {
    @NotNull
    private Integer themeId;
    // 议题名称，非空
    private String themeName;
    // 关注度，非空
    private Integer attenttion;
}