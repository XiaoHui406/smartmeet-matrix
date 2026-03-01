import {
	defineStore
} from "pinia";
import {
	ref
} from "vue";

export const useTokenStore = defineStore('token', () => {
	const token = ref('')
	const setToken = (newToken) => {
		token.value = newToken
	}
	const removeToken = () => {
		token.value = ''
	}
	return {
		token,
		setToken,
		removeToken
	}
}, {
	persist: {
		// 调整为兼容多端的API
		storage: {
			setItem(key, value) {
				uni.setStorageSync(key, value)
			},
			getItem(key) {
				return uni.getStorageSync(key)
			},
		},
	},
});