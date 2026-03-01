import request from '@/utils/request.js'

// 获取用户参加的会议
export const userAttendMeetingService = () => {
	return request.get('/meeting/getMyMeetings')
}

export const meetingDetailService = (meetingId) => {
	return request.post('/meeting/detail?meetingId=' + meetingId)
}

export const meetingMaterialsService = (meetingId) => {
	return request.get('/meetingMaterials/findById?meetingId=' + meetingId)
}

export const publicMeetingService = () => {
	return request.get('/meeting/getPublicMeetings')
}

export const recommendMeetingsService = () => {
	return request.get('/meeting/getPublicMeetings?sortType=3')
}

export const clickCountAddService = (meetingId) => {
	return request.put('/meeting/updateClickCount?meetingId=' + meetingId)
}

// 会议按参会人数降序排序
export const meetingsSortByNumberService = () => {
	return request.get('/meeting/getPublicMeetings?sortType=4')
}

// 会议综合排序
export const meetingsSortByIntegratedService = () => {
	return request.get('/meeting/getPublicMeetings?sortType=5')
}

// 会议按点击次数降序排序
export const meetingsSortByClickCountService = () => {
	return request.get('/meeting/getPublicMeetings?sortType=1')
}

export const AIMeetingSummaryService = (content) => {
	return request.post('/getAiReply?content=' + content)
}