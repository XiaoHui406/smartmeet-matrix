package org.meeting.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @NotNull
    private Integer userId;
    // 用户名，非空
    private String username;
    // 用户账号，长度固定为 11 位
    private String account;
    @JsonIgnore
    // 用户密码
    private String password;
    // 用户邮箱
    private String email;
    // 用户兴趣
    private String interest;
    private String userPic;//用户头像地址
}
