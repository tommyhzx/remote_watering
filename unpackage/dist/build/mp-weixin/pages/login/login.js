"use strict";const e=require("../../common/vendor.js"),o={data:()=>({logoUrl:"https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/yumiLogo.png",backGroundUrl:"https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/background.png"}),methods:{async userLogin(){try{e.index.showLoading({title:"正在登录中"});const a=await this.getWxCode(),n=await this.getWxOpneId(a);if(-1==n)return void e.index.showToast({title:"获取openid失败"+JSON.stringify(n),image:""});await this.checkUser(n)||await this.createUser(n);try{const o=await e.Ws.callFunction({name:"getUserInfo",data:{WxOpenId:n}});console.log("获取用户信息：",o.result.data);const a=o.result.data;getApp().globalData.WxOpenId=n,getApp().globalData.username=a.username,getApp().globalData.userAvater=a.userAvater,getApp().globalData.userTel=a.userTel}catch(o){e.index.hideLoading(),console.error("获取用户信息失败：",o),e.index.showToast({title:"获取用户信息失败"+JSON.stringify(o),image:""})}e.index.hideLoading(),e.index.reLaunch({url:"/pages/homepage/homepage",success(){e.index.$emit("LoginID",n),console.log("登录信息")}})}catch(a){console.error("userLogin() fail：",a),e.index.showToast({title:"登录异常，请重试"+JSON.stringify(a),image:""})}},async getWxCode(){const o=await e.index.login({provider:"weixin"});if(o.code)return console.log("用户code：",o.code),o.code;throw console.log("登录失败！"+o.errMsg),new Error("获取用户 code 失败")},async getWxOpneId(o){console.log("getWxOpneId，code is",o);const a=await e.Ws.callFunction({name:"getWxOpenId",data:{code:o}});return 0==a.result.code?(console.log("用户的 OpenID：",a.result.data.openId),a.result.data.openId):(console.log("获取openid失败,",a),-1)},checkUser:async o=>0!=(await e.Ws.callFunction({name:"checkUserById",data:{WxOpenId:o}})).result.code,async createUser(o){const a=await e.Ws.callFunction({name:"createUser",data:{WxOpenId:o}});if(0!==a.result.code)throw new Error("用户添加失败");console.log("数据库添加用户成功 res=",a)},userProfile(){e.index.getUserProfile({provider:"weixin",desc:"用于登录",success:o=>{console.log("登录成功，code:",o.rawData),console.log("userinfo:",o.userInfo),e.index.reLaunch({url:"/pages/homepage/homepage"})},fail:e=>{console.log("登录失败，code:",e)}})}},onLoad(){}};const a=e._export_sfc(o,[["render",function(o,a,n,t,s,r){return{a:s.logoUrl,b:s.backGroundUrl,c:e.o(((...e)=>r.userLogin&&r.userLogin(...e)))}}]]);wx.createPage(a);
