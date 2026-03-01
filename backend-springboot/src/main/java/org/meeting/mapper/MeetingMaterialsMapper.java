package org.meeting.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.meeting.pojo.MeetingMaterials;

import java.util.List;

@Mapper
public interface MeetingMaterialsMapper {
    @Select("SELECT * FROM meeting_materials WHERE meeting_id = #{meetingId}")
    List<MeetingMaterials> getAllMeetingMaterials(Integer meetingId);

    @Insert("INSERT into meeting_materials(meeting_id, material_name,material_path, material_code, material_type) VALUES (#{meetingId},#{materialName},#{materialPath},#{materialCode},#{materialType})")
    void addMeetingMaterials(MeetingMaterials meetingMaterials);

    @Delete("DELETE FROM meeting_materials WHERE material_id = #{materialId}")
    void deleteMeetingMaterials(Integer materialId);
}
