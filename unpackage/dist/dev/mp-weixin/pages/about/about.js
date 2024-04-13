"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        avatarUrl: getApp().globalData.userAvater || "/static/pic/defaultAvatar.png",
        userName: getApp().globalData.username
      }
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
      this.userInfo.avatarUrl = avatarUrl;
    },
    changeName(event) {
      this.userInfo.userName = event.target.value;
    },
    bindblur(event) {
      this.userInfo.userName = event.target.value;
    },
    save() {
      getApp().globalData.userAvater = this.userInfo.avatarUrl;
      getApp().globalData.username = this.userInfo.userName;
      common_vendor.index.$emit("saveUserInfo", this.userInfo);
      console.log("WxOpenId:", getApp().globalData.WxOpenId);
      common_vendor.Ws.callFunction({
        name: "saveUserInfo",
        data: {
          WxOpenId: getApp().globalData.WxOpenId,
          username: getApp().globalData.username,
          userAvater: getApp().globalData.userAvater
        }
      }).then((res) => {
        console.log("saveUserInfo log，", res.result.msg);
        if (res.result.code != 0) {
          console.log("saveUserInfo Fail，", res.result.msg);
        }
      });
      common_vendor.index.navigateTo({
        url: "/pages/homepage/homepage"
      });
    },
    cancel() {
      this.userInfo.avatarUrl = getApp().globalData.userAvater;
      this.userInfo.userName = getApp().globalData.username;
      common_vendor.index.navigateTo({
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
