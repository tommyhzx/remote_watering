<template>
	<view class="input-modal" v-if="visible">
		<input type="text" v-model="deviceId" placeholder="请输入设备ID">
		<button @click="confirm">确定</button>
		<button @click="cancel">取消</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: '' // 输入的设备ID			
			};
		},
		props:{
			visible:'',

		},
		methods: {
		    confirm() {
		      // 处理确定按钮点击事件，这里可以获取输入框中的设备ID并进行相应处理
		      const deviceId = this.deviceId;
		      this.$emit('confirm', deviceId);
			  this.deviceId = '';
		    },
		    cancel() {
		      // 处理取消按钮点击事件，关闭模态框
		      this.$emit('cancel');
			  this.deviceId = '';
		    }
		  }
	}
</script>

<style lang="scss">
	.modal {
	  background-color: #ffffff;
	  padding: 20px;
	  border: 1px solid #ccc;
	  border-radius: 8px;
	  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
