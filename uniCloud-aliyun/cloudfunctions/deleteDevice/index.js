'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	try {
	        // 获取传入的设备SN码
	        const { device } = event
			
			// 查询数据库，查看是否已存在相同的 deviceSN
			const queryRes = await db.collection('userDevices').where({
				deviceSN: device.deviceSN
			}).get();
			// 如果不存在 deviceSN，则提示已有设备
			if (queryRes.data.length == 0) {
				return {
					code: -1,
					msg: '不存在该设备'
				};
			}
			const docId = queryRes.data[0]._id;
	        // 将 WxOpenId 插入到数据库中
			const addRes = await db.collection('userDevices').doc(docId).update({
				deviceUser: '',
			})
	        
	    } catch (err) {
	        // 如果查询过程中发生错误，返回错误信息给客户端
	        return {
	            code: -1,
	            msg: '删除失败：' + err.message
	        }
	    }
	//返回数据给客户端
	return {
		code: 0,
		msg: '删除成功' 
	}
};
