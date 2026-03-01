<template>
	<view class="meeting-container">
		<!-- 搜索和筛选区域 -->
		<view class="search-filter-area">
			<view class="search-box">
				<uni-icons type="search" size="20" color="#666"></uni-icons>
				<input type="text" v-model="searchText" placeholder="搜索会议名称" class="search-input" />
				<uni-icons v-if="searchText" type="clear" size="20" color="#999" @click="clearSearch"></uni-icons>
			</view>
			<!-- 筛选标签区 -->
			<scroll-view scroll-x="true" class="filter-tags" show-scrollbar="false">
				<view class="tag-wrapper">
					<view v-for="(tag, index) in filterTags" :key="index"
						:class="['filter-tag', { active: tag.active }]" @click="toggleFilter(index)">
						{{ tag.name }}
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 会议列表区域 -->
		<scroll-view scroll-y="true" class="meeting-list">
			<block v-if="showMeetings.length > 0">
				<view v-for="meeting in showMeetings" :key="meeting.meetingId" class="meeting-card">
					<view class="meeting-header" @click="toggleMeetingDetail(meeting)">
						<view class="meeting-info">
							<view class="meeting-title">{{ meeting.meetingName }}</view>
							<view class="meeting-meta">
								<text
									class="meeting_time">{{ "开始：" + meeting.startTime + "\n结束：" + meeting.endTime }}</text>
							</view>
						</view>
						<view class="file-count">
							<uni-icons type="list" size="20" color="#3375F6"></uni-icons>
							<text>{{ meeting.files.length }}个文件</text>
						</view>
					</view>
					<!-- 展开的会议详情 -->
					<view v-if="meeting.isExpanded" class="meeting-detail">
						<view v-for="file in meeting.files" :key="file.materialId" class="file-item">
							<view class="file-info" @click="materialClickAction(file)">
								<uni-icons type="list" size="20" color="#666"></uni-icons>
								<text class="file-name">{{ file.materialName + "." + file.materialType }}</text>
							</view>
							<view class="file-actions" v-if="file.isDownload">
								<image style="width: 20px;" src="/static/success_download.png" mode="widthFix"></image>
								<uni-icons type="trash" size="20" color="#3375F6" style="z-index: 100;"
									@click="removeMaterial(file)"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 空状态 -->
			<view v-else class=" empty-state">
				<image class="empty-image"
					:src="'https://ai-public.mastergo.com/ai/img_res/7107b28f276f5c2a77acb2e619e353f8.jpg'">
				</image>
				<text class="empty-text">暂无会议资料</text>
			</view>
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow, onLoad } from "@dcloudio/uni-app"
	import { userAttendMeetingService } from "../../api/meetings.js"
	import {
		getMyMeetingMaterialsService,
		downloadMaterialService
	} from "../../api/meeting_material.js"
	const searchText = ref('');
	const isRefreshing = ref(false);
	const filterTags = ref([
		{ name: '全部', active: true },
		{ name: '最近', active: false },
		{ name: '一周内', active: false },
		{ name: '一月内', active: false },
		{ name: '未开始', active: false },
		{ name: '已结束', active: false },
	]);
	const meetings = ref([])
	let showMeetings = ref([])
	let localMaterialsInfo = ref([])

	const clearSearch = () => {
		searchText.value = '';
	};
	const toggleFilter = (index : number) => {
		let now = new Date().getTime()
		filterTags.value.forEach((tag, i) => {
			tag.active = i === index;
		});

		if (index === 0) {
			showMeetings.value = meetings.value.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
		}
		else if (index === 1) {
			showMeetings.value = meetings.value.filter(meeting =>
				meeting.meetingStatus !== 3
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).slice(0, 1);
		}
		else if (index === 2) {
			showMeetings.value = meetings.value.filter(meeting =>
				meeting.meetingStatus !== 3 && meeting.startTime <= now + 10080000
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
		}
		else if (index === 3) {
			showMeetings.value = meetings.value.filter(meeting =>
				meeting.meetingStatus !== 3 && meeting.startTime <= now + 43200000
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
		}
		else if (index === 4) {
			showMeetings.value = meetings.value.filter(meeting =>
				meeting.meetingStatus === 1
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
		}
		else if (index === 5) {
			showMeetings.value = meetings.value.filter(meeting =>
				meeting.meetingStatus === 3
			).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
		}
	};
	const toggleMeetingDetail = (meeting) => {
		meeting.isExpanded = !meeting.isExpanded;
	};

	onLoad(() => {
		getMeetings().then(() => {
			toggleFilter(0)
		})
	})

	onShow(() => {
		isMaterialsDownload()
	})

	const getMeetings = async () => {
		meetings.value = (await userAttendMeetingService()).data
		let materials = (await getMyMeetingMaterialsService()).data

		let localMaterials = uni.getStorageSync('local_materials')
		if (localMaterials != null) {
			localMaterialsInfo.value = localMaterials
		}
		else {
			uni.setStorageSync("local_materials", "")
		}

		for (let i = 0; i < meetings.value.length; i++) {
			meetings.value[i].isExpanded = false
			meetings.value[i].files = []
		}

		for (let i = 0; i < materials.length; i++) {
			let meetingId = materials[i].meetingId
			for (let j = 0; j < meetings.value.length; j++) {
				if (meetingId == meetings.value[j].meetingId) {
					materials[i].isDownload = false
					for (let k = 0; k < localMaterialsInfo.value.length; k++) {
						if (materials[i].materialId == localMaterialsInfo.value[k].materialId) {
							materials[i].isDownload = true
							materials[i].materialLocalPath = localMaterialsInfo.value[k].materialLocalPath
						}
					}
					meetings.value[j].files.push(materials[i])
					break
				}
			}
		}
		console.log(meetings);
	}

	function isMaterialsDownload() {
		let localMaterials = uni.getStorageSync('local_materials')
		if (localMaterials != null) {
			localMaterialsInfo.value = localMaterials
		}
		else {
			uni.setStorageSync("local_materials", "")
		}

		for (let i = 0; i < meetings.value.length; i++) {
			for (let j = 0; j < meetings.value[i].files.length; j++) {
				for (let k = 0; k < localMaterialsInfo.value.length; k++) {
					if (meetings.value[i].files[j].materialId == localMaterialsInfo.value[k].materialId) {
						meetings.value[i].files[j].isDownload = true
						meetings.value[i].files[j].materialLocalPath = localMaterialsInfo.value[k].materialLocalPath
					}
				}
			}
		}
	}

	function removeMaterial(material) {
		if (material.isDownload) {
			uni.showModal({
				title: "删除资料",
				content: "确定要删除下载的资料吗？",
				success: (res) => {
					if (res.confirm) {
						uni.removeSavedFile({
							filePath: material.materialLocalPath,
							success: () => {
								material.isDownload = false
								localMaterialsInfo.value = localMaterialsInfo.value.filter(file =>
									file.materialId !== material.materialId
								)
								uni.setStorageSync('local_materials', localMaterialsInfo.value)
								uni.showToast({
									icon: "success",
									title: "文件已删除"
								})
								isMaterialsDownload()
							}
						})
					}
				}
			})
		}
	}

	let canOpenFileType = [
		'doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'
	]
	let imageType = [
		'png', 'jpg', 'jpeg', 'webp', 'gif'
	]

	function materialClickAction(material) {
		if (material.isDownload) {
			for (let i = 0; i < canOpenFileType.length; i++) {
				if (material.materialType == canOpenFileType[i]) {
					console.log(material.materialLocalPath);
					uni.openDocument({
						filePath: material.materialLocalPath,
						fail: (res) => {
							console.log(res);
						}
					})
					return
				}
			}
			for (let i = 0; i < canOpenFileType.length; i++) {
				if (material.materialType == imageType[i]) {
					console.log(material.materialLocalPath);
					uni.previewImage({
						urls: [material.materialLocalPath],
						current: material.materialLocalPath,
						fail: (res) => {
							console.log(res);
						}
					})
					return
				}
			}
			uni.showModal({
				content: "该文件暂不支持预览",
				showCancel: false
			})
		}
		else {
			uni.navigateTo({
				url: "/pages/meeting_material/download_material?material=" + JSON.stringify(material)
			})
		}
	}
</script>
<style>
	page {
		height: 100%;
	}

	.meeting-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #F5F6F7;
	}

	.search-filter-area {
		flex-shrink: 0;
		padding: 24rpx;
		background-color: #FFFFFF;
	}

	.search-box {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #F5F6F7;
		border-radius: 8px;
		margin-bottom: 24rpx;
	}

	.search-input {
		flex: 1;
		margin: 0 20rpx;
		font-size: 14px;
		color: #333;
	}

	.filter-tags {
		overflow: auto;
		width: 100%;
	}

	.tag-wrapper {
		display: flex;
		padding: 10rpx 0;
	}

	.filter-tag {
		padding: 12rpx 32rpx;
		margin-right: 20rpx;
		background-color: #F5F6F7;
		border-radius: 24rpx;
		font-size: 14px;
		color: #666;
		white-space: nowrap;
	}

	.filter-tag.active {
		background-color: #3375F6;
		color: #FFFFFF;
	}

	.meeting-list {
		flex: 1;
		overflow: auto;
		width: 94%;
		padding: 24rpx;
	}

	.meeting-card {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.meeting-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.meeting-info {
		flex: 1;
		margin-right: 20rpx;
		overflow: hidden;
	}

	.meeting-title {
		font-size: 16px;
		color: #333;
		font-weight: 500;
		margin-bottom: 12rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meeting-meta {
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #999;
	}

	.meeting_time {
		margin-right: 20rpx;
	}

	.file-count {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #3375F6;
		flex-shrink: 0;
	}

	.file-count text {
		margin-left: 8rpx;
	}

	.meeting-detail {
		margin-top: 24rpx;
		padding-top: 24rpx;
		border-top: 1px solid #EEEEEE;
	}

	.file-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}

	.file-info {
		display: flex;
		align-items: center;
		flex: 1;
		margin-right: 20rpx;
		overflow: hidden;
	}

	.file-name {
		margin-left: 16rpx;
		font-size: 14px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.file-actions {
		display: flex;
		align-items: center;
		gap: 32rpx;
		flex-shrink: 0;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 160rpx;
	}

	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 24rpx;
	}

	.empty-text {
		font-size: 14px;
		color: #999;
	}
</style>