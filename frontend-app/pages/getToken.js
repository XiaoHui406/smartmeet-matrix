import keycenter from "./KeyCenter";
import {
	TokenService
} from '@/api/user.js'; // 导入封装好的服务

export const getLoginToken = () => {
	return new Promise((resolve, reject) => {
		if (keycenter.token) {
			resolve(keycenter.token);
		}
		// #ifdef H5
		TokenService() // 直接调用封装好的服务
			.then(response => {
				if (response.code === 0) {
					const token = response.data;
					console.log('Token  generated:', token);
					keycenter.token = token; // 缓存 Token
					console.log(keycenter.token);
					resolve(token);
				} else {
					reject(new Error(response.message || 'Token generation failed'));
				}
			})
			.catch(err => {
				console.error('Token  request failed:', err);
				reject(new Error('Network error: ' + err.errMsg));
			});
		// #endif
	});
};