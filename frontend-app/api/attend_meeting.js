import request from '@/utils/request.js'

export const getUserattendMeetingsService = () => {
	return request.get('/attendMeeting/findByUserId')
}

export const attendMeetingService = (userId, meetingId) => {
	return request.post('/attendMeeting/add?userId=' + userId + "&meetingId=" + meetingId + "&attendanceStatus=1")
}

export const quitMeetingService = (meetingId) => {
	return request.delete("/attendMeeting/deleteByMeetingId?meetingId=" + meetingId)
}

export const getAttendeesService = (meetingId) => {
	return request.get('/attendMeeting/userAttendMeeting?meetingId=' + meetingId)
}

export const updateAttendanceStatusService = (userId, meetingId, attendanceStatus) => {
	return request.post('/attendMeeting/update?userId=' + userId + "&meetingId=" + meetingId +
		"&attendanceStatus=" + attendanceStatus)
}

export const updateAttendTimeService = (userId, meetingId, attendTime) => {
	return request.post('/attendMeeting/update?userId=' + userId + "&meetingId=" + meetingId + "&attendTime=" +
		attendTime + "&attendanceStatus=3")
}

export const updateLeaveTimeService = (userId, meetingId, leaveTime) => {
	return request.post('/attendMeeting/update?userId=' + userId + "&meetingId=" + meetingId + "&leaveTime=" +
		leaveTime + "&attendanceStatus=3")
}