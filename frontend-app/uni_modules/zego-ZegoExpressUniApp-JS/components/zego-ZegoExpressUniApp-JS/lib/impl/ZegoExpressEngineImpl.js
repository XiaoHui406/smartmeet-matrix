import { pluginVersion } from "../index";
import { ZegoPublishChannel } from "../ZegoExpressDefines";
const ZegoEvent = uni.requireNativePlugin('globalEvent');
const ZegoExpressNativeEngineMoudle = uni.requireNativePlugin('zego-ZegoExpressUniAppSDK_ZegoExpressUniAppEngine');
const Prefix = ZegoExpressNativeEngineMoudle.prefix();
let engine;
export class ZegoExpressEngineImpl {
    static _callMethod(method, args) {
        return new Promise((resolve, _) => {
            ZegoExpressNativeEngineMoudle.callMethod({ method: method, args: args }, (res) => {
                resolve(res);
            });
        });
    }
    static getInstance() {
        if (engine) {
            return engine;
        }
        throw new Error('Get instance failed, Please create engine first');
    }
    static async createEngineWithProfile(profile) {
        if (engine) {
            return engine;
        }
        await ZegoExpressEngineImpl._callMethod("createEngineWithProfile", { profile });
        engine = new ZegoExpressEngineImpl();
        await ZegoExpressEngineImpl._callMethod("setPluginVersion", { version: pluginVersion });
        return engine;
    }
    static async createEngine(appID, appSign, isTestEnv, scenario) {
        if (engine) {
            return engine;
        }
        await ZegoExpressEngineImpl._callMethod("createEngine", { appID, appSign, isTestEnv, scenario });
        engine = new ZegoExpressEngineImpl();
        await ZegoExpressEngineImpl._callMethod("setPluginVersion", { version: pluginVersion });
        return engine;
    }
    static async destroyEngine() {
        engine = undefined;
        ZegoExpressEngineImpl._mediaPlayerMap.forEach((_, key) => {
            ZegoExpressEngineImpl._callMethod("destroyMediaPlayer", { key });
        });
        await ZegoExpressEngineImpl._callMethod("destroyEngine");
        ZegoExpressEngineImpl._listeners.forEach((_, key) => {
            ZegoEvent.removeEventListener(Prefix + key);
        });
        ZegoExpressEngineImpl._listeners.clear();
        ZegoExpressEngineImpl._mediaPlayerMap.clear();
    }
    static setLogConfig(config) {
        return ZegoExpressEngineImpl._callMethod("setLogConfig", { config });
    }
    static getVersion() {
        return ZegoExpressEngineImpl._callMethod("getVersion");
    }
    static setEngineConfig(config) {
        return ZegoExpressEngineImpl._callMethod("setEngineConfig", { config });
    }
    static setRoomMode(mode) {
        return ZegoExpressEngineImpl._callMethod("setRoomMode", { mode });
    }
    on(event, callback) {
        const native_listener = (res) => {
            const { data } = res;
            // @ts-ignore
            callback(...data);
        };
        let map = ZegoExpressEngineImpl._listeners.get(event);
        if (map === undefined) {
            map = new Map();
            ZegoExpressEngineImpl._listeners.set(event, map);
        }
        map.set(callback, native_listener);
        ZegoEvent.addEventListener(Prefix + event, native_listener);
    }
    off(event, callback) {
        if (callback === undefined) {
            ZegoEvent.removeEventListener(Prefix + event);
            ZegoExpressEngineImpl._listeners.delete(event);
        }
        else {
            const map = ZegoExpressEngineImpl._listeners.get(event);
            if (map === undefined)
                return;
            ZegoEvent.removeEventListener(Prefix + event, map.get(callback));
            map.delete(callback);
        }
    }
    uploadLog() {
        return ZegoExpressEngineImpl._callMethod("uploadLog");
    }
    callExperimentalAPI(params) {
        return ZegoExpressEngineImpl._callMethod("callExperimentalAPI", { params });
    }
    setDummyCaptureImagePath(filePath, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setDummyCaptureImagePath", { filePath, channel });
    }
    loginRoom(roomID, user, config) {
        return ZegoExpressEngineImpl._callMethod("loginRoom", { roomID, user, config });
    }
    logoutRoom(roomID) {
        return ZegoExpressEngineImpl._callMethod("logoutRoom", { roomID });
    }
    loginMultiRoom(roomID, config) {
        return ZegoExpressEngineImpl._callMethod("loginMultiRoom", { roomID, config });
    }
    switchRoom(fromRoomID, toRoomID, config) {
        return ZegoExpressEngineImpl._callMethod("switchRoom", { fromRoomID, toRoomID, config });
    }
    renewToken(roomID, token) {
        return ZegoExpressEngineImpl._callMethod("renewToken", { roomID, token });
    }
    setRoomExtraInfo(roomID, key, value) {
        return ZegoExpressEngineImpl._callMethod("setRoomExtraInfo", { roomID, key, value });
    }
    startPublishingStream(streamID, channel = ZegoPublishChannel.Main, config) {
        return ZegoExpressEngineImpl._callMethod("startPublishingStream", { streamID, channel, config });
    }
    stopPublishingStream(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("stopPublishingStream", { channel });
    }
    startPreview(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("startPreview", { channel });
    }
    setStreamExtraInfo(extraInfo, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setStreamExtraInfo", { extraInfo, channel });
    }
    stopPreview(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("stopPreview", { channel });
    }
    setVideoConfig(config, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setVideoConfig", { config, channel });
    }
    getVideoConfig(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("getVideoConfig", { channel });
    }
    setVideoMirrorMode(mode, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setVideoMirrorMode", { mode, channel });
    }
    setAppOrientation(orientation, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setAppOrientation", { orientation, channel });
    }
    setAudioConfig(config, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setAudioConfig", { config, channel });
    }
    getAudioConfig(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("getAudioConfig", { channel });
    }
    setPublishStreamEncryptionKey(key, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setPublishStreamEncryptionKey", { key, channel });
    }
    takePublishStreamSnapshot(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("takePublishStreamSnapshot", { channel });
    }
    mutePublishStreamAudio(mute, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("mutePublishStreamAudio", { mute, channel });
    }
    mutePublishStreamVideo(mute, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("mutePublishStreamVideo", { mute, channel });
    }
    enableTrafficControl(enable, property, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("enableTrafficControl", { enable, property, channel });
    }
    setMinVideoBitrateForTrafficControl(bitrate, mode, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setMinVideoBitrateForTrafficControl", { bitrate, mode, channel });
    }
    setCaptureVolume(volume) {
        return ZegoExpressEngineImpl._callMethod("setCaptureVolume", { volume });
    }
    addPublishCdnUrl(streamID, targetURL) {
        return ZegoExpressEngineImpl._callMethod("addPublishCdnUrl", { streamID, targetURL });
    }
    removePublishCdnUrl(targetURL, streamID) {
        return ZegoExpressEngineImpl._callMethod("removePublishCdnUrl", { targetURL, streamID });
    }
    enablePublishDirectToCDN(enable, config, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("enablePublishDirectToCDN", { enable, config, channel });
    }
    setPublishWatermark(watermark, isPreviewVisible, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setPublishWatermark", { watermark, isPreviewVisible, channel });
    }
    sendSEI(data, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("sendSEI", { data, channel });
    }
    enableHardwareEncoder(enable) {
        return ZegoExpressEngineImpl._callMethod("enableHardwareEncoder", { enable });
    }
    startPlayingStream(streamID, config) {
        return ZegoExpressEngineImpl._callMethod("startPlayingStream", { streamID, config });
    }
    stopPlayingStream(streamID) {
        return ZegoExpressEngineImpl._callMethod("stopPlayingStream", { streamID });
    }
    setPlayStreamDecryptionKey(key, streamID) {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamDecryptionKey", { key, streamID });
    }
    takePlayStreamSnapshot(streamID) {
        return ZegoExpressEngineImpl._callMethod("takePlayStreamSnapshot", { streamID });
    }
    setPlayVolume(streamID, volume) {
        return ZegoExpressEngineImpl._callMethod("setPlayVolume", { streamID, volume });
    }
    setAllPlayStreamVolume(volume) {
        return ZegoExpressEngineImpl._callMethod("setAllPlayStreamVolume", { volume });
    }
    setPlayStreamVideoType(streamID, streamType) {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamVideoType", { streamID, streamType });
    }
    setPlayStreamBufferIntervalRange(streamID, minBufferInterval, maxBufferInterval) {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamBufferIntervalRange", { streamID, minBufferInterval, maxBufferInterval });
    }
    setPlayStreamFocusOn(streamID) {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamFocusOn", { streamID });
    }
    mutePlayStreamAudio(streamID, mute) {
        return ZegoExpressEngineImpl._callMethod("mutePlayStreamAudio", { streamID, mute });
    }
    mutePlayStreamVideo(streamID, mute) {
        return ZegoExpressEngineImpl._callMethod("mutePlayStreamVideo", { streamID, mute });
    }
    muteAllPlayStreamAudio(mute) {
        return ZegoExpressEngineImpl._callMethod("muteAllPlayStreamAudio", { mute });
    }
    muteAllPlayStreamVideo(mute) {
        return ZegoExpressEngineImpl._callMethod("muteAllPlayStreamVideo", { mute });
    }
    enableHardwareDecoder(enable) {
        return ZegoExpressEngineImpl._callMethod("enableHardwareDecoder", { enable });
    }
    enableCheckPoc(enable) {
        return ZegoExpressEngineImpl._callMethod("enableCheckPoc", { enable });
    }
    startMixerTask(task) {
        return ZegoExpressEngineImpl._callMethod("startMixerTask", { task });
    }
    stopMixerTask(task) {
        return ZegoExpressEngineImpl._callMethod("stopMixerTask", { task });
    }
    startAutoMixerTask(task) {
        return ZegoExpressEngineImpl._callMethod("startAutoMixerTask", { task });
    }
    stopAutoMixerTask(task) {
        return ZegoExpressEngineImpl._callMethod("stopAutoMixerTask", { task });
    }
    muteMicrophone(mute) {
        return ZegoExpressEngineImpl._callMethod("muteMicrophone", { mute });
    }
    isMicrophoneMuted() {
        return ZegoExpressEngineImpl._callMethod("isMicrophoneMuted");
    }
    muteSpeaker(mute) {
        return ZegoExpressEngineImpl._callMethod("muteSpeaker", { mute });
    }
    isSpeakerMuted() {
        return ZegoExpressEngineImpl._callMethod("isSpeakerMuted");
    }
    enableAudioCaptureDevice(enable) {
        return ZegoExpressEngineImpl._callMethod("enableAudioCaptureDevice", { enable });
    }
    getAudioRouteType() {
        return ZegoExpressEngineImpl._callMethod("getAudioRouteType");
    }
    setAudioRouteToSpeaker(defaultToSpeaker) {
        return ZegoExpressEngineImpl._callMethod("setAudioRouteToSpeaker", { defaultToSpeaker });
    }
    enableCamera(enable, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("enableCamera", { enable, channel });
    }
    useFrontCamera(enable, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("useFrontCamera", { enable, channel });
    }
    setCameraZoomFactor(factor, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("setCameraZoomFactor", { factor, channel });
    }
    getCameraMaxZoomFactor(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("getCameraMaxZoomFactor", { channel });
    }
    startSoundLevelMonitor(config) {
        return ZegoExpressEngineImpl._callMethod("startSoundLevelMonitor", { config });
    }
    stopSoundLevelMonitor() {
        return ZegoExpressEngineImpl._callMethod("stopSoundLevelMonitor");
    }
    startAudioSpectrumMonitor(millisecond) {
        return ZegoExpressEngineImpl._callMethod("startAudioSpectrumMonitor", { millisecond });
    }
    stopAudioSpectrumMonitor() {
        return ZegoExpressEngineImpl._callMethod("stopAudioSpectrumMonitor");
    }
    enableHeadphoneMonitor(enable) {
        return ZegoExpressEngineImpl._callMethod("enableHeadphoneMonitor", { enable });
    }
    setHeadphoneMonitorVolume(volume) {
        return ZegoExpressEngineImpl._callMethod("setHeadphoneMonitorVolume", { volume });
    }
    enableAEC(enable) {
        return ZegoExpressEngineImpl._callMethod("enableAEC", { enable });
    }
    enableHeadphoneAEC(enable) {
        return ZegoExpressEngineImpl._callMethod("enableHeadphoneAEC", { enable });
    }
    setAECMode(mode) {
        return ZegoExpressEngineImpl._callMethod("setAECMode", { mode });
    }
    enableAGC(enable) {
        return ZegoExpressEngineImpl._callMethod("enableAGC", { enable });
    }
    enableANS(enable) {
        return ZegoExpressEngineImpl._callMethod("enableANS", { enable });
    }
    enableTransientANS(enable) {
        return ZegoExpressEngineImpl._callMethod("enableTransientANS", { enable });
    }
    setANSMode(mode) {
        return ZegoExpressEngineImpl._callMethod("setANSMode", { mode });
    }
    startEffectsEnv() {
        return ZegoExpressEngineImpl._callMethod("startEffectsEnv");
    }
    stopEffectsEnv() {
        return ZegoExpressEngineImpl._callMethod("stopEffectsEnv");
    }
    enableEffectsBeauty(enable) {
        return ZegoExpressEngineImpl._callMethod("enableEffectsBeauty", { enable });
    }
    setEffectsBeautyParam(param) {
        return ZegoExpressEngineImpl._callMethod("setEffectsBeautyParam", { param });
    }
    setAudioEqualizerGain(bandGain, bandIndex) {
        return ZegoExpressEngineImpl._callMethod("setAudioEqualizerGain", { bandGain, bandIndex });
    }
    setVoiceChangerParam(param, audioChannel) {
        return ZegoExpressEngineImpl._callMethod("setVoiceChangerParam", { param, audioChannel });
    }
    enableVirtualStereo(enable, angle) {
        return ZegoExpressEngineImpl._callMethod("enableVirtualStereo", { enable, angle });
    }
    sendBroadcastMessage(roomID, message) {
        return ZegoExpressEngineImpl._callMethod("sendBroadcastMessage", { roomID, message });
    }
    sendBarrageMessage(roomID, message) {
        return ZegoExpressEngineImpl._callMethod("sendBarrageMessage", { roomID, message });
    }
    sendCustomCommand(roomID, command, toUserList) {
        return ZegoExpressEngineImpl._callMethod("sendCustomCommand", { roomID, command, toUserList });
    }
    startScreenCapture() {
        return ZegoExpressEngineImpl._callMethod("startScreenCapture");
    }
    stopScreenCapture() {
        return ZegoExpressEngineImpl._callMethod("stopScreenCapture");
    }
    enableTorch(enable, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("enableTorch", { enable, channel });
    }
    async createMediaPlayer() {
        const { playerID } = await ZegoExpressEngineImpl._callMethod("createMediaPlayer");
        if (playerID >= 0) {
            const mediaPlayer = new ZegoMediaPlayerImpl(playerID);
            ZegoExpressEngineImpl._mediaPlayerMap.set(playerID, mediaPlayer);
            return mediaPlayer;
        }
        return undefined;
    }
    async destroyMediaPlayer(mediaPlayer) {
        const index = mediaPlayer.getIndex();
        if (index >= 0) {
            await ZegoExpressEngineImpl._callMethod("destroyMediaPlayer", { index });
            ZegoExpressEngineImpl._mediaPlayerMap.delete(index);
            mediaPlayer.off("mediaPlayerStateUpdate");
            mediaPlayer.off("mediaPlayerNetworkEvent");
            mediaPlayer.off("mediaPlayerPlayingProgress");
        }
        return;
    }
    startRecordingCapturedData(config, channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("startRecordingCapturedData", { config, channel });
    }
    stopRecordingCapturedData(channel = ZegoPublishChannel.Main) {
        return ZegoExpressEngineImpl._callMethod("stopRecordingCapturedData", { channel });
    }
}
ZegoExpressEngineImpl._listeners = new Map();
ZegoExpressEngineImpl._mediaPlayerMap = new Map();
export class ZegoMediaPlayerImpl {
    constructor(index) {
        this._index = index;
    }
    _callMethod(method, args) {
        return new Promise((resolve, _) => {
            ZegoExpressNativeEngineMoudle.callMethod({ method: method, args: { playerID: this._index, ...args } }, (res) => {
                resolve(res);
            });
        });
    }
    on(event, callback) {
        const native_listener = (res) => {
            const { data, idx } = res;
            if (idx >= 0) {
                const mediaPlayer = ZegoExpressEngineImpl._mediaPlayerMap.get(idx);
                // @ts-ignore
                callback(mediaPlayer, ...data);
            }
        };
        let map = ZegoExpressEngineImpl._listeners.get(event);
        if (map === undefined) {
            map = new Map();
            ZegoExpressEngineImpl._listeners.set(event, map);
        }
        map.set(callback, native_listener);
        ZegoEvent.addEventListener(Prefix + event, native_listener);
        ZegoExpressEngineImpl._listeners.set(event, map);
    }
    off(event, callback) {
        if (callback === undefined) {
            ZegoEvent.removeEventListener(Prefix + event);
            ZegoExpressEngineImpl._listeners.delete(event);
        }
        else {
            const map = ZegoExpressEngineImpl._listeners.get(event);
            if (map === undefined) {
                return;
            }
            ZegoEvent.removeEventListener(Prefix + event, map.get(callback));
            map.delete(callback);
        }
    }
    loadResource(path) {
        return this._callMethod("mediaPlayerLoadResource", { path });
    }
    loadResourceWithConfig(config) {
        return this._callMethod("mediaPlayerLoadResourceWithConfig", { config });
    }
    start() {
        return this._callMethod("mediaPlayerStart");
    }
    stop() {
        return this._callMethod("mediaPlayerStop");
    }
    pause() {
        return this._callMethod("mediaPlayerPause");
    }
    resume() {
        return this._callMethod("mediaPlayerResume");
    }
    setPlayerView(playerID) {
        return this._callMethod("mediaPlayerSetPlayerView", { playerID });
    }
    seekTo(millisecond) {
        return this._callMethod("mediaPlayerSeekTo", { millisecond });
    }
    enableRepeat(enable) {
        return this._callMethod("mediaPlayerEnableRepeat", { enable });
    }
    enableAux(enable) {
        return this._callMethod("mediaPlayerEnableAux", { enable });
    }
    setPlaySpeed(speed) {
        return this._callMethod("mediaPlayerSetPlaySpeed", { speed });
    }
    muteLocal(mute) {
        return this._callMethod("mediaPlayerMuteLocal", { mute });
    }
    setVolume(volume) {
        return this._callMethod("mediaPlayerSetVolume", { volume });
    }
    setPlayVolume(volume) {
        return this._callMethod("mediaPlayerSetPlayVolume", { volume });
    }
    setPublishVolume(volume) {
        return this._callMethod("mediaPlayerSetPublishVolume", { volume });
    }
    setProgressInterval(millisecond) {
        return this._callMethod("mediaPlayerSetProgressInterval", { millisecond });
    }
    setAudioTrackIndex(index) {
        return this._callMethod("mediaPlayerSetAudioTrackIndex", { index });
    }
    setVoiceChangerParam(param, audioChannel) {
        return this._callMethod("mediaPlayerSetVoiceChangerParam", { param, audioChannel });
    }
    takeSnapshot() {
        return this._callMethod("mediaPlayerTakeSnapshot");
    }
    setNetworkResourceMaxCache(time, size) {
        return this._callMethod("mediaPlayerSetNetworkResourceMaxCache", { time, size });
    }
    setNetworkBufferThreshold(threshold) {
        return this._callMethod("mediaPlayerSetNetworkBufferThreshold", { threshold });
    }
    enableAccurateSeek(enable, config) {
        return this._callMethod("mediaPlayerEnableAccurateSeek", { enable, config });
    }
    getNetworkResourceCache() {
        return this._callMethod("mediaPlayerGetNetworkResourceCache");
    }
    getPlayVolume() {
        return this._callMethod("mediaPlayerGetPlayVolume");
    }
    getPublishVolume() {
        return this._callMethod("mediaPlayerGetPublishVolume");
    }
    getTotalDuration() {
        return this._callMethod("mediaPlayerGetTotalDuration");
    }
    getCurrentProgress() {
        return this._callMethod("mediaPlayerGetCurrentProgress");
    }
    getAudioTrackCount() {
        return this._callMethod("mediaPlayerGetAudioTrackCount");
    }
    getCurrentState() {
        return this._callMethod("mediaPlayerGetCurrentState");
    }
    getIndex() {
        return this._index;
    }
}
