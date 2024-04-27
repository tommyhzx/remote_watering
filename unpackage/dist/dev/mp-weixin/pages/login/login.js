"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      logoUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/yumiLogo.png",
      backGroundUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/background.png"
    };
  },
  methods: {
    async userLogin() {
      try {
        common_vendor.index.showLoading({
          title: "正在登录中"
        });
        const code = await this.getWxCode();
        const openID = await this.getWxOpneId(code);
        if (openID == -1) {
          common_vendor.index.showToast({
            title: "获取openid失败" + JSON.stringify(openID),
            image: ""
          });
          return;
        }
        const userExists = await this.checkUser(openID);
        if (!userExists) {
          await this.createUser(openID);
        }
        try {
          const res = await common_vendor.Ws.callFunction({
            name: "getUserInfo",
            data: {
              WxOpenId: openID
            }
          });
          console.log("获取用户信息：", res.result.data);
          const userInfo = res.result.data;
          getApp().globalData.WxOpenId = openID;
          getApp().globalData.username = userInfo.username;
          getApp().globalData.userAvater = userInfo.userAvater;
          getApp().globalData.userTel = userInfo.userTel;
          getApp().globalData.userID = userInfo.userID;
        } catch (err) {
          common_vendor.index.hideLoading();
          console.error("获取用户信息失败：", err);
          common_vendor.index.showToast({
            title: "获取用户信息失败" + JSON.stringify(err),
            image: ""
          });
        }
        common_vendor.index.hideLoading();
        common_vendor.index.reLaunch({
          url: "/pages/homepage/homepage",
          success() {
            common_vendor.index.$emit("LoginID", openID);
            console.log("登录信息");
          }
        });
      } catch (error) {
        console.error("userLogin() fail：", error);
        common_vendor.index.showToast({
          title: "登录异常，请重试" + JSON.stringify(error),
          image: ""
        });
      }
    },
    //获取微信code
    async getWxCode() {
      const res = await common_vendor.index.login({
        provider: "weixin"
      });
      if (res.code) {
        console.log("用户code：", res.code);
        return res.code;
      } else {
        console.log("登录失败！" + res.errMsg);
        throw new Error("获取用户 code 失败");
      }
    },
    //获取微信用户OpenID
    async getWxOpneId(code) {
      console.log("getWxOpneId，code is", code);
      const res = await common_vendor.Ws.callFunction({
        name: "getWxOpenId",
        data: {
          code
        }
      });
      if (res.result.code == 0) {
        console.log("用户的 OpenID：", res.result.data.openId);
        return res.result.data.openId;
      } else {
        console.log("获取openid失败,", res);
        return -1;
      }
    },
    //查询数据库是否存在用户
    async checkUser(openid) {
      const res = await common_vendor.Ws.callFunction({
        name: "checkUserById",
        data: {
          WxOpenId: openid
        }
      });
      if (res.result.code == 0) {
        return false;
      } else {
        return true;
      }
    },
    //在数据库创建新用户
    async createUser(openid) {
      const res = await common_vendor.Ws.callFunction({
        name: "createUser",
        data: {
          WxOpenId: openid
        }
      });
      if (res.result.code !== 0) {
        throw new Error("用户添加失败");
      }
      console.log("数据库添加用户成功 res=", res);
    },
    //函数暂时无效
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
    }
  },
  onLoad() {
    const datatime = "ID" + Date.now();
    console.log("onLoad time:", datatime);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.logoUrl,
    b: $data.backGroundUrl,
    c: common_vendor.o((...args) => $options.userLogin && $options.userLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
