import { isNotSupported } from '../util/index';
export class MediaPlayer {
    constructor(index) {
        this.duration = 0;
        this.src = '';
        this.startPosition = 0;
        this.mixing = false;
        this.arrts = { mute: false, loop: false, volume: 0.3, playbackRate: 1 };
        this.index = index;
    }
    setWebRtcInstance(zegoWebrtcInstance) {
        this.zegoWebrtcInstance = zegoWebrtcInstance;
    }
    getIndex() {
        return this.index;
    }
    // 设置播放器容器
    async setPlayerCanvas(viewElem) {
        this.viewElem = viewElem;
        // this.playerInstance = playerInstance
    }
    loadResource(path) {
        this.src = path;
        if (!path)
            return;
        return new Promise((resolve, reject) => {
            let playElem;
            if (!this.checkViewElem)
                reject("you should be to use 'SetPlayerCanvas' first!");
            let s = (path.split('?')[0] || '').split('/') || '';
            let fileType = s[s.length - 1]?.split('.')[1] || '';
            if (this.viewElem) {
                playElem = this.viewElem;
            }
            else {
                if (['mp3', 'wav'].includes(fileType.toLowerCase()) || path.indexOf('data:audio/wav;base64') !== -1) {
                    playElem = document.createElement('audio');
                }
                else {
                    playElem = document.createElement('video');
                }
                playElem.style.position = 'fixed';
                playElem.style.top = '-1000px';
                playElem.style.width = '20px;';
                playElem.style.height = '20px;';
            }
            playElem.src = path;
            playElem.load();
            playElem.currentTime = this.startPosition;
            this.viewElem = playElem;
            playElem.addEventListener('loadeddata', () => {
                this.duration = playElem.duration;
                resolve({ errorcode: 0 });
            });
            playElem.addEventListener('error', (err) => {
                reject({ errorcode: 1 });
            });
            this.startPosition = 0;
        });
    }
    setPlayerView(id) {
        return new Promise(res => {
            this.viewElem = document.querySelector(`#zego_player_${id} video`);
            if (this.viewElem) {
                this.viewElem.src = this.src;
            }
            res();
        });
    }
    enableRepeat(enable) {
        this.arrts.loop = enable;
        if (this.viewElem) {
            enable === false ? this.viewElem.removeAttribute('loop') : this.viewElem.setAttribute('loop', '');
        }
    }
    // 开启混音
    async enableAux(enable, player) {
        let channalData = this.zegoWebrtcInstance.channelData.get(0);
        const streamID = channalData.get('streamID');
        if (enable) {
            // 已经推流成功
            if (streamID) {
                const volume = this.viewElem.volume;
                this.setVolume(volume * 200);
                try {
                    await this.zegoWebrtcInstance?.zegoWebRTC.startMixingAudio(streamID, [this.viewElem]);
                    this.mixing = true;
                    this.setVolume(volume * 200);
                }
                catch (error) {
                }
            }
        }
        else {
            // 已经推流成功
            if (streamID) {
                await this.zegoWebrtcInstance?.zegoWebRTC.stopMixingAudio(streamID, [this.viewElem]);
                this.mixing = false;
                this.resume();
            }
        }
    }
    // 混音音量调节
    setVolume(volume) {
        let channalData = this.zegoWebrtcInstance.channelData.get(0);
        const streamID = channalData.get('streamID');
        this.setElemVolume(volume);
        if (streamID && this.viewElem && this.mixing) {
            this.zegoWebrtcInstance?.zegoWebRTC.setMixingAudioVolume(streamID, volume / 2, this.viewElem);
        }
    }
    start() {
        if (!this.checkViewElem())
            return;
        const { mute, loop, volume, playbackRate } = this.arrts;
        this.enableRepeat(loop);
        this.viewElem.volume = volume;
        this.viewElem.playbackRate = playbackRate;
        this.viewElem.currentTime = 0;
        this.viewElem.play();
        // this.playerInstance.play(this.viewElem)
    }
    pause() {
        if (!this.checkViewElem())
            return;
        this.viewElem?.pause();
    }
    stop() {
        if (!this.checkViewElem())
            return;
        this.pause();
        this.viewElem.currentTime = 0;
        // this.playerInstance.stop()
    }
    resume() {
        if (!this.checkViewElem())
            return;
        this.viewElem.play();
        // this.playerInstance.resume()
    }
    setPlaySpeed(speed) {
        this.arrts.playbackRate = speed;
    }
    checkViewElem() {
        if (!this.viewElem) {
            console.error("you should be to use 'SetPlayerCanvas' first!");
            return false;
        }
        return true;
    }
    destroy() {
        this.stop();
        this.viewElem.src = '';
        // this.playerInstance = null
    }
    setElemVolume(volume) {
        // volume : 0-200
        this.arrts.volume = volume / 200;
        if (this.viewElem) {
            this.viewElem.volume = volume / 200;
        }
    }
    getTotalDuration() {
        return Math.floor(this.viewElem?.duration || this.duration) || 0;
    }
    enableAccurateSeek() {
        isNotSupported('enableAccurateSeek');
    }
    getAudioTrackCount() {
        isNotSupported('getAudioTrackCount');
    }
    getCurrentProgress() {
        isNotSupported('getCurrentProgress');
    }
    getCurrentState() {
        isNotSupported('getCurrentState');
    }
    getNetworkResourceCache() {
        isNotSupported('getNetworkResourceCache');
    }
    getPlayVolume() {
        isNotSupported('getPlayVolume');
    }
    muteLocal() {
        isNotSupported('muteLocal');
    }
    off() {
        isNotSupported('off');
    }
    on() {
        isNotSupported('on');
    }
    seekTo() {
        isNotSupported('seekTo');
    }
    setAudioTrackIndex() {
        isNotSupported('setAudioTrackIndex');
    }
    setNetworkBufferThreshold() {
        isNotSupported('setNetworkBufferThreshold');
    }
    setNetworkResourceMaxCache() {
        isNotSupported('setNetworkResourceMaxCache');
    }
    setProgressInterval() {
        isNotSupported('setProgressInterval');
    }
    setPublishVolume() {
        isNotSupported('setPublishVolume');
    }
    setPlayVolume() {
        isNotSupported('setPlayVolume');
    }
    setVoiceChangerParam() {
        isNotSupported('setVoiceChangerParam');
    }
    takeSnapshot() {
        isNotSupported('takeSnapshot');
    }
}
