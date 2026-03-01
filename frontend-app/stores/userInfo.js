import {
	defineStore
} from "pinia";
import {
	ref
} from "vue";
const useUserInfoStore = defineStore('userInfo', () => {
	const info = ref({})
	const setInfo = (newInfo) => {
		info.value = newInfo
	}
	const removeInfo = () => {
		info.value = {}
	}
	return {
		info,
		setInfo,
		removeInfo
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
})
export default useUserInfoStore;