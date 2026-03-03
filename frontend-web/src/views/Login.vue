<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const isRegister = ref(false)

const registerData = ref({
    account: '',
    password: '',
    rePassword: ''
})

const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== registerData.value.password) {
        callback(new Error('请确保两次密码一致'))
    } else {
        callback()
    }
}

const rules = {
    account: [
        { required: true, message: '请输入用户账号', trigger: 'blur' },
        { min: 6, max: 15, message: '长度为6-15位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 10, message: '长度为6-10位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

import { userRegisterService, userLoginService } from '../api/use'
const register = async () => {
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.message ? result.message : '注册成功')
}

import { useRouter } from 'vue-router'

const router = useRouter()

import { useTokenStore } from '../stores//token'
const tokenStore = useTokenStore();
const login = async () => {
    let result = await userLoginService(registerData.value);
    ElMessage.success(result.message ? result.message : '登录成功')
    tokenStore.setToken(result.data)
    router.push('/')
}
const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }
}





</script>

<template>
    <el-row class="login-page">
    <div class="brand-container">
      <div class="logo-box">
        <img 
          src="../assets/1740143198303.png" 
          class="jumping-logo"
          alt="智会矩阵LOGO"
        >
      </div>
      <h1 class="system-title">智会矩阵</h1>
      <div class="system-subtitle">Intelligent Conference Matrix</div>
    </div>

        <el-col :span="6" :offset="15" class="form">
            <el-form ref="form" size="large" autocomplete="off" style="z-index: 2;" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="account">
                    <el-input :prefix-icon="User" placeholder="请输入用户账号" v-model="registerData.account"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="button" style="z-index: 2;" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" style="z-index: 2;" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" style="z-index: 2;" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="account">
                    <el-input :prefix-icon="User" placeholder="请输入用户账号" v-model="registerData.account"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" style="z-index: 2;" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="primary" style="z-index: 2;" :underline="false" @click="isRegister = true; clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
        <div class="particle-layer"></div>
        <div class="cyber-glow"></div>

    </el-row>
</template>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    background-color: #fff;

    position: relative;
    overflow: hidden;
    background: linear-gradient(
    135deg,
    rgba(12, 35, 64, 0.95),
    rgba(43, 84, 139, 0.95),
    rgba(202, 225, 247, 0.95)
  );

    .brand-container {
    position: absolute;
    left: 12%;
    top: 20%;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    
    .logo-box {
      width: 300px;
      height: 300px;
      margin: 0 auto 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      padding: 20px;
      box-shadow: 0 0 30px rgba(0, 180, 255, 0.3);
      
      .jumping-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        animation: logoJump 2.5s ease-in-out infinite;
      }
    }

    .system-title {
      font-size: 2.8em;
      font-weight: 700;
      letter-spacing: 4px;
      margin-bottom: 15px;
      text-shadow: 0 0 15px rgba(0, 180, 255, 0.5);
    }

    .system-subtitle {
      font-size: 1.2em;
      letter-spacing: 2px;
      opacity: 0.8;
      font-family: 'Arial', sans-serif;
    }
  }


    .form {



        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;
        background: rgba(255, 255, 255, 0.7);

        padding: 20px 30px;
    
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
    
    
        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
            position: relative;
  z-index: 2;
  &:active {
    transform: scale(0.98);
  }
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}

.gradient-layer {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 75%);
    animation: flow 15s infinite linear;
    transform: rotate(30deg);
    z-index: 1;
}

.sci-fi-title {
    position: absolute;
    left: 15%;
    top: 30%;
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Microsoft YaHei', sans-serif;

    .typing-text {
      font-size: 3.5em;
      font-weight: 700;
      position: relative;
      width: 4.5em;
      border-right: 2px solid rgba(255, 255, 255, 0.75);
      overflow: hidden;

      
    }

.glow-effect {
    position: absolute;
    top: 0;
    right: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%);
    animation: glow 6s infinite;
    transform: skewX(-20deg);
    z-index: 1;
}


.scan-line {
      position: absolute;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00b4ff);
      animation: scan 4s infinite linear;
      filter: drop-shadow(0 0 5px #00b4ff);
    }
  }

  .particle-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff'/%3E%3C/svg%3E");
    background-size: 0.1%;
    opacity: 0.1;
    animation: particle 20s linear infinite;
  }

  .cyber-glow {
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle at 50% 50%, 
      rgba(0, 180, 255, 0.1) 0%,
      transparent 60%);
    animation: pulse 6s infinite;
  }

  @keyframes logoJump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes typing {
  from { width: 0 }
  to { width: 4.5em }
}

@keyframes cursor {
  from, to { border-color: transparent }
  50% { border-color: #00b4ff }
}

@keyframes scan {
  0% { width: 0; left: 0; top: 50% }
  50% { width: 100%; opacity: 1 }
  100% { width: 0; left: 100%; opacity: 0 }
}

@keyframes particle {
  from { background-position: 0 0 }
  to { background-position: 1000px 1000px }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.4 }
  50% { transform: scale(1.2); opacity: 0.2 }
  100% { transform: scale(1); opacity: 0.4 }
}

</style>