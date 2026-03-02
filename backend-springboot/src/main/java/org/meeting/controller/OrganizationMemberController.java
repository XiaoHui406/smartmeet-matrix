package org.meeting.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.meeting.pojo.OrganizationMember;
import org.meeting.pojo.Result;
import org.meeting.pojo.Users;
import org.meeting.service.OrganizationMemberService;
import org.meeting.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/organizationMember")
@Tag(name = "组织成员", description = "组织成员相关接口")
public class OrganizationMemberController {
    // 自动注入OrganizationMemberService，用于处理组织成员相关的业务逻辑
    @Autowired
    private OrganizationMemberService organizationMemberService;
    // 自动注入UserService，用于处理用户相关的业务逻辑
    @Autowired
    private UserService userService;

    // 处理POST请求，根据组织ID查找组织成员
    @PostMapping("/findById")
    @Operation(summary = "根据组织ID查找组织成员")
    public Result<List<OrganizationMember>> findById(Integer organizationId) {
        // 调用 service 层方法，根据组织 ID 查找所有成员
        List<OrganizationMember> members = organizationMemberService.findAllByOrganizationId(organizationId);
        // 将结果封装到 Result 对象中并返回
        return Result.success(members);
    }

    // 处理POST请求，添加组织成员
    @PostMapping("/add")
    @Operation(summary = "添加组织成员")
    public Result add(Integer organizationId, String account) {
        // 调用userService的findByAccount方法，根据账号查找用户
        Users u = userService.findByAccount(account);
        // 如果用户不存在，返回错误信息
        if (u == null) {
            return Result.error("该手机号未注册");
        }
        // 获取用户的ID
        Integer userId = u.getUserId();
        // 调用organizationMemberService的add方法，添加组织成员
        organizationMemberService.add(organizationId, userId);
        // 返回成功信息
        return Result.success();
    }

    // 处理DELETE请求，删除组织成员
    @DeleteMapping("/delete")
    @Operation(summary = "删除组织成员")
    public Result delete(Integer relationId) {
        // 调用organizationMemberService的delete方法，删除组织成员
        organizationMemberService.delete(relationId);
        // 返回成功信息
        return Result.success();
    }
}
