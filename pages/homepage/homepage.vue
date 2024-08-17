<template>
	<view class="containor">
		<view class="header">
			<view class="add_device_pic">
				<image class="add_device" :src="addPicUrl" @click="addDevice" mode="heightFix" />
			</view>

			<view class="peiwang">
				<image class="peiwang-img" :src="peiwangUrl" @click="peiwang" mode="heightFix" />
				<text>一键配网</text>
			</view>
			<view class="welcom">
				<text class="welcom-text">欢迎, {{ userName }}</text>
				<image class="avatar" :src='avatarUrl' @click="gotoAbout" />
			</view>
		</view>

		<swiper class="swiper" interval="interval" indicator-dots="true" circular="true">
			<!-- 遍历用户下的设备 -->
			<swiper-item v-for="(device, index) in devices" :key="index">
				<DeviceCard :device="device"></DeviceCard>
			</swiper-item>
			<!-- 若用户当前没有设备，则显示添加设备按钮 -->
			<swiper-item class="add-device-btn-containor" v-if="showAddDeviceBtn">
				<view class="add-device-btn">
					<image :src="addBtnUrl" @click="addDevice" mode="scaleToFill"></image>
					<text class="add-device-text">请添加设备</text>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import InputModal from '@/components/CustomModal/InputModal.vue';
import DeviceCard from '@/components/CustomModal/DeviceCard.vue';
export default {
	components: {
		InputModal,
		DeviceCard,
	},
	props: {

	},
	data() {
		return {
			//当前页面已经添加设备的SN码
			deviceSN: [],
			//当前页面已添加设备的信息
			devices: [],
			showAddDeviceBtn: true, // 若swiper没有设备，则添加一个按钮

			avatarUrl: getApp().globalData.userAvater || '/static/pic/defaultAvatar.png',// 存储用户头像地址
			userName: getApp().globalData.username,
			addPicUrl: "/static/homepage/add_device.png",
			peiwangUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/peiwang.png",
			addBtnUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/add-btn.png",
		};
	},
	computed: {
		showAddDeviceBtn() {
			return this.devices.length === 0;
		},
	},
	onReady() {

	},
	// 每次页面跳转回来后触发
	async onLoad(option) {
		console.log("onLoad");
	},
	async mounted() {
		// 在 mounted 钩子中监听事件
		uni.$on('LoginID', this.getUserDevices);
		uni.$on('addDevice', this.addDeviceToDatabase);
		uni.$on('deleteDevice', this.deleteDeviceFromList);
		uni.$on('saveUserInfo', this.updateUserInfo);
	},
	// 页面显示时隐藏首页按钮
	onShow() {
		uni.hideHomeButton();
	},
	// 释放监听事件
	beforeDestroy() {
		// 移除监听事件  
		uni.$off('LoginID');
		uni.$off('addDevice');
		uni.$off('deleteDevice');
		uni.$off('saveUserInfo');
	},
	methods: {
		// 等待事件触发
		waitForEvent(eventName) {
			return new Promise((resolve) => {
				uni.$on(eventName, (data) => {
					resolve(data);
				});
			});
		},
		// 获取用户设备
		async getUserDevices(deviceData) {
			try {
				const res = await uniCloud.callFunction({
					name: "getUserDevices",
					data: { deviceUser: deviceData }
				});
				if (res.result.code == 0) {
					console.log("查询用户设备为：", res);
					this.devices = res.result.data;
				}
			} catch (err) {
				console.error("查询用户设备失败：", err);
			}
		},
		// 添加设备到数据库
		async addDeviceToDatabase(deviceData) {
			if (this.deviceSN.includes(deviceData.deviceSN)) {
				uni.showToast({ title: "设备已存在" });
				return
			}

			const device = {
				deviceSN: deviceData.deviceSN,
				deviceName: deviceData.deviceName,
				devicePlace: deviceData.devicePlace,
				deviceUser: getApp().globalData.WxOpenId,
			};

			try {
				const res = await uniCloud.callFunction({
					name: "creatDevice",
					data: { device: device }
				});
				if (res.result.code === 0) {
					this.devices.push({
						deviceSN: deviceData.deviceSN,
						deviceName: deviceData.deviceName,
						devicePlace: deviceData.devicePlace
					});
					this.deviceSN.push(deviceData.deviceSN);
				} else {
					this.showError(res.result.msg);
				}
			} catch (err) {
				this.showError("添加设备失败", err);
			}
		},
		// 从设备列表中删除设备
		deleteDeviceFromList(deviceSN) {
			console.log("删除设备后的设备列表为：", deviceSN);
			this.devices = this.devices.filter(device => device.deviceSN !== deviceSN);
		},
		// 更新用户信息
		updateUserInfo(userData) {
			this.avatarUrl = userData.avatarUrl;
			this.userName = getApp().globalData.username;
		},

		addDevice() {
			uni.navigateTo({
				url: '/pages/addDevice/addDevice' // 跳转到添加设备页
			});
		},
		gotoAbout() {
			uni.navigateTo({
				url: '/pages/about/about' // 跳转到个人主页
			});
		},
		peiwang() {
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
		},
		showError(msg, err) {
			console.error(msg, err);
			uni.showToast({ title: msg });
		}
	}
}
</script>

<style lang="scss">
.containor {
	display: flex;
	flex-direction: column;
	// justify-content: space-around;
	// align-items: center;	
	background-color: #FFE100;

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #FFE100;
		height: 120rpx;

		// width: 100hw;
		// margin-top: 30rpx;
		.welcom {
			display: flex;
			align-items: center;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				margin-right: 50rpx;
				margin-left: 30rpx;
				border-radius: 30px;
			}
		}

		.add_device_pic {
			display: flex;
			align-items: center;
			height: 100rpx;

			.add_device {
				height: 70rpx;
				margin-left: 30rpx;
			}
		}

		.peiwang {
			display: flex;
			align-items: center;
		}

		.peiwang-img {
			height: 70rpx;
			margin-left: 30rpx;
		}
	}

	.swiper {
		display: flex;
		align-items: center;
		height: 85vh;
		width: 750rpx;
		background-color: white;
		border-radius: 0rpx;

		.add-device-btn-containor {
			display: flex;
			justify-content: center;
			align-items: center;

			.add-device-btn {
				image {
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
