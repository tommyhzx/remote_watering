'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	try {
	        // 获取传入的用户ID
	        const {WxOpenId, username, userAvater} = event;
			// const {WxOpenId , } = event;
			// 在数据库中查找匹配 WxOpenId 的用户信息
			const queryRes = await db.collection('usersWx').where({
				WxOpenId: WxOpenId
			}).get();
	        // 如果找到匹配的用户信息，则更新用户信息
			if (queryRes.data.length > 0) {
				//使用 update 方法更新用户信息
				const updateRes = await db.collection('usersWx').doc(queryRes.data[0]._id).update({
					userAvater: userAvater,
					username: username,						
				});
				//返回更新成功的消息给客户端
				return {
					code: 0,
					msg: '用户信息更新成功'
				};
			} else {
				// 如果未找到匹配的用户信息，则返回错误信息给客户端
				return {
					code: -1,
					msg: '用户信息更新失败'
				};
			}
	    } catch (err) {
	        // 如果查询过程中发生错误，返回错误信息给客户端
	        return {
	            code: -1,
	            msg: '更新失败：' + err.message
	        }
	    }
};
