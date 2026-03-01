<template>
	<view class="page">
		<view class="content">
			<view class="agenda-card">
				<view class="time-info">
					<view class="time-row">
						<uni-icons type="calendar" size="16" class="time-icon" />
						<text class="time-text">开始时间：{{ topic.startTime }}</text>
					</view>
					<view class="time-row">
						<uni-icons type="calendar" size="16" class="time-icon" />
						<text class="time-text">结束时间：{{ topic.endTime }}</text>
					</view>
				</view>
				<view class="speaker-info">
					<view class="speaker-detail">
						<text class="speaker-name">{{"议程主讲人：" + topic.speaker }}</text>
					</view>
				</view>
				<view class="agenda-content">
					<text class="agenda-title">{{ topic.topicName }}</text>
					<text class="agenda-desc">{{ topic.content }}</text>
				</view>
			</view>
			<view class="comments-section">
				<view class="comments-header">
					<text class="comments-title">用户评论</text>
					<view class="header-right">
						<view class="rating">
							<text class="rating-score">{{topicScore > 0 ? topicScore : ""}}</text>
							<uni-icons v-for="i in 5" :key="i" :type="getStarType(i, topicScore)" size="16"
								color="#FFB800" />
						</view>
						<uni-icons type="plusempty" size="20" color="#1976D2" class="add-comment"
							@click="addComment()" />
					</view>
				</view>
				<view class="comment-list">
					<view v-for="(comment, index) in comments" :key="index" class="comment-item">
						<image class="user-avatar" :src="comment.userPic" mode="aspectFill"
							@click="toUserInfo(comment)" />
						<view class="comment-content">
							<view class="comment-header">
								<text class="user-name">{{ comment.userName }}</text>
								<text class="comment-time">{{ comment.commentTime }}</text>
							</view>
							<view class="rating">
								<uni-icons v-for="i in 5" :key="i"
									:type="i <= Number(comment.score) ? 'star-filled' : 'star'" size="14"
									color="#FFB800" />
							</view>
							<text class="comment-text">{{ comment.content }}</text>
						</view>
					</view>
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
		topicDetailService,
		topicClickCountAddService
	} from "../../api/topics.js"
	import {
		deleteCommentService,
		getCommentListService
	} from "../../api/comments.js"

	const topic = ref(null);
	const comments = ref([]);
	let topicScore = 5
	let topicId = null

	onLoad((option) => {
		topicId = option.topicId
		topicClickCountAddService(topicId)
	})

	onShow(() => {
		getTopicDetail(topicId)
		getComments(topicId)
	})

	const addComment = () => {
		uni.navigateTo({
			url: '/pages/meeting_detail/add_comment?topicId=' + topic.value.topicId
		});
	};

	const getComments = async (topicId) => {
		comments.value = (await getCommentListService(topicId)).data
		if (comments.value.length > 0) {
			let total = 0
			for (let i = 0; i < comments.value.length; i++) {
				total += comments.value[i].score
			}
			total /= comments.value.length
			topicScore = total
		}
		else {
			topicScore = 0
		}
	}

	const getTopicDetail = async (topicId) => {
		topic.value = (await topicDetailService(topicId)).data
	}

	const clickCountAdd = async (topicId) => {
		await topicClickCountAddService(topicId)
	}

	function getStarType(index : number, score : number) {
		if (index <= score) {
			return "star-filled"
		}
		else {
			let n = index - score
			if (n <= 0.3) {
				return "star-filled"
			}
			else if (n <= 0.7) {
				return "starhalf"
			}
			else {
				return "star"
			}
		}
	}

	function toUserInfo(comment) {
		uni.navigateTo({
			url: "/pages/meeting_detail/commenter_info?userId=" + comment.userId
		})
	}
</script>
<style>
	page {
		height: 100%;
	}

	.page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #EBF3FE;
		overflow-y: auto;
	}

	.header {
		flex-shrink: 0;
		background-color: #1976D2;
		padding: 0 30rpx;
	}

	.nav-bar {
		height: 88rpx;
		display: flex;
		align-items: center;
		position: relative;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
	}

	.title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 16px;
		font-weight: 500;
		color: #ffffff;
	}

	.content {
		flex: 1;
		overflow: auto;
		padding: 30rpx;
	}

	.agenda-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4px 12px rgba(25, 118, 210, 0.08);
		border: 1px solid rgba(25, 118, 210, 0.1);
	}

	.time-info {
		margin-bottom: 30rpx;
	}

	.time-row {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.time-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.time-text {
		font-size: 14px;
		color: #666666;
	}

	.speaker-info {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 30rpx;
		border-bottom: 1px solid #eee;
	}

	.speaker-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 20rpx;
	}

	.speaker-detail {
		display: flex;
		flex-direction: column;
	}

	.speaker-name {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
		margin-bottom: 8rpx;
	}

	.speaker-title {
		font-size: 14px;
		color: #666666;
	}

	.agenda-content {
		display: flex;
		flex-direction: column;
	}

	.agenda-title {
		font-size: 18px;
		font-weight: 500;
		color: #1976D2;
		margin-bottom: 20rpx;
	}

	.agenda-desc {
		font-size: 14px;
		color: #666666;
		line-height: 1.6;
	}

	.comments-section {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4px 12px rgba(25, 118, 210, 0.08);
		border: 1px solid rgba(25, 118, 210, 0.1);
	}

	.comments-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.add-comment {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.comments-title {
		font-size: 16px;
		font-weight: 500;
		color: #1976D2;
	}

	.rating {
		display: flex;
		align-items: center;
	}

	.rating-score {
		font-size: 16px;
		font-weight: 500;
		color: #1976D2;
		margin-right: 10rpx;
	}

	.comment-list {
		display: flex;
		flex-direction: column;
	}

	.comment-item {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 1px solid #eee;
	}

	.comment-item:last-child {
		border-bottom: none;
	}

	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin-right: 20rpx;
	}

	.comment-content {
		flex: 1;
	}

	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.user-name {
		font-size: 14px;
		font-weight: 500;
		color: #333333;
	}

	.comment-time {
		font-size: 12px;
		color: #999999;
	}

	.comment-text {
		font-size: 14px;
		color: #666666;
		line-height: 1.6;
		margin-top: 10rpx;
	}
</style>