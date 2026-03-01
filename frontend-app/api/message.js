import request from '@/utils/request.js'

export const getUserMessagesService = () => {
	return request.get('/messages/myReceiveMessages')
}

export const deleteMessagesService = (messageId) => {
	return request.delete('/messages/deleteMessages?messageId=' + messageId)
}

export const readMessageService = (messageId) => {
	return request.post('/messages/isRead?messageId=' + messageId)
}