<template>
	<view class='containor'>
		<!-- <view class="deviceCardContainor" v-for="(deviceCard,index) in deviceCardList" :key="index"> -->
		<view class="device-card">
			<view class="deviceInfo">
				<image class="device-pic" :src="deviceUrl" mode="heightFix"></image>
				<text class="device-text">{{ device.deviceSN }}</text>
				<text class="device-text">{{ device.deviceName }}</text>
				<text class="device-place">地点：{{ device.devicePlace }}</text>
			</view>
		</view>
		<view class="wifi-containor">
			<!-- wifi的连接状态 -->
			<view class="wifi">
				<image class="wifi-logo" :src="connectStatusScr" mode="heightFix"></image>
				<text class="wifi-text">{{ connectStatus }}</text>
			</view>
		</view>
		<view class="button-containor">
			<view class='pic-button' :class="buttonEnabled == true ? '' : 'img_notClick'">
				<image class="col2Image" :src="warteringimageSrc" mode="heightFix" @touchstart="onWaterring(device)"
					@touchend="stopWaterring(device)" :disabled="!buttonEnabled"></image>
			</view>
			<text class="btn-text">{{ buttonText }}</text>
		</view>
		<view class='delete-containor'>
			<image class="delete-pic" :src="deletePicUrl" mode="heightFix" @click="deleteDevice"></image>
		</view>
		<!-- </view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			warteringimageSrc: "../../static/deviceCard/startwartering.png",
			connectStatusScr: "../../static/deviceCard/wifi_disconnect.png",
			connectStatus: "离线",
			deviceUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/uniapp/device.png",
			deletePicUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/delte-pic.png",
			buttonEnabled: true, // 添加一个变量来控制按钮的可用性
			buttonText: "开始浇花",
			wateringTimeout: null, // 添加一个变量来存储定时器ID
		};
	},
	props: {
		device: {
			type: Object,
			required: true,
			default: () => ({
				deviceSN: '',
				deviceName: '',
				devicePlace: ''
			})
		}
	},
	mounted() {
		// 在页面加载后，每隔5秒执行一次获取设备连接状态的操作
		this.startDeviceConnectionStatusCheck();
	},
	methods: {
		onWaterring(device) {
			// console.log("send tcp message",device)
			this.sendTcpMessage(device, "on");
			this.warteringimageSrc = "../../static/deviceCard/stopwartering.png";
			this.buttonText = "正在浇花",
			this.buttonEnabled = false;
			// 当浇水按钮点击超过10s后，自动停止浇水
			this.wateringTimeout = setTimeout(() => {
                this.stopWaterring(device);
            }, 10000);
		},
		stopWaterring(device) {
			// 清除定时器
            if (this.wateringTimeout) {
                clearTimeout(this.wateringTimeout);
                this.wateringTimeout = null;
            }
			let count = 0;	
			const interval = setInterval(() => {
				this.sendTcpMessage(device, "off");
				count++
				if (count === 2) {
					clearInterval(interval);
					this.warteringimageSrc = "../../static/deviceCard/startwartering.png";
					this.buttonText = "开始浇花",
					this.buttonEnabled = true;
				}
			}, 300);
		},
		sendTcpMessage(device, action) {
			uni.request({
				url: 'https://apis.bemfa.com/va/postmsg', //api接口，详见接入文档
				method: "POST",
				data: {  //请求字段，详见巴法云接入文档，http接口
					uid: "c2421290f7d14fa38251e5f77aac931a",
					topic: this.device.deviceSN,
					type: 3,
					msg: action   //发送消息为on的消息
				},
				header: {
					'content-type': "application/x-www-form-urlencoded"
				},
				success: res => {
					console.log("发送成功：", action)
				}
			});
		},
		deleteDevice() {
			console.log("delete", this.device);
			const device = this.device;
			uni.showModal({
				title: '删除设备',
				content: '是否确认要删除该设备？',
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定', device);
						uniCloud.callFunction({
							name: "deleteDevice",
							data: {
								device: device
							}
						}).then(res => {
							if (res.result.code != 0) {
								console.log("deleteDevice Fail，", res.result.msg);
							} else {
								//发送消息到主页，删除设备
								uni.$emit("deleteDevice", device.deviceSN);
							}
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},

		// 定义获取设备连接状态的方法
		async getDeviceConnectionStatus() {
			try {
				// 发送请求获取设备连接状态，并处理获取到的状态
				// console.log("获取设备连接状态",this.device.deviceSN);
				uni.request({
					url: 'https://apis.bemfa.com/va/online', //api接口，详见接入文档
					method: "GET",
					data: {  //请求字段，详见巴法云接入文档，http接口
						uid: "c2421290f7d14fa38251e5f77aac931a",
						topic: this.device.deviceSN,
						type: 3,
					},
					header: {
						'content-type': "application/x-www-form-urlencoded"
					},
					success: res => {
						// console.log("getDeviceConnectionStatus发送成功",res.data);
						//请求成功
						if (res.data.code == 0) {
							if (res.data.data == true) { //已连接
								this.connectStatusScr = "../../static/deviceCard/connect.png";
								this.connectStatus = "在线";
							} else {
								this.connectStatusScr = "../../static/deviceCard/wifi_disconnect.png";
								this.connectStatus = "离线";
							}
						}
					}
				});
			} catch (error) {
				console.error('获取设备连接状态失败：', error);
				uni.showToast({
					title: "获取设备连接状态失败",
					icon: "error"
				});
			}
		},
		startDeviceConnectionStatusCheck() {
			// 获取设备连接状态
			this.getDeviceConnectionStatus()
				.then(() => {
					// 成功后，5秒后再次获取状态
					setTimeout(this.startDeviceConnectionStatusCheck, 5000);
				})
				.catch((error) => {
					console.error("获取设备连接状态失败:", error);
					// 失败后，5秒后重试
					setTimeout(this.startDeviceConnectionStatusCheck, 5000);
				});
		},
	},
}
</script>

<style lang="scss">
.containor {
	background-color: #ffffff;
	// background-color: #fff11111;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding-bottom: 300rpx;

	.deviceInfo {
		//height: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		margin-top: 5vh;

		.device-pic {
			max-width: 250rpx;
			max-height: 250rpx;
			margin: 10rpx;
		}

		.device-text {
			margin: 5rpx;
			font-size: 20px;
		}

		.device-place {
			font-size: 15px;
			color: grey;
		}
	}

	.wifi-containor {
		margin: 20rpx;

		.wifi {
			display: flex;
			flex-direction: row;
			align-items: center;

			.wifi-logo {
				max-width: 60rpx;
				max-height: 60rpx;
				margin: 10rpx;
				margin-right: 30rpx;
			}

			.wifi-text {
				font-size: 20px;
			}
		}
	}

	.button-containor {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 10rpx;

		.pic-button {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.col2Image {
				max-width: 200rpx;
				max-height: 200rpx;
			}
		}

		.btn-text {
			font-size: 20px;
		}

		.img_notClick {
			pointer-events: none;
		}
	}

	.delete-pic {
		height: 50rpx;
		margin-top: 10rpx;
		margin-bottom: 100rpx;
	}
}
</style>
