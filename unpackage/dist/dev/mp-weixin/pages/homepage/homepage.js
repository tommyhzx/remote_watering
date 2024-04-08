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
      devices: [],
      showAddDeviceBtn: true,
      // 若swiper没有设备，则添加一个按钮
      User: ""
    };
  },
  computed: {
    showAddDeviceBtn() {
      return this.devices.length === 0;
    }
  },
  onReady() {
  },
  onLoad(option) {
    common_vendor.index.$on("formConfirm", (deviceData) => {
      console.log("监听到事件来自 update ，携带参数 msg 为：" + deviceData.deviceSN);
      if (this.deviceSN.includes(deviceData.deviceSN)) {
        common_vendor.index.showToast({
          title: "设备已存在"
        });
      } else {
        this.devices.push({
          deviceSN: deviceData.deviceSN,
          deviceName: deviceData.deviceName,
          devicePlace: deviceData.devicePlace
        });
        this.deviceSN.push(deviceData.deviceSN);
      }
      const device = {
        deviceSN: deviceData.deviceSN,
        deviceName: deviceData.deviceName,
        devicePlace: deviceData.devicePlace,
        deviceUser: this.User
      };
      common_vendor.Ws.callFunction({
        name: "creatDevice",
        data: {
          device
        }
      }).then((res) => {
        if (res.result.code != 0) {
          console.log("creatDevice Fail，", res.result.msg);
        }
      });
    });
    common_vendor.index.$on("LoginID", (deviceData) => {
      console.log("监听到事件来自 update ，LoginID 为：" + deviceData);
      this.User = deviceData;
      common_vendor.Ws.callFunction({
        name: "getUserDevices",
        data: {
          deviceUser: deviceData
        }
      }).then((res) => {
        if (res.result.code == 0) {
          console.log("查询用户设备为：", res);
          this.devices = res.result.data;
        }
      });
    });
  },
  onUnload() {
    common_vendor.index.$off("formConfirm");
  },
  methods: {
    addDevice() {
      common_vendor.index.navigateTo({
        url: "/pages/addDevice/addDevice"
        // 跳转到添加设备页
      });
    }
  }
};
if (!Array) {
  const _component_DeviceCard = common_vendor.resolveComponent("DeviceCard");
  _component_DeviceCard();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.addDevice && $options.addDevice(...args)),
    b: common_vendor.f($data.devices, (device, index, i0) => {
      return {
        a: "27eb7476-0-" + i0,
        b: common_vendor.p({
          device
        }),
        c: index
      };
    }),
    c: $options.showAddDeviceBtn
  }, $options.showAddDeviceBtn ? {
    d: common_vendor.o((...args) => $options.addDevice && $options.addDevice(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/homepage/homepage.vue"]]);
wx.createPage(MiniProgramPage);
