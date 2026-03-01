package org.meeting.service;

import org.meeting.pojo.Messages;

import java.util.List;

public interface MessagesService {
    List<Messages> getMySendMessages(Integer id);

    List<Messages> getMyReceiveMessages(Integer id);

    void addMessages(Messages messages);

    void deleteMessages(Integer messageId);

    void updateMessages(Messages messages);

    void isRead(Integer messageId);
}
