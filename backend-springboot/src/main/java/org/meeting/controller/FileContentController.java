package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.meeting.pojo.Result;
import org.meeting.utils.MultiFileReader;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@Tag(name = "文件内容读取", description = "文件内容读取相关接口")
public class FileContentController {

    private static final String APP_ID = "";
    private static final String API_KEY = "";
    private static final String SECRET_KEY = "";

    @PostMapping("/readByUrl")
    @Operation(summary = "根据URL读取文件内容")
    public Result<String> readContentByUrl(@RequestParam("url") String url) {
        if (url == null || url.isEmpty()) {
            return Result.error("URL 不能为空");
        }

        if (!isValidUrl(url)) {
            return Result.error("URL 无效，请检查 URL 格式或网络连接");
        }

        try {
            String content = MultiFileReader.readFileFromUrl(url, APP_ID, API_KEY, SECRET_KEY);
            if (content != null) {
                return Result.success(content);
            } else {
                return Result.error("无法读取文件内容，请检查 URL 是否有效或文件格式是否支持");
            }
        } catch (Exception e) {
            return Result.error("读取文件时发生异常: " + e.getMessage());
        }
    }

    private boolean isValidUrl(String url) {
        try {
            URL urlObj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) urlObj.openConnection();
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.setRequestMethod("HEAD");
            int responseCode = connection.getResponseCode();
            return responseCode == HttpURLConnection.HTTP_OK;
        } catch (IOException e) {
            return false;
        }
    }
}
