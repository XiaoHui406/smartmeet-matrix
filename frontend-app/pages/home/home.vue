<template>
	<view class="page">
		<!-- 用户信息区 -->
		<view class="user-info">
			<view class="user-left">
				<view class="avatar">
					<image class="avatar-img"
						:src="userInfo.userPic == null ? '/static/morenAvatar.png' : userInfo.userPic"
						mode="aspectFill" />
				</view>
				<text class="username">{{userInfo.username}}</text>
			</view>
			<view class="message" @click="toMessage()">
				<uni-icons type="notification" size="24" color="#333" />
				<view v-if="unreadCount > 0" class="badge">{{unreadCount}}</view>
			</view>
		</view>
		<!-- 功能区 -->
		<view class="feature-section">
			<view class="feature-grid">
				<view class="feature-item" @click="handleFeatureClick('/pages/index/agent')">
					<image class="feature-icon" src="/static/logo.png" style="width: 53px; background-color: #E8F0FE;"
						mode="widthFix"></image>
					<text class="feature-text">智会助手</text>
				</view>
				<view class="feature-item" v-for="(item, index) in features" :key="index"
					@click="handleFeatureClick(item.url)">
					<view class="feature-icon" :style="{backgroundColor: item.bgColor}">
						<uni-icons :type="item.icon" size="28" color="#FFF" />
					</view>
					<text class="feature-text">{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 我的会议区 -->
		<view class="meeting-section">
			<view class="section-header">
				<text class="section-title">我的会议</text>
			</view>
			<!-- 分类选项卡 -->
			<view class="tabs">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item"
					:class="{'active': currentTab === index}" @click="handleTabClick(index)">
					<text class="tab-text">{{tab.name}}</text>
					<view v-if="currentTab === index" class="tab-line"></view>
				</view>
			</view>
			<!-- 会议列表 -->

			<view class="meeting-list">
				<view v-for="(meeting, index) in meetings" :key="index" class="meeting-card"
					@click="handleMeetingClick(meeting)">
					<view class="meeting-info">
						<view class="meeting-header">
							<view class="meeting-title-row">
								<text class="meeting-title">{{meeting.meetingName}}</text>
								<view class="meeting-status" :class="meeting.meetingStatusText">
									{{getStatusText(meeting.meetingStatusText)}}
								</view>
							</view>
							<!-- <view class="meeting-host">{{meeting.key_attendees}}</view> -->
						</view>
						<view class="meeting-content" :class="{'simplified': meeting.showSimplified}">
							<view class="meeting-time">
								<view class="time-icon">
									<uni-icons type="calendar" size="16" color="#2B7AFA" />
								</view>
								<view class="time-content">
									<text class="time-date">{{meeting.startTime.split(' ')[0]}}</text>
									<view class="time-period"
										v-if="meeting.startTime.split(' ')[0] === meeting.endTime.split(' ')[0]">
										<text class="time-start">{{meeting.startTime.split(' ')[1]}}</text>
										<view class="time-divider"></view>
										<text class="time-end">{{meeting.endTime.split(' ')[1]}}</text>
									</view>
									<view class="time-period" v-else>
										<text class="time-start">{{meeting.startTime.split(' ')[1]}}</text>
										<view class="time-separator">至</view>
										<text class="time-end-date">{{meeting.endTime.split(' ')[0]}}</text>
										<text class="time-end">{{meeting.endTime.split(' ')[1]}}</text>
									</view>
								</view>
							</view>
							<view class="meeting-detail-item">
								<uni-icons type="location" size="14" color="#666" />
								<text class="detail-label">地点：</text>
								<text class="detail-text">{{meeting.meetingLocation}}</text>
							</view>
							<view class="meeting-detail-item">
								<uni-icons type="info" size="14" color="#666" />
								<text class="detail-label">类型：</text>
								<text
									class="detail-text">{{getMeetingType(meeting.meetingType, meeting.isPublic)}}</text>
							</view>
							<view class="meeting-summary">
								<text class="summary-label">会议概要：</text>
								<text class="summary-text">{{meeting.generalContent}}</text>
							</view>
							<view class="meeting-topics">
								<text v-for="(tag, tIndex) in meeting.tags" :key="tIndex" class="topic-tag"
									:style="{ backgroundColor: tagColors[tIndex % tagColors.length] }">{{tag}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from "@dcloudio/uni-app"
	import { useTokenStore } from '../../stores/token'
	import useUserInfoStore from "@/stores/userInfo.js"
	import { userAttendMeetingService } from "../../api/meetings.js"
	import { userInfoService } from "../../api/user.js"
	import { getUserMessagesService } from "../../api/message.js"

	const token_store = useTokenStore()
	const userInfoStore = useUserInfoStore();
	console.log(userInfoStore.info);

	const userInfo = ref(null);
	const unreadCount = ref(3);
	const features = ref([
		// { name: '智会助手', icon: 'headphones', type: 'assistant', bgColor: '#1A73E8', url: "/pages/index/agent" },
		{ name: '加入会议', icon: 'plusempty', type: 'join', bgColor: '#36ACFF', url: "/pages/add_meeting/add_meeting" },
		{ name: '会议资料', icon: 'list', type: 'document', bgColor: '#66CCFF', url: "/pages/meeting_material/meeting_material" }
	]);
	const tabs = ref([
		{ name: '最近会议' },
		{ name: '会议列表' },
		{ name: '历史会议' }
	]);
	const tagColors = [
		'rgba(33, 150, 243, 0.1)',
		'rgba(76, 175, 80, 0.1)',
		'rgba(255, 152, 0, 0.1)',
	];
	const currentTab = ref(0);
	let allMeetings = ref([]);

	const meetings = ref([]);
	const currentTabBar = ref(0);
	const handleFeatureClick = (url) => {
		console.log(url);
		// console.log(userInfo.value.userId);
		uni.navigateTo({
			url: url,
		})
	};
	const handleTabClick = (index : number) => {
		currentTab.value = index;

		getShowMeetings(currentTab.value)
	};
	const handleMeetingClick = (meeting : any) => {
		// console.log('meeting clicked:', meeting);
		uni.navigateTo({
			url: "/pages/meeting_detail/meeting_detail?meetingId=" + meeting.meetingId
		})
	};
	const handleTabBarClick = (index : number) => {
		currentTabBar.value = index;
	};
	// onLoad(() => {
	// 	getAttendMeeting()
	// 	getUserInfo()

	// 	const now = new Date().getTime();
	// 	const upcomingMeetings = allMeetings.value.filter(meeting =>
	// 		meeting.meetingStatusText !== 'completed' && new Date(meeting.startTime).getTime() >= now
	// 	).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

	// 	meetings.value = upcomingMeetings.slice(0, 1).map(meeting => ({
	// 		...meeting,
	// 		showSimplified: false
	// 	}));
	// })

	onShow(() => {
		getUserInfo()
		getAttendMeeting().then(() => {
			getShowMeetings(currentTab.value)
		})
		getUnreadMessageCount()
	})

	const getAttendMeeting = async () => {
		let attend_meetings = await userAttendMeetingService()
		console.log(attend_meetings);
		allMeetings.value.splice(0, allMeetings.value.length)
		let now = new Date().getTime()
		for (let i = 0; i < attend_meetings.data.length; i++) {
			let meeting = attend_meetings.data[i]
			if (meeting.meetingStatus == 1) {
				meeting.meetingStatusText = "upcoming"
			}
			else if (meeting.meetingStatus == 2) {
				meeting.meetingStatusText = "ongoing"
			}
			else {
				meeting.meetingStatusText = "completed"
			}
			meeting.tags = meeting.theme.split(' ')
			allMeetings.value.push(meeting)
		}
		console.log(allMeetings);
	}

	const getUserInfo = async () => {
		userInfo.value = await (await userInfoService()).data
		features.value[0].url = "/pages/add_meeting/add_meeting?userId=" + userInfo.value.userId
		console.log(userInfo);
	}

	const getUnreadMessageCount = async () => {
		let messages = (await getUserMessagesService()).data
		unreadCount.value = messages.filter(message =>
			message.isRead == 0
		).length
		console.log(messages);
		console.log(unreadCount);
	}

	function getStatusText(statusText : string) {
		switch (statusText) {
			case "upcoming": return "未开始";
			case "ongoing": return "进行中";
			case "completed": return "已结束";
			default: return "error";
		}
	}

	function getMeetingType(type : number, isPublic : number) {
		let res = ""
		switch (type) {
			case 1: res += "线上 "; break;
			case 2: res += "线下 "; break;
			case 3: res += "线上/线下 "; break;
			default: return "error";
		}
		switch (isPublic) {
			case 0: res += "私密"; break;
			case 1: res += "公开"; break;
			default: return "error";
		}
		return res
	}

	function toMessage() {
		uni.navigateTo({
			url: "/pages/messages/messages"
		})
	}

	function getShowMeetings(index : number) {
		const now = new Date().getTime();
		if (index === 0) {
			// 最近会议只显示最近的一场未结束会议
			const upcomingMeetings = allMeetings.value.filter(meeting =>
				meeting.meetingStatus !== 3
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

			meetings.value = upcomingMeetings.slice(0, 1).map(meeting => ({
				...meeting,
				showSimplified: false
			}));
			// console.log(meetings);
		} else if (index === 1) {
			// 会议列表显示所有未结束的会议，按时间排序
			meetings.value = allMeetings.value.filter(meeting =>
				meeting.meetingStatus !== 3
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
				.map(meeting => ({
					...meeting,
					showSimplified: true
				}));
			// console.log(meetings);
		} else {
			// 历史会议显示已结束的会议
			meetings.value = allMeetings.value.filter(meeting =>
				meeting.meetingStatus === 3
			).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
				.map(meeting => ({
					...meeting,
					showSimplified: true
				}));
			// console.log(meetings);
		}
	}
</script>
<style>
	page {
		height: 100%;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #F5F7FA;
	}

	.user-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		background-color: #FFFFFF;
		padding-top: 102rpx;
	}

	.user-left {
		display: flex;
		align-items: center;
		margin-left: 8%;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
	}

	.username {
		font-size: 16px;
		color: #333333;
		font-weight: 500;
	}

	.message {
		position: relative;
		margin-right: 10%;
	}

	.badge {
		position: absolute;
		top: -6rpx;
		right: -6rpx;
		min-width: 32rpx;
		height: 32rpx;
		border-radius: 16rpx;
		background-color: #FF4D4F;
		color: #FFFFFF;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6rpx;
	}

	.feature-section {
		margin: 20rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 30rpx;
	}

	.feature-grid {
		display: flex;
		justify-content: space-between;
		margin-left: 5%;
		margin-right: 5%;
	}

	.feature-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.feature-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
	}

	.feature-text {
		font-size: 14px;
		color: #333333;
	}

	.meeting-section {
		flex: 1;
		min-height: 0;
		background-color: #FFFFFF;
		margin: 0 20rpx 20rpx;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
	}

	.section-header {
		padding: 30rpx;
	}

	.section-title {
		font-size: 18px;
		font-weight: 600;
		color: #333333;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #EEEEEE;
		padding: 0 30rpx;
		justify-content: space-around;
	}

	.tab-item {
		position: relative;
		padding: 20rpx 40rpx;
	}

	.tab-text {
		font-size: 14px;
		color: #666666;
	}

	.tab-item.active .tab-text {
		color: #2B7AFA;
		font-weight: 500;
	}

	.tab-line {
		position: absolute;
		bottom: -2rpx;
		left: 40rpx;
		right: 40rpx;
		height: 4rpx;
		background-color: #2B7AFA;
		border-radius: 2rpx;
	}

	.meeting-list {
		flex: 1;
		min-height: 0;
		padding: 20rpx 30rpx;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.meeting-card {
		padding: 30rpx;
		width: 95%;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.meeting-header {
		margin-bottom: 24rpx;
	}

	.meeting-title-row {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.meeting-title {
		font-size: 18px;
		color: #333333;
		font-weight: 600;
		margin-right: 20rpx;
	}

	.meeting-host {
		font-size: 14px;
		color: #666666;
	}

	.meeting-status {
		font-size: 12px;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
	}

	.meeting-status.upcoming {
		color: #52C41A;
		background-color: rgba(82, 196, 26, 0.1);
	}

	.meeting-status.ongoing {
		color: #2B7AFA;
		background-color: rgba(43, 122, 250, 0.1);
	}

	.meeting-status.completed {
		color: #999999;
		background-color: rgba(153, 153, 153, 0.1);
	}

	.meeting-content {
		padding: 10rpx;
		background-color: #F8F9FA;
		border-radius: 8rpx;
	}

	.meeting-content.simplified {
		padding: 16rpx;
	}

	.meeting-content.simplified .meeting-summary,
	.meeting-content.simplified .meeting-topics {
		display: none;
	}

	.meeting-content.simplified .meeting-time {
		margin-bottom: 16rpx;
	}

	.meeting-detail-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		margin-top: 16rpx;
	}

	.meeting-time {
		display: flex;
		align-items: flex-start;
		margin-bottom: 24rpx;
		background-color: rgba(43, 122, 250, 0.05);
		padding: 10rpx;
		margin: 5rpx;
		border-radius: 12rpx;
	}

	.time-icon {
		margin-right: 16rpx;
		margin-top: 4rpx;
	}

	.time-content {
		flex: 1;
	}

	.time-date {
		display: block;
		font-size: 16px;
		color: #333333;
		font-weight: 500;
		margin-bottom: 8rpx;
	}

	.time-period {
		display: flex;
		align-items: center;
	}

	.time-start,
	.time-end {
		font-size: 14px;
		color: #2B7AFA;
	}

	.time-divider {
		width: 24rpx;
		height: 2rpx;
		background-color: #2B7AFA;
		margin: 0 12rpx;
	}

	.time-separator {
		color: #2B7AFA;
		margin: 0 12rpx;
		font-size: 14px;
	}

	.time-end-date {
		font-size: 14px;
		color: #2B7AFA;
		margin: 0 12rpx;
	}

	.detail-label {
		font-size: 14px;
		color: #666666;
		margin-left: 8rpx;
		margin-right: 8rpx;
	}

	.detail-text {
		font-size: 14px;
		color: #333333;
	}

	.meeting-summary {
		margin-top: 20rpx;
	}

	.summary-label {
		display: block;
		font-size: 14px;
		color: #666666;
		margin-bottom: 8rpx;
	}

	.summary-text {
		font-size: 14px;
		color: #333333;
		line-height: 1.5;
	}

	.meeting-topics {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;
		gap: 12rpx;
	}

	.topic-tag {
		font-size: 12px;
		color: #2B7AFA;
		background-color: rgba(43, 122, 250, 0.1);
		padding: 4rpx 16rpx;
		border-radius: 16rpx;
	}

	.tab-bar {
		display: flex;
		justify-content: space-around;
		padding: 16rpx 0;
		background-color: #FFFFFF;
		border-top: 1px solid #EEEEEE;
	}

	.tab-bar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tab-bar-text {
		font-size: 12px;
		color: #999999;
		margin-top: 8rpx;
	}

	.tab-bar-item.active .tab-bar-text {
		color: #2B7AFA;
	}
</style>