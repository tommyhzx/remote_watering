<template>
	<view class="overlay">
		<view class="input-modal" v-if="visible">
			<input class="input-text" type="text" v-model="device.deviceSN" placeholder="请输入设备ID">
			<input class="input-text" type="text" v-model="device.deviceName" placeholder="输入设备名">
			<input class="input-text" type="text" v-model="device.devicePlace" placeholder="输入场景">
			<button class="button" @click="confirm">确定</button>
			<button class="button" @click="cancel">取消</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				device:{
					deviceSN: '' ,// 输入的设备ID
					deviceName:'',
					devicePlace:''
				}
				
			};
		},
		props:{
			visible:'',

		},
		methods: {
		    confirm() {
		      // 处理确定按钮点击事件，这里可以获取输入框中的设备ID并进行相应处理
			  const device = {
				  deviceSN:this.device.deviceSN,
				  deviceName:this.device.deviceName,
				  devicePlace:this.device.devicePlace
			  }			  
		      this.$emit('confirm', device);
			  this.device.deviceSN = '';
			  this.device.deviceName = '';
			  this.device.devicePlace = '';
		    },
		    cancel() {
		      // 处理取消按钮点击事件，关闭模态框
		      this.$emit('cancel');
			  this.device.deviceSN = '';
			  this.device.deviceName = '';
			  this.device.devicePlace = '';
		    }
		  }
	}
</script>

<style lang="scss">
	.input-modal {
	  background-color: #ffffff;
	  padding: 20px;
	  border: 1px solid #ccc;
	  border-radius: 8px;
	  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	  .input-text{
		border: 1px solid #bfbfbf; /* Add border */
		border-radius: 5px;
		padding: 5px;
		margin-bottom: 10px;
		height: 80rpx;
	  }
	  .button{
		margin-bottom: 5px;		  
	  }
	}
	
</style>
