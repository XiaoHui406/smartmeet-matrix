<template>
	<view class="interest-container">
		<view class="close-button" @click="closePage">
			<text class="close-icon">×</text>
		</view>
		<!-- 标题部分 -->
		<view class="header">
			<text type="primary" bold style='font-size: 50rpx;'>请选择喜欢的兴趣爱好</text>
			<br />
			<text type="info" size="24rpx">已选择 {{ selectedCount }} 个兴趣标签</text>
		</view>

		<!-- 标签选择区域 -->
		<scroll-view scroll-y class="tag-scroll">
			<view v-for="(group, index) in tagGroups" :key="index" class="tag-group">
				<text type="info" size="26rpx" bold class="group-title">{{ group.title  }}</text>
				<view class="tag-wrapper">
					<u-tag v-for="tag in group.tags" :key="tag.value" :text="tag.label"
						:type="tag.selected  ? 'primary' : 'info'" :plain="!tag.selected"
						:icon="tag.selected  ? 'checkbox-mark' : ''" size="large" @click="toggleTag(tag)"
						class="interest-tag" />
				</view>
			</view>
		</scroll-view>

		<!-- 操作按钮 -->
		<view class="action-bar">
			<u-button type="primary" shape="circle" icon="checkmark" @click="saveInterests()"
				:disabled="selectedCount === 0">
				保存{{ selectedCount ? `(${selectedCount})` : '' }}
			</u-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import useUserInfoStore from "@/stores/userInfo.js"
	import {
		userInterestUpdateService
	} from '@/api/user.js'

	const userInfoStore = useUserInfoStore()
	const userInfo = ref({
		...userInfoStore.info
	})

	// 会议相关兴趣标签配置
	const allInterests = [{
			title: '行业领域',
			tags: [
				'科技互联网', '金融投资', '医疗健康', '教育培训',
				'文化创意', '智能制造', '新能源', '生物技术'
			]
		},
		{
			title: '会议形式',
			tags: [
				'圆桌论坛', '主题演讲', '研讨会', '产品发布会',
				'线上会议', '闭门会议', '国际峰会', '行业年会'
			]
		},
		{
			title: '技术焦点',
			tags: [
				'人工智能', '大数据', '云计算', '区块链',
				'物联网', '5G通信', '元宇宙', '数字化转型'
			]
		}
	]

	// 响应式数据
	const selectedTags = ref([])

	// 计算属性
	const tagGroups = computed(() => {
		return allInterests.map(group => ({
			title: group.title,
			tags: group.tags.map(tag => ({
				label: tag,
				value: tag,
				selected: selectedTags.value.includes(tag)
			}))
		}))
	})

	const selectedCount = computed(() => selectedTags.value.length)

	// 初始化已选标签
	onMounted(() => {
		selectedTags.value = userInfo.value.interest?.split('  ') || []
	})

	// 标签切换
	const toggleTag = (tag) => {
		const index = selectedTags.value.indexOf(tag.value)
		if (index > -1) {
			selectedTags.value.splice(index, 1)
		} else {
			selectedTags.value.push(tag.value)
		}
	}

	// 保存兴趣
	const saveInterests = async () => {
		try {
			const interestString = selectedTags.value.join('  ')
			let result = await userInterestUpdateService(interestString)
			if (result.code === 0) {
				uni.showToast({
					title: result.msg ? result.msg : '保存成功',
					icon: 'success'
				});
				userInfoStore.info.interest = interestString.value
				setTimeout(() => {
					uni.navigateBack();
				}, 800)
			} else {
				uni.showToast({
					title: result.msg ? result.msg : '保存失败，请稍后再试',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 800)
			}
		} catch (error) {
			console.log(error);
			uni.showToast({
				title: '修改失败',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 800)
		}
	}
	const closePage = () => {
		uni.navigateBack();
	}
</script>

<style lang="scss" scoped>
	/* 新增渐变动画 */
	@keyframes gradientFlow {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

	.interest-container {
		position: relative;
		overflow: hidden;
		padding-top: 60rpx;

		&::before {
			content: '';
			position: fixed;
			top: -50%;
			left: -50%;
			right: -50%;
			bottom: -50%;
			background: linear-gradient(45deg,
					#ff6b6b,
					#4ecdc4,
					#45b7d1,
					#96c93d,
					#ffd700);
			background-size: 400% 400%;
			animation: gradientFlow 15s ease infinite;
			z-index: 0;
		}

		>* {
			position: relative;
			z-index: 1;
		}

		.header {
			position: relative;
			padding: 40rpx 0;

			border-radius: 16rpx;
			margin: 32rpx;

			backdrop-filter: blur(10px);

			[type="primary"] {
				font-size: 36rpx;
				font-weight: 800;
				color: #2c3e50;
				display: inline-block;
				overflow: hidden;
				white-space: nowrap;
				letter-spacing: 2rpx;
				border-right: 2px solid;
				width: 0;
				animation: typing 2s steps(20) forwards,
					blinkCaret 0.75s step-end infinite;
			}

			@keyframes typing {
				from {
					width: 0
				}

				to {
					width: 520rpx
				}
			}

			@keyframes blinkCaret {

				from,
				to {
					border-color: transparent
				}

				50% {
					border-color: #2c3e50
				}
			}
		}

		.tag-scroll {
			margin: 0rpx 32rpx;


			.tag-group {
				padding: 24rpx;

				.group-title {
					color: #34495e !important;
					border-left-color: #45b7d1 !important;
					text-shadow: 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.5);
				}
			}
		}

		.action-bar {
			margin-top: 40rpx;
			padding: 16rpx;

			.u-button {
				box-shadow: 0 8rpx 24rpx rgba(52, 152, 219, 0.3);
			}
		}

		.interest-tag {
			margin: 5px;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

			&:active {
				transform: scale(0.9) !important;
			}
		}
	}

	.interest-container {
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: fixed;
			top: -50%;
			left: -50%;
			right: -50%;
			bottom: -50%;
			background: linear-gradient(45deg,
					#ff6b6b,
					#4ecdc4,
					#45b7d1,
					#96c93d,
					#ffd700);
			background-size: 400% 400%;
			animation: gradientFlow 15s ease infinite;
			z-index: 0;
		}

		>* {
			position: relative;
			z-index: 1;
		}

		/* 关闭按钮样式 */
		.close-button {
			position: absolute;
			top: 90rpx;
			right: 32rpx;
			width: 80rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.3);
			backdrop-filter: blur(5px);
			cursor: pointer;
			z-index: 10;
			transition: all 0.3s ease;

			.close-icon {
				font-size: 40rpx;
				color: rgba(255, 255, 255, 0.8);
				font-weight: bold;
			}

			&:hover {
				background: rgba(255, 255, 255, 0.5);
				transform: scale(1.05);
			}

			&:active {
				transform: scale(0.95);
			}
		}
	}
</style>