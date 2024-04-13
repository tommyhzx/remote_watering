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
			
			if (queryRes.data.length > 0) {
				//使用 update 方法更新用户信息
				const updateRes = await db.collection('userDevices').doc(queryRes.data[0]._id).update({
					deviceName: device.deviceName,
					devicePlace:device.devicePlace,
					deviceUser: device.deviceUser,				
				});
				//返回更新成功的消息给客户端
				return {
					code: 0,
					msg: '设备信息更新成功'
				};
			} else {
				// 如果未找到匹配的用户信息，则返回错误信息给客户端
				return {
					code: -1,
					msg: '不存在该设备'
				};
			}
	    } catch (err) {
	        // 如果查询过程中发生错误，返回错误信息给客户端
	        return {
	            code: -1,
	            msg: '添加失败：' + err.message
	        }
	    }
};
