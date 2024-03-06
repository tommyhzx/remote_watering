'use strict';
exports.main = async (event, context) => {
	let appid = "wx5d6f4dcf7b16e780"
	let secret = "3accced62f38bf7fc1f2036484a578ae"
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
	let openid = res.data.openid
	
	//返回数据给客户端
	return event
};
