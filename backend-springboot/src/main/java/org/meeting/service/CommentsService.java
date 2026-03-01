package org.meeting.service;

import org.meeting.pojo.Comments;

import java.util.List;

public interface CommentsService {
    void add(Comments comments);

    void delete(Integer commentId);

    List<Comments> commentsList(Integer topicId);
}
