<template>
	<view class="imgContainer">
		<view class="spacer"></view> <!-- 上方间隔 -->
		<image class="logo" :src="logoUrl" mode="widthFix" />
		<view class="spacer-buttom"></view> <!-- 下方间隔 -->
		<image class="background" :src="backGroundUrl" mode="widthFix" />
		<view class="text">登录即可控制智能设备</view>
		<view class="text">畅享生活</view>
		<view class="text">Login to control smart device</view>
		<view class="text">and enjoy your life</view>
		<view class="spacer-end"></view> <!-- 下方间隔 -->
		<view>
			<button class="login_btn" :disabled="loginDisabled" @click="userLogin">立即登录<!-- <br>Login --></button>
		</view>
	</view>

</template>

<script>
export default {
	data() {
		return {
			logoUrl: 'https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/yumiLogo.png',
			backGroundUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/background.png",
			loginDisabled: false, // 初始化为可点击状态
		};
	},
	methods: {
		// 错误处理
		handleError(message) {
			uni.showToast({
				title: message,
				icon: 'none',
				duration: 2000
			});
		},
		async userLogin() {
			try {
				uni.showLoading({
					title: "正在登录中"
				});
				// 禁用登录按钮
				this.loginDisabled = true;
				// 获取用户 code
				const code = await this.getWxCode();
				//获取用户openid
				const openID = await this.getWxOpneId(code);
				// const openID = -1;
				if (openID == -1) {
					uni.showToast({
						title: "获取openid失败" + JSON.stringify(openID),
						image: ""
					});
					return;
				}
				// 检查用户是否存在
				const userExists = await this.checkUser(openID);
				if (!userExists) {
					// 用户不存在，添加用户到数据库
					await this.createUser(openID);
				}
				try {
					const res = await uniCloud.callFunction({
						name: 'getUserInfo',
						data: {
							WxOpenId: openID,
						},
					});
					console.log('获取用户信息：', res.result.data);
					const userInfo = res.result.data;
					//获取用户信息，并置全局变量
					getApp().globalData.WxOpenId = openID;
					getApp().globalData.username = userInfo.username;
					getApp().globalData.userAvater = userInfo.userAvater;
					getApp().globalData.userTel = userInfo.userTel;
					getApp().globalData.userID = userInfo.userID;

				} catch (err) {
					uni.hideLoading();
					console.error('获取用户信息失败：', err);
					uni.showToast({
						title: "获取用户信息失败" + JSON.stringify(err),
						image: ""
					});
				}
				uni.hideLoading();
				// 登录完成后恢复按钮
				this.loginDisabled = false;
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
				console.error('userLogin() fail: ', error);
				uni.showToast({
					title: "登录异常，请重试" + JSON.stringify(error),
					image: ""
				});
				// 登录完成后恢复按钮
				this.loginDisabled = false;
			}
		},
		//获取微信code
		async getWxCode() {
			try {
				const res = await uni.login({ provider: 'weixin' });
				if (res.code) {
					console.log('用户code:', res.code);
					return res.code;
				} else {
					this.handleError('登录失败！', res.errMsg);
					return -1;
				}
			} catch (error) {
				this.handleError('获取用户 code 失败', error);
				return -1;
			}
		},
		//获取微信用户OpenID
		async getWxOpneId(code) {
			try {
				const res = await uniCloud.callFunction({
					name: "getWxOpenId",
					data: { code }
				});
				if (res.result.code == 0) {
					//用户不存在
					console.log('用户的 OpenID:', res.result.data.openId);
					return res.result.data.openId;
				} else {
					//用户存在
					this.handleError('获取 OpenID 失败', res.result.msg);
					return -1;
				}
			} catch (error) {
				this.handleError('获取 OpenID 失败', error);
				return -1;
			}
		},

		//查询数据库是否存在用户
		async checkUser(openid) {
			try {
				const res = await uniCloud.callFunction({
					name: "checkUserById",
					data: { WxOpenId: openid }
				});

				// 返回值0表示用户不存在，-1表示用户存在
				if (res.result.code === 0) {
					return false;
				} else if (res.result.code === -1) {
					return true;
				} else {
					throw new Error('未知的返回代码');
				}
			} catch (error) {
				console.error('检查用户失败:', error);
				this.handleError('检查用户失败');
				return false;
			}
		},
		//在数据库创建新用户
		async createUser(openid) {
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
		userProfile() {
			uni.getUserProfile({
				provider: 'weixin',
				desc: "用于登录",
				success: res => {
					console.log('登录成功，code:', res.rawData);
					console.log('userinfo:', res.userInfo);
					uni.reLaunch({
						url: '/pages/homepage/homepage'
					});
				},
				fail: res => {
					console.log('登录失败，code:', res);
				}
			});
		},
	},
	onLoad() {
		const datatime = "ID" + Date.now();
		console.log("onLoad time:", datatime);
	}
}
</script>

<style lang="scss">
.imgContainer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 90vh;

	.spacer {
		height: 5vh;
		/* 上下间隔的高度 */
	}

	.logo {
		width: 300rpx;
	}

	.background {
		width: 400rpx
	}

	.spacer-end {
		height: 50rpx;
	}

	.text {
		font-size: 14px;
	}

	.login_btn {
		width: 350rpx;
		margin-top: 100rpx;
		height: auto;
		padding: 10px;
		background-color: #FFE100;
		border-radius: 30px;
		border-style: solid;
		border-width: 1px;
		// border: black;
		font-size: 14px;
		line-height: 1;

	}
}
</style>
