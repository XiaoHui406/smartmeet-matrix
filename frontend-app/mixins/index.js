/*
 * 封装公用方法
 */
import ZegoExpressEngine from "@/uni_modules/zego-ZegoExpressUniApp-JS/components/zego-ZegoExpressUniApp-JS/lib/ZegoExpressEngine";
import {
	ZegoScenario
} from "@/uni_modules/zego-ZegoExpressUniApp-JS/components/zego-ZegoExpressUniApp-JS/lib/ZegoExpressDefines";
import keyCenter from "@/pages/KeyCenter.js";
import {
	getLoginToken
} from '@/pages/getToken'
export default {
	data() {
		return {
			info: '',
			logHeight: 80,
			engine: undefined,
			roomID: "0919878",
			userID: keyCenter.getUserID(),
			userName: keyCenter.getUserID(),
			isLogin: false,
			isRequest: false,
			playStream: null
		}
	},
	onShow() {
		this.userID = keyCenter.getUserID()
		uni.$once("backPress", (data) => {
			if (data.isLeave == true) {
				this.destroyEngine()
			}
		})
	},
	onUnload() {
		this.destroyEngine();
		console.log('onUnload');
	},
	onBackPress() {
		this.destroyEngine();
		console.log('onBackPress');
	},
	methods: {
		// 创建引擎
		async createEngine() {
			this.appendActionInfo("create ZegoExpressEngine");
			// console.warn(1111, keyCenter.getAppID())
			let profile = {
				appID: keyCenter.getAppID(),
				// #ifdef APP-PLUS
				appSign: keyCenter.getAppSign(),
				// #endif
				scenario: ZegoScenario.General
			};
			this.engine = await ZegoExpressEngine.createEngineWithProfile(
				profile
			);

			this.appendSuccessInfo("createEngine");
			// #ifdef H5
			const result = await this.engine.zegoWebRTC.checkSystemRequirements()

			function isNotSupported(obj, keystr) {
				for (let key in obj) {
					if (!obj[key]) {
						keystr += key + '，'
					}
					if (obj[key] instanceof Object) {
						keystr += isNotSupported(obj[key], '')
					}
				}
				return keystr
			}
			console.warn('checkSystemRequirements', result)
			console.warn('isNotSupported: ', isNotSupported(result, ''))
			// #endif
			this.engine.on("roomStreamUpdate", (roomID, updateType, streamList) => {
				this.appendSuccessInfo(
					`roomStreamUpdate： roomID:${roomID}, updateType: ${updateType}, playStream: ${!!this.playStream}, isPlayingStream: ${this.isPlayingStream}`
				);
				// 流更新的相关操作, 以及关于断网后的重连出发的流更新
				const stream = streamList.find(item => item.streamID === this.playStreamID)
				console.warn(
					`stream:${stream}, updateType: ${updateType}, playStream: ${this.playStream}, isPlayingStream: ${this.isPlayingStream}`
				)
				if (stream) {
					// 0 为add, 1 为delete
					if (updateType == 0) {
						// 拉流点击快于推流时，需要等流更新后重新拉
						if (this.isPlayingStream) {
							// startPlayingStream 在 play.js文件
							this.startPlayingStream(this.playStreamID);
						}
					} else if (updateType == 1) {
						// if(this.isPlayingStream) {
						//     // onClickPlay 在 play.js文件
						//     this.onClickPlay()
						// }
					}
				}
			});
		},
		// 销毁引擎
		destroyEngine() {
			this.appendActionInfo("Destroy Engine");
			this.logoutRoom(this.roomID)
			ZegoExpressEngine.destroyEngine();
			this.engine = null
		},
		// 登录房间
		async loginRoom(roomID, userID, userName) {
			this.appendActionInfo(
				`Login Room: roomID:${roomID}, userID:${userID}, userName:${userName}, isLogin: ${this.isLogin}`
			);
			if (this.isLogin) {
				await this.logoutRoom(roomID)
				this.isLogin = !this.isLogin
			} else {
				let user = {
					userID: userID,
					userName: userName,
				};
				let token = ""
				// #ifdef H5
				token = keyCenter.getToken() || await getLoginToken(userID, roomID);
				// #endif
				this.appendActionInfo(
					`Login Room: roomID:${roomID}, userID:${userID}, userName:${userName}, token: ${token}`
				);
				const result = await this.engine.loginRoom(roomID, user, {
					token: token,
					isUserStatusNotify: true,
				});
				// #ifdef H5
				this.isLogin = result
				// #endif
				// #ifdef APP-PLUS
				this.isLogin = result.errorCode == 0
				// #endif
			}

		},
		// 退出房间
		logoutRoom(roomID) {
			console.log(this.isLogin);
			console.log(roomID);
			if (!this.isLogin) return
			this.appendActionInfo(`Logout Room: roomID:${roomID}`);
			this.engine?.logoutRoom(roomID).then((res) => {
				console.log(res);
			})
		},
		// 修改房间ID
		bindRoomIDChange(e) {
			this.roomID = e.detail.value;
		},
		// 预览
		startPreview(channel) {
			this.appendActionInfo("Start Preview");
			// #ifdef H5
			// H5需要传入挂载节点
			this.engine.startPreview(document.querySelector('#local_video video'), channel)
			// #endif
			// #ifdef APP-PLUS
			this.engine.startPreview(channel)
			// #endif
		},
		// 停止预览
		stopPreview() {
			this.appendActionInfo("Stop Preview");
			ZegoExpressEngine.instance().stopPreview();
		},
		changeLogViewSize() {
			this.logHeight = this.logHeight == 80 ? 800 : 80;
		},
		changeMuted(name) {
			this[name] = !this[name]
		},
		appendActionInfo(info) {
			this.info += "🚀";
			this.info += info;
			this.info += "\n";
		},
		appendSuccessInfo(info) {
			this.info += "✅";
			this.info += info;
			this.info += "\n";
		},
		appendFailureInfo(info) {
			this.info += "❌";
			this.info += info;
			this.info += "\n";
		},
		appendCallbackInfo(info) {
			this.info += "📩";
			this.info += info;
			this.info += "\n";
		},
	}
}