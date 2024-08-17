'use strict';
const db = uniCloud.database();
// 在数据库检查用户是否存在
exports.checkUserById = async (event, context) => {
	try {
	        // 获取传入的用户ID			
	        const { WxOpenId } = event
	        // 确保 WxOpenId 的值不为 undefined
			if (!WxOpenId) {
				throw new Error('WxOpenId 不能为空',event);
			}
	        // 查询数据库是否存在该用户ID的记录
	        const res = await db.collection('usersWx').where({
	            WxOpenId: WxOpenId
	        }).get()
	
	        // 返回查询结果给客户端
			if(res.data.length == 0){
				return {
					code:0,
					msg: '用户不存在',
					res:res,
					length:res.data.length,
					WxOpenId: WxOpenId
				}
			}else{
				return{
					code:-1,
					msg:'用户存在',
					WxOpenId: WxOpenId
				}
			}
	    } catch (err) {
	        // 如果查询过程中发生错误，返回错误信息给客户端
	        return {
	            code: -1,
	            msg: '查询失败：' + err.message
	        }
	    }
};
