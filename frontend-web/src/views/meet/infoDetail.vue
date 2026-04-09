<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Download, Search, Remove, Refresh, Plus } from '@element-plus/icons-vue'

import { userInfoStore } from '@/stores/userInfo';
const useInfoStore = userInfoStore();
const userInfo = ref({ ...useInfoStore.info })

import { getMyInfoService, deleteInfoService, addInfoService, mySendMessagesService } from '@/api/info'
import { userInfoService } from '@/api/use'
import { organizationListService } from '@/api/organization'
import { memberService } from '@/api/member'

// 表格数据
const myInfos = ref([])
const sendInfos = ref([])
const activeTab = ref('received')

// 搜索条件
const searchKey = ref({
    userId: '',
    senderId: ''
})

// 添加信息表单
const addInfoForm = ref({
    userName: userInfo.value.username,
    messageContent: '',
    messageTitle: '',
    userId: '',
    account:''
})

// 初始化加载数据
onMounted(async () => {
    await getMyInfos()
    await getMySendInfos()
})

// 获取接收的信息
const getMyInfos = async () => {
    const result = await getMyInfoService()
    myInfos.value = await enhanceInfoData(result.data)
}

// 获取发送的信息
const getMySendInfos = async () => {
    const result = await mySendMessagesService()
    sendInfos.value = await enhanceInfoData(result.data)
}

// 通用数据处理方法
const enhanceInfoData = async (data: any[]) => {
    const currentUser = await userInfoService()
    const userMap = {
        [currentUser.data.userId]: currentUser.data.username
    }
    const orgRes = await organizationListService()
    const members = []
    for (const org of orgRes.data) {
        const result = await memberService(org.organizationId)
        members.push(...result.data)
    }

    const memberMap = members.reduce((map, member) => {
        map[member.memberId] = member.memberName
        return map
    }, {})
    return data.map(item => ({
        ...item,
        userName: memberMap[item.userId] || '未知成员',
        senderName: userMap[item.senderId] || memberMap[item.senderId] || '未知发送者'
    }))
}

// 删除信息
const handleDelete = async (messageId: number) => {
    try {
        await ElMessageBox.confirm('确认删除该消息吗？', '警告', { type: 'warning' })
        await deleteInfoService(messageId)
        ElMessage.success('删除成功')
        getMyInfos()
        getMySendInfos()
    } catch (error) {
        ElMessage.info('取消删除')
    }
}
import {userIdService} from '@/api/info'
// 发送信息
const addInfo = async () => {
    try {
    
        const { account, messageTitle, messageContent } = addInfoForm.value
        if (!account || !messageTitle || !messageContent) {
            return ElMessage.warning('请填写完整信息')
        }

        //通过账号查询用户id
        const res= await userIdService(addInfoForm.value.account)

        await addInfoService(
            parseInt(res.data.userId),
            messageContent,
            messageTitle,
            new Date(new Date().toISOString()).toISOString().slice(0, 19).replace('T', ' ')
        )

        ElMessage.success('发送成功')
        addInfoForm.value = {
            ...addInfoForm.value,
            messageContent: '',
            messageTitle: '',
            userId: '',
            account:''
        }
        getMySendInfos()
    } catch (error) {
        ElMessage.error('发送失败')
    }
}

const resetForm = () => {
    addInfoForm.value = {
        ...addInfoForm.value,
        messageContent: '',
        messageTitle: '',
        userId: '',
        account:''
    }
}
const formatTime = (timeString) => {
    const date = new Date(timeString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
    <el-card class="page-container">
        <div class="header">
            <h2 class="page-title">消息管理</h2>
        </div>

        <el-row :gutter="20">
            <el-col :span="16">
                <el-tabs v-model="activeTab" type="border-card" class="table-tabs">
                    <el-tab-pane label="接收消息" name="received">
                        <div class="scroll-container">
                            <div class="card-list">
                                <el-card v-for="item in myInfos" :key="item.messageId" class="message-card">
                                    <div class="time-badge">{{ formatTime(item.sendTime) }}</div>
                                    <div class="card-content">
                                        <h3 class="card-title">{{ item.messageTitle }}</h3>
                                        <p class="card-text">{{ item.messageContent }}</p>
                                        <div class="card-footer">
                                            <div class="user-info">
                                                <span class="receiver">收件人：{{ item.userName }}</span>
                                                <span class="sender">发件人：{{ item.senderName }}</span>
                                            </div>
                                            <el-button type="danger" :icon="Delete" circle class="delete-btn"
                                                @click="handleDelete(item.messageId)" />
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="发送消息" name="sent">
                        <div class="scroll-container">
                            <div class="card-list">
                                <el-card v-for="item in sendInfos" :key="item.messageId" class="message-card">
                                    <div class="time-badge">{{ formatTime(item.sendTime) }}</div>
                                    <div class="card-content">
                                        <h3 class="card-title">{{ item.messageTitle }}</h3>
                                        <p class="card-text">{{ item.messageContent }}</p>
                                        <div class="card-footer">
                                            <div class="user-info">
                                                <span class="receiver">收件人：{{ item.userName }}</span>
                                                <span class="sender">发件人：{{ item.senderName }}</span>
                                            </div>
                                            <el-button type="danger" :icon="Delete" circle class="delete-btn"
                                                @click="handleDelete(item.messageId)" />
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="8">
                <div class="message-form-container">
                    <h3 class="form-title">发送新消息</h3>
                    <el-form :model="addInfoForm" label-width="80px" class="message-form">
                        <el-form-item label="接收账号">
                            <el-input v-model.number="addInfoForm.account" placeholder="输入成员账号" clearable />
                        </el-form-item>

                        <el-form-item label="消息标题">
                            <el-input v-model="addInfoForm.messageTitle" placeholder="输入消息标题" clearable />
                        </el-form-item>

                        <el-form-item label="消息内容">
                            <el-input v-model="addInfoForm.messageContent" type="textarea" :rows="5"
                                placeholder="输入消息内容" resize="none" />
                        </el-form-item>

                        <el-form-item class="form-actions">
                            <el-button type="primary" @click="addInfo" :icon="Plus" class="send-btn">
                                立即发送
                            </el-button>
                            <el-button @click="resetForm">重置表单</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>





<style scoped>
.page-container {
    max-width: 1600px;
    margin: 20px auto;
}

.header {
    margin-bottom: 20px;
}

.scroll-container {
  height: calc(100vh - 220px); 
  overflow-y: auto;
  padding-right: 8px;
}

.card-list {
    display: grid;
  gap: 16px;
  padding: 10px;
  min-height: min-content;
}


.message-card {
  position: relative;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
 
  :deep(.el-card__body) {
    padding: 24px;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
}

.scroll-container::-webkit-scrollbar {
  width: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.time-badge {
  position: absolute;
  top: 16px;  
  right: 16px; 
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 6px 10px;
  border-radius: 15px;
  z-index: 1; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
}

.card-content {
    padding: 16px;

    .card-title {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #303133;
    }

    .card-text {
        margin: 0 0 16px 0;
        color: #606266;
        line-height: 1.6;
        min-height: 60px;
    }
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #ebeef5;
    padding-top: 12px;

    .user-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12px;

        .receiver {
            color: #67C23A;
        }

        .sender {
            color: #409EFF;
        }
    }

    .delete-btn {
        margin-left: auto;
        transform: scale(0.9);
    }
}

/* 响应式处理 */
@media (max-width: 768px) {
    .card-list {
        grid-template-columns: 1fr;
    }

    .message-card {
        margin-bottom: 8px;
    }

    .card-title {
        font-size: 14px !important;
    }

    .card-text {
        font-size: 13px;
    }
}
.message-form-container {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
}

.form-title {
    color: #303133;
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
}

.message-form {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
}

.form-actions {
    margin-top: auto;
    padding-top: 20px;
}

.send-btn {
    width: 120px;
}

@media (max-width: 1200px) {
    .el-col {
        width: 100%;
        max-width: 100%;

        &:nth-child(1) {
            order: 2;
            margin-top: 20px;
        }

        &:nth-child(2) {
            order: 1;
        }
    }

    .message-form-container {
        height: auto;
    }

    .el-table {
        height: auto !important;
    }
}
</style>