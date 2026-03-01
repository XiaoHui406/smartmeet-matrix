<template>

	<view class="login-page">
		<view class="logo-container">
			<image src="/static/logo.png" class="logo" mode="aspectFit" />
			<text class="app-name">智会矩阵</text>
		</view>
		<view class="form-container">
			<!-- 注册表单 -->
			<u-form ref="registerFormRef" v-show="isRegister" :model="registerData" :rules="rules" label-position="top">
				<u-form-item label=" " prop="account">
					<u-input v-model="registerData.account" placeholder="请输入手机号" prefix-icon="account"
						prefix-icon-size="20" clearable />
				</u-form-item>

				<u-form-item label=" " prop="password">
					<u-input v-model="registerData.password" type="password" placeholder="请输入密码（5-16位）"
						prefix-icon="lock" prefix-icon-size="20" clearable />
				</u-form-item>

				<u-form-item label=" " prop="repassword">
					<u-input v-model="registerData.repassword" type="password" placeholder="确认密码" prefix-icon="lock"
						prefix-icon-size="20" clearable />
				</u-form-item>

				<u-button type="primary" shape="circle" @click="handleRegister" :loading="registerLoading">
					立即注册
				</u-button>

				<view class="switch-text">
					已有账号？
					<text class="link" @click="switchForm(false)">立即登录</text>
				</view>
			</u-form>

			<!-- 登录表单 -->
			<u-form ref="loginFormRef" v-show="!isRegister" :model="loginData" :rules="loginRules" label-position="top">
				<u-form-item label=" " prop="account">
					<u-input v-model="loginData.account" placeholder="请输入手机号" prefix-icon="account"
						prefix-icon-size="20" clearable />
				</u-form-item>

				<u-form-item label=" " prop="password">
					<u-input v-model="loginData.password" type="password" placeholder="请输入密码" prefix-icon="lock"
						prefix-icon-size="20" clearable />
				</u-form-item>


				<u-button type="primary" shape="circle" @click="handleLogin" :loading="loginLoading">
					立即登录
				</u-button>

				<view class="switch-text">
					没有账号？
					<text class="link" @click="switchForm(true)">立即注册</text>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		userRegisterService,
		userLoginService
	} from '../api/user'
	// 表单切换状态 
	import {
		useTokenStore
	} from '../stores/token'

	// 将 flag 定义为响应式变量
	const flag = ref(0);
	const isRegister = ref(false)
	const switchForm = (showRegister) => {
		isRegister.value = showRegister
	}

	// 注册相关 
	const registerFormRef = ref(null)
	const registerLoading = ref(false)
	const registerData = ref({
		account: '',
		password: '',
		repassword: ''
	})

	// 登录相关 
	const loginFormRef = ref(null)
	const loginLoading = ref(false)
	const loginData = ref({
		account: '',
		password: '',
		rememberMe: false
	})

	// 验证规则 
	const checkPhone = (rule, value, callback) => {
		const reg = /^1[3-9]\d{9}$/
		if (!reg.test(value)) {
			callback(new Error('请输入正确的手机号'))
		} else {
			callback()
		}
	}

	const checkRePassword = (rule, value, callback) => {
		if (value !== registerData.value.password) {
			callback(new Error('两次输入密码不一致'))
		} else {
			callback()
		}
	}

	const rules = {
		account: [{
				required: true,
				message: '请输入手机号'
			},
			{
				validator: checkPhone,
				trigger: 'blur'
			}
		],
		password: [{
				required: true,
				message: '请输入密码'
			},
			{
				min: 5,
				max: 16,
				message: '密码长度5-16位'
			}
		],
		repassword: [{
				required: true,
				message: '请确认密码'
			},
			{
				validator: checkRePassword,
				trigger: 'blur'
			}
		]
	}

	const loginRules = {
		account: [{
				required: true,
				message: '请输入手机号'
			},
			{
				validator: checkPhone,
				trigger: 'blur'
			}
		],
		password: [{
			required: true,
			message: '请输入密码'
		}]
	}

	// 注册提交 
	const handleRegister = async () => {
		if (registerData.value.password == registerData.value.repassword) {
			let res = await userRegisterService(registerData.value.account, registerData.value.password);
			if (res.code === 0) {
				uni.showToast({
					title: '注册成功',
					icon: 'success'
				});
				// 修改 flag 的值
				flag.value = 1;
				switchForm(false);
			} else {
				uni.showToast({
					title: '注册失败',
					icon: 'error'
				});
			}
		} else {
			uni.showToast({
				icon: "fail",
				title: "注册失败",
			})
		}
	}

	// 登录提交 
	const handleLogin = async () => {
		// let result = null
		let result = await userLoginService(loginData.value.account, loginData.value.password)
		console.log(result);

		if (result.code === 0) {
			uni.showToast({
				title: '登录成功',
				icon: 'success'
			});
			const tokenStore = useTokenStore();
			tokenStore.setToken(result.data);
			if (flag.value === 0) {
				let loginInfo = {
					account: loginData.value.account,
					password: loginData.value.password
				}
				uni.setStorageSync('loginInfo', loginInfo)
				uni.switchTab({
					url: '/pages/home/home'
				});
			} else {
				uni.redirectTo({
					url: '/pages/mine/interest'
				});
			}
		} else {
			uni.showToast({
				title: '登录失败',
				icon: 'error'
			});
		}
	}
</script>

<style lang="scss" scoped>
	.login-page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			width: 200%;
			height: 200%;
			top: -50%;
			left: -50%;
			background: linear-gradient(45deg,
					rgba(255, 255, 255, 0.1) 25%,
					transparent 25%,
					transparent 75%,
					rgba(255, 255, 255, 0.1) 75%,
					rgba(255, 255, 255, 0.1) 100%);
			background-size: 60rpx 60rpx;
			transform: rotate(15deg);
			animation: gridMove 20s linear infinite;
		}
	}

	@keyframes gridMove {
		0% {
			transform: rotate(15deg) translate(0, 0);
		}

		100% {
			transform: rotate(15deg) translate(-60rpx, 60rpx);
		}
	}

	.logo-container {
		position: relative;
		z-index: 1;
		text-align: center;
		margin-bottom: 80rpx;
		animation: logoFloat 3s ease-in-out infinite;

		.logo {
			width: 280rpx;
			height: 280rpx;
			filter: drop-shadow(0 10rpx 20rpx rgba(41, 121, 255, 0.2));
		}

		.app-name {
			display: block;
			font-size: 50rpx;
			color: #2c3e50;
			font-weight: 600;
			letter-spacing: 4rpx;
			margin-top: 20rpx;
			text-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		}
	}

	@keyframes logoFloat {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-20rpx);
		}
	}

	.form-container {
		position: relative;
		z-index: 2;
		width: 86%;
		max-width: 560rpx;
		padding: 60rpx 40rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 32rpx;
		box-shadow:
			0 12rpx 48rpx rgba(41, 121, 255, 0.15),
			0 4rpx 24rpx rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(20rpx);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			transform: translateY(-4rpx);
			box-shadow: 0 16rpx 56rpx rgba(41, 121, 255, 0.2);
		}

		:deep(.u-form) {
			.u-form-item {
				margin-bottom: 48rpx;

				.u-input {
					padding: 28rpx 36rpx;
					background: rgba(245, 247, 250, 0.8);
					border-radius: 16rpx;
					transition: all 0.3s ease;

					&__content {
						border: 2rpx solid transparent;
					}

					&--focus {
						background: rgba(255, 255, 255, 0.95);
						box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.15);

						.u-input__content {
							border-color: rgba(41, 121, 255, 0.3);
						}
					}
				}

				.u-input__prefix-icon {
					color: #2979ff;
					opacity: 0.6;
				}
			}
		}

		.u-button {
			height: 96rpx;
			font-size: 34rpx;
			font-weight: 500;
			letter-spacing: 2rpx;
			background: linear-gradient(135deg, #2979ff, #6699ff);
			box-shadow: 0 8rpx 24rpx rgba(41, 121, 255, 0.3);
			border: none;
			transition: all 0.3s ease;

			&--loading {
				opacity: 0.8;
				transform: scale(0.98);
			}

			&:active {
				transform: scale(0.96);
			}
		}

		.switch-text {
			margin-top: 40rpx;
			font-size: 28rpx;
			color: #666;

			.link {
				color: #2979ff;
				font-weight: 500;
				position: relative;
				cursor: pointer;

				&::after {
					content: '';
					position: absolute;
					bottom: -4rpx;
					left: 0;
					width: 0;
					height: 2rpx;
					background: currentColor;
					transition: width 0.3s ease;
				}

				&:hover::after {
					width: 100%;
				}
			}
		}
	}
</style>