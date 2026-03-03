
import request from '../utils/request'

//渲染成员列表
export const memberService = (id) => {
    return request.post(`/organizationMember/findById?organizationId=${id}`)
}

//添加成员
export const addMemberService = (organizationId,account) => {
    return request.post('/organizationMember/add?organizationId='+organizationId+'&account='+account)
}

//修改成员
export const updateMemberService = (updateMemberData) => {
    return request.post('',updateMemberData)
}

//删除成员
export const deleteMemberService = (id) => {
    return request.delete('/organizationMember/delete?relationId='+id)
}