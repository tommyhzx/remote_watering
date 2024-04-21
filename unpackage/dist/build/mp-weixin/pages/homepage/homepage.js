"use strict";const e=require("../../common/vendor.js"),a={components:{InputModal:()=>"../../components/CustomModal/InputModal.js",DeviceCard:()=>"../../components/CustomModal/DeviceCard.js"},props:{},data:()=>({deviceSN:[],devices:[],showAddDeviceBtn:!0,avatarUrl:getApp().globalData.userAvater||"/static/pic/defaultAvatar.png",userName:getApp().globalData.username}),computed:{showAddDeviceBtn(){return 0===this.devices.length}},onReady(){},onLoad(a){e.index.$on("LoginID",(a=>{e.Ws.callFunction({name:"getUserDevices",data:{deviceUser:a}}).then((e=>{0==e.result.code&&(console.log("查询用户设备为：",e),this.devices=e.result.data)}))})),e.index.$on("addDevice",(a=>{if(this.deviceSN.includes(a.deviceSN))e.index.showToast({title:"设备已存在"});else{const o={deviceSN:a.deviceSN,deviceName:a.deviceName,devicePlace:a.devicePlace,deviceUser:getApp().globalData.WxOpenId};e.Ws.callFunction({name:"creatDevice",data:{device:o}}).then((o=>{0==o.result.code?(this.devices.push({deviceSN:a.deviceSN,deviceName:a.deviceName,devicePlace:a.devicePlace}),this.deviceSN.push(a.deviceSN)):(console.log("creatDevice Fail，",o.result.msg),e.index.showToast({title:o.result.msg}))}))}})),e.index.$on("deleteDevice",(e=>{console.log("删除设备列表",e);const a=e,o=this.devices.filter((e=>e.deviceSN!==a));this.devices=o,console.log("设备列表",this.devices)})),e.index.$on("saveUserInfo",(e=>{this.avatarUrl=e.avatarUrl,this.userName=getApp().globalData.username}))},onShow(){e.index.hideHomeButton()},onUnload(){e.index.$off("addDevice")},methods:{addDevice(){e.index.navigateTo({url:"/pages/addDevice/addDevice"})},gotoAbout(){e.index.navigateTo({url:"/pages/about/about"})},test(){console.log("tiaozhuan"),e.index.navigateToMiniProgram({appId:"wxc8125e5b4219faab",path:"pages/ap/ap",envVersion:"release",success(e){console.log("跳转成功",e)},fail(e){console.error("跳转失败",e)}})}}};if(!Array){e.resolveComponent("DeviceCard")()}const o=e._export_sfc(a,[["render",function(a,o,t,i,d,c){return e.e({a:e.o(((...e)=>c.addDevice&&c.addDevice(...e))),b:e.t(d.userName),c:d.avatarUrl,d:e.o(((...e)=>c.gotoAbout&&c.gotoAbout(...e))),e:e.f(d.devices,((a,o,t)=>({a:"27eb7476-0-"+t,b:e.p({device:a}),c:o}))),f:c.showAddDeviceBtn},c.showAddDeviceBtn?{g:e.o(((...e)=>c.addDevice&&c.addDevice(...e)))}:{},{h:e.o(((...e)=>c.test&&c.test(...e)))})}]]);wx.createPage(o);
