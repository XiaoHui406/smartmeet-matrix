<template>
	<view class="profile-container">
		<view class="profile-header">
			<image class="avatar" :src="user.userPic" mode="aspectFill" />
			<text class="username">{{ user.username }}</text>
		</view>
		<view class="info-section">
			<view class="info-item">
				<view class="info-label">
					<uni-icons type="email" size="20" color="#3B82F6"></uni-icons>
					<text class="label-text">邮箱地址</text>
				</view>
				<text class="info-content">{{ user.email }}</text>
			</view>
		</view>
		<view class="interests-section">
			<view class="section-title">兴趣爱好</view>
			<view class="tags-container">
				<view v-for="(tag, index) in user.tags" :key="index" class="interest-tag">
					{{ tag }}
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import { ref } from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		findByIdService
	} from "../../api/user.js"

	const user = ref(null);

	onLoad((option) => {
		let userId = option.userId
		getUserInfo(userId)
	})

	const getUserInfo = async (userId) => {
		user.value = (await findByIdService(userId)).data
		console.log(user.value.interest);
		user.value.tags = user.value.interest.split('  ')
		console.log(user.value.tags);
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #EBF3FE;
	}

	.profile-container {
		padding: 32rpx;
		min-height: 100%;
	}

	.profile-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 48rpx;
	}

	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 80rpx;
		background-color: #EBF5FF;
		margin-bottom: 24rpx;
	}

	.username {
		font-size: 36px;
		font-weight: bold;
		color: #1F2937;
	}

	.info-section {
		background-color: #FFFFFF;
		border-radius: 16px;
		padding: 32rpx;
		margin-bottom: 48rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.info-item {
		margin-bottom: 32rpx;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	.info-label {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.label-text {
		margin-left: 16rpx;
		font-size: 14px;
		color: #6B7280;
	}

	.info-content {
		font-size: 14px;
		color: #1F2937;
		line-height: 1.5;
		padding-left: 44rpx;
	}

	.interests-section {
		background-color: #FFFFFF;
		border-radius: 16px;
		padding: 32rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 16px;
		font-weight: bold;
		color: #1F2937;
		margin-bottom: 24rpx;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.interest-tag {
		padding: 16rpx 24rpx;
		background-color: #EBF5FF;
		border-radius: 32rpx;
		color: #3B82F6;
		font-size: 14px;
	}
</style>