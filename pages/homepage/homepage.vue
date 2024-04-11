<template>
	<view class="containor">	
		<view class="header">
			<image class="logo" src="/static/homepage/add_pic.png" @click="addDevice" mode="heightFix"/>
		    <image class="avatar" :src='avatarUrl' @click="gotoAbout"/>
		</view>

		<swiper class="swiper" interval="interval" indicator-dots="true" 
		circular="true">
			<!-- 遍历用户下的设备 -->
			<swiper-item v-for="(device, index) in devices" :key="index">
				<DeviceCard :device="device">123</DeviceCard>
			</swiper-item>
			<!-- 若用户当前没有设备，则显示添加设备按钮 -->
			<swiper-item class="add-device-btn-containor" v-if="showAddDeviceBtn">
				<view  class="add-device-btn">
					<image src="../../static/homepage/add-btn.png" @click="addDevice" mode="scaleToFill"></image>
				</view>
			</swiper-item>		
		</swiper>
		<!-- <InputModal :visible= "modalVisible" @confirm="onConfirm" @cancel="onCancel" ></InputModal> -->
	</view>
</template>

<script>
	import InputModal from '@/components/CustomModal/InputModal.vue';
	import DeviceCard from '@/components/CustomModal/DeviceCard.vue';
	export default {
		components:{
			InputModal,
			DeviceCard,
		},
		props:{
			
		},
		data() {
			return {
				modalVisible: false,
				deviceSN:[],
				defaultDevice:{
					deviceSN:'',
					deviceName:"默认设备",
					devicePlace:"设备位置",
				},
				devices:[],
				showAddDeviceBtn: true, // 若swiper没有设备，则添加一个按钮
				User:'',
				avatarUrl: getApp().globalData.userAvater // 存储用户头像地址
			};
		},
		computed:{
			showAddDeviceBtn() {
			    return this.devices.length === 0;
			},
		},
		onReady(){
			
		},
		onLoad(option) {
			uni.$on('addDevice', (deviceData) => {
				if(this.deviceSN.includes(deviceData.deviceSN)){
					uni.showToast({
						title:"设备已存在"
					})
				}else{
					this.devices.push({
						deviceSN:deviceData.deviceSN,
						deviceName:deviceData.deviceName,
						devicePlace:deviceData.devicePlace
					});
					this.deviceSN.push(deviceData.deviceSN)
				}
				const device = {
					deviceSN:deviceData.deviceSN,
					deviceName:deviceData.deviceName,
					devicePlace:deviceData.devicePlace,
					deviceUser:this.User,
				}
				uniCloud.callFunction({
					name:"creatDevice",
					data:{
						device : device
					}
				}).then(res => {
					if(res.result.code != 0){
						console.log("creatDevice Fail，",res.result.msg);
					}				
				});
			});
			//登录后，传入wxID，从数据库获取用户的设备列表
			uni.$on('LoginID', (deviceData) => {
				console.log('监听到事件来自 update ，LoginID 为：' + deviceData);
				this.User = deviceData;
				//获取当前用户保存在数据库里的设备信息
				uniCloud.callFunction({
					name:"getUserDevices",
					data:{
						deviceUser : deviceData
					}
				}).then(res => {					
					if(res.result.code == 0){
						console.log("查询用户设备为：",res);
						this.devices = res.result.data;
					}
				})
			});
			
			uni.$on('deleteDevice', (deviceSN) => {
				console.log("删除设备列表",deviceSN);
				const deleteDeviceSN = deviceSN;
				const filteredDevices = this.devices.filter(device => device.deviceSN !== deleteDeviceSN);
				this.devices = filteredDevices;

			});
			
			// 保存个人信息后触发
			uni.$on('saveUserInfo', (userData) => {
			        // 全局变量变化时，重新赋值给计算属性
			        this.avatarUrl = userData.userAvater;
			});
		},
		onUnload() {  
		    // 移除监听事件  
		        uni.$off('addDevice');  
		    },
		methods:{
			addDevice(){
				uni.navigateTo({
				        url: '/pages/addDevice/addDevice' // 跳转到添加设备页
				});
				// this.modalVisible = true;
				
			},
			gotoAbout(){
				uni.navigateTo({
				        url: '/pages/about/about' // 跳转到添加设备页
				});
			}
		}
	}
</script>

<style lang="scss">
	.header{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		background-color: #FFE100;
		width: 750rpx;
		.avatar{
			max-width: 100rpx;
			max-height: 100rpx;
		}
		.logo{
			max-height: 70rpx;
		}
	}
	.containor{
		display: flex;
		flex-direction: column;
		align-items: center;	
		background-color: #FFE100;
		.swiper{
			display: flex;
			align-items: center;
			height: 1050rpx;
			width: 750rpx;
			margin-top: 30rpx;
			background-color: white;
			border-radius: 0rpx;
			.add-device-btn-containor{
				display: flex;
				justify-content: center;
				align-items: center;
				.add-device-btn image{
					display: flex;
					align-items: center;
					width: 100rpx;
					max-height: 100rpx;
				}
			}
		}
	}
	
</style>
