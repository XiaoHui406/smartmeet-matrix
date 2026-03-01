<template>
	<view class="comment-page">
		<!-- 会议信息 -->
		<view class="meeting-info">
			<text class="meeting-name">{{ meetingInfo.meetingName }}</text>
			<text class="topic-name">议题：{{ meetingInfo.topicName }}</text>
		</view>
		<!-- 评分区域 -->
		<view class="rating-section">
			<text class="rating-title">为本议题打分</text>
			<view class="stars-container">
				<view v-for="index in 5" :key="index" class="star-item" @click="handleRating(index)">
					<uni-icons :type="currentRating >= index ? 'star-filled' : 'star'" size="24"
						:color="currentRating >= index ? '#FFB800' : '#D3D3D3'" />
				</view>
			</view>
		</view>
		<!-- 评论输入区 -->
		<view class="comment-section">
			<textarea v-model="commentText" class="comment-input" placeholder="请输入您的评论内容" :focus="false"
				maxlength="200" />
			<text class="word-count">{{commentText.length}}/200</text>
		</view>
		<!-- 发布按钮 -->
		<button class="submit-btn" @click="handleSubmit">
			发布评论
		</button>
	</view>
</template>
<script lang="ts" setup>
	import { ref } from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		addCommentService
	} from "../../api/comments.js"
	import {
		topicDetailService
	} from "../../api/topics.js"
	import {
		meetingDetailService
	} from "../../api/meetings.js"

	const currentRating = ref(0);
	const commentText = ref('');
	const meetingInfo = ref({
		topicName: "",
		meetingName: ""
	});
	let topic = ref(null)
	const handleRating = (rating : number) => {
		currentRating.value = rating;
	};
	const handleSubmit = () => {
		if (!currentRating.value) {
			uni.showToast({
				title: '请先进行评分',
				icon: 'none'
			});
			return;
		}
		if (!commentText.value.trim()) {
			uni.showToast({
				title: '请输入评论内容',
				icon: 'none'
			});
			return;
		}
		// 处理提交逻辑
		uni.showLoading({
			title: '发布中...'
		});
		sendComment().then(() => {
			uni.hideLoading();
			uni.showToast({
				title: '发布成功',
				icon: 'success'
			});
			setTimeout(() => {
				uni.navigateBack()
			}, 800)
		})
	};

	onLoad((option) => {
		let topicId = option.topicId
		console.log(topicId);

		getTopicDetail(topicId)
	})

	const getTopicDetail = async (topicId) => {
		topic.value = (await topicDetailService(topicId)).data
		console.log(topic);
		meetingInfo.value.topicName = topic.value.topicName
		console.log(meetingInfo);
		console.log(topic.value.meetingId);
		let meeting = (await meetingDetailService(topic.value.meetingId)).data
		console.log(meeting);
		meetingInfo.value.meetingName = meeting.meetingName
	}

	const sendComment = async () => {
		await addCommentService(topic.value.topicId, currentRating.value, commentText.value)
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #FFFFFF;
	}

	.comment-page {
		min-height: 100%;
		display: flex;
		flex-direction: column;
	}

	.nav-bar {
		height: 88rpx;
		background-color: #2196F3;
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		position: relative;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.nav-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		color: #FFFFFF;
		font-size: 16px;
		font-weight: 500;
	}

	.meeting-info {
		padding: 32rpx;
		border-bottom: 1px solid #E0E0E0;
	}

	.meeting-name {
		display: block;
		font-size: 16px;
		color: #333333;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.topic-name {
		display: block;
		font-size: 14px;
		color: #666666;
	}

	.rating-section {
		padding: 32rpx;
		border-bottom: 1px solid #E0E0E0;
	}

	.rating-title {
		display: block;
		font-size: 14px;
		color: #333333;
		margin-bottom: 24rpx;
	}

	.stars-container {
		display: flex;
		align-items: center;
	}

	.star-item {
		margin-right: 24rpx;
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.comment-section {
		padding: 32rpx;
		flex: 1;
		position: relative;
	}

	.comment-input {
		width: 100%;
		min-height: 240rpx;
		padding: 24rpx;
		box-sizing: border-box;
		border: 1px solid #E3F2FD;
		border-radius: 16rpx;
		font-size: 14px;
		color: #333333;
	}

	.word-count {
		position: absolute;
		right: 48rpx;
		bottom: 48rpx;
		font-size: 12px;
		color: #999999;
	}

	.submit-btn {
		margin: 32rpx;
		margin-top: 0;
		height: 96rpx;
		line-height: 96rpx;
		background-color: #2196F3;
		color: #FFFFFF;
		font-size: 16px;
		border-radius: 16rpx;
	}

	.submit-btn:active {
		background-color: #1976D2;
	}
</style>