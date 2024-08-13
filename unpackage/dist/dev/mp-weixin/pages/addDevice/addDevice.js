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
        devicePlace: "",
        devicePassword: ""
      },
      deviceUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/uniapp/device.png"
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
      common_vendor.Ws.callFunction({
        name: "checkDevicePassword",
        data: {
          deviceSN: this.device.deviceSN,
          devicePassword: this.device.devicePassword
        }
      }).then((res) => {
        if (res.result.code == 0) {
          console.log("checkDevicePassword成功", res.result);
          common_vendor.index.$emit("addDevice", deviceData);
          common_vendor.index.navigateBack({
            delta: 1
            // 返回上一级页面
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.msg,
            icon: "none"
          });
          console.log("checkDevicePassword失败", res.result.msg);
        }
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
          let scanResult = res.result;
          let scanArray = scanResult.split("-");
          if (scanArray.length >= 2) {
            let SNcode = scanArray[0];
            let password = scanArray[1];
            this.device.deviceSN = SNcode;
            this.device.devicePassword = password;
          } else {
            console.error("扫描结果格式不正确");
            common_vendor.index.showToast({
              title: "扫描结果格式不正确",
              icon: "none"
            });
          }
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
    a: $data.deviceUrl,
    b: $data.device.deviceSN,
    c: common_vendor.o(($event) => $data.device.deviceSN = $event.detail.value),
    d: $data.device.devicePassword,
    e: common_vendor.o(($event) => $data.device.devicePassword = $event.detail.value),
    f: common_vendor.o((...args) => $options.scanQRcode && $options.scanQRcode(...args)),
    g: $data.device.deviceName,
    h: common_vendor.o(($event) => $data.device.deviceName = $event.detail.value),
    i: $data.device.devicePlace,
    j: common_vendor.o(($event) => $data.device.devicePlace = $event.detail.value),
    k: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    l: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/addDevice/addDevice.vue"]]);
wx.createPage(MiniProgramPage);
