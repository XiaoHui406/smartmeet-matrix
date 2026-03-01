/*
 * 拉流相关通用代码 
*/
import keyCenter from "@/pages/KeyCenter.js";
export default {
    data() {
        return {
            playStreamID: keyCenter.streamID,
            playVideoElem: null,
            isPlayingStream: false,
            playBtnName: "Start Playing",
            playVideoMuted: true
        }
    },
    methods: {
        bindPlayStreamIDChange(e) {
            this.playStreamID = e.detail.value;
        },
        // 单击拉流操作
        async onClickPlay() {
            if (this.isPlayingStream) {
                this.stopPlayingStream(this.playStreamID);
                this.playBtnName = "Start Playing";
            } else {
                // await this.loginRoom(this.roomID, this.userID, this.userName);
                this.startPlayingStream(this.playStreamID);
                this.playBtnName = "Stop Playing";
            }
            this.isPlayingStream = !this.isPlayingStream;
        },
        // 开始拉流
        async startPlayingStream(streamID, config) {
            this.appendActionInfo(`Start Playing Stream: streamID:${streamID}`);
            const result = await this.engine.startPlayingStream(streamID, config);
            // #ifdef H5
            console.warn(result)
            this.playVideoElem.srcObject = result;
            // this.playStream = result
            // #endif
            return result
        },
        // 停止拉流
        stopPlayingStream(streamID) {
            this.appendActionInfo(`Stop Playing Stream: streamID:${streamID}`);
            this.engine.stopPlayingStream(streamID);
            // #ifdef H5
            this.playVideoElem.srcObject = null;
            // this.playStream = null
            // #endif
        },
        addPlayListeners() {
            this.engine.on(
                "playerStateUpdate",
                (streamID, state, errorCode, extendedData) => {
                    this.appendCallbackInfo(
                        `playerStateUpdate:streamID:${streamID}, state:${state}, errorCode:${errorCode}, extendedData:${JSON.stringify(
                            extendedData
                        )}`
                    );
                    if(state === 0) {
                        // #ifdef H5
                        // this.playStream = null
                        // uni.showMessage({
                        //     content: extendedData
                        // })
                        // #endif
                    }
                }
            );
        },
        playError(error) {
            console.warn('play error')
        }
    }
}