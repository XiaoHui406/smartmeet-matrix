package org.meeting.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationMember {
    @NotNull
    private Integer relationId;
    // 组织id，非空，对应组织表的organization_id
    private Integer organizationId;
    // 成员id，非空，对应用户表的user_id
    private Integer memberId;
    // 成员姓名
    private String memberName;
    // 成员电话
    private String memberPhone;
    private String userPic;
}
