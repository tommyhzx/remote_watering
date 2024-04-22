'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	let {imageBase64,WxOpenId} = event;
	//去除编码头
	let base64 = imageBase64.split(",")[1];
	//获取文件后缀名
	let suffix = imageBase64.split('/')[1].split(';')[0];
	try{
		let result = await uniCloud.uploadFile({
			//保存到云端的文件名
			cloudPath: WxOpenId + "." + suffix,
			//base64转buffer（阿里云支持buffer和绝对路径）		
			fileContent: Buffer.from(base64,'base64')
		});
		return {
			code: 0,
			msg: result.fileID
		};
	}catch (err) {
		return {
			code: -1,
			msg: '上传失败：' + err.message
		};
	}
};
