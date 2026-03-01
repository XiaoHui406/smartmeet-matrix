<template>
	<view class="container">
		<!-- 推荐会议区域 -->
		<view class="section-title">
			<text class="title">为您推荐</text>
		</view>
		<view class="recommend-tabs">
			<view class="recommend-tab" :class="{ 'active': recommendType === 'meeting' }"
				@tap="recommendType = 'meeting'">
				推荐会议
			</view>
			<view class="recommend-tab" :class="{ 'active': recommendType === 'agenda' }"
				@tap="recommendType = 'agenda'">
				推荐议程
			</view>
		</view>
		<scroll-view class="meeting-scroll" scroll-x>
			<view class="meeting-list">
				<template v-if="recommendType == 'meeting' && recommendMeetings.length > 0">
					<view class="meeting-card" v-for="(item, index) in recommendMeetings" :key="index"
						@click="toMeetingDetail(item)">
						<view class="meeting-info">
							<text class="meeting-title">{{ item.meetingName }}</text>
							<view class="meeting-detail">
								<view class="detail-item">
									<uni-icons type="calendar" size="16" color="#666"></uni-icons>
									<text>{{ "开始：" + item.startTime + "\n结束：" + item.endTime }}</text>
								</view>
								<view class="detail-item">
									<uni-icons type="location" size="16" color="#666"></uni-icons>
									<text>{{ item.meetingLocation }}</text>
								</view>
								<view class="detail-item">
									<uni-icons type="person" size="16" color="#666"></uni-icons>
									<text>{{ item.attendeesNumber + "/" + (item.maxNumber != null ? item.maxNumber : "无限制") }}</text>
								</view>
							</view>
							<view class="tags">
								<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="tag"
									:style="{ backgroundColor: tagColors[tagIndex % tagColors.length] }">
									{{ tag }}
								</text>
							</view>
						</view>
						<button :class="['action-button', item.joined ? 'cancel' : 'join']"
							@click.stop="handleMeetingAction(item)">
							{{ item.joined ? '取消参加' : '参加会议' }}
						</button>
					</view>
				</template>
				<template v-else-if="recommendType === 'agenda' && recommendTopics.length > 0">
					<view class="meeting-card" v-for="(item, index) in recommendTopics" :key="index">
						<view class="meeting-info">
							<text class="agenda-title">{{ item.topicName }}</text>
							<view class="meeting-title-box">
								<text class="sub-meeting-title">{{ item.meetingName }}</text>
							</view>
							<view class="meeting-detail">
								<view class="detail-item">
									<uni-icons type="calendar" size="16" color="#666"></uni-icons>
									<text>{{ "开始：" + item.startTime + "\n结束：" + item.endTime }}</text>
								</view>
								<view class="detail-item">
									<uni-icons type="person" size="16" color="#666"></uni-icons>
									<text>{{ item.attendeesNumber + "/" + (item.maxNumber != null ? item.maxNumber : "无限制") }}</text>
								</view>
								<!-- <view class="detail-item">
									<uni-icons type="location" size="16" color="#666"></uni-icons>
									<text>{{ item.location }}</text>
								</view> -->
							</view>
							<!-- <view class="tags">
								<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="tag"
									:style="{ backgroundColor: tagColors[tagIndex % tagColors.length] }">
									{{ tag }}
								</text>
							</view> -->
							<view class="action-buttons">
								<view class="action-button detail-btn" @click="toTopicDetail(item)">
									<uni-icons type="info" size="16" color="#4c6fff"></uni-icons>
									<text>议程详情</text>
								</view>
								<view class="action-button detail-btn" @click="toMeetingDetail(item)">
									<uni-icons type="info" size="16" color="#4c6fff"></uni-icons>
									<text>会议详情</text>
								</view>
								<!-- <view class="action-button join-btn" @click="addMeetingByTopic(item)">
									<uni-icons type="plusempty" size="16" color="#fff"></uni-icons>
									<text>加入会议</text>
								</view> -->
							</view>
							<button :class="['action-button', item.joined ? 'cancel' : 'join']"
								@click.stop="handleMeetingAction(item)">
								{{ item.joined ? '取消参加' : '参加会议' }}
							</button>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="empty-state">
						<uni-icons type="info" size="32" color="#999"></uni-icons>
						<text class="empty-text">{{recommendType == 'meeting' ? '暂无推荐会议' : '暂无推荐议程'}}</text>
					</view>
				</template>
			</view>
		</scroll-view>
		<!-- 热门议题排行榜 -->
		<view class="ranking-section">
			<view class="section-title">
				<text class="title">热门会议榜</text>
				<!-- <text class="more" @click="toRankings()">查看全部</text> -->
				<view class="tabs">
					<view v-for="(tab, index) in tabs" :key="index" class="tab-item"
						:class="{'active': rankingType === index}" @click="handleTabClick(index)">
						<text class="tab-text">{{tab.name}}</text>
						<view v-if="rankingType === index" class="tab-line"></view>
					</view>
				</view>
			</view>
			<view class="ranking-list">
				<view class="ranking-item" v-for="(item, index) in hotMeetings" :key="index"
					:class="[index < 3 ? 'top-three' : '']" @click="toMeetingDetail(item)">
					<view class="rank-num" :class="['rank', `rank-${index + 1}`]">{{ index + 1 }}</view>
					<view class="topic-info">
						<text class="topic-title">{{ item.meetingName }}</text>
						<text class="topic-hot">{{ item.score }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		recommendMeetingsService,
		meetingsSortByClickCountService,
		meetingsSortByNumberService,
		meetingsSortByIntegratedService,
		userAttendMeetingService,
		meetingDetailService,
		publicMeetingService
	} from '../../api/meetings';
	import {
		getAttendeesService,
		attendMeetingService,
		quitMeetingService
	} from "../../api/attend_meeting.js"
	import {
		userInfoService
	} from '../../api/user.js'
	import {
		recommendTopicsService
	} from '../../api/topics.js'

	const tagColors = [
		'rgba(33, 150, 243, 0.1)',
		'rgba(76, 175, 80, 0.1)',
		'rgba(255, 152, 0, 0.1)',
	];
	const tabs = ref([
		{ name: '热度榜' },
		{ name: '人数榜' },
		{ name: '综合榜' }
	]);
	let user = null
	let rankingType = ref(0)
	let attendMeetings = ref([])
	let recommendType = ref('meeting')
	const recommendMeetings = ref([]);
	const recommendTopics = ref([])
	const hotMeetings = ref([]);

	function toMeetingDetail(meeting) {
		uni.navigateTo({
			url: "/pages/meeting_detail/meeting_detail?meetingId=" + meeting.meetingId
		})
	}

	function toTopicDetail(topic) {
		uni.navigateTo({
			url: "/pages/meeting_detail/meeting_topic_detail?topicId=" + topic.topicId
		})
	}

	function addMeetingByTopic(topic) {

	}

	const getRecommendMeetings = async () => {
		let meetings = (await recommendMeetingsService()).data
		recommendMeetings.value.splice(0, recommendMeetings.value.length)
		for (let i = 0; i < meetings.length; i++) {
			let meeting = meetings[i]
			if (meeting.meetingStatus != 1) {
				continue
			}
			let isJoin = false
			for (let j = 0; j < attendMeetings.value.length; j++) {
				if (meeting.meetingId == attendMeetings.value[j].meetingId) {
					isJoin = true
					break
				}
			}
			if (!isJoin) {
				meeting.tags = meeting.theme.split(' ')
				meeting.joined = false
				getAttendeesNumber(meeting).then(() => {
					if (meeting.attendeesNumber <= meeting.maxNumber || meeting.maxNumber == null) {
						recommendMeetings.value.push(meeting)
					}
				})
			}
		}
		console.log(meetings);
	}

	const getAttendeesNumber = async (meeting) => {
		let attendees = await getAttendeesService(meeting.meetingId)
		meeting.attendeesNumber = attendees.data.length
	}

	onShow(() => {
		getUserAttendMeetings().then(() => {
			getRecommendMeetings()
			getRecommendTopics()
		})
		getRanking()
		getUserInfo()
	})

	function getRanking() {
		if (rankingType.value == 0) {
			getMeetingsSortByClickCount()
		}
		else if (rankingType.value == 1) {
			getMeetingsSortByNumber()
		}
		else if (rankingType.value == 2) {
			getMeetingsSortByIntegrated()
		}
	}

	function recommendTypeChange(type) {
		if (type == 'meeting') {
			recommendType.value = 'meeting'
			getRecommendMeetings()
		}
		else if (type == 'agenda') {
			recommendType.value = 'agenda'
		}
	}

	const getRecommendTopics = async () => {
		let topics = await (await recommendTopicsService()).data
		console.log(topics);
		recommendTopics.value.splice(0, recommendTopics.value.length)
		for (let i = 0; i < topics.length; i++) {
			let isJoin = false
			let meetingId = topics[i].meetingId
			for (let j = 0; j < attendMeetings.value.length; j++) {
				if (meetingId == attendMeetings.value[j].meetingId) {
					isJoin = true
				}
			}
			if (!isJoin) {
				topics[i].joined = false
				let meeting = (await meetingDetailService(meetingId)).data
				if (meeting.meetingStatus != 1) {
					continue
				}
				getAttendeesNumber(meeting).then(() => {
					if (meeting.attendeesNumber <= meeting.maxNumber || meeting.maxNumber == null) {
						topics[i].meetingName = meeting.meetingName
						topics[i].attendeesNumber = meeting.attendeesNumber
						topics[i].maxNumber = meeting.maxNumber
						recommendTopics.value.push(topics[i])
					}
				})
			}
		}
	}

	const getMeetingsSortByClickCount = async () => {
		let meetings = (await meetingsSortByClickCountService()).data
		hotMeetings.value.splice(0, hotMeetings.value.length)
		for (let i = 0; i < meetings.length; i++) {
			let meeting = meetings[i]
			if (meeting.meetingStatus == 3) {
				continue
			}
			meeting.score = meeting.clickCount
			hotMeetings.value.push(meeting)
		}
	}

	const getMeetingsSortByNumber = async () => {
		let meetings = (await meetingsSortByNumberService()).data
		hotMeetings.value.splice(0, hotMeetings.value.length)
		for (let i = 0; i < meetings.length; i++) {
			let meeting = meetings[i]
			if (meeting.meetingStatus == 3) {
				continue
			}
			meeting.score = meeting.attendeeCount
			hotMeetings.value.push(meeting)
		}
	}

	const getMeetingsSortByIntegrated = async () => {
		let meetings = (await meetingsSortByIntegratedService()).data
		hotMeetings.value.splice(0, hotMeetings.value.length)
		for (let i = 0; i < meetings.length; i++) {
			let meeting = meetings[i]
			if (meeting.meetingStatus == 3) {
				continue
			}
			meeting.score = meeting.weightScore
			hotMeetings.value.push(meeting)
		}
	}

	const handleTabClick = (index : number) => {
		rankingType.value = index;
		getRanking()
	};

	const getUserAttendMeetings = async () => {
		attendMeetings.value = (await userAttendMeetingService()).data
	}

	const handleMeetingAction = (meeting) => {
		if (meeting.joined == true) {
			uni.showModal({
				content: "确定退出会议吗？",
				success: (res) => {
					if (res.confirm) {
						quitMeeting(meeting).then(() => {
							getAttendeesNumber(meeting)
						})
						meeting.joined = false;
						uni.showToast({
							title: '已退出会议',
							icon: 'success'
						});
					}
				},
			})
		}
		else {
			uni.showModal({
				content: "确定加入会议吗？",
				success: (res) => {
					if (res.confirm) {
						if (meeting.attendeesNumber >= meeting.maxNumber && meeting.maxNumber != null) {
							uni.showToast({
								title: '参会人数已满',
								icon: 'error'
							});
							return
						}
						attendMeeting(meeting).then(() => {
							getAttendeesNumber(meeting)
						})
						meeting.joined = true;
						uni.showToast({
							title: '已加入会议',
							icon: 'success'
						});
					}
				},
			})
		}
	};

	const attendMeeting = async (meeting) => {
		console.log(meeting);
		await attendMeetingService(user.userId, meeting.meetingId)
	}

	const quitMeeting = async (meeting) => {
		console.log(meeting);
		await quitMeetingService(meeting.meetingId)
	}

	const getUserInfo = async () => {
		user = (await userInfoService()).data
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #f5f6fa;
	}

	.container {
		height: 100vh;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		padding-top: 120rpx;
		box-sizing: border-box;
	}

	.header {
		margin-bottom: 20rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.search-input {
		margin-left: 20rpx;
		flex: 1;
		font-size: 14px;
	}

	.section-title {
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		align-items: center;
		/* margin-bottom: 20rpx; */
		/* background: linear-gradient(135deg, #1677ff, #4096ff); */
	}

	.recommend-tabs {
		display: flex;
		gap: 20rpx;
		/* margin-bottom: 10rpx; */
	}

	.recommend-tab {
		padding: 10rpx 30rpx;
		background-color: #f8f9fc;
		border-radius: 100rpx;
		font-size: 14px;
		color: #666;
		transition: all 0.3s ease;
	}

	.recommend-tab.active {
		background-color: #4c6fff;
		color: #fff;
	}

	.title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
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

	.more {
		font-size: 14px;
		color: #2196F3;
	}

	.meeting-scroll {
		width: 100%;
		overflow: auto;
	}

	.meeting-list {
		display: flex;
		gap: 20rpx;
		padding: 10rpx 0;
	}

	.meeting-card {
		flex-shrink: 0;
		width: 540rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.meeting-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.meeting-title-box {
		margin-bottom: 20rpx;
	}

	.sub-meeting-title {
		font-size: 14px;
		color: #666;
	}

	.meeting-detail {
		margin-bottom: 20rpx;
	}

	.detail-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.detail-item text {
		margin-left: 10rpx;
		font-size: 14px;
		color: #666;
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

	.action-buttons {
		display: flex;
		gap: 20rpx;
	}

	.action-button {
		width: 100%;
		font-size: 14px;
		margin: 0;
		z-index: 1;
		position: relative;
		margin-top: 10rpx;
	}

	.detail-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16rpx;
		border-radius: 8rpx;
		font-size: 14px;
		gap: 8rpx;
		background-color: rgba(76, 111, 255, 0.1);
		color: #4c6fff;
	}

	.join {
		background-color: #1976D2;
		color: #FFFFFF;
	}

	.cancel {
		background-color: #F5F5F5;
		color: #666666;
	}

	.ranking-section {
		flex: 1;
		min-height: 0;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.ranking-list {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		margin-top: 30rpx;
	}

	.ranking-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-radius: 12rpx;
		background-color: #f8f9fc;
		margin-bottom: 20rpx;
	}

	.rank-num {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #999;
		margin-right: 20rpx;
		background-color: #fff;
		border-radius: 24rpx;
	}

	.top-three {
		color: #fff;
		font-weight: bold;
		/* background: linear-gradient(135deg, #4c6fff, #6c8fff);*/
		background: linear-gradient(to right, #ffffff, #f0f7ff);
	}

	.rank {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 30rpx;
		font-weight: bold;
		font-size: 16px;
		margin-right: 20rpx;
		background-color: #e6e6e6;
		color: #666666;
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


	.topic-info {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.topic-title {
		font-size: 14px;
		color: #333;
		flex: 1;
		margin-right: 20rpx;
	}

	.topic-hot {
		font-size: 12px;
		color: #4c6fff;
		background-color: rgba(76, 111, 255, 0.1);
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
	}

	.empty-state {
		width: 100%;
		height: 300rpx;
		background: #fff;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		align-self: center;
		gap: 20rpx;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.empty-text {
		font-size: 14px;
		color: #999;
	}
</style>