// #ifdef H5
import ZegoExpressEngineWeb from './ZegoExpressEngineWeb';
// #endif
// #ifdef APP-PLUS
import ZegoExpressEngineApp from './ZegoExpressEngineApp';
export * from './ZegoExpressDefines';
// #endif
let ZegoExpressEngine;
// #ifdef H5
ZegoExpressEngine = ZegoExpressEngineWeb;
// #endif
// #ifdef APP-PLUS
ZegoExpressEngine = ZegoExpressEngineApp;
// #endif
export default ZegoExpressEngine;
export const pluginVersion = '3.16.0';
