<template>
	<view class="imgContainer">
		<view class="spacer"></view> <!-- 上方间隔 -->
		<image class="logo" src="/static/pic/yumiLogo.png" mode="widthFix"/>
		<view class="spacer-buttom"></view> <!-- 下方间隔 -->
		<image class="background" src="/static/pic/background.png" mode="widthFix"/>
		<view class="text">登录即可控制智能设备</view>
		<view class="text">畅享生活</view>
		<view class="text">Login to control smart device</view>
		<view class="text">and enjoy your life</view>
		<view class="spacer-end"></view> <!-- 下方间隔 -->		
	</view>
	<view>
		<button class="login_btn" @click="userLogin">立即微信登录<br>Login</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				WxOpenId: ''
				
			};
		},
		methods:{
			async userLogin(){
				try{
					// 获取用户 code
					const code = await this.getWxCode();
					//获取用户openid
					const openID = await this.getWxOpneId(code);
					 // 检查用户是否存在
					const userExists = await this.checkUser(openID);
					if (!userExists) {
					    // 用户不存在，添加用户到数据库
					    await this.createUser(openID);
					}
					try {
						const res = await uniCloud.callFunction({
							name:'getUserInfo',
							data:{
								WxOpenId:openID,
							},
						});
						console.log('获取用户信息：', res.result.data);
						const userInfo = res.result.data;
						//获取用户信息，并置全局变量
						getApp().globalData.WxOpenId = openID;
						getApp().globalData.username = userInfo.username;
						getApp().globalData.userAvater = userInfo.userAvater;
						getApp().globalData.userTel = userInfo.userTel;	
						
					}catch(err){
						console.error('获取用户信息失败：', err);
					}

					// 跳转到首页
					uni.reLaunch({
					    url: '/pages/homepage/homepage',
					    success() {
							uni.$emit("LoginID", openID);
							console.log("登录信息");
						}
					});
				}
				catch (error) {
					console.error('登录失败：', error);
					uni.showToast({
						title: "登录异常，请重试",
						image: "/static/logo.png"
					});
				}
			},
			
			//获取微信code，同时获取OpenID
			async getWxCode(){
				const res =await uni.login({
					provider: 'weixin',
					});
				if (res.code) {
					console.log('用户code：',res.code);
					return res.code;
				} else {
				  console.log('登录失败！' + res.errMsg);
				  throw new Error('获取用户 code 失败');
				}
			},
			//获取微信用户OpenID
			async getWxOpneId(code){
				console.log('getWxOpneId，code is',code);
				const res = await uni.request({
				        url: 'https://api.weixin.qq.com/sns/jscode2session',
				        method: 'GET',
				        data: {
				          appid: 'wx5d6f4dcf7b16e780',
				          secret: '3accced62f38bf7fc1f2036484a578ae',
				          js_code: code,
				          grant_type: 'authorization_code'
				        },
					});
					if (!res.data.openid) {
					      throw new Error('获取用户 OpenID 失败');
					    }
					console.log('用户的 OpenID：', res.data.openid);
					return res.data.openid;
			},	
			
			//查询数据库是否存在用户
			async checkUser(openid){
				const res = await uniCloud.callFunction({
					name:"checkUserById",
					data:{
						WxOpenId : openid
					}
				});
				//返回值0表示用户不存在，-1表示用户存在
				if(res.result.code == 0){
					//用户不存在
					return false;
					console.log('用户不存在')
				}else{
					//用户存在
					return true;
					console.log('用户已存在')
				}
			},
			//在数据库创建新用户
			async createUser(openid){
				const res = await uniCloud.callFunction({
				    name: "createUser",
				    data: {
						WxOpenId: openid
				    }
				});
				if (res.result.code !== 0) {
				    throw new Error('用户添加失败');
				}
				    console.log("数据库添加用户成功 res=", res);
			},
			
			//函数暂时无效
			userProfile(){
				uni.getUserProfile({
					provider:'weixin',
					desc:"用于登录",
					success: res => {
						console.log('登录成功，code:',res.rawData);
						console.log('userinfo:',res.userInfo);
						uni.reLaunch({
						 	url:'/pages/homepage/homepage'
						 });
					},
					fail: res => {
						console.log('登录失败，code:',res);
					}
				});
			},
			
			test(){
				console.log("test",this.WxOpenId);
			}
		},
		onLoad(){
			console.log("onLoad");
			// uni.login({
			// 	"provider":'weixin',
			// 	"onlyAuthorize": true, // 微信登录仅请求授权认证
			// 	success: res => {
			// 		if(res.code){
			// 			console.log('登录成功，code:',res.code);
			// 			this.WxOpenId = "88888888";
			// 		} else {
			// 			console.log('登录失败：',err);
			// 		}
			// 	},
			// 	fail: res => {
			// 		console.log('login fail：',res);
			// 	}
			// })
		}
	}
</script>

<style lang="scss">
	.imgContainer{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.spacer {
		    height: 100rpx; /* 上下间隔的高度 */
		}
		.logo{
			width: 300rpx;
		}
		.background{
			width:400rpx
		}
		.spacer-end{
			height: 100rpx;
		}
		.text{
			font-size: 14px;
		}
	}
	.login_btn{
		width: 500rpx;
		height: auto;
		padding: 10px;
		background-color: #FFE100;
		border-radius: 15px;
		font-size: 14px;
		line-height: 1;
	}

</style>
