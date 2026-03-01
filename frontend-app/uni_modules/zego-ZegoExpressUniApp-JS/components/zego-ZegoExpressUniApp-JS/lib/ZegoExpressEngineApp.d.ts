import * as zego from './ZegoExpressDefines';
import { ZegoEventListener } from './ZegoExpressEventHandler';
export default class ZegoExpressEngine {
    /**
     * Engine singleton instance
     */
    static instance(): ZegoExpressEngine;
    /**
     * 创建 ZegoExpressEngine 单例对象并初始化 SDK。
     *
     * 支持版本：2.14.0 及以上。
     * 详情描述：创建 ZegoExpressEngine 单例对象并初始化 SDK。
     * 调用时机：SDK 其他实例方法调用之前。
     * 使用限制：无。
     * 注意事项：SDK 只支持创建一个实例，如需重复调用 [createEngine] ，则需在第二次调用 [createEngine] 前先调用 [destroyEngine] 函数销毁引擎，否则再次调用此函数返回的都是上次创建的对象。
     *
     * @param profile 用来创建引擎的基础配置信息。
     * @return 引擎单例对象。
     */
    static createEngineWithProfile(profile: zego.ZegoEngineProfile): Promise<ZegoExpressEngine>;
    /**
     * 销毁 ZegoExpressEngine 单例对象并反初始化 SDK。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：销毁 ZegoExpressEngine 单例对象并反初始化 SDK。
     * 调用时机：当不再使用 SDK 时，可以通过本接口释放 SDK 使用的资源。
     * 使用限制：无。
     * 注意事项：使用 [createEngine] 创建单例后，如果单例对象未被创建或已被销毁，调用此函数时，不会收到相关回调。
     */
    static destroyEngine(): Promise<void>;
    /**
     * 设置引擎进阶配置。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：用于开启进阶功能。
     * 调用时机：不同的配置有不同的调用时机要求，详情可咨询 ZEGO 技术支持。
     * 使用限制：无。
     *
     * @param config 引擎进阶配置
     */
    static setEngineConfig(config: zego.ZegoEngineConfig): Promise<void>;
    /**
     * 设置房间模式。
     *
     * 支持版本：2.9.0 及以上。
     * 详情描述：开发者需要使用多房间功能时，需要调用此函数来完成配置。
     * 调用时机：必须在调用 [createEngine] 之前设置才生效，否则会失败。
     * 使用限制：如果需要使用多房间功能，请与即构技术支持联系配置服务端支持。
     * 注意事项：无。
     *
     * @param mode 房间模式。详情描述：用于设置房间模式。业务场景：当需要同时进入多个房间进行推拉流时，可以通过本接口开启多房间模式。是否必填：是。默认值：ZEGO_ROOM_MODE_SINGLE_ROOM。
     */
    static setRoomMode(mode: zego.ZegoRoomMode): Promise<void>;
    /**
     * 获取 SDK 版本号。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在 SDK 在运行过程中若遇到异常，可将问题、日志等信息提交 ZEGO 技术人员定位与排障。开发者也可通过该 API 收集当前 SDK 版本信息，便于 App 运营统计以及关联问题。
     * 调用时机：任意时刻。
     * 使用限制：无。
     * 注意事项：无。
     *
     * @return SDK 版本号。
     */
    static getVersion(): Promise<string>;
    /**
     * 上传日志到 ZEGO 服务器。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：默认情况下，SDK 会在 App 默认目录创建日志文件并打印，每个日志文件默认最大 5MB，三个日志文件循环覆盖写入。当调用此函数时 SDK 会自动将日志文件打包并上传到 ZEGO 服务器。
     * 业务场景：开发者可在 App 提供业务上的“反馈”渠道，当用户反馈的问题属于 ZEGO SDK 时，可调用此函数将 SDK 的本地日志信息上传，并联系 ZEGO 技术支持协助定位用户问题。
     * 调用时机：在 [createEngine] 后。
     * 使用限制：限频每分钟1次。
     * 注意事项：1.在调用本接口上传日志后，如果过快的调用 [destroyEngine] 或 退出 App，则可能存在失败的情况。建议等待几秒，等收到上传成功回调后，再调用 [destroyEngine] 或 退出 App。2.如果希望在 [createEngine] 之前调用，请调用 [submitLog] 接口。
     */
    uploadLog(): Promise<void>;
    /**
     * 调用实验性 API。
     *
     * 支持版本：2.7.0 及以上。
     * 详情描述：ZEGO 通过此 API 提供 RTC 业务中的部分技术预览或特别定制功能，需要获取功能的使用或详情其详情可咨询 ZEGO 技术支持。
     * 调用时机：在 [createEngine] 后。
     *
     * @param params 传入的参数，格式为 JSON 字符串，具体可咨询 ZEGO 技术支持。
     * @return 返回的参数，格式为 JSON 字符串，具体可咨询 ZEGO 技术支持。
     */
    callExperimentalAPI(params: string): Promise<string>;
    /**
     * 注册事件监听
     *
     * @param event 事件类型。
     * @param callback 事件回调。
     */
    on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]): void;
    /**
     * 注销事件监听
     *
     * @param event 时间类型。
     * @param callback 事件回调。
     */
    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: undefined | ZegoEventListener[EventType]): void;
    /**
     * 使用带配置进阶属性的方式登录房间，通过回调参数返回登录结果，推拉流前必须登录房间。
     *
     * 支持版本：2.18.0 及以上。
     * 详情描述：如果房间不存在，[loginRoom] 会创建并登录房间。SDK 用"房间"概念来组织用户，用户必须首先登录某个房间，才能进行一系列关键操作，比如推流 [startPublishingStream]、拉流[startPlayingStream]、收发广播消息 [sendBroadcastMessage] 等。为了防止 App 被恶意用户模拟登录，可以在登录房间之前加上鉴权验证，即 [config] 参数传入的 ZegoRoomConfig 对象中的 [token] 参数。
     * 业务场景：在同一个房间内用户可以进行直播、音视频通话等。
     * 调用时机：在 [createEngine] 初始化 SDK 之后调用该函数。
     * 使用限制：同一房间登录接口的调用频率 (QPS) 有一定限制，详情查阅 https://doc-zh.zego.im/article/7581 或联系 ZEGO 技术支持。
     * 注意事项：
     *   1. 使用不同 appID 的 App 不能互通。
     *   2. SDK 支持拉相同 appID 下非同一个房间的流，即跨房间拉流。由于 SDK 的房间信令的相关回调通知是以相同房间为单位，当开发者想要跨房间拉流时，开发者需自行维护相关的消息及信令通知。
     *   3. 强烈建议 userID 与业务 APP 的用户 ID 一一对应，即一个 userID 与一个真实用户是固定且唯一的，而不应该是以随机的 userID 的方式传给 SDK 的方式。因为唯一且固定的 userID 可以让 ZEGO 技术人员快速定位线上问题。
     *   4. 首次因网络原因登录失败或者房间断开连接之后，SDK 重连默认时间为 20min。
     * 隐私保护申明：请勿在此接口填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。
     * 相关回调：
     *   1. 当用户开始登录房间、登录房间成功或登录房间失败后，将会触发 [onRoomStateChanged] (2.18.0 之前版本不支持，请使用 [onRoomStateUpdate]) 回调通知开发者当前用户连接房间的状态。
     *   2. 登录同一个房间的不同用户可以得到以相同房间为单位的房间信令通知（例如：[onRoomUserUpdate], [onRoomStreamUpdate] 等），一个房间内的用户收不到另一个房间房间信令的通知。
     *   3. 如果由于网络质量原因导致网络临时中断，SDK 内部会自动进行重连。可通过监听 [onRoomStateChanged] (2.18.0 之前版本不支持，请使用 [onRoomStateUpdate]) 回调获取本端当前房间连接状态的变化情况，同时同房间其他用户会接收到 [onRoomUserUpdate] 回调通知。详情请参考 https://doc-zh.zego.im/faq/reconnect
     *   4. 一个房间发的消息（例如 [setStreamExtraInfo], [sendBroadcastMessage], [sendBarrageMessage], [sendCustomCommand] 等）在别的房间无法收到（例如 [onRoomStreamExtraInfoUpdate], [onIMRecvBroadcastMessage], [onIMRecvBarrageMessage], [onIMRecvCustomCommand] 等），目前 ZegoExpressEngine 未提供跨房间消息的能力。开发者可以集成 IM 的 SDK 来实现。
     * 相关接口：
     *   1. 可调用 [logoutRoom] 退出登录，如果没有退出登录而重复调用登录接口(roomID 和 user 保持相同的情况下)，控制台会报错，打印错误码 1002001。
     *   2. 如果需要登录多个房间，请在创建引擎前通过 [ZegoRoomMode] 选择多房间模式，然后调用 [loginRoom] 接口登录多房间。
     *   3. 调用 [destroyEngine] 也会使用户自动退出登录。
     *
     * @param roomID 房间 ID，不得为空，最大长度为 128 字节的字符串。
     *   注意事项：
     *   1.房间 ID 由您自己定义。
     *   2. 仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\'。
     *   3. 如果需要与 Web SDK 互通，请不要使用 '%'。
     * @param user 用户对象实例，配置用户 ID、用户名。 注意事项：注意用户 ID 需要在相同的 appID 下全局唯一，否则会出现后登录的用户踢掉先登录的用户的情况。
     * @param config 房间进阶配置。
     * @return 本次登录房间结果
     */
    loginRoom(roomID: string, user: zego.ZegoUser, config?: undefined | zego.ZegoRoomConfig): Promise<zego.ZegoRoomLoginResult>;
    /**
     * 退出指定房间 ID 的房间，并带有回调。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：该接口会退出房间名为 roomID 的房间。
     * 业务场景：在同一个房间内用户可以进行直播、音视频通话等。
     * 调用时机：登录房间成功后，若不再使用房间功能，用户可以调用函数 [logoutRoom]。
     * 使用限制：无。
     * 注意事项：1. 退出房间会停止该用户的所有推拉流，引擎会停止，SDK 内部会主动停止本地预览。如果切换房间想保留预览能力，请使用 [switchRoom] 函数。2. 若用户登出房间，但传入 roomID 与已登录房间名不同，SDK 会返回失败。
     * 相关回调：调用此函数后会收到 [onRoomStateChanged] (2.18.0 之前版本不支持，请使用 [onRoomStateUpdate]) 回调通知成功退出房间，同时同房间其他用户会接收到 [onRoomUserUpdate] 回调通知（开启 isUserStatusNotify 配置的前提下）。
     * 相关接口：用户可以调用 [loginRoom]、[switchRoom] 函数登录或更换房间。
     *
     * @param roomID 房间 ID，最大长度为 128 字节的字符串。
     *   注意事项：
     *   1. 仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\'。
     *   2. 如果需要与 Web SDK 互通，请不要使用 '%'。
     * @return 本次登出房间结果
     */
    logoutRoom(roomID?: undefined | string): Promise<zego.ZegoRoomLogoutResult>;
    /**
     * 使用配置进阶属性的方式切换房间。
     *
     * 支持版本：1.15.0 及以上。
     * 详情描述：使用此函数可以让用户快速从一个房间切换到另外一个房间。
     * 业务场景：若需要快速切换到下一个房间，可调用此函数。
     * 调用时机：登录房间成功后。
     * 使用限制：无。
     * 注意事项：
     *   1. 当调用此函数后，当前正在推或拉的所有流都将会停止（但本地预览不会停止）。
     *   2. 为了防止 App 被恶意用户模拟登录，可以在切换房间之前加上鉴权验证，即 [config] 参数传入的 ZegoRoomConfig 对象中的 [token] 参数。此参数配置作用于即将切换过去的房间。
     *   3. 3.5.0 版本开始支持多房间模式（使用函数 [setRoomMode] 设置 ZegoRoomMode 为 ZEGO_ROOM_MODE_MULTI_ROOM）。
     *   4. 若登录房间 [loginRoom] 时传入了 Token 进行登录，则调用 [switchroom] 切换房间时，必须使用带有 config 参数的 [switchroom] 接口切换房间，并传入对应 Token 值。
     * 隐私保护申明：请勿在此接口填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。
     * 相关回调：当用户调用 [switchRoom] 函数时，将会触发 [onRoomStateChanged] (2.18.0 之前版本不支持，请使用 [onRoomStateUpdate]) 回调通知开发者当前用户连接房间的状态。
     * 相关接口：用户可以调用 [logoutRoom] 函数退出房间。
     *
     * @param fromRoomID 当前处于的房间 ID。
     * @param toRoomID 需要登录的下一个房间 ID。
     * @param config 房间进阶配置。
     */
    switchRoom(fromRoomID: string, toRoomID: string, config?: undefined | zego.ZegoRoomConfig): Promise<void>;
    /**
     * 更新 token 鉴权信息。
     *
     * 支持版本：2.8.0 及以上。
     * 详情描述：当开发者收到 [onRoomTokenWillExpire] 之后，可使用此 API 更新 token 鉴权信息，保障后续 RTC 功能正常。
     * 业务场景：Token 将要过期时使用。
     * 调用时机：收到 [onRoomTokenWillExpire] 之后。
     * 使用限制：无。
     * 注意事项：token 中包含用户的房间权限、推流权限、有效时间等重要信息，详情请参考 https://doc-zh.zego.im/article/10360
     *
     * @param roomID 房间 ID。
     * @param token 需要更新的 token。
     */
    renewToken(roomID: string, token: string): Promise<void>;
    /**
     * 设置房间附加消息。
     *
     * 支持版本：1.13.0 及以上。
     * 详情描述：用户调用此函数设置房间的附加消息。
     * 业务场景：可以设置一些房间相关的业务属性，比如是否有人在上麦。
     * 调用时机：登录房间成功后。
     * 使用限制：关于此函数的使用限制，请参考 https://doc-zh.zego.im/article/7581 或联系 ZEGO 技术支持。
     * 注意事项：key 非空，key、value 长度有限制，请参考“使用限制”。新设置的 key 和 value 会覆盖旧的设置。
     * 相关回调：相同房间内的其他用户会通过 [onRoomExtraInfoUpdate] 回调函数获得通知。
     * 相关接口：无。
     *
     * @param roomID 房间 ID。
     * @param key 附加消息键。
     * @param value 附加消息值。
     * @return 设置房间附加信息执行结果通知
     */
    setRoomExtraInfo(roomID: string, key: string, value: string): Promise<zego.ZegoRoomSetRoomExtraInfoResult>;
    /**
     * 开始推流，支持多房间模式
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：用户将自己本地的音视频流推送到 ZEGO RTC 服务器 或 CDN，同一房间的其他用户通过 "streamID" 或 CDN 拉流地址就可以拉取该音视频流进行观看。
     * 业务场景：可以用于实时连麦、直播等场景下进行推流。
     * 调用时机：调用 [loginRoom] 加入房间后调用该函数。
     * 使用限制：无。
     * 注意事项：
     *   1. 开始推流前，用户可选择调用 [setVideoConfig] 设置相关视频参数，调用 [startPreview] 进行视频预览。
     *   2. 当推流成功之后，同房间内其他用户可通过监听 [onRoomStreamUpdate] 回调来获取流的新增情况。
     *   3. 在网络质量不佳的情况下，用户推流可能出现中断，SDK 会尝试重连并推流（连接成功后 SDK 会自动进行推流），开发者可通过监听 [onPublisherStateUpdate] 事件来获知当前推流状态以及错误信息。详情请参考 https://doc-zh.zego.im/faq/reconnect
     *   4. 调用 [SetRoomMode] 函数选择多房间，必须明确指定房间 ID。
     *
     * @param streamID 流 ID，长度不超过 256 的字符串。
     *   注意事项：
     *   1. 流 ID 由您自己定义。
     *   2. 需要在整个 AppID 内全局唯一，若出现在同一个 AppID 内，不同的用户各推了一条流且流名相同，将会导致后推流的用户推流失败。
     *   3. 仅支持数字，英文字符 和 '-', '_'。
     * @param channel 推流通道。
     * @param config 推流进阶配置。
     */
    startPublishingStream(streamID: string, channel?: undefined | zego.ZegoPublishChannel, config?: undefined | zego.ZegoPublisherConfig): Promise<void>;
    /**
     * 停止推流，可停止指定通道的音视频流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：用户停止发送本地的音视频流，房间内其他用户会收到流删除通知。
     * 业务场景：可以用于实时连麦、直播等场景下停止推流。
     * 调用时机：调用 [startPublishingStream] 开始推流后。
     * 使用限制：无。
     * 注意事项：
     *   1. 在停止推流之后，同房间内其他用户可通过监听 [onRoomStreamUpdate] 回调来收到流的删除通知。
     *   2. 如果用户已经启动推流，在推送新流（与之前的 streamID 不同）之前，必须要调用此函数停止当前流的推送，否则新流推送会返回失败。
     *   3. 在停止推流之后，开发者应该根据业务情况来决定是否需要停止本地预览。
     *
     * @param channel 推流通道。
     */
    stopPublishingStream(channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置指定推流通道的流附加信息。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：可通过此函数设置当前推流的流附加信息。流附加信息是流 ID 的附加信息标识，不同于流 ID 在推流过程中不可修改，流附加信息可以在对应流 ID 的推流中途修改。开发者可根据流附加信息来实现流 ID 相关的可变内容的同步。
     * 调用时机：在创建引擎 [createEngine] 之后，在推流 [startPublishingStream] 前后调用都可生效。
     * 使用限制：无。
     * 相关回调：结果会通过 [ZegoPublisherSetStreamExtraInfoCallback] 回调通知。
     *
     * @param extraInfo 流附加信息，长度不超过1024的字符串。
     * @param channel 推流通道。
     * @return 设置流附加信息执行结果通知。
     */
    setStreamExtraInfo(extraInfo: string, channel?: undefined | zego.ZegoPublishChannel): Promise<zego.ZegoPublisherSetStreamExtraInfoResult>;
    /**
     * 启动/更新本地预览，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：用户通过调用此函数可以看到自己本地的画面。
     * 业务场景：可以用于实时连麦、直播等场景下的本地预览。
     * 调用时机：调用 [createEngine] 后。
     * 使用限制：无。
     * 注意事项：1. 预览功能不需要先登录房间或推流，但是在退出房间之后 SDK 内部默认会主动停止预览。2. 可以通过再次调用此函数来切换视图或修改预览模式(ZegoViewMode)。用户只能在一个视图上预览，如果再次调用 [startPreview] 传入新的视图，则预览画面只会在新视图展现。3. 可以通过调用 [setVideoMirrorMode] 函数来设置预览画面的镜像模式，移动端默认开启预览画面的镜像效果。4. 调用此函数后，SDK 会启动音视频引擎，并尝试采集音频与视频。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道
     */
    startPreview(channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 停止本地预览，支持设置其他通道的推流
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当本地不需要预览时可调用此函数停止预览。
     * 注意事项：停止预览不会影响推流、拉流功能。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道
     */
    stopPreview(channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置视频配置，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：设置视频帧率、码率、视频采集分辨率、视频编码输出分辨率等视频配置。
     * 业务场景：不同业务场景下的建议配置 https://doc-zh.zego.im/article/10365
     * 默认值：默认视频采集分辨率为 360p，视频编码输出分辨率为 360p，码率为 600 kbps，帧率为 15 fps。
     * 调用时机：调用 [createEngine] 之后。
     * 使用限制：需要在 [startPreview] 前调用。在 [startPreview] 之后调用无法修改采集分辨率，仅支持修改编码分辨率和码率。
     * 注意事项：移动端分辨率的宽高与 PC 端分辨率的宽高是相反的，例：移动端的 360p 的分辨率为 360x640，而 PC 端 360p 的分辨率为 640x360。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param config 视频配置，SDK 提供常用的分辨率、帧率和码率的组合值，也可自定义分辨率、帧率和码率。
     * @param channel 推流通道。
     */
    setVideoConfig(config: zego.ZegoVideoConfigPreset | zego.ZegoVideoConfig, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 获取当前视频配置，支持设置其他通道的推流
     *
     * 可通过此函数获取指定推流通道当前的视频帧率、码率，视频采集分辨率，视频编码输出分辨率。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道
     * @return 视频配置对象
     */
    getVideoConfig(channel?: undefined | zego.ZegoPublishChannel): Promise<zego.ZegoVideoConfig>;
    /**
     * 设置镜像模式，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：设置本地预览视频以及推送的视频是否开启镜像模式，具体镜像模式可以参考 https://doc-zh.zego.im/article/10365
     * 调用时机：调用 [createEngine] 之后。
     * 使用限制：只有 SDK 负责渲染时该设置才有效。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param mirrorMode 预览或推流的镜像模式。
     * @param channel 推流通道。
     */
    setVideoMirrorMode(mirrorMode: zego.ZegoVideoMirrorMode, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置采集视频的朝向，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：设置视频的朝向，详细的介绍可参考文档 https://doc-zh.zego.im/faq/express_video_capture_rotation
     * 业务场景：用户使用移动设备进行直播或视频通话时，可以根据现场设置不同的视频方向。
     * 调用时机：调用 [createEngine] 之后。
     * 使用限制：目前只支持 iOS 和 Android 平台。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param orientation 视频的朝向。
     * @param channel 推流通道。
     */
    setAppOrientation(orientation: zego.ZegoOrientation, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置指定推流通道的音频质量配置。
     *
     * 支持版本：1.3.4 及以上。
     * 详情描述：可通过此函数设置音频编码类型、码率、音频声道的组合值。若预设的值无法满足开发者的场景，开发者可自行根据业务要求设置符合的参数。
     * 默认值：默认的音频配置参考 [ZegoAudioConfig] 的默认值。
     * 调用时机：在创建引擎 [createEngine] 后，且在推流 [startPublishingStream] 前设置。
     * 使用限制：无。
     * 相关接口：[getAudioConfig]。
     *
     * @param config 音频质量配置。
     * @param channel 推流通道。
     */
    setAudioConfig(config: zego.ZegoAudioConfig, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 获取指定推流通道的当前音频质量配置。
     *
     * 支持版本：1.8.0 及以上。
     * 详情描述：可通过此函数获取当前的音频编码类型、码率、音频声道的组合值。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 相关接口：[setAudioConfig]。
     *
     * @param channel 推流通道。
     * @return 音频质量配置。
     */
    getAudioConfig(channel?: undefined | zego.ZegoPublishChannel): Promise<zego.ZegoAudioConfig>;
    /**
     * 对指定推流通道的推流画面截图。
     *
     * 支持版本：1.17.0 及以上。
     * 详情描述：对推流画面进行截图。
     * 调用时机：在调用 [startPublishingStream] 或 [startPreview] 后调用此函数。
     * 使用限制：无。
     * 注意事项：截图的分辨率为 [setVideoConfig] 里设置的编码分辨率，若需改为采集分辨率，请调用 [setCapturePipelineScaleMode] 将采集缩放时机模式改为 [Post]。
     * 相关回调：截图结果会通过 [ZegoPublisherTakeSnapshotCallback] 回调。
     * 相关接口：[takePlayStreamSnapshot]。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道。
     * @return 推流画面截图结果回调。
     */
    takePublishStreamSnapshot(channel?: undefined | zego.ZegoPublishChannel): Promise<zego.ZegoPublisherTakeSnapshotResult>;
    /**
     * 停止或恢复发送指定推流通道的音频流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：推流时可调用此函数实现不推音频数据流，本地仍会采集和处理音频，但向网络发送静音帧数据包。
     * 业务场景：用户不希望推出任何音频数据时，可以调用该接口。该接口不影响 [onBeforeAudioPrepAudioData]。
     * 调用时机：在创建引擎 [createEngine] 后调用生效。
     * 使用限制：无。
     * 相关回调：如果在本地设置了停止发送音频流，拉本地流的远端用户可以通过监听 [onRemoteMicStateUpdate] 回调收到 `Mute` 的状态变更通知。
     * 相关接口：[mutePublishStreamVideo]。
     *
     * @param mute 是否停止发送音频流；true 表示不发送音频流；false 表示发送音频流；默认为 false。
     * @param channel 推流通道。
     */
    mutePublishStreamAudio(mute: boolean, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 停止或恢复发送指定推流通道的视频流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：推流时可调用此函数实现不推视频流，本地摄像头仍能正常工作，能正常采集，预览和处理视频画面，但不向网络发送视频数据。
     * 调用时机：在创建引擎 [createEngine] 后调用生效。
     * 使用限制：无。
     * 相关回调：如果在本地设置了停止发送视频流，拉本地流的远端用户可以通过监听 [onRemoteCameraStateUpdate] 回调收到 `Mute` 的状态变更通知。
     * 相关接口：[mutePublishStreamAudio]。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param mute 是否停止发送视频流；true 表示只发送音频流不发送视频流；false 表示同时发送音频和视频流；默认为 false。
     * @param channel 推流通道。
     */
    mutePublishStreamVideo(mute: boolean, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 开始或停止指定推流通道的流量控制。
     *
     * 支持版本：1.5.0 及以上。
     * 详情描述：开启流量控制可以使 SDK 根据当前上行网络环境状况，或者在1 对1 互动场景下根据对方下行网络环境状况，调节音视频推流码率大小，以保障效果流畅。同时，可进一步指定流量控制的属性来调整相应的控制策略。
     * 默认值：默认开启。
     * 调用时机：在创建引擎 [createEngine] 后，在推流 [startPublishingStream] 之前调用生效。
     * 使用限制：仅支持 RTC 推流。
     *
     * @param enable 是否使用流量控制；true 表示开启流控；false 表示关闭流控；默认为 true。
     * @param property 流量控制的属性，位掩码格式。具体可设置为 [ZegoTrafficControlProperty] 的属性的一个或多个枚举组合。默认为 AdaptiveFPS。
     * @param channel 推流通道。
     */
    enableTrafficControl(enable: boolean, property: number, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置指定推流通道的流量控制视频码率最低值
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：设置流量控制时视频码率达到最低阈值时的控制策略。当码率低于最低阈值时，可以选择不发送视频数据或者以极低帧率发送。
     * 默认值：无视频码率最低阈值的控制效果。
     * 调用时机：在创建引擎 [createEngine] 后，在推流 [startPublishingStream] 前调用生效。
     * 使用限制：必须开启流量控制 [enableTrafficControl]。
     * 相关接口：[enableTrafficControl]。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param bitrate 最低视频码率，单位为 kbps。
     * @param mode 低于最低码率时的视频发送模式。
     * @param channel 推流通道。
     */
    setMinVideoBitrateForTrafficControl(bitrate: number, mode: zego.ZegoTrafficControlMinVideoBitrateMode, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置推流端采集音量。
     *
     * 支持版本：1.13.0 及以上。
     * 详情描述：此函数用于在设备采集音量的基础上做增益处理，本端用户可控制往远端发送音频流的声音大小。
     * 默认值：默认为 100。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：在推流途中可以动态设置采集音量。
     * 相关接口：设置拉流音量 [setPlayVolume]。
     *
     * @param volume 音量增益百分比，范围为 0 ~ 200，默认值为 100，表示为设备原始采集音量的 100%.
     */
    setCaptureVolume(volume: number): Promise<void>;
    /**
     * 增加转推至 CDN 的 URL。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：将 ZEGO RTC 服务器的音视频流转推至自定义的 CDN 内容分发网络，延迟高但是支持高并发拉流。
     * 业务场景：1. 常用于对延迟没有特别高要求的大规模直播场景。2. 由于 ZEGO RTC 服务器本身可配置支持 CDN 内容分发网络，此函数主要为自身拥有 CDN 内容分发服务的开发者使用。3. 此函数支持动态转推至多个 CDN 内容分发网络，因此开发者可以使用此函数来作为 CDN 内容分发服务的一个容灾方案。
     * 调用时机：在调用 [createEngine] 函数创建引擎后。
     * 使用限制：当调用 [enablePublishDirectToCDN] 函数设置为 true 将流直推到 CDN 时，再调用本函数将无效。
     * 注意事项：删除转推至 CDN 的 URL 需要调用 [removePublishCdnUrl]，调用 [stopPublishingStream] 不会删除转推至 CDN 的 URL。
     * 相关接口：删除转推至 CDN 的 URL [removePublishCdnUrl]，结果回调函数 [onPublisherRelayCDNStateUpdate]。
     *
     * @param streamID 流 ID。
     * @param targetURL CDN 转推地址，支持的转推地址格式有 rtmp, rtmps.
     * @return 更新 CDN 转推结果通知。
     */
    addPublishCdnUrl(streamID: string, targetURL: string): Promise<zego.ZegoPublisherUpdateCdnUrlResult>;
    /**
     * 删除转推至 CDN 的 URL。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当已经通过 [addPublishCdnUrl] 添加了某个 CDN 转推地址，需要将流停止转推时调用此函数。
     * 调用时机：在调用 [createEngine] 函数创建引擎后，不需要继续转推至 CDN 时。
     * 使用限制：当调用 [enablePublishDirectToCDN] 函数设置为 true 将流直推到 CDN 时，再调用本函数将无效。
     * 注意事项：此函数并不会停止推往 ZEGO RTC 服务器的音视频流。
     * 相关接口：增加转推至 CDN 的 URL [addPublishCdnUrl]，结果回调函数 [onPublisherRelayCDNStateUpdate]。
     *
     * @param streamID 流 ID。
     * @param targetURL CDN 转推地址，支持的转推地址格式有 rtmp.
     * @return 更新 CDN 转推结果通知。
     */
    removePublishCdnUrl(streamID: string, targetURL: string): Promise<zego.ZegoPublisherUpdateCdnUrlResult>;
    /**
     * 是否直接推流到 CDN（不经过 ZEGO RTC 服务器）, 支持设置其他通道的推流。
     *
     * 支持版本：1.5.0 及以上。
     * 详情描述：是否不经过 ZEGO RTC 服务器直接推流到 CDN。
     * 业务场景：常用于对延迟没有特别高要求的大规模直播场景。
     * 默认值：默认为 false，不开启直推。
     * 调用时机：在创建引擎 [createEngine]后，开始推流[startPublishingStream] 前。
     * 注意事项：直推 CDN 功能在网络传输过程中不经过 ZEGO 实时音视频云，无法使用 ZEGO 的超低延迟音视频服务。
     * 相关接口：动态转推至 CDN 函数 [addPublishCdnUrl]、[removePublishCdnUrl]。
     *
     * @param enable 是否开启直推 CDN；true 表示开启直推 CDN；false 表示不开启直推 CDN；默认为 false。
     * @param config CDN 配置，若为 null 则使用 Zego 的后台配置。
     * @param channel 推流通道。
     */
    enablePublishDirectToCDN(enable: boolean, config: zego.ZegoCDNConfig, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置推流水印，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：给推流画面设置水印。
     * 业务场景：常用于标识推流来源的场景。
     * 调用时机：在调用 [createEngine] 函数创建引擎后。
     * 注意事项：水印的布局不能超出推流的视频编码分辨率。可在推流前或推流中途任意时刻设置。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param watermark 水印布局左上角为坐标系原点，区域不能超过编码分辨率设置的大小。若为空表示取消水印。
     * @param isPreviewVisible 是否本地预览能看见水印。
     * @param channel 推流通道。
     */
    setPublishWatermark(watermark: zego.ZegoWatermark, isPreviewVisible: boolean, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 开/关硬件编码。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：推流时是否采用硬件编码的开关，开启硬解编码后会使用 GPU 进行编码，降低 CPU 使用率。
     * 调用时机：在推流前设置才能生效，如果在推流后设置，停推后重新推流可以生效。
     * 注意事项：由于少部分机型设备硬编支持不是特别好，SDK 默认使用软件编码的方式。若开发者在某些机型测试时发现推大分辨率音视频流时设备发热严重，可考虑调用此函数开启硬编的方式。
     *
     * @param enable 是否开启硬件编码；true 表示开启硬编；false 表示关闭硬编；默认为 false。
     */
    enableHardwareEncoder(enable: boolean): Promise<void>;
    /**
     * 设置关闭摄像头时所推静态图片的路径
     *
     * 支持版本：2.9.0 及以上。
     * 详情描述：设置关闭摄像头时所推静态图片的路径。开始正常推流后，调用 enableCamera(false) 时会开始推静态图片，调用 enableCamera(true) 时会结束推静态图片。
     * 业务场景：开发者希望关闭摄像头时，显示静态图片。例如，主播退后台的时候，会主动关闭摄像头，此时观众侧需要展示主播暂时离开的图片。
     * 调用时机：初始化引擎之后，关闭摄像头前调用本 API 进行参数配置，在关闭摄像头后，即可推静态图片。
     * 使用限制：
     *   1. 图片支持类型为 JPEG/JPG、PNG、BMP、HEIF。
     *   2. 该接口只对 SDK 视频采集有效，对自定义视频采集不生效。
     *   3. 不支持图片路径是网络链接。
     * 注意事项：
     *   1. 本地预览无法看到该静态图片。
     *   2. 外部滤镜、水印、镜像、截图都不会生效。
     *   3. 如果图片宽高比与设定的编码宽高比不一致，会按照编码宽高比进行裁剪。
     * 平台差异：
     *   1. Windows：直接填写图片位置，如"D://dir//image.jpg"。
     *   2. iOS/macOS：如果是完整路径则添加 "file:" 前缀，如：@"file:/var/image.png"。资产则添加 "asset:" 前缀，如：@"asset:watermark"。
     *   3. Android：如果是完整路径则添加 "file:" 前缀，如："file:/sdcard/image.png"。“assets” 目录下的图片则添加 "asset:" 前缀，如："asset:watermark.png"。
     *   4. Flutter：如果是绝对路径则添加 "file:" 前缀，如："file:/sdcard/image.png"。“assets” 资源中的图片则添加 "flutter-asset://" 前缀，如："flutter-asset://assets/watermark.png"。
     *
     * @param filePath 图片路径
     * @param channel 推流通道。
     */
    setDummyCaptureImagePath(filePath: string, channel: zego.ZegoPublishChannel): Promise<void>;
    /**
     * 开始拉流（从 ZEGO RTC 服务器或第三方 CDN），支持多房间模式。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：从 ZEGO RTC 服务器或第三方 CDN 拉取远端用户的音视频流进行互通。
     * 业务场景：在实时连麦或直播场景下，开发者可通过监听 [onRoomStreamUpdate] 事件回调来获取所在房间内新增的流信息，并调用此接口传入 "streamID" 进行拉流操作。
     * 调用时机：调用 [loginRoom] 加入房间后调用该函数。
     * 使用限制：无。
     * 注意事项：1. 开发者可通过再次调用此函数实现切换拉流 canvas 的操作（streamID 必须一样）。同一条流只能在唯一的视图中拉取展示，如果调用 [startPlayingStream] 传入相同的 "streamID" 和不同的视图，画面只会在新视图展现。2. 首次拉流时如果因网络原因拉流失败或拉流中断，SDK 会在 20min 内多次尝试重连并拉流。3. 在网络质量不佳的情况下，用户拉流可能出现中断，SDK 会尝试重连并拉流，可通过监听 [onPlayerStateUpdate] 事件来获知当前拉流状态以及错误信息。详情请参考 https://doc-zh.zego.im/faq/reconnect 4. 如果拉取不存在的 "streamID"，SDK 会持续尝试拉取，在该 streamID 对应的音视频流被成功推送后，该流可以真正被拉取到。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 流 ID，长度不超过 256 字节的字符串。
     *   注意事项：
     *   仅支持数字，英文字符 和 '-', '_'。
     * @param config 拉流进阶配置, [ZegoPlayerConfig] 中房间 [roomID] 为登录的房间ID。
     */
    startPlayingStream(streamID: string, config?: undefined | zego.ZegoPlayerConfig): Promise<void>;
    /**
     * 停止拉流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：停止从 ZEGO RTC 服务器拉取远端用户的音视频流。
     * 业务场景：在实时连麦场景下，开发者可通过监听 [onRoomStreamUpdate] 事件回调来获取所在房间内删除的流信息，并调用此接口传入 "streamID" 进行停止拉流操作。
     * 调用时机：调用 [loginRoom] 加入房间后调用该函数。
     * 使用限制：无。
     * 注意事项：停止拉流后对此条流此前设置的属性如 [setPlayVolume]、[mutePlayStreamAudio]、[mutePlayStreamVideo] 等拉流相关的配置都会失效，需要在下次拉流之前重新设置。
     *
     * @param streamID 流 ID。
     */
    stopPlayingStream(streamID: string): Promise<void>;
    /**
     * 拉流画面截图。
     *
     * 支持版本：1.17.0 及以上。
     * 详情描述：对指定拉流ID画面截图。
     * 调用时机：[startPlayingStream]后调用。
     * 使用限制：无。
     * 相关回调：[onPlayerTakeSnapshotResult] 截图数据回调。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 要截图的流 ID。
     * @return 拉流画面截图结果回调。
     */
    takePlayStreamSnapshot(streamID: string): Promise<zego.ZegoPlayerTakeSnapshotResult>;
    /**
     * 设置拉流音量。
     *
     * 支持版本：1.16.0 及以上。
     * 详情描述：设置拉流的声音大小，本端用户可控制音频流的播放音量。
     * 调用时机：[startPlayingStream] 后调用。
     * 使用限制：无。
     * 相关接口：[setAllPlayStreamVolume] 设置所有拉流音量。
     * 注意事项：停止拉流后，再次拉流需要重新设置。此函数与 [setAllPlayStreamVolume] 函数相互覆盖，最后一个调用生效。
     *
     * @param streamID 流 ID。
     * @param volume 音量百分比，取值范围为 0 ~ 200，默认值为 100。
     */
    setPlayVolume(streamID: string, volume: number): Promise<void>;
    /**
     * 设置所有拉流音量。
     *
     * 支持版本：2.3.0 及以上。
     * 详情描述：此函数用于设置所有拉流的声音大小，本端用户可控制所有音频流的播放音量。
     * 调用时机：[startPlayingStream]后调用。
     * 相关接口：可使用 [setPlayVolume] 设置指定音视频流的音量。
     * 使用限制：无。
     * 注意事项：与setPlayVolume函数相互覆盖,最后一个调用生效。
     *
     * @param volume 音量百分比，取值范围为 0 ~ 200，默认值为 100。
     */
    setAllPlayStreamVolume(volume: number): Promise<void>;
    /**
     * 设置播放视频流类型。
     *
     * 支持版本：2.3.0 及以上。
     * 详情描述：当推流方通过 [setVideoConfig] 设置了 codecID 为 SVC 时，拉流方可以动态设置选用不同的流类型（小分辨率为标准图层的二分之一）。
     * 业务场景：一般情况下，在网络较弱或者渲染的 UI 窗体较小的情况下，可以选择使用拉取小分辨率的视频来达到节省带宽的目的。
     * 调用时机：[createEngine] 后可调用。
     * 使用限制：无。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 流 ID。
     * @param streamType 视频流类型。
     */
    setPlayStreamVideoType(streamID: string, streamType: zego.ZegoVideoStreamType): Promise<void>;
    /**
     * 设置拉流播放缓存自适应调整的区间范围。
     *
     * 支持版本：2.1.0 及以上。
     * 详情描述：设置拉流时 SDK 内部缓存自适应调整的区间范围 0-4000ms。
     * 业务场景：一般在网络环境较差的情况下，调整增大拉流的播放缓存，会显著减少音视频卡顿，但会增大延迟。
     * 调用时机：[createEngine] 后。
     * 使用限制：无。
     * 注意事项：当开发者设置的缓存区间上限超过 4000ms 时，会取值 4000 ms。当开发者设置的缓存区间上限小于缓存区间下限时，会自动将上限取值为下限。
     *
     * @param streamID 流 ID。
     * @param minBufferInterval 缓存自适应区间下限，单位毫秒。默认值为 0ms。
     * @param maxBufferInterval 缓存自适应区间上限，单位毫秒。默认值为 4000ms。
     */
    setPlayStreamBufferIntervalRange(streamID: string, minBufferInterval: number, maxBufferInterval: number): Promise<void>;
    /**
     * 设置拉音视频流优先级的权重。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：设置拉音视频流优先级的权重。
     * 业务场景：当开发者业务上，需要对某音视流优先保证质量时（纯音频流下请勿使用），可使用此接口。例如：上课场景，学生拉多路流,则可设置老师流高优先级。
     * 调用时机：[startPlayingStream]之后 。
     * 使用限制：无。
     * 注意事项：默认所有音视频流的权重相同。只能设置一路流是高优先级的，以最后设置的为准。流停止之后自动恢复初始状态，所有流的权重相同。在本地网络不好的时候，保证focus流的同时，可能造成其他的卡顿更多。
     *
     * @param streamID 流 ID。
     */
    setPlayStreamFocusOn(streamID: string): Promise<void>;
    /**
     * 拉流是否可接收指定音频数据。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在实时音视频互动过程中，本地用户可根据需要，通过此函数控制拉流时是否接收指定远端用户的音频数据,当开发者不接收音频收据时，可降低硬件和网络的开销。
     * 业务场景：当开发者需要快速关闭、恢复远端音频时，可调用此函数。相比重新拉流，能极大降低耗时，提升互动体验。
     * 调用时机：在调用 [createEngine] 后可调用此函数。
     * 注意事项：
     *  1. 与 [muteAllPlayAudioStreams] 一起使用时，可以互相覆盖配置。
     *  2. 与 [muteAllPlayStreamAudio] 一起使用时，只有当 [muteAllPlayStreamAudio] 函数设置为 “false”时，此函数才有效。
     *  3. 停止拉流后对此条流此前设置的属性如 [setPlayVolume]、[mutePlayStreamAudio]、[mutePlayStreamVideo] 等拉流相关的配置都会失效，需要在下次拉流之前重新设置。
     * 相关接口：可调用 [muteAllPlayStreamAudio] 函数控制是否接收所有音频数据。必须当 [muteAllPlayStreamAudio] 和 [mutePlayStreamAudio] 两个函数同时设置为 "false" 时，本地用户拉流时才能接收远端用户的音频数据：1. 当调用 [muteAllPlayStreamAudio(true)] 函数时，全局生效，即本地用户会禁止接收所有远端用户的音频数据，此时无论在 [muteAllPlayStreamAudio] 之前还是之后调用 [mutePlayStreamAudio] 函数都不生效。2. 当调用 [muteAllPlayStreamAudio(false)] 函数时，本地用户可以接收所有远端用户的音频数据，此时可再通过 [mutePlayStreamAudio] 函数控制是否接收单条音频数据。调用 [mutePlayStreamAudio(true, streamID)] 函数则本地用户可以接收该 "streamID" 之外的其他音频数据；调用 [mutePlayStreamAudio(false, streamID)] 函数则本地用户可以接收 "streamID" 的音频数据。
     *
     * @param streamID 流 ID。
     * @param mute 拉流时是否可以接收指定远端用户的音频数据，“true” 表示禁止，“false” 表示接收，默认值为 “false”。
     */
    mutePlayStreamAudio(streamID: string, mute: boolean): Promise<void>;
    /**
     * 拉流是否可接收指定视频数据。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：在实时音视频互动过程中，本地用户可根据需要，通过此函数控制拉流时是否接收指定远端用户的视频数据,当开发者不接收视频数据时，可降低硬件和网络的开销。
     * 业务场景：当开发者需要快速关闭、恢复观看远端视频画面时，可调用此函数。相比重新拉流，能极大降低耗时，提升互动体验。
     * 调用时机：在调用 [createEngine] 后可调用此函数。
     * 注意事项：
     *  1. 与 [muteAllPlayAudioStreams] 一起使用时，可以互相覆盖配置。
     *  2. 与 [muteAllPlayStreamVideo] 一起使用时，只有当 [muteAllPlayStreamVideo] 函数设置为 “false”时，此函数才有效。
     *  3. 当指定不接收视频流数据时，视图默认保持在最后一帧，如果需要清除最后一帧，请联系 ZEGO 技术支持。
     *  4. 停止拉流后对此条流此前设置的属性如 [setPlayVolume]、[mutePlayStreamAudio]、[mutePlayStreamVideo] 等拉流相关的配置都会失效，需要在下次拉流之前重新设置。
     * 相关接口：可调用 [muteAllPlayStreamVideo] 函数控制是否接收所有视频数据。必须当 [muteAllPlayStreamVideo] 和 [mutePlayStreamVideo] 两个函数同时设置为 "false" 时，本地用户拉流时才能接收远端用户的视频数据：1. 当调用 [muteAllPlayStreamVideo(true)] 函数时，全局生效，即本地用户会禁止接收所有远端用户的视频数据，此时无论在 [muteAllPlayStreamVideo] 之前还是之后调用 [mutePlayStreamVideo] 函数都不生效。2. 当调用 [muteAllPlayStreamVideo(false)] 函数时，本地用户可以接收所有远端用户的视频数据，此时可再通过 [mutePlayStreamVideo] 函数控制是否接收单条视频数据。调用 [mutePlayStreamVideo(true, streamID)] 函数则本地用户可以接收该 "streamID" 之外的其他视频数据；调用 [mutePlayStreamVideo(false, streamID)] 函数则本地用户可以接收 "streamID" 的视频数据。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param streamID 流 ID。
     * @param mute 拉流时是否可以接收指定远端用户的视频数据，“true” 表示禁止，“false” 表示接收，默认值为 “false”。SDK 内部自动拉取的流默认值为 false。
     */
    mutePlayStreamVideo(streamID: string, mute: boolean): Promise<void>;
    /**
     * 拉流是否接收所有音频数据。
     *
     * 支持版本：2.4.0 及以上。
     * 详情描述：在实时音视频互动过程中，本地用户可根据需要，通过此函数控制拉流时是否接收所有远端用户的音频数据（包括在调用该函数后新加入房间的用户所推的音频流）。默认情况下，用户加入房间后可以接收所有远端用户推送的音频数据。当开发者不接收音频收据时，可降低硬件和网络的开销
     * 业务场景：当开发者需要快速关闭、恢复远端音频时，可调用此函数。相比重新拉流，能极大降低耗时，提升互动体验。
     * 调用时机：在调用 [createEngine] 后可调用此函数。
     * 注意事项：此接口在 SDK 生命周期内不能和 [muteAllPlayAudioStreams] 混用。
     * 相关接口：可调用 [mutePlayStreamAudio] 函数控制是否接收单条音频数据。必须当 [muteAllPlayStreamAudio] 和 [mutePlayStreamAudio] 两个函数同时设置为 "false" 时，本地用户拉流时才能接收远端用户的音频数据：1. 当调用 [muteAllPlayStreamAudio(true)] 函数时，全局生效，即本地用户会禁止接收所有远端用户的音频数据，此时无论在 [muteAllPlayStreamAudio] 之前还是之后调用 [mutePlayStreamAudio] 函数都不生效。 2. 当调用 [muteAllPlayStreamAudio(false)] 函数时，本地用户可以接收所有远端用户的音频数据，此时可再通过 [mutePlayStreamAudio] 函数控制是否接收单条音频数据。调用 [mutePlayStreamAudio(true, streamID)] 函数则本地用户可以接收该 "streamID" 之外的其他音频数据；调用 [mutePlayStreamAudio(false, streamID)] 函数则本地用户可以接收 "streamID" 的音频数据。
     *
     * @param mute 拉流时是否可以接收所有远端用户的音频数据，“true” 表示禁止，“false” 表示接收，默认值为 “false”。
     */
    muteAllPlayStreamAudio(mute: boolean): Promise<void>;
    /**
     * 拉流是否可接收所有视频数据
     *
     * 支持版本：2.4.0 及以上。
     * 详情描述：在实时音视频互动过程中，本地用户可根据需要，通过此函数控制拉流时是否接收所有远端用户的视频数据（包括在调用该函数后新加入房间的用户所推的视频流）。默认情况下，用户加入房间后可以接收所有远端用户推送的视频数据。当开发者不接收视频数据时，可降低硬件和网络的开销。
     * 业务场景：当开发者需要快速关闭、恢复观看远端视频画面时，可调用此函数。相比重新拉流，能极大降低耗时，提升互动体验。
     * 调用时机：在调用 [createEngine] 后可调用此函数。
     * 注意事项：
     *  1. 此接口在 SDK 生命周期内不能和 [muteAllPlayVideoStreams] 混用。
     *  2. 当指定不接收视频流数据时，视图默认保持在最后一帧，如果需要清除最后一帧，请联系 ZEGO 技术支持。
     * 相关接口：可调用 [mutePlayStreamVideo] 函数控制是否接收单条视频数据。必须当 [muteAllPlayStreamVideo] 和 [mutePlayStreamVideo] 两个函数同时设置为 "false" 时，本地用户拉流时才能接收远端用户的视频数据： 1. 当调用 [muteAllPlayStreamVideo(true)] 函数时，全局生效，即本地用户会禁止接收所有远端用户的视频数据，此时无论在 [muteAllPlayStreamVideo] 之前还是之后调用 [mutePlayStreamVideo] 函数都不生效。 2. 当调用 [muteAllPlayStreamVideo(false)] 函数时，本地用户可以接收所有远端用户的视频数据，此时可再通过 [mutePlayStreamVideo] 函数控制是否接收单条视频数据。调用 [mutePlayStreamVideo(true, streamID)] 函数则本地用户可以接收该 "streamID" 之外的其他视频数据；调用 [mutePlayStreamVideo(false, streamID)] 函数则本地用户可以接收 "streamID" 的视频数据。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param mute 拉流时是否可以接收所有远端用户的视频数据，“true” 表示禁止，“false” 表示接收，默认值为 “false”。
     */
    muteAllPlayStreamVideo(mute: boolean): Promise<void>;
    /**
     * 开/关硬件解码。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：拉流时是否使用硬件解码，开启硬件解码后 SDK 会使用 GPU 进行解码，降低 CPU 使用率。
     * 业务场景：若开发者在某些机型测试时发现拉大分辨率音视频流时设备发热严重，可考虑调用此函数开启硬件解码的方式。
     * 默认值：未调用此接口时，默认关闭硬解。
     * 调用时机：此函数需要在 [createEngine] 创建实例后调用。
     * 使用限制：无。
     * 注意事项：在拉流前设置才能生效，如果在拉流后设置，停止拉流后重新拉流才生效，此配置生效后，在下次调用生效前一直有效。
     *
     * @param enable 是否开启硬解开关，true 表示开启硬解，false 表示关闭硬解。
     */
    enableHardwareDecoder(enable: boolean): Promise<void>;
    /**
     * 开始混流任务。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：向 ZEGO RTC 服务器发起混流请求，服务器会寻找当前正在推的流，并根据 SDK 请求的混流任务的参数进行图层混合。当需要更新混流任务时，即输入流增加或减少时需要更新输入流列表，此时可以更新 [ZegoMixerTask] 对象 inputList 的字段并再次调用本函数传入相同的 [ZegoMixerTask] 对象更新混流任务。
     * 业务场景：常用于需要多个视频画面合成一个视频时使用混流，比如教育类，直播老师和学生的画面。
     * 调用时机：调用 [loginRoom] 登录房间后。
     * 使用限制：无。
     * 注意事项：由于客户端设备的性能考虑，SDK 的混流是在 ZEGO RTC 服务器开启混流任务进行混流。若请求开启混流任务发生异常，例如最常见的混流的输入流不存在，将会从 callback 回调的错误码给出。具体错误码请参考 常见错误码文档 https://doc-zh.zego.im/zh/4378.html 若中途某条输入流不存在了，混流任务会自动重试拉这条输入流 90 秒，90 秒之后不再重试。若所有输入流均不存在了，90秒之后服务器会自动停止混流任务。
     * 相关回调：可通过 [onMixerRelayCDNStateUpdate] 获取混流转推 CDN 状态更新通知，可通过 [onMixerSoundLevelUpdate] 获取混流中的每条单流的声浪更新通知。
     * 相关接口：可通过 [stopMixerTask] 函数停止混流。
     *
     * @param task 混流任务对象。是否必填：是。
     * @return 开始混流任务结果
     */
    startMixerTask(task: zego.ZegoMixerTask): Promise<zego.ZegoMixerStartResult>;
    /**
     * 停止混流任务。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：向 ZEGO RTC 服务器发起结束混流请求。
     * 业务场景：常用于需要多个视频画面合成一个视频时使用混流，比如教育类，直播老师和学生的画面。
     * 调用时机：调用 [startMixerTask] 开始混流后。
     * 使用限制：无。
     * 注意事项：若开发者在未停止上一个混流任务的情况下启动下一个混流任务，上一个混流任务不会自动停止，直到上一个混流任务的输入流持续 90 秒都不存在之后。在启动下一个混流任务前，应当先停止上一个混流任务，以免当一个主播已经开启下一个混流任务与其他主播混流时，观众依然在拉上一个混流任务的输出流。
     * 相关接口：可通过 [startMixerTask] 函数开始混流。
     *
     * @param task 混流任务对象。是否必填：是。
     * @return 停止混流任务结果
     */
    stopMixerTask(task: zego.ZegoMixerTask): Promise<zego.ZegoMixerStopResult>;
    /**
     * 开始自动混流任务
     *
     * 支持版本：2.10.0 及以上。
     * 详情描述：本地用户可调用该函数开始自动混流任务，对房间内的所有流进行混流，目前仅支持音频流自动混流。启动自动混流后，会自动混流该房间内所有流的音频，此房间内再发起的推流也会自动混入最后的输出流中。
     * 业务场景：常用于语聊房场景下，需要由客户端发起自动混流任务时。
     * 调用时机：在创建引擎后，如果目标房间已经创建，可调用该函数在目标房间开启自动混流。
     * 注意事项：在同一个房间内开启下一个自动混流任务前，请先调用 [stopAutoMixerTask] 函数结束上一次自动混流任务，以免造成当一个主播已经开启下一个自动混流任务与其他主播混流时，观众依然在一直拉上一个自动混流任务的输出流的情况。若用户未主动结束当前自动混流任务，该任务将在房间不存在之后或者输入流持续 90 秒不存在之后自动结束。
     * 相关回调：通过 [ZegoMixerStartCallback] 回调，用户可以获取函数执行结果。通过 [onAutoMixerSoundLevelUpdate] 回调，用户可以获取自动混流后声浪信息。
     * 相关接口：可调用 [stopAutoMixerTask] 函数，停止自动混流任务。
     *
     * @param task 自动混流任务对象
     * @return 开始自动混流任务结果通知
     */
    startAutoMixerTask(task: zego.ZegoAutoMixerTask): Promise<zego.ZegoMixerStartResult>;
    /**
     * 停止自动混流任务
     *
     * 支持版本：2.10.0 及以上。
     * 详情描述：本地用户可调用该函数结束自动混流任务。
     * 业务场景：常用于语聊房场景下，需要由客户端发起自动混流任务时。
     * 调用时机：在调用 [startAutoMixerTask] 函数开启自动混流任务后可调用该函数。
     * 注意事项：在同一个房间内调用 [startAutoMixerTask] 函数开启下一个自动混流任务前，请先调用此函数结束上一次自动混流任务，以免造成当一个主播已经开启下一个自动混流任务与其他主播混流时，观众依然在一直拉上一个自动混流任务的输出流的情况。若用户未主动结束当前自动混流任务，该任务将在房间不存在之后或者输入流持续 90 秒不存在之后自动结束。
     * 相关回调：通过 [ZegoMixerStopCallback] 回调，用户可以获取函数执行结果。
     * 相关接口：可调用 [startAutoMixerTask] 函数，开始自动混流任务。
     *
     * @param task 自动混流任务对象
     * @return 停止自动混流任务结果通知
     */
    stopAutoMixerTask(task: zego.ZegoAutoMixerTask): Promise<zego.ZegoMixerStopResult>;
    /**
     * 设置是否静音（关闭麦克风）。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：此函数用于控制是否使用采集到的音频数据，静音（关闭麦克风）将会使用静音数据替换设备采集到的音频数据进行推流，此时仍然会占用麦克风设备。
     * 业务场景：用户仅关闭麦克风采集的人声，不关闭媒体播放器的音乐声音，可以调用该接口。该接口影响 [onBeforeAudioPrepAudioData]。
     * 默认值：默认为 "false"，即不静音。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 相关接口：若想要真正让 SDK 放弃占用麦克风，例如实现 App 退到后台后释放麦克风占用等功能，可调用 [enableAudioCaptureDevice] 函数开关音频采集设备。可使用 [isMicrophoneMuted] 来检查麦克风是否静音。
     *
     * @param mute 是否静音（关闭麦克风）；"true" 表示静音（关闭麦克风）；"false" 表示开启麦克风。
     */
    muteMicrophone(mute: boolean): Promise<void>;
    /**
     * 检查麦克风是否设置为静音。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：用于判断麦克风是否被设置为静音。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 相关接口：[muteMicrophone]。
     *
     * @return 麦克风是否静音；"true" 表示麦克风静音；"false" 表示麦克风开启中（没有被静音）。
     */
    isMicrophoneMuted(): Promise<boolean>;
    /**
     * 设置是否静音（关闭音频输出）。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：设置静音后，SDK 所有声音都不会播放，包括拉流、媒体播放器等。
     * 默认值：默认为 "false"，即不静音。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     *
     * @param mute 是否静音(关闭音频输出)；"true" 表示静音(关闭音频输出)；"false" 表示开启音频输出。
     */
    muteSpeaker(mute: boolean): Promise<void>;
    /**
     * 检查音频输出是否静音。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：用于判断音频输出是否静音。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 相关接口：[muteSpeaker]。
     *
     * @return 音频输出是否静音；"true" 表示音频输出静音；"false" 表示音频输出开启中（没有被静音）。
     */
    isSpeakerMuted(): Promise<boolean>;
    /**
     * 开/关音频采集设备。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：此函数用于控制是否使用音频采集设备。如果关闭音频采集设备，则 SDK 不会再占用音频设备，当然如果此时正在推流，默认情况下会使用静音数据做为音频数据进行推流。
     * 使用场景：当用户从不需要用到音频的时候，可以调用此函数关闭音频采集。
     * 默认值：默认为 "true"。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 相关接口：硬件上关闭或打开麦克风是耗时操作，用户频繁操作时有一定的性能开销，一般推荐使用 [muteMicrophone]。
     *
     * @param enable 是否开启音频采集设备；"true" 表示打开音频采集设备；"false" 表示关闭音频采集设备。
     */
    enableAudioCaptureDevice(enable: boolean): Promise<void>;
    /**
     * 获取当前音频路由。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：音频路由是指 App 在播放音频时使用的音频输出设备，常见的音频路由有：扬声器、听筒、耳机、蓝牙设备等。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：win 或 mac 平台下不支持。
     * 相关接口：设置音频路由到扬声器 [setAudioRouteToSpeaker]。
     */
    getAudioRouteType(): Promise<zego.ZegoAudioRoute>;
    /**
     * 设置音频路由到扬声器。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：是否使用扬声器播放音频，当选择不使用内置扬声器播放声音时，SDK 会根据系统调度选择当前优先级最高的音频输出设备播放声音，常见的音频路由有：听筒、耳机、蓝牙设备等。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：只支持听筒和扬声器的切换，如果是蓝牙耳机或者有线耳机不支持通过该接口路由到扬声器。
     * 相关接口：获取当前音频路由 [getAudioRouteType]。
     *
     * @param defaultToSpeaker 是否使用内置扬声器播放声音，"true" 表示使用内置扬声器播放声音，"false" 表示使用当前系统调度的优先级最高的音频输出设备播放声音。
     */
    setAudioRouteToSpeaker(defaultToSpeaker: boolean): Promise<void>;
    /**
     * 开/关摄像头，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：此函数用于控制是否启动摄像头的采集，关闭摄像头后，将不会进行视频采集，此时本地预览和推流都将没有视频数据。
     * 默认值：默认为 "true"，即打开摄像头。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 注意事项：在使用自定义视频采集功能 [enableCustomVideoCapture] 的情况下，由于开发者接管了视频数据的采集，SDK 不再负责视频数据的采集，但此函数依然会影响是否进行编码的行为。因此开发者使用自定义视频采集时，请确保此函数的值为 "true"。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param enable 是否打开摄像头；"true" 表示打开摄像头；"false" 表示关闭摄像头。
     * @param channel 推流通道
     */
    enableCamera(enable: boolean, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 切换前后摄像头，支持设置其他通道的推流。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：此函数用于控制使用前置摄像头或者后置摄像头(仅 Android 和 iOS 支持)。
     * 默认值：默认为 "true"，即使用前置摄像头。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 使用限制：无。
     * 注意事项：在开启自定义视频采集功能 [enableCustomVideoCapture] 的情况下，由于开发者接管了视频数据的采集，SDK不再负责视频数据的采集，本函数不再有效。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param enable 是否采用前置摄像头；"true" 表示使用前置摄像头；"false" 表示使用后置摄像头。
     * @param channel 推流通道
     */
    useFrontCamera(enable: boolean, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 设置摄像头变焦倍数，支持指定推流通道号。每次摄像头重新启动时，摄像头变焦倍数都将会恢复初始值 (1.0)。
     *
     * 支持版本：1.20.0 及以上。
     * 详情描述：设置摄像头变焦倍数。
     * 调用时机：在开启预览 [startPreview] 后调用。
     * 使用限制：摄像头启动后设置才生效。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param factor 摄像头变焦倍数，最小值为 1.0，最大值为 [getCameraMaxZoomFactor] 的返回值。
     * @param channel 推流通道
     */
    setCameraZoomFactor(factor: number, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 获取摄像头最大变焦倍数，支持指定推流通道号。
     *
     * 支持版本：1.20.0 及以上。
     * 详情描述：获取摄像头最大变焦倍数。
     * 调用时机：摄像头启动成功后调用才有效，一般可以在收到采集首帧回调 [onPublisherCapturedVideoFirstFrame] 的时候调用。
     * 使用限制：无。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param channel 推流通道
     * @return 摄像头最大变焦倍数
     */
    getCameraMaxZoomFactor(channel?: undefined | zego.ZegoPublishChannel): Promise<number>;
    /**
     * 启动声浪监控，支持开启进阶功能。
     *
     * 支持版本：2.10.0 及以上。
     * 详情描述：启动监控后可通过 [onCapturedSoundLevelUpdate] 回调接收本地采集音频声浪，以及 [onRemoteSoundLevelUpdate] 回调接收远端拉流音频声浪。开发者可在进入房间之前，调用 [startPreview] 与此函数，并与 [onCapturedSoundLevelUpdate] 结合来判断音频设备是否正常工作。
     * 业务场景：在推拉流过程中，判断麦上的用户谁在说话，并做 UI 展示。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 注意事项：
     *   1. [onCapturedSoundLevelUpdate] 与 [onRemoteSoundLevelUpdate] 回调通知周期为参数设置的值。
     *   2. 启动声浪监控后，即使未启动本地音频采集，onCapturedSoundLevelUpdate也会有回调，声浪值为0。
     *
     * @param config 启动声浪监控的配置。
     */
    startSoundLevelMonitor(config?: undefined | zego.ZegoSoundLevelConfig): Promise<void>;
    /**
     * 停止声浪监控。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：停止监控后将停止回调本地采集以及远端拉流的音频声浪回调。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 相关接口：可通过 [startSoundLevelMonitor] 启动声浪监控。
     */
    stopSoundLevelMonitor(): Promise<void>;
    /**
     * 开启/关闭 耳返。
     *
     * 支持版本：1.9.0 及以上。
     * 详情描述：开启耳返，用户使用麦克风采集声音时会听到自己的声音。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 默认值：关闭。
     * 注意事项：
     *   1. 同时连接耳机和麦克风时该设置才实际生效。
     *   2. 耳返默认是在采集之后、前处理之前返回，如果需要在前处理之后返回请咨询 ZEGO 技术支持。
     *
     * @param enable true: 开启耳返， false: 关闭耳返。
     */
    enableHeadphoneMonitor(enable: boolean): Promise<void>;
    /**
     * 设置耳返音量。
     *
     * 支持版本：1.9.0 及以上。
     * 详情描述：设置耳返音量。
     * 调用时机：在创建引擎 [createEngine] 后。
     * 注意事项：同时连接耳机和麦克风时该设置才实际生效。
     * 相关接口：可通过 [enableHeadphoneMonitor] 开关耳返。
     *
     * @param volume 采集耳返音量大小，取值 [0, 200]，默认 60。
     */
    setHeadphoneMonitorVolume(volume: number): Promise<void>;
    /**
     * 开启/关闭 手电筒。
     *
     * 支持版本：3.6.0 及以上。
     * 详情描述：是否开启设备的手电筒。
     * 调用时机：需要在 [createEngine] 之后调用。
     *
     * @param enable 开启或关闭。
     * @param channel 推流通道
     */
    enableTorch(enable: boolean, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 是否开启回声消除。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：打开回声消除， SDK 会对采集到的音频数据进行过滤以降低音频中的回音成分。
     * 业务场景：当需要降低回声以提高通话质量和用户体验时，可以开启此功能。
     * 调用时机：需要在 [createEngine] 之后调用。
     * 注意事项：回声消除功能仅支持处理经过 SDK 播放的声音，例如拉流、媒体播放器、音效播放器等功能播放的声音。未调用此函数前，SDK 内部会自动判断是否需要使用 AEC，一旦调用了此函数则不再自动判断。
     * 使用限制：无。
     * 相关接口：开发者可通过 [enableHeadphoneAEC] 以设置当使用耳机时是否也开启回声消除；可通过 [setAECMode] 设置回声消除的模式。
     *
     * @param enable 是否开启回声消除；true 表示开启；false 表示关闭
     */
    enableAEC(enable: boolean): Promise<void>;
    /**
     * 是否在使用耳机时开启回声消除。
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当使用 [enableAEC] 开启了回声消除后，对于移动端设备来说只在使用扬声器时开启。如果需要在使用耳机时开启或者关闭回声消除，请调用此函数。
     * 业务场景：当移动端设备连接了一个外置声卡作为音频输出源时，为了消除这种情况下的回声，需要调用此函数开启回声消除。
     * 默认值：Android 默认关闭，iOS 默认开启。
     * 调用时机：需要在 [createEngine] 之后，[startPublishingStream]、 [startPlayingStream]、 [startPreview]、 [createMediaPlayer]、 [createAudioEffectPlayer] 和 [createRealTimeSequentialDataManager] 之前调用。
     * 注意事项：开启回声消除会增加耳返延迟。在 iOS 平台，SDK 内部无法区分耳机跟外置声卡，如果使用此函数关闭使用耳机时的系统回声消除，则在用户接入外部声卡时会采集外部声卡播放的声音，导致回声问题。
     * 使用限制：无。
     * 相关接口：不使用耳机时可通过 [enableAEC] 设置 SDK 是否开启回声消除。
     * 平台差异：仅支持 iOS 和 Android。
     *
     * @param enable 是否开启；true 表示开启；false 表示关闭。
     */
    enableHeadphoneAEC(enable: boolean): Promise<void>;
    /**
     * 设置回声消除模式
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当使用 [enableAEC] 开启了回声消除后，可通过此函数切换不同的回声消除模式以控制消除回声数据的程度。
     * 业务场景：当默认的回声消除效果不符合预期时，可通过此函数调整回声消除模式。
     * 默认值：未调用此函数时，默认的回声消除模式为 [Aggressive] 激进模式。
     * 调用时机：需要在 [createEngine] 之后调用。
     * 使用限制：仅在开启了回声消除功能后此函数设置的值才有效。
     *
     * @param mode 回声消除模式
     */
    setAECMode(mode: zego.ZegoAECMode): Promise<void>;
    /**
     * 开/关自动增益控制
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：开启该功能后，SDK 能够自动调节麦克风音量，适应远近拾音，保持音量稳定。
     * 业务场景：当需要保障音量稳定性以提高通话质量和用户体验时，可以开启此功能。
     * 调用时机：需要在 [createEngine] 之后调用。
     * 注意事项：未调用此函数前，SDK 内部会自动判断是否需要使用 AGC，一旦调用了此函数则不再自动判断。
     * 使用限制：无。
     *
     * @param enable 是否开启自动增益控制；true 表示开启；false 表示关闭
     */
    enableAGC(enable: boolean): Promise<void>;
    /**
     * 开/关噪声抑制
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：开启该功能后，可以使人声更加清晰。
     * 业务场景：当需要抑制噪声以提高通话质量和用户体验时，可以开启此功能。
     * 调用时机：需要在 [createEngine] 之后调用。
     * 相关接口：此功能对持续性的噪声（例如下雨声等白噪音）抑制效果较好，如果需要抑制瞬态噪声，请使用 [enableTransientANS]；可通过 [setANSMode] 设置噪声抑制的模式。
     * 注意事项：未调用此函数前，SDK 内部会自动判断是否需要使用 ANS，一旦调用了此函数则不再自动判断。
     * 使用限制：无。
     *
     * @param enable 是否开启噪声抑制；true 表示开启噪声抑制；false 表示关闭噪声抑制
     */
    enableANS(enable: boolean): Promise<void>;
    /**
     * 开/关瞬态噪声抑制
     *
     * 支持版本：1.17.0 及以上。
     * 详情描述：用于抑制敲击键盘、桌子等瞬态噪声。
     * 业务场景：当需要抑制瞬态噪声以提高通话质量和用户体验时，可以开启此功能。
     * 默认值：未调用此函数时，默认不开启瞬态噪声抑制。
     * 调用时机：需要在 [createEngine] 之后调用。
     * 相关接口：此函数开启后不会抑制常规噪声，如果需要开启常规噪声抑制，请使用 [enableANS]
     * 使用限制：无。
     *
     * @param enable 是否开启瞬态噪声抑制；true 表示开启；false 表示关闭
     */
    enableTransientANS(enable: boolean): Promise<void>;
    /**
     * 设置音频噪声抑制模式
     *
     * 支持版本：1.1.0 及以上。
     * 详情描述：当使用 [enableANS] 开启了噪声抑制后，可通过此函数切换不同的噪声抑制模式以控制抑制噪声数据的程度。
     * 业务场景：当默认的噪声抑制效果不符合预期时，可通过此函数调整噪声抑制模式。
     * 默认值：未调用此函数时，默认的噪声抑制模式为 [Medium] 中等模式。
     * 调用时机：需要在 [createEngine] 之后调用。
     * 使用限制：仅在开启了噪声抑制功能后此函数设置的值才有效。
     *
     * @param mode 噪声抑制模式
     */
    setANSMode(mode: zego.ZegoANSMode): Promise<void>;
    /**
     * 开启 Effects 美颜环境。
     *
     * 支持版本：2.16.0 及以上。
     * 详情描述：开启 Effects 美颜环境。SDK 内部会使用固定的视频帧数据类型进行传输，Windows 平台只支持视频帧裸数据， Apple 平台只支持 CVPixelBuffer，Android 平台只支持 texture2d。
     * 业务场景：常用于视频通话、直播等场景。
     * 默认值：未调用此函数时，默认不启动美颜环境。
     * 调用时机：必须在调用 [startPreview]、[startPublishingStream] 之前设置。如果需要修改配置，请先调用 [logoutRoom] 登出房间，否则不会生效。
     * 相关接口：[enableEffectsBeauty] 开关美颜，[setEffectsBeautyParam] 设置美颜参数。
     * 注意事项：此美颜功能为基础功能，如不符合开发者的预期，可使用自定义视频前处理功能 [enableCustomVideoProcessing] 或者自定义视频采集功能 [enableCustomVideoCapture] 对接即构 AI 美颜 SDK [ZegoEffects] https://doc-zh.zego.im/article/9556 以获得最佳效果。
     * 使用限制：此函数只支持 Android 系统 5.0 及以上，Android SDK 版本 21 及以上。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     */
    startEffectsEnv(): Promise<void>;
    /**
     * 关闭 Effects 美颜环境。
     *
     * 支持版本：2.16.0 及以上。
     * 详情描述：关闭 Effects 美颜环境。
     * 业务场景：常用于视频通话、直播等场景。
     * 调用时机：必须在调用 [startPreview]、[startPublishingStream] 之前设置。如果需要修改配置，请先调用 [logoutRoom] 登出房间，否则不会生效。
     * 相关接口：[enableEffectsBeauty] 开关美颜，[setEffectsBeautyParam] 设置美颜参数。
     * 注意事项：此美颜功能为基础功能，如不符合开发者的预期，可使用自定义视频前处理功能 [enableCustomVideoProcessing] 或者自定义视频采集功能 [enableCustomVideoCapture] 对接即构 AI 美颜 SDK [ZegoEffects] https://doc-zh.zego.im/article/9556 以获得最佳效果。
     * 使用限制：此函数只支持 Android 系统 5.0 及以上，Android SDK 版本 21 及以上。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     */
    stopEffectsEnv(): Promise<void>;
    /**
     * 开启或关闭美颜效果。
     *
     * 支持版本：2.16.0 及以上。
     * 详情描述：支持基础美颜功能，包括美白、红润、磨皮、锐化。
     * 业务场景：通常用于视频通话、直播等场景。
     * 调用时机：必须在调用 [startEffectsEnv] 开启美颜环境后才能调用此函数。
     * 默认值：未调用此函数时，默认不开启美颜效果。
     * 相关接口：可调用 [setEffectsBeautyParam] 函数调整美颜参数。
     * 注意事项：此美颜功能为基础功能，如不符合开发者的预期，可使用自定义视频前处理功能 [enableCustomVideoProcessing] 或者自定义视频采集功能 [enableCustomVideoCapture] 对接即构 AI 美颜 SDK [ZegoEffects] https://doc-zh.zego.im/article/9556 以获得最佳效果。
     * 使用限制：此函数如果使用在 Android 平台上只支持 5.0 及以上，SDK 版本 21 及以上。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param enable 是否开启美颜效果，true 开启；false 关闭，默认为 false。
     */
    enableEffectsBeauty(enable: boolean): Promise<void>;
    /**
     * 设置美颜效果参数。
     *
     * 支持版本：2.16.0 及以上。
     * 详情描述：设置美颜参数，包括美白、红润、磨皮、锐化。
     * 业务场景：通常用于视频通话、直播等场景。
     * 调用时机：必须在调用 [startEffectsEnv] 开启美颜环境后才能调用此函数。
     * 相关接口：可调用 [enableEffectsBeauty] 开启或关闭美颜效果。
     * 使用限制：此函数只支持 Android 系统 5.0 及以上，Android SDK 版本 21 及以上。
     * 注意：此函数仅在 ZegoExpressVideo SDK 中有效！
     *
     * @param param 美颜选项参数。
     */
    setEffectsBeautyParam(param: zego.ZegoEffectsBeautyParam): Promise<void>;
    /**
     * 发送房间广播消息。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：向房间发送广播消息，已经登录相同房间的用户能收到消息，消息可靠。
     * 业务场景：一般在直播房间人数不超过 500 时使用。
     * 调用时机：调用 [loginRoom] 登录房间之后。
     * 使用限制：房间在线人数超过 500 时不支持，如果需要提高限制，请联系 ZEGO 技术支持申请评估。同一房间内的广播消息发送频率不能高于 10条/s。单个用户在客户端调用此接口的最大QPS为2，关于此函数的使用限制，请参考 https://doc-zh.zego.im/article/7581 或联系 ZEGO 技术支持。
     * 相关回调：可通过 [onIMRecvBroadcastMessage] 接收到房间广播消息。
     * 相关接口：可通过 [sendBarrageMessage] 函数发送弹幕消息，可通过 [sendCustomCommand] 函数发送自定义信令。
     *
     * @param roomID 房间 ID，不得为空，最大长度为 128 字节的字符串。
     *   注意事项：
     *   1.房间 ID 由您自己定义。
     *   2. 仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\'。
     *   3. 如果需要与 Web SDK 互通，请不要使用 '%'。
     * @param message 消息内容。是否必填：是。取值范围：长度不超过 1024 字节。
     * @return 发送广播消息结果通知。是否必填：否。注意事项：传 [null] 则意味着不接收回调通知。
     */
    sendBroadcastMessage(roomID: string, message: string): Promise<zego.ZegoIMSendBroadcastMessageResult>;
    /**
     * 发送房间弹幕消息。
     *
     * 支持版本：1.5.0 及以上。
     * 详情描述：向房间发送弹幕消息，已经登录相同房间的用户能收到消息，消息不可靠。
     * 业务场景：一般用于房间内有大量消息收发，且不需要保证消息可靠性的场景，例如直播弹幕。
     * 调用时机：调用 [loginRoom] 登录房间之后。
     * 使用限制：同一房间内的弹幕消息发送频率不能高于 20条/s。关于此函数的使用限制，请参考 https://doc-zh.zego.im/article/7581 或联系 ZEGO 技术支持。
     * 相关回调：可通过 [onIMRecvBarrageMessage] 接收到房间弹幕消息。
     * 相关接口：可通过 [sendBroadcastMessage] 函数发送广播消息，可通过 [sendCustomCommand] 函数发送自定义信令。
     *
     * @param roomID 房间 ID，不得为空，最大长度为 128 字节的字符串。
     *   注意事项：
     *   1.房间 ID 由您自己定义。
     *   2. 仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\'。
     *   3. 如果需要与 Web SDK 互通，请不要使用 '%'。
     * @param message 消息内容。是否必填：是。取值范围：长度不超过 1024 字节。
     * @return 发送弹幕消息结果通知。
     */
    sendBarrageMessage(roomID: string, message: string): Promise<zego.ZegoIMSendBarrageMessageResult>;
    /**
     * 发送自定义信令。
     *
     * 支持版本：1.2.1 及以上。
     * 详情描述：向已经登录相同房间的其他用户发送点对点的信令，消息可靠。
     * 业务场景：一般用于远程控制信令或用户与用户之间的消息发送。
     * 调用时机：调用 [loginRoom] 登录房间之后。
     * 使用限制：一般在直播房间人数不超过 500 时使用。同一房间内向单个用户发送的自定义消息频率不能高于 200条/s，向多个用户发送的自定义消息不能高于 10条/s。关于此函数的使用限制，请参考 https://doc-zh.zego.im/article/7581 或联系 ZEGO 技术支持。
     * 相关回调：可通过 [onIMRecvCustomCommand] 接收到房间自定义信令。
     * 相关接口：可通过 [sendBroadcastMessage] 函数发送广播消息，可通过 [sendBarrageMessage] 函数发送弹幕消息。
     * 隐私保护声明：请勿在此接口填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。
     *
     * @param roomID 房间 ID，不得为空，最大长度为 128 字节的字符串。
     *   注意事项：
     *   1.房间 ID 由您自己定义。
     *   2. 仅支持数字，英文字符 和 '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '\'。
     *   3. 如果需要与 Web SDK 互通，请不要使用 '%'。
     * @param command 自定义信令内容。是否必填：是。取值范围：最大长度为 1024 字节。注意事项：为保护隐私，请勿在此接口填写用户敏感信息，包括但不限于手机号、身份证号、护照编号、真实姓名等。
     * @param toUserList 信令的接收者列表。是否必填：是。取值范围：用户列表或者 [null]。注意事项：为 [null] 时 SDK 回向房间内所有用户发送自定义信令。
     * @return 发送弹幕消息结果通知。
     */
    sendCustomCommand(roomID: string, command: string, toUserList: zego.ZegoUser[]): Promise<zego.ZegoIMSendCustomCommandResult>;
    /**
     * 创建媒体播放器实例对象。
     *
     * 支持版本：2.1.0 及以上。
     * 详情描述：创建媒体播放器实例对象。
     * 业务场景：常用于播放媒体资源场景，例如播放视频文件，结合自定义视频采集将媒体资源的视频数据推送出去，远端可拉流观看。
     * 调用时机：在初始化 SDK [createEngine] 之后。
     * 使用限制：目前最多支持创建 4 个实例，超过后将返回 null。
     * 注意事项：媒体播放器的实例越多，对设备的性能开销越大。
     * 相关接口：用户可以调用 [destroyMediaPlayer] 销毁媒体播放器实例对象。
     *
     * @return 媒体播放器实例，超过最大数量限制后将返回 null。
     */
    createMediaPlayer(): Promise<zego.ZegoMediaPlayer | undefined>;
    /**
     * 销毁媒体播放器实例对象。
     *
     * 支持版本：2.1.0 及以上。
     * 详情描述：销毁媒体播放器实例对象。
     * 相关接口：用户可以调用 [createMediaPlayer] 创建媒体播放器实例对象。
     *
     * @param mediaPlayer 媒体播放器实例对象。
     */
    destroyMediaPlayer(mediaPlayer: zego.ZegoMediaPlayer): Promise<void>;
    /**
     * 开始本地录制，直接将音视频数据录制到本地文件。
     *
     * 支持版本：1.10.0 及以上。
     * 详情描述：开始录制本端音频或音视频，直接将音视频数据录制到本地文件，录制的数据将与该通道推流的数据一致。
     * 使用限制：无。
     * 注意事项：录制过程中不可以停止预览 [stopPreview] 或停止推流 [stopPublishingStream]，否则 SDK 将主动结束当前录制任务。媒体播放器的数据需要混入到推流中才能录制。
     * 相关回调：开始录制后将会收到 [onCapturedDataRecordStateUpdate] 录制状态回调和 [onCapturedDataRecordProgressUpdate] 录制进度回调。
     *
     * @param config 录制配置对象。
     * @param channel 推流通道。
     */
    startRecordingCapturedData(config: zego.ZegoDataRecordConfig, channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 结束录制本端音频或音视频。
     *
     * 支持版本：1.10.0 及以上。
     * 详情描述：结束录制本端音频或音视频。
     * 调用时机：在 [startRecordingCapturedData] 之后。
     * 使用限制：无。
     *
     * @param channel 推流通道。
     */
    stopRecordingCapturedData(channel?: undefined | zego.ZegoPublishChannel): Promise<void>;
    /**
     * 【已废弃】创建 ZegoExpressEngine 单例对象并初始化 SDK。此函数在 2.14.0 版本及以上已废弃，请使用不带 [isTestEnv] 参数的同名函数代替。请参考 [测试环境废弃说明](https://doc-zh.zego.im/article/13100)
     *
     * 支持版本：1.1.0 ~ 2.13.1，此函数在 2.14.0 版本及以上已废弃，请使用不带 [isTestEnv] 参数的同名函数代替。
     * 详情描述：创建 ZegoExpressEngine 单例对象并初始化 SDK。
     * 调用时机：SDK 其他实例方法调用之前。
     * 使用限制：无。
     * 注意事项：SDK 只支持创建一个实例，如需重复调用 [createEngine] ，则需在第二次调用 [createEngine] 前先调用 [destroyEngine] 函数销毁引擎，否则再次调用此函数返回的都是上次创建的对象。
     *
     * @deprecated 此函数在 2.14.0 版本及以上已废弃，请使用不带 [isTestEnv] 参数的同名函数代替。
     * @param appID ZEGO 为开发者签发的应用 ID，请从 ZEGO 管理控制台 https://console-express.zego.im 申请。appID 取值范围 0~4294967295。
     * @param appSign 每个 AppID 对应的应用签名，请从 ZEGO 管理控制台申请。该参数为包含 64 个字符的字符串，字符取值范围：'0' ~ '9', 'a' ~ 'z'。例："9dc9a25bh2f2137446897071c8c033fa33b91c3dd2a85e0c000ae82c0dad3"。2.17.0 及以上版本 appSign 允许传空或者不传。如果传空或者不传，则必须在调用 [loginRoom] 接口登录房间时将 token 填入 [ZegoRoomConfig] 参数中，用于鉴权。token 的生成方式请参考 [使用 Token 鉴权](https://doc-zh.zego.im/article/10360) 。
     * @param isTestEnv 【已废弃】为提供更便捷、更标准的服务，ZEGO 已统一环境概念，2021-11-16 之后，不再有正式环境/测试环境之分，2021-11-16 及之前在 ZEGO 控制台 创建项目的用户，可参考 [测试环境废弃说明](https://doc-zh.zego.im/article/13100) 进行 SDK 升级和调整相关代码。
     * @param scenario 房间场景，SDK 会针对指定的场景的做一些音视频配置优化以达成在此场景下最优的效果。指定场景后，开发者可以使用 [setRoomScenario] 来实现在不销毁引擎 [destroyEngine] 的前提下切换其他场景。指定场景后，开发者可以调用其他 API 来继续调整音视频配置。各个场景之间的差异以及如何选择合适的场景请参考 https://doc-zh.zego.im/article/16316
     * @return 引擎单例对象
     */
    static createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: zego.ZegoScenario): Promise<ZegoExpressEngine>;
}
