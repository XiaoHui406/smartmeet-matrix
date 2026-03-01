package org.meeting.service;

import org.meeting.pojo.Users;

public interface UserService {
    Users findByAccount(String account);

    void register(String account, String password);

    void updateAvatar(String avatarUrl);

    void updatePwd(String newPwd);

    void update(Users user);

    void updateInterest(String interest);

    Users findById(Integer userId);
}
