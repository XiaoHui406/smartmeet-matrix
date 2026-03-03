<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Edit,
    Delete,
    Download,
    Search,
    Remove,
    Refresh

} from '@element-plus/icons-vue'


import { attendsListService, AddAttendService, updateAttendService, deleteAttendsService, myAttendsListService } from '@/api/meet';
import { meetListService } from '@/api/meet';
import { organizationListService } from '@/api/organization'
import { memberService } from '@/api/member'
import { userInfoService } from '@/api/use'
import { tr } from 'element-plus/es/locale'


const attends = ref([])
const myAttends = ref([])
const meetingIdInput = ref(1)

// 会议类型选项
const attendanceStatusOptions = ref([
    { value: 1, label: '会议未设置签到' },
    { value: 2, label: '未签到' },
    { value: 3, label: '已签到' }
]);

//参会状态模型
const attendsTypeText = (type) => {
    const typeMap = {
        1: '会议未设置签到',
        2: '未签到',
        3: '已签到'
    };
    return typeMap[type] || '未知';
}

const searchKey = ref({
    attendId: '',
    userName: '',
    meetingName: '',
    attendanceStatus: '',
    absentReason: ''
})

//获取我的参会记录
// 获取我的参会记录
const myAttendsList = async () => {
    try {
        // 获取我的参会记录
        let result = await myAttendsListService();
        myAttends.value = result.data;

        // 获取会议列表
        let meetRes = await meetListService();
        const meetMap: Record<number, string> = meetRes.data.reduce((acc, meet) => {
            acc[meet.meetingId] = meet.meetingName;
            return acc;
        }, {} as Record<number, string>);

        // 获取用户表
        let userKey = await userInfoService();

        // 检查 userKey 是否包含 data 属性且 data 是对象
        if (!userKey || !userKey.data || typeof userKey.data !== 'object') {
            console.error('用户信息数据格式错误', userKey);
            ElMessage.error('用户信息加载失败，请检查服务端数据');
            return;
        }
        // 初始化 userMap

        // 修改为 number 键以支持数字类型的 userId
        const userMap: Record<number, string> = {};

        // 假设 userKey.data 是一个对象，包含 userId 和 username
        if (userKey.data.userId !== undefined && userKey.data.username !== undefined) {
            userMap[userKey.data.userId] = userKey.data.username;
        } else {
            console.warn('用户数据缺失 userId 或 username:', userKey.data);
        }

        // 扩展参会记录
        myAttends.value = myAttends.value.map(attend => {
            // 确保 attend.userId 是数字类型
            const userId = parseInt(attend.userId, 10) || 0;
            const userName = userMap[userId] || '未知成员';
            // 找到对应的会议名称
            const meetingName = meetMap[attend.meetingId] || '未知会议';
            return {
                ...attend,
                userName: userName, // 确保成员姓名赋值给 userName
                meetingName: meetingName
            };
        });


    } catch (error) {
        console.error('获取我的参会记录失败：', error);
        ElMessage.error('获取我的参会记录失败，请重试');
    }
}
myAttendsList();

//申明一个异步的函数
const attendsList = async () => {
    try {
        // 获取参会记录表
        let id = meetingIdInput.value;
        let result = await attendsListService(id);
        attends.value = result.data;

        let meetRes = await meetListService();
        const meetsMap: Record<number, string> = meetRes.data.reduce((acc, meet) => {
            acc[meet.meetingId] = meet.meetingName;
            return acc;
        }, {} as Record<number, string>);

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

        const userMap: Record<number, string> = {};
        members.forEach(member => {
            if (member.memberId !== undefined && member.memberName !== undefined) {
                userMap[parseInt(member.memberId, 10)] = member.memberName; // 确保 userId 是数字类型
            } else {
                console.warn(`成员数据缺失 userId 或 userName:`, member);
            }
        });

        console.log('用户映射表：', userMap);

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

        console.log('扩展后的参会记录：', attends.value);
    } catch (error) {
        console.error('获取参会记录失败：', error);
        ElMessage.error('获取参会记录失败，请重试');
    }
};
attendsList();


const attendDialogVisible = ref(false)
const updataItemDialogVisible = ref(false)


const searchOfKey = async () => {


    let id = meetingIdInput.value;
    let result = await attendsListService(id);
    attends.value = result.data;

    let meetRes = await meetListService();
    const meetsMap: Record<number, string> = meetRes.data.reduce((acc, meet) => {
        acc[meet.meetingId] = meet.meetingName;
        return acc;
    }, {} as Record<number, string>);


    let orgRes = await organizationListService();


    let members = [];
    for (const org of orgRes.data) {
        let result = await memberService(org.organizationId);
        if (result.data) {
            members = members.concat(result.data);
        }
    }


    const userMap: Record<number, string> = {};
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

 
    const searchAttendId = searchKey.value.attendId.trim();
    const searchUserName = searchKey.value.userName.trim().toLowerCase();
    const searchMeetingName = searchKey.value.meetingName.trim().toLowerCase();
    const searchAttendanceStatus = searchKey.value.attendanceStatus.trim().toLowerCase();
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
        if (searchAttendanceStatus && attend.attendanceStatus.toString().toLowerCase().indexOf(searchAttendanceStatus) === -1) {
            match = false;
        }
        if (searchAbsentReason && attend.absentReason.toLowerCase().indexOf(searchAbsentReason) === -1) {
            match = false;
        }
        return match;
    });


}

//搜索我的参会记录
const mySearch = async () => {

    let result = await myAttendsListService();
    myAttends.value = result.data;
    let meetRes = await meetListService();
    const meetMap: Record<number, string> = meetRes.data.reduce((acc, meet) => {
        acc[meet.meetingId] = meet.meetingName;
        return acc;
    }, {} as Record<number, string>);

    let userKey = await userInfoService();
    if (!userKey || !userKey.data || typeof userKey.data !== 'object') {
        console.error('用户信息数据格式错误', userKey);
        ElMessage.error('用户信息加载失败，请检查服务端数据');
        return;
    }
    const userMap: Record<number, string> = {};
    if (userKey.data.userId !== undefined && userKey.data.username !== undefined) {
        userMap[userKey.data.userId] = userKey.data.username;
    } else {
        console.warn('用户数据缺失 userId 或 username:', userKey.data);
    }

    myAttends.value = myAttends.value.map(attend => {
        const userId = parseInt(attend.userId, 10) || 0;
        const userName = userMap[userId] || '未知成员';
        const meetingName = meetMap[attend.meetingId] || '未知会议';
        return {
            ...attend,
            userName: userName, 
            meetingName: meetingName
        };
    });

    const searchAttendId = searchKey.value.attendId.trim();
    const searchUserName = searchKey.value.userName.trim().toLowerCase();
    const searchMeetingName = searchKey.value.meetingName.trim().toLowerCase();
    const searchAttendanceStatus = searchKey.value.attendanceStatus.trim().toLowerCase();
    const searchAbsentReason = searchKey.value.absentReason.trim().toLowerCase();

    myAttends.value = myAttends.value.filter(attend => {
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
        if (searchAttendanceStatus && attend.attendanceStatus.toString().toLowerCase().indexOf(searchAttendanceStatus) === -1) {
            match = false;
        }
        if (searchAbsentReason && attend.absentReason.toLowerCase().indexOf(searchAbsentReason) === -1) {
            match = false;
        }
        return match;
    });


}
const resetOfKey = () => {
    searchKey.value.attendId = '',
        searchKey.value.userName = '',
        searchKey.value.meetingName = '',
        searchKey.value.attendanceStatus = '',
        searchKey.value.absentReason = ''
    myAttendsList();
    attendsList();
}
const attendModel = ref({
    userId: '',
    meetingId: '',
    attendanceStatus: '',
    attendTime: '',
    leaveTime: '',
    absentReason: ''
})
const attendRules = {
    userId: [
        { required: true, message: '请输入用户ID', trigger: 'blur' },
    ],
    meetingId: [
        { required: true, message: '请输入会议ID', trigger: 'blur' },
    ],
    attendanceStatus: [
        { required: true, message: '请输入参会状态', trigger: 'blur' },
    ]

}
const attendTitle = ref('')

const clearAttendData = () => {
    attendModel.value.userId = '';
    attendModel.value.meetingId = '';
    attendModel.value.attendanceStatus = '';
    attendModel.value.attendTime = '';
    attendModel.value.leaveTime = '';
    attendModel.value.absentReason = ''
}

const showAttendsDialog = async (row) => {
    updataItemDialogVisible.value = true; attendTitle.value = '修改参会记录';
    attendModel.value.attendanceStatus = row.attendanceStatus;
    attendModel.value.absentReason = row.absentReason;
    attendModel.value.userId = row.userId; // 确保 userId 存在
    attendModel.value.meetingId = row.meetingId;
    attendModel.value.attendTime = row.attendTime;
    attendModel.value.leaveTime = row.leaveTime;
    console.log('弹窗数据:', attendModel.value);

}

//更新
const updateAttend = async () => {
    try {
        // 验证输入值
        const userId = parseInt(attendModel.value.userId, 10);
        const meetingId = parseInt(attendModel.value.meetingId, 10);
        const attendanceStatus = parseInt(attendModel.value.attendanceStatus, 10);
       const  attendTime = attendModel.value.attendTime || null // 处理空字符串
       const leaveTime = attendModel.value.leaveTime || null // 处理空字符串
       const absentReason = attendModel.value.absentReason || null

        console.log('updata数据:', userId,meetingId,attendanceStatus);
        let result = await updateAttendService(userId,meetingId,attendanceStatus,attendTime,leaveTime,absentReason);
        console.log('updata接口响应:', result); 
        ElMessage.success('修改成功');

        attendsList();
        myAttendsList();

        updataItemDialogVisible.value = false;
    } catch (error) {
        console.error('更新参会记录失败：', error);
        ElMessage.error('更新参会记录失败，请重试');
    }
}


const deleteAttends = async (row) => {
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


</script>
<template>
  <el-card class="page-container">
    
    <div class="header">
      <h2 class="page-title">参会记录管理</h2>
    </div>

    
    <el-form inline :model="searchKey" class="search-form">
      <div class="form-row">
        <el-form-item label="记录ID：" class="compact-item">
          <el-input 
            v-model="searchKey.attendId" 
            placeholder="记录ID"
            clearable
            class="compact-input"
          />
        </el-form-item>

        <el-form-item label="会议名称：" class="compact-item">
          <el-input
            v-model="searchKey.meetingName"
            placeholder="会议名称"
            clearable
            class="compact-input"
          />
        </el-form-item>

        <el-form-item label="参会状态：" class="compact-item">
          <el-select
            v-model="searchKey.attendanceStatus"
            placeholder="全部状态"
            clearable
            class="status-select"
          >
            <el-option
              v-for="option in attendanceStatusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="缺席原因：" class="full-width-item">
          <el-input
            v-model="searchKey.absentReason"
            placeholder="输入缺席原因关键词"
            clearable
            class="reason-input"
          />
        </el-form-item>
      </div>

      <div class="action-buttons">
        <el-button
          type="primary"
          :icon="Search"
          @click="mySearch"
          class="search-btn"
        >搜索</el-button>
        <el-button
          type="info"
          :icon="Refresh"
          @click="resetOfKey"
          class="reset-btn"
        >重置</el-button>
      </div>
    </el-form>


    
    <el-table
      :data="myAttends"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      class="data-table"
    >
                    <el-table-column label="记录ID" width="80" prop="attendId"></el-table-column>
                    <el-table-column label="成员姓名" width="100" prop="userName"></el-table-column>
                    <el-table-column label="会议名称" width="180" prop="meetingName"></el-table-column>
                    <el-table-column label="参会状态" width="100" prop="attendanceStatus">
                        <template #default="{ row }">
                            {{ attendsTypeText(row.attendanceStatus) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="参会时间" width="160" prop="attendTime"> </el-table-column>
                    <el-table-column label="离会时间" width="160" prop="leaveTime"></el-table-column>
                    <el-table-column label="缺席原因" prop="absentReason"></el-table-column>
                    <template #empty>
                        <el-empty description="没有数据" />
                    </template>
                </el-table>

    </el-card>
</template>


<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .header {
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    .page-title {
      margin: 0;
      font-size: 20px;
      color: #303133;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .search-form {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
    margin-bottom: 24px;

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .compact-item {
      margin: 0;

      :deep(.el-form-item__label) {
        font-size: 13px;
        color: #606266;
      }
    }

    .full-width-item {
      flex: 1;
      margin: 0;
    }

    .compact-input {
      width: 140px;
    }

    .status-select {
      width: 160px;
    }

    .reason-input {
      width: 100%;
      max-width: 480px;
    }

    .action-buttons {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #ebeef5;

      .search-btn, .reset-btn {
        width: 100px;
      }
    }
  }

  .data-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);

    :deep(th) {
      background-color: #f8f9fa;
      color: #606266;
      font-weight: 600;
    }

    :deep(.el-button) {
      padding: 6px 8px;
      border-radius: 4px;
      transition: all 0.2s;

      + .el-button {
        margin-left: 8px;
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .search-form {
    .form-row {
      flex-wrap: wrap;

      .compact-item, .full-width-item {
        flex: 1 1 100%;
      }
    }

    .action-buttons {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>