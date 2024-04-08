<template>
	<view class="container">
		<view class="title">
			<text >基础资料</text>
		</view>
		
		<view class="avatar">
			<text class="avatartext">头像</text>
			<button class = "avatarbtn" type="balanced" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
				<image :src="avatarUrl" class="avatarImage"></image>
			</button>
			<!-- <image src="../../static/pic/defaultAvatar.png"></image> -->
		</view>
		<view class="account">
			<text>账号</text>
			<text>12345678</text>
		</view>
		<view class="name-container">
			<text class="nameText">姓名</text>
			<input :clearable="false" type="nickname" class="name-input" :value="userName" @blur="bindblur"
				placeholder="请输入昵称" @input="bindinput" />
		</view>
		<button class="logoutbtn" @click="userLogout">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: '../../static/pic/defaultAvatar.png'
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
				this.avatarUrl = avatarUrl
			},
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
