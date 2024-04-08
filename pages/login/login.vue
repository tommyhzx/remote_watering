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
				WxOpenId: 'Wx19990000'
				
			};
		},
		methods:{
			userLogin(){
				let result = 0;
				//首先获取openid
				
				//根据openid判断是否需要添加用户
				uniCloud.callFunction({
					name:"checkUserById",
					data:{
						WxOpenId : this.WxOpenId
					}
				}).then(res => {
					if(res.result.code == 0){
						console.log("用户不存在",res);
						//添加用户到数据库
						result = this.addUser(this.WxOpenId);
					}else{
						console.log("用户已存在",res);
					}		
					//获取用户profile，并登录
					//this.userLogin();
					//若没有出异常，进入首页
					if(result == 0){
						const WxOpenId = this.WxOpenId;
						uni.switchTab({
						 	url:'/pages/homepage/homepage',
							success(){
								uni.$emit("LoginID",WxOpenId);
								console.log("登录信息");
							}
						 });
					}else{
						uni.showToast({
							title:"登录异常，请重试",
							image:"/static/logo.png"
						});
					}
				});
				
				
			},
			addUser(id){
				uniCloud.callFunction({
					name:"createUser",
					data:{
						WxOpenId:this.WxOpenId
					}
				}).then(res => {
					if(res.result.code == 0){
						console.log("用户添加成功 res=",res);
						return 0;
					}else{
						console.log("用户添加失败 res=",res);
						return -1;
					}					
				});
			},
			userProfile(){
				uni.getUserProfile({
					provider:'weixin',
					desc:"用于登录",
					success: res => {
						console.log('登录成功，code:',res.rawData);
						console.log('userinfo:',res.userInfo);
						uni.switchTab({
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
			uni.login({
				"provider":'weixin',
				"onlyAuthorize": true, // 微信登录仅请求授权认证
				success: res => {
					if(res.code){
						console.log('登录成功，code:',res.code);
						this.WxOpenId = "88888888";
					} else {
						console.log('登录失败：',err);
					}
				},
				fail: res => {
					console.log('login fail：',res);
				}
			})
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
