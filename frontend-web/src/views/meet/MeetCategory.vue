<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

import { memberService, addMemberService, updateMemberService, deleteMemberService } from '@/api/member';
import { organizationListService, addOrganizationService, updateOrganizationService, deleteOrganizationService } from '@/api/organization';
import {
    Edit,
    Delete,
    Search,
    Remove,
    OfficeBuilding,
    Plus,
    Refresh
} from '@element-plus/icons-vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import { userInfoStore } from '../../stores/userInfo'
const usersInfoStore = userInfoStore();


const organizations = ref([])
const organId = ref(0)
const organizationyList = async () => {
    let result = await organizationListService()
    console.log("组织数据", result.data);
    organizations.value = result.data;
}
organizationyList();

const dialogVisible = ref(false)

const organizationModel = ref({
    organizationId: '',
    organizationName: '',
    organizationDescribe: ''

})

const rules = {
    organizationName: [
        { required: true, message: '请输入组织名称', trigger: 'blur' },
    ],
    organizationDescribe: [
        { required: true, message: '请输入组织描述', trigger: 'blur' },
    ]
}

//调用接口  添加组织
const addOrganization = async () => {
    const organizationName = organizationModel.value.organizationName
    const organizationDescribe = organizationModel.value.organizationDescribe


    let result = await addOrganizationService(organizationName, organizationDescribe)
    organId.value = result.data.organizationId;
    console.log('新增的组织ID:', organId.value);

    const userAccount = usersInfoStore.info.account;
    console.log('当前用户账号:', userAccount);
    await addMemberService(organId.value, userAccount);



    ElMessage.success('添加成功')
    organizationyList();
    memberList();
    dialogVisible.value = false;
}

//控制弹窗的名称
const title = ref('')
//显示修改弹窗  数据回显
const showDialog = async (row) => {
    dialogVisible.value = true; title.value = '修改组织';
    //数据考培
    organizationModel.value.organizationName = row.organizationName;
    organizationModel.value.organizationDescribe = row.organizationDescribe;
    //扩展一个id属性  传给后台
    organizationModel.value.organizationId = row.organizationId;
}

const clearData = () => {
    organizationModel.value.organizationName = '';
    organizationModel.value.organizationDescribe = '';
    organizationModel.value.organizationId = '';
}

const updateOrganization = async () => {
    let result = await updateOrganizationService(organizationModel.value);
    ElMessage.success('修改成功');
    organizationyList();
    dialogVisible.value = false;
}

//删除分类
const deleteOrganization = async (row) => {
    //提示框
    ElMessageBox.confirm(
        '确认删除该组织吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用分类删除接口
            let result = await deleteOrganizationService(row.organizationId);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            organizationyList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })

}



//成员管理
const members = ref([])
const memberList = async () => {
    try {
               let orgRes = await organizationListService();
        const organizationMap = orgRes.data.reduce((acc, org) => {
            acc[org.organizationId] = org.organizationName;
            return acc;
        }, {});

        console.log('组织映射表：', organizationMap);

        let res = await organizationListService();
        const IDs = res.data.map(item => item.organizationId);
        console.log('获取的组织ID：', IDs);

        members.value = [];
        for (const id of IDs) {
            let result = await memberService(id);
            if (result.data) {
                result.data.forEach(member => {
                    member.membersName = organizationMap[id];
                });
                members.value = members.value.concat(result.data);
            }
        }
    } catch (error) {
        console.error('获取成员列表失败：', error);
        ElMessage.error('获取成员列表失败，请重试');
    }
}


memberList();

const memberDialogVisible = ref(false)


const memberModel = ref({
    organizationId: '',
    account: ''
})
const memberRules = {
    organizationId: [
        { required: true, message: '请输入组织ID', trigger: 'blur' },
    ],
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ]
}


const addMember = async () => {

    const organizationId = parseInt(memberModel.value.organizationId, 10);
    const account = memberModel.value.account;

    let result = await addMemberService(organizationId, account)
    ElMessage.success('添加成功')
    memberList();
    memberDialogVisible.value = false;
}

//控制弹窗的名称
const memberTitle = ref('')


const clearMemberData = () => {
    memberModel.value.organizationId = '';
    memberModel.value.account = ''
}

const updateMember = async () => {
    let result = await updateMemberService(memberModel.value);
    ElMessage.success('修改成功');
    memberList();
    memberDialogVisible.value = false;
}

//删除成员
const deleteMember = async (row) => {
    ElMessageBox.confirm(
        '确认删除该成员吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用成员删除接口
            let result = await deleteMemberService(row.relationId);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            memberList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })

}

const searchKey = ref({
    memberId: '',
    memberName: '',
    memberPhone: ''
})
const searchOfKey = async () => {
    try {
        // 获取组织列表
        let orgRes = await organizationListService();
        const organizationMap = orgRes.data.reduce((acc, org) => {
            acc[org.organizationId] = org.organizationName;
            return acc;
        }, {});

        console.log('组织映射表：', organizationMap);

        // 获取成员列表
        members.value = [];
        for (const id of Object.keys(organizationMap)) {
            let result = await memberService(id);
            if (result.data) {
                result.data.forEach(member => {
                    member.membersName = organizationMap[id];
                });
                members.value = members.value.concat(result.data);
            }
        }

        console.log('获取到的成员列表：', members.value);

        const searchMemberId = parseInt(searchKey.value.memberId, 10);
        const searchMemberName = searchKey.value.memberName.trim().toLowerCase();
        const searchMemberPhone = searchKey.value.memberPhone.trim().toLowerCase();
        members.value = members.value.filter(member => {
            let match = true;
            if (!isNaN(searchMemberId) && member.memberId !== searchMemberId) {
                match = false;
            }
            if (searchMemberName && !member.memberName.toLowerCase().includes(searchMemberName)) {
                match = false;
            }
            if (searchMemberPhone && !member.memberPhone.toLowerCase().includes(searchMemberPhone)) {
                match = false;
            }
            return match;
        });

        console.log('过滤后的成员列表：', members.value);
    } catch (error) {
        console.error('获取成员列表失败：', error);
        ElMessage.error('获取成员列表失败，请重试');
    }
}

const resetOfKey = () => {
    searchKey.value.memberId = '',
        searchKey.value.memberName = '',
        searchKey.value.memberPhone = ''
        memberList();
}

</script>
<template>
    <el-card class="page-container">

        <div class="header">
            <span>组织管理</span>
            <div class="extra">
                <!-- 添加成员按钮 -->
                <el-button type="success" @click="memberDialogVisible = true; memberTitle = '添加成员'; clearMemberData"
                    class="add-member-btn">
                    <el-icon class="btn-icon">
                        <Plus />
                    </el-icon>
                    <span class="btn-label">添加成员</span>
                </el-button>
            </div>
        </div>


        <!-- 搜索区域 -->
        <el-card class="search-card">
            <div class="search-container">
                <el-form :model="searchKey" inline class="compact-search-form">
                    <el-form-item label="成员ID：" class="search-item">
                        <el-input v-model="searchKey.memberId" placeholder="输入ID" clearable suffix-icon="Search"
                            class="search-input" />
                    </el-form-item>

                    <el-form-item label="姓名：" class="search-item">
                        <el-input v-model="searchKey.memberName" placeholder="输入姓名" clearable class="search-input" />
                    </el-form-item>

                    <el-form-item label="电话：" class="search-item">
                        <el-input v-model="searchKey.memberPhone" placeholder="输入联系方式" clearable class="search-input" />
                    </el-form-item>

                    <div class="action-buttons">
                        <el-button type="primary" :icon="Search" class="search-btn" @click="searchOfKey">
                            <span class="btn-text">搜索</span>
                        </el-button>

                        <el-button type="info" :icon="Refresh" class="reset-btn" @click="resetOfKey">
                            <span class="btn-text">重置</span>
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-card>




        <el-row :gutter="20">
            <el-col :span="8">

                <el-row :gutter="20" class="management-layout,spacing-wrapper">

                    <el-col :xs="24" :sm="12" :md="12" class="card-col">
                        <el-card class="add-card" shadow="hover"
                            @click="dialogVisible = true; title = '添加组织'; clearData">
                            <div class="add-content">
                                <el-icon class="add-icon">
                                    <Plus />
                                </el-icon>
                                <div class="add-text">添加新组织</div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col v-for="(org, index) in organizations" :key="org.organizationId" :xs="24" :sm="12" :md="12"
                        class="card-col">
                        <el-card class="org-card" shadow="hover">
                            <div class="card-content">
                                <div class="card-header">
                                    <div class="title-wrapper">
                                        <el-icon class="school-icon">
                                            <OfficeBuilding />
                                        </el-icon>
                                        <h4 class="org-name">{{ org.organizationName }}</h4>
                                    </div>
                                    <span class="org-id">组织ID: {{ org.organizationId || index }}</span>
                                </div>

                                <div class="org-description">
                                    <el-collapse>
                                        <el-collapse-item>
                                            <template #title>
                                                <el-text type="info" truncated class="description-label">组织简介:</el-text>
                                            </template>
                                            <div class="full-description">
                                                {{ org.organizationDescribe || '暂无详细描述' }}
                                            </div>
                                        </el-collapse-item>
                                    </el-collapse>
                                </div>
                                <div class="card-actions">
                                    <el-button-group>
                                        <el-button :icon="Edit" circle plain type="primary" @click="showDialog(org)" />
                                        <el-button :icon="Delete" circle plain type="danger"
                                            @click="deleteOrganization(org)" />
                                    </el-button-group>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col v-if="organizations.length === 0" :span="24">
                        <el-empty description="没有数据" />
                    </el-col>
                </el-row>

            </el-col>
            <el-col :span="16">
                <el-card class="table-card">
                    <el-table :data="members" style="width: 100%" stripe border highlight-current-row size="medium"
                        class="scrollable-table">

                        <el-table-column label="成员ID" prop="memberId" width="90" align="center" header-align="center">
                            <template #header>
                                <span class="table-header">成员ID</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="成员姓名" prop="memberName" width="145" align="center">
                            <template #header>
                                <span class="table-header">成员姓名</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="头像" prop="userPic" width="120" align="center">
                            <template #default="{ row }">
                                <div class="avatar-wrapper">
                                    <img :src="row.userPic" class="user-avatar" alt="用户头像">
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="所属组织" prop="membersName" width="155" align="center">
                            <template #header>
                                <span class="table-header">所属组织</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="联系方式" prop="memberPhone" width="165" align="center">
                            <template #header>
                                <span class="table-header">联系方式</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="120" align="center" fixed="right">
                            <template #default="{ row }">
                                <el-tooltip content="删除成员" placement="top" effect="light">
                                    <el-button :icon="Delete" circle size="small" @click="deleteMember(row)"
                                        class="action-btn" />
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <template #empty>
                            <el-empty description="暂无成员数据" image-size="100" class="empty-state">
                            </el-empty>
                        </template>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="organizationModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="组织名称" prop="organizationName">
                    <el-input v-model="organizationModel.organizationName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="组织描述" prop="organizationDescribe">
                    <el-input v-model="organizationModel.organizationDescribe" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加组织' ? addOrganization() : updateOrganization()"> 确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="memberDialogVisible" :title="memberTitle" width="30%">
            <el-form :model="memberModel" :rules="memberRules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="组织ID" prop="organizationId">
                    <el-input v-model="memberModel.organizationId" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="成员账号" prop="account">
                    <el-input v-model="memberModel.account" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="memberDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="memberTitle == '添加成员' ? addMember() : updateMember()"> 确认
                    </el-button>
                </span>
            </template>
        </el-dialog>


    </el-card>
</template>


<style lang="scss" scoped>
.el-row {
    margin: -10px;

    .el-col {
        padding: 10px;
    }
}


.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
    margin-top: 50px;
}

.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        margin-bottom: 20px;
    }
}


.card-col {
    margin-bottom: 20px;

}

.search-card {
    border-radius: 12px;
    margin-bottom: 20px;


    :deep(.el-card__body) {
        padding: 18px 24px;
    }
}

.compact-search-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

    .search-item {
        margin: 0;
        padding: 0 8px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;

        &:hover {
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
        }

        .el-form-item__label {
            color: #606266;
            font-size: 13px;
            padding-right: 6px;

            &::after {
                content: none;
            }
        }
    }

    .search-input {
        width: 160px;

        :deep(.el-input__wrapper) {
            border: none;
            box-shadow: none;
            padding: 1px 8px;

            &:hover {
                box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
            }
        }
    }
}

.action-buttons {
    margin-left: auto;
    display: flex;
    gap: 8px;
}

.search-btn,
.reset-btn {
    padding: 8px 20px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s;

    .btn-text {
        margin-left: 6px;
        font-size: 13px;
    }
}

.search-btn {
    background: linear-gradient(135deg, #409EFF 0%, #3375ff 100%);
    border: none;
    color: white;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
}

.reset-btn {
    background: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
    border: none;
    color: #606266;

    &:hover {
        background: linear-gradient(135deg, #e4e7ed 0%, #d3d6db 100%);
    }
}


.add-member-btn {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #67C23A 0%, #5aad32 100%);
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(103, 194, 58, 0.3);

        .btn-icon {
            animation: bounce 0.6s;
        }
    }

    .btn-icon {
        font-size: 16px;
        margin-right: 8px;
    }

    .btn-label {
        font-weight: 500;
        letter-spacing: 0.5px;
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}

/* 响应式处理 */
@media (max-width: 768px) {
    .compact-search-form {
        .search-item {
            width: 100%;
            padding: 8px;

            .search-input {
                width: 100%;
            }
        }

        .action-buttons {
            width: 100%;
            justify-content: flex-end;
        }
    }
}

.table-card {
    height: calc(100vh - 220px); 

    :deep(.el-card__body) {
        padding: 0; 
        height: 100%;
    }
}

.table-wrapper {
    height: 100%;
    position: relative;
    overflow: hidden;
}

.scrollable-table {

    :deep(.el-table__header-wrapper) {
        position: sticky;
        top: 0;
        z-index: 2;
    }

    :deep(.el-table__body-wrapper) {
        max-height: calc(100vh - 280px);
        overflow-y: auto !important;

        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background-color: #c1c1c1;
            transition: background-color 0.3s;

            &:hover {
                background-color: #a8a8a8;
            }
        }

        &::-webkit-scrollbar-track {
            background-color: #f5f5f5;
        }
    }

    :deep(.el-table__body) {
        min-width: 100% !important;
    }
}

.el-table {
    --el-table-border-color: #ebeef5;
    --el-table-header-bg-color: #f8f9fc;
    --el-table-row-hover-bg-color: #f5f7fa;

    .table-header {
        font-weight: 600;
        color: #303133;
    }

    .avatar-wrapper {
        display: flex;
        justify-content: center;
        padding: 5px 0;

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #e4e7ed;
            transition: all 0.3s;

            &:hover {
                transform: scale(1.1);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
        }
    }

    .action-btn {
        color: #f56c6c;
        background: rgba(245, 108, 108, 0.1);
        border: none;

        &:hover {
            background: rgba(245, 108, 108, 0.2);
        }
    }
}

.empty-state {
    padding: 40px 0;

    .empty-image {
        width: 180px;
        opacity: 0.8;
    }
}

.org-card {
    height: 240px;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}

@media (max-width: 1200px) {
    .el-col {
        &:nth-child(1) {
            width: 100%;
        }

        &:nth-child(2) {
            width: 100%;
            margin-top: 20px;
        }
    }

    .org-card {
        height: auto;
        min-height: 200px;
    }
}

.org-card:hove r {
    transform: translateY(-3px);
}

.card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-header {
    margin-bottom: 15px;
}

.title-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.school-icon {
    font-size: 20px;
    color: #409eff;
    margin-right: 8px;
}

.org-name {
    margin: 0;
    font-size: 16px;
    color: #333;
}

.org-id {
    font-size: 12px;
    color: #999;
    display: block;
}

.org-description {
    flex: 1;
    margin-bottom: 15px;
}

.description-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    display: block;
}

:deep(.el-collapse) {
    border: none;
}

:deep(.el-collapse-item__header) {
    border: none;
    padding-left: 0;
}

:deep(.el-collapse-item__content) {
    padding: 10px 0;
    color: #666;
    line-height: 1.6;
}

.full-description {
    white-space: pre-wrap;
    word-break: break-word;
}

.card-actions {
    text-align: right;
    border-top: 1px solid #eee;
    padding-top: 12px;
}

.org-card {
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
    border: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    min-height: 200px;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    :deep(.el-card__body) {
        padding: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .card-header {
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(64, 158, 255, 0.1);
        margin-bottom: 12px;

        .title-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            .school-icon {
                font-size: 24px;
                color: #409eff;
                margin-right: 12px;
                background: rgba(64, 158, 255, 0.1);
                padding: 8px;
                border-radius: 8px;
            }

            .org-name {
                margin: 0;
                font-size: 16px;
                color: #303133;
                font-weight: 600;
            }
        }

        .org-id {
            font-size: 12px;
            color: #666;
            display: block;
            padding-left: 44px; 
        }
    }

    .org-description {
        flex: 1;
        margin-bottom: 16px;

        .description-label {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
            display: block;
            font-weight: 500;
        }

        :deep(.el-collapse) {
            border: none;
            background: transparent;

            .el-collapse-item__header {
                background: transparent;
                border: none;
                padding-left: 0;
                font-size: 13px;
                color: #409eff;
            }

            .el-collapse-item__content {
                padding: 8px 0;
                color: #666;
                line-height: 1.6;
            }
        }
    }

    .card-actions {
        border-top: 1px solid rgba(64, 158, 255, 0.1);
        padding-top: 12px;
        text-align: right;

        .el-button-group {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
    }
}

.org-card {
    transition: height 0.3s ease;

    &.expanded {
        min-height: 200px; 
        height: auto;
    }
}


.add-card {
    height: 92.5%;
    min-height: 200px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f6ff 100%);
    border: 2px dashed var(--el-color-primary-light-5);

    &:hover {
        transform: translateY(-3px);
        border-color: var(--el-color-primary);
        background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);

        .add-icon {
            color: var(--el-color-primary);
            transform: scale(1.1);
        }
    }

    .add-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--el-color-primary);
        margin-top: 70px;

        .add-icon {
            font-size: 48px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
        }

        .add-text {
            font-size: 16px;
            font-weight: 500;
        }
    }
}

.spacing-wrapper {
    &::after {
        content: '';
        display: block;
        clear: both;
    }

    .el-col {
        padding: 15px;

        &::before {
            content: '';
            display: block;
            padding-top: 75%;
        }

        .org-card {
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
        }
    }
}
</style>