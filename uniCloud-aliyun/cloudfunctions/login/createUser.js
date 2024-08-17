'use strict';
const db = uniCloud.database()
exports.createUser = async (event, context) => {

	try {
	        // 获取传入的用户ID
	        const { WxOpenId } = event
			//获取时间作为ID
			const ID = "ID" + Date.now();
	        // 将 WxOpenId 插入到数据库中
			const res = await db.collection('usersWx').add({
				WxOpenId: WxOpenId,
				// 这里可以添加其他需要保存的字段
				username: "微信用户",
				userTel: "",
				userAvater: "",
				userID: ID,
			})
	        
	    } catch (err) {
	        // 如果查询过程中发生错误，返回错误信息给客户端
	        return {
	            code: -1,
	            msg: '添加失败：' + err.message
	        }
	    }
	//返回数据给客户端
	return {
		code: 0,
		msg: '添加成功' 
	}
};
