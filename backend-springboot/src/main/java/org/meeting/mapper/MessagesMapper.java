package org.meeting.mapper;

import org.apache.ibatis.annotations.*;
import org.meeting.pojo.Messages;

import java.util.List;

@Mapper
public interface MessagesMapper {
    @Select("select * from meeting.messages where sender_id=#{id}")
    List<Messages> getMySendMessages(Integer id);

    @Select("select * from meeting.messages where user_id=#{id}")
    List<Messages> getMyReceiveMessages(Integer id);

    @Insert("insert into meeting.messages(sender_id,user_id,message_content,message_title,send_time) values(#{senderId},#{userId},#{messageContent},#{messageTitle},#{sendTime})")
    void addMessages(Messages messages);

    @Delete("delete from meeting.messages where message_id=#{messageId}")
    void deleteMessages(Integer messageId);

    @Update("update meeting.messages set message_content=#{messageContent},message_title=#{messageTitle},send_time=#{sendTime} where message_id=#{messageId}")
    void updateMessages(Messages messages);

    @Update("UPDATE meeting.messages SET isRead = 1 WHERE message_id = #{messageId}")
    void isRead(Integer messageId);
}
