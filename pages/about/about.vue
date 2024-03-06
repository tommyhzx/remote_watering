<template>
	<view>
		<button @click="userLogout">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			userLogout(){
				uni.navigateTo({
				 	url:'/pages/login/login'
				 });
			}
		}
	}
</script>

<style lang="scss">

</style>
