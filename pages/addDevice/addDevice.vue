<template>
	<view>
		<view class="overlay">
			<view class="spacer"></view>
			<view class="imagecontainer">
				<image class="device-pic" :src="deviceUrl" mode="widthFix"/>
				<view>浇花器</view>
			</view>			
			<view class="input-modal">
				<view>设备号</view>
				<view class='deviceSN'>		
					<view>
						<input class="deviceSN-text" type="text" v-model="device.deviceSN" placeholder="请输入设备ID">
						<input class="deviceSN-text" type="password" v-model="device.devicePassword" placeholder="请输入设备密码">
					</view>	
					<view class="saoma">
						<image class='deviceScan' src='../../static/addDevice/saoma.png' @click="scanQRcode"></image>
						<text>点击扫码</text>
					</view>
					
				</view>
				<view>设备名</view>
				<input class="input-text" type="text" v-model="device.deviceName" placeholder="输入设备名">
				<view>场景位置</view>
				<input class="input-text" type="text" v-model="device.devicePlace" placeholder="输入场景">
				
			</view>
			<view class="btn">
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
					devicePlace:'',
					devicePassword:'',
				},
				deviceUrl:"https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/device.png",
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
				};
				//查询数据库校验设备密码
				uniCloud.callFunction({
					name:"checkDevicePassword",
					data:{
						deviceSN:this.device.deviceSN,
						devicePassword:this.device.devicePassword,
					}
				}).then(res => {
					if(res.result.code == 0){
						//
						console.log("checkDevicePassword成功",res.result);
						uni.$emit("addDevice",deviceData);
						uni.navigateBack({
							delta: 1 ,// 返回上一级页面
						});
					}else{
						uni.showToast({
						  title: res.result.msg,
						  icon: 'none'
						});
						console.log("checkDevicePassword失败",res.result.msg);
					}
				})
				
				
				
			},
			cancel(){
				uni.navigateBack({
					delta: 1 // 返回上一级页面
				});
			},
			scanQRcode(){
				uni.scanCode({
				    success: (res) => {
						let scanResult = res.result;
						// 使用字符串的 split() 方法将扫描结果按照 '-' 分割成数组
						let scanArray = scanResult.split('-');
						if (scanArray.length >= 2) {
						        let SNcode = scanArray[0]; // 第一个元素是 SN 码
						        let password = scanArray[1]; // 第二个元素是密码
						        // 将 SN 码和密码分别填充到对应的输入框中
						        this.device.deviceSN = SNcode;
						        this.device.devicePassword = password;
						      } else {
						        console.error('扫描结果格式不正确');
						        uni.showToast({
						          title: '扫描结果格式不正确',
						          icon: 'none'
						        });
						      }
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
		justify-content: space-around;
		align-items: center;
		height: 100vh;		
		.imagecontainer{
			display: flex;
			// justify-content: center;
			align-items: center;
			// padding: 50px;
			.device-pic{
				width: 300rpx;
				// padding-right: 50rpx;
			}
		}
		
		.input-modal {
			width: 500rpx;
			font-size: 14px;
			margin-bottom: 100rpx;
			.deviceSN{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.deviceSN-text{
				  border: 1px solid #bfbfbf; /* Add border */
				  border-radius: 5px;
				  padding: 1px;
				  margin-bottom: 20px;
				  height: 80rpx;
				  width: 350rpx;
				}
				.saoma{
					margin: 30rpx;
					.deviceScan{
					  width: 120rpx;
					  height: 120rpx;
					}
				}
				
			}
			.input-text{
				border: 1px solid #bfbfbf; /* Add border */
				border-radius: 5px;
				padding: 1px;
				margin-bottom: 20px;
				height: 80rpx;
			}
		}
		.btn{
			display: flex;
			flex-direction: row;
			margin-bottom: 50rpx;
			.button-ok{
				width: 200rpx;
				font-size: 14px;
				margin-bottom: 5px;	
				margin-right: 50rpx;
				border-radius: 30px;
				background-color: #FFE100;
				border-style: solid;
				border-width: 1px;
			}
			.button-cancel{
				width: 200rpx;
				font-size: 14px;
				margin-bottom: 5px;		
				border-radius: 30px;
				background-color: lightgray;
				border-style: solid;
				border-width: 1px;
			}
		}
	}
</style>
