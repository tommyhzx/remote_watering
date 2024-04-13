<template>
	<view>
		<view class="overlay">
			<view class="spacer"></view>
			<view class="imagecontainer">
				<image class="device-pic" src="/static/addDevice/device-pic.png" mode="widthFix"/>
				<view>浇花器</view>
			</view>
			
			<view class="input-modal">
				<view>设备号</view>
				<view class='deviceSN'>					
					<input class="input-text" type="text" v-model="device.deviceSN" placeholder="请输入设备ID">
					<image class='deviceScan' src='../../static/icon/device_select.png' @click="scanQRcode"></image>
				</view>
				<view>设备名</view>
				<input class="input-text" type="text" v-model="device.deviceName" placeholder="输入设备名">
				<view>场景位置</view>
				<input class="input-text" type="text" v-model="device.devicePlace" placeholder="输入场景">
				<button class="button-ok" @click="confirm">确定</button>
				<button class="button-cancel" @click="cancel">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalVisible: true,
				device:{
					deviceSN: '' ,// 输入的设备ID
					deviceName:'',
					devicePlace:''
				}
			};
		},
		methods:{
			confirm(){
				const deviceData = this.device; // 存储设备数据到变量中
				if(deviceData.deviceSN == '' | deviceData.deviceName == '' | deviceData.devicePlace == ''){
					uni.showToast({
						title:"请填写设备信息"
					})
					return;
				}	
				uni.$emit("addDevice",deviceData);	
				uni.navigateBack({
					delta: 1 ,// 返回上一级页面
					// success() {
						

					// }
				});
				
			},
			cancel(){
				uni.navigateBack({
					delta: 1 // 返回上一级页面
				});
			},
			scanQRcode(){
				uni.scanCode({
				    success: (res) => {
						this.device.deviceSN = res.result;
						// 将扫描得到的信息存储到变量或者提交给后台
						// 在这里可以添加逻辑处理扫描结果的操作
					},
					fail: (err) => {
						console.error(err); // 打印错误信息
						uni.showToast({
						                title: '扫描失败，请重试',
						                icon: 'none'
						            });
						// 可以根据具体情况处理扫描失败的情况
					}
				});
			}
		}
		
	}
</script>

<style lang="scss">
	.overlay{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.imagecontainer{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50px;
		.device-pic{
			width: 200rpx;
			padding-right: 50rpx;
		}
	}
	
.input-modal {
	  width: 500rpx;
	  font-size: 14px;
	  .deviceSN{
		  display: flex;
		  flex-direction: row;
		  justify-content: space-between;
		  .deviceScan{
			  width: 90rpx;
			  height: 90rpx;
		  }
	  }
	  .input-text{
		border: 1px solid #bfbfbf; /* Add border */
		border-radius: 5px;
		padding: 1px;
		margin-bottom: 20px;
		height: 80rpx;
	  }
	  .button-ok{
		width: 300rpx;
		font-size: 14px;
		margin-bottom: 5px;		
		border-radius: 10px;
		background-color: #FFE100;
	  }
	  .button-cancel{
	  		width: 300rpx;
	  		font-size: 14px;
	  		margin-bottom: 5px;		
	  		border-radius: 10px;
	  		background-color: #BFBFBF;
	  }
	}
</style>
