'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	
	try{
		// 获取传入的设备SN码和密码
		const { deviceSN,devicePassword } = event;
		
		// 查询数据库是否存在设备
		const res = await db.collection('userDevices').where({
		    deviceSN: deviceSN
		}).get();
		// 返回查询结果给客户端
		if(res.data.length != 0){
			if(res.data[0].devicePassword != devicePassword){
				return {
					code:-1,
					msg: '密码错误',
				}
			}else{
				return {
					code:0,
					msg: '密码正确',
				}
			}
			
		}else{
			return{
				code:-1,
				msg:'设备不存在',
			}
		}
	}catch(err){
		return {
		    code: -1,
		    msg: '查询设备失败：' + err.message
		};
	}
	//event为客户端上传的参数
	console.log('event : ', event)
	
	//返回数据给客户端
	return event
};
