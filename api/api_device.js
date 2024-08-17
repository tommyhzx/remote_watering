// api/deviceApi.js
/* 
说明
https://cloud.bemfa.com/docs/src/api_device.html#推送消息
请求示例
{
    "uid": "7801e4ba1bf7406593d47250797860fd",
    "topic": "led002",
    "type": 3,
    "msg": "on"
}
返回说明
{
    "code": 0,
    "message": "OK",
    "data": 0
}   
code 字段说明：
code状态码	说明
    0	成功
    10002	请求参数有误
    40000	未知错误
    40004	私钥或主题错误 
*/
export const api_sendTcpMessage = async (device, action) => {
    try {
        const response = await uni.request({
            url: 'https://apis.bemfa.com/va/postmsg', // API 接口，详见接入文档
            method: "POST",
            data: {  // 请求字段，详见巴法云接入文档，http 接口
                uid: "c2421290f7d14fa38251e5f77aac931a",
                topic: device.deviceSN,
                type: 3,
                msg: action   // 发送消息为 on 或 off
            },
            header: {
                // 'content-type': "application/x-www-form-urlencoded",
                "content-type": "application/json"
            }
        });
        return response;
    } catch (err) {
        throw err;
    }
};
// 说明
// 1. 通过 uni.request 发送请求，请求参数详见巴法云接入文档，http 接口
// https://cloud.bemfa.com/docs/src/api_device.html#获取设备在线
/* 
返回示例
{
    "code": 0,
    "message": "OK",
    "data": false
}
    code 字段说明：
    状态码	说明
    0	成功
    10002	请求参数有误
    40000	未知错误
    40004	私钥或主题错误
    data 字段说明：
    状态码	说明
    true	设备在线
    false	设备离线
*/
export const api_getDeviceConnectionStatus = async (device) => {
    try {
        const response = await uni.request({
            url: 'https://apis.bemfa.com/va/online', // API 接口，详见接入文档
            method: "GET",
            data: {  // 请求字段，详见巴法云接入文档，http 接口
                uid: "c2421290f7d14fa38251e5f77aac931a",
                topic: device.deviceSN,
                type: 3,
            },
            header: {
                'content-type': "application/x-www-form-urlencoded"
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};