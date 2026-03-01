<template>
	<view class="content">
		<view style="padding: 20rpx;">
			<text style="color: white;">实时语音转文字</text>
		</view>
		<view class="buttonView">
			<button @click="start" class="actionButton">开始说话</button>
			<button @click="end" class="actionButton">停止说话</button>
		</view>
		<scroll-view class="trans-text" scroll-y>
			<text style="color: white">{{msg}}</text>
		</scroll-view>
		<yimo-AudioTrans ref="yimoAudioTransRefs" :options="options" @countDown="countDown" @result="resultMsg"
			@onStop="onStop" @onOpen="onOpen" @change="change"></yimo-AudioTrans>
	</view>
</template>

<script>
	import {
		getUserattendMeetingsService,
		updateLeaveTimeService
	} from "../../api/attend_meeting.js"
	import {
		userAttendMeetingService,
		meetingDetailService
	} from "../../api/meetings.js";

	export default {
		data() {
			return {
				title: 'Hello',
				msg: '',
				options: {
					receordingDuration: 3600,
					APPID: '',
					API_KEY: ''
				},
				videoConfig: null,
				roomID: 0,
				userID: 0,
				username: "",
				subNvue: uni.getSubNVueById("meeting"),
				meeting: null
			};
		},
		onLoad(option) {
			console.log(option);
			this.videoConfig = JSON.parse(option.config)
			this.roomID = option.roomID
			this.userID = option.userID
			this.username = option.username
		},
		onShow() {
			this.getMeetingDetail()
			setTimeout(() => {
				console.log("已发送");
				uni.$emit('getMeetingData', {
					config: JSON.stringify(this.videoConfig),
					roomID: this.roomID,
					userID: this.userID,
					username: this.username
				})
			}, 500)
		},
		onBackPress() {
			this.leaveMeeting()
			uni.$emit('backPress', {
				isLeave: true
			})
		},
		methods: {
			start() {
				uni.showToast({
					icon: "none",
					title: "开始实时语音转文字",
					duration: 800
				})
				this.$refs.yimoAudioTransRefs.start();
			},
			end() {
				this.$refs.yimoAudioTransRefs.end();
				uni.showModal({
					title: "语音转文字",
					content: "是否保存转文字结果？转文字结果可以在“智会助手”模块传给AI智能体进行问答",
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								icon: "none",
								title: "转文字结果已保存",
								duration: 800
							})
							let audioToText = uni.getStorageSync('audio_to_text')
							console.log(audioToText);
							if (audioToText != null) {
								let toTextArray = audioToText
								console.log(toTextArray);
								let repeatCount = 0
								for (let i = 0; i < toTextArray.length; i++) {
									if (this.roomID == toTextArray[i].meetingId) {
										repeatCount++
									}
								}
								toTextArray.push({
									materialId: 99999999 - toTextArray.length,
									meetingId: this.roomID,
									materialName: "语音转文字" + (repeatCount + 1) + "-" + this.meeting
										.meetingName,
									materialType: "docx",
									materialPath: "",
									audioToTextResult: this.msg
								})
								console.log(toTextArray);
								uni.setStorageSync('audio_to_text', toTextArray)
							} else {
								uni.setStorageSync('audio_to_text', [])
							}
						} else if (res.cancel) {
							uni.showToast({
								icon: "none",
								title: "结束实时语音转文字",
								duration: 800
							})
						}
					}
				})
			},
			countDown(e) {
				console.log('countDown', e);
			},
			onStop(e) {
				console.log('onStop', e);
			},
			onOpen(e) {
				console.log('onOpen', e);
			},
			change(e) {
				console.log('change', e);
			},
			resultMsg(e) {
				this.msg = e
				console.log('resultMsg', e);
			},
			async updateLeaveTime() {
				let now = new Date().toLocaleString()
				await updateLeaveTimeService(this.userID, this.roomID, now)
			},
			async leaveMeeting() {
				let attendInfos = (await getUserattendMeetingsService()).data
				let infos = attendInfos.filter(attendInfo =>
					attendInfo.meetingId == this.roomID
				)
				if (infos[0].attendanceStatus == 3) {
					let now = this.formatDateTime(new Date())
					await updateLeaveTimeService(this.userID, this.roomID, now)
				}
			},
			async getMeetingDetail() {
				this.meeting = (await meetingDetailService(this.roomID)).data
				// console.log(this.meeting);
			},
			formatDateTime(date) {
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const hour = date.getHours();
				const minute = date.getMinutes();
				const second = date.getSeconds();
				return `${year}/${this.pad(month)}/${this.pad(day)} ${this.pad(hour)}:${this.pad(minute)}:${this.pad(
			    second
			  )}`;
			},
			pad(num) {
				return num.toString().padStart(2, "0");
			}
		}
	};
</script>

<style scoped>
	page {
		height: 30%;
	}

	.content {
		width: 100%;
		height: 100%;
		background: #1A1D24;
		position: absolute;
		min-height: 100%;
		border-top: 2px solid white;
		display: flex;
		flex-direction: column;
	}

	.buttonView {
		display: flex;
		flex-direction: row;
		width: 100%;
		flex-shrink: 0;
		padding: 20rpx 0;
	}

	.actionButton {
		width: 50%;
		background: #3A3F47;
		color: #E4E6EB;
		border-radius: 8rpx;
		font-size: 26rpx;
		padding: 12rpx 24rpx;
		margin: 0 10rpx;
	}

	.trans-text {
		font-size: 30rpx;
		flex: 1;
		min-height: 0;
		width: 94%;
		margin-left: 3%;
	}
</style>