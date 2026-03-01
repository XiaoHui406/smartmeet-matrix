package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.CommentsMapper;
import org.meeting.pojo.Comments;
import org.meeting.service.CommentsService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.List;
import java.util.Map;

@Service
public class CommentsServiceImpl implements CommentsService {
    @Autowired
    private CommentsMapper commentsMapper;

    @Override
    public void add(Comments comments) {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        comments.setUserId(userId);
        commentsMapper.add(comments);
    }

    @Override
    public void delete(Integer commentId) {
        commentsMapper.delete(commentId);
    }

    @Override
    public List<Comments> commentsList(Integer topicId) {
        return commentsMapper.commentsList(topicId);
    }
}
