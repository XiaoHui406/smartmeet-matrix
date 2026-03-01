import request from '@/utils/request.js'

export const myMeetingMaterialsListService = () => {
	return request.get('/meetingMaterials/myMaterials')
}
export const myOrganizationsService = (params) => {
	return request.get('/organizations/myOrganizations', {
		params: params
	})
}
export const organizationMemberService = (organizationId) => {
	return request.post('/organizationMember/findById?organizationId=' + organizationId)
}
export const myAttendMeetingService = (params) => {
	return request.get('/attendMeeting/findByUserId', {
		params: params
	})
}
export const meetingDetailService = (meetingId) => {
	return request.post('/meeting/detail?meetingId=' + meetingId)
}