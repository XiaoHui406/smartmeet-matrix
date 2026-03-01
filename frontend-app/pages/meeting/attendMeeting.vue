<template>
	<view class="container">
		<!-- 加载状态 -->
		<view v-if="loading" class="loading-wrapper">
			<u-loading-icon size="40" color="#409eff"></u-loading-icon>
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 数据列表 -->
		<scroll-view v-else scroll-y class="scroll-view" :show-scrollbar="false">
			<view v-for="item in meetingList" :key="item.attendId" class="meeting-card">
				<!-- 状态角标 -->
				<view class="status-badge" :style="{ backgroundColor: statusConfig[item.attendanceStatus].color }">
					{{ statusConfig[item.attendanceStatus].text }}
				</view>

				<!-- 主体内容 -->
				<view class="content-wrapper">
					<!-- 会议标题 -->
					<view class="header">
						<text class="title">{{ item.meetingName }}</text>
						<u-icon :name="statusConfig[item.attendanceStatus].icon"
							:color="statusConfig[item.attendanceStatus].color" size="20"></u-icon>
					</view>

					<!-- 会议地点 -->
					<view class="location">
						<u-icon name="map" size="16" color="#909399"></u-icon>
						<text class="location-text">{{ item.meetingLocation }}</text>
					</view>

					<!-- 时间信息 -->
					<view class="time-container">
						<view class="time-item">
							<u-icon name="clock" size="16" color="#606266"></u-icon>
							<text class="time-label">开始</text>
							<text class="time-value">
								{{ item.attendanceStatus === 3 ? 
                  formatTime(item.attendTime) : 
                  formatTime(item.startTime) }}
							</text>
						</view>

						<view class="separator"></view>

						<view class="time-item">
							<u-icon name="minus-circle" size="16" color="#606266"></u-icon>
							<text class="time-label">结束</text>
							<text class="time-value">
								{{ item.attendanceStatus === 3 ? 
                  formatTime(item.leaveTime) : 
                  formatTime(item.endTime) }}
							</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<u-empty v-if="!meetingList.length" mode="list"
				icon="https://cdn.uviewui.com/uview/empty/list.png"></u-empty>
		</scroll-view>
	</view>
</template>

<script setup>
	// 保持与原始版本相同的数据逻辑
	import {
		ref,
		onMounted
	} from 'vue'
	import dayjs from 'dayjs'
	import {
		myAttendMeetingService,
		meetingDetailService
	} from '@/api/meeting.js'

	const meetingList = ref([])
	const loading = ref(true)

	const statusConfig = {
		1: {
			icon: 'info-circle',
			color: '#909399',
			text: '未设置签到'
		},
		2: {
			icon: 'clock',
			color: '#e6a23c',
			text: '未签到'
		},
		3: {
			icon: 'checkmark-circle',
			color: '#67c23a',
			text: '已签到'
		},
		4: {
			icon: 'clock-fill',
			color: '#409eff',
			text: '未开始'
		}
	}

	// 保持与原始版本相同的数据获取逻辑
	onMounted(async () => {
		try {
			const {
				data
			} = await myAttendMeetingService({})
			const meetings = await Promise.all(
				data.map(async attend => {
					const {
						data: detail
					} = await meetingDetailService(attend.meetingId)
					return {
						...attend,
						...detail
					}
				})
			)
			meetingList.value = meetings
		} catch (e) {
			uni.showToast({
				title: '数据加载失败',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	})

	const formatTime = time => {
		return dayjs(time).format('YYYY/MM/DD HH:mm')
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		background-color: #f5f7fa;
		min-height: 100vh;
	}

	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;

		.loading-text {
			color: #909399;
			font-size: 28rpx;
			margin-top: 20rpx;
		}
	}

	.meeting-card {
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		padding: 45rpx;
		position: relative;
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);

		.status-badge {
			position: absolute;
			right: -4rpx;
			top: -4rpx;
			padding: 8rpx 16rpx;
			border-radius: 0 16rpx 0 16rpx;
			font-size: 22rpx;
			color: white;
			font-weight: 500;
		}
	}

	.content-wrapper {
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #303133;
				max-width: 80%;
			}
		}

		.location {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			&-text {
				font-size: 26rpx;
				color: #606266;
				margin-left: 10rpx;
			}
		}
	}

	.time-container {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.time-item {
			flex: 1;
			display: flex;
			align-items: center;

			.time-label {
				color: #909399;
				font-size: 26rpx;
				margin: 0 12rpx;
			}

			.time-value {
				color: #303133;
				font-size: 20rpx;
			}
		}

		.separator {
			width: 1px;
			height: 40rpx;
			background-color: #e4e7ed;
			margin: 0 32rpx;
		}
	}
</style>