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
			// 如果已存在相同的 deviceSN，则提示已有设备
			if (queryRes.data.length > 0) {
				return {
					code: -1,
					msg: '已存在相同的设备'
				};
			}
	        // 将 WxOpenId 插入到数据库中
			const addRes = await db.collection('userDevices').add({
				deviceSN: device.deviceSN,
				// 这里可以添加其他需要保存的字段
				deviceName: device.deviceName,
				devicePlace:device.devicePlace,
				deviceUser: device.deviceUser,

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
