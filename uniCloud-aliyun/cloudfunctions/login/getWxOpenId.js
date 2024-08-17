'use strict';
const db = uniCloud.database();

// 获取微信 OpenID
exports.getWxOpenId = async (event, context) => {
    try {

        const appid = process.env.WX_APPID || "wx5d6f4dcf7b16e780";
        const secret = process.env.WX_SECRET || "3accced62f38bf7fc1f2036484a578ae";
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${event.code}&grant_type=authorization_code`;

        const res = await uniCloud.httpclient.request(url, {
            dataType: "json"
        });
        if (res.data && res.data.openid) {
            return {
                code: 0,
                message: "success",
                data: {
                    openId: res.data.openid
                }
            };
        } else {
            throw new Error("获取 OpenID 失败");
        }
    } catch (err) {
        return {
            code: -1,
            message: "failed",
            error: err.message
        };
    }
};