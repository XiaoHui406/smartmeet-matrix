<script setup>
import {
    Edit,
    Delete,

} from '@element-plus/icons-vue'
import dayjs from 'dayjs';

import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useRouter } from 'vue-router';
const router = useRouter();

import { ElMessage, ElMessageBox } from 'element-plus'

import { useTokenStore } from '../../stores/token'
const tokenStore = useTokenStore()

const meets = ref([])

const meetingTypeOptions = ref([
    { value: 1, label: '线上会议' },
    { value: 2, label: '线下会议' },
    { value: 3, label: '混合会议' }
]);

const meetingStatusOptions = ref([
    { value: 1, label: '未开始' },
    { value: 2, label: '进行中' },
    { value: 3, label: '已结束' }
]);

const meetIsPublicOptions = ref([
    { value: 1, label: '是' },
    { value: 2, label: '否' }
]);

const getMeetingStatusText = (status) => {
    const statusMap = {
        1: '未开始',
        2: '进行中',
        3: '已结束'
    };
    return statusMap[status] || '未知状态';
}

const getMeetingTypeText = (type) => {
    const typeMap = {
        1: '线上',
        2: '线下',
        3: '混合'
    };
    return typeMap[type] || '未知类型';
}

const pageNum = ref(1)
const total = ref(20)
const pageSize = ref(8)

//回显会议分类
import { meetListService, meetDeleteService } from '../../api/meet'

// 状态标签颜色映射
const statusTagType = (status) => {
    const typeMap = {
        1: 'info',    // 未开始
        2: 'success', // 进行中
        3: 'warning'  // 已结束
    };
    return typeMap[status] || 'info';
}
//回去会议列表数据
const meetList = async () => {

    let result = await meetListService(meetList)
    meets.value = result.data
}

meetList();



import { Plus } from '@element-plus/icons-vue'
const visibleDrawer = ref(false)
const meetModel = ref({
    meetingId: '',
    meetingName: '',
    startTime: '',
    endTime: '',
    meetingStatus: '',
    maxNumber: '',
    meetingType: '',
    meetingLocation: '',
    theme: ''
})

//搜索会议信息
const meetListSctch = async () => {
    // 获取所有会议数据
    let result = await meetListService(meetList)
    if (result && result.data && Array.isArray(result.data)) {
        let allMeets = result.data;

        let filteredMeets = allMeets.filter(item => {
            return (
                (!meetModel.value.meetingId || item.meetingId.toString().includes(meetModel.value.meetingId)) &&
                (!meetModel.value.meetingName || item.meetingName.toLowerCase().includes(meetModel.value.meetingName.toLowerCase())) &&
                (!meetModel.value.startTime || new Date(item.startTime).toLocaleString().includes(new Date(meetModel.value.startTime).toLocaleString())) &&
                (!meetModel.value.endTime || new Date(item.endTime).toLocaleString().includes(new Date(meetModel.value.endTime).toLocaleString())) &&
                (!meetModel.value.meetingStatus || item.meetingStatus.toString().includes(meetModel.value.meetingStatus.toString())) &&
                (!meetModel.value.maxNumber || item.maxNumber.toString().includes(meetModel.value.maxNumber.toString())) &&
                (!meetModel.value.meetingType || item.meetingType.toString().includes(meetModel.value.meetingType.toString())) &&
                (!meetModel.value.meetingLocation || item.meetingLocation.toLowerCase().includes(meetModel.value.meetingLocation.toLowerCase())) &&
                (!meetModel.value.theme || item.theme.toLowerCase().includes(meetModel.value.theme.toLowerCase()))
            );
        });

        meets.value = filteredMeets;

    } else {
        console.error('获取会议列表失败:', result);
        meets.value = [];
    }
}

//重置事件
const clearSctch = () => {
    meetModel.value = {
        meetingId: '',
        meetingName: '',
        startTime: '',
        endTime: '',
        meetingStatus: '',
        maxNumber: '',
        meetingType: '',
        meetingLocation: '',
        theme: ''
    }
    meetList();
}



const rules = {
    meetingName: [
        { required: true, message: '请输入会议名称', trigger: 'blur' }
    ],
    startTime: [
        { required: true, message: '请输入会议开始时间', trigger: 'blur' }
    ],
    endTime: [
        { required: true, message: '请输入会议结束时间', trigger: 'blur' }
    ],
    meetingStatus: [
        { required: true, message: '请选择会议状态', trigger: 'blur' }
    ],
    maxNumber: [
        { required: true, message: '请输入会议最大人数', trigger: 'blur' }
    ],
    meetingType: [
        { required: true, message: '请选择会议类型', trigger: 'blur' }
    ],
    meetingLocation: [
        { required: true, message: '请输入会议地点', trigger: 'blur' }
    ],
    theme: [
        { required: true, message: '请输入会议主题', trigger: 'blur' }
    ],
    rule: [
        { required: true, message: '请输入会议规则', trigger: 'blur' }
    ],
    diningService: [
        { required: true, message: '请输入会议是否提供餐饮服务', trigger: 'blur' }
    ],
    agenda: [
        { required: true, message: '请输入会议议程', trigger: 'blur' }
    ],
    generalContent: [
        { required: true, message: '请输入会议概况', trigger: 'blur' }
    ],
    keyAttendees: [
        { required: true, message: '请输入会议关键参与人', trigger: 'blur' }
    ],
    isPublic: [
        { required: true, message: '请输入会议是否公开', trigger: 'blur' }
    ]
}

const title = ref('')

const handleMeetingNameClick = (meetingId) => {
    router.push({ name: 'MeetDetail', params: { id: meetingId } });
}
//跳转编辑页
const editmeet = (row) => {
    router.push({ name: 'MeetUpdate', params: { id: row.meetingId } });
}

//跳转添加页
const addMeetItem = () => {
    router.push({ name: 'MeetAdd' });
}

//删除会议    调用接口
const deleteMeetItem = (row) => {
    ElMessageBox.confirm(
        '确认删除该会议吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用会议删除接口
        await meetDeleteService(row.meetingId);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            meetList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

//批量删除
// 批量删除会议
const selectedRows = ref([])
const handleSelectionChange = (selection) => {
    selectedRows.value = selection
}
const deleteMeet = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先选择要删除的会议')
        return
    }
    ElMessageBox.confirm(
        '确认删除选中的会议吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                for (const row of selectedRows.value) {
                    await meetDeleteService(row.meetingId);
                }
                ElMessage({
                    type: 'success',
                    message: '批量删除成功',
                })
                meetList();
            } catch (error) {
                console.error('批量删除会议失败:', error);
                ElMessage.error('批量删除会议失败，请重试');
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}



</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <p2 class="page-title">会议管理</p2>
                <div class="header-actions">
                    <el-button type="danger" @click="deleteMeet" class="action-btn">
                        <el-icon>
                            <Delete />
                        </el-icon>批量删除
                    </el-button>
                    <el-button type="primary" @click="addMeetItem" class="action-btn">
                        <el-icon>
                            <Plus />
                        </el-icon>新建会议
                    </el-button>
                </div>
            </div>
        </template>

        <div class="search-card">
            <el-form :model="meetModel" inline class="custom-search-form" label-position="left">
                <el-row :gutter="12" align="middle">
                    <el-col :xs="24" :sm="12" :md="8" :lg="6">
                        <el-form-item label="会议ID：" class="form-label">
                            <el-input v-model="meetModel.meetingId" placeholder="ID" style="width: 160px" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="8" :lg="6">
                        <el-form-item label="名称：" class="form-label">
                            <el-input v-model="meetModel.meetingName" placeholder="会议名称" style="width: 160px"
                                clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="8" :lg="6">
                        <el-form-item label="类型：" class="form-label">
                            <el-select v-model="meetModel.meetingType" placeholder="全部" style="width: 160px">
                                <el-option v-for="option in meetingTypeOptions" :key="option.value"
                                    :label="option.label" :value="option.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="8" :lg="6">
                        <el-form-item label="状态：" class="form-label">
                            <el-select v-model="meetModel.meetingStatus" placeholder="全部" style="width: 160px">
                                <el-option v-for="option in meetingStatusOptions" :key="option.value"
                                    :label="option.label" :value="option.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <!-- 操作按钮 -->
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" class="form-actions-col">
                        <div class="form-actions">
                            <el-button type="primary" @click="meetListSctch" size="default">
                                <el-icon>
                                    <Search />
                                </el-icon>搜索
                            </el-button>
                            <el-button @click="clearSctch" size="default">
                                <el-icon>
                                    <Refresh />
                                </el-icon>重置
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div class="data-card">
                <el-table :data="meets" style="width: 100%" stripe v-loading="loading"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="会议ID" prop="meetingId" width="110" align="center" />
                    <el-table-column label="会议名称" min-width="140" class-name="compact-column">
                        <template #default="{ row }">
                            <el-link type="primary" @click="handleMeetingNameClick(row.meetingId)"
                                class="meeting-link truncate">
                                {{ row.meetingName }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间范围" width="320">
                        <template #default="{ row }">
                            <div class="time-range">
                                <span class="time-text">{{ dayjs(row.startTime).format('YYYY-MM-DD HH:mm') }}</span>
                                <span class="to-text">至</span>
                                <span class="time-text">{{ dayjs(row.endTime).format('YYYY-MM-DD HH:mm') }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="140" align="center">
                        <template #default="{ row }">
                            <el-tag :type="statusTagType(row.meetingStatus)" effect="light">
                                {{ getMeetingStatusText(row.meetingStatus) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" width="150" align="center">
                        <template #default="{ row }">
                            <el-tag type="info" effect="light">
                                {{ getMeetingTypeText(row.meetingType) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center" fixed="right">
                        <template #default="{ row }">
                            <div class="table-actions">
                                <el-button type="primary" link @click="editmeet(row)" class="action-icon">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                                <el-button type="danger" link @click="deleteMeetItem(row)" class="action-icon">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                        background @size-change="onSizeChange" @current-change="onCurrentChange" />
                </div>
            </div>
        </div>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.page-container {
    background: #f5f7fa;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
}

.page-title {
    margin: 0;
    font-size: 24px;
    color: #303133;
    font-weight: 600;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.action-btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;

    .el-icon {
        margin-right: 8px;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
}

.search-card {
    background: linear-gradient(145deg, #f8fafe 0%, #f5f9ff 100%);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.data-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}


.custom-search-form {

    .el-form-item {
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        .el-form-item__label {
            width: 60px;
            text-align: right;
            padding-right: 8px;
            color: #606266;
            font-size: 13px;
            flex-shrink: 0;
        }

        .el-input__wrapper,
        .el-select__wrapper {
            width: 160px;
            height: 36px;
        }
    }

    .form-actions-col {
        margin-top: 8px;
        border-top: 1px solid #ebeef5;
        padding-top: 12px;

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
    }

    @media (max-width: 768px) {
        .el-form-item {
            width: 100%;

            .el-form-item__content {
                flex-grow: 1;
            }

            .el-input__wrapper,
            .el-select__wrapper {
                width: 100% !important;
            }
        }

        .form-actions-col {
            .form-actions {
                justify-content: space-around;
            }
        }
    }
}

:deep(.el-table) {
    .cell {
        padding: 0 10px !important;
    }

    th.el-table__cell {
        padding: 12px 10px;
    }

    td.el-table__cell {
        padding: 8px 10px;
    }
}

.truncate {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
}

.compact-column {
    .cell {
        line-height: 1.4;
    }
}

.meeting-link {
    font-size: 13px;

    &:hover {
        text-decoration: underline;
    }
}

@media (max-width: 768px) {
    :deep(.el-table) {
        .el-table__cell {
            width: auto !important;

            &.compact-column {
                width: 120px !important;
            }
        }
    }

    .truncate {
        max-width: 120px;
    }
}

.time-range {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;

    .time-text {
        color: #606266;
        font-family: monospace; 
    }

    .to-text {
        color: #909399;
        font-size: 12px;
        flex-shrink: 0; 
        transform: translateY(1px); 
    }
}

@media (max-width: 768px) {
    .time-range {
        flex-wrap: wrap;

        .to-text {
            display: none;
        }

        .time-text:first-child::after {
            content: " - "; 
        }
    }
}

.meeting-link {
    font-weight: 500;

    &:hover {
        color: var(--el-color-primary);
        text-decoration: underline;
    }
}

.table-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.action-icon {
    font-size: 18px;
    padding: 8px;
    transition: all 0.2s;

    &:hover {
        transform: scale(1.1);
    }
}

.pagination-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}

:deep(.el-table__header th) {
    background-color: #f8f9fa !important;
    font-weight: 600;
    color: #303133;
}

:deep(.el-table__row--striped) {
    background-color: #fafafa;
}
</style>