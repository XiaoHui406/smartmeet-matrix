import axios from 'axios'
import {
	UniAdapter
} from "uniapp-axios-adapter"
// 定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = 'http://127.0.0.1:8080';
const instance = axios.create({
	baseURL: baseURL,
	timeout: 10000
});
import {
	useTokenStore
} from '../stores/token';

// 添加请求拦截器
instance.interceptors.request.use(
	(config) => {
		const tokenStore = useTokenStore();
		if (tokenStore.token) {
			config.headers.Authorization = tokenStore.token;
		}
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

// 添加响应拦截器
instance.interceptors.response.use(
	(result) => {
		if (result.data.code === 0) {
			return result.data;
		}
		uni.showToast({
			title: result.data.message ? result.data.message : '服务异常',
			icon: 'error'
		});
		return Promise.reject(result.data);
	},
	(err) => {
		if (err.response && err.response.status === 401) {
			uni.showToast({
				title: '请先登录',
				icon: 'error'
			});
			uni.navigateTo({
				url: '/pages/login'
			});
		} else {
			uni.showToast({
				title: result.data.message ? result.data.message : '服务异常',
				icon: 'error'
			});
		}
		return Promise.reject(err); // 异步的状态转化成失败的状态
	}
);

export default instance;