# ZegoExpressUniAppSDK

即构科技 (ZEGO) 极速音视频 uni-app SDK 是一个基于 [ZegoExpressEngine](https://doc-zh.zego.im/zh/693.html) 原生 Android / iOS SDK 的 uni-app Wrapper，提供视频直播以及实时音视频服务。仅需几行代码，30分钟即可轻松接入。

了解更多解决方案：[https://www.zego.im](https://www.zego.im)
# 使用方法

## 注意事项

1、本插件是 uniapp 原生插件，使用前需学习 uniapp 原生插件使用方法，官方教程 [uni原生插件使用教程](https://nativesupport.dcloud.net.cn/NativePlugin/use/use)

2、使用视频功能时，页面必须使用.nvue文件构建，因为uniapp的.vue页面在原生端（iOS、android）是用 webview 构建的，不能支持component类型的插件。
详情可参考：https://nativesupport.dcloud.net.cn/NativePlugin/course/ios

## 申请 ZEGO AppID

登录 [ZEGO 官网](https://www.zego.im) 注册账号，根据自身实际业务需求选择场景，获取 AppID 与 AppSign，用于初始化 SDK。

## 创建uniapp项目

使用uniapp官方IDE HBuilder，创建uni-app类型的项目

## 集成「ZegoExpressEngine」uniapp SDK 和 JS 封装插件

开发者需要同时引用以下两个插件，JS 插件主要是为了做代码提示，且包含一些 JS 的逻辑，便于开发者使用 Native 插件功能

[Native 插件](https://ext.dcloud.net.cn/plugin?id=3617)

[JS 插件](https://ext.dcloud.net.cn/plugin?id=7748)


 ## 基础使用

#### 初始化引擎

```javascript
import ZegoExpressEngine from '@/uni_modules/zego-ZegoExpressUniApp-JS/components/zego-ZegoExpressUniApp-JS/lib/ZegoExpressEngine';

//  使用从 ZEGO 控制台申请到的 appID 用于初始化
const profile = {
appID : xxx,
// AppSign 仅满足简单的鉴权需求，如果需要升级为更加安全的鉴权方式，请参考[如何从 AppSign 鉴权升级为 Token 鉴权](https://doc-zh.zego.im/faq/token_upgrade?product=ExpressVideo&platform=all)
// AppSign 可通过[控制台](https://console.zego.im/dashboard)获取，格式为 @"39011cbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
appSign: '39011cbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
scenario : 0
};

ZegoExpressEngine.createEngineWithProfile(profile)
```

#### 登入房间
```javascript
let roomConfig = {};
// 只有传入 “isUserStatusNotify” 参数取值为 “true” 的 ZegoRoomConfig，才能收到 onRoomUserUpdate 回调。
roomConfig.isUserStatusNotify = true;
// 登录房间
ZegoExpressEngine.instance().loginRoom('room1', {'userID': 'id1', 'userName': 'user1'}, roomConfig);
```

#### 开启音视频通话
在成功登入房间后，可调用 `startPreview` 开启音视频：
```javascript
<template>
  <zego-local-view></zego-local-view>
</template>
 
······

// 需要在登入房间之后才能开启音视频通话
ZegoExpressEngine.instance().startPreview();
```

#### 将本地视频画面推向云服务
```javascript
// 推入的streamID由用户设置
let publishStreamID = '123456'
ZegoExpressEngine.instance().startPublishingStream(publishStreamID);
```

#### 拉取其他用户音视频
登入房间后主动监听 `roomStreamUpdate`，在收到其他用户推出的音视频流，即可拉取：
```javascript
<template>
  <zego-remote-view :streamID="playStreamID" ></zego-remote-view>
</template>

······
// 监听 roomStreamUpdate
ZegoExpressEngine.instance().on('roomStreamUpdate', (roomID, updateType, streamList) => {
    this.playStreamID = streamList[0].streamID;
});

······
// 拉取StreamID的音视频
ZegoExpressEngine.instance().startPlayingStream(this.playStreamID); 
```

#### 退出房间
```javascript
// 退出房间
ZegoExpressEngine.instance().logoutRoom('room1');
```

#### 销毁引擎
```javascript
// 退出房间
ZegoExpressEngine.destroyEngine();
```

## 运行
---
本插件是 uniapp 原生插件，需要使用 uniapp 云打包制作自定义调试基座 ，才能保证正常跑通。
具体可参考 uniapp 官方教程 [uni原生插件使用教程](https://nativesupport.dcloud.net.cn/NativePlugin/use/use)


## 更多功能
---
1、参考示例源码

2、参考 ZegoExpressUniAppSDK 官方使用文档 https://doc-zh.zego.im/article/7775

## 示例源码使用
---
示例源码下载地址

[ZegoExpressExample-UniApp](http://storage.zego.im/express/example/uniapp/ZegoExpressExample-UniApp.zip)

1. 将 Demo 导入 HBuilderX，修改 manifest.json 下的 AppID (uniapp的AppID)
2. 修改 Demo `./pages/KeyCenter.js` 内的AppID、Token。从ZEGO官网获取的 [控制台](https://console.zego.im/dashboard)
3. 导入「ZegoExpressEngine」uniapp SDK
4. 使用 uniapp 本地打包/云打包，制定自定义基座
5. 运行