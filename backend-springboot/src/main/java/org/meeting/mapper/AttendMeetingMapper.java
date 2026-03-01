package org.meeting.mapper;

import org.apache.ibatis.annotations.*;
import org.meeting.pojo.AttendMeeting;

import java.util.List;

@Mapper
public interface AttendMeetingMapper {
    @Select("select * from attend_meeting where  meeting_id=#{meetingId}")
    List<AttendMeeting> attend(Integer meetingId);

    @Insert("insert into attend_meeting(user_id, meeting_id,attendance_status) values(#{userId},#{meetingId},#{attendanceStatus})")
    void add(AttendMeeting attendMeeting);

    @Update("update attend_meeting set attendance_status=#{attendanceStatus},attend_time=#{attendTime},leave_time=#{leaveTime},absent_reason=#{absentReason} where user_id=#{userId} and meeting_id=#{meetingId}")
    void update(AttendMeeting attendMeeting);

    @Delete("delete from attend_meeting where attend_id=#{attendId}")
    void delete(Integer attendId);

    @Select("select * from attend_meeting where user_id=#{userId}")
    List<AttendMeeting> findByUserId(Integer userId);

    @Delete("delete from attend_meeting where meeting_id=#{meetingId} and user_id=#{userId}")
    void deleteByMeetingId(Integer meetingId, Integer userId);
}
