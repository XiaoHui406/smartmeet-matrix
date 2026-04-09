import request from '../utils/request'
import { useTokenStore } from '../stores/token'

//会议删除
export const meetDeleteService = (id) => {
    return request.delete(`/meeting/delete?meetingId=`+id);
}

//会议列表加载
export const meetListService = (meetListData) => {
    return request.get('/meeting/all', meetListData)
}

//会议添加
export const meetAddService = (meetData) => {
    return request.post('/meeting/add', meetData);
}

//会议编辑
export const meeSertchService = (meetData) => {
    return request.put('/meeting/update', meetData);
}

//获取会议详细信息  
export const meetDetailService = (id) => {
    return request.post('/meeting/detail?meetingId=' + id)
}

// 参会记录

//获取参会记录
export const attendsListService = (id) => {
    return request.get(`/attendMeeting/userAttendMeeting?meetingId=${id}`);
}

//添加会议记录
export const AddAttendService = (useId, meetingId, attendanceStatus) => {
    return request.post('/attendMeeting/add?userId=' + useId + '&meetingId=' + meetingId + '&attendanceStatus=' + attendanceStatus);
}

//修改参会记录
export const updateAttendService = (userId,meetingId,attendanceStatus,attendTime,leaveTime,absentReason) => {
    return request.post('/attendMeeting/update?userId='+userId+'&meetingId='+meetingId+'&attendanceStatus=' + attendanceStatus + '&attendTime=' + attendTime + '&leaveTime=' + leaveTime + '&absentReason=' + absentReason);
}

//删除参会记录
export const deleteAttendsService = (id) => {
    return request.delete(`/attendMeeting/delete?attendId=${id}`);
}

//获取我的参会记录
export const myAttendsListService = () => {
    return request.get('/attendMeeting/findByUserId');
}

//会议布局图上传
export const uploadService = (data) => {
    return request.post('/upload',data);
}

//议程

// 添加议程
export const addTopicService = (params) => {
    return request.post('/topics/add', params)
  }
  //删除议程
  export const deleteTopicService = (topicId) => {
    return request.delete(`/topics/delete?topicId=${topicId}`)
  }
  //获取议程
  export const getTopicsService = (meetingId) => {
    return request.get(`/topics/getTopics?meetingId=${meetingId}`)
  }

  //更新议程
  export const updateTopicService = (params) => {
    return request.post('/topics/update', params)
  }

  //议程排序
  //热度
  export const sortTopicHotService = (meetingId) => {
    return request.get(`/topics/topicSort?meetingId=${meetingId}&sortType=1`)
  }
  //兴趣
  export const sortTopicInterService = (meetingId) => {
    return request.get(`/topics/topicSort?meetingId=${meetingId}&sortType=2`)
  }
  //评分
  export const sortTopicScoreService = (meetingId) => {
    return request.get(`/topics/topicSort?meetingId=${meetingId}&sortType=3`)
  }

  //会议材料
  //获取会议材料
  export const getMaterialService = (meetingId) => {
    return request.get(`/meetingMaterials/findById?meetingId=${meetingId}`)
  }
  //添加会议材料
  export const addMaterialService = (params) => {
    return request.post('/meetingMaterials/add', params)
  }
  //删除会议材料
  export const deleteMaterialService = (materialId) => {
    return request.delete(`/meetingMaterials/delete?materialId=${materialId}`)
  }

  //智能创建
  export const AIMeetingSummaryService = (content) => {
	  return request.post('/getAiReply?content=' + content)
  }