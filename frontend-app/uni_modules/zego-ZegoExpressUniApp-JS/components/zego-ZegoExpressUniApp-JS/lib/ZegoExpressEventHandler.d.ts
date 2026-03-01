import * as zego from "./ZegoExpressDefines";
export interface ZegoEventListener {
    /**
     * 方法执行结果回调。
     *
     * 支持版本：2.3.0 及以上。
     * 详情描述：通过 [setApiCalledCallback] 开启监听时，会通过本回调回调所有方法的执行的结果。
     * 通知时机：在开发者调用 SDK 方法时，回调该方法的执行结果。
     * 使用限制：无。
     * 注意事项：建议在开发、测试阶段监听并处理本回调，在上线后关闭对本回调的监听。
     *
     * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
     * @param funcName 函数名。
     * @param info 错误的详细信息。
     */
    apiCalledResult: (errorCode: number, funcName: string, info: string) => void;
    /**
     * 音视频引擎状态更新的回调通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：音视频引擎状态更新的回调通知，当启用音视频功能时，比如预览、推流、本地媒体播放器、原始音频数据获取等，音视频引擎会进入开始状态，当退出房间或停用所有音视频功能时，音视频引擎会进入停止状态。
     * 通知时机：开发者调用了相关函数改变了音视频引擎的状态。例如：1. 调用了ZegoExpressEngine的 [startPreview]、[stopPreview]、[startPublishingStream]、[startPlayingStream]、[startAudioDataObserver] 等函数。2. 调用了 MediaPlayer 的相关函数等。3. 调用了 [logoutRoom] 函数。4.调用了 RealTimeSequentialDataManager 的相关接口等。
     * 使用限制：无。
     * 注意事项：
     *   1. 开发者调用 [destroyEngine] 时，由于 SDK 的资源被完全释放，并不会触发此通知。
     *   2. 如无特殊需要，开发者可以不必关注本回调。
     *
     * @param state 音视频引擎状态。
     */
    engineStateUpdate: (state: zego.ZegoEngineState) => void;
    /**
     * 房间状态变化通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当房间的连接状态改变时触发该回调，并通知改变的原因。2.18.0 及以上版本推荐使用 onRoomStateChanged 回调来替代 onRoomStateUpdate 回调监听房间状态变化。
     * 业务场景：开发者可以通过这个回调来判断房间内当前用户的状态。
     * 通知时机：
     *  1. 开发者调用 [loginRoom]、[logoutRoom]、[switchRoom] 函数时会收到此通知。
     *  2. 用户设备的网络情况变化时也可能收到此通知 (SDK 在断线时会自动重新登录房间，详情请参考 [SDK 是否支持断线重连机制](https://doc-zh.zego.im/faq/reconnect?product=ExpressVideo&platform=all)。
     * 使用限制：无。
     * 注意事项：若长时间处于正在请求连接状态（ZegoRoomStateConnecting），一般是因为用户端网络不稳定导致。
     * 相关接口：[loginRoom]、[logoutRoom]、[switchRoom]。
     *
     * @param roomID 房间 ID，最大长度为 128 字节的字符串。
     * @param state 变化后的房间状态。
     * @param errorCode 错误码，详情请参考 [常见错误码](https://doc-zh.zego.im/zh/4378.html)。
     * @param extendedData 状态更新附带的扩展信息。当房间登录成功时，可通过"room_session_id" key 获取每一次音视频通信唯一的 RoomSessionID，标识房间内首个用户发起音视频通信到最后一个用户结束通信的持续通信。可用于通话质量评分、通话问题诊断等场景中。
     */
    roomStateUpdate: (roomID: string, state: zego.ZegoRoomState, errorCode: number, extendedData: string) => void;
    /**
     * 房间状态变化通知，包含具体的状态变化原因。
     *
     * 支持版本：2.18.0 及以上。
     * 详情描述：当房间的连接状态改变时触发该回调，并通知改变的原因。2.18.0 及以上版本推荐使用 onRoomStateChanged 回调来替代 onRoomStateUpdate 回调监听房间状态变化。
     * 业务场景：开发者可以通过这个回调来判断房间内当前用户的状态。
     * 通知时机：
     *   1. 开发者调用房间相关函数 (参考 "相关接口") 时会收到此通知。
     *   2. 用户设备的网络情况变化时也可能收到此通知 (SDK 在断线时会自动重新登录房间，详情请参考 https://doc-zh.zego.im/faq/reconnect )。
     * 使用限制：无。
     * 注意事项：若长时间处于正在请求连接状态 [ZegoRoomStateConnecting]，一般是因为用户端网络不稳定导致。
     * 相关接口：[loginRoom], [logoutRoom], [switchRoom]
     *
     * @param roomID 房间 ID，最大长度为 128 字节的字符串。
     * @param reason 房间状态变化原因。
     * @param errorCode 错误码，详情请参考常用 错误码文档 https://doc-zh.zego.im/zh/4378.html
     * @param extendedData 状态更新附带的扩展信息。当房间登录成功时，可通过 "room_session_id" key 获取每一次音视频通信唯一的 RoomSessionID，标识房间内首个用户发起音视频通信到最后一个用户结束通信的持续通信。可用于通话质量评分、通话问题诊断等场景中。
     */
    roomStateChanged: (roomID: string, reason: zego.ZegoRoomStateChangedReason, errorCode: number, extendedData: string) => void;
    /**
     * 房间内其他用户增加或减少的回调通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当房间内有其他用户上线或下线时，导致房间内用户列表发生变化，会通过本回调通知开发者。
     * 业务场景：开发者可以通过这个回调来实时更新房间内的用户列表展示。
     * 通知时机：
     *   1. 用户首次登录房间时，如果房间内有其他用户，SDK 会触发 "updateType" 为 [ZegoUpdateTypeAdd] 的回调通知，此时 "userList" 为房间内的其他用户。
     *   2. 用户已在房间内，如果有其他用户通过 [loginRoom]、[switchRoom] 函数登录到本房间，SDK 会触发 "updateType" 为 [ZegoUpdateTypeAdd] 的回调通知。
     *   3. 用户已在房间内，有其他用户通过 [logoutRoom]、[switchRoom] 函数登出本房间，SDK 会触发 "updateType" 为 [ZegoUpdateTypeDelete] 的回调通知。
     *   4. 用户已在房间内，如果有其他用户从服务端被踢出本房间，SDK 会触发 "updateType" 为 [ZegoUpdateTypeDelete] 的回调通知。
     * 使用限制：调用 [loginRoom] 登录房间时设置 [ZegoRoomConfig] 参数中的 "isUserStatusNotify" 属性为 "true" 时，才会接收到这个回调通知。如果开发者需要使用在回调通知中处理相关业务，请确保每个登录的用户都将 "isUserStatusNotify" 设置为 "true"。
     * 相关接口：[loginRoom]、[logoutRoom]、[switchRoom]。
     *
     * @param roomID 用户已登录的房间 ID，最大长度为 128 字节的字符串。
     * @param updateType 更新类型（添加/删除）。
     * @param userList 当前房间内变更的用户列表。
     */
    roomUserUpdate: (roomID: string, updateType: zego.ZegoUpdateType, userList: zego.ZegoUser[]) => void;
    /**
     * 房间内当前在线用户数量回调。
     *
     * 支持版本：1.7.0 及以上。
     * 详情描述：此方法会通知用户当前房间内的在线人数。
     * 业务场景：开发者可根据此回调来来展示当前房间内的在线人数。
     * 通知时机：登录房间成功后。
     * 使用限制：无。
     * 注意事项：1. 此函数 30 秒回调一次。2. 因设计如此，当房间内用户超过 500 后，对房间内在线人数的统计会有一些误差。
     *
     * @param roomID 用户已登录的房间 ID，最大长度为 128 字节的字符串。
     * @param count 当前在线用户数量。
     */
    roomOnlineUserCountUpdate: (roomID: string, count: number) => void;
    /**
     * 相同房间内其他用户推的流增加或减少的通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当房间内有其他用户开始推流或停止推流时，导致房间内流列表发生变化，会通过本回调通知开发者。
     * 业务场景：开发者可根据此回调来判断指定房间内其他用户是否新增推流或停止推流，并根据情况选择调用 [startPlayingStream] 主动拉流或调用[stopPlayingStream] 停止拉流，同时也可以变更拉流的 UI 控件。
     * 通知时机：
     *   1. 用户首次登录房间时，如果房间内其他用户正在推流，SDK 会触发 updateType 为 [ZegoUpdateTypeAdd] 的回调通知，此时 "streamList" 为已存在的流列表。
     *   2. 用户已在房间内，如果有其他用户新增推流，SDK 会触发 "updateType" 为 [ZegoUpdateTypeAdd] 的回调通知。
     *   3. 用户已在房间内，如果有其他用户停止推流，SDK 会触发 "updateType" 为 [ZegoUpdateTypeDelete] 的回调通知。
     *   4. 用户已在房间内，如果有其他用户退出房间，SDK 会触发 "updateType" 为 [ZegoUpdateTypeDelete] 的回调通知。
     * 使用限制：无。
     *
     * @param roomID 用户已登录的房间 ID，最大长度为 128 字节的字符串。
     * @param updateType 更新类型（添加/删除）。
     * @param streamList 更新的流列表。
     * @param extendedData 流更新附带的扩展信息。收到流删除通知时，开发者可将该字符串转为 json 对象得到 stream_delete_reason 字段，该字段为流删除原因的数组，stream_delete_reason[].code 字段可能为如下值：1（用户主动停止推流）； 2（用户心跳超时）； 3（用户重复登录）； 4（用户被踢出）； 5（用户断线）； 6（被服务端移除）。
     */
    roomStreamUpdate: (roomID: string, updateType: zego.ZegoUpdateType, streamList: zego.ZegoStream[], extendedData: string) => void;
    /**
     * 房间内流附加信息更新通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：房间内流附加信息更新时所有房间内用户会收到通知。
     * 业务场景：用户可通过流附加信息与流生命周期一致的特性实现一些业务功能。
     * 通知时机：当相同房间内一个正在推流的用户更新了流的附加信息时，相同房间内的其他用户会收到该回调。
     * 使用限制：无。
     * 注意事项：不同于流 ID 在推流过程中不可修改，流附加信息可以在对应流 ID 的生命周期中更新。
     * 相关接口：推流用户可以通过 [setStreamExtraInfo] 设置流附加信息。
     *
     * @param roomID 用户已登录的房间 ID，最大长度为 128 字节的字符串。
     * @param streamList 流附加信息更新的流列表。
     */
    roomStreamExtraInfoUpdate: (roomID: string, streamList: zego.ZegoStream[]) => void;
    /**
     * 房间附加信息更新通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：房间附加信息更新后，除更新房间附加信息的用户外，房间内所有用户会收到通知。
     * 业务场景：为房间附加信息。
     * 通知时机：当相同房间内其他用户更新了房间附加信息时，相同房间内的其他用户会收到该回调。
     * 使用限制：无。
     * 相关接口：用户可以通过 [setRoomExtraInfo] 更新房间附加信息。
     *
     * @param roomID 用户已登录的房间 ID，最大长度为 128 字节的字符串。
     * @param roomExtraInfoList 更新的房间附加信息列表。
     */
    roomExtraInfoUpdate: (roomID: string, roomExtraInfoList: zego.ZegoRoomExtraInfo[]) => void;
    /**
     * 房间 Token 鉴权将要过期的回调通知。
     *
     * 支持版本：2.8.0 及以上。
     * 详情描述：房间 Token 鉴权将要过期的回调通知，请用户通过 [renewToken] 函数更新房间 Token 鉴权。
     * 业务场景：为了防止炸麦场景，需要对登录房间、推流等操作进行鉴权控制，提高安全性。
     * 通知时机：在 Token 过期前 30 秒，SDK 会通过 onRoomTokenWillExpire 回调发出通知。
     * 使用限制：无。
     * 注意事项：Token 中包含用户的房间权限、推流权限、有效时间等重要信息，详情请参考 https://doc-zh.zego.im/article/10360
     * 相关接口：当开发者收到此回调后，可通过 [renewToken] 来更新 token 鉴权信息。
     *
     * @param roomID 用户已登录的房间 ID，最大长度为 128 字节的字符串。
     * @param remainTimeInSecond token 过期前的剩余时间。
     */
    roomTokenWillExpire: (roomID: string, remainTimeInSecond: number) => void;
    /**
     * 推流状态回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在调用推流接口 [startPublishingStream] 成功后，可以通过该回调函数获取推流状态变更的通知。开发者可根据 state 参数是否在 [正在请求推流状态] 来大体判断用户的推流网络情况。
     * 注意事项：参数 [extendedData] 为状态更新附带的扩展信息。若使用 ZEGO 的 CDN 内容分发网络，在推流成功后，该参数的内容的键为 [flv_url_list]、[rtmp_url_list]、[hls_url_list]，分别对应 flv、rtmp、hls 协议的拉流 URL。
     * 相关回调：在调用拉流接口 [startPlayingStream] 成功后，可以通过回调函数 [onPlayerStateUpdate] 获取拉流状态变更的通知。开发者可根据 state 参数是否在 [正在请求拉流状态] 来大体判断用户的拉流网络情况。
     *
     * @param streamID 推流的流 ID。
     * @param state 推流状态。
     * @param errorCode 推流状态变更对应的错误码。请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
     * @param extendedData 状态更新附带的扩展信息，包含CDN拉流地址。
     */
    publisherStateUpdate: (streamID: string, state: zego.ZegoPublisherState, errorCode: number, extendedData: string) => void;
    /**
     * 推流质量回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在调用推流接口 [startPublishingStream] 成功后默认3秒(该时间如果需要变更，请联系 ZEGO 技术支持配置)会收到此回调，通过该回调可以获取推送的音视频流的采集帧率，码率，RTT，丢包率等质量数据。开发者可根据此函数的质量参数实时监控推送的音视频流的健康情况，以便在设备 UI 界面上实时展示上行网络状况。
     * 注意事项：若开发者不清楚该回调函数的各个参数应该如何使用，可以只关注其中的 [quality] 参数的 [level] 字段，这是 SDK 内部根据质量参数计算的一个描述上行网络的综合值。
     * 相关回调：当调用拉流接口 [startPlayingStream] 成功后每3秒会收到回调 [onPlayerQualityUpdate]，开发者可根据拉取的音视频流的帧率，码率，RTT，丢包率等质量数据，实时监控拉取流的健康情况。
     *
     * @param streamID 推流的流 ID。
     * @param quality 推流质量，包含了音视频帧率、码率、RTT 等值。
     */
    publisherQualityUpdate: (streamID: string, quality: zego.ZegoPublishStreamQuality) => void;
    /**
     * 音频采集首帧回调接口。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：SDK 启动麦克风采集到第一帧音频数据时会收到此回调。若未收到该回调,说明音频采集设备被占用或异常。
     * 通知时机：SDK内部的音视频模块的引擎启动时，SDK 会去采集本机设备的音频数据，此时会收到该回调。
     * 相关回调：通过回调函数[onPublisherCapturedVideoFirstFrame] 判断 SDK 是否真正采集到了视频数据，通过回调[onPublisherRenderVideoFirstFrame] 判断 SDK 是否渲染完了采集到的第一帧视频数据。
     */
    publisherCapturedAudioFirstFrame: () => void;
    /**
     * 视频采集首帧回调接口。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：SDK 启动摄像头采集到第一帧视频数据时会收到此回调。若未收到该回调，说明视频采集设备被占用或异常。
     * 通知时机：SDK 内部的音视频模块的引擎启动时，SDK 会去采集本机设备的视频数据，此时会收到该回调。
     * 相关回调：通过回调函数 [onPublisherCapturedAudioFirstFrame] 判断 SDK 是否真的采集到音频数据，通过回调 [onPublisherRenderVideoFirstFrame] 判断 SDK 是否渲染完采集到的第一帧视频数据。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道，如果只推一路音视频流，可以不关注该参数。
     */
    publisherCapturedVideoFirstFrame: (channel: zego.ZegoPublishChannel) => void;
    /**
     * 推流端视频渲染首帧回调。
     *
     * 支持版本：2.4.0 及以上。
     * 详情描述：SDK 渲染完采集到的第一帧视频数据时会收到此回调，该接口为预览渲染，自定义视频采集内部预览才有首帧回调，如果不是 SDK 渲染没有此回调。
     * 相关回调：调用推流函数 [startPublishingStream] 成功后, 通过回调函数 [onPublisherCapturedAudioFirstFrame] 判断 SDK 是否真的采集到音频数据，通过回调 [onPublisherCapturedVideoFirstFrame] 判断 SDK 是否真的采集到视频数据。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道，如果只推一路音视频流，可以不关注该参数。
     */
    publisherRenderVideoFirstFrame: (channel: zego.ZegoPublishChannel) => void;
    /**
     * 采集视频大小变更回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当在未推流 [startPublishingStream] 或未预览 [startPreview] 的情况下，首次推流或首次预览，即 SDK 内部的音视频模块的引擎启动时，会去采集本机设备的视频数据，此时采集分辨率会改变。
     * 通知时机：推流 [startPublishingStream] 成功后，在推流中途如果有改变视频采集分辨率发生变化将会收到此回调。
     * 业务场景：开发者可以根据此回调来去除本地预览的 UI 的遮盖等类似操作。也可以根据该回调的分辨率来动态调整预览视图的比例等。
     * 注意事项：外部采集时通知的是编码分辨率大小变化，会受到流控影响。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param width 视频采集分辨率宽。
     * @param height 视频采集分辨率高。
     * @param channel 推流通道，如果只推一路音视频流，可以不关注该参数。
     */
    publisherVideoSizeChanged: (width: number, height: number, channel: zego.ZegoPublishChannel) => void;
    /**
     * 添加/删除转推 CDN 地址状态回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：开发者可根据该回调判断转推 CDN 的音视频流是否正常，若不正常根据异常原因进一步定位转推 CDN 的音视频流异常的原因，以及做对应的容灾策略。
     * 通知时机：在 ZEGO RTC 服务器将音视频流转推到 CDN 后，如果 CDN 转推状态发生变化，例如出现转推停止或转推重试，将会收到此回调。
     * 注意事项：若对异常的原因不了解，可联系 ZEGO 技术人员分析具体异常的原因。
     *
     * @param streamID 推流的流 ID。
     * @param infoList 当前 CDN 正在转推的信息列表。
     */
    publisherRelayCDNStateUpdate: (streamID: string, infoList: zego.ZegoStreamRelayCDNInfo[]) => void;
    /**
     * 拉流状态变更回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在调用拉流接口 [startPlayingStream] 成功后，可以通过该回调函数获取拉流状态变更的通知。开发者可根据 state 参数是否在 [正在请求拉流状态] 来大体判断用户的拉流网络情况。
     * 通知时机：在调用拉流接口 [startPlayingStream] 成功后，拉流状态变更时。
     * 相关回调：在调用推流接口 [startPublishingStream] 成功后，可以通过回调函数 [onPublisherStateUpdate] 获取推流状态变更的通知。开发者可根据 state 参数是否在 [正在请求推流状态] 来大体判断用户的推流网络情况。
     *
     * @param streamID 流 ID。
     * @param state 拉流状态。
     * @param errorCode 拉流状态变更对应的错误码。请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
     * @param extendedData 状态更新附带的扩展信息。备用，目前仅返回空 json 表。
     */
    playerStateUpdate: (streamID: string, state: zego.ZegoPlayerState, errorCode: number, extendedData: string) => void;
    /**
     * 拉流质量回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在调用拉流接口 [startPlayingStream] 成功后每3秒(该时间如果需要变更，请联系 ZEGO 技术支持配置)会收到此回调，通过该回调可以获取拉取的音视频流的帧率，码率，RTT，丢包率等质量数据。
     * 业务场景：开发者可根据此函数的质量参数实时监控拉取的音视频流的健康情况，以便在设备 UI 界面上实时展示下行网络状况。
     * 注意事项：若开发者不清楚该回调函数的各个参数应该如何使用，可以只关注其中的 quality 参数的 level 字段，这是 SDK 内部根据质量参数计算的一个描述下行网络的综合值。
     * 相关回调：当调用推流接口 [startPublishingStream] 成功后每3秒会收到回调 [onPublisherQualityUpdate]，开发者可根据推送的音视频流的帧率，码率，RTT，丢包率等质量数据，实时监控推送流的健康情况。
     *
     * @param streamID 拉流的流 ID。
     * @param quality 拉流质量，包含了音视频帧率、码率、RTT 等值。
     */
    playerQualityUpdate: (streamID: string, quality: zego.ZegoPlayStreamQuality) => void;
    /**
     * 拉流媒体事件回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：该回调用于接收拉流媒体事件。
     * 业务场景：开发者可以根据此回调对卡顿情况做统计或在 App 的 UI 界面做友好的展示。
     * 通知时机：在调用拉流接口 [startPlayingStream]后，当拉流发生音视频卡顿以及恢复等事件发生时会触发此回调。
     *
     * @param streamID 拉流的流 ID。
     * @param event 拉流时收到的具体事件。
     */
    playerMediaEvent: (streamID: string, event: zego.ZegoPlayerMediaEvent) => void;
    /**
     * 拉流端音频接收首帧回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：调用拉流函数 [startPlayingStream] 成功后，SDK 接收到第一帧音频数据时会收到此回调。
     * 业务场景：开发者可用该回调来统计首帧耗时或更新播放流的 UI 组件。
     * 通知时机：SDK 从网络接收到第一帧音频数据时，会收到该回调。
     * 相关回调：调用拉流函数 [startPlayingStream] 成功后, 通过回调函数 [onPlayerRecvVideoFirstFrame] 判断 SDK 是否接收到视频数据，通过回调 [onPlayerRenderVideoFirstFrame] 判断 SDK 是否渲染完接收到的第一帧视频数据。
     *
     * @param streamID 拉流的流 ID。
     */
    playerRecvAudioFirstFrame: (streamID: string) => void;
    /**
     * 拉流端视频接收首帧回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：调用拉流函数 [startPlayingStream] 成功后，SDK 接收到第一帧视频数据时会收到此回调。
     * 业务场景：开发者可用该回调来统计首帧耗时或更新播放流的 UI 组件。
     * 通知时机：SDK 从网络接收到第一帧视频数据时，会收到该回调。
     * 相关回调：调用拉流函数 [startPlayingStream] 成功后, 通过回调函数 [onPlayerRecvAudioFirstFrame] 判断 SDK 是否接收到音频数据，通过回调 [onPlayerRenderVideoFirstFrame] 判断 SDK 是否渲染完接收到的第一帧视频数据。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 拉流的流 ID。
     */
    playerRecvVideoFirstFrame: (streamID: string) => void;
    /**
     * 拉流端渲染完视频首帧回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：调用拉流函数 [startPlayingStream] 成功后，SDK 拉流并渲染完第一帧视频数据后会收到此回调。
     * 业务场景：开发者可用该回调来统计首帧耗时或更新播放流的 UI 组件。
     * 通知时机：SDK 拉流并渲染完第一帧视频数据后会收到此回调。
     * 相关回调：调用拉流函数 [startPlayingStream] 成功后, 通过回调函数 [onPlayerRecvAudioFirstFrame] 判断 SDK 是否接收到音频数据，通过回调 [onPlayerRecvVideoFirstFrame] 判断 SDK 是否接收到第一帧视频数据。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 拉流的流 ID。
     */
    playerRenderVideoFirstFrame: (streamID: string) => void;
    /**
     * 拉流分辨率变更通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：调用拉流函数 [startPlayingStream] 成功后，当收到视频首帧数据，或推流方通过 [setVideoConfig] 改变编码分辨率，或流控策略生效时，拉流分辨率会发生改变。
     * 业务场景：开发者可根据流的最终分辨率来更新或切换真正播放流的 UI 组件。
     * 通知时机：拉流 [startPlayingStream] 成功后，在拉流中途如果有视频分辨率发生变化将会收到此回调。
     * 注意事项：若拉的是流只有音频数据，则不会收到该回调。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 拉流的流 ID。
     * @param width 视频解码分辨率宽。
     * @param height 视频解码分辨率高。
     */
    playerVideoSizeChanged: (streamID: string, width: number, height: number) => void;
    /**
     * 混流转推 CDN 状态更新通知。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：在 ZEGO RTC 服务器的混流任务的一般情况会以 RTMP 协议将输出流向 CDN 推送，推送过程中出现的状态的变化会从该回调函数通知出来。
     * 业务场景：常用于需要多个视频画面合成一个视频时使用混流，比如教育类，直播老师和学生的画面。
     * 通知时机：开发者调用 [startMixerTask] 函数开始混流后，ZEGO RTC服务器将输出流向CDN推送的时候出现状态变化时。
     * 使用限制：无。
     * 相关回调：可通过 [onMixerSoundLevelUpdate] 获取混流中的每条单流的声浪更新通知。
     * 相关接口：可通过 [startMixerTask] 开始混流任务。
     *
     * @param taskID 混流任务 ID。取值范围：长度不超过256。注意事项：该参数为字符串格式，不可以包含 URL 关键字，例如 'http', '?' 等，否则推拉流失败。仅支持数字，英文字符 和 '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\\'。
     * @param infoList 当前 CDN 正在混流的信息列表。
     */
    mixerRelayCDNStateUpdate: (taskID: string, infoList: zego.ZegoStreamRelayCDNInfo[]) => void;
    /**
     * 混流中的每条单流的声浪更新通知。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：开发者可根据此回调在观众拉混流的 UI 界面显示哪条流的主播在说话的效果。
     * 业务场景：常用于需要多个视频画面合成一个视频时使用混流，比如教育类，直播老师和学生的画面。
     * 通知时机：开发者调用 [startPlayingStream] 函数开始拉混流后，回调通知周期为 100 ms。
     * 使用限制：该回调每 100 ms 触发一次，触发频率不支持设置。由于该回调频率高，请勿在该回调中执行耗时任务或者 UI 操作，以免造成卡顿。
     * 相关回调：可通过 [onMixerRelayCDNStateUpdate] 获取混流转推 CDN 状态更新通知。
     * 相关接口：可通过 [startMixerTask] 开始混流任务。
     *
     * @param soundLevels 混流中每条单流的声浪键值对，key 为每条单流的 soundLevelID，value 为对应的单流的声浪值。取值范围：value 的取值范围为 0.0 ~ 100.0（该取值仅表示回调的声浪取值范围，不表示精度）。
     */
    mixerSoundLevelUpdate: (soundLevels: Map<number, number>) => void;
    /**
     * 自动混流中的每条单流的声浪更新通知
     *
     * 支持版本：2.10.0 及以上。
     * 详情描述：用户可根据此回调获取自动混流时拉取到的每条流的声浪信息，包括 streamID 和声浪值。
     * 业务场景：常用于语聊房场景，用户可根据此回调在观众拉混流时显示哪条流的主播在说话。
     * 通知时机：调用 [startPlayingStream] 函数拉流后触发。
     * 相关接口：可调用 [startAutoMixerTask] 函数，开始自动混流任务。可调用 [stopAutoMixerTask] 函数，停止自动混流任务。
     *
     * @param soundLevels 混流中每条单流的声浪键值对，key 为每条单流的 streamID，value 为对应的单流的声浪值，value 的取值范围为 0.0 ~ 100.0（该取值仅表示回调的声浪取值范围，不表示精度）。
     */
    autoMixerSoundLevelUpdate: (soundLevels: Map<string, number>) => void;
    /**
     * 本地采集音频声浪回调，支持人声检测。
     *
     * 支持版本：2.10.0 及以上。
     * 详情描述：本地采集音频声浪回调。
     * 通知时机：调用 [startSoundLevelMonitor] 函数启动声浪监控器后。
     * 注意事项：
     *   1. 回调通知周期为调用 [startSoundLevelMonitor] 时设置的参数值。
     *   2. 该回调为高频回调，建议不要在回调内部做复杂逻辑处理。
     * 相关接口：通过 [startSoundLevelMonitor] 启动声浪监控，通过回调 [onRemoteSoundLevelUpdate] 或 [onRemoteSoundLevelInfoUpdate] 监控远端拉流音频声浪。
     *
     * @param soundLevelInfo 本地采集的声浪值，取值范围为 0.0 ~ 100.0（该取值仅表示回调的声浪取值范围，不表示精度）。
     */
    capturedSoundLevelInfoUpdate: (soundLevelInfo: zego.ZegoSoundLevelInfo) => void;
    /**
     * 远端拉流音频声浪回调，支持人声检测。
     *
     * 支持版本：2.10.0 及以上。
     * 详情描述：远端拉流音频声浪回调。
     * 通知时机：调用 [startSoundLevelMonitor] 函数启动声浪监控器后，且处于正在拉流 [startPlayingStream] 的状态。
     * 注意事项：回调通知周期为调用 [startSoundLevelMonitor] 时设置的参数值。
     * 相关接口：通过 [startSoundLevelMonitor] 启动声浪监控，通过回调 [onCapturedSoundLevelUpdate] 或 [onCapturedSoundLevelInfoUpdate] 监控本地拉流音频声浪。
     *
     * @param soundLevelInfos 远端的声浪键值对，key 为流 ID，value 为对应的流的声浪值，value 取值范围为 0.0 ~ 100.0（该取值仅表示回调的声浪取值范围，不表示精度）。
     */
    remoteSoundLevelUpdate: (soundLevelInfos: Map<string, zego.ZegoSoundLevelInfo>) => void;
    /**
     * 本地设备异常通知。
     *
     * 支持版本：2.15.0 及以上。
     * 详情描述：本地设备异常。
     * 通知时机：当本地音频或视频设备功能出现异常时会触发此回调。
     *
     * @param exceptionType 设备异常类型。
     * @param deviceType 发生异常的设备类型。
     * @param deviceID 设备 ID。目前仅支持桌面端设备，用于标识具体的设备；对于移动端设备，此参数将返回空字符串。
     */
    localDeviceExceptionOccurred: (exceptionType: zego.ZegoDeviceExceptionType, deviceType: zego.ZegoDeviceType, deviceID: string) => void;
    /**
     * 远端摄像头设备状态通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：远端摄像头设备状态通知。
     * 业务场景：1v1 教育场景的开发者或者教育小班课场景及相似场景的开发者可以根据此回调来判断远端推流设备的摄像头设备是否正常工作，以及根据相应的 state 初步了解设备出问题的原因。
     * 通知时机：远端摄像头设备状态发生变更时，例如开关摄像头等，通过监听此回调，能够获取远端摄像头相关的事件，可以用于提示用户可能导致视频异常的情况。
     * 注意事项：当从 CDN 拉流时，或对端使用了自定义视频采集时，不会触发此回调。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 拉流的流 ID。
     * @param state 远端摄像头状态。
     */
    remoteCameraStateUpdate: (streamID: string, state: zego.ZegoRemoteDeviceState) => void;
    /**
     * 远端麦克风设备状态通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：远端麦克风设备状态通知。
     * 业务场景：1v1 教育场景的开发者或者教育小班课场景及相似场景的开发者可以根据此回调来判断远端推流设备的麦克风设备是否正常工作，以及根据相应的 state 初步了解设备出问题的原因。
     * 通知时机：远端麦克风设备状态发生变更时，例如开关麦克风等，通过监听此回调，能够获取远端麦克风相关的事件，可以用于提示用户可能导致音频异常的情况。
     * 注意事项：当从 CDN 拉流时，或对端使用了自定义音频采集时（且不是推流到 ZEGO RTC服务器），不会触发此回调。
     *
     * @param streamID 拉流的流 ID。
     * @param state 远端麦克风状态。
     */
    remoteMicStateUpdate: (streamID: string, state: zego.ZegoRemoteDeviceState) => void;
    /**
     * 远端扬声器设备状态通知。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：远端扬声器设备状态通知。
     * 业务场景：1v1 教育场景的开发者或者教育小班课场景及相似场景的开发者可以根据此回调来判断远端推流设备的扬声器设备是否正常工作，以及根据相应的 state 初步了解设备出问题的原因。
     * 通知时机：远端扬声器设备状态发生变更时，例如开关扬声器等，通过监听此回调，能够获取远端扬声器相关的事件。
     * 注意事项：此回调当从 CDN 拉流时不会回调。
     *
     * @param streamID 拉流的流 ID。
     * @param state 远端扬声器状态。
     */
    remoteSpeakerStateUpdate: (streamID: string, state: zego.ZegoRemoteDeviceState) => void;
    /**
     * 音频设备路由变更通知。
     *
     * 支持版本：1.20.0 及以上。
     * 详情描述：音频设备路由变更通知。
     * 通知时机：当有耳机插拔、扬声器和听筒切换等音频路由发生变化时会抛出此回调。
     * 平台差异：仅支持 iOS 和 Android。
     *
     * @param audioRoute 当前音频路由。
     */
    audioRouteChange: (audioRoute: zego.ZegoAudioRoute) => void;
    /**
     * 接收房间广播消息通知。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：该回调用于接收相同房间内其他用户发送的广播消息。
     * 业务场景：一般在直播房间人数不超过 500 时使用。
     * 通知时机：调用 [loginRoom] 登录房间之后，如果房间内有用户通过 [sendBroadcastMessage] 函数发送广播消息，则触发此回调。
     * 使用限制：无。
     * 注意事项：用户自己发送的广播消息不会通过此回调得到通知。
     * 相关回调：可通过[onIMRecvBarrageMessage]接收房间弹幕消息，可通过 [onIMRecvCustomCommand] 接收房间自定义信令。
     *
     * @param roomID 房间 ID。取值范围：最大长度为 128 字节。
     * @param messageList 收到的消息列表。取值范围：每次最多接收 50 条消息。
     */
    IMRecvBroadcastMessage: (roomID: string, messageList: zego.ZegoBroadcastMessageInfo[]) => void;
    /**
     * 接收房间弹幕消息通知。
     *
     * 支持版本：1.5.0 及以上。
     * 详情描述：该回调用于接收相同房间内其他用户发送的弹幕消息。
     * 业务场景：一般用于房间内有大量消息收发，且不需要保证消息可靠性的场景，例如直播弹幕。
     * 通知时机：调用 [loginRoom] 登录房间之后，如果房间内有用户通过 [sendBarrageMessage] 函数发送弹幕消息，则触发此回调。
     * 使用限制：无。
     * 注意事项：用户自己发送的弹幕消息不会通过此回调得到通知。在房间内有大量弹幕消息时可能会延迟收到通知，且可能丢失部分弹幕消息。
     * 相关回调：可通过[onIMRecvBroadcastMessage]接收房间广播消息，可通过 [onIMRecvCustomCommand] 接收房间自定义信令。
     *
     * @param roomID 房间 ID。取值范围：最大长度为 128 字节。
     * @param messageList 收到的消息列表。取值范围：每次最多接收 50 条消息。
     */
    IMRecvBarrageMessage: (roomID: string, messageList: zego.ZegoBarrageMessageInfo[]) => void;
    /**
     * 接收自定义信令通知。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：该回调用于接收相同房间内其他用户发送的自定义信令。
     * 业务场景：一般在直播房间人数不超过 500 时使用。
     * 通知时机：调用 [loginRoom] 登录房间之后，如果房间内有其他用户通过 [sendCustomCommand] 函数发送自定义信令给开发者，则触发此回调。
     * 使用限制：无。
     * 注意事项：用户自己发送给自己的自定义信令不会通过此回调得到通知。
     * 相关回调：可通过[onIMRecvBroadcastMessage]接收房间广播消息，可通过 [onIMRecvBarrageMessage] 接收房间弹幕消息。
     *
     * @param roomID 房间 ID。取值范围：最大长度为 128 字节。
     * @param fromUser 信令的发送人。
     * @param command 信令内容。取值范围：最大长度为 1024 字节。
     */
    IMRecvCustomCommand: (roomID: string, fromUser: zego.ZegoUser, command: string) => void;
    /**
     * 本地录制的状态更新回调，当录制过程状态变化时触发。
     *
     * 支持版本：1.10.0 及以上。
     * 详情描述：本地录制的状态更新回调，当录制过程状态变化时触发。
     * 业务场景：开发者应根据此回调来判断文件录制的状态或者进行 UI 的提示等。
     * 通知时机：调用 [startRecordingCapturedData] 后，当录制过程状态变化时触发。
     * 使用限制：无。
     *
     * @param state 文件录制状态。
     * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
     * @param config 录制配置对象。
     * @param channel 推流通道。
     */
    capturedDataRecordStateUpdate: (state: zego.ZegoDataRecordState, errorCode: number, config: zego.ZegoDataRecordConfig, channel: zego.ZegoPublishChannel) => void;
    /**
     * 录制进度更新回调。
     *
     * 支持版本：1.10.0 及以上。
     * 详情描述：本地录制的进度更新回调，录制过程中定时触发。
     * 业务场景：开发者可以此对用户界面进行 UI 的提示等。
     * 通知时机：调用 [startRecordingCapturedData] 后，如果配置了需要回调，录制过程中定时触发。
     * 使用限制：无。
     *
     * @param progress 文件录制过程进度，开发者可以此对用户界面进行 UI 的提示等。
     * @param config 录制配置对象。
     * @param channel 推流通道。
     */
    capturedDataRecordProgressUpdate: (progress: zego.ZegoDataRecordProgress, config: zego.ZegoDataRecordConfig, channel: zego.ZegoPublishChannel) => void;
}
export interface ZegoMediaPlayerListener {
    /**
     * 媒体播放器播放状态回调。
     *
     * 支持版本：1.3.4 及以上。
     * 详情描述：媒体播放器播放状态回调。
     * 通知时机：当媒体播放器的播放状态改变时会触发此回调。
     * 使用限制：无。
     *
     * @param mediaPlayer 回调的播放器实例。
     * @param state 播放器状态。
     * @param errorCode 错误码，详情请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html
     */
    mediaPlayerStateUpdate: (mediaPlayer: zego.ZegoMediaPlayer, state: zego.ZegoMediaPlayerState, errorCode: number) => void;
    /**
     * 媒体播放器网络状态事件回调。
     *
     * 支持版本：1.3.4 及以上。
     * 详情描述：媒体播放器网络状态事件回调。
     * 通知时机：当媒体播放器在播放网络资源时，当缓存数据的状态改变时会触发此回调。
     * 使用限制：只有在播放网络资源时才会触发该回调。
     * 相关接口：[setNetWorkBufferThreshold]。
     *
     * @param mediaPlayer 回调的播放器实例。
     * @param networkEvent 网络状态事件。
     */
    mediaPlayerNetworkEvent: (mediaPlayer: zego.ZegoMediaPlayer, networkEvent: zego.ZegoMediaPlayerNetworkEvent) => void;
    /**
     * 播放器播放进度回调。
     *
     * 支持版本：1.3.4 及以上。
     * 详情描述：媒体播放器播放进度回调。通过调用 [setProgressInterval] 可以设置回调间隔时间。当设置回调间隔为 0 时，停止回调。默认回调间隔为 1 秒。
     * 通知时机：当媒体播放器开始播放资源后会触发此回调。
     * 使用限制：无。
     * 相关接口：[setProgressInterval]。
     *
     * @param mediaPlayer 回调的播放器实例。
     * @param millisecond 进度，单位为毫秒。
     */
    mediaPlayerPlayingProgress: (mediaPlayer: zego.ZegoMediaPlayer, millisecond: number) => void;
}
