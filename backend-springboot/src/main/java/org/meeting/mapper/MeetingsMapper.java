package org.meeting.mapper;

import org.apache.ibatis.annotations.*;
import org.meeting.pojo.Meetings;

import java.util.List;

@Mapper
public interface MeetingsMapper {
    @Select("select * from meeting.meetings where organizer_id=#{id}")
    List<Meetings> getAllMeetings(Integer id);

    @Select("select * from meeting.meetings where meeting_id=#{meetingId}")
    Meetings getMeetingById(Integer meetingId);

    @Insert("INSERT INTO meeting.meetings (meeting_name, organizer_id, start_time, end_time, meeting_status, max_number, meeting_type, meeting_location, rule, dining_service, theme, agenda, general_content, key_attendees, layout, is_public, meeting_password) " +
            "VALUES (#{meetingName}, #{organizerId}, #{startTime}, #{endTime}, #{meetingStatus}, #{maxNumber}, #{meetingType}, #{meetingLocation}, #{rule}, #{diningService}, #{theme}, #{agenda}, #{generalContent}, #{keyAttendees}, #{layout},  #{isPublic}, #{meetingPassword})")
    @Options(useGeneratedKeys = true, keyProperty = "meetingId")
        // 关键点：返回生成的主键
    void addMeeting(Meetings meeting);

    @Update("update meeting.meetings set meeting_name=#{meetingName},  start_time=#{startTime}, end_time=#{endTime}, meeting_status=#{meetingStatus}, max_number=#{maxNumber}, meeting_type=#{meetingType}, meeting_location=#{meetingLocation}, rule=#{rule}, dining_service=#{diningService}, theme=#{theme}, agenda=#{agenda}, general_content=#{generalContent}, key_attendees=#{keyAttendees}, layout=#{layout},  is_public=#{isPublic}, meeting_password=#{meetingPassword} where meeting_id=#{meetingId}")
    void updateMeeting(Meetings meetings);

    @Delete("delete from meeting.meetings where meeting_id=#{meetingId}")
    void deleteMeeting(Integer meetingId);

    @Update("update meeting.meetings set meeting_status=#{meetingStatus} where meeting_id=#{meetingId}")
    void updateStatus(Integer meetingId, Integer meetingStatus);

    @Update("update meeting.meetings set click_count=click_count+1 where meeting_id=#{meetingId}")
    void updateClickCount(Integer meetingId);

    @Select("select * from meeting.meetings where meeting_id=#{meetingId}")
    List<Meetings> getMyMeetings(Integer meetingId);

    @Select("<script>SELECT * FROM meeting.meetings WHERE is_public = 1 " +
            "<if test='sortType != null and sortType != 0'> " +
            "ORDER BY " +
            "<choose> " +
            "<when test='sortType == 1'>click_count DESC</when> " +
            "<when test='sortType == 2'>start_time</when> " +
            "<otherwise></otherwise> " +
            "</choose> " +
            "</if> " +
            "</script>")
    List<Meetings> getPublicMeetings(@Param("sortType") Integer sortType);

    @Select("<script>" +
            "SELECT *, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN theme LIKE CONCAT('%', #{keyword}, '%') THEN 3 ELSE 0 END + " + // 议题最高权重(3分/词)
            "   CASE WHEN meeting_name LIKE CONCAT('%', #{keyword}, '%') THEN 2 ELSE 0 END + " + // 名称次之(2分/词)
            "   CASE WHEN general_content LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " + // 内容最低(1分/词)
            "</foreach>) AS total_score, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN theme LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "</foreach>) AS theme_matches, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN meeting_name LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "</foreach>) AS name_matches, " +
            "(<foreach collection='interests' item='keyword' separator=' + '>" +
            "   CASE WHEN general_content LIKE CONCAT('%', #{keyword}, '%') THEN 1 ELSE 0 END " +
            "</foreach>) AS content_matches " +
            "FROM meeting.meetings " +
            "WHERE is_public = 1 " +
            "AND (" +
            "   <foreach collection='interests' item='keyword' separator=' OR '>" +
            "       theme LIKE CONCAT('%', #{keyword}, '%') " +
            "       OR meeting_name LIKE CONCAT('%', #{keyword}, '%') " +
            "       OR general_content LIKE CONCAT('%', #{keyword}, '%')" +
            "   </foreach>" +
            ") " +
            "ORDER BY total_score DESC, " +      // 按总权重分排序
            "         theme_matches DESC, " +    // 议题匹配数优先
            "         name_matches DESC, " +     // 名称匹配数次之
            "         content_matches DESC, " +  // 内容匹配数最后
            "         start_time DESC" +
            "</script>")
    List<Meetings> getPublicMeetingsByInterest(@Param("interests") List<String> interests);

    @Select("SELECT m.*, COUNT(am.meeting_id) AS attendee_count " +
            "FROM meeting.meetings m " +
            "LEFT JOIN attend_meeting am ON m.meeting_id = am.meeting_id " +
            "WHERE m.is_public = 1 " +
            "GROUP BY m.meeting_id, m.start_time " +
            "ORDER BY attendee_count DESC, m.start_time DESC")
    List<Meetings> getPublicMeetingsByAttendees();

    @Select("SELECT m.*, " +
            "(m.click_count * 3 + COALESCE(am_count.cnt, 0) * 2) AS weight_score, " +
            "COALESCE(am_count.cnt, 0) AS attendee_count " +
            "FROM meeting.meetings m " +
            "LEFT JOIN ( " +
            "   SELECT meeting_id, COUNT(*) AS cnt " +
            "   FROM attend_meeting " +
            "   GROUP BY meeting_id " +
            ") am_count ON m.meeting_id = am_count.meeting_id " +
            "WHERE m.is_public = 1 " +
            "ORDER BY weight_score DESC, m.start_time DESC")
    List<Meetings> getMeetingsOrderByWeightScore();
}
