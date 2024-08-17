'use strict';
const db = uniCloud.database();

// 获取微信 OpenID
exports.getWxOpenId = async (event, context) => {
    try {
        
        let appid = "wx5d6f4dcf7b16e780";
        let secret = "3accced62f38bf7fc1f2036484a578ae";
        let url =
            "https://api.weixin.qq.com/sns/jscode2session?appid=" +
            appid +
            "&secret=" +
            secret +
            "&js_code=" +
            event.code +
            "&grant_type=authorization_code";
            
        let res = await uniCloud.httpclient.request(
            url, // 请求路径,
            {
                dataType: "json"
            }
        );
        return {
            code: 0,
            message: "success",
            data: {
                openId: res.data.openid
            }
        };
    } catch (err) {
        return {
            code: -1,
            message: "failed",
        };	
    }
};