'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	try {
	        // 获取客户端上传的参数
	        const { deviceUser } = event;
	
	        // 查询数据库，查找符合条件的设备
	        const res = await db.collection('userDevices').where({
	            deviceUser: deviceUser
	        }).get();
	
	        // 将查询结果返回给客户端
	        return {
	            code: 0,
	            msg: '查询成功',
	            data: res.data
	        };
	    } catch (err) {
	        // 如果查询过程中发生错误，返回错误信息给客户端
	        return {
	            code: -1,
	            msg: '查询失败：' + err.message
	        };
	    }
};
