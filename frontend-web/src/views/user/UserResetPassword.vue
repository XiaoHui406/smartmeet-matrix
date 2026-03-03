<script setup>
import { ref } from 'vue'
const resetData = ref({
    old_pwd:'',
    new_pwd:'',
    re_pwd:''
})


//校验密码是否一致，定义在rule的上方有效
const checkRePassword = (rule,value,callback)=>{
    if(value === ''){
        callback(new Error('请再次输入密码'))
    } else if (value !== resetData.value.re_pwd){
        callback(new Error('请确保两次密码一致'))
    } else {
        callback()
    }
}

const rules = {
    new_pwd: [
        { required:true, message:'请输入新密码', trigger:'blur'},
        { min: 6,max:10, message:'长度为6-10位非空字符', trigger:'blur'}
    ],
    re_pwd: [
    {validator:checkRePassword, trigger:'blur'}
    ],
    old_pwd: [
        { required:true, message:'请输入旧密码', trigger:'blur'},
        { min: 6,max:10, message:'长度为6-10位非空字符', trigger:'blur'}
    ]
}
//重置密码函数
import{passwordUpdateService} from '../../api/use'
import { ElMessage } from 'element-plus';
const updateRePassword = async() => {
    let result = await passwordUpdateService(resetData.value)
    ElMessage.success(result.message? result.message : '重置密码成功')
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重置密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="resetData" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="旧密码" prop="old_pwd">
                        <el-input v-model="resetData.old_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="resetData.new_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="re_pwd">
                        <el-input v-model="resetData.re_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateRePassword">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>