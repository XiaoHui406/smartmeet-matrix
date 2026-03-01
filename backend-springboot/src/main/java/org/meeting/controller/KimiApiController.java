package org.meeting.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.meeting.pojo.Result;
import org.meeting.utils.KimiApiUtil;

@RestController
public class KimiApiController {
    private static final String API_KEY = "";
    private static final String MODEL = "moonshot-v1-8k";
    private static final String SYSTEM_MESSAGE = "你是智会矩阵的智能会议助手，为西湖论剑提供会议支持，你更擅长总结会议纪要，" +
            "如果用户为你提供了关于会议有关的信息，你需要从中总结最重要的信息，来提醒用户，不要单纯把会议信息复制粘贴一遍，这样是没有意义的，" +
            "回答的信息一定要精炼！精炼！再精炼，让用户用最少的时间能够最快速了解到会议的信息，同时你要注意会议信息的主次，把会议信息重要的信息优先输出，同时你要能够处理会议中语音转文字的内容，" +
            "要正确纠错出现错误的地方，因为转文字的准确率不是100%，所以你要能够处理这些错误，能够处理会议中出现的各种问题，" +
            "包括但不限于：会议议程、会议内容、会议纪要、会议总结、会议问题、会议反馈";

    private static final double TEMPERATURE = 0.3;

    // 工具类实例
    private final KimiApiUtil kimiApiUtil = new KimiApiUtil(API_KEY);

    /**
     * 接收用户传入的内容并调用 Kimi API 获取回复
     *
     * @param content 用户传入的内容
     * @return AI 的回复或错误信息
     */
    @PostMapping("/getAiReply")
    public Result<String> getAiReply(String content) {
        // 检查 content 是否为空
        if (content == null || content.isEmpty()) {
            return Result.error("内容不能为空");
        }
        try {
            // 调用工具类获取 AI 回复
            String aiReply = kimiApiUtil.getCompletion(MODEL, SYSTEM_MESSAGE, content, TEMPERATURE);

            // 处理返回结果
            if (aiReply != null) {
                return Result.success(aiReply);
            } else {
                return Result.error("无法获取 AI 回复，请稍后再试");
            }
        } catch (Exception e) {
            // 捕获异常并返回错误信息
            return Result.error("获取 AI 回复时发生异常: " + e.getMessage());
        }
    }

    private static final String SYSTEM_MESSAGE2 = "你是智会矩阵的智能会议助手，为西湖论剑提供会议支持，" +
            "根据用户发来的数据，自动生成议程，要紧扣用户的会议信息，返回格式：" +
            "1.议题名：XXX 内容：XXX 开始时间：yyyy-MM-dd HH:mm:ss 结束时间：yyyy-MM-dd HH:mm:ss 主持人：XXX" +
            "2.议题名：XXX 内容：XXX 开始时间：yyyy-MM-dd HH:mm:ss 结束时间：yyyy-MM-dd HH:mm:ss 主持人：XXX...";

    @PostMapping("/getTopic")
    public Result<String> getTopic(String content) {
        // 检查 content 是否为空
        if (content == null || content.isEmpty()) {
            return Result.error("内容不能为空");
        }
        try {
            // 调用工具类获取 AI 回复
            String aiReply = kimiApiUtil.getCompletion(MODEL, SYSTEM_MESSAGE2, content, TEMPERATURE);
            // 处理返回结果
            if (aiReply != null) {
                return Result.success(aiReply);
            } else {
                return Result.error("无法获取 AI 回复，请稍后再试");
            }
        } catch (Exception e) {
            // 捕获异常并返回错误信息
            return Result.error("获取 AI 回复时发生异常: " + e.getMessage());
        }
    }
}
