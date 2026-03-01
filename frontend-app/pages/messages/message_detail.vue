<template>
	<view class="message-detail">
		<!-- 消息内容区域 -->
		<scroll-view class="content-container" scroll-y>
			<view class="message-content">
				<view class="title-container">
					<text class="message-title">{{ message.messageTitle }}</text>
					<view class="delete-icon" @click="handleDelete">
						<uni-icons type="trash" size="20" color="#999999" />
					</view>
				</view>
				<text class="message-time">{{ message.sendTime }}</text>
				<text class="message-text">{{ message.messageContent }}</text>
			</view>
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
	import { ref } from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		deleteMessagesService
	} from "../../api/message.js"

	const message = ref(null);

	const handleDelete = () => {
		uni.showModal({
			title: '确认删除',
			content: '是否确认删除该消息？',
			success: (res) => {
				if (res.confirm) {
					deleteMessage().then(() => {
						uni.showToast({
							title: '删除成功',
							icon: 'success',
						});
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					})
				}
			}
		});
	};

	const deleteMessage = async () => {
		await deleteMessagesService(message.value.messageId)
	}

	onLoad((option) => {
		message.value = JSON.parse(option.message)
		console.log(message);
	})
</script>
<style>
	page {
		height: 100%;
	}

	.message-detail {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.content-container {
		flex: 1;
		overflow: auto;
	}

	.message-content {
		padding: 32rpx;
		display: flex;
		flex-direction: column;
	}

	.title-container {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 32rpx;
		margin-top: 30rpx;
	}

	.message-title {
		font-size: 20px;
		font-weight: 600;
		color: #1E88E5;
		flex: 1;
		margin-right: 16rpx;
	}

	.delete-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 4px;
	}

	.message-time {
		font-size: 14px;
		color: #999999;
		margin-bottom: 32rpx;
	}

	.message-text {
		font-size: 16px;
		color: #666666;
		line-height: 1.6;
	}
</style>