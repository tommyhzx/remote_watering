"use strict";
const common_vendor = require("../../common/vendor.js");
const InputModal = () => "../../components/CustomModal/InputModal.js";
const DeviceCard = () => "../../components/CustomModal/DeviceCard.js";
const _sfc_main = {
  components: {
    InputModal,
    DeviceCard
  },
  data() {
    return {
      modalVisible: false,
      deviceSN: []
    };
  },
  methods: {
    addDevice() {
      this.modalVisible = true;
    },
    onConfirm(deviceId) {
      this.modalVisible = false;
      if (this.deviceSN.includes(deviceId)) {
        common_vendor.index.showToast({
          title: "设备已存在"
        });
      } else {
        this.deviceSN.push(deviceId);
      }
      console.log("当前设备SN", this.deviceSN);
    },
    onCancel() {
      this.modalVisible = false;
    }
  }
};
if (!Array) {
  const _component_DeviceCard = common_vendor.resolveComponent("DeviceCard");
  const _component_InputModal = common_vendor.resolveComponent("InputModal");
  (_component_DeviceCard + _component_InputModal)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.addDevice && $options.addDevice(...args)),
    b: common_vendor.o($options.onConfirm),
    c: common_vendor.o($options.onCancel),
    d: common_vendor.p({
      visible: $data.modalVisible
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/homepage/homepage.vue"]]);
wx.createPage(MiniProgramPage);
