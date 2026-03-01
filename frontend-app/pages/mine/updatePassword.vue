<template>
  <view class="password-update-container">

    <u-form ref="form" :model="passwordInfo" :rules="rules"  class="form-container"  labelPosition="left" 
  labelWidth="100"
  :borderBottom="false">
      <u-form-item label="原密码:" prop="oldPwd" class="form-item">
        <u-input
          v-model="passwordInfo.oldPwd"
          type="password"
		  prefix-icon="lock"
          placeholder="请输入原密码"
          class="form-input"
          
        />
      </u-form-item>

      <u-form-item label="新密码:" prop="newPwd" class="form-item">
        <u-input
          v-model="passwordInfo.newPwd"
          type="password"
          placeholder="请输入新密码"
          class="form-input"
          prefix-icon="lock"
        />
      </u-form-item>

      <u-form-item label="确认密码:" prop="rePwd" class="form-item">
        <u-input
          v-model="passwordInfo.rePwd"
          type="password"
          placeholder="请确认新密码"
          class="form-input"
          prefix-icon="lock"
        />
      </u-form-item>
    </u-form>

    <view class="button-container">
      <u-button type="primary"  @click="updatePassword" class="submit-button"
  shape="circle"
  customStyle="margin-top: 40rpx">确认修改</u-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { userPasswordUpdateService } from '@/api/user.js';
const passwordInfo = ref({
  oldPwd: '',
  newPwd: '',
  rePwd: ''
});

const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('确认密码不能为空'));
  } else if (value !== passwordInfo.value.newPwd) {
    callback(new Error('两次密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  oldPwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { pattern: /^\S{6,20}$/, message: '原密码必须是6-20位的非空字符串', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^\S{6,20}$/, message: '新密码必须是6-20位的非空字符串', trigger: 'blur' }
  ],
  rePwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: checkRePassword, trigger: 'blur' },
    { pattern: /^\S{6,20}$/, message: '新密码必须是6-20位的非空字符串', trigger: 'blur' }
  ]
};

const updatePassword = async () => {
  uni.showModal({
    title: '温馨提示',
    content: '确认修改密码？',
    confirmText: '确认',
    cancelText: '取消',
    success: async (res) => {
      if (res.confirm) {
        const formattedData = {
          old_pwd: passwordInfo.value.oldPwd,
          new_pwd: passwordInfo.value.newPwd,
          re_pwd: passwordInfo.value.rePwd
        };

        try {
          let result = await userPasswordUpdateService(formattedData);

          if (result.code === 0) {
            uni.showToast({
              title: result.msg ? result.msg : '修改成功，请重新登录',
              icon: 'success'
            });
            passwordInfo.value = { oldPwd: '', newPwd: '', rePwd: '' };
            uni.navigateTo({ url: '/pages/login' });
          } else {
            uni.showToast({
              title: result.msg ? result.msg : '修改失败',
              icon: 'none'
            });
          }
        } catch (error) {
          uni.showToast({
            title: '修改失败',
            icon: 'none'
          });
        } finally {
        }
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.password-update-container {
  padding: 40rpx;
  background-color: #f5f5f5; /* 淡灰色背景 */
  min-height: 100vh;

  .form-container {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 32rpx;
    padding: 64rpx !important;
    box-shadow: 
      0 12rpx 48rpx rgba(143, 155, 255, 0.15),
      inset 0 0 12rpx rgba(255,255,255,0.3); // 双层投影
    border: 1rpx solid rgba(255,255,255,0.4); // 玻璃边框
  }

  .form-item {
    margin-bottom: 15rpx;
    position: relative;

    // 添加动态标签动画
    &:focus-within .form-input::after {
      content: attr(data-label);
      position: absolute;
      top: -40rpx;
      left: 0;
      font-size: 28rpx;
      color: #5b5f72;
      font-weight: 500;
      opacity: 0.8;
    }
  }

  .form-input {
	  margin-left: -70rpx;
    height: 80rpx !important;
    padding: 0 40rpx !important;
    border: 2rpx solid rgba(224, 228, 255, 0.8) !important;
    border-radius: 24rpx !important;
    background: rgba(248, 249, 255, 0.6);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      font-size: 44rpx;
      color: #6c72ff;
      left: 40rpx;
      filter: drop-shadow(0 2rpx 4rpx rgba(108,114,255,0.1));
    }

    &:focus-within {
      border-color: #6c72ff !important;
      background: rgba(255,255,255,0.95);
      box-shadow: 
        0 8rpx 24rpx rgba(108,114,255,0.15),
        inset 0 2rpx 4rpx rgba(108,114,255,0.1);
    }

  }

  .submit-button {
    height: 120rpx !important;

    background: #2979ff;
    box-shadow: 
      0 12rpx 32rpx rgba(108,114,255,0.25),
      inset 0 -2rpx 4rpx rgba(255,255,255,0.2);
    font-weight: 600;
    color: #fff;
    letter-spacing: 4rpx;
    
    &::after {
      content: '→';
      margin-left: 16rpx;
      opacity: 0;
      transition: all 0.3s;
    }

    &:hover {
      transform: translateY(-2rpx);
      &::after {
        opacity: 1;
        margin-left: 24rpx;
      }
    }
  }

  // 错误提示升级
  :deep(.u-form-item__message) {
    margin-top: 24rpx;
    color: #ff4757;
    font-size: 28rpx;
    padding-left: 40rpx;
    position: relative;
    
    &::before {
      content: '⚠';
      position: absolute;
      left: 12rpx;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>