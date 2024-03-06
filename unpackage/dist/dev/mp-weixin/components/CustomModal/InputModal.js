"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      deviceId: ""
      // 输入的设备ID			
    };
  },
  props: {
    visible: ""
  },
  methods: {
    confirm() {
      const deviceId = this.deviceId;
      this.$emit("confirm", deviceId);
      this.deviceId = "";
    },
    cancel() {
      this.$emit("cancel");
      this.deviceId = "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.visible
  }, $props.visible ? {
    b: $data.deviceId,
    c: common_vendor.o(($event) => $data.deviceId = $event.detail.value),
    d: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    e: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/components/CustomModal/InputModal.vue"]]);
wx.createComponent(Component);
