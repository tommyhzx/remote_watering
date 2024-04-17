"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      modalVisible: true,
      device: {
        deviceSN: "",
        // 输入的设备ID
        deviceName: "",
        devicePlace: ""
      }
    };
  },
  methods: {
    confirm() {
      const deviceData = this.device;
      if (deviceData.deviceSN == "" | deviceData.deviceName == "" | deviceData.devicePlace == "") {
        common_vendor.index.showToast({
          title: "请填写设备信息"
        });
        return;
      }
      common_vendor.index.$emit("addDevice", deviceData);
      common_vendor.index.navigateBack({
        delta: 1
        // 返回上一级页面
      });
    },
    cancel() {
      common_vendor.index.navigateBack({
        delta: 1
        // 返回上一级页面
      });
    },
    scanQRcode() {
      common_vendor.index.scanCode({
        success: (res) => {
          this.device.deviceSN = res.result;
        },
        fail: (err) => {
          console.error(err);
          common_vendor.index.showToast({
            title: "扫描失败，请重试",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.device.deviceSN,
    b: common_vendor.o(($event) => $data.device.deviceSN = $event.detail.value),
    c: common_vendor.o((...args) => $options.scanQRcode && $options.scanQRcode(...args)),
    d: $data.device.deviceName,
    e: common_vendor.o(($event) => $data.device.deviceName = $event.detail.value),
    f: $data.device.devicePlace,
    g: common_vendor.o(($event) => $data.device.devicePlace = $event.detail.value),
    h: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    i: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/addDevice/addDevice.vue"]]);
wx.createPage(MiniProgramPage);
