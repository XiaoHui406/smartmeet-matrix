package org.meeting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.Comments;
import org.meeting.pojo.Result;
import org.meeting.service.CommentsService;

import java.util.List;

@RestController
@RequestMapping("/comments")
@Tag(name = "评论", description = "评论相关接口")
public class CommentsController {
    @Autowired
    private CommentsService commentsService;

    @PostMapping("/add")
    @Operation(summary = "添加评论")
    public Result add(@RequestBody Comments comments) {
        commentsService.add(comments);
        return Result.success();
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除评论")
    public Result delete(Integer commentId) {
        commentsService.delete(commentId);
        return Result.success();
    }

    @PostMapping("/commentsList")
    @Operation(summary = "获取议题评论列表")
    public Result<List<Comments>> commentList(Integer topicId) {
        List<Comments> commentsList = commentsService.commentsList(topicId);
        return Result.success(commentsList);
    }
}
