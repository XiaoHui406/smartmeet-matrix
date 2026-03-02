package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.meeting.pojo.Result;
import org.meeting.utils.AliOssUtil;

import java.util.UUID;

@RestController
@Tag(name = "文件上传", description = "文件上传相关接口")
public class FileUploadController {
    @PostMapping("/upload")
    @Operation(summary = "上传文件")
    public Result<String> upload(MultipartFile file) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String filename = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));
        String url = AliOssUtil.uploadFile(filename, file.getInputStream());
        return Result.success(url);
    }
}
