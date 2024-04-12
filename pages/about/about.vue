<template>
	<view class="container">
		<view class="title">
			<text >基础资料</text>
		</view>
		
		<view class="avatar">
			<text class="avatartext">头像</text>
			<button class = "avatarbtn" type="balanced" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
				<image :src="userInfo.avatarUrl" class="avatarImage"></image>
			</button>
			<!-- <image src="../../static/pic/defaultAvatar.png"></image> -->
		</view>
		<view class="account">
			<text>账号</text>
			<text>12345678</text>
		</view>
		<view class="name-container">
			<text class="nameText">姓名</text>
			<input ref='inputRef' :clearable="false" type="nickname" class="name-input" :value="userInfo.userName" @blur="bindblur"
				placeholder="请输入昵称" @input="changeName" />
		</view>
		<view>
			<button class='save' @click="save">保存</button>
			<button class='cancel' @click="cancel">取消</button>
		</view>
		<button class="logoutbtn" @click="userLogout">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: getApp().globalData.userAvater,
				userName: getApp().globalData.username,
				userInfo: {
					avatarUrl: getApp().globalData.userAvater,
					userName: getApp().globalData.username
				},
			};
		},
		methods:{
			userLogout(){
				uni.navigateTo({
				 	url:'/pages/login/login'
				 });
			},
			onChooseavatar(e) {
				let self = this;
				let {
					avatarUrl
				} = e.detail;
				this.userInfo.avatarUrl = avatarUrl;
			},
			changeName(event){
				this.userInfo.userName = event.target.value;
			},
			bindblur(event){
				this.userInfo.userName = event.target.value;
			},
			save(){
				// 修改全局变量的地方
				getApp().globalData.userAvater = this.userInfo.avatarUrl;
				getApp().globalData.username = this.userInfo.userName;
				uni.$emit('saveUserInfo', this.userInfo);
				console.log("WxOpenId:",getApp().globalData.WxOpenId);
				//保存数据库
				uniCloud.callFunction({
					name:"saveUserInfo",
					data:{
						WxOpenId : getApp().globalData.WxOpenId,
						username : getApp().globalData.username,
						userAvater : getApp().globalData.userAvater,
					}
				}).then(res => {
					console.log("saveUserInfo log，",res.result.msg);
					if(res.result.code != 0){
						console.log("saveUserInfo Fail，",res.result.msg);
					}				
				});
				// uni.navigateTo({
				//  	url:'/pages/homepage/homepage'
				// });
			},
			cancel(){
				this.userInfo.avatarUrl = getApp().globalData.userAvater;
				this.userInfo.userName = getApp().globalData.username;
				uni.navigateTo({
				 	url:'/pages/homepage/homepage'
				});
			}
		}
	}
</script>

<style lang="scss">
.container{
	display: flex;
	flex-direction: column;
	.title{
		display: flex;
		align-items: center;
		margin: 40rpx;
		text{
			font-size: 15px;
			color: gray;
		}	
	}
	.avatar{
		display: flex;
		flex-direction: row;
		justify-content:space-between;
		align-items: center;
		.avatartext{
			flex: 1;
		}
		.avatarbtn{
			width: 100rpx;
			height: 100rpx;
			padding: 0; /* 清除按钮默认的内边距 */
			// justify-content: space-between;
			// align-items: center;
			.avatarImage{
				width: 100%;
				height: 100%;
			}
		}
		margin: 40rpx;
	}
	.account{
		display: flex;
		justify-content: space-between;
		margin: 40rpx;
	}
	.name-container{
		display: flex;
		justify-content: space-between;
		padding: 40rpx;
		.nameText{
			flex: 1;
		}
		.name-input{
			width: 300rpx;
			text-align: right;
		}
	}
	.logoutbtn{
		border-radius: 40rpx;
		border: #000000;
		color: firebrick;
	}
}
</style>
