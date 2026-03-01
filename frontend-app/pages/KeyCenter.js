import useUserInfoStore from "@/stores/userInfo.js"
const userInfoStore = useUserInfoStore()
import {
	ref
} from 'vue'
const userInfo = ref({
	...userInfoStore.info
})
let userID = userInfo.value.userId
let appID = 0
let appSign = ""
let token = ""

function getAppID() {
	return getApp().globalData.appID ?? appID;
}

function getUserID() {
	let user_id = (getApp().globalData.userID ?? userID) || 'user_id_' + Math.floor(Math.random() * 1000000).toString(
		16)
	return user_id;
}

function getAppSign() {
	return (getApp().globalData.appSign ?? appSign);
}

function getToken() {
	return (getApp().globalData.token ?? token);
}

function setAppID(data) {
	getApp().globalData.appID = Number(data) || appID; // 明确转为数字 
}

function setUserID(data) {
	getApp().globalData.userID = data;
}

function setToken(data) {
	getApp().globalData.token = data;
}

function setAppSign(data) {
	getApp().globalData.appSign = data;
}

export default {
	setAppID,
	setUserID,
	setToken,
	getToken,
	setAppSign,
	getAppSign,
	getAppID,
	getUserID,
	streamID: 'uniapp_' + Date.now().toString(16)
}