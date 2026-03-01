<script setup>
	import {
		useTokenStore
	} from '@/stores/token.js'
	import useUserInfoStore from '@/stores/userInfo.js'
	const tokenStore = useTokenStore();
	const userInfoStore = useUserInfoStore();

	const outlogin = (callback) => {
		uni.showModal({
			title: '温馨提示',
			content: '确定退出登录？',
			confirmText: '确定',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					// 用户点击了确定
					tokenStore.removeToken();
					userInfoStore.removeInfo();
					uni.setStorageSync('loginInfo', "")
					uni.showToast({
						title: '退出登录成功',
						icon: 'success'
					});
					// 执行回调函数（用于跳转页面）
					if (callback) {
						callback();
					}
				} else if (res.cancel) {
					uni.showToast({
						title: '取消退出登录',
						icon: 'none'
					});
				}
			}
		});
	};

	const handleClick = (item) => {
		if (item.path) {
			if (item.path === '/pages/login') {
				// 调用 outlogin 函数，并传入跳转逻辑作为回调
				outlogin(() => {
					uni.navigateTo({
						url: item.path
					});
				});
			} else {
				// 非登录页面正常跳转
				uni.reLaunch({
					url: item.path
				});
			}
		} else {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			});
		}
	}

	const functionList = [{
			name: '更换头像',
			icon: 'photo',
			color: '#ff9900',
			bgColor: '#fff4e6',
			path: '/pages/mine/updateUserPic'
		},
		{
			name: '更改密码',
			icon: 'lock-open',
			color: '#ff9900',
			bgColor: '#fff4e6',
			path: '/pages/mine/updatePassword'
		},
		{
			name: '多语言',
			icon: 'info',
			color: '#19be6b',
			bgColor: '#e6f8f0'
		},
		{
			name: '退出登录',
			icon: 'grid',
			color: '#2979ff',
			bgColor: '#e6f0ff',
			path: '/pages/login'
		},
		{
			name: '切换登录',
			icon: 'reload',
			color: '#2979ff',
			bgColor: '#e6f0ff',
			path: '/pages/login'
		}
	];

	// 数组分组方法 
	const chunkArray = (arr, size) => {
		return arr.reduce((acc, val, i) => {
			let idx = Math.floor(i / size)
			acc[idx] = (acc[idx] || []).concat(val)
			return acc
		}, [])
	}
</script>
<template>
	<view class="container">
		<view class="function-section">
			<view v-for="(group, index) in chunkArray(functionList, 2)" :key="index" class="function-card">
				<view class="card-inner">
					<view v-for="item in group" :key="item.name" class="function-item" @click="handleClick(item)">
						<view class="item-left">
							<view class="icon-wrapper" :style="{backgroundColor: item.bgColor}">
								<u-icon :name="item.icon" :color="item.color" size="20" />
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
<style lang="scss" scoped>
	.container {

		background-color: #f5f5f5;
		/* 淡灰色背景 */
		min-height: 100vh;
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