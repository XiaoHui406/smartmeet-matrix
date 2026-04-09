<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Edit, Delete, Plus, ArrowLeft, Search, Refresh, Select } from '@element-plus/icons-vue';
import { meetDetailService, meetListService } from '../../api/meet';
import { useTokenStore } from '../../stores/token';
import { attendsListService, meeSertchService, deleteAttendsService, updateAttendService, uploadService } from '../../api/meet';
import { memberService } from '../../api/member';
import { organizationListService } from '../../api/organization';
import { ElMessage } from 'element-plus';
import { useMeetStore } from '@/stores/meet'
import { storeToRefs } from 'pinia'
const meetStore = useMeetStore()
const { enableSign, currentMeeting, getSignTimes } = storeToRefs(meetStore)

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
    materials: '',
    isPublic: '',
    enableSign: getSignTimes.value.enableSign, 
    signStartTime: getSignTimes.value.signStart,
    signEndTime: getSignTimes.value.signEnd,
    signEndTime: getSignTimes.value.signEnd,
});


const rules = {
    signStartTime: [
        {
            required: true,
            validator: (rule, value, callback) => {
                if (setmeetModel.value.enableSign && !value) {
                    callback(new Error('请选择签到开始时间'));
                } else {
                    callback();
                }
            },
            trigger: 'change'
        }
    ],
    signEndTime: [
        {
            required: true,
            validator: (rule, value, callback) => {
                if (setmeetModel.value.enableSign && !value) {
                    callback(new Error('请选择签到结束时间'));
                } else {
                    callback();
                }
            },
            trigger: 'change'
        },
        {
            validator: (rule, value, callback) => {
                if (setmeetModel.value.enableSign &&
                    setmeetModel.value.signStartTime &&
                    new Date(value) < new Date(setmeetModel.value.signStartTime)) {
                    callback(new Error('结束时间不能早于开始时间'));
                } else {
                    callback();
                }
            },
            trigger: 'change'
        }
    ]
}

const getMeetDetail = async () => {
    const meetId = parseInt(meetingId);
    let res = await meetDetailService(meetId);
    setmeetModel.value = res.data;
}
getMeetDetail();

const attends = ref([]);


const handleSave = async () => {
    let result = await meeSertchService(setmeetModel.value)
    ElMessage.success('保存成功');
};

const handleCancel = () => {
    ElMessage.info('已取消编辑');
};


const attendsList = async () => {
    try {
        // 获取参会记录表
        let id = meetingId;
        let result = await attendsListService(id);
        attends.value = result.data;

        // 获取会议列表
        let meetRes = await meetListService();
        const meetsMap = meetRes.data.reduce((acc, meet) => {
            acc[meet.meetingId] = meet.meetingName;
            return acc;
        }, {});

        console.log('会议映射表：', meetsMap);

        // 获取组织列表
        let orgRes = await organizationListService();

        // 获取成员列表
        let members = [];
        for (const org of orgRes.data) {
            let result = await memberService(org.organizationId);
            if (result.data) {
                members = members.concat(result.data);
            }
        }

        console.log('获取到的成员列表：', members);

        // 构建 userMap
        const userMap = {};
        members.forEach(member => {
            if (member.memberId !== undefined && member.memberName !== undefined) {
                userMap[parseInt(member.memberId, 10)] = member.memberName;
            } else {
                console.warn(`成员数据缺失 memberId 或 memberName:`, member);
            }
        });

        console.log('用户映射表：', userMap);

        // 扩展参会记录
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

const attendModel = ref({
    userId: '',
    meetingId: '',
    attendanceStatus: '',
    attendTime: null,
    leaveTime: null,
    absentReason: ''
})

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
            userMap[parseInt(member.memberId, 10)] = member.memberName; // 确保 userId 是数字类型
        } else {
            console.warn(`成员数据缺失 userId 或 userName:`, member);
        }
    });

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

    // 过滤条件
    const searchAttendId = searchKey.value.attendId.trim();
    const searchUserName = searchKey.value.userName.trim().toLowerCase();
    const searchMeetingName = searchKey.value.meetingName.trim().toLowerCase();
    const searchAttendanceStatus = String(searchKey.value.attendanceStatus).trim();
    const searchAbsentReason = searchKey.value.absentReason.trim().toLowerCase();

    // 过滤参会记录
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

const showAttendsDialog = async (row) => {
    updataItemDialogVisible.value = true;
    attendModel.value.attendanceStatus = row.attendanceStatus;
    attendModel.value.absentReason = row.absentReason;
    attendModel.value.userId = row.userId; // 确保 userId 存在
    attendModel.value.meetingId = row.meetingId;
    attendModel.value.attendTime = row.attendTime;
    attendModel.value.leaveTime = row.leaveTime;
    console.log('弹窗数据:', attendModel.value);

}

const updataItemDialogVisible = ref(false)

import { ElMessageBox } from 'element-plus';
//删除成员
const deleteAttends = async (row) => {
    //提示框
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
            //调用删除接口
            let result = await deleteAttendsService(row.attendId);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            attendsList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })

}

//更新参会记录
const updateAttend = async () => {
    try {
        const userId = parseInt(attendModel.value.userId, 10);
        const meetingId = parseInt(attendModel.value.meetingId, 10);
        const attendanceStatus = parseInt(attendModel.value.attendanceStatus, 10);
        const attendTime = attendModel.value.attendTime ? dayjs(attendModel.value.attendTime).format('YYYY/MM/DD HH:mm:ss') : null;
        const leaveTime = attendModel.value.leaveTime ? dayjs(attendModel.value.leaveTime).format('YYYY/MM/DD HH:mm:ss') : null;
        const absentReason = attendModel.value.absentReason || null;

        console.log('updata数据:', userId, meetingId, attendanceStatus);
        console.log('attendTime:', attendTime);
        console.log('leaveTime:', leaveTime);

        let result = await updateAttendService(userId, meetingId, attendanceStatus, attendTime, leaveTime, absentReason);
        console.log('updata接口响应:', result);

        ElMessage.success('修改成功');

        attendsList();

        updataItemDialogVisible.value = false;
    } catch (error) {
        console.error('更新参会记录失败：', error);
        ElMessage.error('更新参会记录失败，请重试');
    }
}

const agendaItems = ref([]);

const getChineseNumber = (num) => {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return num <= 10 ? `议程${chineseNumbers[num - 1]}` : `议程${num}`;
};


const addAgendaItem = () => {
    agendaItems.value.push({
        topicId: '',
        startTime: '',
        endTime: '',
        content: '',
        speaker: '',
        topicName: ''
    });
};

const resetAgendaItem = (index) => {
    agendaItems.value[index] = {
        startTime: '',
        endTime: '',
        content: '',
        speaker: '',
        topicName: ''
    };
};
import { getTopicsService } from '../../api/meet'
const fetchTopicItems = async () => {
    try {
        const id = parseInt(meetingId)
        const res = await getTopicsService(id);
        if (res && Array.isArray(res.data)) {
            agendaItems.value = res.data;
            console.log('获取议程成功:', agendaItems.value);
        } else {
            ElMessage.error('获取议程失败');
        }
    } catch (error) {
        console.error('获取议程失败:', error);
        ElMessage.error('获取议程失败');
    }
}
fetchTopicItems();

const SaveListItem = (item, index) => {
    // 验证必填字段
    if (!item.startTime || !item.endTime || !item.speaker || !item.content) {
        ElMessage.warning('请填写所有必填字段');
        return;
    }
    //获取填写的信息并暂时保存在数据模型中，用于显示在表格中
    agendaItems.value[index] = {
        /*  topicId: index + 1, */
        startTime: item.startTime,
        endTime: item.endTime,
        content: item.content,
        speaker: item.speaker,
        topicName: item.topicName
    };
    console.log('保存的议程数据:', agendaItems.value);

}
import { updateTopicService, addTopicService } from '../../api/meet'

const updateListItem = async (item) => {
    try {
        const id = parseInt(item.topicId)
        const params = {
            topicId: id,
            startTime: dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
            speaker: item.speaker,
            content: item.content,
            topicName: item.topicName || `议程${dayjs(item.startTime).format('HH:mm')}`
        };

        // 调试输出
        console.log(item);
        console.log('提交参数:', JSON.stringify(params, null, 2));
        await updateTopicService(params);


        ElMessage.success('议程修改成功');
        await fetchTopicItems();
    } catch (error) {
        console.error('修改失败:', error);
        ElMessage.error(`修改失败: ${error.response?.data?.message || '服务器错误'}`);
    }
}

import { deleteTopicService } from '../../api/meet'
const removeAgendaItem = async (index) => {
    try {
        await ElMessageBox.confirm('确认删除该议程吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const agendaItem = agendaItems.value[index];

        // 分情况处理
        if (agendaItem.topicId) {
            // 已保存的议程：调用接口删除
            await deleteTopicService(agendaItem.topicId);
            ElMessage.success('服务器数据已删除');
        } else {
            // 未保存的议程：仅本地删除
            ElMessage.warning('未保存的议程已移除');
        }

        // 无论哪种情况都移除本地数据
        agendaItems.value.splice(index, 1);

    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
            ElMessage.error(`删除失败: ${error.response?.data?.message || '操作异常'}`);
        }
    }
};

onMounted(async () => {
    try {
        await meetStore.fetchMeeting(route.params.id)
        // 如果store中没有数据，使用API数据初始化
        if (!currentMeeting.value) {
            const res = await meetDetailService(route.params.id)
            meetStore.setCurrentMeeting(res.data)
        }
    } catch (error) {
        ElMessage.error('加载会议数据失败')
    }
})


import { addMaterialService, deleteMaterialService, getMaterialService } from '../../api/meet'

const materialItems = ref([]);


const fetchMaterial = async () => {
    try {
        const res = await getMaterialService(meetingId)
        materialItems.value = res.data
        console.log('获取的会议资料', materialItems.value)

    } catch (error) {
        console.error('获取会议资料失败:', error)
    }
}
fetchMaterial();

const handleMaterialClick = async (path) => {
    //点击复制
    try {
        await navigator.clipboard.writeText(path);
        ElMessage.success('复制成功');
    } catch (error) {
        console.error('复制失败:', error);
        ElMessage.error('复制失败');
    }
};

const materialList = ref([]);

const uploadMaterialSuccess = async (response, uploadFile) => {
    try {
        setmeetModel.value.materials = response.data
        console.log('上传的文件链接:', setmeetModel.value.materials)
        const materialType = setmeetModel.value.materials.split('.').pop().toLowerCase();
        console.log('文件类型:', materialType)

        const params = {
            meetingId: meetingId,
            materialName: uploadFile.name,
            materialPath: setmeetModel.value.materials,
            materialCode: '',
            materialType: materialType,
        }
        //调用接口
        await addMaterialService(params)
        ElMessage.success('文件上传成功')
        fetchMaterial();
    } catch (error) {
        console.error('文件上传失败:', error)
        ElMessage.error('文件上传失败')
    }
}

const handleMaterialRemove = async (row) => {
    //提示框
    ElMessageBox.confirm(
        '确认删除该会议资料吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用会议删除接口
            const id = parseInt(row.materialId)
            await deleteMaterialService(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            console.log('删除的资料id', id)
            fetchMaterial();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
};

const uploadSuccess = async (response, uploadFile) => {  // 修改处2：添加标准回调参数
    try {
        setmeetModel.value.layout = response.data;  // 修改处3：根据接口返回结构
        ElMessage.success('上传成功');
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    }
};
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
        ElMessage.error('只能上传图片文件');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5MB');
        return false;
    }
    return true;
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

        <el-descriptions title="会议详情 -- (编辑)" :column="3" border size="small" :rules='rules'
            class="compact-descriptions">

            <template #extra>
                <div class="header-actions">
                    <el-button type="primary" size="small" :icon="Edit" @click="handleSave" class="action-btn">
                        保存修改
                    </el-button>
                    <el-button type="info" size="small" :icon="Delete" @click="handleCancel" class="action-btn">
                        取消编辑
                    </el-button>
                </div>
            </template>

            <el-descriptions-item label="会议ID">
                <el-input v-model="setmeetModel.meetingId" disabled placeholder="会议ID" class="compact-input" />
            </el-descriptions-item>

            <el-descriptions-item label="会议名称">
                <el-input v-model="setmeetModel.meetingName" placeholder="请输入会议名称" class="compact-input" />
            </el-descriptions-item>

            <el-descriptions-item label="会议状态">
                <el-select v-model="setmeetModel.meetingStatus" placeholder="选择状态" class="compact-select">
                    <el-option v-for="option in meetingStatusOptions" :key="option.value" :label="option.label"
                        :value="option.value" />
                </el-select>
            </el-descriptions-item>

            <el-descriptions-item label="开始时间">
                <el-date-picker v-model="setmeetModel.startTime" type="datetime" format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择开始时间" class="compact-date" />
            </el-descriptions-item>

            <el-descriptions-item label="结束时间">
                <el-date-picker v-model="setmeetModel.endTime" type="datetime" format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束时间" class="compact-date" />
            </el-descriptions-item>

            <el-descriptions-item label="持续时长">
                {{ duration }}
            </el-descriptions-item>

            <el-descriptions-item label="会议类型">
                <el-select v-model="setmeetModel.meetingType" placeholder="选择类型" class="compact-select">
                    <el-option v-for="option in meetingTypeOptions" :key="option.value" :label="option.label"
                        :value="option.value" />
                </el-select>
            </el-descriptions-item>

            <el-descriptions-item label="最大人数">
                <el-input-number v-model="setmeetModel.maxNumber" :min="1" controls-position="right"
                    class="compact-number" />
            </el-descriptions-item>

            <el-descriptions-item label="公开会议">
                <el-select v-model="setmeetModel.isPublic" placeholder="选择公开状态" class="compact-select">
                    <el-option v-for="option in meetIsPublicOptions" :key="option.value" :label="option.label"
                        :value="option.value" />
                </el-select>
            </el-descriptions-item>

            <el-descriptions-item label="会议地点" :span="2">
                <el-input v-model="setmeetModel.meetingLocation" placeholder="输入会议地址" class="compact-input" />
            </el-descriptions-item>

            <el-descriptions-item label="会议主题" :span="3">
                <el-input v-model="setmeetModel.theme" placeholder="输入会议主题" class="compact-input" />
            </el-descriptions-item>

            <el-descriptions-item label="启用签到" :span="3" prop="signStartTime,signEndTime">
                <div class="signin-settings">
                    <el-switch v-model="setmeetModel.enableSign" active-text="启用" inactive-text="停用" />

                    <div v-if="setmeetModel.enableSign" class="time-pickers">
                        <el-form-item label="签到开始时间" prop="signStartTime">
                            <el-date-picker v-model="setmeetModel.signStartTime" type="datetime"
                                format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择签到开始时间"
                                :disabled-date="disabledSignDate" :default-value="currentMeeting?.signStartTime" />
                        </el-form-item>

                        <el-form-item label="签到结束时间" prop="signEndTime">
                            <el-date-picker v-model="setmeetModel.signEndTime" type="datetime" format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择签到结束时间"
                                :disabled-date="disabledSignDate" :default-value="currentMeeting?.signEndTime" />
                        </el-form-item>
                    </div>
                </div>
            </el-descriptions-item>

            <!-- 会议资料 -->
            <el-descriptions-item label="会议资料" :span="3">
                <div class="material-section">
                    <div class="compact-file">
                        <el-upload class="material-uploader" :action="'/api/upload'"
                            :headers="{ Authorization: tokenStore.token }" :on-success="uploadMaterialSuccess"
                         multiple 
                            :disabled="!tokenStore.token">
                            <template #trigger>
                                <el-button type="primary" size="small">上传资料</el-button>
                            </template>    
                        </el-upload>
                    </div>
                    <div class="material-table">
                        <el-table :data="materialItems" size="small" class="custom-table">
                            <el-table-column label="资料名称" width="250" prop="materialName"></el-table-column>
                            <el-table-column label="资料链接（点击即可复制）" width="800">
                                <template #default="{ row }">
                                    <el-link type="primary" @click="handleMaterialClick(row.materialPath)"
                                        class="meeting-link truncate">
                                        {{ row.materialPath }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template #default="{ row }">
                                    <el-button type="danger" size="small" :icon="Delete" circle
                                        @click="handleMaterialRemove(row)" />
                                </template>
                            </el-table-column>
                        </el-table>
                     
                    </div>

                </div>

            </el-descriptions-item>
        </el-descriptions>

        <div>
            <div class="agenda-section" style="margin-top: 20px;">
                <div class="agenda-header">
                    <h4>会议议程管理</h4>
                </div>
            </div>
        </div>

        <div class="agenda-list">
            <div class="agenda-container">
                <div v-for="(item, index) in agendaItems" :key="index" class="agenda-item">
                    <div class="agenda-header">
                        <span class="agenda-number">{{ getChineseNumber(index + 1) }}：</span>
                        <!-- 修改按钮 -->
                        <el-button size="small" type="success" :icon="Edit" circle @click="updateListItem(item)" />

                        <el-button v-if="index === 0" size="small" type="info" :icon="Refresh" circle
                            @click="resetAgendaItem(index)" />
                        <el-button v-else size="small" type="danger" :icon="Delete" circle
                            @click="removeAgendaItem(index)" />
                    </div>
                    <el-row :gutter="16" class="agenda-row">
                        <el-col :xs="24" :sm="12" :md="4">

                            <el-date-picker v-model="item.startTime" type="datetime" format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"
                                :disabled-date="disabledSignDate" />

                        </el-col>
                        <el-col :xs="24" :sm="12" :md="4">

                            <el-date-picker v-model="item.endTime" type="datetime" format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"
                                :disabled-date="disabledSignDate" />

                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12">
                            <el-input v-model="item.content" placeholder="议程内容" class="agenda-input" />
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="3">
                            <el-input v-model="item.speaker" placeholder="主持人" class="agenda-input" />
                        </el-col>


                    </el-row>
                </div>
            </div>
        </div>
    </div>

    <div class="records-container">
        <div class="records-header">
            <el-descriptions :column="1" title="参会记录" border size="small" class="compact-descriptions">

                <template #extra>
                    <div class="header-actions">
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

        <div class="compact-table">
            <el-table :data="attends" border size="small" class="custom-table">
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
                <el-table-column label="操作" width="120">
                    <template #default="{ row }">

                        <div class="table-actions">
                            <el-button type="primary" link
                                @click="showAttendsDialog(row); updataItemDialogVisible = true" class="action-icon">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                            </el-button>
                            <el-button type="danger" link @click="deleteAttends(row)" class="action-icon">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>

                    </template>
                </el-table-column>
                <template #empty>
                    <div class="empty-container">
                        <el-empty description="暂无参会记录" :image-size="80" />
                    </div>
                </template>
            </el-table>
        </div>
    </div>

    <el-dialog v-model="updataItemDialogVisible" title="修改参会记录" width="30%">
        <el-form :model="attendModel" :rules="attendRules" label-width="100px" style="padding-right: 30px">

            <el-form-item label="参议状态" prop="attendanceStatus">
                <el-select v-model="attendModel.attendanceStatus" style="width: 150px" placeholder="请选择状态">
                    <el-option v-for="option in attendanceStatusOptions" :key="option.value" :label="option.label"
                        :value="option.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="缺席原因" prop="absentReason">
                <el-input v-model="attendModel.absentReason" minlength="1" maxlength="15"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="updataItemDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateAttend()"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.compact-detail {
    padding: 12px;
    background: #fff;
    border-radius: 6px;
}

:deep(.compact-descriptions) {
    .el-descriptions__header {

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

.avatar-uploader {
    :deep(.el-upload) {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);

        &:hover {
            border-color: var(--el-color-primary);
        }
    }
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 180px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
}

.layout-image {
    width: 300px;
    height: 180px;
    object-fit: contain;
    display: block;
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
    margin-top: 30px;

    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .records-header {
        padding: 16px 20px 8px;

        :deep(.compact-descriptions) {
            .el-descriptions__header {
                margin-bottom: 8px;
            }
        }
    }
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

.records-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
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

.compact-input :deep(.el-input__inner) {
    border: none;
    padding: 0;
    background: transparent;
}

.compact-input :deep(.el-input__inner):focus {
    background: #fff;
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.compact-select :deep(.el-select__wrapper) {
    box-shadow: none;
    background: transparent;
}

.compact-select :deep(.el-select__wrapper):hover {
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.compact-date :deep(.el-input__inner) {
    border: none;
    padding-left: 0;
}

.compact-number :deep(.el-input-number__decrease),
.compact-number :deep(.el-input-number__increase) {
    background: transparent;
}

:deep(.compact-descriptions) {
    .el-descriptions__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .el-descriptions__title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }
    }
}

.header-actions {
    display: flex;
    gap: 8px;
    margin-left: 20px;
}

.action-btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }
}

.signin-settings {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.time-pickers {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 12px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

:deep(.el-form-item) {
    margin-bottom: 0;
}

:deep(.el-switch__text) {
    color: var(--el-text-color-regular);
    font-size: 14px;
}

@media (max-width: 768px) {
    .time-pickers {
        grid-template-columns: 1fr;
    }
}

.agenda-container {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 16px;
    background: #f8f9fa;
}

.agenda-item {
    padding: 16px;
    margin-bottom: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:last-child {
        margin-bottom: 0;
    }
}


.agenda-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .agenda-number {
        font-weight: 500;
        color: var(--el-color-primary);
        flex-grow: 1;
    }
}

.agenda-row {
    align-items: center;

    .el-col {
        margin-bottom: 12px;


        @media (min-width: 768px) {
            margin-bottom: 0;
        }
    }
}

.agenda-input :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
    border-radius: 4px;
    height: 32px;
    padding: 1px 11px;
    transition: all 0.2s;
}

.agenda-input :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.agenda-input :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    border-color: var(--el-color-primary);
}

.agenda-input :deep(.el-date-editor) {
    --el-date-editor-width: 100%;
}

.agenda-input :deep(.el-date-editor .el-input__wrapper) {
    padding: 0 11px;
}

.agenda-row {
    margin-bottom: -10px;

    .el-col {
        padding-bottom: 10px;
    }
}

.action-buttons {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
}


@media (max-width: 768px) {
    .agenda-header {
        flex-wrap: wrap;
        gap: 8px;

        .agenda-number {
            width: 100%;
        }

        .action-buttons {
            justify-content: flex-start;
        }
    }

    .agenda-input :deep(.el-date-editor) {
        width: 100%;
    }
}

.material-uploader {
    width: 100%;

    :deep(.el-upload-list) {
        margin-top: 8px;
        max-width: 500px;
    }
}

.material-file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #eee;

    .el-link {
        flex: 1;
        margin-right: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .delete-icon {
        cursor: pointer;
        color: #f56c6c;
        padding: 4px;
        border-radius: 4px;

        &:hover {
            background: #fef0f0;
        }
    }
}

.material-section {
    width: 100%;
    margin-top: 16px;
}

.material-table {
    margin-top: 16px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
    
    :deep(.el-table__header) th {
        background: #f8f9fa;
    }
}

.compact-file {
    margin-bottom: 16px;
    
    :deep(.el-upload-list) {
        max-width: 100%;
    }
}
</style>