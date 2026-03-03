<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Edit, Delete, Plus, ArrowLeft, Search, Refresh, Download, Share } from '@element-plus/icons-vue';
import { meetDetailService, meetListService } from '../../api/meet';
import { useTokenStore } from '../../stores/token';
import { attendsListService, getTopicsService } from '../../api/meet';
import { memberService } from '../../api/member';
import { organizationListService } from '../../api/organization';
import { ElMessage } from 'element-plus'

const tokenStore = useTokenStore();
const route = useRoute();
const meetingId = route.params.id;
const title = ref('');

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

const getStatusTagType = (status) => {
    const typeMap = {
        3: 'success',
        2: 'danger', 
        1: 'warning', 

    };
    return typeMap[status] || 'info';
}

const attendsTypeText = (attendanceStatus) => {
    const attendanceStatusMap = {
        1: '无签到',
        2: '未签到',
        3: '已签到',

    };
    return attendanceStatusMap[attendanceStatus] || '未知状态';
}

const attendanceStatusOptions = ref([
    { value: 1, label: '无签到' },
    { value: 2, label: '未签到' },
    { value: 3, label: '已签到' }
]);

import dayjs from 'dayjs';

import '@vueup/vue-quill/dist/vue-quill.snow.css';

const setmeetModel = ref({
    meetingId: '',
    meetingName: '',
    startTime: '',
    endTime: '',
    meetingStatus: '',
    maxNumber: '',
    meetingType: '',
    meetingLocation: '',
    theme: '',
    rule: '',
    diningService: '',
    agenda: '',
    generalContent: '',
    keyAttendees: '',
    layout: '',
    isPublic: ''
});

const getMeetDetail = async () => {
    const meetId = parseInt(meetingId);
    let res = await meetDetailService(meetId);
    setmeetModel.value = res.data;
}
getMeetDetail();

const attends = ref([]);

const attendsList = async () => {
    try {
        let id = meetingId;
        let result = await attendsListService(id);
        attends.value = result.data;

        let meetRes = await meetListService();
        const meetsMap = meetRes.data.reduce((acc, meet) => {
            acc[meet.meetingId] = meet.meetingName;
            return acc;
        }, {});

        console.log('会议映射表：', meetsMap);

        let orgRes = await organizationListService();

        let members = [];
        for (const org of orgRes.data) {
            let result = await memberService(org.organizationId);
            if (result.data) {
                members = members.concat(result.data);
            }
        }

        console.log('获取到的成员列表：', members);

        const userMap = {};
        members.forEach(member => {
            if (member.memberId !== undefined && member.memberName !== undefined) {
                userMap[parseInt(member.memberId, 10)] = member.memberName;
            } else {
                console.warn(`成员数据缺失 memberId 或 memberName:`, member);
            }
        });

        attends.value = attends.value.map(attend => {
            const userId = parseInt(attend.userId, 10) || 0;
            const userName = userMap[userId] || '未知成员';
            const meetingName = meetsMap[attend.meetingId] || '未知会议';
            return {
                ...attend,
                userName,
                meetingName
            };
        });

        console.log('扩展后的参会记录：', attends.value);
    } catch (error) {
        console.error('获取参会记录失败：', error);
        ElMessage.error('获取参会记录失败，请重试');
    }
};
attendsList();


const searchKey = ref({
    attendId: '',
    userName: '',
    meetingName: '',
    attendanceStatus: '',
    absentReason: ''
})

const resetOfKey = () => {
    searchKey.value.attendId = '',
        searchKey.value.userName = '',
        searchKey.value.meetingName = '',
        searchKey.value.attendanceStatus = '',
        searchKey.value.absentReason = ''
    attendsList();
}


const searchOfKey = async () => {


    let id = meetingId;
    let result = await attendsListService(id);
    attends.value = result.data;

    let meetRes = await meetListService();
    const meetsMap = meetRes.data.reduce((acc, meet) => {
        acc[meet.meetingId] = meet.meetingName;
        return acc;
    }, {});

    let orgRes = await organizationListService();

    let members = [];
    for (const org of orgRes.data) {
        let result = await memberService(org.organizationId);
        if (result.data) {
            members = members.concat(result.data);
        }
    }

    const userMap = {};
    members.forEach(member => {
        if (member.memberId !== undefined && member.memberName !== undefined) {
            userMap[parseInt(member.memberId, 10)] = member.memberName; 
        } else {
            console.warn(`成员数据缺失 userId 或 userName:`, member);
        }
    });

    // 扩展参会记录
    attends.value = attends.value.map(attend => {
        const userId = parseInt(attend.userId, 10) || 0;
        const userName = userMap[userId] || '未知成员';
        const meetingName = meetsMap[attend.meetingId] || '未知会议';
        return {
            ...attend,
            userName: userName, 
            meetingName: meetingName
        };
    });

    
    const searchAttendId = searchKey.value.attendId.trim();
    const searchUserName = searchKey.value.userName.trim().toLowerCase();
    const searchMeetingName = searchKey.value.meetingName.trim().toLowerCase();
    const searchAttendanceStatus = String(searchKey.value.attendanceStatus).trim();
    const searchAbsentReason = searchKey.value.absentReason.trim().toLowerCase();

    
    attends.value = attends.value.filter(attend => {
        let match = true;
        if (searchAttendId && attend.attendId.toString() !== searchAttendId) {
            match = false;
        }
        if (searchUserName && attend.userName.toLowerCase().indexOf(searchUserName) === -1) {
            match = false;
        }
        if (searchMeetingName && attend.meetingName.toLowerCase().indexOf(searchMeetingName) === -1) {
            match = false;
        }
        if (searchAttendanceStatus && attend.attendanceStatus.toString() !== searchAttendanceStatus) {
            match = false;
        }
        if (searchAbsentReason && attend.absentReason.toLowerCase().indexOf(searchAbsentReason) === -1) {
            match = false;
        }
        return match;
    });


}

import QrcodeVue from 'qrcode.vue'

const qrCodeData = computed(() => JSON.stringify({
    meetingId: setmeetModel.value.meetingId,
    startTime: setmeetModel.value.startTime,
    endTime: setmeetModel.value.endTime
}))

const qrcodeRef = ref(null)

const downloadQRCode = () => {
    try {
        
        if (!qrcodeRef.value?.$el) {
            ElMessage.warning('二维码尚未生成')
            return
        }

        const canvas = qrcodeRef.value.$el

        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('无效的二维码元素，请检查渲染模式')
        }

        const url = canvas.toDataURL('image/png')

        const a = document.createElement('a')
        a.download = `会议签到二维码-${setmeetModel.value.meetingId || '未命名会议'}.png`
        a.href = url

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        ElMessage.success('下载成功')
    } catch (error) {
        console.error('下载失败:', error)
        ElMessage.error(`下载失败: ${error.message}`)
    }
}

const agendaItems = ref([]);

const fetchAgenda = async () => {
    try {
        console.log('获取议程列表:', setmeetModel.value.meetingId)
        console.log(typeof meetingId)

        const res = await getTopicsService(meetingId)

        agendaItems.value = res.data
    } catch (error) {
        ElMessage.error('获取议程失败')
    }
}
fetchAgenda();

import {getMaterialService} from '../../api/meet'
const materialItems = ref([]);

const fetchMaterial = async () => {
    try {
        const res = await getMaterialService(meetingId)
        materialItems.value = res.data
        console.log('获取的会议资料',materialItems.value)
      
    }catch (error) {
        console.error('获取会议资料失败:', error)
}
}
fetchMaterial();

const handleMaterialClick = async (path) => {
    try {
        await navigator.clipboard.writeText(path);
        ElMessage.success('复制成功');
    } catch (error) {
        console.error('复制失败:', error);
        ElMessage.error('复制失败');
    }
};

</script>

<template>
    <div class="compact-detail">
        <div style="margin-bottom: 20px;font-size: 14px;" @click="$router.push('/meet/manage')">
            <el-icon>
                <ArrowLeft />
            </el-icon>
            <span><el-text type="primary">返回会议列表</el-text></span>
        </div>
        <el-descriptions title="会议详情" :column="3" border size="small" class="compact-descriptions">
            <el-descriptions-item label="会议ID">
                {{ setmeetModel.meetingId || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="会议名称">
                {{ setmeetModel.meetingName || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="会议状态">
                <el-tag size="small" :type="statusTagType">
                    {{ getMeetingStatusText(setmeetModel.meetingStatus) }}
                </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="开始时间">
                {{ dayjs(setmeetModel.startTime).format('YYYY-MM-DD HH:mm') }}
            </el-descriptions-item>

            <el-descriptions-item label="结束时间">
                {{ dayjs(setmeetModel.endTime).format('YYYY-MM-DD HH:mm') }}
            </el-descriptions-item>

            <el-descriptions-item label="持续时长">
                {{ duration }}
            </el-descriptions-item>

            <el-descriptions-item label="会议类型">
                <el-tag size="small" type="info">
                    {{ getMeetingTypeText(setmeetModel.meetingType) }}
                </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="最大人数">
                <el-text type="primary">{{ setmeetModel.maxNumber }}</el-text>
            </el-descriptions-item>

            <el-descriptions-item label="公开会议">
                <el-text :type="setmeetModel.isPublic === 1 ? 'success' : 'danger'">
                    {{ setmeetModel.isPublic === 1 ? '是' : '否' }}
                </el-text>
            </el-descriptions-item>

            <el-descriptions-item label="会议地点" :span="2">
                <el-text>{{ setmeetModel.meetingLocation || '-' }}</el-text>
            </el-descriptions-item>

            <el-descriptions-item label="参会人员" :span="3">
                <div class="attendees">
                    <el-tag v-for="(attendee, index) in attends" :key="index" size="small" class="mr-1 mb-1">
                        {{ attendee.userName }}
                    </el-tag>
                </div>
            </el-descriptions-item>

            <el-descriptions-item label="会议主题" :span="3">
                <el-text class="theme-text">{{ setmeetModel.theme }}</el-text>
            </el-descriptions-item>

            <el-descriptions-item label="签到二维码" :span="3">
                <div class="qrcode-container">
                    <div v-if="setmeetModel.meetingId" class="qrcode-wrapper">
                        <QrcodeVue ref="qrcodeRef" :value="qrCodeData" :size="160" level="H" class="qrcode"
                            render-as="canvas" />
                        <div class="time-info">
                            <p>{{ dayjs(setmeetModel.startTime).format('YYYY-MM-DD HH:mm') }}</p>
                            <p>至 {{ dayjs(setmeetModel.endTime).format('YYYY-MM-DD HH:mm') }}</p>
                        </div>
                        <el-button type="primary" size="small" @click="downloadQRCode" class="download-btn">
                            <el-icon>
                                <Download />
                            </el-icon>
                            下载二维码
                        </el-button>
                    </div>
                    <el-empty v-else description="未生成二维码" :image-size="60" />
                </div>
            </el-descriptions-item>

            <el-descriptions-item label="会场资料"  :span="3">
                <div style="width: 100%;">
                    <el-table :data = "materialItems" size="small" class="custom-table">
<!--                         <el-table-column  label="资料编号" width="100" prop = "materialCode"></el-table-column> -->
                    <el-table-column  label="资料名称" width="250" prop="materialName"></el-table-column>
                    <el-table-column  label="资料链接（点击即可复制）" width="900" >
                        <template #default="{ row }">
                            <el-link type="primary" @click="handleMaterialClick(row.materialPath)"
                                class="meeting-link truncate">
                                {{ row.materialPath }}
                            </el-link>
                        </template>
                    </el-table-column>

                </el-table>
                </div>

            </el-descriptions-item>

            <el-descriptions-item label="会议议程" :span="3">
                <div class="form-actions" style="margin-bottom: 10px; margin-top: 10px;">
                    <div style="width: 1040px;"></div>
                    <el-button type="primary" size="small" @click="uploadConform" plain>
                        <el-icon>
                            <Download />
                        </el-icon>
                    </el-button>
                    <el-button type="warning" size="small" @click="shareItem" plain>
                        <el-icon>
                            <Share />
                        </el-icon>
                    </el-button>
                </div>

                <div class="agenda-list">
                    <el-table :data="agendaItems" border size="small" class="custom-table">
                        <el-table-column label="议程ID" width="90" prop="topicId"></el-table-column>
                        <el-table-column label="议程名称" width="170" prop="topicName"></el-table-column>
                        <el-table-column label="开始时间" width="130" prop="startTime"></el-table-column>
                        <el-table-column label="结束时间" width="130" prop="endTime"></el-table-column>
                        <el-table-column label="议程内容" width="510" prop="content"
                            show-overflow-tooltip></el-table-column>
                        <el-table-column label="主持人" prop="speaker"></el-table-column>
                        <template #empty>
                            <div class="empty-container">
                                <el-empty description="暂无议程记录" :image-size="80" />
                            </div>
                        </template>
                    </el-table>
                </div>
            </el-descriptions-item>

        </el-descriptions>
    </div>

    <div class="records-container">
        <div class="records-header">
            <el-descriptions :column="1" title="参会记录" border size="small" class="compact-descriptions">


                <!-- <el-descriptions-item  label="">
                <h3 class="records-title">参会记录</h3>
            </el-descriptions-item> -->

                <template #extra>
                    <div class="header-actions">
                        <!-- 搜索表单 -->
                        <el-form :model="searchKey" class="search-form">
                            <el-row :gutter="8">
                                <el-col :xs="24" :sm="12" :md="6">
                                    <el-input v-model="searchKey.attendId" placeholder="记录ID" size="small"
                                        style="width: 100px" />
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="6">
                                    <el-input v-model="searchKey.userName" placeholder="成员" size="small"
                                        style="width: 100px" />
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="6">
                                    <el-select v-model="searchKey.attendanceStatus" placeholder="状态" size="small"
                                        style="width: 110px">
                                        <el-option v-for="option in attendanceStatusOptions" :key="option.value"
                                            :label="option.label" :value="option.value" />
                                    </el-select>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="6">
                                    <div class="form-actions">
                                        <el-button type="primary" size="small" @click="searchOfKey" plain>
                                            <el-icon>
                                                <Search />
                                            </el-icon>
                                        </el-button>
                                        <el-button type="warning" size="small" @click="resetOfKey" plain>
                                            <el-icon>
                                                <Refresh />
                                            </el-icon>
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </template>


            </el-descriptions>



        </div>


        <!-- 参会记录表格 -->
        <div class="compact-table">
            <el-table :data="attends" border size="small" class="custom-table">
                <!-- 列定义 -->
                <el-table-column label="记录ID" width="80" prop="attendId" align="center"></el-table-column>
                <el-table-column label="成员姓名" width="100" prop="userName"></el-table-column>
                <el-table-column label="参会状态" width="100" prop="attendanceStatus" align="center">
                    <template #default="{ row }">
                        <el-tag size="small" :type="getStatusTagType(row.attendanceStatus)">
                            {{ attendsTypeText(row.attendanceStatus) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="参会时间" width="160" prop="attendTime"></el-table-column>
                <el-table-column label="离会时间" width="160" prop="leaveTime"></el-table-column>
                <el-table-column label="缺席原因" prop="absentReason" show-overflow-tooltip></el-table-column>
                <template #empty>
                    <div class="empty-container">
                        <el-empty description="暂无参会记录" :image-size="80" />
                    </div>
                </template>
            </el-table>
        </div>
    </div>
</template>

<style scoped>
.compact-detail {
    padding: 12px;
    background: #fff;
    border-radius: 6px;
}

:deep(.compact-descriptions) {
    .el-descriptions__header {
        margin-bottom: 12px;

        .el-descriptions__title {
            font-size: 16px;
            font-weight: 600;
        }
    }

    .el-descriptions__body {
        .el-descriptions__table {

            th,
            td {
                padding: 8px 12px;
            }

            th {
                background: #f8f9fa;
                font-size: 13px;
            }

            td {
                font-size: 13px;
            }
        }
    }
}

.attendees {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.compact-pre {
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
    white-space: pre-wrap;
    background: #f8f9fa;
    padding: 8px;
    border-radius: 4px;
}

.theme-text {
    font-weight: 500;
    font-size: 14px;
}

.compact-image {
    text-align: center;
    padding: 6px;
}

.layout-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
    border: 1px solid #eee;
}

.mr-1 {
    margin-right: 4px;
}

.mb-1 {
    margin-bottom: 4px;
}


.compact-table {
    margin-top: 20px;
    background: #fff;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

:deep(.custom-table) {
    --el-table-border-color: #ebeef5;
    --el-table-header-bg-color: #f8f9fa;
    --el-table-row-hover-bg-color: #fafafa;

    th.el-table__cell {
        background-color: #f8f9fa;
        font-size: 13px;
        color: #606266;
        font-weight: 600;
    }

    td.el-table__cell {
        font-size: 13px;
        padding: 8px 0;
    }

    .cell {
        padding: 0 12px;
        line-height: 1.4;
    }

    .el-tag {
        margin: 2px 0;
    }

    .el-button {
        margin: 0 4px;
        padding: 6px;
    }
}

.empty-container {
    padding: 40px 0;

    :deep(.el-empty__description) {
        margin-top: 8px;
        font-size: 13px;
        color: #909399;
    }
}

:deep(.el-tag) {
    &--success {
        background: var(--el-color-success-light-9);
        border-color: var(--el-color-success-light-7);
    }

    &--warning {
        background: var(--el-color-warning-light-9);
        border-color: var(--el-color-warning-light-7);
    }

    &--danger {
        background: var(--el-color-danger-light-9);
        border-color: var(--el-color-danger-light-7);
    }

    &--info {
        background: var(--el-color-info-light-9);
        border-color: var(--el-color-info-light-7);
    }
}

.records-container {
    margin-top: 24px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.records-header {
    padding: 16px 20px 0;
}

.records-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #303133;
    font-weight: 600;
}

.search-form {
    .el-form-item {
        margin-bottom: 0;
    }

    .el-input__inner,
    .el-select__wrapper {
        height: 32px;
        line-height: 32px;
    }

    .el-row {
        align-items: center;
    }
}


.form-actions {
    display: flex;
    gap: 6px;
    margin-left: 8px;

    .el-button {
        padding: 6px 8px;
    }
}

.qrcode-container {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    margin-top: 8px;
    transition: all 0.3s ease;

}

.qrcode-wrapper {
    position: relative;
    padding: 16px;
    background: white;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    text-align: center;
}

.download-btn {
    margin-top: 12px;
    width: 100%;

    transition: all 0.2s;

    &:active {
        transform: scale(0.98);
    }

    &.is-loading {
        opacity: 0.7;
        pointer-events: none;
    }
}

.qrcode {
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 8px;
    background: white;
}

@media (max-width: 768px) {
    .download-btn {
        padding: 8px;
        font-size: 12px;
    }
}

.time-info {
    margin-top: 8px;
    text-align: center;
    font-size: 12px;
    color: #606266;

    p {
        margin: 2px 0;
        line-height: 1.4;
    }
}

.compact-image {
    margin-top: 8px;
}


@media (max-width: 768px) {
    .qrcode-wrapper {
        padding: 8px;

        .qrcode {
            width: 120px;
            height: 120px;
        }
    }

    .time-info {
        font-size: 11px;
    }
}
</style>