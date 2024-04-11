"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      WxOpenId: ""
    };
  },
  methods: {
    async userLogin() {
      try {
        const code = await this.getWxCode();
        const openID = await this.getWxOpneId(code);
        const userExists = await this.checkUser(openID);
        if (!userExists) {
          await this.createUser(openID);
        }
        common_vendor.index.reLaunch({
          url: "/pages/homepage/homepage",
          success() {
            common_vendor.index.$emit("LoginID", openID);
            console.log("登录信息");
          }
        });
      } catch (error) {
        console.error("登录失败：", error);
        common_vendor.index.showToast({
          title: "登录异常，请重试",
          image: "/static/logo.png"
        });
      }
    },
    //获取微信code，同时获取OpenID
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
      const res = await common_vendor.index.request({
        url: "https://api.weixin.qq.com/sns/jscode2session",
        method: "GET",
        data: {
          appid: "wx5d6f4dcf7b16e780",
          secret: "3accced62f38bf7fc1f2036484a578ae",
          js_code: code,
          grant_type: "authorization_code"
        }
      });
      if (!res.data.openid) {
        throw new Error("获取用户 OpenID 失败");
      }
      console.log("用户的 OpenID：", res.data.openid);
      return res.data.openid;
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
    },
    test() {
      console.log("test", this.WxOpenId);
    }
  },
  onLoad() {
    console.log("onLoad");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.userLogin && $options.userLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
