package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.OrganizationMember;
import org.meeting.pojo.Organizations;
import org.meeting.pojo.Result;
import org.meeting.service.OrganizationMemberService;
import org.meeting.service.OrganizationsService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/organizations")
@Tag(name = "组织", description = "组织相关接口")
public class OrganizationsController {
    // 自动注入OrganizationsService，用于处理组织相关的业务逻辑
    @Autowired
    private OrganizationsService organizationsService;
    // 自动注入OrganizationMemberService，用于处理组织成员相关的业务逻辑
    @Autowired
    private OrganizationMemberService organizationMemberService;

    // 处理POST请求，用于添加新的组织
    @PostMapping("/add")
    @Operation(summary = "创建组织")
    public Result add(@RequestBody Organizations organizations) {
        // 调用服务层的add方法，将新的组织信息保存到数据库
        organizationsService.add(organizations);
        Map<String, Object> resultData = new HashMap<>();
        resultData.put("organizationId", organizations.getOrganizationId());
        // 返回成功的结果
        return Result.success(resultData);
    }

    // 处理POST请求，用于更新现有组织的详细信息
    @PostMapping("/update")
    @Operation(summary = "更新组织相关信息")
    public Result update(@RequestBody Organizations organizations) {
        // 调用服务层的update方法，更新组织信息
        organizationsService.update(organizations);
        // 返回成功的结果
        return Result.success();
    }

    // 处理DELETE请求，用于删除指定ID的组织
    @DeleteMapping("/delete")
    @Operation(summary = "删除组织")
    public Result delete(Integer organizationId) {
        // 调用服务层的delete方法，根据组织ID删除组织
        organizationsService.delete(organizationId);
        // 返回成功的结果
        return Result.success();
    }

    // 处理GET请求，用于获取当前用户所属的所有组织
    @GetMapping("/myOrganizations")
    @Operation(summary = "获取用户参加的组织")
    public Result<List<Organizations>> findById() {
        // 从ThreadLocal中获取当前用户的信息
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        // 查询用户所属的所有组织成员记录
        List<OrganizationMember> organizationMembers = organizationMemberService.findByUserId(userId);
        List<Organizations> organizationsList = new ArrayList<>();
        for (OrganizationMember member : organizationMembers) {
            Integer organizationId = member.getOrganizationId();
            organizationsList.addAll(organizationsService.findById(organizationId));
        }
        return Result.success(organizationsList);
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有组织")
    public Result<List<Organizations>> findAll() {
        return Result.success(organizationsService.findAll());
    }
}
