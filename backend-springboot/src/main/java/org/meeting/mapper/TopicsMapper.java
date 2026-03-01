package org.meeting.mapper;

import org.apache.ibatis.annotations.*;
import org.meeting.pojo.Meetings;
import org.meeting.pojo.Topics;

import java.util.List;

@Mapper
public interface TopicsMapper {
    @Insert("insert into topics(meeting_id,topic_name, content, start_time, end_time,speaker) values(#{meetingId},#{topicName}, #{content}, #{startTime}, #{endTime},#{speaker})")
    void addTopic(Topics topics);

    @Select("select * from topics where meeting_id = #{meetingId}")
    List<Topics> getTopicsByMeetingId(Integer meetingId);

    @Delete("delete from topics where topic_id = #{topicId}")
    void deleteTopic(Integer topicId);

    @Update("update topics set topic_name = #{topicName}, content = #{content}, start_time = #{startTime}, end_time = #{endTime}, speaker = #{speaker} where topic_id = #{topicId}")
    void updateTopic(Topics topics);

    @Update("UPDATE topics SET click_count = click_count + 1 where topic_id = #{topicId}")
    void updateClickCount(Integer topicId);

    @Select("select * from topics where topic_id = #{topicId}")
    Topics getTopicById(Integer topicId);

    @Select("select * from topics where meeting_id = #{meetingId} order by click_count desc")
    List<Topics> topicHot(Integer meetingId);

    @Select("<script>" +
            "SELECT *, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN topic_name LIKE CONCAT('%', #{keyword}, '%') THEN 3 ELSE 0 END + " + // topic_name 匹配得 3 分
            "   CASE WHEN content LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " + // content 匹配得 1 分
            "</foreach>) AS total_score, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN topic_name LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "</foreach>) AS topic_matches, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN content LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "</foreach>) AS content_matches " +
            "FROM meeting.topics " +
            "WHERE meeting_id = #{meetingId} " +
            "AND (" +
            "   <foreach collection='interests' item='keyword' separator=' OR '>" +
            "       topic_name LIKE CONCAT('%', #{keyword}, '%') " +
            "       OR content LIKE CONCAT('%', #{keyword}, '%')" +
            "   </foreach>" +
            ") " +
            "ORDER BY total_score DESC, " +      // 按总分降序
            "         topic_matches DESC, " +    // topic_name 匹配数优先
            "         content_matches DESC, " +  // content 匹配数次之
            "         start_time DESC" +         // 最后按 start_time 降序
            "</script>")
    List<Topics> topicInterest(@Param("meetingId") Integer meetingId, @Param("interests") List<String> interests);

    @Select("SELECT " +
            "t.topic_id, " +
            "t.meeting_id, " +
            "t.start_time, " +
            "t.end_time, " +
            "t.topic_name, " +
            "t.content, " +
            "t.speaker, " +
            "t.click_count, " +
            "COALESCE(AVG(c.score), 0) AS totalScore " +
            "FROM meeting.topics t " +
            "LEFT JOIN comments c ON t.topic_id = c.topic_id " +
            "WHERE t.meeting_id = #{meetingId} " +
            "GROUP BY t.topic_id " +
            "HAVING COUNT(c.comment_id) > 0 " +
            "ORDER BY totalScore DESC")
    List<Topics> topicSortByScore(@Param("meetingId") Integer meetingId);

    @Select("<script>" +
            "SELECT " +
            "    t.*, " +
            "    m.meeting_name, " +
            "    (<foreach collection='interests' item='keyword' separator=' + '>" +
            "        CASE WHEN t.topic_name LIKE CONCAT('%', #{keyword}, '%') THEN 3 ELSE 0 END + " +
            "        CASE WHEN t.content LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "    </foreach>) AS total_score, " +
            "    (<foreach collection='interests' item='keyword' separator=' + '>" +
            "        CASE WHEN t.topic_name LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "    </foreach>) AS topic_matches, " +
            "    (<foreach collection='interests' item='keyword' separator=' + '>" +
            "        CASE WHEN t.content LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "    </foreach>) AS content_matches " +
            "FROM " +
            "    meeting.topics t " +
            "JOIN " +
            "    meeting.meetings m ON t.meeting_id = m.meeting_id " +
            "WHERE " +
            "    t.meeting_id IN " +
            "    (<foreach collection='meetings' item='meeting' separator=','>" +
            "        #{meeting.meetingId} " +
            "    </foreach>) " +
            "    AND (" +
            "        <foreach collection='interests' item='keyword' separator=' OR '>" +
            "            t.topic_name LIKE CONCAT('%', #{keyword}, '%') " +
            "            OR t.content LIKE CONCAT('%', #{keyword}, '%') " +
            "        </foreach> " +
            "    ) " +
            "ORDER BY " +
            "    total_score DESC, " +      // 按总分降序
            "    topic_matches DESC, " +    // topic_name 匹配数优先
            "    content_matches DESC, " +  // content 匹配数次之
            "    t.start_time DESC" +       // 最后按 start_time 降序
            "</script>")
    List<Topics> publicTopicInterest(
            @Param("meetings") List<Meetings> meetings,
            @Param("interests") List<String> interests);
}
