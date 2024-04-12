'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	// 从 event 中获取 WxOpenId
	const { WxOpenId } = event;
	
	try {
		// 查询数据库中符合条件的用户信息
		const res = await db.collection('usersWx').where({
			WxOpenId: WxOpenId
		}).get();
		
		// 如果查询结果不为空，则返回用户信息给客户端
		if (res.data && res.data.length > 0) {
			return {
				code: 0,
				data: res.data[0]  // 返回第一个匹配到的用户信息
			};
		} else {
			// 如果查询结果为空，则返回相应的提示信息给客户端
			return {
				code: -1,
				msg: '未找到该用户信息'
			};
		}
	} catch (err) {
		// 如果查询过程中发生错误，返回错误信息给客户端
		return {
			code: -1,
			msg: '查询失败：' + err.message
		};
	}
};
