package org.meeting.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.Result;
import org.meeting.pojo.Users;
import org.meeting.service.UserService;
import org.meeting.utils.JwtUtil;
import org.meeting.utils.Md5Util;
import org.meeting.utils.ThreadLocalUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/user")
@Tag(name = "用户", description = "用户相关接口")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @PostMapping("/register")
    public Result register(@Pattern(regexp = "^\\S{11}$") String account, String password) {
        Users u = userService.findByAccount(account);
        if (u == null) {
            userService.register(account, password);
            return Result.success();
        } else {
            return Result.error("该手机号已被注册");
        }
    }

    @PostMapping("/login")
    public Result login(@Pattern(regexp = "^\\S{11}$") String account, String password) {
        Users loginUser = userService.findByAccount(account);
        if (loginUser == null) {
            return Result.error("该手机号未注册");
        }
        if (Md5Util.getMD5String(password).equals(loginUser.getPassword())) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", loginUser.getUserId());
            claims.put("name", loginUser.getUsername());
            claims.put("account", loginUser.getAccount());
            String token = JwtUtil.genToken(claims);
            ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
            operations.set(token, token, 24, TimeUnit.HOURS);
            return Result.success(token);
        }
        return Result.error("密码错误");
    }

    @GetMapping("/userInfo")
    public Result<Users> userInfo() {
        Map<String, Object> map = ThreadLocalUtil.get();
        String account = (String) map.get("account");
        Users user = userService.findByAccount(account);
        return Result.success(user);
    }

    @PutMapping("/update")
    public Result update(@Validated @RequestBody Users user) {
        userService.update(user);
        return Result.success();
    }

    @PatchMapping("updateAvatar")
    public Result updateAvatar(@RequestParam @URL String avatarUrl) {
        userService.updateAvatar(avatarUrl);
        return Result.success();
    }

    @PatchMapping("updatePwd")
    public Result updatePwd(@RequestBody Map<String, String> params, @RequestHeader("Authorization") String token) {
        String oldPwd = params.get("old_pwd");
        String newPwd = params.get("new_pwd");
        String rePwd = params.get("re_pwd");

        if (!StringUtils.hasLength(oldPwd) || !StringUtils.hasLength(newPwd) || !StringUtils.hasLength(rePwd)) {
            return Result.error("缺少必要的参数");
        }
        Map<String, Object> map = ThreadLocalUtil.get();
        String account = (String) map.get("account");
        Users loginUser = userService.findByAccount(account);
        if (!loginUser.getPassword().equals(Md5Util.getMD5String(oldPwd))) {
            return Result.error("原密码不正确");
        }
        if (!rePwd.equals(newPwd)) {
            return Result.error("两次填写的密码不同");
        }
        userService.updatePwd(newPwd);
        //删除对应的token
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        operations.getOperations().delete(token);
        return Result.success();
    }

    @PatchMapping("updateInterest")
    public Result updateInterest(String interest) {
        userService.updateInterest(interest);
        return Result.success();
    }

    @PostMapping("findById")
    public Result findById(Integer userId) {
        Users users = userService.findById(userId);
        return Result.success(users);
    }

    @PostMapping("/findByAccount")
    public Result findByAccount(String account) {
        Users users = userService.findByAccount(account);
        return Result.success(users);
    }
}
