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
			<button class='btn-save' @click="save">保存</button>
			<button class='btn-cancel' @click="cancel">取消</button>
		</view>
		<button class="logoutbtn" @click="userLogout">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					avatarUrl: getApp().globalData.userAvater || '/static/pic/defaultAvatar.png',
					userName: getApp().globalData.username,
				},
				tempUrl:'',
				tempName:"",
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
				this.tempUrl = avatarUrl;
				this.userInfo.avatarUrl = avatarUrl;
				console.log("userInfo:",avatarUrl);
			},
			changeName(event){
				this.tempName = event.target.value;
				this.userInfo.userName = event.target.value;
			},
			bindblur(event){
				this.tempName = event.target.value;
				this.userInfo.userName = event.target.value;
			},
			save(){
				//更改头像
				if(this.tempUrl != ''){
					//判断图像大小
					uni.getFileSystemManager().getFileInfo({
						filePath:this.userInfo.avatarUrl,
						success:res => {
							if(res.size > 1024*1024){
								return uni.showToast({
									icon:"none",
									title:"图片不能超过1M"
								})
							}
						console.log("获取上传图像信息成功",res);
						return;
						}
					});
					//读取图片并转Base64保存数据库						
					uni.getFileSystemManager().readFile({
						filePath:this.userInfo.avatarUrl,
						encoding:"base64",
						success:res => {								
							let imageBase64 = 'data:image/jpg;base64,'+res.data;
							console.log("读取头像文件",res);
							uniCloud.callFunction({
								name:"upLoadAvatarImg",
								data:{
									imageBase64:imageBase64,
									WxOpenId:getApp().globalData.WxOpenId,
								}
							}).then(result => {
								if(result.result.code == 0){
									//获取最终数据库的url
									this.userInfo.avatarUrl = result.result.msg;
									this.saveUserInfo();
															
									uni.navigateBack({
									 	url:'/pages/homepage/homepage'
									});
								}else{
									console.log("上传失败",result);
									uni.showToast({
										icon:"none",
										title:"上传失败"
									})
								}
							})
						},
						fail:err => {
							console.error("读取文件失败:", err);
						}
					});				
				}else if(this.tempName != ''){						
					this.saveUserInfo();						
					uni.navigateBack({
					 	url:'/pages/homepage/homepage'
					});
				}else{
					console.log("头像和名字未修改",this.tempName);
					uni.showToast({
						icon:"none",
						title:"未修改信息"
					})
				}						
			},
			saveUserInfo(){
				getApp().globalData.userAvater = this.userInfo.avatarUrl;
				getApp().globalData.username = this.userInfo.userName;
				uni.$emit('saveUserInfo', this.userInfo);
				//保存数据库
				uniCloud.callFunction({
					name:"saveUserInfo",
					data:{
						WxOpenId : getApp().globalData.WxOpenId,
						username : getApp().globalData.username,
						userAvater : getApp().globalData.userAvater,
					}
				}).then(res => {
					console.log("saveUserInfo log：",res.result.msg);
					if(res.result.code != 0){ 
						console.log("saveUserInfo Fail，",res.result.msg);
					}				
				});	
			},
			cancel(){
				this.userInfo.avatarUrl = getApp().globalData.userAvater;
				this.userInfo.userName = getApp().globalData.username;
				uni.navigateBack({
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
	
	height: 100vh;
	margin-top: auto; /* 使容器尽可能靠底部 */
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
		margin-top: auto;
		margin-bottom: 100rpx;
	}
	.btn-save{
		width: 300rpx;
		font-size: 14px;
		margin-bottom: 5px;		
		border-radius: 10px;
		background-color: #FFE100;
	}
	.btn-cancel{
		width: 300rpx;
		font-size: 14px;
		margin-bottom: 5px;		
		border-radius: 10px;
		background-color: #BFBFBF;
	}
}
</style>
