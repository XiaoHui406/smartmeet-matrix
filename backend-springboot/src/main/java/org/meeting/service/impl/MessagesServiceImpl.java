package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.MessagesMapper;
import org.meeting.pojo.Messages;
import org.meeting.service.MessagesService;
import org.meeting.utils.ThreadLocalUtil;

import java.util.List;
import java.util.Map;

@Service
public class MessagesServiceImpl implements MessagesService {
    @Autowired
    private MessagesMapper messagesMapper;

    @Override
    public List<Messages> getMySendMessages(Integer id) {
        return messagesMapper.getMySendMessages(id);
    }

    @Override
    public List<Messages> getMyReceiveMessages(Integer id) {
        return messagesMapper.getMyReceiveMessages(id);
    }

    @Override
    public void addMessages(Messages messages) {
        Map<String, Object> map = ThreadLocalUtil.get();
        // 获取用户ID
        Integer Id = (Integer) map.get("id");
        messages.setSenderId(Id);
        messagesMapper.addMessages(messages);
    }

    @Override
    public void deleteMessages(Integer messageId) {
        messagesMapper.deleteMessages(messageId);
    }

    @Override
    public void updateMessages(Messages messages) {
        messagesMapper.updateMessages(messages);
    }

    @Override
    public void isRead(Integer messageId) {
        messagesMapper.isRead(messageId);
    }
}
