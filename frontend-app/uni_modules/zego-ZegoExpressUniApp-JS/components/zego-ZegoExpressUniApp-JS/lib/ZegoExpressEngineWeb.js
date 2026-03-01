// @ts-nocheck
// #ifndef VUE3
import { ZegoExpressEngine as ZegoExpressEngine_webRTC_UMD } from './static/ZegoExpressWebRTC.js';
// #endif
// #ifdef VUE3
import { ZegoExpressEngine as ZegoExpressEngine_webRTC_ESM } from './static/ZegoExpressWebRTC.esm.js';
// #endif
let ZegoExpressEngine_webRTC;
// #ifndef VUE3
ZegoExpressEngine_webRTC = ZegoExpressEngine_webRTC_UMD;
// #endif
// #ifdef VUE3
ZegoExpressEngine_webRTC = ZegoExpressEngine_webRTC_ESM;
// #endif
import { ZegoPublisherState, ZegoPlayerState, ZegoRoomState } from "./ZegoExpressDefines";
import { MediaPlayer } from './common/zego.mediaplayer';
import { getPromiseInstance, isNotSupported, formatObjString } from './util/index';
export default class ZegoExpressEngine {
    /**
     * 初始化 Engine
     *
     * Note: 支持版本：1.0.0
     *
     * Note: 详情描述：实例化对象。
     *
     * Note: 业务场景：所有场景必须。
     *
     * Note: 默认值：无默认值，所有参数必须填写。
     *
     * Note: 调用时机：第一个调用。
     *
     * Note: 使用限制：无
     *
     * Note: 注意事项：server 建议填写数组，备用域名抗弱网能力更强。
     *
     * Note: 影响范围：无
     *
     * Note: 相关回调：无
     *
     * Note: 相关接口：无
     *
     * Note: 平台差异：无
     *
     * @param appID 用于区分不同客户和项目的唯一标识（必须为 number 类型），且必须从即构控制台获取。一个 appID 对应一个客户项目，不同端共有一个 appID 实现互通 ，一个客户可以申请多个 appID。

     * @param server 表示 SDK 连接的即构服务器地址（支持备用域名），必须从控制台获取，SDK 内的大多数功能都通过该服务器地址交互 。同一个 appID 可以填写多个 server，也可以不传，有默认值
     */
    constructor(appID, server) {
        this.zegoWebRTC = new ZegoExpressEngine_webRTC(appID, server || 'test');
        ZegoExpressEngine._instance = this;
        this.channelData = new Map();
        this.beautyEnable = false;
        this.beautyParams = null;
        this.cameraConfig = {};
        this.zegoWebRTC.setDebugVerbose(false);
        ZegoExpressEngine.rangeAudioInstance = this.zegoWebRTC.createRangeAudioInstance();
    }
    static instance() {
        return ZegoExpressEngine._instance;
    }
    /**
     * Creates a singleton instance of ZegoExpressEngine.
     */
    static createEngineWithProfile(profile) {
        return getPromiseInstance(new ZegoExpressEngine(profile.appID, 'test'));
    }
    /**
     * Initializes the Engine.
     *
     * The engine needs to be initialized before calling other APIs
     * @param {number} appID - Application ID issued by ZEGO for developers, please apply from the ZEGO Admin Console https://console-express.zego.im/. The value ranges from 0 to 4294967295.
     * @param {string} appSign - Application signature for each AppID, please apply from the ZEGO Admin Console. Application signature is a 64 character string. Each character has a range of '0' ~ '9', 'a' ~ 'z'.
     * @param {boolean} isTestEnv - Choose to use a test environment or a formal commercial environment, the formal environment needs to submit work order configuration in the ZEGO management console. The test environment is for test development, with a limit of 30 rooms and 230 users. Official environment App is officially launched. ZEGO will provide corresponding server resources according to the configuration records submitted by the developer in the management console. The test environment and the official environment are two sets of environments and cannot be interconnected.
     * @param {ZegoScenario} scenario - The application scenario. Developers can choose one of ZegoScenario based on the scenario of the app they are developing, and the engine will preset a more general setting for specific scenarios based on the set scenario. After setting specific scenarios, developers can still call specific api to set specific parameters if they have customized parameter settings.
     * @return {ZegoExpressEngine_webRTC} singleton instance of ZegoExpressEngine
     * @deprecated Please use the method [createEngineWithProfile] instead.
     */
    static createEngine(appID, appSign, isTestEnv, scenario) {
        // return ZegoExpressEngineImpl.createEngine(appID, appSign, isTestEnv, scenario);
        return getPromiseInstance(new ZegoExpressEngine(appID, 'test'));
    }
    /**
     * Uninitializes the Engine.
     *
     * uninitialize engine to release the resources
     */
    static destroyEngine() {
        const _this = ZegoExpressEngine._instance;
        if (_this) {
            const mainStream = _this.channelData?.get(0)?.get('stream');
            const auxStream = _this.channelData?.get(0)?.get('stream');
            return new Promise(async (res, rej) => {
                try {
                    mainStream && await _this?.zegoWebRTC.destroyStream(mainStream);
                    auxStream && await _this?.zegoWebRTC.destroyStream(auxStream);
                    // _this?.logoutRoom()
                    _this?.stopPreview(0);
                    _this?.stopPreview(1);
                    _this?.zegoWebRTC.destroyEngine();
                    ZegoExpressEngine._instance = null;
                    res(true);
                }
                catch (error) {
                    rej(error);
                }
            });
        }
    }
    /**
     * Gets the SDK's version number.
     *
     * When the SDK is running, the developer finds that it does not match the expected situation and submits the problem and related logs to the ZEGO technical staff for locating. The ZEGO technical staff may need the information of the engine version to assist in locating the problem.
     * Developers can also collect this information as the version information of the engine used by the app, so that the SDK corresponding to each version of the app on the line.
     * @return {string} - SDK version
     */
    static getVersion() {
        return getPromiseInstance.call(this, ZegoExpressEngine._instance?.zegoWebRTC.getVersion());
    }
    /** Sets up the advanced engine configurations.
     *
     * Developers need to call this interface to set advanced function configuration when they need advanced functions of the engine.
     *
     * @param {ZegoEngineConfig} config Advanced engine configuration
     */
    static setEngineConfig() {
        return isNotSupported('setEngineConfig');
    }
    /**
     * Set room mode.
     *
     * Description: If you need to use the multi-room feature, please call this function to complete the configuration.
     * When to call: Must be set before calling [createEngine] to take effect, otherwise it will fail.
     * Restrictions: If you need to use the multi-room feature, please contact the instant technical support to configure the server support.
     * Caution: None.
     *
     * @param mode Room mode. Description: Used to set the room mode. Use cases: If you need to enter multiple rooms at the same time for publish-play stream, please turn on the multi-room mode through this interface. Required: True. Default value: ZEGO_ROOM_MODE_SINGLE_ROOM.
     */
    static setRoomMode(mode) {
        return getPromiseInstance.call(this, ZegoExpressEngine._instance?.zegoWebRTC.enableMultiRoom(mode === 1));
    }
    /**
     * 根据channel返回对应的流
     * Main = 0, Aux = 1
     * @param event event type
     */
    async getStreamByChannel(channel) {
        let channelData = this.channelData.get(channel || 0) || new Map();
        let stream = channelData.get('stream');
        if (!stream) {
            let streamConfig = channelData.get('streamConfig');
            if (streamConfig?.camera) {
                streamConfig.camera = { ...streamConfig.camera, ...this.cameraConfig };
            }
            stream = await this.zegoWebRTC.createStream(streamConfig);
            const data = this.channelData.get(channel || 0) || new Map();
            data.set('stream', stream);
            this.channelData.set(channel || 0, data);
        }
        return stream;
    }
    /**
     * Register event handler
     *
     * @param event event type
     * @param callback callback
     */
    on(event, callback) {
        const isNotSupportedArr = ['roomStreamExtraInfoUpdate', 'apiCalledResult', 'roomOnlineUserCountUpdate', 'publisherRenderVideoFirstFrame', 'publisherCapturedAudioFirstFrame',
            'publisherCapturedVideoFirstFrame', 'playerRecvAudioFirstFrame', 'playerRecvVideoFirstFrame', 'playerRenderVideoFirstFrame', 'publisherVideoSizeChanged', 'playerVideoSizeChanged',
            'publisherRelayCDNStateUpdate', 'playerMediaEvent', 'mixerRelayCDNStateUpdate', 'mixerSoundLevelUpdate', 'autoMixerSoundLevelUpdate', 'mediaPlayerStateUpdate', 'mediaPlayerNetworkEvent',
            'mediaPlayerPlayingProgress', 'remoteSpeakerStateUpdate', 'audioRouteChange'
        ];
        if (isNotSupportedArr.includes(event))
            return isNotSupported(event);
        let newEvent = this.changeEventName(event);
        let newCallback;
        switch (event) {
            case 'publisherQualityUpdate':
                newCallback = (streamID, quality) => {
                    let newQuality;
                    const { video, audio } = quality;
                    const packetLostRate = (video.videoPacketsLostRate + audio.audioPacketsLostRate) ? (video.videoPacketsLost + audio.audioPacketsLost) / (video.videoPacketsLost / video.videoPacketsLostRate + audio.audioPacketsLost / audio.audioPacketsLostRate) : 0;
                    newQuality = { ...quality, videoSendFPS: video.videoTransferFPS, rtt: quality.totalRoundTripTime, videoKBPS: video.videoBitrate, audioKBPS: audio.audioBitrate, audioSendFPS: audio.audioFPS, packetLostRate };
                    callback(streamID, newQuality);
                };
                break;
            case 'playerQualityUpdate':
                newCallback = (streamID, quality) => {
                    let newQuality;
                    const { video, audio } = quality;
                    const packetLostRate = (video.videoPacketsLostRate + audio.audioPacketsLostRate) ? (video.videoPacketsLost + audio.audioPacketsLost) / (video.videoPacketsLost / video.videoPacketsLostRate + audio.audioPacketsLost / audio.audioPacketsLostRate) : 0;
                    newQuality = {
                        ...quality, videoKBPS: video.videoBitrate, rtt: quality.totalRoundTripTime, videoRecvFPS: video.videoFPS, audioKBPS: audio.audioBitrate, audioRecvFPS: audio.audioFPS, packetLostRate,
                        audioDejitterFPS: audio.audioJitter, videoDejitterFPS: video.videoJitter
                    };
                    callback(streamID, newQuality);
                };
                break;
            case 'roomUserUpdate':
                newCallback = (roomID, updateType, userList) => {
                    callback(roomID, updateType == 'ADD' ? 0 : 1, userList);
                };
            case 'roomStreamUpdate':
                newCallback = (roomID, updateType, streamList, extendedData) => {
                    callback(roomID, updateType == 'ADD' ? 0 : 1, streamList, extendedData && formatObjString(extendedData));
                };
                break;
            case 'roomStateUpdate':
                // 针对最后一个参数为 extendedData web为json，app 为object处理
                newCallback = function (roomID, reason, errorCode, extendedData) {
                    let state = ZegoRoomState.DisConnected;
                    switch (reason) {
                        case 'LOGINING':
                        case 'RECONNECTING':
                            state = ZegoRoomState.Connecting;
                            break;
                        case 'LOGINED':
                        case 'RECONNECTED':
                            state = ZegoRoomState.Connected;
                            break;
                    }
                    callback(roomID, state, errorCode, extendedData && formatObjString(extendedData));
                };
                break;
            case 'publisherStateUpdate':
            case 'playerStateUpdate':
                newCallback = (result) => {
                    let streamID, state, errorCode;
                    streamID = result.streamID;
                    state = result.state;
                    switch (result.state) {
                        case 'PUBLISH_REQUESTING':
                            state = ZegoPublisherState.PublishRequesting;
                            break;
                        case 'NO_PUBLISH':
                            state = ZegoPublisherState.NoPublish;
                            break;
                        case 'PUBLISHING':
                            state = ZegoPublisherState.Publishing;
                            break;
                        case 'PLAY_REQUESTING':
                            state = ZegoPlayerState.PlayRequesting;
                            break;
                        case 'PLAYING':
                            state = ZegoPlayerState.Playing;
                            break;
                        case 'NO_PLAY': state = ZegoPlayerState.NoPlay;
                    }
                    errorCode = result.errorCode;
                    callback(streamID, state, errorCode, result.extendedData && formatObjString(result.extendedData));
                };
                break;
            case 'remoteCameraStateUpdate':
                newCallback = (streamid, status) => {
                    if (status === 'OPEN') {
                        callback(streamid, 0);
                    }
                    else {
                        callback(streamid, 10);
                    }
                };
                break;
            case 'roomTokenWillExpire':
                newCallback = (roomID) => {
                    // token 过期时间少于30s时会触发
                    callback(roomID, 30);
                };
                break;
            default:
                newCallback = callback;
        }
        return this.zegoWebRTC.on(newEvent, newCallback);
    }
    /**
     * Unregister event handler
     *
     * @param event event type
     * @param callback callback
     */
    off(event, callback) {
        return this.zegoWebRTC.off(this.changeEventName(event), callback);
    }
    changeEventName(event) {
        let newEvent;
        newEvent = event;
        switch (event) {
            case 'roomStateUpdate':
                newEvent = 'roomStateChanged';
                break;
            case 'roomTokenWillExpire':
                newEvent = 'tokenWillExpire';
                break;
            case 'roomStreamExtraInfoUpdate':
                newEvent = 'streamExtraInfoUpdate';
                break;
            case 'publisherQualityUpdate':
                newEvent = 'publishQualityUpdate';
                break;
            case 'playerQualityUpdate':
                newEvent = 'playQualityUpdate';
                break;
            case 'capturedSoundLevelInfoUpdate':
                newEvent = 'capturedSoundLevelUpdate';
                break;
            case 'remoteSoundLevelInfoUpdate':
                newEvent = 'SoundLevelUpdate';
                break;
            case 'localDeviceExceptionOccurred':
                newEvent = 'deviceError';
                break;
            case 'remoteCameraStateUpdate':
                newEvent = 'remoteCameraStatusUpdate';
                break;
        }
        return newEvent;
    }
    /**
     * Uploads logs to the ZEGO server.
     *
     * By default, SDK creates and prints log files in the app's default directory. Each log file defaults to a maximum of 5MB. Three log files are written over and over in a circular fashion. When calling this interface, SDK will auto package and upload the log files to the ZEGO server.
     * Developers can provide a business “feedback” channel in the app. When users feedback problems, they can call this interface to upload the local log information of SDK to help locate user problems.
     * The API is valid for the entire life cycle of the SDK.
     */
    uploadLog() {
        return isNotSupported('uploadLog');
    }
    /**
     * Call the RTC experimental API.
     *
     * Available since: 2.7.0
     * Description: ZEGO provides some technical previews or special customization functions in RTC business through this API. If you need to get the use of the function or the details, please consult ZEGO technical support.
     * When to call: After [createEngine].
     *
     * @param {string} params You need to pass in a parameter in the form of a JSON string, please consult ZEGO technical support for details.
     * @return {string} Returns an argument in the format of a JSON string, please consult ZEGO technical support for details.
     */
    callExperimentalAPI() {
        return isNotSupported('callExperimentalAPI');
    }
    /**
     * Set the path of the static picture would be published when the camera is closed.
     *
     * Description: Set the path of the static picture would be published when enableCamera(false) is called, it would start to publish static pictures, and when enableCamera(true) is called, it would end publishing static pictures.
     * Use case: The developer wants to display a static picture when the camera is closed. For example, when the anchor exits the background, the camera would be actively closed. At this time, the audience side needs to display the image of the anchor temporarily leaving.
     * When to call: After the engine is initialized, call this API to configure the parameters before closing the camera.
     * Restrictions: 1. Supported picture types are JPEG/JPG, PNG, BMP, HEIF. 2. The function is only for SDK video capture and does not take effect for custom video capture.
     * Caution: 1. The static picture cannot be seen in the local preview. 2. External filters, mirroring, watermarks, and snapshots are all invalid. 3. If the picture aspect ratio is inconsistent with the set code aspect ratio, it will be cropped according to the code aspect ratio.
     * Platform differences: 1. Windows: Fill in the location of the picture directly, such as "D://dir//image.jpg". 2. iOS: If it is a full path, add the prefix "file:", such as @"file:/var/image.png"; If it is a assets picture path, add the prefix "asset:", such as @"asset:watermark". 3. Android: If it is a full path, add the prefix "file:", such as "file:/sdcard/image.png"; If it is a assets directory path, add the prefix "asset:", such as "asset:watermark.png".
     *
     * @param {string} filePath Picture file path
     * @param {ZegoPublishChannel} channel Publish channel.
     */
    async setDummyCaptureImagePath(filePath, channel) {
        const stream = await this.getStreamByChannel(channel);
        return this.zegoWebRTC.setDummyCaptureImagePath(filePath, stream);
    }
    /**
     * Logs in to a room. You must log in to a room before publishing or playing streams.
     *
     * To prevent the app from being impersonated by a malicious user, you can add authentication before logging in to the room, that is, the [token] parameter in the ZegoRoomConfig object passed in by the [config] parameter.
     * Different users who log in to the same room can get room related notifications in the same room (eg [onRoomUserUpdate], [onRoomStreamUpdate], etc.), and users in one room cannot receive room signaling notifications in another room.
     * Messages sent in one room (eg apis [setStreamExtraInfo], [sendBroadcastMessage], [sendBarrageMessage], [sendCustomCommand], etc.) cannot be received callback ((eg [onRoomStreamExtraInfoUpdate], [onIMRecvBroadcastMessage], [onIMRecvBarrageMessage], [onIMRecvCustomCommand], etc) in other rooms. Currently, SDK does not provide the ability to send messages across rooms. Developers can integrate the SDK of third-party IM to achieve.
     * SDK supports startPlayingStream audio and video streams from different rooms under the same appID, that is, startPlayingStream audio and video streams across rooms. Since ZegoExpressEngine's room related callback notifications are based on the same room, when developers want to startPlayingStream streams across rooms, developers need to maintain related messages and signaling notifications by themselves.
     * If the network is temporarily interrupted due to network quality reasons, the SDK will automatically reconnect internally. You can get the current connection status of the local room by listening to the [onRoomStateUpdate] callback method, and other users in the same room will receive [onRoomUserUpdate] callback notification.
     * It is strongly recommended that userID corresponds to the user ID of the business APP, that is, a userID and a real user are fixed and unique, and should not be passed to the SDK in a random userID. Because the unique and fixed userID allows ZEGO technicians to quickly locate online problems.
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {ZegoUser} user - User object instance, configure userID, userName. Note that the userID needs to be globally unique with the same appID, otherwise the user who logs in later will kick out the user who logged in first.
     * @param {ZegoRoomConfig} config - Advanced room configuration
     */
    loginRoom(roomID, user, config) {
        const { token, isUserStatusNotify } = config || {};
        let newConfig;
        newConfig = {};
        if (config) {
            newConfig.userUpdate = isUserStatusNotify;
        }
        return this.zegoWebRTC.loginRoom(roomID, token || '', user, newConfig);
    }
    /**
     * Logs out of a room.
     *
     * Description: This API will log out the room named roomID. If roomID is not passed in, all rooms will be exited.
     * Use cases: In the same room, users can conduct live broadcast, audio and video calls, etc.
     * When to call /Trigger: After successfully logging in to the room, if the room is no longer used, the user can call the function [logoutRoom].
     * Restrictions: None.
     * Caution: 1. Exiting the room will stop all publishing and playing streams for user, and inner audio and video engine will stop, and then SDK will auto stop local preview UI. If you want to keep the preview ability when switching rooms, please use the [switchRoom] method. 2. If the user logs in to the room, but the incoming 'roomID' is different from the logged-in room name, SDK will return failure.
     * Related callbacks: After calling this function, you will receive [onRoomStateUpdate] callback notification successfully exits the room, while other users in the same room will receive the [onRoomUserUpdate] callback notification(On the premise of enabling isUserStatusNotify configuration).
     * Related APIs: Users can use [loginRoom] function to log in rooms.
     *
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     */
    logoutRoom(roomID) {
        return getPromiseInstance(this.zegoWebRTC.logoutRoom(roomID));
    }
    /**
     * Switch the room.
     *
     * Description: Using this interface allows users to quickly switch from one room to another room.
     * Use cases: If you need to quickly switch to the next room, you can call this function.
     * When to call /Trigger: After successfully login room.
     * Restrictions: None.
     * Caution: 1. When this function is called, all streams currently publishing or playing will stop (but the local preview will not stop). 2. When the function [setRoomMode] is used to set ZegoRoomMode to ZEGO_ROOM_MODE_MULTI_ROOM, this function is not available.
     * Privacy reminder: Please do not fill in sensitive user information in this interface, including but not limited to mobile phone number, ID number, passport number, real name, etc.
     * Related callbacks: When the user call the [switchRoom] function, the [onRoomStateUpdate] callback will be triggered to notify the developer of the status of the current user connected to the room.
     * Related APIs: Users can use the [logoutRoom] function to log out of the room.
     *
     * @param fromRoomID Current roomID.
     * @param toRoomID The next roomID.
     */
    switchRoom() {
        return isNotSupported("switchRoom");
    }
    /**
     * Renew token.
     *
     * Description: After the developer receives [onRoomTokenWillExpire], they can use this API to update the token to ensure that the subsequent RTC functions are normal.
     * Use cases: Used when the token is about to expire.
     * When to call /Trigger: After the developer receives [onRoomTokenWillExpire].
     * Restrictions: None.
     * Caution: The token contains important information such as the user's room permissions, publish stream permissions, and effective time, please refer to https://doc-en.zego.im/article/11649.
     * Related callbacks: None.
     * Related APIs: None.
     *
     * @param roomID Room ID.
     * @param token The token that needs to be renew.
     */
    renewToken(roomID, token) {
        return getPromiseInstance(this.zegoWebRTC.renewToken(token, roomID));
    }
    /**
     * Set room extra information.
     *
     * User this function to set room extra info, the result will be notified via the ZegoRoomSetRoomExtraInfoResult. For restrictions on the use of this function, please refer to https://doc-zh.zego.im/article/7580  or contact ZEGO technical support.
     * @param roomID Room ID.
     * @param key key of the extra info.
     * @param value value if the extra info.
     * @returns result for setting room extra information.
     */
    setRoomExtraInfo(roomID, key, value) {
        return this.zegoWebRTC.setRoomExtraInfo(roomID, key, value);
    }
    /**
     * Sends a Broadcast Message.
     *
     * The sending frequency of broadcast messages in the same room cannot be higher than 10 messages/s.
     * A certain number of users in the same room who entered the room earlier can receive this callback. The message is reliable. It is generally used when the number of people in the live room is less than a certain number. The specific number is determined by the configuration of the ZEGO server.
     *
     * @param {string} roomID Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {string} message Message content, no longer than 1024 bytes
     * @return {ZegoIMSendBroadcastMessageResult} callback Send broadcast message result callback
     */
    sendBroadcastMessage(roomID, message) {
        return this.zegoWebRTC.sendBroadcastMessage(roomID, message);
    }
    /**
     * Sends a Barrage Message (bullet screen) to all users in the same room, without guaranteeing the delivery.
     *
     * The frequency of sending barrage messages in the same room cannot be higher than 20 messages/s.
     * The message is unreliable. When the frequency of sending barrage messages in the entire room is greater than 20 messages/s, the recipient may not receive the message. It is generally used in scenarios where there is a large number of messages sent and received in the room and the reliability of the messages is not required, such as live broadcast barrage.
     *
     * @param {string} roomID Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {string} message Message content, no longer than 1024 bytes
     * @return {ZegoIMSendBarrageMessageResult} callback Send barrage message result callback
     */
    sendBarrageMessage(roomID, message) {
        return this.zegoWebRTC.sendBarrageMessage(roomID, message);
    }
    /**
     * Sends a Custom Command to the specified users in the same room.
     *
     * The frequency of custom messages sent to a single user in the same room cannot be higher than 200 messages/s, and the frequency of custom messages sent to multiple users cannot be higher than 10 messages/s.
     * The point-to-point signaling type in the same room is generally used for remote control signaling or for sending messages between users. The messages are reliable.
     *
     * @param {string} roomID Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {string} command Custom command content, no longer than 1024 bytes
     * @param {ZegoUser[]} toUserList The users who will receive the command
     * @return {ZegoIMSendCustomCommandResult} callback Send command result callback
     */
    sendCustomCommand(roomID, command, toUserList) {
        const webtoUserList = toUserList?.map(item => item?.userID);
        return this.zegoWebRTC.sendCustomCommand(roomID, command, webtoUserList || []);
    }
    /**
     * Starts publishing a stream. Support multi-room mode.
     *
     * Description: Users push their local audio and video streams to the ZEGO RTC server or CDN, and other users in the same room can pull the audio and video streams to watch through the `streamID` or CDN pull stream address.
     * Use cases: It can be used to publish streams in real-time connecting wheat, live broadcast and other scenarios.
     * When to call: After [loginRoom].
     * Restrictions: None.
     * Caution: 1. Before start to publish the stream, the user can choose to call [setVideoConfig] to set the relevant video parameters, and call [startPreview] to preview the video. 2. Other users in the same room can get the streamID by monitoring the [onRoomStreamUpdate] event callback after the local user publishing stream successfully. 3. In the case of poor network quality, user publish may be interrupted, and the SDK will attempt to reconnect. You can learn about the current state and error information of the stream published by monitoring the [onPublisherStateUpdate] event. 4. To call [SetRoomMode] function to select multiple rooms, the room ID must be specified explicitly.
     *
     * @param streamID Stream ID, a string of up to 256 characters, needs to be globally unique within the entire AppID. If in the same AppID, different users publish each stream and the stream ID is the same, which will cause the user to publish the stream failure. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     * @param config Advanced publish configuration.
     * @param channel Publish stream channel.
     */
    async startPublishingStream(streamID, channel, config) {
        channel = channel || 0;
        const localstream = await this.getStreamByChannel(channel);
        let data = this.channelData.get(channel) || new Map();
        data.set('publisConfig', config);
        data.set('streamID', streamID);
        data.set('stopPub', false);
        this.channelData.set(channel, data);
        if (this.beautyEnable) {
            // 若开启美颜
            await this.zegoWebRTC.setEffectsBeauty(localstream, this.beautyEnable, this.beautyParams || {});
        }
        config = Object.assign(config || {}, this.publishOption || {});
        const result = await getPromiseInstance(this.zegoWebRTC.startPublishingStream(streamID, localstream, config));
        if (result === true)
            return getPromiseInstance(localstream);
        return getPromiseInstance(result);
    }
    /**
     * Stops publishing a stream.
     *
     * Available since: 1.1.0
     * Description: The user stops sending local audio and video streams, and other users in the room will receive a stream deletion notification.
     * Use cases: It can be used to stop publish streams in real-time connecting wheat, live broadcast and other scenarios.
     * When to call: After [startPublishingStream].
     * Restrictions: None.
     * Caution: 1. After stopping the streaming, other users in the same room can receive the delete notification of the stream by listening to the [onRoomStreamUpdate] callback. 2. If the user has initiated publish flow, this function must be called to stop the publish of the current stream before publishing the new stream (new streamID), otherwise the new stream publish will return a failure. 3. After stopping streaming, the developer should stop the local preview based on whether the business situation requires it.
     *
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    stopPublishingStream(channel) {
        const data = this.channelData.get(channel || 0);
        const streamID = data?.get('streamID');
        data?.set('stopPub', true);
        this.channelData.set(channel || 0, null);
        if (data && data.get('stopPre')) {
            this.zegoWebRTC.destroyStream(data.get('stream'));
        }
        return getPromiseInstance(this.zegoWebRTC.stopPublishingStream(streamID));
    }
    /**
     * Starts/Updates the local video preview.
     *
     * The user can see his own local image by calling this interface. The preview function does not require you to log in to the room or publish the stream first. But after exiting the room, SDK internally actively stops previewing by default.
     * Local view and preview modes can be updated by calling this interface again.
     * You can set the mirror mode of the preview by calling the [setVideoMirrorMode] interface. The default preview setting is image mirrored.
     * When this api is called, the audio and video engine module inside SDK will start really, and it will start to try to collect audio and video. In addition to calling this api normally to preview the local screen, developers can also pass [null] to the canvas parameter, in conjunction with ZegoExpressEngine's sound wave function, in order to achieve the purpose of detecting whether the audio equipment is working properly before logging in to the room.
     * @param {ZegoView} view - The view used to display the preview image.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     * @param {HTMLMediaElement} videoElement - Only web pages are supported
     */
    async startPreview(videoElement, channel) {
        if (!videoElement)
            return console.warn('the startPreview must be have a target Element');
        const data = this.channelData.get(channel || 0) || new Map();
        const localstream = await this.getStreamByChannel(channel);
        if (this.beautyEnable) {
            // 若开启美颜
            await this.zegoWebRTC.setEffectsBeauty(localstream, this.beautyEnable, this.beautyParams || {});
        }
        videoElement.srcObject = localstream;
        data.set("stopPre", false);
        data.set('previewVideoElem', videoElement);
        this.channelData.set(channel || 0, data);
    }
    /**
     * Stops the local video preview.
     *
     * This api can be called to stop previewing when there is no need to see the preview locally.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    stopPreview(channel) {
        return new Promise(res => {
            const data = this.channelData?.get(channel || 0) || new Map();
            data.set("stopPre", true);
            const videoElem = data?.get('previewVideoElem');
            if (videoElem) {
                videoElem.srcObject = null;
                data?.delete('previewVideoElem');
            }
            this.channelData.set(channel || 0, data);
            if (data && data.get('stopPub')) {
                this.zegoWebRTC.destroyStream(data.get('stream'));
            }
            res();
        });
    }
    /**
     * Sets up the video configurations.
     *
     * This api can be used to set the video frame rate, bit rate, video capture resolution, and video encoding output resolution. If you do not call this api, the default resolution is 360p, the bit rate is 600 kbps, and the frame rate is 15 fps.
     * It is necessary to set the relevant video configuration before publishing the stream, and only support the modification of the encoding resolution and the bit rate after publishing the stream.
     * Developers should note that the wide and high resolution of the mobile end is opposite to the wide and high resolution of the PC. For example, in the case of 360p, the resolution of the mobile end is 360x640, and the resolution of the PC end is 640x360.
     * @param {(ZegoVideoConfigPreset|ZegoVideoConfig)} config - Video configuration, the SDK provides a common setting combination of resolution, frame rate and bit rate, they also can be customized.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    async setVideoConfig(config, channel) {
        let newConfig;
        if (typeof config === 'number') {
            const VideoConfigPreset = [
                { bitrate: 300, width: 320, height: 180 },
                { bitrate: 400, width: 480, height: 270 },
                { bitrate: 600, width: 640, height: 360 },
                { bitrate: 1200, width: 960, height: 540 },
                { bitrate: 1500, width: 1280, height: 720 },
                { bitrate: 3000, width: 1920, height: 1080 }
            ];
            newConfig = { frameRate: 15, ...VideoConfigPreset[config] };
        }
        else {
            newConfig = { width: config.captureWidth, height: config.captureHeight, frameRate: config.fps, maxBitrate: config.bitrate, bitrate: config.bitrate };
        }
        channel = channel || 0;
        let data = this.channelData.get(channel) || new Map();
        const streamConfig = data.get("streamConfig") || {};
        if (config.codecID !== undefined) {
            this.publishOption = this.publishOption || {};
            this.publishOption.videoCodec = config.codecID == 2 ? 'VP8' : 'H264';
        }
        // webConfig转换过的config适用于webRTC
        data.set('videoConfig', { config, webConfig: newConfig });
        // 屏幕共享参数设置
        if (streamConfig.screen) {
            streamConfig.screen = {
                ...newConfig,
                videoQuality: 4
            };
            data.set('streamConfig', streamConfig);
            this.channelData.set(channel, data);
            return getPromiseInstance({ errorCode: 0, extendedData: '' });
        }
        this.channelData.set(channel, data);
        const localstream = await this.getStreamByChannel(channel);
        return this.zegoWebRTC.setVideoConfig(localstream, newConfig);
    }
    /**
     * Gets the current video configurations.
     *
     * This api can be used to get the specified publish channel's current video frame rate, bit rate, video capture resolution, and video encoding output resolution.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     * @return {ZegoVideoConfig} - Video configuration object
     */
    getVideoConfig(channel) {
        return getPromiseInstance(this.channelData?.get(channel || 0)?.get('videoConfig')?.config);
    }
    /**
     * Sets the video mirroring mode.
     *
     * This interface can be called to set whether the local preview video and the published video have mirror mode enabled.
     *
     * @param {ZegoVideoMirrorMode} mirrorMode - Mirror mode for previewing or publishing the stream
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    setVideoMirrorMode() {
        return isNotSupported('setVideoMirrorMode');
    }
    /** Sets the video orientation.
     *
     * This interface sets the orientation of the video. After rotation, it will be automatically adjusted to adapt the encoded image resolution.
     *
     * @param orientation Video orientation
     * @param channel Publish stream channel. [Main] as default.
     */
    setAppOrientation() {
        return isNotSupported('setAppOrientation');
    }
    /**
     * Sets up the audio configurations.
     *
     * Description: You can set the combined value of the audio codec, bit rate, and audio channel through this function. If the preset value cannot meet the developer's scenario, the developer can set the parameters according to the business requirements.
     * Default value: The default audio config refers to the default value of [ZegoAudioConfig].
     * When to call: After the engine is created [createEngine], and before publishing [startPublishingStream].
     * Restrictions: None.
     * Related APIs: [getAudioConfig].
     *
     * @param config Audio config.
     * @param channel Publish stream channel. [Main] as default.
     */
    // setAudioConfig(config: ZegoAudioConfig, channel?: ZegoPublishChannel): Promise<ZegoServerResponse> {
    //     return this.zegoWebRTC.setAudioConfig(this.getStreamByChannel(channel), config);
    // }
    /**
     * Gets the current audio configurations.
     *
     * Description: You can get the current audio codec, bit rate, and audio channel through this function.
     * When to call: After the engine is created [createEngine].
     *
     * @param channel Publish stream channel. [Main] as default.
     */
    // getAudioConfig(): any {
    //     return isNotSupported('getAudioConfig')
    // }
    /**
     * Stops or resumes sending the audio part of a stream.
     *
     * This interface can be called when publishing the stream to publish only the video stream without publishing the audio. The SDK still collects and processes the audio, but does not send the audio data to the network. It can be set before publishing.
     * If you stop sending audio streams, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteMicStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending audio streams, true means that only the video stream is sent without sending the audio stream, and false means that the audio and video streams are sent simultaneously. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    async mutePublishStreamAudio(mute, channel) {
        const stream = await this.getStreamByChannel(channel);
        return this.zegoWebRTC.mutePublishStreamAudio(stream, mute);
    }
    /**
     * Stops or resumes sending the video part of a stream.
     *
     * When publishing the stream, this interface can be called to publish only the audio stream without publishing the video stream. The local camera can still work normally, and can normally capture, preview and process the video picture, but does not send the video data to the network. It can be set before publishing.
     * If you stop sending video streams locally, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteCameraStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending video streams, true means that only the audio stream is sent without sending the video stream, and false means that the audio and video streams are sent at the same time. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    async mutePublishStreamVideo(mute, channel) {
        const stream = await this.getStreamByChannel(channel);
        return this.zegoWebRTC.mutePublishStreamVideo(stream, mute);
    }
    /**
     * Enables or disables traffic control.
     *
     * Traffic control enables SDK to dynamically adjust the bitrate of audio and video streaming according to its own and peer current network environment status.
     * Automatically adapt to the current network environment and fluctuations, so as to ensure the smooth publishing of stream.
     * @param {boolean} enable - Whether to enable traffic control. The default is ture.
     * @param {ZegoTrafficControlProperty} property - Adjustable property of traffic control, bitmask format. Should be one or the combinations of [ZegoTrafficControlProperty] enumeration. [AdaptiveFPS] as default.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    enableTrafficControl() {
        return isNotSupported('enableTrafficControl');
    }
    /**
     * Sets the minimum video bitrate for traffic control.
     *
     * Set how should SDK send video data when the network conditions are poor and the minimum video bitrate cannot be met.
     * When this function is not called, the SDK will automatically adjust the sent video data frames according to the current network uplink conditions by default.
     * @param {number} bitrate Minimum video bitrate (kbps)
     * @param {ZegoTrafficControlMinVideoBitrateMode} mode Video sending mode below the minimum bitrate.
     * @param {ZegoPublishChannel} channel Publish stream channel. [Main] as default.
     */
    setMinVideoBitrateForTrafficControl() {
        return isNotSupported('setMinVideoBitrateForTrafficControl');
    }
    /**
     * Sets the audio recording volume for stream publishing.
     *
     * This interface is used to set the audio collection volume. The local user can control the volume of the audio stream sent to the far end. It can be set before publishing.
     * @param {number} volume - Volume percentage. The range is 0 to 100. Default value is 100.
     */
    setCaptureVolume(volume) {
        const stream = this.channelData.get(0)?.get('stream') || this.channelData.get(1)?.get('stream');
        return this.zegoWebRTC.setCaptureVolume(stream, volume);
    }
    /**
     * Enables or disables hardware encoding.
     *
     * Whether to use the hardware encoding function when publishing the stream, the GPU is used to encode the stream and to reduce the CPU usage. The setting can take effect before the stream published. If it is set after the stream published, the stream should be stopped first before it takes effect.
     * Because hard-coded support is not particularly good for a few models, SDK uses software encoding by default. If the developer finds that the device is hot when publishing a high-resolution audio and video stream during testing of some models, you can consider calling this interface to enable hard coding.
     * @param {boolean} enable - Whether to enable hardware encoding, true: enable hardware encoding, false: disable hardware encoding
     */
    enableHardwareEncoder() {
        return isNotSupported('enableHardwareEncoder');
    }
    /**
     * Adds a target CDN URL to which the stream will be relayed from ZEGO RTC server.
     *
     * Description: Forward audio and video streams from ZEGO RTC servers to custom CDN content distribution networks with high latency but support for high concurrent pull streams.
     * Use cases: 1. It is often used in large-scale live broadcast scenes that do not have particularly high requirements for delay. 2. Since ZEGO RTC server itself can be configured to support CDN(content distribution networks), this function is mainly used by developers who have CDN content distribution services themselves. 3. This function supports dynamic relay to the CDN content distribution network, so developers can use this function as a disaster recovery solution for CDN content distribution services.
     * When to call: After calling the [createEngine] function to create the engine.
     * Restrictions: When the [enablePublishDirectToCDN] function is set to true to publish the stream straight to the CDN, then calling this function will have no effect.
     * Related APIs: Remove URLs that are re-pushed to the CDN [removePublishCdnUrl].
     *
     * @param streamID Stream ID.
     * @param targetURL CDN relay address, supported address format is rtmp, rtmps.
     * @returns The execution result of update the relay CDN operation
     */
    addPublishCdnUrl(targetURL, streamID) {
        return this.zegoWebRTC.addPublishCdnUrl(streamID, targetURL);
    }
    /**
     * Deletes the specified CDN URL, which is used for relaying streams from ZEGO RTC server to CDN.
     *
     * Description: When a CDN forwarding address has been added via [addPublishCdnUrl], this function is called when the stream needs to be stopped.
     * When to call: After calling the [createEngine] function to create the engine.
     * Restrictions: When the [enablePublishDirectToCDN] function is set to true to publish the stream straight to the CDN, then calling this function will have no effect.
     * Caution: This function does not stop publishing audio and video stream to the ZEGO ZEGO RTC server.
     * Related APIs: Add URLs that are re-pushed to the CDN [addPublishCdnUrl].
     *
     * @param targetURL Stream ID
     * @param streamID CDN relay address, supported address format rtmp.
     * @returns The execution result of update the relay CDN operation
     */
    removePublishCdnUrl(targetURL, streamID) {
        return this.zegoWebRTC.removePublishCdnUrl(streamID, targetURL);
    }
    /**
     * Whether to directly push to CDN (without going through the ZEGO RTC server).
     *
     * Description: Whether to publish streams directly from the client to CDN without passing through Zego RTC server.
     * Use cases: It is often used in large-scale live broadcast scenes that do not have particularly high requirements for delay.
     * Default value: The default is false, and direct push is not enabled.
     * When to call: After creating the engine [createEngine], before starting to push the stream [startPublishingStream].
     * Caution: The Direct Push CDN feature does not pass through the ZEGO Real-Time Audio and Video Cloud during network transmission, so you cannot use ZEGO's ultra-low latency audio and video services.
     * Related APIs: Dynamic re-push to CDN function [addPublishCdnUrl], [removePublishCdnUrl].
     *
     * @param enable Whether to enable direct publish CDN, true: enable direct publish CDN, false: disable direct publish CDN
     * @param config CDN configuration, if null, use Zego's background default configuration
     * @param channel Publish stream channel
     */
    enablePublishDirectToCDN() {
        return isNotSupported('enablePublishDirectToCDN');
    }
    /**
     * Starts playing a stream from ZEGO's streaming cloud or from third-party CDN.
     *
     * This interface allows users to play audio and video streams both from the ZEGO real-time audio and video cloud and from third-party cdn.
     * Before starting to play the stream, you need to join the room first, you can get the new streamID in the room by listening to the [onRoomStreamUpdate] event callback.
     * In the case of poor network quality, user play may be interrupted, the SDK will try to reconnect, and the current play status and error information can be obtained by listening to the [onPlayerStateUpdate] event.
     * Playing the stream ID that does not exist, the SDK continues to try to play after executing this interface. After the stream ID is successfully published, the audio and video stream can be actually played.
     * The developer can update the player canvas by calling this interface again (the streamID must be the same).
     * @param {string} streamID - Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     * @param {ZegoView} view - The view used to display the preview image.
     * @param {ZegoPlayerConfig} config - Advanced player configuration
     */
    startPlayingStream(streamID, config) {
        return getPromiseInstance(this.zegoWebRTC.startPlayingStream(streamID, config));
    }
    /**
     * Stops playing a stream.
     *
     * This interface allows the user to stop playing the stream. When stopped, the attributes set for this stream previously, such as [setPlayVolume], [mutePlayStreamAudio], [mutePlayStreamVideo], etc., will be invalid and need to be reset when playing the the stream next time.
     * @param {string} streamID - Stream ID
     */
    stopPlayingStream(streamID) {
        return getPromiseInstance(this.zegoWebRTC.stopPlayingStream(streamID));
    }
    /**
     * Sets up the stream watermark before stream publishing (for the specified channel).
     *
     * Description: Set watermark for publish stream screen.
     * Use cases: It is often used to identify the source of the publish.
     * When to call: After creating the engine through [createEngine] function.
     * Caution: The layout of the watermark cannot exceed the video encoding resolution of the stream. It can be set at any time before or during the publishing stream.
     *
     * @param watermark The upper left corner of the watermark layout is the origin of the coordinate system, and the area cannot exceed the size set by the encoding resolution. If it is null, the watermark is cancelled.
     * @param isPreviewVisible the watermark is visible on local preview
     * @param channel Publish stream channel.
     */
    setPublishWatermark() {
        return isNotSupported('setPublishWatermark');
    }
    /**
     * Take a snapshot of the publishing stream.
     *
     * Description: Take a snapshot of the publishing stream.
     * When to call: Called this function after calling [startPublishingStream] or [startPreview].
     * Restrictions: None.
     * Caution: The resolution of the snapshot is the encoding resolution set in [setVideoConfig]. If you need to change it to capture resolution, please call [setCapturePipelineScaleMode] to change the capture pipeline scale mode to [Post]. Act on the main publish channel ZegoPublishChannel.Main.
     * Related callbacks: The screenshot result will be called back through [ZegoPublisherTakeSnapshotCallback] (Windows HBITMAP; macOS/iOS CGImageRef; Linux QImage; Android Bitmap).
     * Related APIs: [takePlayStreamSnapshot].
     *
     * @param callback Results of take publish stream snapshot.
     */
    takePublishStreamSnapshot() {
        return isNotSupported('takePublishStreamSnapshot');
    }
    /**
     * Take a snapshot of the playing stream.
     *
     * Description: Take a screenshot of the specified stream ID.
     * When to call: after called [startPlayingStream].
     * Restrictions: None.
     * Related callbacks: [onPlayerTakeSnapshotResult] Screenshot data callback.
     *
     * @param streamID Stream ID to be snapshot.
     * @param callback Results of take play stream snapshot.
     */
    takePlayStreamSnapshot() {
        return isNotSupported('takePlayStreamSnapshot');
    }
    /**
     * Sets the stream playback volume.
     *
     * Description: Set the sound size of the stream, the local user can control the playback volume of the audio stream.
     * When to call: after called [startPlayingStream].
     * Restrictions: None.
     * Related APIs: [setAllPlayStreamVolume] Set all stream volume.
     * Caution: You need to reset after [stopPlayingStream] and [startPlayingStream]. This function and the [setAllPlayStreamVolume] function overwrite each other, and the last call takes effect.
     *
     * @param {string} streamID - Stream ID
     * @param {number} volume - Volume percentage. The value ranges from 0 to 100, and the default value is 100.
     */
    setPlayVolume(streamID, volume) {
        // return getPromiseInstance.call(this, ZegoExpressEngine.zegoPlayer.setVolume(streamID, volume));
        return isNotSupported('setPlayVolume');
    }
    /**
     * Sets the all stream playback volume.
     *
     * Description: Set the sound size of the stream, the local user can control the playback volume of the audio stream.
     * When to call: after called [startPlayingStream].
     * Restrictions: None.
     * Related APIs: [setPlayVolume] Set the specified streaming volume.
     * Caution: You need to reset after [stopPlayingStream] and [startPlayingStream]. Set the specified streaming volume and [setAllPlayStreamVolume] interface to override each other, and the last call takes effect.
     *
     * @param volume Volume percentage. The value ranges from 0 to 200, and the default value is 100.
     */
    setAllPlayStreamVolume() {
        return isNotSupported('setAllPlayStreamVolume');
    }
    /**
     * Set play video stream type
     *
     * When the publish stream sets the codecID to SVC through [setVideoConfig], the puller can dynamically set and select different stream types (small resolution is one-half of the standard layer).
     * In general, when the network is weak or the rendered UI window is small, you can choose to pull videos with small resolutions to save bandwidth.
     * It can be set before and after pulling the stream.
     *
     * @param streamType Video stream type
     * @param streamID Stream ID.
     */
    setPlayStreamVideoType() {
        return isNotSupported('setPlayStreamVideoType');
    }
    /**
     * Set the adaptive adjustment interval range of the buffer for playing stream.
     *
     * Description: Set the range of adaptive adjustment of the internal buffer of the sdk when streaming is 0-4000ms.
     * Use cases: Generally, in the case of a poor network environment, adjusting and increasing the playback buffer of the pull stream will significantly reduce the audio and video freezes, but will increase the delay.
     * When to call: after called [createEngine].
     * Restrictions: None.
     * Caution: When the upper limit of the cache interval set by the developer exceeds 4000ms, the value will be 4000ms. When the upper limit of the cache interval set by the developer is less than the lower limit of the cache interval, the upper limit will be automatically set as the lower limit.
     *
     * @param streamID Stream ID.
     * @param minBufferInterval The lower limit of the buffer adaptation interval, in milliseconds. The default value is 0ms.
     * @param maxBufferInterval The upper limit of the buffer adaptation interval, in milliseconds. The default value is 4000ms.
     */
    setPlayStreamBufferIntervalRange() {
        return isNotSupported('setPlayStreamBufferIntervalRange');
    }
    /**
     * Set the weight of the pull stream priority.
     *
     * Description: Set the weight of the streaming priority.
     * Use cases: This interface can be used when developers need to prioritize the quality of a stream in business. For example: in class scene, if students pull multiple streams, you can set high priority for teacher stream.
     * When to call: after called [startPlayingStream].
     * Restrictions: None.
     * Caution: By default, all streams have the same weight. Only one stream can be set with high priority, whichever is set last. After the flow is stopped, the initial state is automatically restored, and all flows have the same weight.When the local network is not good, while ensuring the focus flow, other stalls may be caused more.
     *
     * @param streamID Stream ID.
     */
    setPlayStreamFocusOn() {
        return isNotSupported('setPlayStreamFocusOn');
    }
    /**
     * Whether the pull stream can receive the specified audio data.
     *
     * Description: In the process of real-time audio and video interaction, local users can use this function to control whether to receive audio data from designated remote users when pulling streams as needed. When the developer does not receive the audio receipt, the hardware and network overhead can be reduced.
     * Use cases: Call this function when developers need to quickly close and restore remote audio. Compared to re-flow, it can greatly reduce the time and improve the interactive experience.
     * When to call: This function can be called after calling [createEngine].
     * Caution: This function is valid only when the [muteAllPlayStreamAudio] function is set to `false`.
     * Related APIs: You can call the [muteAllPlayStreamAudio] function to control whether to receive all audio data. When the two functions [muteAllPlayStreamAudio] and [mutePlayStreamAudio] are set to `false` at the same time, the local user can receive the audio data of the remote user when the stream is pulled: 1. When the [muteAllPlayStreamAudio(true)] function is called, it is globally effective, that is, local users will be prohibited from receiving all remote users' audio data. At this time, the [mutePlayStreamAudio] function will not take effect whether it is called before or after [muteAllPlayStreamAudio].2. When the [muteAllPlayStreamAudio(false)] function is called, the local user can receive the audio data of all remote users. At this time, the [mutePlayStreamAudio] function can be used to control whether to receive a single audio data. Calling the [mutePlayStreamAudio(true, streamID)] function allows the local user to receive audio data other than the `streamID`; calling the [mutePlayStreamAudio(false, streamID)] function allows the local user to receive all audio data.
     *
     * @param streamID Stream ID.
     * @param mute Whether it can receive the audio data of the specified remote user when streaming, "true" means prohibition, "false" means receiving, the default value is "false".
     */
    mutePlayStreamAudio(streamID, mute) {
        return this.zegoWebRTC.mutePlayStreamAudio(streamID, mute);
    }
    /**
     * Whether the pull stream can receive the specified video data.
     *
     * Description: In the process of real-time video and video interaction, local users can use this function to control whether to receive video data from designated remote users when pulling streams as needed. When the developer does not receive the audio receipt, the hardware and network overhead can be reduced.
     * Use cases: This function can be called when developers need to quickly close and resume watching remote video. Compared to re-flow, it can greatly reduce the time and improve the interactive experience.
     * When to call: This function can be called after calling [createEngine].
     * Caution: This function is valid only when the [muteAllPlayStreamVideo] function is set to `false`.
     * Related APIs: You can call the [muteAllPlayStreamVideo] function to control whether to receive all video data. When the two functions [muteAllPlayStreamVideo] and [mutePlayStreamVideo] are set to `false` at the same time, the local user can receive the video data of the remote user when the stream is pulled: 1. When the [muteAllPlayStreamVideo(true)] function is called, it will take effect globally, that is, local users will be prohibited from receiving all remote users' video data. At this time, the [mutePlayStreamVideo] function will not take effect whether it is called before or after [muteAllPlayStreamVideo]. 2. When the [muteAllPlayStreamVideo(false)] function is called, the local user can receive the video data of all remote users. At this time, the [mutePlayStreamVideo] function can be used to control whether to receive a single video data. Call the [mutePlayStreamVideo(true, streamID)] function, the local user can receive other video data other than the `streamID`; call the [mutePlayStreamVideo(false, streamID)] function, the local user can receive all the video data.
     *
     * @param streamID Stream ID.
     * @param mute Whether it is possible to receive the video data of the specified remote user when streaming, "true" means prohibition, "false" means receiving, the default value is "false".
     */
    mutePlayStreamVideo(streamID, mute) {
        return this.zegoWebRTC.mutePlayStreamVideo(streamID, mute);
    }
    /**
     * Can the pull stream receive all audio data.
     *
     * Description: In the process of real-time audio and video interaction, local users can use this function to control whether to receive audio data from all remote users when pulling streams (including the audio streams pushed by users who have newly joined the room after calling this function). By default, users can receive audio data pushed by all remote users after joining the room. When the developer does not receive the audio receipt, the hardware and network overhead can be reduced.
     * Use cases: Call this function when developers need to quickly close and restore remote audio. Compared to re-flow, it can greatly reduce the time and improve the interactive experience.
     * When to call: This function can be called after calling [createEngine].
     * Related APIs: You can call the [mutePlayStreamAudio] function to control whether to receive a single piece of audio data. When the two functions [muteAllPlayStreamAudio] and [mutePlayStreamAudio] are set to `false` at the same time, the local user can receive the audio data of the remote user when the stream is pulled: 1. When the [muteAllPlayStreamAudio(true)] function is called, it takes effect globally, that is, local users will be prohibited from receiving audio data from all remote users. At this time, the [mutePlayStreamAudio] function will not take effect no matter if the [mutePlayStreamAudio] function is called before or after [muteAllPlayStreamAudio]. 2. When the [muteAllPlayStreamAudio(false)] function is called, the local user can receive the audio data of all remote users. At this time, the [mutePlayStreamAudio] function can be used to control whether to receive a single audio data. Calling the [mutePlayStreamAudio(true, streamID)] function allows the local user to receive audio data other than the `streamID`; calling the [mutePlayStreamAudio(false, streamID)] function allows the local user to receive all audio data.
     *
     * @param mute Whether it is possible to receive audio data from all remote users when streaming, "true" means prohibition, "false" means receiving, and the default value is "false".
     */
    muteAllPlayStreamAudio() {
        return isNotSupported('muteAllPlayStreamAudio');
    }
    /**
     * Can the pull stream receive all video data.
     *
     * Description: In the process of real-time video and video interaction, local users can use this function to control whether to receive all remote users' video data when pulling the stream (including the video stream pushed by the new user who joins the room after calling this function). By default, users can receive video data pushed by all remote users after joining the room. When the developer does not receive the audio receipt, the hardware and network overhead can be reduced.
     * Use cases: This function can be called when developers need to quickly close and resume watching remote video. Compared to re-flow, it can greatly reduce the time and improve the interactive experience.
     * When to call: This function can be called after calling [createEngine].
     * Related APIs: You can call the [mutePlayStreamVideo] function to control whether to receive a single piece of video data. When the two functions [muteAllPlayStreamVideo] and [mutePlayStreamVideo] are set to `false` at the same time, the local user can receive the video data of the remote user when the stream is pulled: 1. When the [muteAllPlayStreamVideo(true)] function is called, it will take effect globally, that is, the local user will be prohibited from receiving all remote users' video data. At this time, the [mutePlayStreamVideo] function will not take effect whether it is called before or after [muteAllPlayStreamVideo]. 2. When the [muteAllPlayStreamVideo(false)] function is called, the local user can receive the video data of all remote users. At this time, the [mutePlayStreamVideo] function can be used to control whether to receive a single video data. Call the [mutePlayStreamVideo(true, streamID)] function, the local user can receive other video data other than the `streamID`; call the [mutePlayStreamVideo(false, streamID)] function, the local user can receive all the video data.
     *
     * @param mute Whether it is possible to receive all remote users' video data when streaming, "true" means prohibition, "false" means receiving, and the default value is "false".
     */
    muteAllPlayStreamVideo(mute) {
        return isNotSupported('muteAllPlayStreamVideo');
    }
    /**
     * Enables or disables hardware decoding.
     *
     * Turn on hardware decoding and use hardware to improve decoding efficiency. Need to be called before calling startPlayingStream.
     * Because hard-decoded support is not particularly good for a few models, SDK uses software decoding by default. If the developer finds that the device is hot when playing a high-resolution audio and video stream during testing of some models, you can consider calling this interface to enable hard decoding.
     * @param {boolean} enable - Whether to turn on hardware decoding switch, true: enable hardware decoding, false: disable hardware decoding. The default is false
     */
    enableHardwareDecoder() {
        return isNotSupported('enableHardwareDecoder');
    }
    /**
     * Starts a stream mixing task.
     *
     * Description: Initiate a mixing stream request to the ZEGO RTC server, the server will look for the stream currently being pushed, and mix the layers according to the parameters of the mixing stream task requested by the SDK. When you need to update a mixing task, that is, when the input stream increases or decreases, you need to update the input stream list. At this time, you can update the field of the [ZegoMixerTask] object inputList and call this function again to pass in the same [ZegoMixerTask] object to update the mixing task.
     * Use cases: It is often used when multiple video images are required to synthesize a video using mixed streaming, such as education, live broadcast of teacher and student images.
     * When to call: After calling [loginRoom] to log in to the room.
     * Restrictions: None.
     * Caution: Due to the performance considerations of the client device, the SDK muxing is to start the mixing task on the ZEGO RTC server for mixing. If an exception occurs when the mixing task is requested to start, for example, the most common mixing input stream does not exist, the error code will be given from the callback callback. For specific error codes, please refer to the common error code document https://doc-zh.zego.im/zh/4378.html. If a certain input stream does not exist in the middle, the muxing task will automatically retry to pull this input stream for 90 seconds, and will not retry after 90 seconds. If all input streams no longer exist, the server will automatically stop the mixing task after 90 seconds.
     * Related callbacks: [OnMixerRelayCDNStateUpdate] can be used to obtain the CDN status update notification of the mixed stream repost, and the sound update notification of each single stream in the mixed stream can be obtained through [onMixerSoundLevelUpdate].
     * Related APIs: the mixing task can be stopped by the [stopMixerTask] function.
     *
     * @param {ZegoMixerTask} task Mixing task object. Required: Yes.
     * @return {ZegoMixerStartResult} Start notification of mixing task results.Required: No. Caution: Passing [null] means not receiving callback notifications.
     */
    async startMixerTask(task) {
        const { videoConfig, audioConfig, inputList, outputList, taskID } = task;
        let _inputList = inputList;
        let _outputList = outputList;
        let config;
        let outputConfig;
        // 位置转换
        _inputList.forEach(item => {
            const layout = item.layout;
            const { x, y, width, height } = layout;
            item.layout = { top: +y, left: +x, bottom: +y + +height, right: +x + +width };
        });
        outputConfig = { outputBitrate: 600, outputFPS: 15, outputWidth: 360, outputHeight: 480 };
        if (videoConfig) {
            const { height: outputHeight, width: outputWidth, bitrate: outputBitrate, fps: outputFPS } = videoConfig;
            outputConfig = { outputBitrate, outputHeight, outputWidth, outputFPS };
        }
        if (audioConfig) {
            const { channel, bitrate: outputAudioBitrate, codecID } = audioConfig;
            let outputAudioCodecID = codecID;
            outputConfig = { ...outputConfig, outputAudioChannels: channel || 1, outputAudioBitrate, outputAudioCodecID };
        }
        config = { inputList: _inputList, outputList: _outputList, outputConfig, taskID };
        return this.zegoWebRTC.startMixerTask(config).then(res => {
            let result;
            result = { errorCode: res.errorCode, extendedData: new Map() };
            if (res.extendedData) {
                result.extendedData = formatObjString(res.extendedData);
            }
            return result;
        });
        // if(result.extendedData) {
        //     try {
        //         result.extendedData = JSON.parse(result.extendedData)
        //     } catch (error) {
        //     }
        //     result = result as unknown as ZegoMixerStartResult
        //     return result
        // }
    }
    /**
     * Stops a stream mixing task.
     *
     * Description: Initiate a request to end the mixing task to the ZEGO RTC server.
     * Use cases: It is often used when multiple video images are required to synthesize a video using mixed streaming, such as education, live broadcast of teacher and student images.
     * When to call: After calling [startMixerTask] to start mixing.
     * Restrictions: None.
     * Caution: If the developer starts the next mixing task without stopping the previous mixing task, the previous mixing task will not automatically stop until the input stream of the previous mixing task does not exist for 90 seconds. Before starting the next mixing task, you should stop the previous mixing task, so that when an anchor has already started the next mixing task to mix with other anchors, the audience is still pulling the output stream of the previous mixing task.
     * Related APIs: You can start mixing by using the [startMixerTask] function.
     *
     * @param {ZegoMixerTask} task Mixing task object. Required: Yes.
     * @return {ZegoMixerStopResult} Stop stream mixing task result callback notification.Required: No. Caution: Passing [null] means not receiving callback notifications.
     */
    stopMixerTask(task) {
        return this.zegoWebRTC.stopMixerTask(task.taskID);
    }
    /**
     * Starts an auto stream mixing task.
     *
     * Description: Local users can use this function to start an auto stream mixing task, all streams in a room wil be mixed. Currently, only audio streams can be mixed. When auto stream mixing is enabled, the audio of all streams in the room is automatically mixed, and any further pushed streams in the room are automatically mixed into the final output stream.
     * Use cases: Often used in voice chat room scenarios.
     * When to call: After the engine is created, user can call this function to enable auto stream mixing in the target room if the target room has already been created
     * Restrictions: Please refer to https://doc-en.zego.im/article/7611 or contact ZEGO technical support.
     * Caution: Before starting the next auto stream mixing task in the same room, call [stopAutoMixerTask] function to end the last auto stream mixing task. Otherwise, when one anchor has started the next auto stream mixing task and other anchors have started the next auto stream mixing task, the audience still pulls the output stream of the first auto stream mixing task. If the user does not end the current auto stream mixing task, the task will automatically end after the room does not exist or the input streams do not exist for 90 seconds.
     * Related callbacks: Users can obtain the execution result of the function through [ZegoMixerStartCallback] callback.Users can get automatic mixed flow information through [onAutoMixerSoundLevelUpdate] callback.
     * Related APIs: Users can call [stopAutoMixerTask] function to stop an auto stream mixing task.
     *
     * @param task Auto mix stream task object
     * @param callback Start auto mix stream task result callback notification
     */
    startAutoMixerTask() {
        return isNotSupported('startAutoMixerTask');
    }
    /**
     * Stops an auto stream mixing task.
     *
     * Description: Local users can use this function to stop an auto stream mixing task.
     * Use cases: Often used in voice chat room scenarios.
     * When to call: Call this function after [startAutoMixerTask] function is called to start an auto stream mixing task.
     * Caution: Before calling [startAutoMixerTask] function to start the next auto stream mixing task in the same room, call this function to end the last auto stream mixing task. Otherwise, when one anchor has started the next auto stream mixing task and other anchors have started the next auto stream mixing task, the audience still pulls the output stream of the first auto stream mixing task. If the user does not end the current auto stream mixing task, the task will automatically end after the room does not exist or the input streams do not exist for 90 seconds.
     * Related callbacks: Users can obtain the execution result of the function through [ZegoMixerStopCallback] callback.
     * Related APIs: Users can call [startAutoMixerTask] function to start an auto stream mixing task.
     *
     * @param task Auto mix stream task object
     * @param callback Stop auto mix stream task result callback notification
     */
    stopAutoMixerTask(task) {
        return isNotSupported('stopAutoMixerTask');
    }
    /**
     * Mutes or unmutes the microphone.
     *
     * This api is used to control whether the collected audio data is used. When the microphone is muted (disabled), the data is collected and discarded, and the microphone is still occupied.
     * The microphone is still occupied because closing or opening the microphone on the hardware is a relatively heavy operation, and real users may have frequent operations. For trade-off reasons, this api simply discards the collected data.
     * If you really want SDK to give up occupy the microphone, you can call the [enableAudioCaptureDevice] interface.
     * Developers who want to control whether to use microphone on the UI should use this interface to avoid unnecessary performance overhead by using the [enableAudioCaptureDevice].
     * @param {boolean} mute - Whether to mute (disable) the microphone, true: mute (disable) microphone, false: enable microphone. The default is false.
     */
    muteMicrophone(mute) {
        return getPromiseInstance(this.zegoWebRTC.muteMicrophone(mute));
    }
    /**
     * Checks whether the microphone is muted.
     *
     * Can be used with [muteMicrophone], determine whether the microphone is muted.
     * @return {boolean} - Whether the microphone is muted; true: the microphone is muted; false: the microphone is enable (not muted)
     */
    isMicrophoneMuted() {
        return getPromiseInstance.call(this, this.zegoWebRTC.isMicrophoneMuted());
    }
    /**
     * Mutes or unmutes the audio output speaker.
     *
     * After mute speaker, all the SDK sounds will not play, including playing stream, mediaplayer, etc. But the SDK will still occupy the output device.
     * @param {boolean} mute - Whether to mute (disable) speaker audio output, true: mute (disable) speaker audio output, false: enable speaker audio output. The default value is false
     */
    muteSpeaker() {
        return isNotSupported('muteSpeaker');
    }
    /**
     * Checks whether the audio output speaker is muted.
     *
     * Can be used with [muteSpeaker], determine whether the speaker audio output is muted.
     * @return {boolean} - Whether the speaker is muted; true: the speaker is muted; false: the speaker is enable (not muted)
     */
    isSpeakerMuted() {
        return isNotSupported('isSpeakerMuted');
    }
    /**
     * Enables or disables the audio capture device.
     *
     * This api is used to control whether to release the audio collection device. When the audio collection device is turned off, the SDK will no longer occupy the audio device. Of course, if the stream is being published at this time, there is no audio data.
     * Occupying the audio capture device and giving up Occupying the audio device is a relatively heavy operation, and the [muteMicrophone] interface is generally recommended.
     * @param {boolean} enable - Whether to enable the audio capture device, true: disable audio capture device, false: enable audio capture device
     */
    enableAudioCaptureDevice(enable) {
        return isNotSupported('enableAudioCaptureDevice');
    }
    /**
     * Turns on/off the camera (for the specified channel).
     *
     * This interface is used to control whether to start the camera acquisition. After the camera is turned off, video capture will not be performed. At this time, the publish stream will also have no video data.
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     * @param {boolean} enable - Whether to turn on the camera, true: turn on camera, false: turn off camera
     * @param {ZegoPublishChannel} channel - Publishing stream channel
     */
    async enableCamera(enable, channel) {
        let data = this.channelData.get(channel || 0) || new Map();
        const stream = data.get('stream');
        if (!stream) {
            const streamConfig = data.get("streamConfig") || {};
            streamConfig.camera = streamConfig.camera || {};
            streamConfig.camera.video = enable;
            data.set("streamConfig", streamConfig);
            this.channelData.set(channel || 0, data);
            return;
        }
        return this.zegoWebRTC.enableVideoCaptureDevice(stream, enable);
    }
    /**
     * Switches to the front or the rear camera.
     *
     * This interface is used to control the front or rear camera
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     *
     * @param enable Whether to use the front camera, true: use the front camera, false: use the the rear camera. The default value is true
     * @param channel Publishing stream channel
     */
    useFrontCamera(enable, channel) {
        const data = this.channelData.get(channel || 0) || new Map();
        const streamConfig = data.get("streamConfig") || {};
        streamConfig.camera = streamConfig.camera || {};
        streamConfig.camera.facingMode = enable ? 'user' : 'environment';
        data.set("streamConfig", streamConfig);
        this.channelData.set(channel || 0, data);
        return getPromiseInstance(true);
    }
    /**
     * Set the camera zoom factor.
     *
     * Every time the camera is restarted, the camera zoom factor will be restored to its initial value.
     *
     * @param factor The zoom factor of the camera, the minimum value is 1.0, and the maximum value is the return value of [getCameraMaxZoomFactor].
     */
    setCameraZoomFactor() {
        return isNotSupported('setCameraZoomFactor');
    }
    /**
     * Get the maximum zoom factor of the camera.
     *
     * This is only available after the camera has been successfully started, and can generally be called when the captured first frame is received, aka [onPublisherCapturedVideoFirstFrame] callback.
     *
     * @return The maximum zoom factor of the camera.
     */
    getCameraMaxZoomFactor() {
        return isNotSupported('getCameraMaxZoomFactor');
    }
    /**
     * Starts sound level monitoring. Support enable some advanced feature.
     *
     * Description: After starting monitoring, you can receive local audio sound level via [onCapturedSoundLevelUpdate] callback, and receive remote audio sound level via [onRemoteSoundLevelUpdate] callback. Before entering the room, you can call [startPreview] with this function and combine it with [onCapturedSoundLevelUpdate] callback to determine whether the audio device is working properly.
     * Use cases: During the publishing and playing process, determine who is talking on the wheat and do a UI presentation.
     * When to call: After the engine is created [createEngine].
     * Caution: [onCapturedSoundLevelUpdate] and [onRemoteSoundLevelUpdate] callback notification period is the value set by the parameter.
     *
     * @param config Configuration for starts the sound level monitor.
     */
    startSoundLevelMonitor() {
        return isNotSupported('startSoundLevelMonitor');
    }
    /**
     * Stops sound level monitoring.
     *
     * Description: After the monitoring is stopped, the callback of the local/remote audio sound level will be stopped.
     * When to call: After the engine is created [createEngine].
     * Related APIs: Soundwave monitoring can be initiated via [startSoundLevelMonitor].
     */
    stopSoundLevelMonitor() {
        return isNotSupported('stopSoundLevelMonitor');
    }
    /**
     * Enables or disables acoustic echo cancellation (AEC).
     *
     * Turning on echo cancellation, the SDK filters the collected audio data to reduce the echo component in the audio.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param enable Whether to enable echo cancellation, true: enable, false: disable
     */
    enableAEC(enable) {
        return getPromiseInstance((() => {
            this.cameraConfig.AEC = enable;
        })());
    }
    /**
     * Sets the acoustic echo cancellation (AEC) mode.
     *
     * Switch different echo cancellation modes to control the extent to which echo data is eliminated.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param mode Echo cancellation mode
     */
    setAECMode() {
        return isNotSupported('setAECMode');
    }
    /**
     * Enables or disables automatic gain control (AGC).
     *
     * When the auto gain is turned on, the sound will be amplified, but it will affect the sound quality to some extent.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param enable Whether to enable automatic gain control, true: enable, false: disable
     */
    enableAGC(enable) {
        return getPromiseInstance((() => {
            this.cameraConfig.AGC = enable;
        })());
    }
    /**
     * Enables or disables active noise suppression (ANS, aka ANC).
     *
     * Turning on the noise suppression switch can reduce the noise in the audio data and make the human voice clearer.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param enable Whether to enable noise suppression, true: enable, false: disable
     */
    enableANS(enable) {
        return getPromiseInstance((() => {
            this.cameraConfig.ANS = enable;
        })());
    }
    /**
     * Enables or disables transient noise suppression.
     *
     * Suppress transient noises such as keyboard and desk knocks
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param enable Whether to enable transient noise suppression, true: enable, false: disable
     */
    enableTransientANS() {
        return isNotSupported('enableTransientANS');
    }
    /**
     * Sets the automatic noise suppression (ANS) mode.
     *
     * Default is medium mode
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param mode Audio Noise Suppression mode
     */
    setANSMode() {
        return isNotSupported('setANSMode');
    }
    /**
     * Enables or disables headphone monitoring.
     *
     * enable/disable headphone monitor, this setting takes effect when the headset is connected.
     *
     * @param enable Whether to use headphone monitor, YES: enable, NO: disable
     */
    enableHeadphoneMonitor() {
        return isNotSupported('enableHeadphoneMonitor');
    }
    /**
     * Sets the headphone monitor volume.
     *
     * set headphone monitor volume, this setting takes effect when the headset is connected.
     *
     * @param volume headphone monitor volume, range from 0 to 200, 100 as default
     */
    setHeadphoneMonitorVolume() {
        return isNotSupported('setHeadphoneMonitorVolume');
    }
    /**
     * Whether to turn on acoustic echo cancellation (AEC) when using the headphone.
     *
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     *
     * @param enable Whether to enable, [YES]: enable, [NO]: disable
     */
    enableHeadphoneAEC() {
        return isNotSupported('enableHeadphoneAEC');
    }
    /**
     * Whether to use the built-in speaker to play audio.
     *
     * When you choose not to use the built-in speaker to play sound, that is, set to [false], the SDK will select the currently highest priority audio output device to play the sound according to the system schedule
     *
     * @param defaultToSpeaker Whether to use the built-in speaker to play sound, true: use the built-in speaker to play sound, false: use the highest priority audio output device scheduled by the current system to play sound
     */
    setAudioRouteToSpeaker(defaultToSpeaker) {
        // return ZegoExpressEngine.rangeAudioInstance.enableSpeaker(defaultToSpeaker);
        return isNotSupported('setAudioRouteToSpeaker');
    }
    /**
     * Get current audio route type
     *
     * @return {ZegoAudioRoute} Audio route
     */
    getAudioRouteType() {
        return isNotSupported('getAudioRouteType');
    }
    /**
     * Enable the Effects beauty environment.
     *
     * Description: Enable the Effects beauty environment. Specify the data type for processing beauty. The Windows platform only supports rawData, the Apple device only supports CVPixelBuffer, and the Android platform only supports texture2d.
     * Use cases: It is often used in scenes such as video calls and live broadcasts.
     * Default value: When this function is not called, the beauty environment is not activated by default.
     * When to call: Must be called before calling [startPreview], [startPublishingStream]. If you need to modify the configuration, please call [logoutRoom] to log out of the room first, otherwise it will not take effect.
     * Related APIs: [enableEffectsBeauty] switch beauty, [setEffectsBeautyParam] set beauty parameters.
     * Caution: This beauty function is the basic function. If it does not meet the expectations of the developer, you can use the custom video pre-processing function [enableCustomVideoProcessing] or the custom video capture function [enableCustomVideoCapture] docking and constructing the AI ​​vision SDK [ZegoEffects] _____https://doc-zh.zego.im/article/9556_____ for best results.
     * Restrictions: This function only supports Android system 5.0 and above, Android SDK version 21 and above.
     */
    startEffectsEnv() {
        // return isNotSupported('startEffectsEnv');
        return;
    }
    /**
     * Disable the Effects beauty environment.
     *
     * Description: Disable the Effects beauty environment.
     * Use cases: It is often used in scenes such as video calls and live broadcasts.
     * When to call: Must be called before calling [startPreview], [startPublishingStream]. If you need to modify the configuration, please call [logoutRoom] to log out of the room first, otherwise it will not take effect.
     * Related APIs: [enableEffectsBeauty] switch beauty, [setEffectsBeautyParam] set beauty parameters.
     * Caution: This beauty function is the basic function. If it does not meet the expectations of the developer, you can use the custom video pre-processing function [enableCustomVideoProcessing] or the custom video capture function [enableCustomVideoCapture] docking and constructing the AI ​​vision SDK [ZegoEffects] https://doc-zh.zego.im/article/9556 for best results.
     * Restrictions: This function only supports Android system 5.0 and above, Android SDK version 21 and above.
     */
    stopEffectsEnv() {
        const localstream = this.channelData.get(0)?.get('stream') || this.channelData.get(1)?.get('stream');
        return this.zegoWebRTC.setEffectsBeauty(localstream, false);
    }
    /**
     * Enables or disables the beauty effect.
     *
     * Description: Support basic beauty functions, including whiten, rosy, smooth, and sharpen.
     * Use cases: It is often used in scenes such as video calls and live broadcasts.
     * When to call: You must call [startEffectsEnv] to enable the beauty environment before calling this function.
     * Default value: When this function is not called, the beauty effect is not enabled by default.
     * Related APIs: You can call the [setBeautifyOption] function to adjust the beauty parameters.
     * Caution: This beauty function is the basic function. If it does not meet the expectations of the developer, you can use the custom video pre-processing function [enableCustomVideoProcessing] or the custom video capture function [enableCustomVideoCapture] docking and constructing the AI ​​vision SDK [ZegoEffects] https://doc-zh.zego.im/article/9556 for best results.
     * Restrictions: This function only supports Android system 5.0 and above, Android SDK version 21 and above.
     *
     * @param enable Whether to enable the beauty effect, true is enabled; false is disabled, and the default is false.
     */
    enableEffectsBeauty(enable) {
        this.beautyEnable = enable;
        return getPromiseInstance(true);
    }
    /**
     * Set beautify param.
     *
     * Description: Set the beauty parameters, including whiten, rosy, smooth, and sharpen.
     * Use cases: It is often used in scenes such as video calls and live broadcasts.
     * When to call: You must call [startEffectsEnv] to enable the beauty environment before calling this function.
     * Related APIs: You can call [enableEffectsBeauty] to turn on or off the beauty function.
     * Restrictions: This function only supports Android system 5.0 and above, Android SDK version 21 and above.
     *
     * @param param Beauty option param.
     */
    setEffectsBeautyParam(param) {
        this.beautyParams = param;
        return getPromiseInstance(true);
    }
    /**
     * Creates a media player instance.
     *
     * Currently, a maximum of 4 instances can be created, after which it will return null. The more instances of a media player, the greater the performance overhead on the device.
     * @return {ZegoMediaPlayer} - Media player instance, null will be returned when the maximum number is exceeded.
     */
    createMediaPlayer() {
        let player = null;
        if (!this.mediaPlayerMap) {
            this.mediaPlayerMap = new Map();
        }
        if (this.mediaPlayerMap?.size < 4) {
            player = new MediaPlayer();
            player.setWebRtcInstance(this);
            player.index = ZegoExpressEngine.mediaPlayerIndex;
            this.mediaPlayerMap.set(player.index, player);
            ZegoExpressEngine.mediaPlayerIndex++;
        }
        return getPromiseInstance(player);
    }
    /**
     * Destroys a media player instance.
     *
     * @param {ZegoMediaPlayer} mediaPlayer - The media player instance object to be destroyed
     */
    destroyMediaPlayer(mediaPlayer) {
        return new Promise((res, rej) => {
            try {
                if (this.mediaPlayerMap) {
                    this.mediaPlayerMap.delete(mediaPlayer.index);
                    mediaPlayer = null;
                }
                res();
            }
            catch (error) {
                rej(error);
            }
        });
    }
    loadResourceWithConfig() {
        return isNotSupported('loadResourceWithConfig');
    }
}
ZegoExpressEngine.mediaPlayerIndex = 0;
