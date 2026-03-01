<template>
	<view class="container">
		<view class="form-container">
			<view class="title">加入会议</view>
			<view class="input-group">
				<uni-icons class="input-icon" type="person" size="20" color="#666"></uni-icons>
				<input class="input" type="text" v-model="meetingId" placeholder="请输入会议ID"
					placeholder-class="placeholder" />
			</view>
			<view class="input-group">
				<uni-icons class="input-icon" type="locked" size="20" color="#666"></uni-icons>
				<input class="input" type="password" v-model="password" placeholder="请输入会议密码"
					placeholder-class="placeholder" />
			</view>
			<button class="join-btn" @click="handleJoinMeeting">
				加入会议
			</button>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from "@dcloudio/uni-app"
	import { attendMeetingService } from "../../api/attend_meeting.js"
	import { meetingDetailService } from "../../api/meetings.js"
	import { getUserattendMeetingsService } from "../../api/attend_meeting.js"

	const meetingId = ref('');
	const password = ref('');
	let meeting = null
	let attendMeetings = []
	let userId = null

	const handleJoinMeeting = () => {
		if (!meetingId.value) {
			uni.showToast({
				title: '请输入会议ID',
				icon: 'error'
			});
			return;
		}
		// 这里添加加入会议的逻辑
		getMeetingDetail().then(() => {
			if (meeting.isPublic == 0 && meeting.meetingPassword != password.value) {
				uni.showToast({
					title: '会议密码错误',
					icon: 'error'
				});
				return;
			}

			for (let i = 0; i < attendMeetings.length; i++) {
				if (meetingId.value == attendMeetings[i].meetingId) {
					uni.showToast({
						title: '您已参加该会议',
						icon: 'error'
					});
					return;
				}
			}
			console.log("test1");

			attendMeeting()
			uni.showToast({
				title: '成功加入会议',
				icon: 'success'
			});
			setTimeout(() => {
				uni.navigateBack()
			}, 2000)
		})
	};

	onLoad((option) => {
		userId = option.userId
		getUserAttendMeetings()
	})

	const getMeetingDetail = async () => {
		meeting = (await meetingDetailService(meetingId.value)).data
	}

	const getUserAttendMeetings = async () => {
		attendMeetings = (await getUserattendMeetingsService()).data
	}

	const attendMeeting = async () => {
		await attendMeetingService(userId, meetingId.value)
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
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		padding: 0 40rpx;
	}

	.form-container {
		width: 90%;
		background-color: #ffffff;
		border-radius: 40rpx;
		padding: 60rpx 40rpx;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.title {
		font-size: 36px;
		font-weight: 600;
		color: #333333;
		text-align: center;
		margin-bottom: 80rpx;
	}

	.input-group {
		position: relative;
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;
		background-color: #f8f8f8;
		border-radius: 20rpx;
		padding: 24rpx 32rpx;
	}

	.input-icon {
		margin-right: 20rpx;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}

	.input {
		flex: 1;
		font-size: 16px;
		color: #333333;
	}

	.placeholder {
		color: #999999;
		font-size: 16px;
	}

	.join-btn {
		width: 100%;
		height: 96rpx;
		background-color: #2b85e4;
		color: #ffffff;
		font-size: 18px;
		font-weight: 500;
		border-radius: 20rpx;
		margin-top: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.join-btn:active {
		opacity: 0.8;
	}
</style>