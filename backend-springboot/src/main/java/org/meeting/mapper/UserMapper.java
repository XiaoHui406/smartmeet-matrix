package org.meeting.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.meeting.pojo.Users;

@Mapper
public interface UserMapper {
    @Select("select * from users where account=#{account}")
    Users findByAccount(String account);

    @Insert("insert into users(account, password, user_name) values(#{account}, #{password}, '未命名用户')")
    void add(String account, String password);

    @Update("update users set user_name=#{username},email=#{email} where user_id =#{userId}")
    void update(Users user);

    @Update("update users set user_pic=#{avatarUrl} where user_id =#{Id}")
    void updateAvatar(String avatarUrl, Integer Id);

    @Update("update users set password=#{md5String} where user_id=#{Id}")
    void updatePwd(String md5String, Integer Id);

    @Update("update users set interest=#{interest} where user_id =#{Id}")
    void updateInterest(String interest, Integer Id);

    @Select("select * from users where user_id=#{userId}")
    Users findById(Integer userId);

}
