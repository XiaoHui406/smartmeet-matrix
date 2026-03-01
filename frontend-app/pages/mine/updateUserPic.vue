<template>
	<view class="container">
		<!-- 头像展示区域 -->
		<view class="avatar-wrapper" @click="chooseImage">
			<view class="avatar-box">
				<image :src="avatarUrl || defaultAvatar" class="avatar-image" mode="aspectFill" />
				<view class="mask" :class="{ active: isPress }">
					<u-icon name="camera" color="#fff" size="28"></u-icon>
				</view>
				<view v-if="uploading" class="loading-wrapper">
					<u-loading-mode size="40" color="#fff"></u-loading-mode>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="btn-group">
			<u-button type="primary" icon="photo" shape="circle" @click="chooseImage"
				custom-style="margin-bottom: 20rpx">
				更换头像
			</u-button>
			<u-button type="success" icon="checkmark" shape="circle" :disabled="!avatarUrl" :loading="submitting"
				@click="submitAvatar">
				确认保存
			</u-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		storeToRefs
	} from 'pinia'
	import {
		userAvatarUpdateService
	} from '@/api/user.js'
	import {
		useTokenStore
	} from '@/stores/token.js'
	import useUserInfoStore from '@/stores/userInfo.js'
	import defaultAvatar from '@/static/avatar.jpg'

	const tokenStore = useTokenStore()
	const userInfoStore = useUserInfoStore()
	const {
		info
	} = storeToRefs(userInfoStore)

	// 响应式数据
	const avatarUrl = ref(info.value.userPic || '')
	const uploading = ref(false)
	const submitting = ref(false)
	const isPress = ref(false)

	// 选择图片
	const chooseImage = async () => {
		try {
			const res = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: handleImageSelected
			})
		} catch (e) {
			uni.showToast({
				title: '选择图片失败',
				icon: 'none'
			})
		}
	}

	// 处理选图结果
	const handleImageSelected = async (res) => {
		const tempFile = res.tempFiles[0]
		if (!validateImage(tempFile)) return

		uploading.value = true
		try {
			const uploadRes = await uni.uploadFile({
				url: 'http://localhost:8080/upload',
				filePath: tempFile.path,
				name: 'file',
				header: {
					Authorization: tokenStore.token
				}
			})

			const data = JSON.parse(uploadRes.data)
			if (data.code === 0) {
				avatarUrl.value = data.data
				uni.showToast({
					title: '上传成功',
					icon: 'success'
				})
			}
		} finally {
			uploading.value = false
		}
	}

	// 图片校验
	const validateImage = (file) => {
		if (file.size > 2 * 1024 * 1024) {
			uni.showToast({
				title: '图片大小不能超过2M',
				icon: 'none'
			})
			return false
		}
		if (!['image/jpeg', 'image/png'].includes(file.type)) {
			uni.showToast({
				title: '仅支持JPG/PNG格式',
				icon: 'none'
			})
			return false
		}
		return true
	}

	// 提交保存
	const submitAvatar = async () => {
		submitting.value = true
		try {
			const {
				code,
				message
			} = await userAvatarUpdateService(avatarUrl.value)
			if (code === 0) {
				userInfoStore.info.userPic = avatarUrl.value
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
			}
		} catch (e) {
			uni.showToast({
				title: e.message || '保存失败',
				icon: 'none'
			})
		} finally {
			submitting.value = false
		}
	}

	// 触摸事件处理
	const handleTouch = (state) => {
		isPress.value = state
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx;
		background: #f5f5f5;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		/* 头像容器 */
		.avatar-wrapper {
			margin: 60rpx 0;
			position: relative;
			transition: transform 0.3s ease;

			&:active {
				transform: scale(0.98);
			}

			.avatar-box {
				width: 600rpx;
				height: 600rpx;
				border-radius: 5%;
				background: #fff;
				box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
				position: relative;
				overflow: hidden;
				border: 4rpx solid #fff;

				.avatar-image {
					width: 100%;
					height: 100%;
					transition: transform 0.3s ease;
				}

				/* 遮罩层 */
				.mask {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.4);
					opacity: 0;
					transition: opacity 0.3s;
					display: flex;
					align-items: center;
					justify-content: center;

					&.active {
						opacity: 1;
					}
				}

				/* 加载状态 */
				.loading-wrapper {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(255, 255, 255, 0.9);
					display: flex;
					align-items: center;
					justify-content: center;
					backdrop-filter: blur(4rpx);
				}
			}
		}

		/* 按钮组 */
		.btn-group {
			width: 100%;
			max-width: 500rpx;
			margin-top: 80rpx;

			.u-button {
				height: 96rpx;
				font-size: 32rpx;
				margin-bottom: 40rpx !important;
				transition: all 0.3s ease;
				border: none;

				&[type="primary"] {
					background: linear-gradient(135deg, #409EFF, #3375e0);
					box-shadow: 0 6rpx 20rpx rgba(64, 158, 255, 0.3);

					&:active {
						transform: translateY(4rpx);
						box-shadow: 0 2rpx 10rpx rgba(64, 158, 255, 0.2);
					}
				}

				&[type="success"] {
					background: linear-gradient(135deg, #67C23A, #4ca63a);
					box-shadow: 0 6rpx 20rpx rgba(103, 194, 58, 0.3);

					&:active:not([disabled]) {
						transform: translateY(4rpx);
						box-shadow: 0 2rpx 10rpx rgba(103, 194, 58, 0.2);
					}

					&[disabled] {
						opacity: 0.6;
						filter: grayscale(0.3);
					}
				}

				.u-icon {
					margin-right: 16rpx;
					font-size: 36rpx;
				}
			}
		}
	}

	/* 微调动画 */
	@keyframes float {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-20rpx);
		}
	}

	.avatar-wrapper:hover .avatar-image {
		transform: scale(1.05);
	}
</style>