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
			<view class='pic-button' :class="buttonEnabled ? '' : 'img_notClick'">
				<image class="col2Image" :src="warteringimageSrc" mode="heightFix" @touchstart="onWaterring(device)"
					@touchend="delayedStopWaterring(device)" :disabled="!buttonEnabled"></image>
			</view>
			<text class="btn-text">{{ buttonText }}</text>
		</view>
		<view class='delete-containor'>
			<image class="delete-pic" :src="deletePicUrl" mode="heightFix" @click="deleteDevice"></image>
		</view>
	</view>
</template>

<script>
import { api_sendTcpMessage, api_getDeviceConnectionStatus } from '@/api/api_device.js';
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
		this.deviceConnectionCheck(this.device);
	},
	methods: {

		async onWaterring(device) {
			let res = await api_sendTcpMessage(device, "on");
			if (res.data.code !== 0) {
				uni.showToast({ title: "开始消息发送失败" });
				return;
			}
			this.updateWateringState(true);
			// 当浇水按钮点击超过10s后，自动停止浇水
			this.wateringTimeout = setTimeout(() => {
				console.log("自动停止浇水");
				this.stopWaterring(device);
			}, 10000);
		},
		// 开始浇水后，松手不能马上停止，要延迟300ms后停止浇水
		delayedStopWaterring(device) {
			// 清除之前的延迟调用定时器
			if (this.stopWateringTimeout) {
				clearTimeout(this.stopWateringTimeout);
			}
			// 延迟300ms调用stopWaterring
			this.stopWateringTimeout = setTimeout(() => {
				this.stopWaterring(device);
			}, 300);
		},
		async stopWaterring(device) {
			// 清除开始浇水的10s定时器
			if (this.wateringTimeout) {
				clearTimeout(this.wateringTimeout);
				this.wateringTimeout = null;
			}
			let res = await api_sendTcpMessage(device, "off");
			if (res.data.code !== 0) {
				uni.showToast({ title: "停止消息发送失败" });
				return;
			}
			this.updateWateringState(false);
		},

		async deleteDevice() {
			const device = this.device;
			const res = await uni.showModal({
				title: '删除设备',
				content: '是否确认要删除该设备？'
			});
			if (res.confirm) {
				try {
					const result = await uniCloud.callFunction({
						name: "deleteDevice",
						data: { device: device }
					});
					console.log("reslut删除设备", result);
					if (result.result.code !== 0) {
						uni.showToast({ title: "设备删除失败" });
					} else {
						//发送消息到主页，删除设备
						console.log("删除设备", device.deviceSN);
						uni.$emit("deleteDevice", device.deviceSN);
					}
				} catch (error) {
					uni.showToast({ title: "设备删除异常" });
				}
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		},
		async deviceConnectionCheck(device) {
			try {
				// 获取设备连接状态
				await this.getConnectionStatus(device);
			} catch (error) {
				console.error("获取设备连接状态失败:", error);
			} finally {
				// 5秒后再次获取状态
				setTimeout(() => {
					this.deviceConnectionCheck(device);
				}, 5000);
			}
		},
		// 定义获取设备连接状态的方法
		async getConnectionStatus(device) {
			try {
				// 发送请求获取设备连接状态，并处理获取到的状态
				const res = await api_getDeviceConnectionStatus(device);
				if (res.data.code === 0) {
					if (res.data.data === true) {
						this.updateConnectionStatus(true);
					} else {
						this.updateConnectionStatus(false);
					}
				} else {
					uni.showToast({
						title: "获取设备连接状态失败",
						icon: "error"
					});
				}
				// console.log("获取设备连接状态",this.device.deviceSN);
			} catch (error) {
				console.error('获取设备连接状态失败：', error);
				uni.showToast({
					title: "获取设备连接状态异常",
					icon: "error"
				});
			}
		},

		updateWateringState(isWatering) {
			console.log("updateWateringState isWatering", isWatering);
			this.warteringimageSrc = isWatering ? "../../static/deviceCard/stopwartering.png" : "../../static/deviceCard/startwartering.png";
			this.buttonText = isWatering ? "正在浇花" : "开始浇花";
			this.buttonEnabled = !isWatering;
		},
		updateConnectionStatus(isConnected) {
			this.connectStatusScr = isConnected ? "../../static/deviceCard/connect.png" : "../../static/deviceCard/wifi_disconnect.png";
			this.connectStatus = isConnected ? "在线" : "离线";
		}
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
