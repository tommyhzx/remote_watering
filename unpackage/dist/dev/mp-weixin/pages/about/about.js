"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "../../static/pic/defaultAvatar.png"
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
      this.avatarUrl = avatarUrl;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl,
    b: common_vendor.o((...args) => $options.onChooseavatar && $options.onChooseavatar(...args)),
    c: _ctx.userName,
    d: common_vendor.o((...args) => _ctx.bindblur && _ctx.bindblur(...args)),
    e: common_vendor.o((...args) => _ctx.bindinput && _ctx.bindinput(...args)),
    f: common_vendor.o((...args) => $options.userLogout && $options.userLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/about/about.vue"]]);
wx.createPage(MiniProgramPage);
