"use strict";const e=require("../../common/vendor.js"),a={data:()=>({userInfo:{avatarUrl:getApp().globalData.userAvater||"/static/pic/defaultAvatar.png",userName:getApp().globalData.username},tempUrl:""}),methods:{userLogout(){e.index.navigateTo({url:"/pages/login/login"})},onChooseavatar(e){let{avatarUrl:a}=e.detail;this.tempUrl=a,console.log("userInfo:",e)},changeName(e){this.userInfo.userName=e.target.value},bindblur(e){this.userInfo.userName=e.target.value},save(){getApp().globalData.userAvater=this.userInfo.avatarUrl,getApp().globalData.username=this.userInfo.userName,e.index.$emit("saveUserInfo",this.userInfo),console.log("save user WxOpenId is:",getApp().globalData.WxOpenId),""!=this.tempUrl&&(console.log("url 不为空"),e.index.getFileSystemManager().getFileInfo({filePath:this.tempUrl,success:a=>{if(a.size>1048576)return e.index.showToast({icon:"none",title:"图片不能超过1M"});e.index.getFileSystemManager().readFile({filePath:this.tempUrl,encoding:"base64",success:a=>{let t="data:image/jpg;base64,"+a.data;console.log("读取头像文件",a),e.Ws.callFunction({name:"upLoadAvatarImg",data:{imageBase64:t,WxOpenId:getApp().globalData.WxOpenId}}).then((e=>{0==e.result.code?(this.userInfo.avatarUrl=e.result.msg,console.log("上传成功",e.result)):console.log("上传失败",e.result.msg)}))}})}})),e.Ws.callFunction({name:"saveUserInfo",data:{WxOpenId:getApp().globalData.WxOpenId,username:getApp().globalData.username,userAvater:getApp().globalData.userAvater}}).then((e=>{console.log("saveUserInfo log，",e.result.msg),0!=e.result.code&&console.log("saveUserInfo Fail，",e.result.msg)})),e.index.navigateTo({url:"/pages/homepage/homepage"})},cancel(){this.userInfo.avatarUrl=getApp().globalData.userAvater,this.userInfo.userName=getApp().globalData.username,e.index.navigateTo({url:"/pages/homepage/homepage"})}}};const t=e._export_sfc(a,[["render",function(a,t,s,o,r,l){return{a:r.userInfo.avatarUrl,b:e.o(((...e)=>l.onChooseavatar&&l.onChooseavatar(...e))),c:r.userInfo.userName,d:e.o(((...e)=>l.bindblur&&l.bindblur(...e))),e:e.o(((...e)=>l.changeName&&l.changeName(...e))),f:e.o(((...e)=>l.save&&l.save(...e))),g:e.o(((...e)=>l.cancel&&l.cancel(...e))),h:e.o(((...e)=>l.userLogout&&l.userLogout(...e)))}}]]);wx.createPage(t);