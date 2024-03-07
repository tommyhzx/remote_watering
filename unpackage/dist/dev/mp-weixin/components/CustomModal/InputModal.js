"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      device: {
        deviceSN: "",
        // 输入的设备ID
        deviceName: "",
        devicePlace: ""
      }
    };
  },
  props: {
    visible: ""
  },
  methods: {
    confirm() {
      const device = {
        deviceSN: this.device.deviceSN,
        deviceName: this.device.deviceName,
        devicePlace: this.device.devicePlace
      };
      this.$emit("confirm", device);
      this.device.deviceSN = "";
      this.device.deviceName = "";
      this.device.devicePlace = "";
    },
    cancel() {
      this.$emit("cancel");
      this.device.deviceSN = "";
      this.device.deviceName = "";
      this.device.devicePlace = "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.visible
  }, $props.visible ? {
    b: $data.device.deviceSN,
    c: common_vendor.o(($event) => $data.device.deviceSN = $event.detail.value),
    d: $data.device.deviceName,
    e: common_vendor.o(($event) => $data.device.deviceName = $event.detail.value),
    f: $data.device.devicePlace,
    g: common_vendor.o(($event) => $data.device.devicePlace = $event.detail.value),
    h: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    i: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/components/CustomModal/InputModal.vue"]]);
wx.createComponent(Component);
