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
      deviceSN: [],
      defaultDevice: {
        deviceSN: "",
        deviceName: "默认设备",
        devicePlace: "设备位置"
      },
      devices: []
    };
  },
  methods: {
    addDevice() {
      this.modalVisible = true;
    },
    onConfirm(device) {
      this.modalVisible = false;
      if (device == "") {
        common_vendor.index.showToast({
          title: "设备号不能为空"
        });
        return;
      }
      if (this.deviceSN.includes(device)) {
        common_vendor.index.showToast({
          title: "设备已存在"
        });
      } else {
        this.devices.push({
          deviceSN: device.deviceSN,
          deviceName: device.deviceName,
          devicePlace: device.devicePlace
        });
      }
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
    a: common_vendor.f($data.devices, (device, index, i0) => {
      return {
        a: "27eb7476-0-" + i0,
        b: common_vendor.p({
          device
        }),
        c: index
      };
    }),
    b: common_vendor.o((...args) => $options.addDevice && $options.addDevice(...args)),
    c: common_vendor.o($options.onConfirm),
    d: common_vendor.o($options.onCancel),
    e: common_vendor.p({
      visible: $data.modalVisible
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/homepage/homepage.vue"]]);
wx.createPage(MiniProgramPage);
