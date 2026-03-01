package org.meeting.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.meeting.pojo.Result;
import org.meeting.utils.MultiFileReader;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class FileContentController {

    // 百度 OCR API 凭证（写死在代码中）
    private static final String APP_ID = "";
    private static final String API_KEY = "";
    private static final String SECRET_KEY = "";

    /**
     * 根据 URL 读取文件内容（支持图片识别）
     *
     * @param url 文件的 URL 地址
     * @return 文件内容或错误信息
     */
    @PostMapping("/readByUrl")
    public Result<String> readContentByUrl(@RequestParam("url") String url) {

        // 检查 URL 是否为空
        if (url == null || url.isEmpty()) {
            return Result.error("URL 不能为空");
        }

        // 验证 URL 是否有效
        if (!isValidUrl(url)) {
            return Result.error("URL 无效，请检查 URL 格式或网络连接");
        }

        try {
            // 调用工具类读取文件内容
            String content = MultiFileReader.readFileFromUrl(url, APP_ID, API_KEY, SECRET_KEY);

            // 处理返回结果
            if (content != null) {
                return Result.success(content);
            } else {
                return Result.error("无法读取文件内容，请检查 URL 是否有效或文件格式是否支持");
            }
        } catch (Exception e) {
            // 捕获异常并返回错误信息
            return Result.error("读取文件时发生异常: " + e.getMessage());
        }
    }

    /**
     * 验证 URL 是否有效
     *
     * @param url 要验证的 URL
     * @return URL 是否有效
     */
    private boolean isValidUrl(String url) {
        try {
            URL urlObj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) urlObj.openConnection();
            connection.setConnectTimeout(5000); // 设置连接超时时间
            connection.setReadTimeout(5000);    // 设置读取超时时间
            connection.setRequestMethod("HEAD"); // 使用 HEAD 请求，只获取响应头
            int responseCode = connection.getResponseCode();
            return responseCode == HttpURLConnection.HTTP_OK; // 检查响应码是否为 200
        } catch (IOException e) {
            return false; // 如果发生异常，URL 无效
        }
    }
}