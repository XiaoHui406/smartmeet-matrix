<template>
	<view class="meeting-detail">
		<!-- 滚动区域 -->
		<view class="content">
			<!-- 基本信息卡片 -->
			<view class="info-card">
				<text class="meeting-name">{{ meeting.meetingName }}</text>
				<view class="meeting_time">
					<uni-icons type="calendar" size="16" color="#666666" style="align-self: center;"></uni-icons>
					<text class="time-text">{{getTime(meeting.startTime, meeting.endTime)}}</text>
				</view>
				<view class="meeting-host">
					<uni-icons type="person" size="16" color="#666666"></uni-icons>
					<text class="host-text">主持人：{{ meeting.keyAttendees }}</text>
				</view>
				<view class="meeting-host">
					<uni-icons type="info" size="16" color="#666666" />
					<text class="type">{{ getMeetingType(meeting.meetingType) }}</text>
				</view>
				<view class="tags">
					<uni-icons type="star" size="16" color="#666666" />
					<text v-for="(tag, tagIndex) in meeting.tags" :key="tagIndex" class="tag"
						:style="{ backgroundColor: tagColors[tagIndex % tagColors.length] }">
						{{ tag }}
					</text>
				</view>
				<view class="quit_meeting_view" v-if="joined && meeting.meetingStatus == 1" @click="quitMeeting()">
					<button type="warn">退出</button>
				</view>
			</view>
			<!-- 详细信息区 -->

			<!-- 在.info-card和.detail-section之间添加 -->
			<view class="ai-summary-section">
				<view class="summary_header">
					<text class="summary_title">AI智能生成会议摘要</text>
					<button class="generate_btn" @click="generateSummary">开始生成</button>
				</view>
				<view class="summary-content" v-if="aiSummaryText">
					<scroll-view scroll-y class="summary-scroll">
						<!-- <text class="summary-text">{{ aiSummaryText }}</text> -->
						<div v-html="renderMarkdown(aiSummaryText)" class="markdown-content"></div>
					</scroll-view>
				</view>
			</view>

			<view class="detail-section">
				<view class="tab-container">
					<view class="tab-item" :class="{ active: activeTab === 'info' }" @click="toMeetingInfo()">
						会议信息
					</view>
					<view class="tab-item" :class="{ active: activeTab === 'agenda' }" @click="toMeetingAgendas()">
						会议议程
					</view>
					<view class="tab-item" :class="{ active: activeTab === 'rank' }" @click="toTopicsRankings()">
						议程排行
					</view>
				</view>
				<view class="meeting-detail-container" v-if="activeTab === 'info'">
					<view class="section-item">
						<view class="section-title">
							<uni-icons type="location" size="16" color="#666666"></uni-icons>
							<text class="title-text">会议地点</text>
							<view class="navigate" @click="toNavigation()">
								<text>导航</text>
								<image src="/static/location.png" mode="widthFix" style="width: 16px; top: 2px;">
								</image>
							</view>
						</view>
						<text class="section-content">{{ meeting.meetingLocation }}</text>
					</view>
					<view class="section-item">
						<view class="section-title">
							<uni-icons type="info" size="16" color="#666666"></uni-icons>
							<text class="title-text">会议主题</text>
						</view>
						<text class="section-content">{{ meeting.generalContent }}</text>
					</view>
					<view class="section-item">
						<view class="section-title">
							<uni-icons type="notification" size="16" color="#666666"></uni-icons>
							<text class="title-text">会场规则</text>
						</view>
						<text class="section-content">{{ meeting.rule }}</text>
					</view>
					<view class="section-item">
						<view class="section-title">
							<uni-icons type="info" size="16" color="#666666"></uni-icons>
							<text class="title-text">餐饮服务</text>
						</view>
						<text class="section-content">{{ meeting.diningService }}</text>
					</view>
					<!-- <view class="section-item">
						<view class="section-title">
							<uni-icons type="list" size="16" color="#666666"></uni-icons>
							<text class="title-text">会议议程</text>
						</view>
						<text class="section-content">{{ meeting.agenda }}</text>
					</view> -->
					<view class="section-item">
						<view class="section-title">
							<uni-icons type="list" size="16" color="#666666"></uni-icons>
							<text class="title-text">会议资料</text>
						</view>
						<view class="file-list">
							<view class="file-item" v-for="(file, index) in meeting.files" :key="index">
								<uni-icons type="list" size="16" color="#666666"></uni-icons>
								<text class="file-name">{{ file.materialName + "." + file.materialType }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="meeting-detail-container" v-else-if="activeTab === 'agenda'">
					<view class="section-item">
						<view class="agenda-list">
							<view class="agenda-item" v-for="(item, index) in topics" :key="index"
								@click="toTopicDetail(item)">
								<view>
									<text class="agenda-content">{{(index + 1) + "." + item.topicName }}</text>
								</view>
								<view>
									<text
										class="agenda-time">{{ "开始：" + item.startTime + "\n结束：" + item.endTime }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="meeting-detail-container" v-else>
					<view class="section-item">
						<view class="rank-list">
							<view class="rank-item" v-for="(item, index) in sortedTopics" :key="index"
								:class="[index < 3 ? 'top-three' : '']">
								<view class="rank-index" :class="['rank', `rank-${index + 1}`]">{{ index + 1 }}</view>
								<view class="rank-content">
									<view class="rank-title">{{ item.topicName }}</view>
									<view class="rank-info">
										<text
											class="rank-time">{{ "开始：" + item.startTime + "\n结束：" + item.endTime }}</text>
										<text class="rank-score">{{ item.score }}分</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="bottom-button">
			<button :disabled="!canJoin" :class="['join-btn', { disabled: !canJoin }]" @tap="joinMeeting()">
				{{ buttonText }}
			</button>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import { ref, computed } from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";
	import {
		meetingDetailService,
		meetingMaterialsService,
		clickCountAddService,
		AIMeetingSummaryService
	} from "../../api/meetings.js"
	import {
		quitMeetingService,
		getUserattendMeetingsService
	} from '../../api/attend_meeting.js'
	import {
		userInfoService
	} from '../../api/user.js'
	import {
		meetingTopicsService,
		meetingTopicsSortedByClickCountService,
		meetingTopicsSortedByScoreService
	} from '../../api/topics.js'
	import {
		v4 as uuidv4
	} from 'uuid'
	import {
		marked
	} from "marked"
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github.css';

	marked.setOptions({
		highlight: function (code, lang) {
			return hljs.highlightAuto(code).value;
		},
		breaks: true,
		gfm: true,
		silent: true
	});

	let meeting = ref(null);
	let meetingId = null
	let joined = ref(null)
	let activeTab = ref('info')
	const tagColors = [
		'rgba(33, 150, 243, 0.1)',
		'rgba(76, 175, 80, 0.1)',
		'rgba(255, 152, 0, 0.1)',
	];
	let topics = ref([])
	let showTopics = ref([])
	let sortedTopics = ref([])
	const videoConfig = {
		encodeWidth: 1280,
		encodeHeight: 720,
		fps: 24,
		bitrate: 600
	}
	let user = null
	const aiSummaryText = ref('')

	const generateSummary = async () => {
		// 调用AI生成接口
		uni.showLoading({ title: '生成中...' })
		try {
			getAISummanry().then(() => {
				uni.hideLoading()
				uni.showToast({
					icon: "success",
					title: "生成摘要成功",
					duration: 800
				})
			})
		} catch (e) {
			console.log(e);
		}
	}

	onLoad((option) => {
		meetingId = option.meetingId
		console.log(option.meetingId);
		clickCountAdd(meetingId)
		getMeetingDetail().then(() => {
			getMeetingMaterials()
		})
		isAttendMeeting()
	})

	// 是否可以加入会议
	const canJoin = computed(() => {
		return meeting.value.meetingStatus == 2 && joined.value
	});

	// 按钮文案
	const buttonText = computed(() => {
		if (meeting.value.meetingStatus == 1) {
			return '会议未开始';
		}
		else if (canJoin.value) {
			return '加入会议'
		}
		else if (meeting.value.meetingStatus == 2 && !joined.value) {
			return '未参加会议'
		}
		else if (meeting.value.meetingStatus == 3) {
			return '会议已结束';
		}
		else {
			return 'error'
		}
	});

	const getMeetingDetail = async () => {
		const res = await meetingDetailService(meetingId)
		console.log(res);
		meeting.value = res.data
		meeting.value.tags = meeting.value.theme.split(' ')
	}

	const getMeetingMaterials = async () => {
		const res = await meetingMaterialsService(meetingId)
		console.log(res.data);
		meeting.value.files = res.data
	}

	const clickCountAdd = async (meetingId) => {
		await clickCountAddService(meetingId)
	}

	const quitMeeting = () => {
		if (meeting.value.meetingStatus == 1) {
			uni.showModal({
				title: "退出会议",
				content: "确定要退出会议吗？",
				success: (res) => {
					if (res.confirm) {
						joined.value = false
						quitMeetingService(meeting.value.meetingId)
						uni.showToast({
							icon: "success",
							title: "退出成功"
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					}
				}
			})
		}
	}

	const isAttendMeeting = async () => {
		user = (await userInfoService()).data
		let attendMeetings = (await getUserattendMeetingsService()).data
		for (let i = 0; i < attendMeetings.length; i++) {
			if (user.userId == attendMeetings[i].userId && meetingId == attendMeetings[i].meetingId) {
				joined.value = true
				break
			}
		}
	}

	function joinMeeting() {
		uni.showModal({
			title: '加入会议',
			content: '是否加入会议？',
			success: (res) => {
				if (res.confirm) {
					// console.log(user);
					uni.navigateTo({
						url: '/pages/audio_to_text/audio_to_text?config=' + JSON.stringify(videoConfig) + "&roomID=" + meeting.value.meetingId + "&userID=" + user.userId + "&username=" + user.username
					})
					// uni.navigateTo({
					// 	url: '/pages/meeting/meeting-detail?config=' + JSON.stringify(videoConfig) + "&roomID=" + meeting.value.meetingId + "&userID=" + user.userId + "&username=" + user.username
					// })
					// uni.navigateTo({
					// 	url: "/pages/meeting/meeting-config"
					// })
				}
			}
		})
	}

	function getMeetingType(type : number) {
		switch (type) {
			case 1: return "线上会议";
			case 2: return "线下会议";
			case 3: return "线上/线下会议";
			default: return "error";
		}
	}

	function getTime(startTime, endTime) {
		return "开始：" + startTime + "\n结束：" + endTime
	}

	function toNavigation() {
		uni.showModal({
			title: "导航",
			content: "是否打开会议地点导航？",
			success: (res) => {
				if (res.confirm) {
					if (meeting.value.meetingLocation.includes('市')) {
						uni.navigateTo({
							url: "/pages/navigation/navigation?meetingLocation=" + meeting.value.meetingLocation
						})
					}
					else {
						uni.showToast({
							icon: "error",
							title: "会议地址无效"
						})
					}
				}
			}
		})
	}

	function toTopicDetail(topic) {
		uni.navigateTo({
			url: "/pages/meeting_detail/meeting_topic_detail?topicId=" + topic.topicId
		})
	}

	const getTopics = async () => {
		topics.value = (await meetingTopicsService(meeting.value.meetingId)).data
		for (let i = 0; i < topics.value.length; i++) {
			topics.value[i].score = topics.value[i].clickCount
		}
	}

	const getTopicsSortedByScore = async () => {
		sortedTopics.value = (await meetingTopicsSortedByScoreService(meeting.value.meetingId)).data
		for (let i = 0; i < sortedTopics.value.length; i++) {
			sortedTopics.value[i].score = sortedTopics.value[i].totalScore
		}
	}

	const getAISummanry = async () => {
		let content = getContent()
		console.log(content);
		aiSummaryText.value = (await AIMeetingSummaryService(content)).data
		console.log(aiSummaryText);
	}

	function getContent() {
		let meetingName = "会议名称：" + meeting.value.meetingName
		let startTime = "  开始时间：" + meeting.value.startTime
		let endTime = "  结束时间：" + meeting.value.endTime
		let meetingType = "  会议类别：" + getMeetingType(meeting.value.meetingStatus)
		let meetingLocation = "  会议地点：" + meeting.value.meetingLocation
		let rule = "  会场规则：" + meeting.value.rule
		let diningService = "  餐饮服务：" + meeting.value.diningService
		let theme = "  会议主题：" + meeting.value.theme
		let generalContent = "  大致内容：" + meeting.value.generalContent

		let content = meetingName + startTime + endTime + meetingType + meetingLocation + rule + diningService + theme + generalContent
		return content
	}

	function toMeetingInfo() {
		activeTab.value = "info"
		getMeetingDetail()
	}

	function toMeetingAgendas() {
		activeTab.value = 'agenda'
		getTopics()
	}

	function toTopicsRankings() {
		activeTab.value = 'rank'
		getTopicsSortedByScore()
	}

	const renderMarkdown = (markdownText) => {
		try {
			console.log(marked.parse(markdownText));
			return marked.parse(markdownText || '');
		} catch (e) {
			console.error('Markdown解析错误:', e);
			return markdownText;
		}
	}
</script>
<style scoped lang="scss">
	page {
		height: 100%;
	}

	.meeting-detail {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
	}

	.content {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		/* overflow: auto; */
	}

	.info-card {
		margin: 24rpx;
		padding: 32rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		flex-shrink: 0;
	}

	.meeting-name {
		font-size: 20px;
		font-weight: 600;
		color: #333333;
		margin-bottom: 24rpx;
		display: block;
	}

	.meeting_time,
	.meeting-host {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		gap: 10rpx;
	}

	/* .meeting-host {
		margin-left: 15rpx;
	} */

	.time-text,
	.host-text {
		margin-left: 12rpx;
		font-size: 14px;
		color: #666666;
	}

	.navigate {
		background-color: rgba(33, 150, 243, 0.1);
		color: #2196F3;
		border-radius: 100rpx;
		gap: 5rpx;
		font-size: 14px;
		align-items: center;
		padding: 4rpx 16rpx;
		margin-left: 30rpx;
		margin-top: -4rpx;
	}

	.meeting-tag {
		margin-top: 24rpx;
	}

	.type {
		display: inline-block;
		padding: 4rpx 16rpx;
		background-color: #e6f7ff;
		color: #1890ff;
		border-radius: 100rpx;
		font-size: 12px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	.tag {
		padding: 4rpx 16rpx;
		border-radius: 100rpx;
		font-size: 12px;
		color: #2196F3;
	}

	.quit_meeting_view {
		position: fixed;
		top: 50rpx;
		right: 50rpx;
	}

	.quit_meeting_view button {
		font-size: 12px;
		border-radius: 10rpx;
	}

	.detail-section {
		flex: 1;
		min-height: 0;
		margin: 24rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
	}

	.section-item {
		padding: 32rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.section-item:last-child {
		border-bottom: none;
	}

	.meeting-detail-container {
		flex: 1;
		overflow: auto;
		/* padding: 0 32rpx; */
	}

	.section-title {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.title-text {
		margin-left: 12rpx;
		font-size: 16px;
		font-weight: 500;
		color: #333333;
	}

	.section-content {
		font-size: 14px;
		color: #666666;
		line-height: 1.5;
	}

	.agenda-list {
		margin-top: 16rpx;
	}

	.agenda-item {
		margin-bottom: 32rpx;
		padding: 24rpx;
		background-color: #f8f9fa;
		border-radius: 12rpx;
		position: relative;
	}

	.agenda-time {
		font-size: 14px;
		color: #666666;
		margin-top: 8rpx;
	}

	.agenda-content {
		font-size: 16px;
		color: #333333;
		font-weight: 500;
		margin-bottom: 8rpx;
	}

	.tab-container {
		display: flex;
		flex-shrink: 0;
		padding: 24rpx 32rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #666666;
		padding: 16rpx 0;
		position: relative;
	}

	.tab-item.active {
		color: #1890ff;
		font-weight: 500;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 50%;
		transform: translateX(-50%);
		width: 48rpx;
		height: 4rpx;
		background-color: #1890ff;
		border-radius: 2rpx;
	}

	.file-list {
		margin-top: 16rpx;
	}

	.file-item {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.file-name {
		margin-left: 12rpx;
		font-size: 14px;
		color: #666666;
	}

	.rank-list {
		padding: 16rpx 0;
	}

	.rank-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		background-color: #f8f9fa;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
	}

	.rank-index {
		width: 48rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #e6e6e6;
		color: #666666;
		border-radius: 24rpx;
		font-size: 16px;
		font-weight: 600;
		margin-right: 24rpx;
	}

	/* .rank-index.top-three {
		background-color: #1890ff;
		color: #ffffff;
	} */

	.top-three {
		color: #fff;
		font-weight: bold;
		/* background: linear-gradient(135deg, #4c6fff, #6c8fff);*/
		background: linear-gradient(to right, #ffffff, #f0f7ff);
	}

	.rank-1 {
		background: linear-gradient(135deg, #ffd700, #ffb700);
		color: #ffffff;
	}

	.rank-2 {
		background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
		color: #ffffff;
	}

	.rank-3 {
		background: linear-gradient(135deg, #cd7f32, #a05a20);
		color: #ffffff;
	}

	.rank-content {
		flex: 1;
	}

	.rank-title {
		font-size: 16px;
		color: #333333;
		margin-bottom: 8rpx;
	}

	.rank-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.rank-time {
		font-size: 14px;
		color: #666666;
	}

	.rank-score {
		font-size: 16px;
		color: #1890ff;
		font-weight: 600;
	}

	.bottom-button {
		padding: 24rpx;
		background-color: #ffffff;
		flex-shrink: 0;
	}

	.join-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background-color: #1890ff;
		color: #ffffff;
		border-radius: 44rpx;
		font-size: 16px;
	}

	.join-btn.disabled {
		background-color: #d9d9d9;
		color: #ffffff;
	}

	/* 在style中添加 */
	.ai-summary-section {
		margin: 24rpx;
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		padding: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;
		height: 22vh;
		display: flex;
		flex-direction: column;
	}

	.summary_header {
		display: flex;
		flex-direction: row;
		margin-bottom: 20rpx;
	}

	.summary_title {
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	.generate_btn {
		background-color: #1890ff;
		color: white;
		border-radius: 40rpx;
		padding: 8rpx 32rpx;
		font-size: 14px;
		line-height: 1.5;
		font-size: 12px;
	}

	.summary-content {
		flex: 1;
		background-color: #f8f9fa;
		border-radius: 8rpx;
		padding: 16rpx;
		min-height: 0;
	}

	.summary-scroll {
		height: 100%;
	}

	.summary-text {
		font-size: 14px;
		color: #666;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.markdown-content {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		line-height: 1.8;
		color: #2c3e50;
		overflow-x: auto;
		font-size: 26rpx;

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin: 23rpx 0 20rpx;
			font-weight: 600;
			color: #1a1a1a;
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: 0;
				left: 0;
				width: 40rpx;
				height: 4rpx;
				background: #409eff;
			}
		}

		p {
			margin: 20rpx 0;
			text-align: justify;
		}

		ul,
		ol {
			padding-left: 60rpx;
			margin: 24rpx 0;

			li {
				margin: 16rpx 0;
				padding-left: 16rpx;

				&::marker {
					color: #409eff;
				}

				>p {
					margin: 0;
				}
			}
		}

		pre {
			position: relative;
			background: #f8f9fa;
			border-radius: 12rpx;
			padding: 32rpx;
			margin: 32rpx 0;
			overflow-x: auto;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

			code {
				font-family: "Fira Code", "Consolas", monospace;
				font-size: 26rpx;
				line-height: 1.5;
				display: block;
			}

			&::before {
				content: " ";
				position: absolute;
				top: 12rpx;
				right: 12rpx;
				width: 40rpx;
				height: 24rpx;
				background: #e8e8e8;
				border-radius: 4rpx;
			}
		}

		code {
			background: #f3f5f7;
			padding: 4rpx 8rpx;
			border-radius: 4rpx;
			color: #c7254e;
			font-size: 90%;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			margin: 32rpx 0;
			box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);

			th {
				background: #f5f7fa;
				padding: 20rpx;
				border: 1rpx solid #ebeef5;
				font-weight: 600;
				color: #303133;
			}

			td {
				padding: 16rpx;
				border: 1rpx solid #ebeef5;
				background: white;
			}

			tr:nth-child(even) td {
				background: #fafafa;
			}
		}

		blockquote {
			background: #f3f5f7;
			border-left: 6rpx solid #409eff;
			margin: 23rpx 0;
			padding: 24rpx 32rpx;
			color: #5e6d82;
			border-radius: 8rpx;

			p {
				margin: 0;
			}
		}

		a {
			color: #409eff;
			text-decoration: none;
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: -2rpx;
				left: 0;
				width: 0;
				height: 2rpx;
				background: #409eff;
				transition: width 0.3s ease;
			}

			&:hover::after {
				width: 100%;
			}
		}

		hr {
			height: 2rpx;
			background: linear-gradient(90deg, transparent, #409eff, transparent);
			margin: 48rpx 0;
			border: none;
		}

		img {
			max-width: 100%;
			height: auto;
			border-radius: 12rpx;
			margin: 24rpx 0;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
			display: block;
		}

		.task-list-item {
			list-style-type: none;
			margin-left: -24rpx;

			input[type="checkbox"] {
				margin-right: 12rpx;
				transform: scale(1.2);
			}
		}

		.math-display {
			overflow-x: auto;
			padding: 20rpx;
			background: #f8f9fa;
			margin: 24rpx 0;
		}
	}
</style>