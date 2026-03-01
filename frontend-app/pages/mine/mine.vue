<template>
	<view class="container">
		<view class="user-info-section">
			<view class="user-profile-card">
				<u-avatar size="100" :src="userInfoStore.info.userPic" shape="square" @click="updateAvatar()" />
				<view class="user-meta">
					<text class="username" @click="userInfo()">{{ userInfoStore.info.username  }}</text>
					<text class="user-account" @click="userInfo()">账号ID: {{ userInfoStore.info.account  }}</text>
					<view class="user-organizations">

						<view class="org-tags">
							<u-tag v-for="org in organizations" :key="org.organizationId" :text="org.organizationName"
								icon="account-fill" icon-color="#2979ff" size="mini" color="#2979ff" bg-color="#e6f0ff"
								@click="organization()" style="margin: 3rpx;" />
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="function-section">
			<!-- 每三个功能组成卡片 -->
			<view v-for="(group, index) in chunkArray(functionList, 3)" :key="index" class="function-card">
				<view class="card-inner">
					<view v-for="item in group" :key="item.name" class="function-item" @click="handleClick(item)">
						<view class="item-left">
							<view class="icon-wrapper" :style="{backgroundColor: item.bgColor}">
								<u-icon :name="item.icon" :color="item.color" :size="item.iconSize||20" />
							</view>
							<text class="item-label">{{ item.name  }}</text>
						</view>
						<u-icon name="arrow-right" color="#c0c4cc" size="16" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from "vue";
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		userInfoService
	} from "@/api/user.js";
	import useUserInfoStore from "@/stores/userInfo.js";
	import {
		myOrganizationsService
	} from "@/api/meeting.js";


	const userInfoStore = useUserInfoStore();
	const organizations = ref([]);

	const updateAvatar = () => {
		uni.navigateTo({
			url: '/pages/mine/updateUserPic'
		});
	}

	const userInfo = () => {
		uni.navigateTo({
			url: '/pages/mine/userInfo'
		});
	}
	const organization = () => {
		uni.navigateTo({
			url: '/pages/organization/organization'
		});
	}
	const getUserInfo = async () => {
		const result = await userInfoService();
		userInfoStore.setInfo(result.data);
	};

	const getMyOrganizations = async () => {
		try {
			const result = await myOrganizationsService();
			if (result.code === 0) {
				organizations.value = result.data;
			} else {
				uni.showToast({
					title: result.message || "获取组织失败",
					icon: "none"
				});
			}
		} catch (error) {
			uni.showToast({
				title: "网络错误",
				icon: "none"
			});
		}
	};

	onShow(async () => {
		await getUserInfo();
		await getMyOrganizations();
	});

	const handleClick = (item) => {
		if (item.path) {
			uni.navigateTo({
				url: item.path
			});
		} else {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			})
		}
	}

	const functionList = [{
			name: '智会助手',
			icon: '/static/logo.png',
			color: '#1A73E8', // 更现代的蓝色
			bgColor: '#E8F0FE', // 浅蓝色背景
			path: '/pages/index/agent',
			iconSize: 35
		},
		{
			name: '我的组织',
			icon: 'home',
			color: '#1A73E8', // 保持与智会助手一致的品牌蓝
			bgColor: '#E8F0FE',
			path: '/pages/organization/organization'
		},
		{
			name: '我的资料',
			icon: 'file-text',
			color: '#6A1B9A', // 紫色调体现个人信息
			bgColor: '#F3E5F5', // 浅紫色背景
			path: '/pages/meeting/meetingMaterials'
		},
		{
			name: '会议记录',
			icon: 'chat',
			color: '#1A73E8', // 与会议相关功能保持品牌蓝
			bgColor: '#E8F0FE',
			path: '/pages/meeting/attendMeeting'
		},
		{
			name: '编辑资料',
			icon: 'edit-pen',
			color: '#6A1B9A', // 保持与资料一致
			bgColor: '#F3E5F5',
			path: '/pages/mine/userInfo'
		},
		{
			name: '兴趣管理',
			icon: 'star',
			color: '#2E7D32', // 绿色象征成长和兴趣
			bgColor: '#E8F5E9', // 浅绿色背景
			path: '/pages/mine/interest'
		},
		{
			name: '客服与帮助',
			icon: 'question-circle',
			color: '#5F6368', // 中性灰色体现工具属性
			bgColor: '#F8F9FA', // 浅灰色背景
			path: '/pages/mine/kefu'
		},
		{
			name: '设置与隐私',
			icon: 'setting',
			color: '#5F6368', // 保持中性灰色系
			bgColor: '#F8F9FA',
			path: '/pages/mine/setting'
		},
		{
			name: '关于我们',
			icon: 'info-circle',
			color: '#EF6C00', // 暖橙色体现友好
			bgColor: '#FBE9E7', // 浅橙色背景
			path: '/pages/mine/aboutme'
		}
	]

	// 数组分组方法 
	const chunkArray = (arr, size) => {
		return arr.reduce((acc, val, i) => {
			let idx = Math.floor(i / size)
			acc[idx] = (acc[idx] || []).concat(val)
			return acc
		}, [])
	}
</script>

<style scoped>
	.container {
		padding-top: 70rpx;
		background-color: #f5f5f5;
		/* 淡灰色背景 */
		height: 100vh;
	}

	/* 用户信息区域 */
	.user-info-section {
		padding: 16px 24px;
	}

	.user-profile-card {
		display: flex;
		align-items: center;
		padding: 20px;
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}

	.user-avatar {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.user-meta {
		margin-left: 20px;
	}

	.username {
		display: block;
		font-size: 18px;
		font-weight: 500;
		color: #1a1a1a;
		margin-bottom: 6px;
	}

	.user-account {
		font-size: 13px;
		color: #909399;
		letter-spacing: 0.3px;
	}

	.function-card {
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		margin: 12px 24px;
		overflow: hidden;
	}

	.card-inner {
		padding: 0 16px;
	}

	.user-organizations {
		margin-top: 12px;
		display: flex;
		align-items: flex-start;
	}

	.org-label {
		font-size: 13px;
		color: #909399;
		margin-right: 8px;
	}

	.org-tags {
		flex: 1;
		/* 添加这一行 */
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	/* 功能项样式 */
	.function-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 13px 0;
		border-bottom: 1px solid #ebeef5;
	}

	.function-item:last-child {
		border-bottom: none;
	}

	.item-left {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.icon-wrapper {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
	}

	.item-label {
		font-size: 15px;
		color: #303133;
		font-weight: 500;
		letter-spacing: 0.3px;
	}

	/* 交互效果 */
	.function-item:active {
		background: #f8fafc;
		opacity: 0.9;
	}

	/* 标题样式 */
	.section-header {
		padding: 20px 24px 12px;
	}

	.header-title {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		position: relative;
		padding-left: 8px;
	}

	.header-title::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 16px;
		background: #2979ff;
		border-radius: 2px;
	}
</style>