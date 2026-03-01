import request from '@/utils/request.js'
import {
	generateSign
} from '@/utils/sign.js';
import {
	APP_KEY,
	APP_SECRET
} from '@/config/config.js';

export const getMeetingMaterialsService = (meetingId) => {
	return request.get('/meetingMaterials/findById?meetingId=' + meetingId)
}

export const getMyMeetingMaterialsService = () => {
	return request.get("/meetingMaterials/myMaterials")
}

export const readMaterialDataService = (url) => {
	return request.post('/readByUrl?url=' + url)
}