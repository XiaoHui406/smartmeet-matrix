package org.meeting.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.meeting.mapper.UserMapper;
import org.meeting.pojo.Users;
import org.meeting.service.UserService;
import org.meeting.utils.Md5Util;
import org.meeting.utils.ThreadLocalUtil;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public Users findByAccount(String account) {
        Users u = userMapper.findByAccount(account);
        return u;
    }

    @Override
    public void register(String account, String password) {
        String md5string = Md5Util.getMD5String(password);
        userMapper.add(account, md5string);
    }

    @Override
    public void update(Users user) {
        userMapper.update(user);
    }

    @Override
    public void updateInterest(String interest) {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer Id = (Integer) map.get("id");
        userMapper.updateInterest(interest, Id);
    }

    @Override
    public Users findById(Integer userId) {
        Users users = userMapper.findById(userId);
        return users;
    }

    @Override
    public void updateAvatar(String avatarUrl) {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer Id = (Integer) map.get("id");
        userMapper.updateAvatar(avatarUrl, Id);
    }

    @Override
    public void updatePwd(String newPwd) {
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer Id = (Integer) map.get("id");
        userMapper.updatePwd(Md5Util.getMD5String(newPwd), Id);
    }

}
