<template>
	<view class="content">


		<!-- 主体内容 -->
		<view class="body-content">
			<!-- 顶部介绍 -->
			<view class="bd-box">
				<view class="t-left">
					<view class="t-tit">哈喽,有什么可以帮助您？</view>
					<view class="t-desc">智能客服为您服务</view>
				</view>
				<view class="t-right">

				</view>
			</view>

			<!-- 分类列表 -->
			<view class="bd-type">
				<view class="bd-item">
					<view class="bd-tit">咨询分类</view>
				</view>
				<view class="bd-item">
					<view class="bd-tit">问题分类</view>
				</view>
				<view class="bd-item">
					<view class="bd-tit">更改密码</view>
				</view>
				<view class="bd-item">
					<view class="bd-tit">更改信息</view>
				</view>
			</view>

			<!-- 问题列表 -->
			<view class="lists">
				<view class="l-item">
					<view class="l-left">
						<text>1</text>
						<text>如何注销账户？</text>
					</view>
					<view class="l-right">

					</view>
				</view>
				<view class="l-item">
					<view class="l-left">
						<text>2</text>
						<text>如何更改信息？</text>
					</view>
					<view class="l-right">

					</view>
				</view>
				<view class="l-item">
					<view class="l-left">
						<text>3</text>
						<text>如何联系在线客服？</text>
					</view>
					<view class="l-right">

					</view>
				</view>
				<view class="l-item">
					<view class="l-left">
						<text>4</text>
						<text>如何改密码？</text>
					</view>
					<view class="l-right">

					</view>
				</view>
				<view class="l-item">
					<view class="l-left">
						<text>5</text>
						<text>如何怎么获取会议信息？</text>
					</view>
					<view class="l-right">
					</view>
				</view>
				<view class="l-item">
					<view class="l-left">
						<text>6</text>
						<text>怎么使用AI？</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-box">
			<view class="bottom-item" style="border-right: 2px solid #eee;">
				<text>咨询客服</text>
			</view>
			<view class="bottom-item">
				<text>电话客服</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navHeight: "", // 导航栏高度
				statusBarHeight: "", // 状态栏高度
			};
		},
		onLoad() {
			// 获取手机系统的信息
			const {
				statusBarHeight,
				system
			} = uni.getSystemInfoSync();
			this.statusBarHeight = statusBarHeight;
			// 根据设备类型设置导航栏高度
			this.navHeight = statusBarHeight + (system.indexOf("iOS") > -1 ? 40 : 44);
		},
		methods: {
			// 可以添加方法
		},
	};
</script>

<style scoped>
	page {
		height: 100vh;
	}

	/* 主体内容样式 */
	.body-content {
		/* background: linear-gradient(to bottom, transparent -100px, #fff 300px),
			linear-gradient(to right, #e3f6fd, #ffd1decc); */
		background-color: #EBF3FE;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 100vh;
	}

	/* 顶部介绍样式 */
	.bd-box {
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	/* 顶部介绍左侧文字 */
	.t-left {
		width: 80%;
	}

	.t-tit {
		font-size: 36rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
	}

	.t-desc {
		font-size: 28rpx;
		color: #777;
	}

	/* 顶部介绍右侧图片 */
	.t-right {
		width: 150rpx;
	}

	/* 分类列表样式 */
	.bd-type {
		padding: 20rpx 35rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	/* 分类项样式 */
	.bd-item {
		text-align: center;
	}

	.bd-item image {
		width: 75rpx;
		margin-bottom: 10rpx;
	}

	.bd-tit {
		font-size: 28rpx;
	}

	/* 问题列表样式 */
	.lists {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 10rpx;
		flex: 1;
	}

	/* 问题项样式 */
	.l-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 15rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #f5f5f5;
	}

	/* 问题项左侧文字 */
	.l-item .l-left {
		display: flex;
		justify-content: start;
		align-items: center;
	}

	.l-left text:nth-child(1) {
		font-size: 30rpx;
		font-weight: 600;
		margin-right: 20rpx;
	}

	.l-left text:nth-child(2) {
		font-size: 28rpx;
		font-weight: 600;
		color: #4b4b4b;
	}

	/* 问题项右侧箭头 */
	.l-item .l-right image {
		width: 38rpx;
		height: 38rpx;
	}

	/* 底部按钮样式 */
	.bottom-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #eee;
	}

	/* 底部按钮项样式 */
	.bottom-item {
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bottom-item image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}

	.bottom-item text {
		font-size: 28rpx;
	}
</style>