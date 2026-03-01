export function getPromiseInstance(resolveResult) {
    return new Promise(res => res(resolveResult));
}
export function isNotSupported(apiName) {
    return console.warn(`The "${apiName}" is not supported.`);
}
export function formatObjString(str) {
    try {
        return JSON.parse(str);
    }
    catch (error) {
        return str || {};
    }
}
