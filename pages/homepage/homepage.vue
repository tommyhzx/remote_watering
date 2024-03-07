<template>
	<view>		
		<swiper class="swiper" interval="interval" indicator-dots="true" 
		circular="true">
		
			<swiper-item v-for="(device, index) in devices" :key="index">
			<!-- <swiper-item>	 -->
				<DeviceCard :device="device">123</DeviceCard>
			</swiper-item>
		</swiper>
		<button @click="addDevice">添加设备</button>
		<InputModal :visible= "modalVisible" @confirm="onConfirm" @cancel="onCancel" ></InputModal>
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
			};
		},
		methods:{
			addDevice(){
				this.modalVisible = true;
				
			},
			onConfirm(device){
				this.modalVisible = false;			
				if(device == ''){
					uni.showToast({
						title:"设备号不能为空"
					})
					return;
				}
				if(this.deviceSN.includes(device)){
					uni.showToast({
						title:"设备已存在"
					})
				}else{
					this.devices.push({
						deviceSN:device.deviceSN,
						deviceName:device.deviceName,
						devicePlace:device.devicePlace
					})
				}
				
			},
			onCancel(){
				this.modalVisible = false;
			}
		}
	}
</script>

<style lang="scss">
	.swiper{
		display: flex;
		align-items: center;
		height: 1000rpx;
	}
</style>
