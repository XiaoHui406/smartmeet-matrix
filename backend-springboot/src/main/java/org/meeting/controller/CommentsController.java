package org.meeting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.meeting.pojo.Comments;
import org.meeting.pojo.Result;
import org.meeting.service.CommentsService;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentsController {
    @Autowired
    private CommentsService commentsService;

    @PostMapping("/add")
    public Result add(@RequestBody Comments comments) {
        commentsService.add(comments);
        return Result.success();
    }

    @DeleteMapping("/delete")
    public Result delete(Integer commentId) {
        commentsService.delete(commentId);
        return Result.success();
    }

    @PostMapping("/commentsList")
    public Result<List<Comments>> commentList(Integer topicId) {
        List<Comments> commentsList = commentsService.commentsList(topicId);
        return Result.success(commentsList);
    }
}
