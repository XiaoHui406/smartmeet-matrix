<script setup>
import { ref } from 'vue'
import { userInfoStore } from '@/stores/userInfo';
const useInfoStore = userInfoStore();
const userInfo = ref({
    ...useInfoStore.info
})
const rules = {
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    interest: [
        { required: true, message: '请输入您的兴趣', trigger: 'blur' },
        {
            // pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ]
}

//修改个人信息
import{userUpdateService} from '../../api/use'
import { ElMessage } from 'element-plus';
const updateUserInfo = async()=>{
    let result = await userUpdateService(userInfo.value)
    ElMessage.success(result.message? result.message : '修改成功')
    //修改pinia中的数据
    useInfoStore.setInfo(userInfo.value)
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="用户名称">
                        <el-input v-model="userInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户账号" prop="account" >
                        <el-input v-model="userInfo.account" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="用户兴趣" prop="interest">
                        <el-input v-model="userInfo.interest" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>