<template>
	<view>
		<view id="record" class="record" :listeningRecordingBegins="recordFlag"
			:change:listeningRecordingBegins="record.listeningRecordingBeginsHandler" :scriptPath="scriptPath"
			:change:scriptPath="record.scriptPathHandler" :options="options" :change:options="record.optionsHandler">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: '',
				recordFlag: null,
				scriptPath: ''
			};
		},
		props: {
			options: {
				type: Object,
				default: () => {
					return {
						receordingDuration: 7200,
						APPID: '5b0aa9e7',
						// API_SECRET: '',
						API_KEY: '963b887e9e6bbedf0429ca3e06c41595'
					}
				}
			}
		},
		created() {
			// #ifdef APP
			this.scriptPath = 'file://' + plus.io.convertLocalFileSystemURL('/');
			// #endif
		},
		methods: {
			start() {
				if (this.recordFlag == 'START') return
				this.recordFlag = 'START';
			},
			end() {
				if (this.recordFlag == 'END') return
				this.recordFlag = 'END';
			},
			resultMsg(e) {
				console.log(e);
				this.$emit('result', e)
				this.msg = e;
			},
			endCallback(e) {
				this.end()
				this.$emit('onStop', e)
			},
			startCallback(e) {
				this.$emit('onStart', e)
			},
			seconds(e) {
				this.$emit('countDown', e)
			},
			change(e) {
				this.$emit('change', e)
			},
			connectError() {
				uni.showToast({
					icon: "error",
					title: "失败了，请重试",
					duration: 2000
				})
			},
		}
	};
</script>

<script lang="renderjs" module="record">
	import CryptoJS from 'crypto-js';
	import {
		MD5,
		HmacSHA1,
		enc
	} from "crypto-js";
	let APPID = "5b0aa9e7";
	// let API_SECRET = "NmIyZWFjYzMxNTEwMmRjZTE0YjcxNzIw";
	let API_KEY = "963b887e9e6bbedf0429ca3e06c41595";
	let receordingDuration = 60
	let ws = null;
	let resultText = "";
	let resultTextTemp = "";
	let timer = null;
	let tapeStatus = {
		CONNECTING: 'CONNECTING',
		OPEN: 'OPEN',
		CLOSING: 'CLOSING',
		CLOSED: 'CLOSED'
	}
	export default {
		data() {
			return {
				recorder: null,
				recorderPath: '',
			}
		},
		methods: {
			listeningRecordingBeginsHandler(flag) {
				if (flag == null) return
				if (flag == 'START') {
					this.connectWebSocket()
				} else if (flag == 'END') {
					this.endSocket();
					this.recorder.stop()
				}
			},
			scriptPathHandler(path) {
				var recordScript = document.getElementById("recordScript");
				if (recordScript) {
					console.log('有标签了');
				} else {
					var script = document.createElement('script');
					script.id = 'recordScript'
					script.src = `static/dist/index.umd.js`;
					document.body.appendChild(script);
					script.onload = () => {
						this.recorder = new RecorderManager(path + 'static/dist')
						this.initListen()
					}
				}
			},
			optionsHandler(options) {
				APPID = options.APPID
				API_SECRET = options.API_SECRET
				API_KEY = options.API_KEY
				receordingDuration = options.receordingDuration
			},
			initListen() {
				this.recorder.onStart = () => {
					this.changeStatus(tapeStatus.OPEN);
				}
				this.recorder.onFrameRecorded = ({
					isLastFrame,
					frameBuffer
				}) => {
					if (ws.readyState === ws.OPEN) {
						// console.log(frameBuffer);
						ws.send(new Int8Array(frameBuffer));
						if (isLastFrame) {
							this.changeStatus("CLOSING");
						}
					}

				};
				this.recorder.onStop = () => {
					clearInterval(timer);
				};
			},
			connectWebSocket() {
				const websocketUrl = this.getWebSocketUrl();
				if ("WebSocket" in window) {
					ws = new WebSocket(websocketUrl);
				} else if ("MozWebSocket" in window) {
					ws = new MozWebSocket(websocketUrl);
				} else {
					console.log("不支持WebSocket");
					return;
				}
				this.changeStatus(tapeStatus.CONNECTING);
				ws.onopen = () => {
					this.recorder.start({
						sampleRate: 16000,
						frameSize: 1280,
					})
				}
				ws.onmessage = (e) => {
					console.log(e);
					this.renderResult(e.data);
				};

				ws.onerror = (e) => {
					console.error(e);
					this.recorder.stop();
					this.endSocket();
					this.changeStatus(tapeStatus.CLOSED)
				};
				ws.onclose = (e) => {
					console.log(e);
					this.recorder.stop();
					console.log("close");
					this.endSocket();
					this.changeStatus(tapeStatus.CLOSED)
				};
			},
			getWebSocketUrl() {
				let url = "wss://rtasr.xfyun.cn/v1/ws";
				// const host = "iat-api.xfyun.cn";
				const appId = APPID;
				const apiKey = API_KEY;
				const date = parseInt(new Date().getTime() / 1000);
				// const algorithm = "hmac-sha256";

				const content = appId + date;
				const md5Content = MD5(content);
				const sha1Content = HmacSHA1(enc.Utf8.parse(md5Content), apiKey);
				const signa = sha1Content.toString(enc.Base64);
				url = `${url}?appid=${appId}&ts=${date}&signa=${signa}`;
				console.log(url);
				return url;
			},
			renderResult(resultData) {
				let jsonData = JSON.parse(resultData);
				if (jsonData.action == "started") {
					// 握手成功
					console.log("握手成功");
				} else if (jsonData.action == "result") {
					const data = JSON.parse(jsonData.data)
					console.log(data)
					// 转写结果
					let resultTextTemp = ""
					data.cn.st.rt.forEach((j) => {
						j.ws.forEach((k) => {
							k.cw.forEach((l) => {
								resultTextTemp += l.w;
							});
						});
					});
					if (data.cn.st.type == 0) {
						// 【最终】识别结果：
						resultText += resultTextTemp;
						resultTextTemp = ""
					}
					// this.$ownerInstance.callMethod('resultMsg', resultTextTemp || resultText || '');
					this.$ownerInstance.callMethod('resultMsg', resultText + resultTextTemp);

				} else if (jsonData.action == "error") {
					// 连接发生错误
					console.log("出错了:", jsonData);
					ws.close();
					this.$ownerInstance.callMethod('connectError')

				}
			},
			changeStatus(status) {
				let statusText = ''

				if (status === "CONNECTING") {
					statusText = '建立连接中'
					resultText = "";
					resultTextTemp = "";
				} else if (status === "OPEN") {
					statusText = '开始录音'
					this.$ownerInstance.callMethod('startCallback', {
						status,
						msg: statusText
					})
				} else if (status === "CLOSING") {
					statusText = '关闭连接中'
				} else if (status === "CLOSED") {
					statusText = "录音已关闭";
					this.$ownerInstance.callMethod('endCallback', {
						status,
						msg: statusText
					})
				}
				this.$ownerInstance.callMethod('change', {
					status,
					msg: statusText
				})
			},
			endSocket() {
				const end_msg = '{"end": true}';
				ws.send(end_msg);
				console.log("webSocket已关闭");
			}
		}

	}
</script>
<style></style>