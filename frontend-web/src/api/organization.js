
import request from '../utils/request'


//组织列表加载   
export  const organizationListService = (organizationListData) => {
    return request.get('/organizations/myOrganizations',organizationListData);
}

//组织添加
export  const addOrganizationService = (organizationName,organizationDescribe) => {
    return request.post('/organizations/add',{
        organizationName:organizationName,
        organizationDescribe:organizationDescribe
    });
}

//组织修改
export  const updateOrganizationService = (updateOrganizationData) => {
    return request.post('/organizations/update', updateOrganizationData);
}

//组织删除
export  const deleteOrganizationService = (id) => {
    return request.delete('/organizations/delete?organizationId='+id);
}
