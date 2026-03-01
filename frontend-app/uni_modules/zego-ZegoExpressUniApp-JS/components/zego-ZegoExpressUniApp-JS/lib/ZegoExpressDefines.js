/** 房间场景 */
export var ZegoScenario;
(function (ZegoScenario) {
    /** 【已废弃】旧版通用场景，此场景在 3.0.0 版本及以上已废弃，不建议使用，请尽快迁移到新版场景。 */
    ZegoScenario[ZegoScenario["General"] = 0] = "General";
    /** 【已废弃】旧版实时通讯场景，此场景在 3.0.0 版本及以上已废弃，不建议使用，请尽快迁移到新版场景。 */
    ZegoScenario[ZegoScenario["Communication"] = 1] = "Communication";
    /** 【已废弃】旧版直播场景，此场景在 3.0.0 版本及以上已废弃，不建议使用，请尽快迁移到新版场景。 */
    ZegoScenario[ZegoScenario["Live"] = 2] = "Live";
    /** 支持版本：3.0.0 及以上。详情描述：默认（通用）场景，若下列场景枚举均不符合开发者的实际应用场景，可使用此默认场景。 */
    ZegoScenario[ZegoScenario["Default"] = 3] = "Default";
    /** 支持版本：3.0.0 及以上。详情描述：标准音视频通话场景，适用于 1v1 视频通话场景。 */
    ZegoScenario[ZegoScenario["StandardVideoCall"] = 4] = "StandardVideoCall";
    /** 支持版本：3.0.0 及以上。详情描述：高品质音视频通话场景，与标准音视频通话场景类似，但该场景默认采用了更高的视频帧率、码率、分辨率 (540p)，适用于对画质要求较高的视频通话场景。 */
    ZegoScenario[ZegoScenario["HighQualityVideoCall"] = 5] = "HighQualityVideoCall";
    /** 支持版本：3.0.0 及以上。详情描述：标准语聊房场景，适用于多人纯语音通话（节省流量）。注意：在实时音视频 (ExpressVideo) SDK 上，此场景默认不开启摄像头。 */
    ZegoScenario[ZegoScenario["StandardChatroom"] = 6] = "StandardChatroom";
    /** 支持版本：3.0.0 及以上。详情描述：高品质语聊房场景，与标准语聊房场景类似，但此场景默认采用了更高的音频码率。适用于对音质要求较高的多人纯语音通话场景。注意：在实时音视频 (ExpressVideo) SDK 上，此场景默认不开启摄像头。 */
    ZegoScenario[ZegoScenario["HighQualityChatroom"] = 7] = "HighQualityChatroom";
    /** 支持版本：3.0.0 及以上。详情描述：直播场景，适用于秀场、游戏、电商、教育大班课等一对多直播的场景，对音画质量、流畅度、兼容性进行了优化。注意：即便是直播场景，SDK 也没有业务上的 “角色” 之分（例如主播、观众），房间内的所有用户均可推拉流。 */
    ZegoScenario[ZegoScenario["Broadcast"] = 8] = "Broadcast";
    /** 支持版本：3.0.0 及以上。详情描述：卡拉 OK (KTV) 场景，适用于实时合唱、在线 K 歌场景，对延迟、音质、耳返、回声消除等做了优化，同时还保障了多人合唱时精准对齐和超低时延。 */
    ZegoScenario[ZegoScenario["Karaoke"] = 9] = "Karaoke";
    /** 支持版本：3.3.0 及以上。详情描述：标准语音通话场景，适用于 1v1 纯语音通话场景。注意：在实时音视频 (ExpressVideo) SDK 上，此场景默认不开启摄像头。 */
    ZegoScenario[ZegoScenario["StandardVoiceCall"] = 10] = "StandardVoiceCall";
})(ZegoScenario || (ZegoScenario = {}));
/** 房间模式。 */
export var ZegoRoomMode;
(function (ZegoRoomMode) {
    /** 单房间模式。 */
    ZegoRoomMode[ZegoRoomMode["SingleRoom"] = 0] = "SingleRoom";
    /** 多房间模式。 */
    ZegoRoomMode[ZegoRoomMode["MultiRoom"] = 1] = "MultiRoom";
})(ZegoRoomMode || (ZegoRoomMode = {}));
/** 引擎状态 */
export var ZegoEngineState;
(function (ZegoEngineState) {
    /** 引擎已开启 */
    ZegoEngineState[ZegoEngineState["Start"] = 0] = "Start";
    /** 引擎已停止 */
    ZegoEngineState[ZegoEngineState["Stop"] = 1] = "Stop";
})(ZegoEngineState || (ZegoEngineState = {}));
/** 房间状态 */
export var ZegoRoomState;
(function (ZegoRoomState) {
    /** 未连接状态，在登录房间前和退出房间之后进入该状态。如果登录房间的过程出现稳态异常，例如 AppID 或 Token 不正确，或者有相同用户名在其他地方登录导致本端被 KickOut，都会进入该状态 */
    ZegoRoomState[ZegoRoomState["Disconnected"] = 0] = "Disconnected";
    /** 正在请求连接状态，登录房间动作执行成功后会进入此状态。通常通过该状态进行应用界面的展示。如果因为网络质量不佳产生的中断， SDK 会进行内部重试，也会回到正在请求连接状态 */
    ZegoRoomState[ZegoRoomState["Connecting"] = 1] = "Connecting";
    /** 连接成功状态，进入该状态表示登录房间已经成功，用户可以正常收到房间内的用户和流信息增删的回调通知 */
    ZegoRoomState[ZegoRoomState["Connected"] = 2] = "Connected";
})(ZegoRoomState || (ZegoRoomState = {}));
/** 房间状态变化原因。 */
export var ZegoRoomStateChangedReason;
(function (ZegoRoomStateChangedReason) {
    /** 正在登录房间。当调用 [loginRoom] 登录房间或 [switchRoom] 切换到目标房间时，进入该状态，表示正在请求连接服务器。通常通过该状态进行应用界面的展示。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["Logining"] = 0] = "Logining";
    /** 登录房间成功。当登录房间或切换房间成功后，进入该状态，表示登录房间已经成功，用户可以正常收到房间内的其他用户和所有流信息增删的回调通知。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["Logined"] = 1] = "Logined";
    /** 登录房间失败。当登录房间或切换房间失败后，进入该状态，表示登录房间或切换房间已经失败，例如 AppID 或 Token 不正确等。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["LoginFailed"] = 2] = "LoginFailed";
    /** 房间连接临时中断。如果因为网络质量不佳产生的中断，SDK 会进行内部重试。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["Reconnecting"] = 3] = "Reconnecting";
    /** 房间重新连接成功。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，重连成功后进入该状态。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["Reconnected"] = 4] = "Reconnected";
    /** 房间重新连接失败。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，重连失败后进入该状态。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["ReconnectFailed"] = 5] = "ReconnectFailed";
    /** 被服务器踢出房间。例如有相同用户名在其他地方登录房间导致本端被踢出房间，会进入该状态。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["KickOut"] = 6] = "KickOut";
    /** 登出房间成功。没有登录房间前默认为该状态，当调用 [logoutRoom] 登出房间成功或 [switchRoom] 内部登出当前房间成功后，进入该状态。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["Logout"] = 7] = "Logout";
    /** 登出房间失败。当调用 [logoutRoom] 登出房间失败或 [switchRoom] 内部登出当前房间失败后，进入该状态。 */
    ZegoRoomStateChangedReason[ZegoRoomStateChangedReason["LogoutFailed"] = 8] = "LogoutFailed";
})(ZegoRoomStateChangedReason || (ZegoRoomStateChangedReason = {}));
/** 推流通道 */
export var ZegoPublishChannel;
(function (ZegoPublishChannel) {
    /** 主推流通道，默认通道 */
    ZegoPublishChannel[ZegoPublishChannel["Main"] = 0] = "Main";
    /** 辅推流通道（第二路推流通道） */
    ZegoPublishChannel[ZegoPublishChannel["Aux"] = 1] = "Aux";
    /** 第三路推流通道 */
    ZegoPublishChannel[ZegoPublishChannel["Third"] = 2] = "Third";
    /** 第四路推流通道 */
    ZegoPublishChannel[ZegoPublishChannel["Fourth"] = 3] = "Fourth";
})(ZegoPublishChannel || (ZegoPublishChannel = {}));
/** 视频渲染填充模式 */
export var ZegoViewMode;
(function (ZegoViewMode) {
    /** 等比缩放，可能有黑边 */
    ZegoViewMode[ZegoViewMode["AspectFit"] = 0] = "AspectFit";
    /** 等比缩放填充整个 View，可能有部分被裁减 */
    ZegoViewMode[ZegoViewMode["AspectFill"] = 1] = "AspectFill";
    /** 填充整个 View，图像可能被拉伸 */
    ZegoViewMode[ZegoViewMode["ScaleToFill"] = 2] = "ScaleToFill";
})(ZegoViewMode || (ZegoViewMode = {}));
/** 预览或拉流端的镜像模式。 */
export var ZegoVideoMirrorMode;
(function (ZegoVideoMirrorMode) {
    /** 只有本地预览时才是镜像画面，默认采用此模式。当移动端使用后置摄像头时，虽然仍默认采用此模式，但是不起作用，本地预览不设置镜像。 */
    ZegoVideoMirrorMode[ZegoVideoMirrorMode["OnlyPreviewMirror"] = 0] = "OnlyPreviewMirror";
    /** 本地预览和拉流端看到的视频都是镜像画面。 */
    ZegoVideoMirrorMode[ZegoVideoMirrorMode["BothMirror"] = 1] = "BothMirror";
    /** 本地预览和拉流端看到的视频都不是镜像画面。 */
    ZegoVideoMirrorMode[ZegoVideoMirrorMode["NoMirror"] = 2] = "NoMirror";
    /** 只有拉流端看到的视频才是镜像画面。 */
    ZegoVideoMirrorMode[ZegoVideoMirrorMode["OnlyPublishMirror"] = 3] = "OnlyPublishMirror";
})(ZegoVideoMirrorMode || (ZegoVideoMirrorMode = {}));
/** 推流状态 */
export var ZegoPublisherState;
(function (ZegoPublisherState) {
    /** 未推流状态，在推流前处于该状态。如果推流过程出现稳态的异常，例如 AppID 或 Token 不正确，或者如果其他用户已经在推送流，推送相同流 ID 的流会失败，都会进入未推流状态 */
    ZegoPublisherState[ZegoPublisherState["NoPublish"] = 0] = "NoPublish";
    /** 正在请求推流状态，推流操作执行成功后会进入正在请求推流状态，通常通过该状态进行 UI 界面的展示。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，也会回到正在请求推流状态 */
    ZegoPublisherState[ZegoPublisherState["PublishRequesting"] = 1] = "PublishRequesting";
    /** 正在推流状态，进入该状态表明推流已经成功，用户可以正常通信 */
    ZegoPublisherState[ZegoPublisherState["Publishing"] = 2] = "Publishing";
})(ZegoPublisherState || (ZegoPublisherState = {}));
/** 视频配置分辨率与比特率预设枚举。预设的分辨率分别针对移动端与桌面端做了适配。在移动端上 height 长于 width，而桌面端相反。例如 1080p 在移动端上实际为 1080(w) x 1920(h)，而在桌面端上实际为 1920(w) x 1080(h) */
export var ZegoVideoConfigPreset;
(function (ZegoVideoConfigPreset) {
    /** 设置分辨率为 320x180，默认采用 15 fps，码率 300 kbps */
    ZegoVideoConfigPreset[ZegoVideoConfigPreset["Preset180P"] = 0] = "Preset180P";
    /** 设置分辨率为 480x270，默认采用 15 fps，码率 400 kbps */
    ZegoVideoConfigPreset[ZegoVideoConfigPreset["Preset270P"] = 1] = "Preset270P";
    /** 设置分辨率为 640x360，默认采用 15 fps，码率 600 kbps */
    ZegoVideoConfigPreset[ZegoVideoConfigPreset["Preset360P"] = 2] = "Preset360P";
    /** 设置分辨率为 960x540，默认采用 15 fps，码率 1200 kbps */
    ZegoVideoConfigPreset[ZegoVideoConfigPreset["Preset540P"] = 3] = "Preset540P";
    /** 设置分辨率为 1280x720，默认采用 15 fps，码率 1500 kbps */
    ZegoVideoConfigPreset[ZegoVideoConfigPreset["Preset720P"] = 4] = "Preset720P";
    /** 设置分辨率为 1920x1080，默认采用 15 fps，码率 3000 kbps */
    ZegoVideoConfigPreset[ZegoVideoConfigPreset["Preset1080P"] = 5] = "Preset1080P";
})(ZegoVideoConfigPreset || (ZegoVideoConfigPreset = {}));
/** 流质量等级 */
export var ZegoStreamQualityLevel;
(function (ZegoStreamQualityLevel) {
    /** 质量极好 */
    ZegoStreamQualityLevel[ZegoStreamQualityLevel["Excellent"] = 0] = "Excellent";
    /** 质量好 */
    ZegoStreamQualityLevel[ZegoStreamQualityLevel["Good"] = 1] = "Good";
    /** 质量正常 */
    ZegoStreamQualityLevel[ZegoStreamQualityLevel["Medium"] = 2] = "Medium";
    /** 质量差 */
    ZegoStreamQualityLevel[ZegoStreamQualityLevel["Bad"] = 3] = "Bad";
    /** 质量异常 */
    ZegoStreamQualityLevel[ZegoStreamQualityLevel["Die"] = 4] = "Die";
    /** 质量未知 */
    ZegoStreamQualityLevel[ZegoStreamQualityLevel["Unknown"] = 5] = "Unknown";
})(ZegoStreamQualityLevel || (ZegoStreamQualityLevel = {}));
/** 音频声道 */
export var ZegoAudioChannel;
(function (ZegoAudioChannel) {
    /** 未知 */
    ZegoAudioChannel[ZegoAudioChannel["Unknown"] = 0] = "Unknown";
    /** 单声道 */
    ZegoAudioChannel[ZegoAudioChannel["Mono"] = 1] = "Mono";
    /** 双声道 */
    ZegoAudioChannel[ZegoAudioChannel["Stereo"] = 2] = "Stereo";
})(ZegoAudioChannel || (ZegoAudioChannel = {}));
/** 音频混音模式 */
export var ZegoAudioMixMode;
(function (ZegoAudioMixMode) {
    /** 默认模式，无特殊行为 */
    ZegoAudioMixMode[ZegoAudioMixMode["Raw"] = 0] = "Raw";
    /** 音频聚焦模式，可在多路音频流中突出某路流的声音 */
    ZegoAudioMixMode[ZegoAudioMixMode["Focused"] = 1] = "Focused";
})(ZegoAudioMixMode || (ZegoAudioMixMode = {}));
/** 音频编码器 ID */
export var ZegoAudioCodecID;
(function (ZegoAudioCodecID) {
    /** 默认值，根据调用 [createEngine] 时的 [scenario] 决定。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Default"] = 0] = "Default";
    /** 可用于 RTC 和 CDN 推流；码率范围 10kbps ~ 128kbps；支持双声道；延迟在 500ms 左右。与 Web SDK 互通时需要服务端转码；转推 CDN 时不需要服务端云转码。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Normal"] = 1] = "Normal";
    /** 可用于 RTC 和 CDN 推流；兼容性好，码率范围 16kbps ~ 192kbps；支持双声道；延迟 350ms 左右；相同码率下（较低码率），音质弱于 [Normal]。与 Web SDK 互通时需要服务端转码；转推 CDN 时不需要服务端云转码。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Normal2"] = 2] = "Normal2";
    /** 不推荐使用；若需要使用请先咨询 ZEGO 技术支持。仅可用于 RTC 推流。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Normal3"] = 3] = "Normal3";
    /** 不推荐使用；若需要使用请先咨询 ZEGO 技术支持。仅可用于 RTC 推流。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Low"] = 4] = "Low";
    /** 不推荐使用；若需要使用请先咨询 ZEGO 技术支持。仅可用于 RTC 推流；最大码率为 16kbps。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Low2"] = 5] = "Low2";
    /** 仅可用于 RTC 推流；码率范围 6kbps ~ 192kbps；支持双声道；延迟在 200ms 左右；相同码率下（较低码率），音质明显好于 [Normal] 与 [Normal2]；CPU 开销较低。与 Web SDK 互通时不需要服务端云转码；转推 CDN 时需要服务端转码。 */
    ZegoAudioCodecID[ZegoAudioCodecID["Low3"] = 6] = "Low3";
})(ZegoAudioCodecID || (ZegoAudioCodecID = {}));
/** 视频编码格式 */
export var ZegoVideoCodecID;
(function (ZegoVideoCodecID) {
    /** 默认编码 (H.264) */
    ZegoVideoCodecID[ZegoVideoCodecID["Default"] = 0] = "Default";
    /** 分层编码 (H.264 SVC) */
    ZegoVideoCodecID[ZegoVideoCodecID["SVC"] = 1] = "SVC";
    /** VP8 */
    ZegoVideoCodecID[ZegoVideoCodecID["VP8"] = 2] = "VP8";
    /** H.265 */
    ZegoVideoCodecID[ZegoVideoCodecID["H265"] = 3] = "H265";
    /** 视频大小流编码 */
    ZegoVideoCodecID[ZegoVideoCodecID["H264DualStream"] = 4] = "H264DualStream";
    /** 未知编码类型 */
    ZegoVideoCodecID[ZegoVideoCodecID["Unknown"] = 100] = "Unknown";
})(ZegoVideoCodecID || (ZegoVideoCodecID = {}));
/** 视频画面旋转方向枚举 */
export var ZegoOrientation;
(function (ZegoOrientation) {
    /** 不旋转 */
    ZegoOrientation[ZegoOrientation["PortraitUp"] = 0] = "PortraitUp";
    /** 逆时针旋转 90 度 */
    ZegoOrientation[ZegoOrientation["LandscapeLeft"] = 1] = "LandscapeLeft";
    /** 逆时针旋转 180 度 */
    ZegoOrientation[ZegoOrientation["PortraitDown"] = 2] = "PortraitDown";
    /** 逆时针旋转 270 度 */
    ZegoOrientation[ZegoOrientation["LandscapeRight"] = 3] = "LandscapeRight";
})(ZegoOrientation || (ZegoOrientation = {}));
/** 视频流类型 */
export var ZegoVideoStreamType;
(function (ZegoVideoStreamType) {
    /** 根据网络状态自动选择流类型 */
    ZegoVideoStreamType[ZegoVideoStreamType["Default"] = 0] = "Default";
    /** 小分辨率类型 */
    ZegoVideoStreamType[ZegoVideoStreamType["Small"] = 1] = "Small";
    /** 大分辨率类型 */
    ZegoVideoStreamType[ZegoVideoStreamType["Big"] = 2] = "Big";
})(ZegoVideoStreamType || (ZegoVideoStreamType = {}));
/** 回声消除模式。 */
export var ZegoAECMode;
(function (ZegoAECMode) {
    /** 激进的回声抵消，可能会影响音质稍微明显，但是回声会消除得很干净。 */
    ZegoAECMode[ZegoAECMode["Aggressive"] = 0] = "Aggressive";
    /** 适度的回声抵消，就是可能会稍微影响一点点音质，但是残留的回声会更少。 */
    ZegoAECMode[ZegoAECMode["Medium"] = 1] = "Medium";
    /** 舒适的回声抵消，就是回声抵消基本不会影响声音的音质，可能有时会残留一点回声，但不会影响正常听音。 */
    ZegoAECMode[ZegoAECMode["Soft"] = 2] = "Soft";
})(ZegoAECMode || (ZegoAECMode = {}));
/** 噪声抑制模式 */
export var ZegoANSMode;
(function (ZegoANSMode) {
    /** 轻度的噪声抑制，基本不会损伤音质，但会残留一些噪声。 */
    ZegoANSMode[ZegoANSMode["Soft"] = 0] = "Soft";
    /** 适度的噪声抑制，有可能损伤一些音质，但有不错的降噪效果。 */
    ZegoANSMode[ZegoANSMode["Medium"] = 1] = "Medium";
    /** 激进的噪声抑制，有可能明显损伤音质，但有很好的降噪效果。 */
    ZegoANSMode[ZegoANSMode["Aggressive"] = 2] = "Aggressive";
    /** AI 模式噪声抑制，会对音乐有较大损伤，故不能用于对需要采集背景音的音源进行噪声抑制。如需使用，请联系技术支持。 */
    ZegoANSMode[ZegoANSMode["AI"] = 3] = "AI";
    /** 均衡 AI 模式噪声抑制，会对音乐有较大损伤，故不能用于对需要采集背景音的音源进行噪声抑制。如需使用，请联系技术支持。 */
    ZegoANSMode[ZegoANSMode["AIBalanced"] = 4] = "AIBalanced";
})(ZegoANSMode || (ZegoANSMode = {}));
/** 当发生流量控制时可供调节的属性（位掩码枚举） */
export var ZegoTrafficControlProperty;
(function (ZegoTrafficControlProperty) {
    /** 基础属性（自适应（降低）视频码率） */
    ZegoTrafficControlProperty[ZegoTrafficControlProperty["Basic"] = 0] = "Basic";
    /** 自适应（降低）视频帧率 */
    ZegoTrafficControlProperty[ZegoTrafficControlProperty["AdaptiveFPS"] = 1] = "AdaptiveFPS";
    /** 自适应（降低）视频分辨率 */
    ZegoTrafficControlProperty[ZegoTrafficControlProperty["AdaptiveResolution"] = 2] = "AdaptiveResolution";
    /** 自适应（降低）音频码率 */
    ZegoTrafficControlProperty[ZegoTrafficControlProperty["AdaptiveAudioBitrate"] = 4] = "AdaptiveAudioBitrate";
})(ZegoTrafficControlProperty || (ZegoTrafficControlProperty = {}));
/** 流控触发最低码率时的视频发送模式 */
export var ZegoTrafficControlMinVideoBitrateMode;
(function (ZegoTrafficControlMinVideoBitrateMode) {
    /** 低于设置的最低码率时，停止视频发送 */
    ZegoTrafficControlMinVideoBitrateMode[ZegoTrafficControlMinVideoBitrateMode["NoVideo"] = 0] = "NoVideo";
    /** 低于设置的最低码率时，视频以极低的频率发送（不超过 2 FPS) */
    ZegoTrafficControlMinVideoBitrateMode[ZegoTrafficControlMinVideoBitrateMode["UltraLowFPS"] = 1] = "UltraLowFPS";
})(ZegoTrafficControlMinVideoBitrateMode || (ZegoTrafficControlMinVideoBitrateMode = {}));
/** 拉流状态 */
export var ZegoPlayerState;
(function (ZegoPlayerState) {
    /** 未拉流状态，在拉流前处于该状态。如果拉流过程出现稳态的异常，例如 AppID 或 Token 不正确，都会进入未拉流状态 */
    ZegoPlayerState[ZegoPlayerState["NoPlay"] = 0] = "NoPlay";
    /** 正在请求拉流状态，拉流操作执行成功后会进入正在请求拉流状态，通常通过该状态进行应用界面的展示。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，也会回到正在请求拉流状态 */
    ZegoPlayerState[ZegoPlayerState["PlayRequesting"] = 1] = "PlayRequesting";
    /** 正在拉流状态，进入该状态表明拉流已经成功，用户可以正常通信 */
    ZegoPlayerState[ZegoPlayerState["Playing"] = 2] = "Playing";
})(ZegoPlayerState || (ZegoPlayerState = {}));
/** 拉流媒体事件 */
export var ZegoPlayerMediaEvent;
(function (ZegoPlayerMediaEvent) {
    /** 拉流端出现音频卡顿事件 */
    ZegoPlayerMediaEvent[ZegoPlayerMediaEvent["AudioBreakOccur"] = 0] = "AudioBreakOccur";
    /** 拉流端音频卡顿事件结束 */
    ZegoPlayerMediaEvent[ZegoPlayerMediaEvent["AudioBreakResume"] = 1] = "AudioBreakResume";
    /** 拉流端出现视频卡顿事件 */
    ZegoPlayerMediaEvent[ZegoPlayerMediaEvent["VideoBreakOccur"] = 2] = "VideoBreakOccur";
    /** 拉流端视频卡顿事件结束 */
    ZegoPlayerMediaEvent[ZegoPlayerMediaEvent["VideoBreakResume"] = 3] = "VideoBreakResume";
})(ZegoPlayerMediaEvent || (ZegoPlayerMediaEvent = {}));
/** 拉流资源策略模式 */
export var ZegoStreamResourceMode;
(function (ZegoStreamResourceMode) {
    /** 默认模式。SDK 会根据拉流设置的 cdnConfig 参数以及即构的后台配置自动选择拉流资源 */
    ZegoStreamResourceMode[ZegoStreamResourceMode["Default"] = 0] = "Default";
    /** 仅从 CDN 拉流 */
    ZegoStreamResourceMode[ZegoStreamResourceMode["OnlyCDN"] = 1] = "OnlyCDN";
    /** 仅从 L3 拉流 */
    ZegoStreamResourceMode[ZegoStreamResourceMode["OnlyL3"] = 2] = "OnlyL3";
    /** 仅从 RTC 拉流 */
    ZegoStreamResourceMode[ZegoStreamResourceMode["OnlyRTC"] = 3] = "OnlyRTC";
    /** CDN Plus 拉流。SDK 会根据网络状况自动切换拉流资源 */
    ZegoStreamResourceMode[ZegoStreamResourceMode["CDNPlus"] = 4] = "CDNPlus";
})(ZegoStreamResourceMode || (ZegoStreamResourceMode = {}));
/** 拉流资源切换策略模式 */
export var ZegoStreamResourceSwitchMode;
(function (ZegoStreamResourceSwitchMode) {
    /** 默认模式。SDK 会根据拉流设置的参数以及即构的后台配置自动选择拉流资源 */
    ZegoStreamResourceSwitchMode[ZegoStreamResourceSwitchMode["Default"] = 0] = "Default";
    /** 在连麦时自动切换到 RTC 源 */
    ZegoStreamResourceSwitchMode[ZegoStreamResourceSwitchMode["SwitchToRTC"] = 1] = "SwitchToRTC";
    /** 在连麦时保持现有的拉流源，不切换到 RTC 源 */
    ZegoStreamResourceSwitchMode[ZegoStreamResourceSwitchMode["KeepOriginal"] = 2] = "KeepOriginal";
})(ZegoStreamResourceSwitchMode || (ZegoStreamResourceSwitchMode = {}));
/** 拉流资源类型 */
export var ZegoStreamResourceType;
(function (ZegoStreamResourceType) {
    /** 默认模式。SDK 会根据拉流设置的参数以及即构的后台配置自动选择拉流资源 */
    ZegoStreamResourceType[ZegoStreamResourceType["Default"] = 0] = "Default";
    /** CDN 源 */
    ZegoStreamResourceType[ZegoStreamResourceType["CDN"] = 1] = "CDN";
    /** L3 源 */
    ZegoStreamResourceType[ZegoStreamResourceType["L3"] = 2] = "L3";
})(ZegoStreamResourceType || (ZegoStreamResourceType = {}));
/** 更新类型 */
export var ZegoUpdateType;
(function (ZegoUpdateType) {
    /** 添加 */
    ZegoUpdateType[ZegoUpdateType["Add"] = 0] = "Add";
    /** 删除 */
    ZegoUpdateType[ZegoUpdateType["Delete"] = 1] = "Delete";
})(ZegoUpdateType || (ZegoUpdateType = {}));
/** 转推 CDN 状态 */
export var ZegoStreamRelayCDNState;
(function (ZegoStreamRelayCDNState) {
    /** 未转推状态，在转推前处于该状态。如果转推过程出现稳态的异常，例如 转推地址 不正确，都会进入未转推状态 */
    ZegoStreamRelayCDNState[ZegoStreamRelayCDNState["NoRelay"] = 0] = "NoRelay";
    /** 正在请求转推状态，转推操作执行成功后会进入正在请求转推状态，通常通过该状态进行应用界面的展示。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，也会回到正在转推状态 */
    ZegoStreamRelayCDNState[ZegoStreamRelayCDNState["RelayRequesting"] = 1] = "RelayRequesting";
    /** 正在转推状态，进入该状态表明转推已成功 */
    ZegoStreamRelayCDNState[ZegoStreamRelayCDNState["Relaying"] = 2] = "Relaying";
})(ZegoStreamRelayCDNState || (ZegoStreamRelayCDNState = {}));
/** 转发 CDN 状态改变原因 */
export var ZegoStreamRelayCDNUpdateReason;
(function (ZegoStreamRelayCDNUpdateReason) {
    /** 无 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["None"] = 0] = "None";
    /** 服务器错误 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["ServerError"] = 1] = "ServerError";
    /** 握手失败 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["HandshakeFailed"] = 2] = "HandshakeFailed";
    /** 接入点错误 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["AccessPointError"] = 3] = "AccessPointError";
    /** 创建流失败 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["CreateStreamFailed"] = 4] = "CreateStreamFailed";
    /** 流 ID 不合法 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["BadName"] = 5] = "BadName";
    /** CDN 服务器主动断开 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["CDNServerDisconnected"] = 6] = "CDNServerDisconnected";
    /** 主动断开 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["Disconnected"] = 7] = "Disconnected";
    /** 混流的全部输入流会话关闭 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["MixStreamAllInputStreamClosed"] = 8] = "MixStreamAllInputStreamClosed";
    /** 混流的全部输入流没有数据 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["MixStreamAllInputStreamNoData"] = 9] = "MixStreamAllInputStreamNoData";
    /** 混流服务器内部错误 */
    ZegoStreamRelayCDNUpdateReason[ZegoStreamRelayCDNUpdateReason["MixStreamServerInternalError"] = 10] = "MixStreamServerInternalError";
})(ZegoStreamRelayCDNUpdateReason || (ZegoStreamRelayCDNUpdateReason = {}));
/** 设备类型。 */
export var ZegoDeviceType;
(function (ZegoDeviceType) {
    /** 未知的设备类型。 */
    ZegoDeviceType[ZegoDeviceType["Unknown"] = 0] = "Unknown";
    /** 摄像头设备。 */
    ZegoDeviceType[ZegoDeviceType["Camera"] = 1] = "Camera";
    /** 麦克风设备。 */
    ZegoDeviceType[ZegoDeviceType["Microphone"] = 2] = "Microphone";
    /** 扬声器设备。 */
    ZegoDeviceType[ZegoDeviceType["Speaker"] = 3] = "Speaker";
    /** 音频设备。（无法精确分类到麦克风或者扬声器的其他音频设备。） */
    ZegoDeviceType[ZegoDeviceType["AudioDevice"] = 4] = "AudioDevice";
    /** 音频会话。 */
    ZegoDeviceType[ZegoDeviceType["AudioSession"] = 5] = "AudioSession";
})(ZegoDeviceType || (ZegoDeviceType = {}));
/** 设备异常类型。 */
export var ZegoDeviceExceptionType;
(function (ZegoDeviceExceptionType) {
    /** 未知的设备异常。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["Unknown"] = 0] = "Unknown";
    /** 一般性设备异常。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["Generic"] = 1] = "Generic";
    /** 无效设备 ID 异常。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["InvalidId"] = 2] = "InvalidId";
    /** 没有设备权限。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["PermissionNotGranted"] = 3] = "PermissionNotGranted";
    /** 设备的采集帧率为 0。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["ZeroCaptureFps"] = 4] = "ZeroCaptureFps";
    /** 设备被占用。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["DeviceOccupied"] = 5] = "DeviceOccupied";
    /** 设备被拔出（未连接）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["DeviceUnplugged"] = 6] = "DeviceUnplugged";
    /** 设备要求系统重启后才能工作（仅限 Windows 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["RebootRequired"] = 7] = "RebootRequired";
    /** 系统媒体服务不可用，例如当 iOS 系统检测到当前压力巨大（如播放大量动画），则有可能会将媒体相关服务全部停用（仅限 Apple 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["MediaServicesWereLost"] = 8] = "MediaServicesWereLost";
    /** 设备被 Siri 占用（仅限 Apple 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["SiriIsRecording"] = 9] = "SiriIsRecording";
    /** 设备采集的声音过低（仅限 Windows 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["SoundLevelTooLow"] = 10] = "SoundLevelTooLow";
    /** 可能是由 iPad 磁吸保护套引起的设备被占用问题（仅限 Apple 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["MagneticCase"] = 11] = "MagneticCase";
    /** 音频会话停用（仅限 Apple 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["AudioSessionDeactive"] = 12] = "AudioSessionDeactive";
    /** 音频会话分类更改（仅限 Apple 平台）。 */
    ZegoDeviceExceptionType[ZegoDeviceExceptionType["AudioSessionCategoryChange"] = 13] = "AudioSessionCategoryChange";
})(ZegoDeviceExceptionType || (ZegoDeviceExceptionType = {}));
/** 远端设备状态 */
export var ZegoRemoteDeviceState;
(function (ZegoRemoteDeviceState) {
    /** 设备开启 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["Open"] = 0] = "Open";
    /** 设备关闭：一般性设备错误 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["GenericError"] = 1] = "GenericError";
    /** 设备关闭：无效的设备 ID */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["InvalidID"] = 2] = "InvalidID";
    /** 设备关闭：无权限 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["NoAuthorization"] = 3] = "NoAuthorization";
    /** 设备关闭：采集帧率为 0 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["ZeroFPS"] = 4] = "ZeroFPS";
    /** 设备关闭：设备被占用 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["InUseByOther"] = 5] = "InUseByOther";
    /** 设备关闭：设备未插入或被拔出 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["Unplugged"] = 6] = "Unplugged";
    /** 设备关闭：由于系统原因需要重启后才能进行下一次修改，否则重新打开也不生效 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["RebootRequired"] = 7] = "RebootRequired";
    /** 设备关闭：系统媒体服务停止，如 iOS 平台下，当系统检测到当前压力巨大（如播放大量动画），则有可能会将媒体相关服务全部停用 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["SystemMediaServicesLost"] = 8] = "SystemMediaServicesLost";
    /** 设备关闭：远端用户主动调用 [enableCamera] 或者 [enableAudioCaptureDevice] 禁用摄像头或者麦克风 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["Disable"] = 9] = "Disable";
    /** 设备关闭：远端用户主动调用 [muteMicrophone] 或者 [mutePublishStreamAudio] 或者 [mutePublishStreamVideo] 停止发送音频流或者视频流 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["Mute"] = 10] = "Mute";
    /** 设备关闭：设备被中断，如电话事件打断等 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["Interruption"] = 11] = "Interruption";
    /** 设备关闭：用户 App 退到后台 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["InBackground"] = 12] = "InBackground";
    /** 设备关闭：当前前台同时存在多个 App，如 iPad 应用分屏下，系统会禁止所有应用使用摄像头 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["MultiForegroundApp"] = 13] = "MultiForegroundApp";
    /** 设备关闭：系统处于高负载压力下，可能导致设备异常 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["BySystemPressure"] = 14] = "BySystemPressure";
    /** 设备状态未知：远端的 SDK 版本过低，不支持发布该设备状态信息 */
    ZegoRemoteDeviceState[ZegoRemoteDeviceState["NotSupport"] = 15] = "NotSupport";
})(ZegoRemoteDeviceState || (ZegoRemoteDeviceState = {}));
/** 音频路由 */
export var ZegoAudioRoute;
(function (ZegoAudioRoute) {
    /** 扬声器 */
    ZegoAudioRoute[ZegoAudioRoute["Speaker"] = 0] = "Speaker";
    /** 耳机 */
    ZegoAudioRoute[ZegoAudioRoute["Headphone"] = 1] = "Headphone";
    /** 蓝牙设备 */
    ZegoAudioRoute[ZegoAudioRoute["Bluetooth"] = 2] = "Bluetooth";
    /** 听筒 */
    ZegoAudioRoute[ZegoAudioRoute["Receiver"] = 3] = "Receiver";
    /** USB 音频外接设备 */
    ZegoAudioRoute[ZegoAudioRoute["ExternalUSB"] = 4] = "ExternalUSB";
    /** Apple 隔空播放 */
    ZegoAudioRoute[ZegoAudioRoute["AirPlay"] = 5] = "AirPlay";
})(ZegoAudioRoute || (ZegoAudioRoute = {}));
/** 混流内容类型 */
export var ZegoMixerInputContentType;
(function (ZegoMixerInputContentType) {
    /** 音频混流内容类型 */
    ZegoMixerInputContentType[ZegoMixerInputContentType["Audio"] = 0] = "Audio";
    /** 视频混流内容类型 */
    ZegoMixerInputContentType[ZegoMixerInputContentType["Video"] = 1] = "Video";
    /** 仅视频混流内容类型。在 web 平台，此属性不生效。 */
    ZegoMixerInputContentType[ZegoMixerInputContentType["VideoOnly"] = 2] = "VideoOnly";
})(ZegoMixerInputContentType || (ZegoMixerInputContentType = {}));
/** 音频配置类型 */
export var ZegoAudioConfigPreset;
(function (ZegoAudioConfigPreset) {
    /** 基础音质 (16 kbps, Mono, ZegoAudioCodecIDDefault) */
    ZegoAudioConfigPreset[ZegoAudioConfigPreset["BasicQuality"] = 0] = "BasicQuality";
    /** 标准音质 (48 kbps, Mono, ZegoAudioCodecIDDefault) */
    ZegoAudioConfigPreset[ZegoAudioConfigPreset["StandardQuality"] = 1] = "StandardQuality";
    /** 标准音质 (56 kbps, Stereo, ZegoAudioCodecIDDefault) */
    ZegoAudioConfigPreset[ZegoAudioConfigPreset["StandardQualityStereo"] = 2] = "StandardQualityStereo";
    /** 高音质 (128 kbps, Mono, ZegoAudioCodecIDDefault) */
    ZegoAudioConfigPreset[ZegoAudioConfigPreset["HighQuality"] = 3] = "HighQuality";
    /** 高音质 (192 kbps, Stereo, ZegoAudioCodecIDDefault) */
    ZegoAudioConfigPreset[ZegoAudioConfigPreset["HighQualityStereo"] = 4] = "HighQualityStereo";
})(ZegoAudioConfigPreset || (ZegoAudioConfigPreset = {}));
/** 播放器状态 */
export var ZegoMediaPlayerState;
(function (ZegoMediaPlayerState) {
    /** 不在播放 */
    ZegoMediaPlayerState[ZegoMediaPlayerState["NoPlay"] = 0] = "NoPlay";
    /** 播放中 */
    ZegoMediaPlayerState[ZegoMediaPlayerState["Playing"] = 1] = "Playing";
    /** 暂停播放 */
    ZegoMediaPlayerState[ZegoMediaPlayerState["Pausing"] = 2] = "Pausing";
    /** 播放结束 */
    ZegoMediaPlayerState[ZegoMediaPlayerState["PlayEnded"] = 3] = "PlayEnded";
})(ZegoMediaPlayerState || (ZegoMediaPlayerState = {}));
/** 播放器网络事件 */
export var ZegoMediaPlayerNetworkEvent;
(function (ZegoMediaPlayerNetworkEvent) {
    /** 网络资源播放不畅，开始尝试缓存数据 */
    ZegoMediaPlayerNetworkEvent[ZegoMediaPlayerNetworkEvent["BufferBegin"] = 0] = "BufferBegin";
    /** 网络资源可以顺畅播放 */
    ZegoMediaPlayerNetworkEvent[ZegoMediaPlayerNetworkEvent["BufferEnded"] = 1] = "BufferEnded";
})(ZegoMediaPlayerNetworkEvent || (ZegoMediaPlayerNetworkEvent = {}));
/** 播放器声道 */
export var ZegoMediaPlayerAudioChannel;
(function (ZegoMediaPlayerAudioChannel) {
    /** 左声道 */
    ZegoMediaPlayerAudioChannel[ZegoMediaPlayerAudioChannel["Left"] = 0] = "Left";
    /** 右声道 */
    ZegoMediaPlayerAudioChannel[ZegoMediaPlayerAudioChannel["Right"] = 1] = "Right";
    /** 全部声道 */
    ZegoMediaPlayerAudioChannel[ZegoMediaPlayerAudioChannel["All"] = 2] = "All";
})(ZegoMediaPlayerAudioChannel || (ZegoMediaPlayerAudioChannel = {}));
/** 录制类型 */
export var ZegoDataRecordType;
(function (ZegoDataRecordType) {
    /** 该字段表示纯音频 SDK 默认录制音频，音视频 SDK 默认录制音视频，当录制 .aac 格式的文件时默认也是录制音频 */
    ZegoDataRecordType[ZegoDataRecordType["Default"] = 0] = "Default";
    /** 只录制音频 */
    ZegoDataRecordType[ZegoDataRecordType["OnlyAudio"] = 1] = "OnlyAudio";
    /** 只录制视频，音频的 SDK 和录制 .aac 格式文件时无效 */
    ZegoDataRecordType[ZegoDataRecordType["OnlyVideo"] = 2] = "OnlyVideo";
    /** 同时录制音频、视频。音频的 SDK 和录制 .aac 格式文件时录制出来也只有音频 */
    ZegoDataRecordType[ZegoDataRecordType["AudioAndVideo"] = 3] = "AudioAndVideo";
})(ZegoDataRecordType || (ZegoDataRecordType = {}));
/** 录制状态 */
export var ZegoDataRecordState;
(function (ZegoDataRecordState) {
    /** 未录制状态，当录制出错或者未开始录制之前处于此状态 */
    ZegoDataRecordState[ZegoDataRecordState["NoRecord"] = 0] = "NoRecord";
    /** 正在录制中，当成功调用 [startRecordingCapturedData] 函数之后处于此状态 */
    ZegoDataRecordState[ZegoDataRecordState["Recording"] = 1] = "Recording";
    /** 录制成功 */
    ZegoDataRecordState[ZegoDataRecordState["Success"] = 2] = "Success";
})(ZegoDataRecordState || (ZegoDataRecordState = {}));
/** 多媒体资源加载方式。 */
export var ZegoMultimediaLoadType;
(function (ZegoMultimediaLoadType) {
    /** 通过文件路径加载。 */
    ZegoMultimediaLoadType[ZegoMultimediaLoadType["FilePath"] = 0] = "FilePath";
    /** 通过二进制内存数据加载。 */
    ZegoMultimediaLoadType[ZegoMultimediaLoadType["Memory"] = 1] = "Memory";
    /** 通过版权音乐资源 ID 加载。 */
    ZegoMultimediaLoadType[ZegoMultimediaLoadType["ResourceID"] = 2] = "ResourceID";
})(ZegoMultimediaLoadType || (ZegoMultimediaLoadType = {}));
/** 透明通道数据布局方式。 */
export var ZegoAlphaLayoutType;
(function (ZegoAlphaLayoutType) {
    /** 没有 alpha 数据。 */
    ZegoAlphaLayoutType[ZegoAlphaLayoutType["None"] = 0] = "None";
    /** 透明通道数据位于 RGB/YUV 数据左侧。 */
    ZegoAlphaLayoutType[ZegoAlphaLayoutType["Left"] = 1] = "Left";
    /** 透明通道数据位于 RGB/YUV 数据右侧。 */
    ZegoAlphaLayoutType[ZegoAlphaLayoutType["Right"] = 2] = "Right";
    /** 透明通道数据位于 RGB/YUV 数据底部。 */
    ZegoAlphaLayoutType[ZegoAlphaLayoutType["Bottom"] = 3] = "Bottom";
})(ZegoAlphaLayoutType || (ZegoAlphaLayoutType = {}));
/**
 * 日志配置
 *
 * 详情描述：调用 [setLogConfig] 自定义日志配置时，需要通过该参数配置。
 * 业务场景：当需要自定义日志存储路径或日志文件大小上限时，需要这个配置。
 * 注意事项：无。
 */
export class ZegoLogConfig {
    constructor() {
        this.logPath = '';
        this.logSize = 5 * 1024 * 1024;
        this.logCount = 3;
    }
}
/**
 * 创建引擎的配置
 *
 * 创建引擎的配置
 */
export class ZegoEngineProfile {
    constructor(appID, appSign, scenario) {
        this.appID = appID;
        this.appSign = appSign;
        this.scenario = scenario;
    }
}
/**
 * 引擎进阶配置
 */
export class ZegoEngineConfig {
}
/**
 * 房间进阶配置
 *
 * 配置房间的最大用户数量、鉴权 token 等
 */
export class ZegoRoomConfig {
    constructor(maxMemberCount, isUserStatusNotify, token) {
        this.maxMemberCount = maxMemberCount;
        this.isUserStatusNotify = isUserStatusNotify;
        this.token = token;
    }
}
/**
 * 视频配置
 *
 * 配置码率、帧率、分辨率等推流用到的参数。
 * 开发者应该注意的是，移动端与桌面端的宽高分辨率是相反的，例如，360p，移动端的分辨率为 360x640，而桌面端为 640x360。
 * 使用外部采集时，RTC的采集和编码分辨率不能设置为0*0，不然会导致整个引擎生命周期里的推流，都没有视频数据。
 */
export class ZegoVideoConfig {
    constructor(captureWidth, captureHeight, encodeWidth, encodeHeight, fps, bitrate, codecID) {
        this.captureWidth = captureWidth;
        this.captureHeight = captureHeight;
        this.encodeWidth = encodeWidth;
        this.encodeHeight = encodeHeight;
        this.fps = fps;
        this.bitrate = bitrate;
        this.codecID = codecID;
    }
}
/**
 * 变声器参数
 *
 * 开发者可以使用 SDK 的内置预置来改变变声器的参数。
 */
export class ZegoVoiceChangerParam {
    constructor(pitch) {
        this.pitch = pitch;
    }
}
/**
 * 用户对象
 *
 * 配置用户 ID 和用户名，用于标识房间内的用户。
 * 注意 userID 在同一个 appID 下需唯一，否则登录房间时会出现互踢的情况。
 * 强烈建议 userID 与业务 APP 的用户 ID 一一对应，即一个 userID 与一个真实用户是固定且唯一的，而不应该是以随机的 userID 的方式传给 SDK 的方式。因为唯一且固定的 userID 可以让 ZEGO 技术人员快速定位线上问题。
 */
export class ZegoUser {
    constructor(userID, userName) {
        this.userID = userID;
        this.userName = userName;
    }
}
/**
 * 视图相关所使用的坐标
 */
export class ZegoRect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/**
 * 推流进阶配置
 *
 * 配置房间 ID
 */
export class ZegoPublisherConfig {
}
/**
 * CDN 配置对象
 *
 * 包括 CDN 的 URL 以及鉴权参数字符串
 */
export class ZegoCDNConfig {
    constructor(url, authParam) {
        this.url = url;
        this.authParam = authParam;
    }
}
/**
 * 拉流进阶配置。
 *
 * 配置资源策略模式、CDN 配置以及其他高级配置。
 */
export class ZegoPlayerConfig {
    constructor(cdnConfig) {
        this.cdnConfig = cdnConfig;
    }
}
/**
 * 美颜配置参数
 *
 * 配置美颜的美白、红润、磨皮、锐化参数。
 */
export class ZegoEffectsBeautyParam {
    constructor() {
        this.whitenIntensity = 50;
        this.rosyIntensity = 50;
        this.smoothIntensity = 50;
        this.sharpenIntensity = 50;
    }
}
/**
 * 混流音频配置
 *
 * 配置混流任务的音频码率、声道数、音频编码
 */
export class ZegoMixerAudioConfig {
    constructor() {
        this.bitrate = 48;
        this.channel = ZegoAudioChannel.Mono;
        this.codecID = ZegoAudioCodecID.Default;
        this.mixMode = ZegoAudioMixMode.Raw;
    }
}
/**
 * 混流视频配置
 *
 * 配置混流任务的视频参数，帧率、码率、分辨率
 */
export class ZegoMixerVideoConfig {
    constructor() {
        this.width = 360;
        this.height = 640;
        this.fps = 15;
        this.bitrate = 600;
    }
}
/**
 * 混流输入
 *
 * 配置混流输入的流 ID、输入类型、流的布局
 */
export class ZegoMixerInput {
    constructor(streamID, contentType, layout, soundLevelID) {
        this.streamID = streamID;
        this.contentType = contentType;
        this.layout = layout;
        this.soundLevelID = soundLevelID;
    }
}
/**
 * 混流输出对象，目前一个混流任务最多只支持 4 路不同分辨率的视频流。
 *
 * 配置混流输出的目标 URL 或流 ID
 */
export class ZegoMixerOutput {
    constructor(target) {
        this.target = target;
    }
}
/**
 * 水印对象
 *
 * 配置一个水印的图片 URL 以及该水印在画面中的大小方位。
 */
export class ZegoWatermark {
    constructor(imageURL, layout) {
        this.imageURL = imageURL;
        this.layout = layout;
    }
}
/**
 * 混流任务对象
 *
 * 本类为混流任务的配置类，当向 ZEGO RTC 服务器发起混流任务的请求时，需要这个混流任务的配置。
 * 本类即描述这次混流任务的详细配置信息。
 */
export class ZegoMixerTask {
    constructor(taskID) {
        this.taskID = taskID;
        this.inputList = [];
        this.outputList = [];
        this.audioConfig = new ZegoMixerAudioConfig();
        this.videoConfig = new ZegoMixerVideoConfig();
        this.enableSoundLevel = false;
        this.backgroundImageURL = "";
        this.watermark = new ZegoWatermark("", new ZegoRect(0, 0, 0, 0));
        this.advancedConfig = new Map();
    }
}
/**
 * 启动声浪监控的配置
 *
 * 支持版本：2.10.0 及以上。
 * 详情描述：用于 startSoundLevelMonitor 函数，其中的 enableVAD 参数用于设置声浪回调是否检测 VAD，开启后结果将从 [onCapturedSoundLevelInfoUpdate] 和 [onRemoteSoundLevelInfoUpdate] 回调中体现。
 * 业务场景：开发者需要判断用户说话音量是否太小时，可开启 VAD 声音检测。
 * 注意事项：VAD 算法有性能开销，建议按需设置。
 */
export class ZegoSoundLevelConfig {
    constructor(millisecond, enableVAD) {
        this.millisecond = millisecond;
        this.enableVAD = enableVAD;
    }
}
/**
 * 自动混流任务对象
 *
 * 详情描述：调用 [StartAutoMixerTask] 函数向 ZEGO RTC 服务器发起自动混流任务时，需要通过该参数配置自动混流任务，包括任务 ID、房间 ID、音频配置、输出流列表、是否开启声浪回调通知。
 * 业务场景：当向 ZEGO RTC 服务器发起自动混流任务时，需要这个配置。
 * 注意事项：作为调用 [StartAutoMixerTask] 函数时传入的参数。
 */
export class ZegoAutoMixerTask {
    /**
     * 构造一个自动混流任务对象
     */
    constructor() {
        this.taskID = "";
        this.roomID = "";
        this.outputList = [];
        this.audioConfig = new ZegoMixerAudioConfig();
        this.enableSoundLevel = false;
    }
}
/**
 * 推流音频配置
 *
 * 配置推流的音频码率、声道数、音频编码
 */
export class ZegoAudioConfig {
    constructor(bitrate, channel, codecID) {
        this.bitrate = bitrate;
        this.channel = channel;
        this.codecID = codecID;
    }
}
/**
 * 录制配置
 */
export class ZegoDataRecordConfig {
    constructor(filePath, recordType) {
        this.filePath = filePath;
        this.recordType = recordType;
    }
}
/**
 * 文件录制进度
 */
export class ZegoDataRecordProgress {
    constructor(duration, currentFileSize, quality) {
        this.duration = duration;
        this.currentFileSize = currentFileSize;
        this.quality = quality;
    }
}
/**
 * 精准seek的配置
 */
export class ZegoAccurateSeekConfig {
    constructor() {
        this.timeout = 5000;
    }
}
/**
 * 媒体播放器网络缓存信息
 */
export class ZegoNetWorkResourceCache {
    constructor(time, size) {
        this.time = time;
        this.size = size;
    }
}
/**
 * 用于指定播放器的多媒体资源。
 *
 * 用于在加载多媒体资源时，配置加载参数。
 */
export class ZegoMediaPlayerResource {
    constructor() {
        this.loadType = ZegoMultimediaLoadType.FilePath;
        this.startPosition = 0;
        this.alphaLayout = ZegoAlphaLayoutType.None;
        this.filePath = "";
        this.memory = undefined;
        this.resourceID = "";
    }
}
export class ZegoMediaPlayer {
}
