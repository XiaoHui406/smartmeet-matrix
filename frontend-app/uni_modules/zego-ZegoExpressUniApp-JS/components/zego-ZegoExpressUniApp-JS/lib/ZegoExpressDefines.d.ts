import { ZegoMediaPlayerListener } from "./ZegoExpressEventHandler";
/** 房间场景 */
export declare enum ZegoScenario {
    /** 【已废弃】旧版通用场景，此场景在 3.0.0 版本及以上已废弃，不建议使用，请尽快迁移到新版场景。 */
    General = 0,
    /** 【已废弃】旧版实时通讯场景，此场景在 3.0.0 版本及以上已废弃，不建议使用，请尽快迁移到新版场景。 */
    Communication = 1,
    /** 【已废弃】旧版直播场景，此场景在 3.0.0 版本及以上已废弃，不建议使用，请尽快迁移到新版场景。 */
    Live = 2,
    /** 支持版本：3.0.0 及以上。详情描述：默认（通用）场景，若下列场景枚举均不符合开发者的实际应用场景，可使用此默认场景。 */
    Default = 3,
    /** 支持版本：3.0.0 及以上。详情描述：标准音视频通话场景，适用于 1v1 视频通话场景。 */
    StandardVideoCall = 4,
    /** 支持版本：3.0.0 及以上。详情描述：高品质音视频通话场景，与标准音视频通话场景类似，但该场景默认采用了更高的视频帧率、码率、分辨率 (540p)，适用于对画质要求较高的视频通话场景。 */
    HighQualityVideoCall = 5,
    /** 支持版本：3.0.0 及以上。详情描述：标准语聊房场景，适用于多人纯语音通话（节省流量）。注意：在实时音视频 (ExpressVideo) SDK 上，此场景默认不开启摄像头。 */
    StandardChatroom = 6,
    /** 支持版本：3.0.0 及以上。详情描述：高品质语聊房场景，与标准语聊房场景类似，但此场景默认采用了更高的音频码率。适用于对音质要求较高的多人纯语音通话场景。注意：在实时音视频 (ExpressVideo) SDK 上，此场景默认不开启摄像头。 */
    HighQualityChatroom = 7,
    /** 支持版本：3.0.0 及以上。详情描述：直播场景，适用于秀场、游戏、电商、教育大班课等一对多直播的场景，对音画质量、流畅度、兼容性进行了优化。注意：即便是直播场景，SDK 也没有业务上的 “角色” 之分（例如主播、观众），房间内的所有用户均可推拉流。 */
    Broadcast = 8,
    /** 支持版本：3.0.0 及以上。详情描述：卡拉 OK (KTV) 场景，适用于实时合唱、在线 K 歌场景，对延迟、音质、耳返、回声消除等做了优化，同时还保障了多人合唱时精准对齐和超低时延。 */
    Karaoke = 9,
    /** 支持版本：3.3.0 及以上。详情描述：标准语音通话场景，适用于 1v1 纯语音通话场景。注意：在实时音视频 (ExpressVideo) SDK 上，此场景默认不开启摄像头。 */
    StandardVoiceCall = 10
}
/** 房间模式。 */
export declare enum ZegoRoomMode {
    /** 单房间模式。 */
    SingleRoom = 0,
    /** 多房间模式。 */
    MultiRoom = 1
}
/** 引擎状态 */
export declare enum ZegoEngineState {
    /** 引擎已开启 */
    Start = 0,
    /** 引擎已停止 */
    Stop = 1
}
/** 房间状态 */
export declare enum ZegoRoomState {
    /** 未连接状态，在登录房间前和退出房间之后进入该状态。如果登录房间的过程出现稳态异常，例如 AppID 或 Token 不正确，或者有相同用户名在其他地方登录导致本端被 KickOut，都会进入该状态 */
    Disconnected = 0,
    /** 正在请求连接状态，登录房间动作执行成功后会进入此状态。通常通过该状态进行应用界面的展示。如果因为网络质量不佳产生的中断， SDK 会进行内部重试，也会回到正在请求连接状态 */
    Connecting = 1,
    /** 连接成功状态，进入该状态表示登录房间已经成功，用户可以正常收到房间内的用户和流信息增删的回调通知 */
    Connected = 2
}
/** 房间状态变化原因。 */
export declare enum ZegoRoomStateChangedReason {
    /** 正在登录房间。当调用 [loginRoom] 登录房间或 [switchRoom] 切换到目标房间时，进入该状态，表示正在请求连接服务器。通常通过该状态进行应用界面的展示。 */
    Logining = 0,
    /** 登录房间成功。当登录房间或切换房间成功后，进入该状态，表示登录房间已经成功，用户可以正常收到房间内的其他用户和所有流信息增删的回调通知。 */
    Logined = 1,
    /** 登录房间失败。当登录房间或切换房间失败后，进入该状态，表示登录房间或切换房间已经失败，例如 AppID 或 Token 不正确等。 */
    LoginFailed = 2,
    /** 房间连接临时中断。如果因为网络质量不佳产生的中断，SDK 会进行内部重试。 */
    Reconnecting = 3,
    /** 房间重新连接成功。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，重连成功后进入该状态。 */
    Reconnected = 4,
    /** 房间重新连接失败。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，重连失败后进入该状态。 */
    ReconnectFailed = 5,
    /** 被服务器踢出房间。例如有相同用户名在其他地方登录房间导致本端被踢出房间，会进入该状态。 */
    KickOut = 6,
    /** 登出房间成功。没有登录房间前默认为该状态，当调用 [logoutRoom] 登出房间成功或 [switchRoom] 内部登出当前房间成功后，进入该状态。 */
    Logout = 7,
    /** 登出房间失败。当调用 [logoutRoom] 登出房间失败或 [switchRoom] 内部登出当前房间失败后，进入该状态。 */
    LogoutFailed = 8
}
/** 推流通道 */
export declare enum ZegoPublishChannel {
    /** 主推流通道，默认通道 */
    Main = 0,
    /** 辅推流通道（第二路推流通道） */
    Aux = 1,
    /** 第三路推流通道 */
    Third = 2,
    /** 第四路推流通道 */
    Fourth = 3
}
/** 视频渲染填充模式 */
export declare enum ZegoViewMode {
    /** 等比缩放，可能有黑边 */
    AspectFit = 0,
    /** 等比缩放填充整个 View，可能有部分被裁减 */
    AspectFill = 1,
    /** 填充整个 View，图像可能被拉伸 */
    ScaleToFill = 2
}
/** 预览或拉流端的镜像模式。 */
export declare enum ZegoVideoMirrorMode {
    /** 只有本地预览时才是镜像画面，默认采用此模式。当移动端使用后置摄像头时，虽然仍默认采用此模式，但是不起作用，本地预览不设置镜像。 */
    OnlyPreviewMirror = 0,
    /** 本地预览和拉流端看到的视频都是镜像画面。 */
    BothMirror = 1,
    /** 本地预览和拉流端看到的视频都不是镜像画面。 */
    NoMirror = 2,
    /** 只有拉流端看到的视频才是镜像画面。 */
    OnlyPublishMirror = 3
}
/** 推流状态 */
export declare enum ZegoPublisherState {
    /** 未推流状态，在推流前处于该状态。如果推流过程出现稳态的异常，例如 AppID 或 Token 不正确，或者如果其他用户已经在推送流，推送相同流 ID 的流会失败，都会进入未推流状态 */
    NoPublish = 0,
    /** 正在请求推流状态，推流操作执行成功后会进入正在请求推流状态，通常通过该状态进行 UI 界面的展示。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，也会回到正在请求推流状态 */
    PublishRequesting = 1,
    /** 正在推流状态，进入该状态表明推流已经成功，用户可以正常通信 */
    Publishing = 2
}
/** 视频配置分辨率与比特率预设枚举。预设的分辨率分别针对移动端与桌面端做了适配。在移动端上 height 长于 width，而桌面端相反。例如 1080p 在移动端上实际为 1080(w) x 1920(h)，而在桌面端上实际为 1920(w) x 1080(h) */
export declare enum ZegoVideoConfigPreset {
    /** 设置分辨率为 320x180，默认采用 15 fps，码率 300 kbps */
    Preset180P = 0,
    /** 设置分辨率为 480x270，默认采用 15 fps，码率 400 kbps */
    Preset270P = 1,
    /** 设置分辨率为 640x360，默认采用 15 fps，码率 600 kbps */
    Preset360P = 2,
    /** 设置分辨率为 960x540，默认采用 15 fps，码率 1200 kbps */
    Preset540P = 3,
    /** 设置分辨率为 1280x720，默认采用 15 fps，码率 1500 kbps */
    Preset720P = 4,
    /** 设置分辨率为 1920x1080，默认采用 15 fps，码率 3000 kbps */
    Preset1080P = 5
}
/** 流质量等级 */
export declare enum ZegoStreamQualityLevel {
    /** 质量极好 */
    Excellent = 0,
    /** 质量好 */
    Good = 1,
    /** 质量正常 */
    Medium = 2,
    /** 质量差 */
    Bad = 3,
    /** 质量异常 */
    Die = 4,
    /** 质量未知 */
    Unknown = 5
}
/** 音频声道 */
export declare enum ZegoAudioChannel {
    /** 未知 */
    Unknown = 0,
    /** 单声道 */
    Mono = 1,
    /** 双声道 */
    Stereo = 2
}
/** 音频混音模式 */
export declare enum ZegoAudioMixMode {
    /** 默认模式，无特殊行为 */
    Raw = 0,
    /** 音频聚焦模式，可在多路音频流中突出某路流的声音 */
    Focused = 1
}
/** 音频编码器 ID */
export declare enum ZegoAudioCodecID {
    /** 默认值，根据调用 [createEngine] 时的 [scenario] 决定。 */
    Default = 0,
    /** 可用于 RTC 和 CDN 推流；码率范围 10kbps ~ 128kbps；支持双声道；延迟在 500ms 左右。与 Web SDK 互通时需要服务端转码；转推 CDN 时不需要服务端云转码。 */
    Normal = 1,
    /** 可用于 RTC 和 CDN 推流；兼容性好，码率范围 16kbps ~ 192kbps；支持双声道；延迟 350ms 左右；相同码率下（较低码率），音质弱于 [Normal]。与 Web SDK 互通时需要服务端转码；转推 CDN 时不需要服务端云转码。 */
    Normal2 = 2,
    /** 不推荐使用；若需要使用请先咨询 ZEGO 技术支持。仅可用于 RTC 推流。 */
    Normal3 = 3,
    /** 不推荐使用；若需要使用请先咨询 ZEGO 技术支持。仅可用于 RTC 推流。 */
    Low = 4,
    /** 不推荐使用；若需要使用请先咨询 ZEGO 技术支持。仅可用于 RTC 推流；最大码率为 16kbps。 */
    Low2 = 5,
    /** 仅可用于 RTC 推流；码率范围 6kbps ~ 192kbps；支持双声道；延迟在 200ms 左右；相同码率下（较低码率），音质明显好于 [Normal] 与 [Normal2]；CPU 开销较低。与 Web SDK 互通时不需要服务端云转码；转推 CDN 时需要服务端转码。 */
    Low3 = 6
}
/** 视频编码格式 */
export declare enum ZegoVideoCodecID {
    /** 默认编码 (H.264) */
    Default = 0,
    /** 分层编码 (H.264 SVC) */
    SVC = 1,
    /** VP8 */
    VP8 = 2,
    /** H.265 */
    H265 = 3,
    /** 视频大小流编码 */
    H264DualStream = 4,
    /** 未知编码类型 */
    Unknown = 100
}
/** 视频画面旋转方向枚举 */
export declare enum ZegoOrientation {
    /** 不旋转 */
    PortraitUp = 0,
    /** 逆时针旋转 90 度 */
    LandscapeLeft = 1,
    /** 逆时针旋转 180 度 */
    PortraitDown = 2,
    /** 逆时针旋转 270 度 */
    LandscapeRight = 3
}
/** 视频流类型 */
export declare enum ZegoVideoStreamType {
    /** 根据网络状态自动选择流类型 */
    Default = 0,
    /** 小分辨率类型 */
    Small = 1,
    /** 大分辨率类型 */
    Big = 2
}
/** 回声消除模式。 */
export declare enum ZegoAECMode {
    /** 激进的回声抵消，可能会影响音质稍微明显，但是回声会消除得很干净。 */
    Aggressive = 0,
    /** 适度的回声抵消，就是可能会稍微影响一点点音质，但是残留的回声会更少。 */
    Medium = 1,
    /** 舒适的回声抵消，就是回声抵消基本不会影响声音的音质，可能有时会残留一点回声，但不会影响正常听音。 */
    Soft = 2
}
/** 噪声抑制模式 */
export declare enum ZegoANSMode {
    /** 轻度的噪声抑制，基本不会损伤音质，但会残留一些噪声。 */
    Soft = 0,
    /** 适度的噪声抑制，有可能损伤一些音质，但有不错的降噪效果。 */
    Medium = 1,
    /** 激进的噪声抑制，有可能明显损伤音质，但有很好的降噪效果。 */
    Aggressive = 2,
    /** AI 模式噪声抑制，会对音乐有较大损伤，故不能用于对需要采集背景音的音源进行噪声抑制。如需使用，请联系技术支持。 */
    AI = 3,
    /** 均衡 AI 模式噪声抑制，会对音乐有较大损伤，故不能用于对需要采集背景音的音源进行噪声抑制。如需使用，请联系技术支持。 */
    AIBalanced = 4
}
/** 当发生流量控制时可供调节的属性（位掩码枚举） */
export declare enum ZegoTrafficControlProperty {
    /** 基础属性（自适应（降低）视频码率） */
    Basic = 0,
    /** 自适应（降低）视频帧率 */
    AdaptiveFPS = 1,
    /** 自适应（降低）视频分辨率 */
    AdaptiveResolution = 2,
    /** 自适应（降低）音频码率 */
    AdaptiveAudioBitrate = 4
}
/** 流控触发最低码率时的视频发送模式 */
export declare enum ZegoTrafficControlMinVideoBitrateMode {
    /** 低于设置的最低码率时，停止视频发送 */
    NoVideo = 0,
    /** 低于设置的最低码率时，视频以极低的频率发送（不超过 2 FPS) */
    UltraLowFPS = 1
}
/** 拉流状态 */
export declare enum ZegoPlayerState {
    /** 未拉流状态，在拉流前处于该状态。如果拉流过程出现稳态的异常，例如 AppID 或 Token 不正确，都会进入未拉流状态 */
    NoPlay = 0,
    /** 正在请求拉流状态，拉流操作执行成功后会进入正在请求拉流状态，通常通过该状态进行应用界面的展示。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，也会回到正在请求拉流状态 */
    PlayRequesting = 1,
    /** 正在拉流状态，进入该状态表明拉流已经成功，用户可以正常通信 */
    Playing = 2
}
/** 拉流媒体事件 */
export declare enum ZegoPlayerMediaEvent {
    /** 拉流端出现音频卡顿事件 */
    AudioBreakOccur = 0,
    /** 拉流端音频卡顿事件结束 */
    AudioBreakResume = 1,
    /** 拉流端出现视频卡顿事件 */
    VideoBreakOccur = 2,
    /** 拉流端视频卡顿事件结束 */
    VideoBreakResume = 3
}
/** 拉流资源策略模式 */
export declare enum ZegoStreamResourceMode {
    /** 默认模式。SDK 会根据拉流设置的 cdnConfig 参数以及即构的后台配置自动选择拉流资源 */
    Default = 0,
    /** 仅从 CDN 拉流 */
    OnlyCDN = 1,
    /** 仅从 L3 拉流 */
    OnlyL3 = 2,
    /** 仅从 RTC 拉流 */
    OnlyRTC = 3,
    /** CDN Plus 拉流。SDK 会根据网络状况自动切换拉流资源 */
    CDNPlus = 4
}
/** 拉流资源切换策略模式 */
export declare enum ZegoStreamResourceSwitchMode {
    /** 默认模式。SDK 会根据拉流设置的参数以及即构的后台配置自动选择拉流资源 */
    Default = 0,
    /** 在连麦时自动切换到 RTC 源 */
    SwitchToRTC = 1,
    /** 在连麦时保持现有的拉流源，不切换到 RTC 源 */
    KeepOriginal = 2
}
/** 拉流资源类型 */
export declare enum ZegoStreamResourceType {
    /** 默认模式。SDK 会根据拉流设置的参数以及即构的后台配置自动选择拉流资源 */
    Default = 0,
    /** CDN 源 */
    CDN = 1,
    /** L3 源 */
    L3 = 2
}
/** 更新类型 */
export declare enum ZegoUpdateType {
    /** 添加 */
    Add = 0,
    /** 删除 */
    Delete = 1
}
/** 转推 CDN 状态 */
export declare enum ZegoStreamRelayCDNState {
    /** 未转推状态，在转推前处于该状态。如果转推过程出现稳态的异常，例如 转推地址 不正确，都会进入未转推状态 */
    NoRelay = 0,
    /** 正在请求转推状态，转推操作执行成功后会进入正在请求转推状态，通常通过该状态进行应用界面的展示。如果因为网络质量不佳产生的中断，SDK 会进行内部重试，也会回到正在转推状态 */
    RelayRequesting = 1,
    /** 正在转推状态，进入该状态表明转推已成功 */
    Relaying = 2
}
/** 转发 CDN 状态改变原因 */
export declare enum ZegoStreamRelayCDNUpdateReason {
    /** 无 */
    None = 0,
    /** 服务器错误 */
    ServerError = 1,
    /** 握手失败 */
    HandshakeFailed = 2,
    /** 接入点错误 */
    AccessPointError = 3,
    /** 创建流失败 */
    CreateStreamFailed = 4,
    /** 流 ID 不合法 */
    BadName = 5,
    /** CDN 服务器主动断开 */
    CDNServerDisconnected = 6,
    /** 主动断开 */
    Disconnected = 7,
    /** 混流的全部输入流会话关闭 */
    MixStreamAllInputStreamClosed = 8,
    /** 混流的全部输入流没有数据 */
    MixStreamAllInputStreamNoData = 9,
    /** 混流服务器内部错误 */
    MixStreamServerInternalError = 10
}
/** 设备类型。 */
export declare enum ZegoDeviceType {
    /** 未知的设备类型。 */
    Unknown = 0,
    /** 摄像头设备。 */
    Camera = 1,
    /** 麦克风设备。 */
    Microphone = 2,
    /** 扬声器设备。 */
    Speaker = 3,
    /** 音频设备。（无法精确分类到麦克风或者扬声器的其他音频设备。） */
    AudioDevice = 4,
    /** 音频会话。 */
    AudioSession = 5
}
/** 设备异常类型。 */
export declare enum ZegoDeviceExceptionType {
    /** 未知的设备异常。 */
    Unknown = 0,
    /** 一般性设备异常。 */
    Generic = 1,
    /** 无效设备 ID 异常。 */
    InvalidId = 2,
    /** 没有设备权限。 */
    PermissionNotGranted = 3,
    /** 设备的采集帧率为 0。 */
    ZeroCaptureFps = 4,
    /** 设备被占用。 */
    DeviceOccupied = 5,
    /** 设备被拔出（未连接）。 */
    DeviceUnplugged = 6,
    /** 设备要求系统重启后才能工作（仅限 Windows 平台）。 */
    RebootRequired = 7,
    /** 系统媒体服务不可用，例如当 iOS 系统检测到当前压力巨大（如播放大量动画），则有可能会将媒体相关服务全部停用（仅限 Apple 平台）。 */
    MediaServicesWereLost = 8,
    /** 设备被 Siri 占用（仅限 Apple 平台）。 */
    SiriIsRecording = 9,
    /** 设备采集的声音过低（仅限 Windows 平台）。 */
    SoundLevelTooLow = 10,
    /** 可能是由 iPad 磁吸保护套引起的设备被占用问题（仅限 Apple 平台）。 */
    MagneticCase = 11,
    /** 音频会话停用（仅限 Apple 平台）。 */
    AudioSessionDeactive = 12,
    /** 音频会话分类更改（仅限 Apple 平台）。 */
    AudioSessionCategoryChange = 13
}
/** 远端设备状态 */
export declare enum ZegoRemoteDeviceState {
    /** 设备开启 */
    Open = 0,
    /** 设备关闭：一般性设备错误 */
    GenericError = 1,
    /** 设备关闭：无效的设备 ID */
    InvalidID = 2,
    /** 设备关闭：无权限 */
    NoAuthorization = 3,
    /** 设备关闭：采集帧率为 0 */
    ZeroFPS = 4,
    /** 设备关闭：设备被占用 */
    InUseByOther = 5,
    /** 设备关闭：设备未插入或被拔出 */
    Unplugged = 6,
    /** 设备关闭：由于系统原因需要重启后才能进行下一次修改，否则重新打开也不生效 */
    RebootRequired = 7,
    /** 设备关闭：系统媒体服务停止，如 iOS 平台下，当系统检测到当前压力巨大（如播放大量动画），则有可能会将媒体相关服务全部停用 */
    SystemMediaServicesLost = 8,
    /** 设备关闭：远端用户主动调用 [enableCamera] 或者 [enableAudioCaptureDevice] 禁用摄像头或者麦克风 */
    Disable = 9,
    /** 设备关闭：远端用户主动调用 [muteMicrophone] 或者 [mutePublishStreamAudio] 或者 [mutePublishStreamVideo] 停止发送音频流或者视频流 */
    Mute = 10,
    /** 设备关闭：设备被中断，如电话事件打断等 */
    Interruption = 11,
    /** 设备关闭：用户 App 退到后台 */
    InBackground = 12,
    /** 设备关闭：当前前台同时存在多个 App，如 iPad 应用分屏下，系统会禁止所有应用使用摄像头 */
    MultiForegroundApp = 13,
    /** 设备关闭：系统处于高负载压力下，可能导致设备异常 */
    BySystemPressure = 14,
    /** 设备状态未知：远端的 SDK 版本过低，不支持发布该设备状态信息 */
    NotSupport = 15
}
/** 音频路由 */
export declare enum ZegoAudioRoute {
    /** 扬声器 */
    Speaker = 0,
    /** 耳机 */
    Headphone = 1,
    /** 蓝牙设备 */
    Bluetooth = 2,
    /** 听筒 */
    Receiver = 3,
    /** USB 音频外接设备 */
    ExternalUSB = 4,
    /** Apple 隔空播放 */
    AirPlay = 5
}
/** 混流内容类型 */
export declare enum ZegoMixerInputContentType {
    /** 音频混流内容类型 */
    Audio = 0,
    /** 视频混流内容类型 */
    Video = 1,
    /** 仅视频混流内容类型。在 web 平台，此属性不生效。 */
    VideoOnly = 2
}
/** 音频配置类型 */
export declare enum ZegoAudioConfigPreset {
    /** 基础音质 (16 kbps, Mono, ZegoAudioCodecIDDefault) */
    BasicQuality = 0,
    /** 标准音质 (48 kbps, Mono, ZegoAudioCodecIDDefault) */
    StandardQuality = 1,
    /** 标准音质 (56 kbps, Stereo, ZegoAudioCodecIDDefault) */
    StandardQualityStereo = 2,
    /** 高音质 (128 kbps, Mono, ZegoAudioCodecIDDefault) */
    HighQuality = 3,
    /** 高音质 (192 kbps, Stereo, ZegoAudioCodecIDDefault) */
    HighQualityStereo = 4
}
/** 播放器状态 */
export declare enum ZegoMediaPlayerState {
    /** 不在播放 */
    NoPlay = 0,
    /** 播放中 */
    Playing = 1,
    /** 暂停播放 */
    Pausing = 2,
    /** 播放结束 */
    PlayEnded = 3
}
/** 播放器网络事件 */
export declare enum ZegoMediaPlayerNetworkEvent {
    /** 网络资源播放不畅，开始尝试缓存数据 */
    BufferBegin = 0,
    /** 网络资源可以顺畅播放 */
    BufferEnded = 1
}
/** 播放器声道 */
export declare enum ZegoMediaPlayerAudioChannel {
    /** 左声道 */
    Left = 0,
    /** 右声道 */
    Right = 1,
    /** 全部声道 */
    All = 2
}
/** 录制类型 */
export declare enum ZegoDataRecordType {
    /** 该字段表示纯音频 SDK 默认录制音频，音视频 SDK 默认录制音视频，当录制 .aac 格式的文件时默认也是录制音频 */
    Default = 0,
    /** 只录制音频 */
    OnlyAudio = 1,
    /** 只录制视频，音频的 SDK 和录制 .aac 格式文件时无效 */
    OnlyVideo = 2,
    /** 同时录制音频、视频。音频的 SDK 和录制 .aac 格式文件时录制出来也只有音频 */
    AudioAndVideo = 3
}
/** 录制状态 */
export declare enum ZegoDataRecordState {
    /** 未录制状态，当录制出错或者未开始录制之前处于此状态 */
    NoRecord = 0,
    /** 正在录制中，当成功调用 [startRecordingCapturedData] 函数之后处于此状态 */
    Recording = 1,
    /** 录制成功 */
    Success = 2
}
/** 多媒体资源加载方式。 */
export declare enum ZegoMultimediaLoadType {
    /** 通过文件路径加载。 */
    FilePath = 0,
    /** 通过二进制内存数据加载。 */
    Memory = 1,
    /** 通过版权音乐资源 ID 加载。 */
    ResourceID = 2
}
/** 透明通道数据布局方式。 */
export declare enum ZegoAlphaLayoutType {
    /** 没有 alpha 数据。 */
    None = 0,
    /** 透明通道数据位于 RGB/YUV 数据左侧。 */
    Left = 1,
    /** 透明通道数据位于 RGB/YUV 数据右侧。 */
    Right = 2,
    /** 透明通道数据位于 RGB/YUV 数据底部。 */
    Bottom = 3
}
/**
 * 日志配置
 *
 * 详情描述：调用 [setLogConfig] 自定义日志配置时，需要通过该参数配置。
 * 业务场景：当需要自定义日志存储路径或日志文件大小上限时，需要这个配置。
 * 注意事项：无。
 */
export declare class ZegoLogConfig {
    /** 日志文件的存储路径。详情描述：用于自定义日志文件的存储路径。业务场景：当需要自定义日志存储路径时，需要这个配置。是否必填：否。默认值：各平台的默认路径有所不同，具体参考官网文档 https://doc-zh.zego.im/faq/express_sdkLog 注意事项：开发者需要确保对该路径下文件的读写权限。 */
    logPath: string;
    /** 日志文件大小上限，单位Bytes。详情描述：用于自定义日志文件大小上限。业务场景：当需要自定义日志文件大小上限时，需要这个配置。是否必填：否。默认值：5MB (5 * 1024 * 1024 Bytes)。取值范围：最小1MB (1 * 1024 * 1024 Bytes)，最大100M (100 * 1024 * 1024 Bytes)，0表示不需要写日志。注意事项：日志文件大小上限越大，承载的日志信息越多，但是日志上传时间也会更长。 */
    logSize: number;
    /** 日志文件个数。默认是 3 个。取值范围是 [3, 20] */
    logCount: number;
    constructor();
}
/**
 * 创建引擎的配置
 *
 * 创建引擎的配置
 */
export declare class ZegoEngineProfile {
    /** ZEGO 为开发者签发的应用 ID，请从 ZEGO 管理控制台 https://console-express.zego.im 申请。appID 取值范围 0~4294967295。 */
    appID: number;
    /** 每个 AppID 对应的应用签名，请从 ZEGO 管理控制台申请。该参数为包含 64 个字符的字符串，字符取值范围：'0' ~ '9', 'a' ~ 'z'。例："9dc9a25bh2f2137446897071c8c033fa33b91c3dd2a85e0c000ae82c0dad3"。2.17.0 及以上版本 appSign 允许传空或者不传。如果传空或者不传，则必须在调用 [loginRoom] 接口登录房间时将 token 填入 [ZegoRoomConfig] 参数中，用于鉴权。token 的生成方式请参考 [使用 Token 鉴权](https://doc-zh.zego.im/article/10360) 。 */
    appSign: string;
    /** 房间场景，SDK 会针对指定的场景的做一些音视频配置优化以达成在此场景下最优的效果。指定场景后，开发者可以使用 [setRoomScenario] 来实现在不销毁引擎 [destroyEngine] 的前提下切换其他场景。指定场景后，开发者可以调用其他 API 来继续调整音视频配置。各个场景之间的差异以及如何选择合适的场景请参考 https://doc-zh.zego.im/article/16316 */
    scenario: ZegoScenario;
    constructor(appID: number, appSign: string, scenario: ZegoScenario);
}
/**
 * 引擎进阶配置
 */
export declare class ZegoEngineConfig {
    /** 进阶功能配置，未设置时默认不使用任何特殊功能，如需使用，请联系 ZEGO 技术支持。 */
    advancedConfig?: Map<string, string>;
}
/**
 * 房间进阶配置
 *
 * 配置房间的最大用户数量、鉴权 token 等
 */
export declare class ZegoRoomConfig {
    /** 房间最大用户数量，传 0 视为不限制，默认无限制 */
    maxMemberCount: number;
    /** 是否开启用户进出房间回调通知 [onRoomUserUpdate]，默认关闭。若开发者需要使用 ZEGO 房间用户广播通知，请确保每个登录的用户都将此标记设置为true */
    isUserStatusNotify: boolean;
    /** 由开发者业务服务器下发的 token，用以保证安全性，生成规则请参考 [使用 Token 鉴权](https://doc-zh.zego.im/article/10360)，默认为空字符串，即不鉴权。2.17.0 及以上版本如果调用 [createEngine] 接口创建引擎时未传入appSign，或者appSign为空，则登录房间时必须设置此参数用于鉴权。 */
    token: string;
    constructor(maxMemberCount: number, isUserStatusNotify: boolean, token: string);
}
/**
 * 视频配置
 *
 * 配置码率、帧率、分辨率等推流用到的参数。
 * 开发者应该注意的是，移动端与桌面端的宽高分辨率是相反的，例如，360p，移动端的分辨率为 360x640，而桌面端为 640x360。
 * 使用外部采集时，RTC的采集和编码分辨率不能设置为0*0，不然会导致整个引擎生命周期里的推流，都没有视频数据。
 */
export declare class ZegoVideoConfig {
    /** 采集分辨率宽度，控制摄像头图像采集的宽度。SDK 要求设置此成员为偶数。仅摄像头启动前且没有使用自定义视频采集时，设置有效。出于性能考虑，SDK 在采集摄像头画面后、渲染预览画面之前，就将视频帧缩放为编码分辨率，因此预览画面的分辨率是编码分辨率，如果您需要预览画面的分辨率为此值，请先调用 [setCapturePipelineScaleMode] 将采集缩放模式改为 [Post] */
    captureWidth: number;
    /** 采集分辨率高度，控制摄像头图像采集的高度。SDK 要求设置此成员为偶数。仅摄像头启动前且没有使用自定义视频采集时，设置有效。出于性能考虑，SDK 在采集摄像头画面后、渲染预览画面之前，就将视频帧缩放为编码分辨率，因此预览画面的分辨率是编码分辨率，如果您需要预览画面的分辨率为此值，请先调用 [setCapturePipelineScaleMode] 将采集缩放模式改为 [Post] */
    captureHeight: number;
    /** 编码分辨率宽度，控制编码器编码推流的图像宽度。SDK 要求设置此成员为偶数。推流前后设置均可生效 */
    encodeWidth: number;
    /** 编码分辨率高度，控制编码器编码推流的图像高度。SDK 要求设置此成员为偶数。推流前后设置均可生效 */
    encodeHeight: number;
    /** 帧率，控制摄像头采集帧率以及编码器编码帧率的大小。仅摄像头启动前设置有效。推流端设置60帧，拉流端生效需联系技术支持 */
    fps: number;
    /** 码率，单位为 kbps。推流前后设置均可生效。SDK 会根据开发者选择的场景，自动设置适配该场景的码率。若开发者手动设置的码率超出合理范围，SDK会自动按照合理区间处理码率。如因业务需要配置高码率，请联系 ZEGO 商务。 */
    bitrate: number;
    /** 要使用的编码器，默认为 default。仅在推流前设置生效 */
    codecID: ZegoVideoCodecID;
    /** 视频关键帧间隔，单位秒。是否必填：否。默认值：2秒。取值范围：[2, 5]。注意事项：仅在推流前设置有效。 */
    keyFrameInterval?: number;
    constructor(captureWidth: number, captureHeight: number, encodeWidth: number, encodeHeight: number, fps: number, bitrate: number, codecID: ZegoVideoCodecID);
}
/**
 * 变声器参数
 *
 * 开发者可以使用 SDK 的内置预置来改变变声器的参数。
 */
export declare class ZegoVoiceChangerParam {
    /** 音调参数，取值范围 [-12.0, 12.0]，数值越大声音越尖，设为 0.0 即关闭变声器。注意：变调音效只针对媒体播放器播放的声音有效，不改变麦克风采集的音调。注意在 2.18.0 及更老版本上，取值范围为 [-8.0, 8.0]。 */
    pitch: number;
    constructor(pitch: number);
}
/**
 * 用户对象
 *
 * 配置用户 ID 和用户名，用于标识房间内的用户。
 * 注意 userID 在同一个 appID 下需唯一，否则登录房间时会出现互踢的情况。
 * 强烈建议 userID 与业务 APP 的用户 ID 一一对应，即一个 userID 与一个真实用户是固定且唯一的，而不应该是以随机的 userID 的方式传给 SDK 的方式。因为唯一且固定的 userID 可以让 ZEGO 技术人员快速定位线上问题。
 */
export declare class ZegoUser {
    /** 用户 ID，最大 64 字节的utf8编码字符串。隐私保护声明：请勿在此字段填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。注意事项：仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\\'。如果需要与 Web SDK 互通，请不要使用 '%'。 */
    userID: string;
    /** 用户名，最大长度不超过 256 字节的utf8编码字符串。请勿在此字段填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。 */
    userName: string;
    constructor(userID: string, userName: string);
}
/**
 * 音视频流对象
 *
 * 标识一条音视频流
 */
export interface ZegoStream {
    /** 用户对象实例。请勿在此字段填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。 */
    user: ZegoUser;
    /** 流 ID，长度不超过256的字符串。注意事项：不可以包含 URL 关键字，否则推拉流失败。仅支持数字，英文字符 和 '-', '_'。 */
    streamID: string;
    /** 流附加信息 */
    extraInfo: string;
}
/**
 * 房间附加消息
 */
export interface ZegoRoomExtraInfo {
    /** 房间附加消息的键 */
    key: string;
    /** 房间附加消息的值 */
    value: string;
    /** 更新房间附加消息的用户。请勿在此字段填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。 */
    updateUser: ZegoUser;
    /** 房间附加消息的更新时间，UNIX 时间戳，单位为毫秒 */
    updateTime: number;
}
/**
 * 视图相关所使用的坐标
 */
export declare class ZegoRect {
    /** 矩形左上角在坐标系 X 轴上的值 */
    x: number;
    /** 矩形左上角在坐标系 Y 轴上的值 */
    y: number;
    /** 矩形宽度 */
    width: number;
    /** 矩形高度 */
    height: number;
    constructor(x: number, y: number, width: number, height: number);
}
/**
 * 推流进阶配置
 *
 * 配置房间 ID
 */
export declare class ZegoPublisherConfig {
    /** 房间 ID, 单房间模式可不传，多房间模式时必须传对应房间的 ID */
    roomID?: string;
    /** 推流时是否同步网络时间，1-同步 0-不同步。且必须与 setStreamAlignmentProperty配合使用。用于在混流服务或拉流端对多条流进行对齐，比如 KTV 的合唱场景。 */
    forceSynchronousNetworkTime?: number;
}
/**
 * 推流质量对象
 *
 * 音视频参数与网络质量等
 */
export interface ZegoPublishStreamQuality {
    /** 视频采集帧率，单位为 f/s */
    videoCaptureFPS: number;
    /** 视频编码帧率，单位为 f/s */
    videoEncodeFPS: number;
    /** 视频发送帧率，单位为 f/s */
    videoSendFPS: number;
    /** 视频码率，单位为 kbps */
    videoKBPS: number;
    /** 音频采集帧率，单位为 f/s */
    audioCaptureFPS: number;
    /** 音频发送帧率，单位为 f/s */
    audioSendFPS: number;
    /** 音频码率，单位为 kbps */
    audioKBPS: number;
    /** 本端至服务端的延迟，单位为毫秒 */
    rtt: number;
    /** 丢包率，单位为百分比，0.0 ~ 1.0 */
    packetLostRate: number;
    /** 推流质量级别 */
    level: ZegoStreamQualityLevel;
    /** 是否开启硬件编码 */
    isHardwareEncode: boolean;
    /** 视频编码格式 （支持版本：1.17.0 及以上） */
    videoCodecID: ZegoVideoCodecID;
    /** 已发送的总字节数，包括音频、视频和SEI等 */
    totalSendBytes: number;
    /** 已发送的音频字节数 */
    audioSendBytes: number;
    /** 已发送的视频字节数 */
    videoSendBytes: number;
}
/**
 * CDN 配置对象
 *
 * 包括 CDN 的 URL 以及鉴权参数字符串
 */
export declare class ZegoCDNConfig {
    /** CDN 的 URL */
    url: string;
    /** URL 的鉴权参数。若需要使用请联系 ZEGO 技术支持，否则可以忽略此参数（可以留空或设置为空字符串）。 */
    authParam?: string;
    constructor(url: string, authParam?: string);
}
/**
 * 转推 CDN 信息
 *
 * 包括转推 CDN 的 URL、转推状态等
 */
export interface ZegoStreamRelayCDNInfo {
    /** CDN 推流的 URL */
    url: string;
    /** 转推状态 */
    state: ZegoStreamRelayCDNState;
    /** 转推状态变更的原因 */
    updateReason: ZegoStreamRelayCDNUpdateReason;
    /** 状态发生的时间，UNIX 时间戳，单位为毫秒 */
    stateTime: number;
}
/**
 * 拉流进阶配置。
 *
 * 配置资源策略模式、CDN 配置以及其他高级配置。
 */
export declare class ZegoPlayerConfig {
    /** 拉流资源策略模式。 */
    resourceMode?: ZegoStreamResourceMode;
    /** 拉流的 CDN 配置，若设置后，则按照 URL 拉流而不是按照 streamID 拉流，此后 streamID 仅作为 SDK 内部回调的标识。 */
    cdnConfig?: ZegoCDNConfig;
    /** 房间 ID。仅在多房间模式下需要填写，即指明这条流需要跟哪个房间绑定。单房间模式下此参数将被忽略。 */
    roomID?: string;
    constructor(cdnConfig?: ZegoCDNConfig);
}
/**
 * 拉流质量对象
 *
 * 音视频参数与网络质量等
 */
export interface ZegoPlayStreamQuality {
    /** 视频接收帧率，单位为 f/s */
    videoRecvFPS: number;
    /** 视频抗抖动帧率，单位为 f/s （1.17.0 及以上版本支持） */
    videoDejitterFPS: number;
    /** 视频解码帧率，单位为 f/s */
    videoDecodeFPS: number;
    /** 视频渲染帧率，单位为 f/s */
    videoRenderFPS: number;
    /** 视频码率，单位为 kbps */
    videoKBPS: number;
    /** 视频卡顿率，单位为（卡顿次数/每10秒）（1.17.0 及以上版本支持） */
    videoBreakRate: number;
    /** 音频接收帧率，单位为 f/s */
    audioRecvFPS: number;
    /** 音频抗抖动帧率，单位为 f/s （1.17.0 及以上版本支持） */
    audioDejitterFPS: number;
    /** 音频解码帧率，单位为 f/s */
    audioDecodeFPS: number;
    /** 音频渲染帧率，单位为 f/s */
    audioRenderFPS: number;
    /** 音频码率，单位为 kbps */
    audioKBPS: number;
    /** 音频卡顿率，单位为（卡顿次数/每10秒） （1.17.0 及以上版本支持） */
    audioBreakRate: number;
    /** 音频 MOS (平均主观意见分) 评估方法对拉流音频的质量评分，取值范围 [-1, 5]，其中 -1 表示未知，[0, 5] 表示有效的评分，分数越高，音频质量越好。评分对应的主观感受请查阅 https://doc-zh.zego.im/article/1074#4_4 （2.16.0 及以上版本支持） */
    mos: number;
    /** 服务端至本端的延迟，单位为毫秒 */
    rtt: number;
    /** 丢包率，单位为百分比，0.0 ~ 1.0 */
    packetLostRate: number;
    /** 端到端延迟，单位为毫秒 */
    peerToPeerDelay: number;
    /** 端到端丢包率，单位为百分比，0.0 ~ 1.0 */
    peerToPeerPacketLostRate: number;
    /** 拉流质量级别 */
    level: ZegoStreamQualityLevel;
    /** 本端接收到数据后到播放的延迟，单位为毫秒 */
    delay: number;
    /** 视频时间戳相对于音频时间戳的差值，用于反映音画同步情况，单位为毫秒。此值小于 0 表示视频超前音频的毫秒数, 大于 0 表示视频滞后音频的毫秒数, 等于0表示无差别。 当绝对值小于200，可基本认为音画同步，当绝对值连续 10 秒大于 200 可以认为异常 （支持版本：1.19.0 及以上） */
    avTimestampDiff: number;
    /** 是否开启硬件解码 */
    isHardwareDecode: boolean;
    /** 视频编码格式 （1.17.0 及以上版本支持） */
    videoCodecID: ZegoVideoCodecID;
    /** 已接收的总字节数，包括音频、视频和 SEI 等 */
    totalRecvBytes: number;
    /** 已接收的音频字节数 */
    audioRecvBytes: number;
    /** 已接收的视频字节数 */
    videoRecvBytes: number;
}
/**
 * 美颜配置参数
 *
 * 配置美颜的美白、红润、磨皮、锐化参数。
 */
export declare class ZegoEffectsBeautyParam {
    /** 美白强度参数，取值范围[0,100]，默认 50。 */
    whitenIntensity: number;
    /** 红润强度参数，取值范围[0,100]，默认 50。 */
    rosyIntensity: number;
    /** 磨皮强度参数，取值范围[0,100]，默认 50。 */
    smoothIntensity: number;
    /** 锐化强度参数，取值范围[0,100]，默认 50。 */
    sharpenIntensity: number;
    constructor();
}
/**
 * 混流音频配置
 *
 * 配置混流任务的音频码率、声道数、音频编码
 */
export declare class ZegoMixerAudioConfig {
    /** 音频码率，单位为 kbps，默认为 48 kbps，开始混流任务后不能修改 */
    bitrate: number;
    /** 音频声道，默认为 Mono 单声道 */
    channel: ZegoAudioChannel;
    /** 编码 ID，默认为 ZegoAudioCodecIDDefault */
    codecID: ZegoAudioCodecID;
    /** 多路音频流混音模式。若 [ZegoAudioMixMode] 选择为 [Focused]，SDK 将会选择 4 路已设置 [isAudioFocus] 的输入流作为焦点语音突出，若未选择或选择少于 4 路，则会自动补齐 4 路。在 web 平台，此属性不生效。 */
    mixMode: ZegoAudioMixMode;
    constructor();
}
/**
 * 混流视频配置
 *
 * 配置混流任务的视频参数，帧率、码率、分辨率
 */
export declare class ZegoMixerVideoConfig {
    /** 视频分辨率宽 */
    width: number;
    /** 视频分辨率高 */
    height: number;
    /** 视频帧率，开始混流任务后不能修改 */
    fps: number;
    /** 视频码率，单位为 kbps */
    bitrate: number;
    constructor();
}
/**
 * 混流输入
 *
 * 配置混流输入的流 ID、输入类型、流的布局
 */
export declare class ZegoMixerInput {
    /** 流 ID，长度不超过256的字符串。注意事项：不可以包含 URL 关键字，否则推拉流失败。仅支持数字，英文字符 和 '-', '_'。 */
    streamID: string;
    /** 混流内容类型 */
    contentType: ZegoMixerInputContentType;
    /** 流的布局。当混入的流为音频流时（即 ContentType 参数设置为音频混流类型），开发者无需对该字段赋值，使用 SDK 默认的即可。 */
    layout: ZegoRect;
    /** 当混流任务开启了声浪回调时，需要为每条输入流指定唯一的 soundLevelID */
    soundLevelID: number;
    constructor(streamID: string, contentType: ZegoMixerInputContentType, layout: ZegoRect, soundLevelID: number);
}
/**
 * 混流输出对象，目前一个混流任务最多只支持 4 路不同分辨率的视频流。
 *
 * 配置混流输出的目标 URL 或流 ID
 */
export declare class ZegoMixerOutput {
    /** 混流输出目标，URL 或者流 ID，若为 URL 格式 目前只支持 RTMP URL 格式：rtmp://xxxxxxxx, 且不能传入两个相同的混流输出的地址。 */
    target: string;
    constructor(target: string);
}
/**
 * 水印对象
 *
 * 配置一个水印的图片 URL 以及该水印在画面中的大小方位。
 */
export declare class ZegoWatermark {
    /** 水印图片路径。支持本地文件绝对路径 (file://xxx)。 格式支持 png、jpg。最大长度要小于 512 字节。 */
    imageURL: string;
    /** 水印图片的大小方位 */
    layout: ZegoRect;
    constructor(imageURL: string, layout: ZegoRect);
}
/**
 * 混流任务对象
 *
 * 本类为混流任务的配置类，当向 ZEGO RTC 服务器发起混流任务的请求时，需要这个混流任务的配置。
 * 本类即描述这次混流任务的详细配置信息。
 */
export declare class ZegoMixerTask {
    /** 混流任务 ID */
    taskID: string;
    /** 混流音频配置 */
    audioConfig: ZegoMixerAudioConfig;
    /** 混流视频配置 */
    videoConfig: ZegoMixerVideoConfig;
    /** 混流任务输入流列表 */
    inputList: ZegoMixerInput[];
    /** 混流任务输出流列表 */
    outputList: ZegoMixerOutput[];
    /** 混流水印 */
    watermark: ZegoWatermark;
    /** 混流背景图 URL */
    backgroundImageURL: string;
    /** 是否开启混流的声浪回调通知，开启后拉混流时可通过 [onMixerSoundLevelUpdate] 回调收到每条单流的声浪信息 */
    enableSoundLevel: boolean;
    /** 设置高级配置，如可用于指定视频编码等功能。如需使用，联系 ZEGO 技术支持。 */
    advancedConfig: Map<string, string>;
    constructor(taskID: string);
}
/**
 * 启动声浪监控的配置
 *
 * 支持版本：2.10.0 及以上。
 * 详情描述：用于 startSoundLevelMonitor 函数，其中的 enableVAD 参数用于设置声浪回调是否检测 VAD，开启后结果将从 [onCapturedSoundLevelInfoUpdate] 和 [onRemoteSoundLevelInfoUpdate] 回调中体现。
 * 业务场景：开发者需要判断用户说话音量是否太小时，可开启 VAD 声音检测。
 * 注意事项：VAD 算法有性能开销，建议按需设置。
 */
export declare class ZegoSoundLevelConfig {
    /** 声浪的监控时间周期，单位为毫秒，取值范围 [100, 3000]。默认 100 ms。 */
    millisecond: number;
    /** 设置声浪回调是否包含 VAD 检测结果。 */
    enableVAD: boolean;
    constructor(millisecond: number, enableVAD: boolean);
}
/**
 * 声浪信息对象
 */
export interface ZegoSoundLevelInfo {
    /** 音浪值 */
    soundLevel: number;
    /** StreamID 对应的流是否包含声音，0: 表示噪声，1: 表示正常声音；调用 [startSoundLevelMonitor] 时设置的 ZegoSoundLevelConfig 配置中的 enableVAD 参数设为 true 后此值才有效。 */
    vad: number;
}
/**
 * 自动混流任务对象
 *
 * 详情描述：调用 [StartAutoMixerTask] 函数向 ZEGO RTC 服务器发起自动混流任务时，需要通过该参数配置自动混流任务，包括任务 ID、房间 ID、音频配置、输出流列表、是否开启声浪回调通知。
 * 业务场景：当向 ZEGO RTC 服务器发起自动混流任务时，需要这个配置。
 * 注意事项：作为调用 [StartAutoMixerTask] 函数时传入的参数。
 */
export declare class ZegoAutoMixerTask {
    /** 自动混流任务的任务 ID。详情描述：自动混流任务 ID，一个房间内需要保证混流任务 ID 的唯一性。业务场景：当发起自动混流任务时，需要配置该参数。是否必填：是。建议值：根据需求设置。取值范围：长度不超过 256 字节的字符串。注意事项：一个房间内只能存在一个混流任务 ID，即保证混流任务 ID 的唯一性，建议混流任务 ID 与房间 ID 关联，可直接使用房间 ID 作为混流任务 ID。不可以包含 URL 关键字，例如 'http', '?' 等，否则推拉流会失败。仅支持数字，英文字符 和 '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\\'。 */
    taskID: string;
    /** 自动混流任务的房间 ID。详情描述：自动混流任务的房间 ID。业务场景：当发起自动混流任务时，需要配置该参数。是否必填：是。建议值：根据需求设置。取值范围：长度不超过 128 字节的字符串。注意事项：仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\\'。如果需要与 Web SDK 互通，请不要使用 '%'。 */
    roomID: string;
    /** 自动混流任务的音频配置。详情描述：自动混流任务的音频配置，可配置音频码率、音频声道，编码 ID、多路音频流混音模式。业务场景：如果对自动混流任务的音频有特殊需求，比如需要调整音频码率，可根据需要调整该参数，否则不用配置。是否必填：否。默认值：默认音频码率为 "48 kbps", 默认音频声道为 "ZEGO_AUDIO_CHANNEL_MONO", 默认编码 ID 为 "ZEGO_AUDIO_CODEC_ID_DEFAULT"，默认多路音频流混音模式为 "ZEGO_AUDIO_MIX_MODE_RAW"。建议值：根据需求设置。 */
    audioConfig: ZegoMixerAudioConfig;
    /** 自动混流任务的输出流列表。详情描述：自动混流任务的输出流列表，列表中为 URL 或者流 ID，若为 URL 格式 目前只支持 RTMP URL 格式：rtmp://xxxxxxxx。业务场景：当发起自动混流任务时，需要配置该参数指明混流输出目标。Mix stream output target是否必填：是。 */
    outputList: ZegoMixerOutput[];
    /** 是否开启自动混流的声浪回调通知，开启后拉混流时可通过 [onAutoMixerSoundLevelUpdate] 回调收到每条单流的声浪信息。详情描述：是否开启自动混流的声浪回调通知，开启后拉混流时可通过 [onAutoMixerSoundLevelUpdate] 回调收到每条单流的声浪信息。业务场景：当发起自动混流任务时，如果需要回调流的声浪信息，需要配置该参数。是否必填：否。默认值："false"。建议值：根据需求设置。 */
    enableSoundLevel: boolean;
    /**
     * 构造一个自动混流任务对象
     */
    constructor();
}
/**
 * 房间广播消息
 *
 * 收到的房间广播消息对象，包括消息内容、消息 ID、发送人、发送时间
 */
export interface ZegoBroadcastMessageInfo {
    /** 消息内容 */
    message: string;
    /** 消息 ID */
    messageID: number;
    /** 消息的发送时间，UNIX 时间戳，单位为毫秒 */
    sendTime: number;
    /** 消息的发送者。请勿在此字段填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。 */
    fromUser: ZegoUser;
}
/**
 * 房间弹幕消息
 *
 * 收到的房间弹幕消息对象，包括消息内容、消息 ID、发送人、发送时间
 */
export interface ZegoBarrageMessageInfo {
    /** 消息内容 */
    message: string;
    /** 消息 ID */
    messageID: string;
    /** 消息的发送时间，UNIX 时间戳，单位为毫秒 */
    sendTime: number;
    /** 消息的发送者。请勿在此字段填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。 */
    fromUser: ZegoUser;
}
/**
 * 推流音频配置
 *
 * 配置推流的音频码率、声道数、音频编码
 */
export declare class ZegoAudioConfig {
    /** 音频码率，单位为 kbps，默认为 48 kbps. 该配置推流前后设置均可生效 */
    bitrate: number;
    /** 音频编码声道，控制编码器编码的声道数。默认为 Mono 单声道。仅在推流前设置生效。 */
    channel: ZegoAudioChannel;
    /** 编码 ID，默认为 ZegoAudioCodecIDDefault。仅在推流前设置生效。 */
    codecID: ZegoAudioCodecID;
    constructor(bitrate: number, channel: ZegoAudioChannel, codecID: ZegoAudioCodecID);
}
/**
 * 录制配置
 */
export declare class ZegoDataRecordConfig {
    /** 录制文件保存路径，绝对路径，需要包含文件名, 文件名需指明后缀，目前支持 .mp4/.flv/.aac 格式文件。若多次录制为同一个路径，会覆盖同名的文件。最大长度应小于 1024 字节。 */
    filePath: string;
    /** 录制文件媒体类型 */
    recordType: ZegoDataRecordType;
    constructor(filePath: string, recordType: ZegoDataRecordType);
}
/**
 * 文件录制进度
 */
export declare class ZegoDataRecordProgress {
    /** 当前录制时长, 单位为毫秒 */
    duration: number;
    /** 当前录制文件大小, 单位为字节 */
    currentFileSize: number;
    /** 当前录制文件的质量信息 */
    quality: ZegoPublishStreamQuality;
    constructor(duration: number, currentFileSize: number, quality: ZegoPublishStreamQuality);
}
/**
 * 精准seek的配置
 */
export declare class ZegoAccurateSeekConfig {
    /** 精确搜索的超时时间;如果不设置, SDK 内部默认是设置 5000 毫秒,有效值区间 [2000, 10000],单位ms */
    timeout: number;
    constructor();
}
/**
 * 媒体播放器网络缓存信息
 */
export declare class ZegoNetWorkResourceCache {
    /** 已缓存时长, 单位 ms */
    time: number;
    /** 已缓存大小, 单位 byte */
    size: number;
    constructor(time: number, size: number);
}
/**
 * 用于指定播放器的多媒体资源。
 *
 * 用于在加载多媒体资源时，配置加载参数。
 */
export declare class ZegoMediaPlayerResource {
    /** 用于指定多媒体资源的加载类型。 */
    loadType: ZegoMultimediaLoadType;
    /** 开始播放的进度。 */
    startPosition?: number;
    /** 如果指定的资源带透明特效，需要指定 alpha 数据的布局位置。 */
    alphaLayout?: ZegoAlphaLayoutType;
    /** 文件资源的路径。本地资源路径或网络资源的 URL，不能传入 null 或 ""。Android 可通过 Uri 方式进行传参。 */
    filePath?: string;
    /** 二进制数据内存。 */
    memory?: Uint8Array;
    /** 从版权音乐模块获取的资源 ID。 */
    resourceID?: string;
    constructor();
}
export declare abstract class ZegoMediaPlayer {
    /**
     * 加载本地或者网络媒体资源。
     *
     * 支持版本：1.3.4 及以上。
     * 详情描述：加载媒体资源。
     * 业务场景：开发者可以将可传本地资源的绝对路径或者网络资源的 URL 传入进行加载。
     * 调用时机：在已经初始化引擎 [createEngine] 且创建媒体播放器 [createMediaPlayer] 之后可以调用。
     * 相关接口：也可通过 [loadResourceWithPosition] 或 [loadResourceFromMediaData] 函数加载资源。
     *
     * @param path 本地资源路径或网络资源的 URL，不能传入 null 或 ""。Android 可通过 Uri 方式进行传参。
     * @return 加载媒体资源结果回调。
     */
    abstract loadResource(path: string): Promise<ZegoMediaPlayerLoadResourceResult>;
    /**
     * 加载本地或者网络媒体资源，带配置参数。
     *
     * 支持版本：3.3.0 及以上。
     * 详情描述：加载媒体资源。
     * 业务场景：开发者可以将可传本地资源的绝对路径或者网络资源的 URL 传入进行加载。
     * 调用时机：在已经初始化引擎 [createEngine] 且创建媒体播放器 [createMediaPlayer] 之后调用。
     * 相关接口：支持通过 [loadResourceWithPosition] 或 [loadResourceFromMediaData] 接口加载资源。
     *
     * @param resource 需要加载的多媒体资源。
     * @return 加载媒体资源结果回调。
     */
    abstract loadResourceWithConfig(resource: ZegoMediaPlayerResource): Promise<ZegoMediaPlayerLoadResourceResult>;
    /**
     * 开始播放
     *
     * 必须在加载资源完成后才能调用
     */
    abstract start(): Promise<void>;
    /**
     * 停止播放
     */
    abstract stop(): Promise<void>;
    /**
     * 暂停播放
     */
    abstract pause(): Promise<void>;
    /**
     * 恢复播放
     */
    abstract resume(): Promise<void>;
    /**
     * 设置指定的播放进度
     *
     * 单位为毫秒
     *
     * @param millisecond 指定的播放进度的时间点
     * @return 设置指定的播放进度的结果通知
     */
    abstract seekTo(millisecond: number): Promise<ZegoMediaPlayerSeekToResult>;
    /**
     * 是否重复播放
     *
     * @param enable 重复播放标记，默认为 false
     */
    abstract enableRepeat(enable: boolean): Promise<void>;
    /**
     * 设置播放倍速。
     *
     * 支持版本：2.12.0 及以上。
     * 详情描述：设置播放器的播放倍速。
     * 调用时机：必须在加载资源完成后才能调用。
     * 使用限制：无。
     * 相关接口：可通过 [loadResource] 函数加载资源。
     *
     * @param speed 播放速度。范围为 0.5 ~ 4.0，默认为 1.0。
     */
    abstract setPlaySpeed(speed: number): Promise<void>;
    /**
     * 是否将播放器的声音混入正在推的流中
     *
     * 此接口仅会将媒体播放器声音混到主通道中
     *
     * @param enable 是否混音标记，默认为 false
     */
    abstract enableAux(enable: boolean): Promise<void>;
    /**
     * 是否静默本地播放
     *
     * 若开启了混音入流则推的流中仍然有声音，默认为 false。
     *
     * @param mute 本地静音标记，默认为 false。
     */
    abstract muteLocal(mute: boolean): Promise<void>;
    /**
     * 设置播放器播放视频的视图
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param playerID 视频渲染的画布对象
     */
    abstract setPlayerView(playerID: number): Promise<void>;
    /**
     * 设置播放器音量，会同时设置本地播放音量和推流音量
     *
     * @param volume 范围为 0 ~ 200，默认为 60。
     */
    abstract setVolume(volume: number): Promise<void>;
    /**
     * 设置播放器本地播放音量
     *
     * @param volume 范围为 0 ~ 200，默认为 60。
     */
    abstract setPlayVolume(volume: number): Promise<void>;
    /**
     * 设置播放器推流音量
     *
     * @param volume 范围为 0 ~ 200，默认为 60。
     */
    abstract setPublishVolume(volume: number): Promise<void>;
    /**
     * 设置播放进度回调间隔
     *
     * 可通过此函数控制 [onMediaPlayerPlayingProgress] 的回调频率，当设置回调间隔为 0 时，停止回调。默认回调间隔为 1s
     * 回调不会严格按照设定的回调间隔值返回，而是以处理音频帧或者视频帧的频率来判断是否需要回调
     *
     * @param millisecond 播放进度回调间隔时间，单位为毫秒
     */
    abstract setProgressInterval(millisecond: number): Promise<void>;
    /**
     * 获取当前媒体播放器本地播放的音量，范围为 0 ~ 200，默认值为 60
     *
     * @return 当前音量
     */
    abstract getPlayVolume(): Promise<number>;
    /**
     * 获取当前媒体播放器推流的音量，范围为 0 ~ 200，默认值为 60
     *
     * @return 当前音量
     */
    abstract getPublishVolume(): Promise<number>;
    /**
     * 获取媒体资源的总进度
     *
     * 必须在加载资源完成后才能调用，否则返回值为 0
     *
     * @return 单位为毫秒
     */
    abstract getTotalDuration(): Promise<number>;
    /**
     * 获取当前播放进度
     *
     * 必须在加载资源完成后才能调用，否则返回值为 0
     *
     * @return 当前播放进度
     */
    abstract getCurrentProgress(): Promise<number>;
    /**
     * 获取播放文件的音轨个数
     *
     * @return 音轨个数
     */
    abstract getAudioTrackCount(): Promise<number>;
    /**
     * 设置播放文件的音轨
     *
     * @param index 音轨序号，可以通过 [getAudioTrackCount] 获取音轨个数
     */
    abstract setAudioTrackIndex(index: number): Promise<void>;
    /**
     * 获取当前播放状态
     *
     * @return 当前播放器状态
     */
    abstract getCurrentState(): Promise<ZegoMediaPlayerState>;
    /**
     * 获取媒体播放器的序号
     *
     * 详情描述：获取媒体播放器索引。
     * 调用时机：在 [createMediaPlayer] 之后可调用。
     * 使用限制：无。
     *
     * @return 媒体播放器索引。
     */
    abstract getIndex(): number;
    /**
     * 对媒体播放器当前播放画面进行截图
     *
     * 只有在调用 [setPlayerCanvas] 设置了显示控件，以及播放状态的情况下，才能正常截图
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     */
    abstract takeSnapshot(): Promise<ZegoMediaPlayerTakeSnapshotResult>;
    /**
     * 开启精准 seek 并设置相关属性
     *
     * 支持版本：2.4.0 及以上。
     * 详情描述：普通 seek 指定的时间戳可能是非 I 帧，进而返回指定时间戳前后的 I 帧，不是很精确。而精准 seek 当指定的时间戳不是 I 帧时，会通过指定时间戳前后的 I 帧去解指定时间戳的那帧数据。
     * 业务场景：适用于用户需要精准 seek 到指定时间戳的场景。
     * 调用时机：必须在加载资源前调用设置，在整个媒体播放器的生命周期内生效。
     *
     * @param enable 是否开启精准 seek
     * @param config 精准 seek 的属性设置，只有 enable 为 true 时有效。
     */
    abstract enableAccurateSeek(enable: boolean, config: ZegoAccurateSeekConfig): Promise<void>;
    /**
     * 设置网络素材最大的缓存时长和缓存数据大小
     *
     * 必须在加载资源前调用设置,在整个媒体播放器的生命周期内生效。
     * time和size不允许同时为 0.。SDK 内部默认time为5000, size为15*1024*1024 byte。time和size中某一个指标先达到设置的值，就会停止缓存。
     *
     * @param time 缓存最大时长, 单位 ms, SDK 内部默认为5000；有效值为大于等于 2000；如果填 0, 表示不限制。
     * @param size 缓存最大尺寸, 单位 byte,SDK内部默认size为15*1024*1024 byte；有效值为大于等于 5000000, 如果填 0, 表示不限制。
     */
    abstract setNetworkResourceMaxCache(time: number, size: number): Promise<void>;
    /**
     * 获取当前网络素材缓存队列的缓存数据可播放的时长和缓存数据大小
     *
     * @return 返回当前缓存的信息，包括数据可播放的时长和缓存数据大小
     */
    abstract getNetworkResourceCache(): Promise<ZegoNetWorkResourceCache>;
    /**
     * 通过该接口设置媒体播放器重新恢复播放需要达到的缓存阈值,SDK 默认值是 5000ms,有效值为大于等于1000ms
     *
     * 必须在加载资源前调用设置,在整个媒体播放器的生命周期内生效。
     * 当网络状态较差且媒体播放器将缓存的网络资源都播放完时，就会停止播放，并通过回调接口`onMediaPlayerNetworkEvent`的`ZegoMediaPlayerNetworkEvent.BUFFER_BEGIN`状态通知用户，告知正在重新缓存网络资源。
     * 只有当缓存的网络资源大于设置的阈值的时候,媒体播放器才会在原来暂停的位置自动恢复播放，并通过回调接口`onMediaPlayerNetworkEvent`的`ZegoMediaPlayerNetworkEvent.BUFFER_ENDED`通知用户，告知用户缓存网络资源已经达到阈值并恢复了播放。
     *
     * @param threshold 重新恢复播放需要达到的阈值, 单位 ms。
     */
    abstract setNetworkBufferThreshold(threshold: number): Promise<void>;
    /**
     * 注册监听媒体播放器事件回调
     *
     * @param event 事件类型。
     * @param callback 事件回调。
     */
    abstract on<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback: ZegoMediaPlayerListener[MediaPlayerEventType]): void;
    /**
     * 注销监听媒体播放器事件回调
     *
     * @param event 事件类型。
     * @param callback 事件回调。
     */
    abstract off<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback?: undefined | ZegoMediaPlayerListener[MediaPlayerEventType]): void;
    /**
     * 设置变声的具体参数
     *
     * @param param 变声参数
     * @param audioChannel 要进行变声的声道
     */
    abstract setVoiceChangerParam(param: ZegoVoiceChangerParam, audioChannel: ZegoMediaPlayerAudioChannel): Promise<void>;
}
/**
 * 设置房间附加信息函数的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoRoomSetRoomExtraInfoResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 登录房间结果回调。
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param extendedData 扩展信息
 */
export interface ZegoRoomLoginResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 扩展信息 */
    extendedData: string;
}
/**
 * 登出房间结果回调。
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param extendedData 扩展信息
 */
export interface ZegoRoomLogoutResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 扩展信息 */
    extendedData: string;
}
/**
 * 设置流附加信息函数的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoPublisherSetStreamExtraInfoResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 添加/删除转推 CDN 函数的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoPublisherUpdateCdnUrlResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 推流画面截图结果回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param imageBase64 截图的图片 base64 编码
 */
export interface ZegoPublisherTakeSnapshotResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 截图的图片 base64 编码 */
    imageBase64: string;
}
/**
 * 拉流画面截图结果回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param imageBase64 截图的图片 base64 编码
 */
export interface ZegoPlayerTakeSnapshotResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 截图的图片 base64 编码 */
    imageBase64: string;
}
/**
 * 开始混流任务的结果的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param extendedData 扩展信息
 */
export interface ZegoMixerStartResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 扩展信息 */
    extendedData: string;
}
/**
 * 结束混流任务的结果的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoMixerStopResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 发送房间聊天消息的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param messageID 此消息的 ID
 */
export interface ZegoIMSendBroadcastMessageResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 此消息的 ID */
    messageID: number;
}
/**
 * 发送房间弹幕消息的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param messageID 此消息的 ID
 */
export interface ZegoIMSendBarrageMessageResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 此消息的 ID */
    messageID: string;
}
/**
 * 发送房间自定义信令的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoIMSendCustomCommandResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 播放器加载资源完成回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoMediaPlayerLoadResourceResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 播放器设置指定播放进度回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 */
export interface ZegoMediaPlayerSeekToResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
}
/**
 * 媒体播放器播放画面截图的回调
 *
 * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
 * @param imageBase64 截图的图片 base64 编码
 */
export interface ZegoMediaPlayerTakeSnapshotResult {
    /** 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html */
    errorCode: number;
    /** 截图的图片 base64 编码 */
    imageBase64: string;
}
