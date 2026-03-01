/*
 * 推流相关通用代码 
*/
import keyCenter from "@/pages/KeyCenter.js";
export default {
    data() {
        return {
            publishStreamID: keyCenter.streamID,
            publishBtnName: "Start Publishing",
            isPublishingStream: false,
            localVideoElem: null,
            pubVideoMuted: true,
        }
    },
    methods: {
        // 修改推流ID
        bindPublishStreamIDChange(e) {
            this.publishStreamID = e.detail.value;
        },
        // 推流
        async startPublishingStream(streamID, channel, config) {
            this.appendActionInfo(
                `Start Publishing Stream: streamID:${streamID}`
            );
			// 0 为channel
            await this.engine.startPublishingStream(streamID, channel, config);
        },
        // 停止推流
        stopPublishingStream() {
            this.appendActionInfo(`Stop Publishing Stream`);
            this.stopPreview()
            this.engine.stopPublishingStream();
        },
        // 预览
        startPreview() {
            this.appendActionInfo("Start Preview");
            // #ifdef H5
            this.engine.startPreview(
                this.localVideoElem
            );
            // #endif
            // #ifdef APP-PLUS
            this.engine.startPreview();
            // #endif
        },
        // 停止预览
        stopPreview() {
            this.appendActionInfo("Stop Preview");
            this.engine?.stopPreview();
        },
        // 单击开始或停止推流
        async onClickPublish() {
            if (this.isPublishingStream) {
                this.stopPublishingStream();
                this.publishBtnName = "Start Publishing";
            } else {
                // await this.loginRoom(this.roomID, this.userID, this.userName);
                await this.startPublishingStream(this.publishStreamID);
                this.publishBtnName = "Stop Publishing";
            }
            this.isPublishingStream = !this.isPublishingStream;
        },
        addPublishListeners() {
            this.engine.on(
                "publisherStateUpdate",
                (streamID, state, errorCode, extendedData) => {
                    this.appendCallbackInfo(
                        `publisherStateUpdate:streamID:${streamID}, state:${state}, errorCode:${errorCode}, extendedData:${JSON.stringify(
                            extendedData
                        )}`
                    );
                    if(state === 2) {
                        this.startPreview();
                    } else if(state === 0) {
                        this.stopPreview()
                    }
                }
            );
        }
    }
}