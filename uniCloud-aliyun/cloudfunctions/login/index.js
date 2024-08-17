
'use strict';
const { getWxOpenId } = require('./getWxOpenId.js');
const { getUserInfo } = require('./getUserInfo.js');
const { checkUserById } = require('./checkUserById.js');
const { createUser } = require('./createUser.js');

exports.main = async (event, context) => {
    switch (event.action) {
        case 'getWxOpenId':
            return await getWxOpenId(event, context);
		case 'getUserInfo':
			return await getUserInfo(event, context);
		case 'checkUserById':
			return await checkUserById(event, context);
        case 'createUser':
            return await createUser(event, context);
        default:
            return { code: -1, msg: '无效的 action' };
    }
};