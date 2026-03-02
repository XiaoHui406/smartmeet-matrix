package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.Messages;
import org.meeting.pojo.Result;
import org.meeting.service.MessagesService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
@Tag(name = "消息", description = "消息相关接口")
public class MessagesController {
    @Autowired
    private MessagesService messagesService;

    @GetMapping("/mySendMessages")
    @Operation(summary = "获取我发送的消息")
    public Result<List<Messages>> getMySendMessages() {
        // 从ThreadLocal中获取当前线程的用户信息
        Map<String, Object> map = ThreadLocalUtil.get();
        // 获取用户ID
        Integer Id = (Integer) map.get("id");
        List<Messages> messages = messagesService.getMySendMessages(Id);
        return Result.success(messages);
    }

    @GetMapping("/myReceiveMessages")
    @Operation(summary = "获取我接收的消息")
    public Result<List<Messages>> getMyReceiveMessages() {
        // 从ThreadLocal中获取当前线程的用户信息
        Map<String, Object> map = ThreadLocalUtil.get();
        // 获取用户ID
        Integer Id = (Integer) map.get("id");
        List<Messages> messages = messagesService.getMyReceiveMessages(Id);
        return Result.success(messages);
    }

    @PostMapping("/add")
    @Operation(summary = "添加消息")
    public Result addMessages(@RequestBody Messages messages) {
        // 调用服务层方法添加会议
        messagesService.addMessages(messages);
        // 返回成功结果
        return Result.success();
    }

    @DeleteMapping("/deleteMessages")
    @Operation(summary = "删除消息")
    public Result deleteMessages(@RequestParam Integer messageId) {
        messagesService.deleteMessages(messageId);
        return Result.success();
    }

    @PutMapping("/updateMessages")
    @Operation(summary = "更新消息")
    public Result updateMessages(@RequestBody Messages messages) {
        messagesService.updateMessages(messages);
        return Result.success();
    }

    @PostMapping("/isRead")
    @Operation(summary = "标记消息为已读")
    public Result isRead(Integer messageId) {
        messagesService.isRead(messageId);
        return Result.success();
    }
}
