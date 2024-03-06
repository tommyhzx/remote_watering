<template>
	<view>		
		<swiper class="swiper" interval="interval" indicator-dots="true" 
		circular="true">
			<swiper-item>
				<DeviceCard>123</DeviceCard>
			</swiper-item>
			<swiper-item>
				<DeviceCard>123</DeviceCard>
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
				deviceSN:[]
			};
		},
		methods:{
			addDevice(){
				this.modalVisible = true;
				
			},
			onConfirm(deviceId){
				this.modalVisible = false;			
				if(this.deviceSN.includes(deviceId)){
					uni.showToast({
						title:"设备已存在"
					})
				}else{
					this.deviceSN.push(deviceId);
				}
				console.log("当前设备SN",this.deviceSN)
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
