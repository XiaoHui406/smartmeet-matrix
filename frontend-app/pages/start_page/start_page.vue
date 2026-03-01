<template>
	<view class="main">
		<view class="logo-container">
			<image src="/static/logo.png" class="logo" mode="aspectFit" />
			<text class="app-name">智会矩阵</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		useTokenStore
	} from '../../stores/token'
	import {
		userLoginService
	} from "../../api/user.js"

	const userLogin = async (account, password) => {
		let result = await userLoginService(account, password)
		console.log(result);
		if (result.code === 0) {
			const tokenStore = useTokenStore();
			tokenStore.setToken(result.data);
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/home/home'
				});
			}, 2000)
		} else {
			setTimeout(() => {
				uni.redirectTo({
					url: "/pages/login"
				})
			}, 2000)
		}
	}

	onLoad(() => {
		let loginInfo = uni.getStorageSync('loginInfo')
		if (loginInfo != null && JSON.stringify(loginInfo).length > 2) {
			let account = loginInfo.account
			let password = loginInfo.password
			userLogin(account, password)
		} else {
			uni.setStorageSync("loginInfo", "")
			setTimeout(() => {
				uni.redirectTo({
					url: "/pages/login"
				})
			}, 3000)
		}
	})
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.main {
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
		display: flex;

		.logo-container {
			position: relative;
			z-index: 1;
			text-align: center;
			margin-bottom: 80rpx;
			animation: logoFloat 3s ease-in-out infinite;

			.logo {
				width: 400rpx;
				height: 400rpx;
				filter: drop-shadow(0 10rpx 20rpx rgba(41, 121, 255, 0.2));
			}

			.app-name {
				display: block;
				font-size: 60rpx;
				color: #2c3e50;
				font-weight: 600;
				letter-spacing: 4rpx;
				// margin-top: 10rpx;
				text-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
			}
		}
	}
</style>