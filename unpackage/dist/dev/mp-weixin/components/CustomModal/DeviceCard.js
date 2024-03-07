"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  props: {
    device: {
      deviceSN: String,
      deviceName: String,
      devicePlace: String
    }
  },
  methods: {
    onWaterring(device) {
      console.log("test", device);
    },
    deleteDevice() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.device.deviceName),
    b: common_vendor.t($props.device.devicePlace),
    c: common_vendor.o(($event) => $options.onWaterring($props.device))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/components/CustomModal/DeviceCard.vue"]]);
wx.createComponent(Component);
