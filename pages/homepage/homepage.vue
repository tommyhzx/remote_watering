<template>
	<view class="containor">	
		<view class="header">
			<image class="logo" src="/static/homepage/add_pic.png" @click="addDevice" mode="heightFix"/>
			<view class="welcom">
				<text class="welcom-text">欢迎, {{userName}}</text>
				<image class="avatar" :src='avatarUrl' @click="gotoAbout"/>
			</view>
		    
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
					<text class="add-device-text">请添加设备</text>
				</view>
			</swiper-item>		
		</swiper>
		<!-- <InputModal :visible= "modalVisible" @confirm="onConfirm" @cancel="onCancel" ></InputModal> -->
	</view>
	<button @click="test">测试跳转</button>
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
				avatarUrl: getApp().globalData.userAvater || '/static/pic/defaultAvatar.png',// 存储用户头像地址
				userName:getApp().globalData.username,
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
						title:"设备已存在",
					})
					// return;
				}else{				
					const device = {
						deviceSN:deviceData.deviceSN,
						deviceName:deviceData.deviceName,
						devicePlace:deviceData.devicePlace,
						deviceUser:getApp().globalData.WxOpenId,
					}
					
					uniCloud.callFunction({
						name:"creatDevice",
						data:{
							device : device
						}
					}).then(res => {						
						if(res.result.code == 0){
							this.devices.push({
								deviceSN:deviceData.deviceSN,
								deviceName:deviceData.deviceName,
								devicePlace:deviceData.devicePlace
							});
							this.deviceSN.push(deviceData.deviceSN)
						}else{
							console.log("creatDevice Fail，",res.result.msg);
							uni.showToast({
								title:res.result.msg,
							})
						}				
					});
				}				
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
				console.log("设备列表",this.devices);
			});
			
			// 保存个人信息后触发
			uni.$on('saveUserInfo', (userData) => {
			        // 全局变量变化时，重新赋值给计算属性
			        this.avatarUrl = userData.avatarUrl;
					this.userName = getApp().globalData.username;
			});
		},
		onShow() {
			
			uni.hideHomeButton();
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
				        url: '/pages/about/about' // 跳转到个人主页
				});
			},
			test(){
				console.log("tiaozhuan");
				uni.navigateToMiniProgram({
				  appId: 'wxc8125e5b4219faab',
				  path: 'pages/ap/ap',
				  envVersion: 'release',
				  success(res) {
				    // 打开成功
				    console.log('跳转成功', res);
				  },
				  fail(err) {
				    // 打开失败
				    console.error('跳转失败', err);
				  }
				});
			}
		}
	}
</script>

<style lang="scss">
	
	.containor{
		display: flex;
		flex-direction: column;
		// justify-content: space-around;
		// align-items: center;	
		background-color: #FFE100;
		.header{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			background-color: #FFE100;
			width: 100hw;
			margin-top: 30rpx;
			.welcom{
				display: flex;
				align-items: center;
				.avatar{
					max-width: 100rpx;
					max-height: 100rpx;
					margin-right: 50rpx;
					margin-left: 30rpx;
					border-radius: 15px;
				}
			}
			
			.logo{
				max-height: 70rpx;
				margin-left: 30rpx;
			}
		}
		.swiper{
			display: flex;
			align-items: center;
			height: 85vh;
			width: 750rpx;
			margin-top: 30rpx;
			background-color: white;
			border-radius: 0rpx;
			.add-device-btn-containor{
				display: flex;
				justify-content: center;
				align-items: center;
				.add-device-btn {
					image{
						display: flex;
						align-items: center;
						width: 150rpx;
						max-height: 150rpx;
						margin-bottom: 30rpx;
					}
				}
			}
		}
	}
	
</style>
