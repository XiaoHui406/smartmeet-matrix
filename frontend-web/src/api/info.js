
import request from '../utils/request'

//渲染信息列表  接收信息
export const getMyInfoService = () => {
    return request.get('/messages/myReceiveMessages')
}

//渲染信息列表  发送信息
export const mySendMessagesService = () => {
    return request.get('/messages/mySendMessages')
}

//删除信息
export const deleteInfoService = (id) => {
    return request.delete('/messages/deleteMessages?messageId=' + id)
}

//添加信息
export const addInfoService = (userId, messageContent, messageTitle,sendTime) => {
    return request.post('messages/add', {
        userId,
        messageContent,
        messageTitle,
        sendTime
    })
}

//有账号获取用户ID
export const userIdService = (account) => {
    return request.post('/user/findByAccount?account=' + account)
}