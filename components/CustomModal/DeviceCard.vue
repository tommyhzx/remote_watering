<template>
	<view class='containor'>
		<!-- <view class="deviceCardContainor" v-for="(deviceCard,index) in deviceCardList" :key="index"> -->
			 <view class="device-card">							 
				<view class="deviceInfo">
					<image class="device-pic" src="/static/pic/device.png" mode="heightFix"></image>
					<text class="device-text">{{device.deviceSN}}</text>
					<text class="device-text">{{device.deviceName}}</text>
					<text class="device-place">地点：{{device.devicePlace}}</text>
				</view>		
			</view>
			<view class="wifi-containor">
				<view class="wifi">					
					<image class="wifi-logo" src="/static/pic/WIFI.png" mode="heightFix"></image>
					<text class="wifi-text">已连接</text>
				</view>
			</view>
			<view class="button-containor">
				<view class='pic-button'>
					<image class="col2Image" :src="warteringimageSrc" mode="heightFix"
					@touchstart="onWaterring(device)" @touchend="stopWaterring(device)"></image>
				</view>
			</view>
			<view class='delete-containor'>
				<image class="delete-pic" src="/static/deviceCard/delte-pic.png" mode="heightFix" @click="deleteDevice"></image>
			</view>
		<!-- </view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				warteringimageSrc:"../../static/deviceCard/startwartering.png"
			};
		},
		props:{
			device:{
				deviceSN:String,
				deviceName:String,
				devicePlace:String,	
			}
					
		},
		methods:{
			onWaterring(device){
				console.log("send tcp message",device)
				this.sendTcpMessage(device,"on");
				this.warteringimageSrc = "../../static/deviceCard/stopwartering.png";
			},
			stopWaterring(device){
				this.sendTcpMessage(device,"off");
				this.warteringimageSrc = "../../static/deviceCard/startwartering.png";
			},
			sendTcpMessage(device, action){
				uni.request({
				  url: 'https://apis.bemfa.com/va/postmsg', //api接口，详见接入文档
				  method:"POST",
				  data: {  //请求字段，详见巴法云接入文档，http接口
				    uid: "c2421290f7d14fa38251e5f77aac931a",
				    topic: this.device.deviceSN,
					type:3,
				    msg:action   //发送消息为on的消息
				  },
				  header: {
				    'content-type': "application/x-www-form-urlencoded"
				  },
				 success:res=>{
				   console.log("发送成功")
				 } 
				});
			},
			deleteDevice(){
				console.log("delete",this.device);
				const device = this.device;
				uni.showModal({
				    title: '删除设备',
				    content: '是否确认要删除该设备？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定',device);
							uniCloud.callFunction({
								name:"deleteDevice",
								data:{
									device : device
								}
							}).then(res => {
								if(res.result.code != 0){
									console.log("deleteDevice Fail，",res.result.msg);
								}else{
									//发送消息到主页，删除设备
									uni.$emit("deleteDevice",device.deviceSN);
								}				
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		},
	}
</script>

<style lang="scss">
	.containor{
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		.deviceInfo{
			//height: 250rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			margin: 20rpx;
			.device-pic{
				max-width: 250rpx;
				max-height: 250rpx;
				margin: 20rpx;
			}
			.device-text{
				margin: 5rpx;
				font-size: 20px;
			}
			.device-place{
				font-size: 15px;
				color: grey;
			}
		}
		.wifi-containor{
			margin: 20rpx;
			.wifi{
				display: flex;
				flex-direction: row;
				align-items: center;
				
				.wifi-logo{
					max-width: 100rpx;
					max-height: 100rpx;
					margin: 10rpx;
				}
				.wifi-text{
					font-size: 20px;
				}
				
			}
		}
		.button-containor{
			.pic-button{
				display: flex;
				align-items: center;
				.col2Image{
					max-width: 200rpx;
					max-height: 200rpx;
				}
				
			}
		}
		.delete-pic{
			height: 50rpx;
			margin-top: 30rpx;
		}
	}
	
</style>
