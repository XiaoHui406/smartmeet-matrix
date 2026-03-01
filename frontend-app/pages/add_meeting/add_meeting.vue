<template>
	<view class="meeting-page">
		<view class="search-section">
			<view class="search-box">
				<uni-icons type="search" size="20" color="#666666" />
				<input type="text" v-model="searchKeyword" placeholder="搜索会议" />
			</view>
		</view>
		<view class="quick-join-icon" @click="addMeetingById()">
			<uni-icons type="plusempty" size="24" color="#FFFFFF" />
		</view>
		<view class="meetings-section">
			<view class="section-title">所有会议</view>
			<view class="meetings-list">
				<view v-for="meeting in filteredMeetings" :key="meeting.meetingId" class="meeting-card"
					@click="showMeetingDetail(meeting)">
					<view class="meeting-header">
						<text class="meeting-name">{{ meeting.meetingName }}</text>
						<text :class="['meeting-type', meeting.meetingType === 1 ? 'online' : 'offline']">
							{{ getMeetingType(meeting.meetingType) }}
						</text>
					</view>
					<view class="meeting-info">
						<view class="info-item">
							<uni-icons type="calendar" size="16" color="#666666" />
							<text class="info-text">{{ "开始：" + meeting.startTime + "\n结束：" + meeting.endTime }}</text>
						</view>
						<view class="info-item">
							<uni-icons type="location" size="16" color="#666666" />
							<text class="info-text">{{ meeting.meetingLocation }}</text>
						</view>
						<view class="info-item">
							<uni-icons type="person" size="16" color="#666666" />
							<text
								class="info-text">{{ meeting.attendeesNumber + "/" + (meeting.maxNumber != null ? meeting.maxNumber : "无限制") }}</text>
						</view>
						<view class="info-item">
							<uni-icons type="star" size="16" color="#666666" />
							<view class="tags">
								<text v-for="(tag, tagIndex) in meeting.tags" :key="tagIndex" class="tag"
									:style="{ backgroundColor: tagColors[tagIndex % tagColors.length] }">
									{{ tag }}
								</text>
							</view>
						</view>
					</view>
					<button :class="['action-button', meeting.joined ? 'cancel' : 'join']"
						@click.stop="handleMeetingAction(meeting)">
						{{ meeting.joined ? '取消参加' : '参加会议' }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import { ref, computed } from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import { publicMeetingService } from "../../api/meetings.js"
	import {
		getUserattendMeetingsService,
		attendMeetingService,
		quitMeetingService,
		getAttendeesService
	} from "../../api/attend_meeting.js"
	const meetingId = ref('')
	const meetingPassword = ref('')
	const showQuickJoinModal = ref(false);
	const popup = ref<any>(null);
	const tagColors = [
		'rgba(33, 150, 243, 0.1)',
		'rgba(76, 175, 80, 0.1)',
		'rgba(255, 152, 0, 0.1)',
	];

	const popupChange = (e : boolean) => {
		showQuickJoinModal.value = e;
		if (!e) {
			meetingId.value = '';
			meetingPassword.value = '';
		}
	};
	const searchKeyword = ref('');
	let userId = null

	const meetings = ref([]);
	const handleQuickJoin = () => {
		if (!meetingId.value || !meetingPassword.value) {
			uni.showToast({
				title: '请输入会议ID和密码',
				icon: 'none'
			});
			return;
		}
		uni.showToast({
			title: '加入成功',
			icon: 'success'
		});
		showQuickJoinModal.value = false;
		meetingId.value = '';
		meetingPassword.value = '';
	};

	const handleMeetingAction = (meeting) => {
		if (meeting.joined == true) {
			uni.showModal({
				content: "确定退出会议吗？",
				success: (res) => {
					if (res.confirm) {
						quitMeeting(meeting)
						meeting.joined = false;
						uni.showToast({
							title: '已退出会议',
							icon: 'success'
						});
						getMeetings()
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
						attendMeeting(meeting)
						meeting.joined = true;
						uni.showToast({
							title: '已加入会议',
							icon: 'success'
						});
						getMeetings()
					}
				},
			})
		}
	};

	const filteredMeetings = computed(() => {
		if (!searchKeyword.value) return meetings.value.filter(meeting =>
			meeting.meetingStatus == 1
		).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
		return meetings.value.filter(meeting =>
			meeting.meetingName.toLowerCase().includes(searchKeyword.value.toLowerCase()) && meeting.meetingStatus == 1
		).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
	});

	onLoad((option) => {
		userId = option.userId
	})

	onShow(() => {
		getMeetings()
	})

	const getMeetings = async () => {
		let now = new Date().getTime()
		let getMeetings = await publicMeetingService()
		let attendMeetings = await getUserattendMeetingsService()
		meetings.value.splice(0, meetings.value.length)
		for (let i = 0; i < getMeetings.data.length; i++) {
			let isAttend = false
			for (let j = 0; j < attendMeetings.data.length; j++) {
				if (attendMeetings.data[j].meetingId === getMeetings.data[i].meetingId) {
					isAttend = true
					break;
				}
			}
			getMeetings.data[i].joined = isAttend
			getMeetings.data[i].tags = getMeetings.data[i].theme.split(' ')
			getAttendeesNumber(getMeetings.data[i]).then(() => {
				meetings.value.push(getMeetings.data[i])
			})
		}
		meetings.value.filter(meeting =>
			new Date(meeting.startTime).getTime() > now
		).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
	}

	function getMeetingType(type) {
		switch (type) {
			case 1: return "线上"
			case 2: return "线下"
			case 3: return "线上/线下"
			default: return "error"
		}
	}

	function showMeetingDetail(meeting) {
		uni.navigateTo({
			url: "/pages/meeting_detail/meeting_detail?meetingId=" + meeting.meetingId
		})
	}

	const attendMeeting = async (meeting) => {
		console.log(meeting);
		await attendMeetingService(userId, meeting.meetingId)
	}

	const quitMeeting = async (meeting) => {
		console.log(meeting);
		await quitMeetingService(meeting.meetingId)
	}

	const getAttendeesNumber = async (meeting) => {
		let attendees = await getAttendeesService(meeting.meetingId)
		meeting.attendeesNumber = attendees.data.length
	}

	function addMeetingById() {
		uni.navigateTo({
			url: "/pages/add_meeting/add_meeting_by_id?userId=" + userId
		})
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #F5F5F5;
	}

	.meeting-page {
		padding: 30rpx;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.search-section {
		margin-bottom: 30rpx;
	}

	.search-box {
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 8rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.search-box input {
		flex: 1;
		margin-left: 20rpx;
		font-size: 14px;
	}

	.section-title {
		font-size: 16px;
		color: #333333;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.quick-join-icon {
		position: fixed;
		bottom: 120rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #1976D2, #64B5F6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 6rpx 20rpx rgba(25, 118, 210, 0.3);
		z-index: 100;
		transition: transform 0.3s ease;
	}

	.popup-content {
		background-color: #FFFFFF;
		padding: 40rpx;
		border-radius: 12rpx;
		width: 600rpx;
	}

	.popup-title {
		font-size: 18px;
		color: #333333;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.input-group {
		margin-bottom: 30rpx;
	}

	.input-item {
		display: flex;
		align-items: center;
		border: 1px solid #E0E0E0;
		border-radius: 8rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.input-item input {
		flex: 1;
		margin-left: 20rpx;
		font-size: 14px;
	}

	.join-button {
		background-color: #1976D2;
		color: #FFFFFF;
		font-size: 16px;
		margin: 0;
	}

	.meetings-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.meetings-list {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.meeting-card {
		background-color: #FFFFFF;
		padding: 30rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.meeting-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.meeting-name {
		font-size: 16px;
		font-weight: bold;
		color: #333333;
	}

	.meeting-type {
		padding: 4rpx 16rpx;
		border-radius: 4rpx;
		font-size: 12px;
	}

	.online {
		background-color: #E3F2FD;
		color: #1976D2;
	}

	.offline {
		background-color: #F5F5F5;
		color: #666666;
	}

	.meeting-info {
		margin-bottom: 20rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.info-text {
		margin-left: 10rpx;
		font-size: 14px;
		color: #666666;
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

	.action-button {
		width: 100%;
		font-size: 14px;
		margin: 0;
		z-index: 1;
		position: relative;
	}

	.join {
		background-color: #1976D2;
		color: #FFFFFF;
	}

	.cancel {
		background-color: #F5F5F5;
		color: #666666;
	}
</style>