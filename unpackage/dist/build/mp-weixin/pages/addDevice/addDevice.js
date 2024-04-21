"use strict";const e=require("../../common/vendor.js"),c={data:()=>({modalVisible:!0,device:{deviceSN:"",deviceName:"",devicePlace:"",devicePassword:""}}),methods:{confirm(){const c=this.device;""==c.deviceSN|""==c.deviceName|""==c.devicePlace?e.index.showToast({title:"请填写设备信息"}):e.Ws.callFunction({name:"checkDevicePassword",data:{deviceSN:this.device.deviceSN,devicePassword:this.device.devicePassword}}).then((i=>{0==i.result.code?(console.log("checkDevicePassword成功",i.result),e.index.$emit("addDevice",c),e.index.navigateBack({delta:1})):(e.index.showToast({title:i.result.msg,icon:"none"}),console.log("checkDevicePassword失败",i.result.msg))}))},cancel(){e.index.navigateBack({delta:1})},scanQRcode(){e.index.scanCode({success:c=>{let i=c.result.split("-");if(i.length>=2){let e=i[0],c=i[1];this.device.deviceSN=e,this.device.devicePassword=c}else console.error("扫描结果格式不正确"),e.index.showToast({title:"扫描结果格式不正确",icon:"none"})},fail:c=>{console.error(c),e.index.showToast({title:"扫描失败，请重试",icon:"none"})}})}}};const i=e._export_sfc(c,[["render",function(c,i,d,o,s,a){return{a:s.device.deviceSN,b:e.o((e=>s.device.deviceSN=e.detail.value)),c:s.device.devicePassword,d:e.o((e=>s.device.devicePassword=e.detail.value)),e:e.o(((...e)=>a.scanQRcode&&a.scanQRcode(...e))),f:s.device.deviceName,g:e.o((e=>s.device.deviceName=e.detail.value)),h:s.device.devicePlace,i:e.o((e=>s.device.devicePlace=e.detail.value)),j:e.o(((...e)=>a.confirm&&a.confirm(...e))),k:e.o(((...e)=>a.cancel&&a.cancel(...e)))}}]]);wx.createPage(i);
