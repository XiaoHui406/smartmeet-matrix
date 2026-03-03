/* 注册 */

import request from '../utils/request'

/* 调用注册接口函数 */
export const userRegisterService = (registerData) => {
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key]);
    }
   return request.post('/user/register', params);
}

/* 调用登录接口函数 */
export const userLoginService = (loginData) => {
    const params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }
   return request.post('/user/login', params);
}

//获取用户详细信息
export const userInfoService = () => {
    return request.get('/user/userInfo');
}


//修改个人信息
export const userUpdateService = (userData) => {
    return request.put('/user/update', userData);
}


//修改头像
export const userAvatarUpdateService = (avatarUrl) => {
    const params = new URLSearchParams()
    params.append('avatarUrl', avatarUrl);
    return request.patch('/user/updateAvatar', params);
}


//重置密码
export const passwordUpdateService = (resetData) => {
    return request.patch('/user/updatePwd', resetData);
}