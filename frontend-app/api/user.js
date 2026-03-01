// 导入request模块
import request from '@/utils/request.js'

// 用户注册服务
export const userRegisterService = (account, password) => {
	// 发送post请求
	return request.post('/user/register?account=' + account + "&password=" + password)
}

// 用户登录服务
export const userLoginService = (account, password) => {
	// 发送post请求
	return request.post('/user/login?account=' + account + "&password=" + password)
}

// 获取用户信息服务
export const userInfoService = () => {
	// 发送get请求
	return request.get('/user/userInfo')
}

export const TokenService = () => {
	// 发送get请求
	return request.post('/token/generate')
}

// 更新用户信息服务
export const userInfoUpdateService = (userInfoData) => {
	// 发送put请求
	return request.put('/user/update', userInfoData)
}

// 更新用户头像服务
export const userAvatarUpdateService = (avatarUrl) => {
	// 发送patch请求
	return request.patch('/user/updateAvatar?avatarUrl=' + avatarUrl)
}

export const userInterestUpdateService = (interest) => {
	return request.patch('/user/updateInterest?interest=' + interest)
}

// 更新用户密码服务
export const userPasswordUpdateService = (passwordData) => {
	// 发送patch请求
	return request.patch('/user/updatePwd', passwordData);
}

export const findByIdService = (userId) => {
	return request.post('/user/findById?userId=' + userId);
}