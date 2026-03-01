import request from '@/utils/request.js'

export const addCommentService = (topicId, score, content) => {
	return request.post('/comments/add', {
		topicId: topicId,
		score: score,
		content: content
	})
}

export const deleteCommentService = (commentId) => {
	return request.delete('/comments/delete?commentId=' + commentId)
}

export const getCommentListService = (topicId) => {
	return request.post('/comments/commentsList?topicId=' + topicId)
}