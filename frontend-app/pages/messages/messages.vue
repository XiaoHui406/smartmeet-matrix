<template>
	<view class="container">
		<!-- 搜索框 -->
		<view class="search-box">
			<view class="search-input">
				<uni-icons type="search" size="16" color="#999999" />
				<input v-model="searchText" type="text" placeholder="搜索消息" placeholder-style="color: #999999;"
					class="input" />
			</view>
			<view class="more-options" @tap="showActionSheet">
				<uni-icons type="more-filled" size="24" color="#666666" />
			</view>
		</view>
		<!-- 消息列表 -->
		<scroll-view class="message-list" scroll-y>
			<view v-if="filteredMessages.length > 0">
				<view v-for="(message, index) in filteredMessages" :key="index" class="message-item"
					hover-class="message-item-hover" @tap="onMessageTap(message)">
					<view :class="message.isRead == 0 ? 'red-point' : 'red-point-hide'"></view>
					<view class="avatar">
						<uni-icons :type="message.isRead === 0 ? 'email' : 'mail-open'" size="30"
							color="#666666"></uni-icons>
					</view>
					<view class="content">
						<view class="header-row">
							<text class="title">{{ message.messageTitle }}</text>
							<text class="time">{{ message.sendTime }}</text>
						</view>
						<text class="preview">{{ message.messageContent }}</text>
					</view>
				</view>
			</view>
			<!-- 空状态 -->
			<view v-else class="empty-state">
				<uni-icons type="info" size="64" color="#CCCCCC" />
				<text class="empty-text">暂无消息</text>
			</view>
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
	import { ref, computed } from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		getUserMessagesService,
		readMessageService,
		deleteMessagesService
	} from "../../api/message.js"
	const isRefreshing = ref(false);
	const searchText = ref('');
	const messages = ref([]);
	const onMessageTap = (message) => {
		// 处理消息点击事件
		console.log(message);
		if (message.isRead == 0) {
			readMessage(message)
		}
		uni.navigateTo({
			url: "/pages/messages/message_detail?message=" + JSON.stringify(message),
		})
	};

	const filteredMessages = computed(() => {
		if (!searchText.value) return messages.value;
		return messages.value.filter(message =>
			message.messageTitle.toLowerCase().includes(searchText.value.toLowerCase())
		);
	});

	const showActionSheet = () => {
		uni.showActionSheet({
			itemList: ['一键已读', '删除所有已读消息'],
			success: function (res) {
				if (res.tapIndex === 0) {
					uni.showModal({
						content: "要把所有消息设为已读吗？",
						success: (res) => {
							if (res.confirm) {
								markAllAsRead().then(() => {
									getMessages()
								})
							}
						}
					})
				} else if (res.tapIndex === 1) {
					uni.showModal({
						content: "要删除所有已读消息吗？",
						success: (res) => {
							if (res.confirm) {
								uni.showModal({
									content: "真的要删除吗？此操作不可逆，请谨慎使用！",
									success: (result) => {
										if (result.confirm) {
											deleteReadMessages().then(() => {
												getMessages()
											})
										}
									}
								})
							}
						}
					})
				}
			}
		});
	};

	const markAllAsRead = async () => {
		// 实现一键已读功能
		let unreadMessages = messages.value.filter(message =>
			message.isRead == 0
		)
		for (let i = 0; i < unreadMessages.length; i++) {
			await readMessage(unreadMessages[i])
		}
		uni.showToast({
			title: '操作成功',
			icon: 'success'
		});
	};

	const deleteReadMessages = async () => {
		let readMessages = messages.value.filter(message =>
			message.isRead == 1
		)
		for (let i = 0; i < readMessages.length; i++) {
			await deleteMessage(readMessages[i])
		}
		// 实现删除已读消息功能
		uni.showToast({
			title: '操作成功',
			icon: 'success'
		});
	};

	onShow(() => {
		getMessages()
	})

	const getMessages = async () => {
		messages.value = (await getUserMessagesService()).data.sort((a, b) =>
			new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime()
		)
		console.log(messages);
	}

	const readMessage = async (message) => {
		await readMessageService(message.messageId)
	}

	const deleteMessage = async (message) => {
		await deleteMessagesService(message.messageId)
	}
</script>
<style>
	page {
		height: 100%;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #F5F8FC;
	}

	.header {
		height: 120rpx;
		background-color: #4A90E2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		flex-shrink: 0;
	}

	.header-title {
		color: #FFFFFF;
		font-size: 18px;
		font-weight: 500;
	}

	.message-list {
		flex: 1;
		overflow: auto;
		padding: 24rpx 0;
	}

	.message-item {
		display: flex;
		padding: 32rpx;
		border-bottom: 1px solid #E8F0FE;
		margin: 0 24rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		margin-bottom: 24rpx;
	}

	.message-item-hover {
		background-color: #F8FAFD;
	}

	.red-point {
		position: relative;
		top: 0;
		left: 0;
		width: 16rpx;
		height: 16rpx;
		border-radius: 8rpx;
		background-color: red;
	}

	.red-point-hide {
		position: relative;
		top: 0;
		left: 0;
		width: 16rpx;
		height: 16rpx;
		border-radius: 8rpx;
		background-color: white;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
	}

	.avatar image {
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
	}

	.search-box {
		padding: 24rpx 32rpx;
		background-color: #FFFFFF;
		flex-shrink: 0;
		display: flex;
	}

	.search-input {
		display: flex;
		flex: 1;
		align-items: center;
		background-color: #F5F8FC;
		border-radius: 32rpx;
		padding: 16rpx 24rpx;
	}

	.input {
		flex: 1;
		font-size: 14px;
		color: #333333;
		margin-left: 16rpx;
	}

	.more-options {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		padding-left: 25rpx;
	}

	.content {
		flex: 1;
		overflow: hidden;
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.title {
		font-size: 16px;
		color: #1E88E5;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.time {
		font-size: 12px;
		color: #999999;
		white-space: nowrap;
		padding-left: 20rpx;
	}

	/* .title {
		font-size: 15px;
		color: #333333;
		margin-bottom: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 400;
	} */

	.preview {
		font-size: 14px;
		color: #666666;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}

	.empty-text {
		font-size: 14px;
		color: #999999;
		margin-top: 32rpx;
	}
</style>