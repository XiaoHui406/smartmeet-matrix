import request from '@/utils/request.js'

export const meetingTopicsService = (meetingId) => {
	return request.get('/topics/getTopics?meetingId=' + meetingId)
}

export const meetingTopicsSortedByScoreService = (meetingId) => {
	return request.get('/topics/topicSort?meetingId=' + meetingId + "&sortType=3")
}

export const meetingTopicsSortedByClickCountService = (meetingId) => {
	return request.get('/topics/TopicSort?meetingId=' + meetingId + "&sortType=1")
}

export const topicClickCountAddService = (topicId) => {
	return request.post('/topics/updateClickCount?topicId=' + topicId)
}

export const topicDetailService = (topicId) => {
	return request.get('/topics/detail?topicId=' + topicId)
}

export const recommendTopicsService = () => {
	return request.get('/topics/topicInterest')
}