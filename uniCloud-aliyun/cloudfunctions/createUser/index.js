'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	try {
	        // 获取传入的用户ID
	        const { WxOpenId } = event
	        // 将 WxOpenId 插入到数据库中
			const res = await db.collection('usersWx').add({
				WxOpenId: WxOpenId,
				// 这里可以添加其他需要保存的字段
				username: "新用户22",
				userTel: "1313131313"
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
