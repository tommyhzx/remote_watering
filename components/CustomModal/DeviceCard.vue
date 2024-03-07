<template>
	<view>
		<!-- <view class="deviceCardContainor" v-for="(deviceCard,index) in deviceCardList" :key="index"> -->
			 <view class="device-card">							 
				<view class="deviceInfo">
					<image class="device-pic" src="/static/pic/device.png" mode="heightFix"></image>
					<text class="device-text">{{device.deviceName}}</text>
					<text class="device-place">{{device.devicePlace}}</text>
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
					<image class="col2Image" src="/static/pic/watering.png" mode="heightFix" @click="onWaterring(device)"></image>
				</view>
			 </view>
		<!-- </view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
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
				console.log("test",device)
				
			},
			deleteDevice(){
				
			}
		},
	}
</script>

<style lang="scss">
	.deviceInfo{
		//height: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		margin: 50rpx;
		.device-pic{
			max-width: 250rpx;
			max-height: 250rpx;
			margin: 30rpx;
		}
		.device-text{
			margin: 20rpx;
			font-size: 20px;
		}
		.device-place{
			font-size: 15px;
			color: grey;
		}
	}
	.wifi-containor{
		display: flex;
		justify-content: center;
		margin: 30rpx;
		.wifi{
			display: flex;
			flex-direction: row;
			align-items: center;
			
			.wifi-logo{
				max-width: 100rpx;
				max-height: 100rpx;
				margin: 20rpx;
			}
			.wifi-text{
				font-size: 20px;
			}
			
		}
	}
	.button-containor{
		display: flex;
		justify-content: center;
		.pic-button{
			display: flex;
			align-items: center;
			.col2Image{
				max-width: 200rpx;
				max-height: 200rpx;
			}
			
		}
	}
</style>
