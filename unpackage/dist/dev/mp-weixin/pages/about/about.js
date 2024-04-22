"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        avatarUrl: getApp().globalData.userAvater || "/static/pic/defaultAvatar.png",
        userName: getApp().globalData.username
      },
      tempUrl: ""
    };
  },
  methods: {
    userLogout() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    onChooseavatar(e) {
      let {
        avatarUrl
      } = e.detail;
      this.tempUrl = avatarUrl;
      this.userInfo.avatarUrl = avatarUrl;
      console.log("userInfo:", avatarUrl);
    },
    changeName(event) {
      this.userInfo.userName = event.target.value;
    },
    bindblur(event) {
      this.userInfo.userName = event.target.value;
    },
    async save() {
      if (this.userInfo.avatarUrl != "") {
        common_vendor.index.getFileSystemManager().getFileInfo({
          filePath: this.userInfo.avatarUrl,
          success: (res) => {
            if (res.size > 1024 * 1024) {
              return common_vendor.index.showToast({
                icon: "none",
                title: "图片不能超过1M"
              });
            }
            console.log("获取上传图像信息成功", res);
            return;
          }
        });
        common_vendor.index.getFileSystemManager().readFile({
          filePath: this.userInfo.avatarUrl,
          encoding: "base64",
          success: (res) => {
            let imageBase64 = "data:image/jpg;base64," + res.data;
            console.log("读取头像文件", res);
            common_vendor.Ws.callFunction({
              name: "upLoadAvatarImg",
              data: {
                imageBase64,
                WxOpenId: getApp().globalData.WxOpenId
              }
            }).then((result) => {
              if (result.result.code == 0) {
                this.userInfo.avatarUrl = result.result.msg;
                console.log("上传成功", result.result);
                getApp().globalData.userAvater = this.userInfo.avatarUrl;
                console.log("保存头像路径为", getApp().globalData.userAvater);
                getApp().globalData.username = this.userInfo.userName;
                common_vendor.index.$emit("saveUserInfo", this.userInfo);
                common_vendor.Ws.callFunction({
                  name: "saveUserInfo",
                  data: {
                    WxOpenId: getApp().globalData.WxOpenId,
                    username: getApp().globalData.username,
                    userAvater: getApp().globalData.userAvater
                  }
                }).then((res2) => {
                  console.log("saveUserInfo log：", res2.result.msg);
                  if (res2.result.code != 0) {
                    console.log("saveUserInfo Fail，", res2.result.msg);
                  }
                });
                common_vendor.index.navigateBack({
                  url: "/pages/homepage/homepage"
                });
              } else {
                console.log("上传失败", result);
                common_vendor.index.showToast({
                  icon: "none",
                  title: "上传失败"
                });
              }
            });
          }
        });
      }
    },
    cancel() {
      this.userInfo.avatarUrl = getApp().globalData.userAvater;
      this.userInfo.userName = getApp().globalData.username;
      common_vendor.index.navigateBack({
        url: "/pages/homepage/homepage"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatarUrl,
    b: common_vendor.o((...args) => $options.onChooseavatar && $options.onChooseavatar(...args)),
    c: $data.userInfo.userName,
    d: common_vendor.o((...args) => $options.bindblur && $options.bindblur(...args)),
    e: common_vendor.o((...args) => $options.changeName && $options.changeName(...args)),
    f: common_vendor.o((...args) => $options.save && $options.save(...args)),
    g: common_vendor.o((...args) => $options.cancel && $options.cancel(...args)),
    h: common_vendor.o((...args) => $options.userLogout && $options.userLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/about/about.vue"]]);
wx.createPage(MiniProgramPage);
