<template>
	<view class="container">
		<view class="chat-box">
			<scroll-view class="message-list" scroll-y :scroll-top="scrollTop" enable-back-to-top show-scrollbar
				:scroll-with-animation="true">
				<view class="message-item" v-for="(message, index) in messages" :id="'item' + index" :key="message.id">

					<!-- 历史分隔线 -->
					<view v-if="message.type === 'divider'" class="divider-line">
						<text class="divider-text">{{ message.content }}</text>
					</view>

					<!-- AI消息 -->
					<view v-else-if="message.role === 'ai'" class="message-bubble ai-bubble">
						<view class="bubble-content">
							<!-- 使用marked解析Markdown -->
							<div v-html="renderMarkdown(message.content)" v-if="message.content && message.isMarkdown"
								class="markdown-content">
							</div>
							<text class="message-text" :selectable="true" v-else>{{ message.content }}</text>
							<view v-if="message.typing" class="typing-indicator">
								<view class="dot"></view>
								<view class="dot"></view>
								<view class="dot"></view>
							</view>
							<text v-if="message.stopped" class="stop-message">（输出已停止）</text>
						</view>
					</view>

					<!-- 用户消息 -->
					<view v-else class="message-bubble user-bubble">
						<text class="message-text" :selectable="true"
							style="align-self: self-end;">{{ message.content }}</text>
						<!-- 文件附件 -->
						<view v-if="message.file" class="file-attachment">
							<image :src="getFileIcon(message.file.materialType)" class="attachment-icon" />
							<text
								class="attachment-name">{{ message.file.materialName }}.{{ message.file.materialType }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 输入区域 -->

		<view class="image-gif">
			<image src="/static/agent/robot.gif" mode="heightFix"></image>
		</view>

		<view class="input-wrapper">
			<view class="input-action-bar">
				<u-button class="action-btn" @click="resetConversation" icon="cut" size="mini" text="切断对话" :plain="true"
					color="#606266" custom-style="height: 32px;" />
				<u-button class="action-btn" @click="clearScreen" icon="error" size="mini" text="清屏" :plain="true"
					color="#606266" custom-style="height: 32px;" />
				<u-button class="action-btn" @click="showFileList" icon="attach" size="mini" text="添加文件" :plain="true"
					color="#606266" custom-style="height: 32px;" />
			</view>
			<u-popup :show="showFilePopup" mode="bottom" round="16rpx">
				<view class="file-popup">
					<view class="popup-header">
						<text class="title">选择附件</text>
						<u-icon name="close" @click="showFilePopup = false" />
					</view>
					<scroll-view scroll-y class="file-list">
						<view v-for="file in fileList" :key="file.materialId" class="file-item"
							:class="{selected: file.materialId === selectedFile?.materialId}"
							@click="toggleSelectFile(file)">
							<image :src="getFileIcon(file.materialType)" class="file-icon" />
							<text class="file-name">{{ file.materialName }}.{{file.materialType}}</text>
							<u-icon v-if="file.materialId === selectedFile?.materialId" name="checkmark" color="#409eff"
								size="20" />
						</view>
					</scroll-view>
				</view>
			</u-popup>
			<view class="input-container">
				<view class="selected-file-bubble" v-if="selectedFile">
					<view class="file-bubble">
						<image :src="getFileIcon(selectedFile.materialType)" class="bubble-file-icon" />
						<text
							class="bubble-file-name">{{ selectedFile.materialName }}.{{selectedFile.materialType}}</text>
						<u-icon name="close" size="18" color="#999" @click="cancelSelectFile" class="close-icon" />
					</view>
				</view>
				<u-input class="dynamic-input" placeholder="请输入您的问题..." v-model="inputMessage"
					:disabled="isSending || isGenerating" @confirm="sendMessage" border="none" :auto-height="true"
					:maxlength="500" confirm-type="send" :adjust-position="true">
					<template #suffix>
						<view class="input-buttons">
							<u-button v-if="isGenerating" class="stop-button" @click="stopGeneration"
								:throttle-time="500" icon="pause-circle" shape="circle" size="15" color="#f56c6c" />
							<u-button v-else class="send-button" @click="sendMessage"
								:disabled="isSending || inputMessage.trim().length < 1" icon="arrow-upward"
								shape="circle" size="23" color="#409eff" />

						</view>
					</template>
				</u-input>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		nextTick,
		onMounted,
		watch,
		computed
	} from 'vue';
	import {
		APP_KEY
	} from '@/config/config.js';
	import {
		generateSign
	} from '@/utils/sign.js';
	import {
		v4 as uuidv4
	} from 'uuid';
	import {
		marked
	} from 'marked';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github.css';
	import {
		myMeetingMaterialsListService
	} from '@/api/meeting.js';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		readMaterialDataService
	} from "../../api/meeting_material.js"

	// 配置marked
	marked.setOptions({
		highlight: function(code, lang) {
			return hljs.highlightAuto(code).value;
		},
		breaks: true,
		gfm: true,
		silent: true
	});

	// 响应式状态
	const showFilePopup = ref(false);
	const selectedFile = ref(null);
	const inputMessage = ref('');
	const messages = reactive([]);
	const scrollTop = ref(100);
	const isSending = ref(false);
	const isGenerating = ref(false);
	const currentSessionId = ref(uuidv4());
	const fileList = reactive([]);
	let fileText = ref("")
	let localMaterialsInfo = ref([])

	// 工具函数
	const autoScroll = debounce(() => {
		nextTick(() => {
			scrollTop.value = Math.random() * 1000 + 99999;
		});
	}, 300);

	function debounce(fn, delay) {
		let timer;
		return function(...args) {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, args), delay);
		};
	}

	// 存储相关
	const STORAGE_KEY = 'chatHistory';
	watch(() => [...messages], (newVal) => {
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(newVal));
	}, {
		deep: true
	});

	onMounted(() => {
		const history = uni.getStorageSync(STORAGE_KEY);
		if (history) {
			messages.push(...JSON.parse(history));
			console.log(messages);
		}
		if (messages.length === 0) {
			messages.push(createMessage('ai', '您好，有什么可以帮助您的？'));
		}
		// autoScroll();
	});

	// 消息创建工厂函数
	const createMessage = (role, content, file = null) => {
		return {
			id: Date.now(),
			role,
			content,
			file,
			typing: role === 'ai',
			stopped: false,
			isMarkdown: role === 'ai',
			timestamp: Date.now()
		};
	};

	// 获取文件列表
	const showFileList = async () => {
		const selectItems = (await myMeetingMaterialsListService()).data
		for (let i = 0; i < selectItems.length; i++) {
			selectItems[i].type = "file"
		}
		let audioToText = uni.getStorageSync('audio_to_text')
		if (audioToText != null && audioToText.length > 0) {
			let toTextArray = audioToText
			for (let i = 0; i < toTextArray.length; i++) {
				toTextArray[i].type = "audioToText"
				selectItems.push(toTextArray[i])
			}
		} else {
			uni.setStorageSync('audio_to_text', [])
		}

		fileList.splice(0, fileList.length, ...selectItems);
		showFilePopup.value = true;
	};
	const cancelSelectFile = () => {
		selectedFile.value = null;
	};
	const toggleSelectFile = (file) => {
		if (selectedFile.value?.materialId === file.materialId) {
			selectedFile.value = null;
		} else {
			selectedFile.value = file;
		}
		showFilePopup.value = false
	};
	// 文件图标映射
	const getFileIcon = (type) => {
		const typeMap = {
			pdf: '/static/pdf_icon.png',
			doc: '/static/docx_icon.png',
			docx: '/static/docx_icon.png',
			png: '/static/photo_icon.png',
			jpg: '/static/photo_icon.png',
			jpeg: '/static/photo_icon.png',
			txt: '/static/txt_icon.png',
			ppt: '/static/ppt_icon.png',
			pptx: '/static/ppt_icon.png'
		};
		return typeMap[type.toLowerCase()] || '/static/file_icon.png';
	};
	const selectFile = (file) => {
		selectedFile.value = file;
		showFilePopup.value = false;
	};

	const readFile = async (file) => {
		// console.log(file);
		fileText.value = (await readMaterialDataService(file)).data
	}

	// 消息处理核心逻辑
	const sendMessage = async () => {
		const trimmedInput = inputMessage.value.trim();
		if (!trimmedInput || isSending.value) return;

		// 添加用户消息
		const userMessage = createMessage('user', trimmedInput, selectedFile.value);
		messages.push(userMessage);
		inputMessage.value = '';
		console.log(selectedFile);

		let selectFilePath = ""
		let audioToTextResult = ""
		let selectFileType = selectedFile.value == null ? "" : selectedFile.value.type
		if (selectFileType == "file") {
			selectFilePath = selectedFile.value == null ? "" : selectedFile.value.materialPath
		} else if (selectFileType == "audioToText") {
			audioToTextResult = selectedFile.value.audioToTextResult
		}
		selectedFile.value = null;
		isSending.value = true;

		// 提前声明aiMessage
		let aiMessage = createMessage('ai', '');
		messages.push(aiMessage);

		try {
			// 生成签名和时间戳
			let messages = [{
				role: "user",
				content: "你是智会矩阵的智能会议助手，为西湖论剑提供会议支持，你更擅长总结会议纪要，要善于使用表情来让对话变得更加有趣，如果用户为你提供了关于会议有关的信息，你需要从中总结最重要的信息，来提醒用户，不要单纯把会议信息复制粘贴一遍，这样是没有意义的，回答的信息一定要精炼！精炼！再精炼，让用户用最少的时间能够最快速了解到会议的信息，同时你要注意会议信息的主次，把会议信息重要的信息优先输出，同时你要能够处理会议中语音转文字的内容，要正确纠错出现错误的地方，因为转文字的准确率不是100%，所以你要能够处理这些错误，能够处理会议中出现的各种问题，包括但不限于：会议议程、会议内容、会议纪要、会议总结、会议问题、会议反馈"
			}]
			if (selectFileType == "file") {
				if (selectFilePath.length > 0) {
					await readFile(selectFilePath)
					message.push({
						role: "user",
						content: "文件数据：" + fileText.value
					})
				}
			} else if (selectFileType == "audioToText") {
				message.push({
					role: "user",
					content: "会议语音转文字结果：" + audioToTextResult
				})
			}
			messages.push({
				role: "user",
				content: trimmedInput
			})

			// 构建请求参数
			const requestBody = {
				model: 'deepseek-chat',
				messages: messages
			};
			console.log(requestBody);

			// 发送请求
			const {
				data: res
			} = await uni.request({
				url: 'https://api.deepseek.com/chat/completions',
				method: 'POST',
				header: {
					'Authorization': "Bearer " + APP_KEY,
					'Content-Type': 'application/json',
				},
				data: requestBody
			});

			console.log('API响应:', res);

			// 处理响应
			if (res.code === 0) {
				const assistantMessage = res.data.message

				aiMessage.content = assistantMessage?.content || '收到空响应';
				aiMessage.isMarkdown = true;

				// 强制更新视图
				messages.splice(messages.length - 1, 1, {
					...aiMessage
				});
			}
		} catch (error) {
			console.error('请求失败:', error);
			aiMessage.content = '请求处理失败，请稍后再试';
			aiMessage.isMarkdown = false;
			messages.splice(messages.length - 1, 1, {
				...aiMessage
			});
		} finally {
			isSending.value = false;
			aiMessage.typing = false; // 修复：确保关闭加载动画
			messages.splice(messages.indexOf(aiMessage), 1, aiMessage);
			nextTick(autoScroll);
		}
	};

	// Markdown渲染
	const renderMarkdown = (markdownText) => {
		try {
			return marked.parse(markdownText || '');
		} catch (e) {
			console.error('Markdown解析错误:', e);
			return markdownText;
		}
	};

	// 其他功能
	const stopGeneration = () => {
		isGenerating.value = false;
	};

	const resetConversation = () => {
		messages.push(createMessage('divider', '------ 以上是历史记录 ------'));
		currentSessionId.value = uuidv4();
		nextTick(autoScroll);
	};

	const clearScreen = () => {
		uni.showModal({
			title: '提示',
			content: '是否确认清空聊天记录？',
			success: (res) => {
				if (res.confirm) {
					messages.splice(0, messages.length);
					uni.removeStorageSync(STORAGE_KEY);
					messages.push(createMessage('ai', '您好，有什么可以帮助您的？'));
				}
			}
		});
	};
</script>

<style scoped lang="scss">
	page {
		width: 100%;
	}

	.container {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		// background: #f8f9fa;
		overflow: hidden;
	}

	.chat-box {
		flex: 1;
		width: 97%;
		align-self: center;
		padding-bottom: 300rpx;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.message-list {
		padding: 20rpx 24rpx;
		width: 90%;
		// height: auto;
	}

	.message-item {
		display: flex;
		margin: 24rpx 0;
		animation: fadeIn 0.3s ease-out;
		width: 100%;
		box-sizing: border-box;

		&[class*="user-bubble"] {
			justify-content: flex-end;
		}

		&[class*="ai-bubble"] {
			justify-content: flex-start;
		}
	}

	.message-bubble {
		max-width: 70%;
		min-width: 0;
		width: fit-content;
		display: flex;
		flex-direction: column;
		// min-width: 120rpx;
		border-radius: 16rpx;
		padding: 16rpx 24rpx;
		position: relative;
		word-break: break-word;
		// white-space: normal;

		&::after {
			content: '';
			position: absolute;
			width: 16rpx;
			height: 16rpx;
			background: inherit;
		}
	}

	.ai-bubble {
		background: #ffffff;
		margin-left: 15rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.2);

		&::after {
			left: -8rpx;
			top: 16rpx;
			transform: rotate(45deg);
		}
	}

	.user-bubble {
		background: #409eff;
		color: white;
		margin-right: 15rpx;
		margin-left: auto;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.2);

		&::after {
			right: -8rpx;
			top: 16rpx;
			transform: rotate(-45deg);
			background: #409eff;
		}

		.file-attachment {
			margin-top: 10rpx;
			padding: 8rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			align-self: self-end;
			opacity: 0.7;
			transition: all 0.3s;
			width: 100%;
			margin-left: auto;

			&:active {
				opacity: 0.9;
			}

			.attachment-icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
				filter: brightness(0.8);
			}

			.attachment-name {
				flex: 1;
				font-size: 24rpx;
				color: #fff;
				opacity: 0.8;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}


	.file-item {
		border-bottom: 1rpx solid #eee;

		&:last-child {
			border-bottom: none;
		}
	}

	.divider-line {
		margin: 40rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.divider-text {
			color: #909399;
			font-size: 24rpx;
			padding: 0 20rpx;

			position: relative;
			z-index: 0;

			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				right: 0;
				height: 1rpx;
				background: #ebeef5;
				z-index: -1;
			}
		}
	}

	.input-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 200rpx;
		background: linear-gradient(180deg, rgba(248, 249, 250, 0) 0%, rgba(255, 255, 255, 1) 30%);
		padding: 16rpx 24rpx 40rpx;
		box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.06);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.input-action-bar {
		display: flex;
	}

	.action-btn {
		width: 200rpx;
		margin: 5rpx;
	}

	.input-container {
		background: #f5f7fa;
		border-radius: 48rpx;
		padding: 16rpx 24rpx;
		display: flex;
		align-items: center;
	}

	.selected-file-bubble {
		margin-right: 24rpx;
		flex-shrink: 0;
	}

	.file-bubble {
		background: rgba(204, 204, 204, 0.2);
		border-radius: 32rpx;
		padding: 16rpx;
		display: flex;
		align-items: center;

		.bubble-file-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 16rpx;
			opacity: 0.7;
		}

		.bubble-file-name {
			font-size: 26rpx;
			color: #666;
			opacity: 0.7;
			max-width: 200rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.close-icon {
			margin-left: 16rpx;
			padding: 8rpx;
		}
	}

	.dynamic-input {
		min-height: 52rpx;
		max-height: 150rpx;
		font-size: 23rpx;
		line-height: 1.5;
		flex: 1;
	}

	.input-buttons {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.typing-indicator {
		display: flex;
		align-items: center;
		padding: 8rpx 0;

		.dot {
			width: 8rpx;
			height: 8rpx;
			background: #909399;
			border-radius: 50%;
			margin: 0 4rpx;
			animation: bounce 1.4s infinite;

			&:nth-child(2) {
				animation-delay: 0.2s
			}

			&:nth-child(3) {
				animation-delay: 0.4s
			}
		}
	}

	.message-text {
		font-size: 26rpx;
		min-width: 0;
	}

	.stop-message {
		color: #909399;
		font-size: 24rpx;
		margin-top: 8rpx;
		display: block;
	}

	@keyframes bounce {

		0%,
		80%,
		100% {
			transform: translateY(0)
		}

		40% {
			transform: translateY(-8rpx)
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20rpx)
		}

		to {
			opacity: 1;
			transform: translateY(0)
		}
	}

	.markdown-content {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		line-height: 1.8;
		color: #2c3e50;
		overflow-x: auto;
		font-size: 26rpx;

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin: 23rpx 0 20rpx;
			font-weight: 600;
			color: #1a1a1a;
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: 0;
				left: 0;
				width: 40rpx;
				height: 4rpx;
				background: #409eff;
			}
		}

		p {
			margin: 20rpx 0;
			text-align: justify;
		}

		ul,
		ol {
			padding-left: 60rpx;
			margin: 24rpx 0;

			li {
				margin: 16rpx 0;
				padding-left: 16rpx;

				&::marker {
					color: #409eff;
				}

				>p {
					margin: 0;
				}
			}
		}

		pre {
			position: relative;
			background: #f8f9fa;
			border-radius: 12rpx;
			padding: 32rpx;
			margin: 32rpx 0;
			overflow-x: auto;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

			code {
				font-family: "Fira Code", "Consolas", monospace;
				font-size: 26rpx;
				line-height: 1.5;
				display: block;
			}

			&::before {
				content: " ";
				position: absolute;
				top: 12rpx;
				right: 12rpx;
				width: 40rpx;
				height: 24rpx;
				background: #e8e8e8;
				border-radius: 4rpx;
			}
		}

		code {
			background: #f3f5f7;
			padding: 4rpx 8rpx;
			border-radius: 4rpx;
			color: #c7254e;
			font-size: 90%;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			margin: 32rpx 0;
			box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);

			th {
				background: #f5f7fa;
				padding: 20rpx;
				border: 1rpx solid #ebeef5;
				font-weight: 600;
				color: #303133;
			}

			td {
				padding: 16rpx;
				border: 1rpx solid #ebeef5;
				background: white;
			}

			tr:nth-child(even) td {
				background: #fafafa;
			}
		}

		blockquote {
			background: #f3f5f7;
			border-left: 6rpx solid #409eff;
			margin: 23rpx 0;
			padding: 24rpx 32rpx;
			color: #5e6d82;
			border-radius: 8rpx;

			p {
				margin: 0;
			}
		}

		a {
			color: #409eff;
			text-decoration: none;
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: -2rpx;
				left: 0;
				width: 0;
				height: 2rpx;
				background: #409eff;
				transition: width 0.3s ease;
			}

			&:hover::after {
				width: 100%;
			}
		}

		hr {
			height: 2rpx;
			background: linear-gradient(90deg, transparent, #409eff, transparent);
			margin: 48rpx 0;
			border: none;
		}

		img {
			max-width: 100%;
			height: auto;
			border-radius: 12rpx;
			margin: 24rpx 0;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
			display: block;
		}

		.task-list-item {
			list-style-type: none;
			margin-left: -24rpx;

			input[type="checkbox"] {
				margin-right: 12rpx;
				transform: scale(1.2);
			}
		}

		.math-display {
			overflow-x: auto;
			padding: 20rpx;
			background: #f8f9fa;
			margin: 24rpx 0;
		}
	}

	.file-popup {
		padding: 24rpx;
		max-height: 70vh;

		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 24rpx;

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
			}
		}

		.file-list {
			max-height: 60vh;
		}

		.file-item {
			display: flex;
			align-items: center;
			padding: 24rpx;
			margin: 8rpx 0;
			border-radius: 8rpx;
			transition: all 0.3s;

			&.selected {
				background: #f0f7ff;
				border: 1rpx solid #409eff;
			}

			.file-icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}

			.file-name {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}
		}
	}

	.image-gif {
		position: fixed;
		bottom: 220rpx;
		right: 0;

		image {
			height: 200rpx;
		}
	}
</style>