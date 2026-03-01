<script setup>
import { ref } from 'vue'
import useUserInfoStore from "@/stores/userInfo.js" 
const userInfoStore = useUserInfoStore()

const userInfo = ref({...userInfoStore.info}) 

const rules = {
  username: [
    { 
      required: true, 
      message: '用户名不能为空',
      trigger: ['blur', 'change'] 
    },
    { 
      validator: (rule, value) => {
        return value.trim().length  >= 2 && value.trim().length  <= 10;
      },
      message: '用户名需为2-10位非空字符',
      trigger: ['blur', 'change']
    }
  ],
  email: [
    { 
      required: true, 
      message: '邮箱不能为空',
      trigger: ['blur', 'change'] 
    },
    { 
      type: 'email', 
      message: '邮箱格式不正确',
      trigger: ['blur', 'change'] 
    }
  ]
}

import { userInfoUpdateService } from "@/api/user.js" 

const submitForm = async () => {
  try {
    await formRef.value.validate();  // 先进行校验
    let result = await userInfoUpdateService(userInfo.value); 
    uni.showToast({  title: '修改成功', icon: 'success' });
    userInfoStore.setInfo(userInfo.value) 
  } catch (e) {
    uni.showToast({  title: '请完善表单信息', icon: 'error' });
  }
};
const formRef=ref(null);
</script>

<template>
  <view class="container">
      <u-form 
        ref="formRef"
        :model="userInfo"
        labelPosition="left"
        labelWidth="100"
		:rules="rules"
      >
        <u-form-item
          prop="username"
        >
          <u-input 
            v-model="userInfo.username" 
            placeholder="请输入用户名"
		  prefix-icon="account"
		  clearable
          />
        </u-form-item>

        <u-form-item
          prop="email"
        >
          <u-input 
            v-model="userInfo.email" 
            placeholder="请输入邮箱"
            clearable 
			prefix-icon="email"
          />
        </u-form-item>

        <u-button 
          type="primary"
          shape="circle"
          customStyle="margin-top: 40rpx"
          @click="submitForm"
        >
          提交修改
        </u-button>
      </u-form>
    
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;

  .u-form {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 48rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
    
    &-item {
      margin-bottom: 48rpx;
      :deep(.u-form-item__body) {
        padding: 0 !important;
      }
    }
  }

  .u-input {
    height: 100rpx;
    padding: 0 32rpx !important;
    border: 2rpx solid #e0e6ed;
    border-radius: 16rpx;
    font-size: 32rpx;
    transition: all 0.3s;
    
    &:focus-within {
      border-color: #5b8cff;
      box-shadow: 0 4rpx 12rpx rgba(91, 140, 255, 0.2);
    }
    
    &__prefix-icon {
      margin-right: 20rpx;
      color: #909399 !important;
      font-size: 40rpx !important;
    }
  }

  .u-button {
    height: 100rpx;
    font-size: 34rpx;
    letter-spacing: 2rpx;
    background: linear-gradient(45deg, #6b9eff, #437dff);
    box-shadow: 0 4rpx 24rpx rgba(67, 125, 255, 0.3);
    transition: all 0.3s;
    
    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
  :deep(.u-input__prefix-icon) {
    margin-right: 0 !important;
    padding-right: 20rpx !important; 
  }
  // 错误提示样式
  :deep(.u-form-item__message) {
    margin-top: 16rpx;
    color: #ff4444;
    font-size: 26rpx;
    padding-left: 12rpx;
  }
}
</style>