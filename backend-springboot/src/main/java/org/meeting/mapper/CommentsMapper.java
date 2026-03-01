package org.meeting.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.meeting.pojo.Comments;

import java.util.List;

@Mapper
public interface CommentsMapper {
    @Insert("insert into comments ( topic_id, user_id, score,content, comment_time) values ( #{topicId}, #{userId},#{score}, #{content},NOW())")
    void add(Comments comments);

    @Delete("delete from comments where comment_id = #{commentId}")
    void delete(Integer commentId);

    @Select("SELECT " +
            "c.comment_id, " +
            "c.topic_id, " +
            "c.user_id, " +
            "u.user_name, " +
            "u.user_pic, " +
            "c.score, " +
            "c.content, " +
            "c.comment_time " +
            "FROM comments c " +
            "LEFT JOIN users u ON c.user_id = u.user_id " +
            "WHERE c.topic_id = #{topicId} " +
            "ORDER BY c.comment_time DESC")
    List<Comments> commentsList(Integer topicId);
}
