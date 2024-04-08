"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      WxOpenId: "Wx19990000"
    };
  },
  methods: {
    userLogin() {
      let result = 0;
      common_vendor.Ws.callFunction({
        name: "checkUserById",
        data: {
          WxOpenId: this.WxOpenId
        }
      }).then((res) => {
        if (res.result.code == 0) {
          console.log("用户不存在", res);
          result = this.addUser(this.WxOpenId);
        } else {
          console.log("用户已存在", res);
        }
        if (result == 0) {
          const WxOpenId = this.WxOpenId;
          common_vendor.index.reLaunch({
            url: "/pages/homepage/homepage",
            success() {
              common_vendor.index.$emit("LoginID", WxOpenId);
              console.log("登录信息");
            }
          });
        } else {
          common_vendor.index.showToast({
            title: "登录异常，请重试",
            image: "/static/logo.png"
          });
        }
      });
    },
    addUser(id) {
      common_vendor.Ws.callFunction({
        name: "createUser",
        data: {
          WxOpenId: this.WxOpenId
        }
      }).then((res) => {
        if (res.result.code == 0) {
          console.log("用户添加成功 res=", res);
          return 0;
        } else {
          console.log("用户添加失败 res=", res);
          return -1;
        }
      });
    },
    userProfile() {
      common_vendor.index.getUserProfile({
        provider: "weixin",
        desc: "用于登录",
        success: (res) => {
          console.log("登录成功，code:", res.rawData);
          console.log("userinfo:", res.userInfo);
          common_vendor.index.reLaunch({
            url: "/pages/homepage/homepage"
          });
        },
        fail: (res) => {
          console.log("登录失败，code:", res);
        }
      });
    },
    test() {
      console.log("test", this.WxOpenId);
    }
  },
  onLoad() {
    console.log("onLoad");
    common_vendor.index.login({
      "provider": "weixin",
      "onlyAuthorize": true,
      // 微信登录仅请求授权认证
      success: (res) => {
        if (res.code) {
          console.log("登录成功，code:", res.code);
          this.WxOpenId = "88888888";
        } else {
          console.log("登录失败：", err);
        }
      },
      fail: (res) => {
        console.log("login fail：", res);
      }
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.userLogin && $options.userLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
