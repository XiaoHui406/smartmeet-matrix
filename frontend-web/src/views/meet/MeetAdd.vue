<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Edit, Delete, Plus, ArrowLeft, Refresh, Position, Select, Promotion, EditPen, DeleteFilled, CirclePlusFilled } from '@element-plus/icons-vue';
import { meetDetailService, meetListService } from '../../api/meet';
import { useTokenStore } from '../../stores/token';
import { meetAddService } from '../../api/meet';
import { addInfoService } from '../../api/info'
import { AddAttendService, addTopicService, deleteTopicService } from '../../api/meet'


import { ElMessage, ElMessageBox } from 'element-plus';

const tokenStore = useTokenStore();
const route = useRoute();
import { useMeetStore } from '@/stores/meet'
const meetStore = useMeetStore()
const title = ref('');
const uploadRef = ref()
// 会议选项数据...
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
    meetingStatus: 1,
    maxNumber: 50,
    meetingType: 1,
    meetingLocation: '',
    theme: '',
    rule: '',
    diningService: '',
    agenda: '',
    generalContent: '',
    keyAttendees: '',
    layout: '',
    materials: '',
    isPublic: 1,
    enableSign: false,
    signStartTime: '',
    signEndTime: ''
});

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
    ],
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


const getMeetId = ref(0)

// 添加保存和取消方法
const handleSave = async () => {
    setmeetModel.value.agenda = agendaItems.value
        .map(item => `${item.date} ${item.startTime}-${item.endTime} | ${item.content} | ${item.location} | ${item.host}`)
        .join('\n');
    const params = {
        meetingName: setmeetModel.value.meetingName,
        startTime: dayjs(setmeetModel.value.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(setmeetModel.value.endTime).format('YYYY-MM-DD HH:mm:ss'),
        meetingStatus: setmeetModel.value.meetingStatus,
        maxNumber: setmeetModel.value.maxNumber,
        meetingType: setmeetModel.value.meetingType,
        meetingLocation: setmeetModel.value.meetingLocation,
        theme: setmeetModel.value.theme,
        rule: setmeetModel.value.rule,
        diningService: setmeetModel.value.diningService,
        agenda: setmeetModel.value.agenda,
        generalContent: setmeetModel.value.generalContent,
        keyAttendees: setmeetModel.value.keyAttendees,
        layout: setmeetModel.value.layout,
        isPublic: setmeetModel.value.isPublic,
    }

    try {
        let result = await meetAddService(params);
        if (result.data && result.data.meetingId) {
            getMeetId.value = result.data.meetingId;
            const meetId = parseInt(getMeetId.value);
            meetStore.setCurrentMeeting({
                ...result.data,
                enableSign: setmeetModel.value.enableSign,
                signStartTime: setmeetModel.value.signStartTime,
                signEndTime: setmeetModel.value.signEndTime
            });

            handleSubmit(meetId);
            ElMessage.success('添加成功');
        } else {
            ElMessage.error('会议ID获取失败');
        }
    } catch (error) {
        console.error('保存会议失败:', error);
        ElMessage.error('保存会议失败');
    }
};

const handleCancel = () => {
    setmeetModel.meetingId = '',
        setmeetModel.meetingName = '',
        setmeetModel.startTime = '',
        setmeetModel.endTime = '',
        setmeetModel.meetingStatus = 1,
        setmeetModel.maxNumber = 50,
        setmeetModel.meetingType = 1,
        setmeetModel.meetingLocation = '',
        setmeetModel.theme = '',
        setmeetModel.rule = '',
        setmeetModel.diningService = '',
        setmeetModel.agenda = '',
        setmeetModel.generalContent = '',
        setmeetModel.keyAttendees = '',
        setmeetModel.layout = '',
        setmeetModel.isPublic = 1
    ElMessage.info('已取消编辑');
};

//组织数据模型
const organizations = ref([])

const allMembers = ref([])         
const displayedMembers = ref([])   
const selectedMembers = ref(new Set()) 

const searchForm = ref({
    orgId: '',
    memberName: ''
})
const searchMember = ref({
    memberName: ''
})

import { organizationListService } from '../../api/organization'
const fetchOrganizations = async () => {
    const res = await organizationListService();
    organizations.value = res.data;
};

import { memberService } from '../../api/member'
import { isDateSpansEqual } from '@fullcalendar/core/internal';

const fetchMembers = async () => {
    if (!searchForm.value.orgId) return;
    const res = await memberService(searchForm.value.orgId);
    allMembers.value = res.data;
    filterMembers();
};
const filterMembers = () => {
    displayedMembers.value = allMembers.value.filter(member =>
        member.memberName.includes(searchForm.value.memberName)
    )
};

const handleSearch = () => {
    filterMembers();
};

const handleReset = () => {
    searchForm.value.memberName = '';
    filterMembers();
};
const toggleMember = (member) => {
    if (selectedMembers.value.has(member.memberId)) {
        selectedMembers.value.delete(member.memberId);
    } else {
        selectedMembers.value.add(member.memberId);
    }
};
const handleSubmit = async (meetingId) => {
    if (selectedMembers.value.size === 0) {
        return ElMessage.warning('请至少添加一个参会成员');
    }

    const meetId = parseInt(meetingId)
    console.log('meetId', meetId)

    const formData = {
        ...setmeetModel.value,
        members: Array.from(selectedMembers.value)
    };

    const menberIds = Array.from(selectedMembers.value)
    console.log('选择的成员ID数组 ', menberIds)
    for (const memberId of menberIds) {
        const result = await addInfoService(memberId, '您有新的会议邀请', '会议邀请', new Date(new Date().toISOString()).toISOString().slice(0, 19).replace('T', ' '))
        console.log('发送成功', result)
        const res = await AddAttendService(memberId, meetId, 1)
        console.log('添加成员到会议记录成功', res)
    }
};

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
const SaveListItem = (item, index) => {
    // 验证必填字段
    if (!item.startTime || !item.endTime || !item.speaker || !item.content) {
        ElMessage.warning('请填写所有必填字段');
        return;
    }
    //获取填写的信息并暂时保存在数据模型中，用于显示在表格中
    agendaItems.value[index] = {
        topicId: index + 1,
        startTime: item.startTime,
        endTime: item.endTime,
        content: item.content,
        speaker: item.speaker,
        topicName: item.topicName
    };
    console.log('保存的议程数据:', agendaItems.value);

}
const handleSaveList = async () => {
    try {
        for (const item of agendaItems.value) {
            if (item.topicId != undefined) {
                const params = {
                    meetingId: getMeetId.value,
                    startTime: dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
                    endTime: dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
                    speaker: item.speaker,
                    content: item.content,
                    topicName: item.topicName
                };

                // 调用接口
                const res = await addTopicService(params);

            } else {
                console.log('topicId未定义')
                ElMessage.error('议程ID未定义')
            }
        }

        ElMessage.success('议程提交成功');

    } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error(`保存失败: ${error.response?.data?.message || '服务器错误'}`);
    }
};
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


onMounted(() => {
    fetchOrganizations();
    fetchOrganizations()
    // fetchAgenda() // 初始化获取议程
});

const selectAll = () => {
    displayedMembers.value.forEach(member => {
        selectedMembers.value.add(member.memberId)
    })
}

const invertSelection = () => {
    displayedMembers.value.forEach(member => {
        if (selectedMembers.value.has(member.memberId)) {
            selectedMembers.value.delete(member.memberId)
        } else {
            selectedMembers.value.add(member.memberId)
        }
    })
}

const selectedMemberDetails = computed(() => {
    return Array.from(selectedMembers.value).map(id =>
        allMembers.value.find(m => m.memberId === id))
})

const selectedMemberIds = Array.from(selectedMembers.value)
console.log('获取的数组 ', selectedMemberIds)
const materialFileList = ref([]);


import { addMaterialService, deleteMaterialService, getMaterialService } from '../../api/meet'

const materialItems = ref([]);
const fetchMaterial = async () => {
    try {
        const id = parseInt(getMeetId.value)
        const res = await getMaterialService(id)
        materialItems.value = res.data
        console.log('获取的会议资料', materialItems.value)

    } catch (error) {
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
const uploadMaterialSuccess = async (response, uploadFile) => {
    try {
        setmeetModel.value.materials = response.data
        console.log('上传的文件链接:', setmeetModel.value.materials)
        const materialType = setmeetModel.value.materials.split('.').pop().toLowerCase();
        console.log('文件类型:', materialType)
        const id = parseInt(getMeetId.value)
        console.log('文件资料ID:', id)
        const params = {
            meetingId: id,
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
const uploadSuccess = async (response, uploadFile) => { 
    try {
        
        setmeetModel.value.layout = response.data;
        console.log('上传的文件链接:', setmeetModel.value.layout)
        const materialType = setmeetModel.value.materials.split('.').pop().toLowerCase();
        console.log('文件类型:', materialType)
        const id = parseInt(getMeetId.value)
        console.log('文件资料ID:', id)
        const params = {
            meetingId: id,
            materialName: uploadFile.name,
            materialPath: setmeetModel.value.layout,
            materialCode: '',
            materialType: materialType,
        }
        //调用接口
        await addMaterialService(params)
        ElMessage.success('会议布局上传成功')
        fetchMaterial();
        ElMessage.success('布局上传成功');
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

//智能创建
import {AIMeetingSummaryService} from '../../api/meet'
const drawer = ref(false)

import { userInfoStore } from '../../stores/userInfo'
const usersInfoStore = userInfoStore();

const messages = ref([]);
const inputMessage = ref('');
const userAvatar = usersInfoStore.info.userPic;
const messageList = ref(null);
const sampleReply = `好的，已为您生成一个该会议议程模板：
1. 开幕式（2025-04-16 09:00 -- 2025-04-16 12:00）<小张>
2. 科技园游园参观（2025-04-16 14:00 -- 2025-04-16 17:00）<小张>
`;
const aiSummaryText = ref('');

const getContent = () =>{
		let meetingName = "会议名称：" + setmeetModel.value.meetingName
		let startTime = "  开始时间：" + setmeetModel.value.startTime
		let endTime = "  结束时间：" + setmeetModel.value.endTime
		let meetingType = "  会议类别：" + getMeetingType(setmeetModel.value.meetingStatus)
		let meetingLocation = "  会议地点：" + setmeetModel.value.meetingLocation
		let rule = "  会场规则：" + setmeetModel.value.rule
		let diningService = "  餐饮服务：" + setmeetModel.value.diningService
		let theme = " 会议主题：" + setmeetModel.value.theme
		let generalContent = "  大致内容：" + setmeetModel.value.generalContent

		let content = meetingName + startTime + endTime + meetingType + meetingLocation + rule + diningService + theme + generalContent
		return content
	}

    const getMeetingType = (type)=> {
        const meetType = parseInt(type)
		switch (meetType) {
			case 1: return "线上会议";
			case 2: return "线下会议";
			case 3: return "线上/线下会议";
			default: return "error";
		}
	}

const getAISummanry = async () => {
		let content = getContent()
		console.log(content);
		aiSummaryText.value = (await AIMeetingSummaryService(content)).data
		console.log(aiSummaryText);
	}



const sendMessage = () => {
    if (!inputMessage.value.trim()) return;
    messages.value.push({
        content: inputMessage.value,
        isUser: true,
        isTyping: false
    });

    const aiMsg = {
        content: '',
        isUser: false,
        isTyping: true
    };
    messages.value.push(aiMsg);

    setTimeout(() => {
        aiMsg.isTyping = false;
        let index = 0;
        const timer = setInterval(() => {
            aiMsg.content += sampleReply[index];
            index++;
            if (index >= sampleReply.length) {
                clearInterval(timer);
                scrollToBottom();
            }
        }, 50);
    }, 800);

    inputMessage.value = '';
    scrollToBottom();
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messageList.value) {
            messageList.value.scrollTop = messageList.value.scrollHeight;
        }
    });
};

import aiAvatarGif from '../../assets/1742561149651.gif'

</script>

<template>
    <div class="meeting-create-container">
        <div class="compact-detail">
            <div style="margin-bottom: 20px;font-size: 14px;" @click="$route.push('/meet/manage')">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
                <span><el-text type="primary">返回会议列表</el-text></span>
            </div>

            <el-descriptions title="新增会议" :column="2" border size="small" class="compact-descriptions" :rules="rules">
                <template #extra>
                    <div class="header-actions">
                        <el-button type="primary" size="small" :icon="Plus" @click="handleSave" class="action-btn">
                            创建会议
                        </el-button>
                        <el-button type="info" size="small" :icon="Delete" @click="handleCancel" class="action-btn">
                            重置表单
                        </el-button>
                    </div>
                </template>

                <el-descriptions-item label="会议名称" prop="meetingName">
                    <el-input v-model="setmeetModel.meetingName" placeholder="请输入会议名称" class="compact-input" />
                </el-descriptions-item>

                <el-descriptions-item label="会议状态" prop="meetingStatus">
                    <el-select v-model="setmeetModel.meetingStatus" placeholder="选择状态" class="compact-select">
                        <el-option v-for="option in meetingStatusOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-descriptions-item>

                <el-descriptions-item label="开始时间" prop="startTime">
                    <el-date-picker v-model="setmeetModel.startTime" type="datetime" format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择开始时间" class="compact-date" />
                </el-descriptions-item>

                <el-descriptions-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="setmeetModel.endTime" type="datetime" format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束时间" class="compact-date" />
                </el-descriptions-item>

                <el-descriptions-item label="会议类型" prop="meetingType">
                    <el-select v-model="setmeetModel.meetingType" placeholder="选择类型" class="compact-select">
                        <el-option v-for="option in meetingTypeOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-descriptions-item>

                <el-descriptions-item label="最大人数" prop="maxNumber">
                    <el-input-number v-model="setmeetModel.maxNumber" :min="1" controls-position="right"
                        class="compact-number" />
                </el-descriptions-item>

                <el-descriptions-item label="公开会议" prop="isPublic">
                    <el-select v-model="setmeetModel.isPublic" placeholder="选择公开状态" class="compact-select">
                        <el-option v-for="option in meetIsPublicOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-descriptions-item>

                <el-descriptions-item label="会议地点" :span="2" prop="meetingLocation">
                    <el-input v-model="setmeetModel.meetingLocation" placeholder="输入会议地址" class="compact-input" />
                </el-descriptions-item>

                <el-descriptions-item label="会议主题" :span="3" prop="theme">
                    <el-input v-model="setmeetModel.theme" placeholder="输入会议主题" class="compact-input" />
                </el-descriptions-item>

                <el-descriptions-item label="启用签到" :span="3">
                    <div class="signin-settings">
                        <el-switch v-model="setmeetModel.enableSign" active-text="启用" inactive-text="停用" />

                        <div v-if="setmeetModel.enableSign" class="time-pickers">
                            <el-form-item label="签到开始时间" prop="signStartTime">
                                <el-date-picker v-model="setmeetModel.signStartTime" type="datetime"
                                    format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择签到开始时间"
                                    :disabled-date="disabledSignDate" />
                            </el-form-item>

                            <el-form-item label="签到结束时间" prop="signEndTime">
                                <el-date-picker v-model="setmeetModel.signEndTime" type="datetime"
                                    format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择签到结束时间"
                                    :disabled-date="disabledSignDate" />
                            </el-form-item>
                        </div>
                    </div>
                </el-descriptions-item>

            </el-descriptions>

        </div>




        <!-- 添加成员区 -->
        <div>
            <div class="member-section">
                <div class="section-header">
                    <h4>添加参会成员</h4>
                    <div class="selected-count">
                        <el-tag type="info">已选 {{ selectedMembers.size }} 人</el-tag>
                    </div>
                </div>

                <div class="member-content">
                    <!-- 左侧表格 -->
                    <div class="member-table">
                        <div class="table-actions">
                            <el-button type="primary" size="small" @click="selectAll">
                                全选当前页
                            </el-button>
                            <el-button type="info" size="small" @click="invertSelection">
                                反选当前页
                            </el-button>
                        </div>

                        <!-- 搜索表单 -->
                        <div class="header-search">
                            <el-form :inline="true" class="compact-form">
                                <el-form-item>
                                    <el-select v-model="searchForm.orgId" placeholder="选择组织" @change="fetchMembers"
                                        clearable size="small" style="width: 120px">
                                        <el-option v-for="org in organizations" :key="org.organizationId"
                                            :label="org.organizationName" :value="org.organizationId" />
                                    </el-select>
                                </el-form-item>

                                <el-form-item>
                                    <el-input v-model="searchForm.memberName" placeholder="成员姓名" clearable size="small"
                                        style="width: 120px" @keyup.enter="handleSearch" />
                                </el-form-item>

                                <el-form-item>
                                    <el-button type="primary" size="small" @click="handleSearch" plain>
                                        搜索
                                    </el-button>
                                    <el-button size="small" @click="handleReset" plain>
                                        重置
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>

                        <!-- 右侧已选成员 -->
                        <div class="selected-members">
                            <el-card shadow="never">
                                <template #header>
                                    <div class="card-header">
                                        <span>已选成员</span>
                                        <el-tag type="info">{{ selectedMembers.size }}人</el-tag>
                                    </div>
                                </template>

                                <div class="member-tags">
                                    <el-scrollbar height="200px">
                                        <el-tag v-for="member in selectedMemberDetails" :key="member.memberId" closable
                                            @close="toggleMember(member)" class="member-tag">
                                            {{ member.memberName }}
                                        </el-tag>
                                        <div v-if="selectedMembers.size === 0" class="empty-tips">
                                            尚未选择任何成员
                                        </div>
                                    </el-scrollbar>
                                </div>
                            </el-card>
                        </div>
                    </div>

                    <el-table :data="displayedMembers" height="400" stripe style="width: 100%">
                        <el-table-column type="selection" width="55">
                            <template #default="{ row }">
                                <el-checkbox :model-value="selectedMembers.has(row.memberId)"
                                    @change="toggleMember(row)" />
                            </template>
                        </el-table-column>

                        <el-table-column label="成员姓名" prop="memberName" width="200" />
                        <el-table-column label="头像" width="120">
                            <template #default="{ row }">
                                <el-avatar :size="36" :src="row.userPic" />
                            </template>
                        </el-table-column>
                        <el-table-column label="联系方式" prop="memberPhone" width="200" />


                    </el-table>
                </div>


            </div>
            <!-- 会议布局 -->
            <div class="agenda-section" style="margin-top: 20px;">
                <div>
                    <div class="agenda-header">
                        <h4>添加会议资料</h4>
                    </div>

                    <div class="agenda-content">
                        <div class="compact-image">
                            <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                                action="/api/upload" name="file" :headers="{ Authorization: tokenStore.token }"
                                :on-success="uploadSuccess" :before-upload="beforeUpload" :data="{}"
                                :disabled="!tokenStore.token">
                                <img v-if="setmeetModel.layout" :src="setmeetModel.layout" class="layout-image" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        请选择会议布局图 ，支持JPG/PNG格式
                                    </div>
                                </template>
                            </el-upload>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 会议资料 -->
            <div class="agenda-section" style="margin-top: 20px;">

                <div>

                    <div class="agenda-content">
                        <div class="material-section">
                            <div class="compact-file">
                                <el-upload class="material-uploader" :action="'/api/upload'"
                                    :headers="{ Authorization: tokenStore.token }" :on-success="uploadMaterialSuccess"
                                    multiple :disabled="!tokenStore.token">
                                    <template #trigger>
                                        <el-button type="primary" size="small">上传资料</el-button>
                                    </template>
                                </el-upload>
                            </div>


                        </div>

                    </div>



                </div>

                <!-- 会议议程 -->
                <div>

                    <div class="agenda-header">
                        <h4>会议议程管理</h4>
                        <div class="header-actions" style="margin-left: auto; display: flex; gap: 10px;">
                            <el-button type="success" size="small" :icon="Plus" @click="addAgendaItem">
                                新增议程
                            </el-button>
                            <el-button type="info" size="small" plain :icon="Position" @click="drawer = true">
                                智能创建
                            </el-button>
                            <el-button type="primary" size="small" @click="handleSaveList(item)">
                                提交
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- 智能创建区 -->
        <el-drawer v-model="drawer" size="40%" :with-header="false">
            <div class="ai-assistant">
                <!-- 消息列表修改 -->
                <div class="message-list" ref="messageList">
                    <div v-for="(msg, index) in messages" :key="index"
                        :class="['message-item', { 'user-msg': msg.isUser }]">
                        <div class="message-bubble">
                            <template v-if="!msg.isUser">
                                <div class="ai-avatar">
                                    <el-avatar :size="32" :src="aiAvatarGif" />
                                </div>
                                <div class="message-content">
                                    <span v-if="msg.isTyping" class="typing-indicator">
                                        <span class="dot"></span>
                                        <span class="dot"></span>
                                        <span class="dot"></span>
                                    </span>
                                    <template v-else>
                                        <span v-for="(char, i) in msg.content" :key="i" class="char"
                                            :style="{ animationDelay: `${i * 0.05}s` }">
                                            {{ char }}
                                        </span>
                                    </template>
                                </div>
                            </template>

                            <!-- 用户消息 -->
                            <template v-else>
                                <div class="user-message-container">
                                    <div class="message-content user">
                                        {{ msg.content }}
                                    </div>
                                    <el-avatar :size="32" :src="userAvatar" class="user-avatar" />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- 输入区域修改 -->
                <div class="input-area">
                    <el-form @submit.prevent="sendMessage">
                        <el-input v-model="inputMessage" placeholder="请输入会议需求..." class="round-input" clearable
                            @keyup.enter.native="sendMessage">
                            <template #append>
                                <el-button @click="sendMessage" :icon="Promotion" />
                            </template>
                        </el-input>
                    </el-form>
                </div>
                <div class="button-group">
                    <el-button size="small" type="primary">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>智能填充</span>
                    </el-button>
                    <el-button size="small" type="warning">
                        <el-icon>
                            <DeleteFilled />
                        </el-icon>
                        <span>清空记录</span>
                    </el-button>
                    <el-button size="small" type="primary">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>创建新会话</span>
                    </el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 会议议程 -->
        <div class="agenda-list">
            <div class="agenda-container">
                <div v-for="(item, index) in agendaItems" :key="index" class="agenda-item">
                    <div class="agenda-header">
                        <span class="agenda-number">{{ getChineseNumber(index + 1) }}：</span>
                        <!-- 保存按钮 -->
                        <el-button size="small" type="success" :icon="Select" circle
                            @click="SaveListItem(item, index)" />

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
    text-align: left;
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
    :deep(.el-form-item) {
        margin-bottom: 12px;
    }

    :deep(.el-input__inner),
    :deep(.el-select__wrapper) {
        height: 32px;
        line-height: 32px;
    }

    :deep(.el-input__inner) {
        border-radius: 4px;
    }

    :deep(.el-select) {
        width: 100%;
    }
}

.form-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.el-button {
    padding: 8px 16px;
    border-radius: 4px;
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

}

/* 添加成员区样式 */
.meeting-create-container {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.member-section {
    margin-top: 32px;
    border-top: 1px solid #ebeef5;
    padding-top: 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-search {
    display: flex;
    align-items: center;
    gap: 8px;
}

.compact-form {
    :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 6px;
    }

    .el-input__wrapper {
        border-radius: 16px;
    }

    .el-select {
        .el-input__wrapper {
            padding: 1px 15px;
        }
    }
}

.el-button+.el-button {
    margin-left: 6px;
}

@media (max-width: 768px) {
    .section-header {
        flex-wrap: wrap;
        gap: 8px;
    }

    .header-search {
        width: 100%;
        justify-content: flex-end;

        .el-form--inline .el-form-item:last-child {
            margin-right: 0;
        }
    }
}

.member-search {
    margin-bottom: 20px;

    :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 16px;
    }

    .el-input {
        width: 180px;
    }
}

.el-table {
    border: 1px solid #ebeef5;
    border-radius: 4px;

    :deep(th.is-leaf) {
        background: #f5f7fa;
    }
}

.el-avatar {
    background: #f5f7fa;
}

.member-content {
    display: flex;
    gap: 20px;
}

.member-table {
    flex: 1;
    min-width: 600px;
}

.selected-members {
    width: 500px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.member-tags {
    padding: 10px;
}

.member-tag {
    margin: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
}

.empty-tips {
    color: #999;
    text-align: center;
    padding: 20px;
}

.table-actions {
    margin-bottom: 10px;
    display: flex;
    gap: 8px;
}

@media (max-width: 1200px) {
    .member-content {
        flex-direction: column;
    }

    .selected-members {
        width: 100%;
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

/* 会议议程样式 */
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

/* 修改议程输入框样式 */
/* 修改议程输入框样式 */
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

/* 时间选择器样式统一 */
.agenda-input :deep(.el-date-editor) {
    --el-date-editor-width: 100%;
}

.agenda-input :deep(.el-date-editor .el-input__wrapper) {
    padding: 0 11px;
}

/* 调整栅格间距 */
.agenda-row {
    margin-bottom: -10px;

    .el-col {
        padding-bottom: 10px;
    }
}

/* 操作按钮对齐 */
.action-buttons {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
}

/* 移动端适配 */
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

/* 新增按钮布局样式 */
/* .agenda-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;
} */

/* .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}
 */
/* 智能创建 */
/* 空灵蓝背景色 */
.ai-assistant {
    background: linear-gradient(160deg, rgba(230, 247, 255, 0.5) 50%, rgba(214, 242, 255, 0.8) 60%);
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* 按钮容器优化 */
.button-group {
    margin: 15px 0;
    display: flex;
    gap: 12px;
    padding: 0 20px;
}

/* /* 自定义按钮样式 */






/* 按钮图标优化 */
:deep(.el-icon) {
    margin-right: 6px;
    font-size: 14px;
    vertical-align: middle;
}

.chat-container {
    flex: 1;
    padding: 5px;
    overflow: hidden;
}

.message-list {
    height: calc(100% - 90px);
    overflow-y: auto;
    padding-bottom: 20px;
    padding-right: 5px;
}

.message-item {
    margin-bottom: 10px;

    &.user-msg {
        .message-bubble {
            justify-content: flex-end;
        }
    }
}

.message-bubble {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    max-width: 80%;
    margin: -20 auto;
}

.ai-avatar {
    flex-shrink: 0;
}

/* 用户消息容器样式 */
.user-message-container {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
}

/* 用户消息对齐 */
.message-item.user-msg {
    justify-content: flex-end;

    .message-bubble {
        flex-direction: row-reverse;
        justify-content: flex-end;
        max-width: 85%;
        margin-left: auto;
    }
}

/* 用户头像样式 */
.user-avatar {
    flex-shrink: 0;
    order: 2;
}

/* 用户消息内容样式 */
.message-content.user {
    background: var(--el-color-primary);
    color: white;
    border-radius: 12px 2px 12px 12px;
    order: 1;
    margin-left: 40px;
}

/* 输入框圆角样式 */
:deep(.round-input) {
    .el-input__wrapper {
        border-radius: 20px;
        padding: 0 16px;
        box-shadow: 0 0 0 1px var(--el-border-color) inset;

        &:hover {
            box-shadow: 0 0 0 1px var(--el-color-primary) inset;
        }

        &.is-focus {
            box-shadow: 0 0 0 1px var(--el-color-primary) inset;
        }
    }

    .el-input-group__append {
        /* border-radius: 5px;
        background: var(--el-color-primary); */

        /* .el-button {
            color: white;
        } */
    }
}

/* 调整输入框容器 */
.input-area {
    padding: 16px 20px;

    :deep(.el-form-item) {
        margin-bottom: 0;
    }
}

.message-content {
    padding: 12px 16px;
    border-radius: 12px;
    line-height: 1.5;
    position: relative;

    &.user {
        background: rgba(64, 158, 255, 0.1);
        border: 1px solid rgba(64, 158, 255, 0.2);
        color: #409EFF;
    }

    &:not(.user) {
        background: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
}

.typing-indicator {
    display: inline-flex;
    gap: 4px;

    .dot {
        width: 6px;
        height: 6px;
        background: #ddd;
        border-radius: 50%;
        animation: bounce 1.4s infinite;

        &:nth-child(2) {
            animation-delay: 0.2s;
        }

        &:nth-child(3) {
            animation-delay: 0.4s;
        }
    }
}

.char {
    opacity: 0;
    animation: appear 0.1s forwards;
}

@keyframes appear {
    from {
        opacity: 0;
        transform: translateY(2px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}

/* 新增会议资料样式 */
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


/* 会议资料样式 */
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