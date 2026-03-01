package org.meeting.controller;

import org.json.JSONException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.meeting.pojo.Result;
import org.meeting.utils.ThreadLocalUtil;
import org.meeting.utils.TokenServerAssistant;

import java.util.Map;

@RestController
@RequestMapping("/token")
public class TokenController {
    @PostMapping("/generate")
    public Result<String> generateToken() throws JSONException {
        long appId = 0; // 替换为你的 appId
        String serverSecret = ""; // 替换为你的 serverSecret
        int effectiveTimeInSeconds = 300; // 有效时间，单位：秒
        String payload = "{\"payload\":\"payload\"}";
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer Id = (Integer) map.get("id");
        TokenServerAssistant.TokenInfo tokenInfo = TokenServerAssistant.generateToken04(appId, String.valueOf(Id), serverSecret, effectiveTimeInSeconds, payload);

        if (tokenInfo.error.code == TokenServerAssistant.ErrorCode.SUCCESS) {
            System.out.println("生成的 Token 为: " + tokenInfo.data);
            return Result.success(tokenInfo.data);
        } else {
            throw new RuntimeException("生成 Token 失败: " + tokenInfo.error.message);
        }
    }
}

