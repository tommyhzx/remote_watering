"use strict";
const common_vendor = require("../../common/vendor.js");
const InputModal = () => "../../components/CustomModal/InputModal.js";
const DeviceCard = () => "../../components/CustomModal/DeviceCard.js";
const _sfc_main = {
  components: {
    InputModal,
    DeviceCard
  },
  props: {},
  data() {
    return {
      //当前页面已经添加设备的SN码
      deviceSN: [],
      //当前页面已添加设备的信息
      devices: [],
      showAddDeviceBtn: true,
      // 若swiper没有设备，则添加一个按钮
      avatarUrl: getApp().globalData.userAvater || "/static/pic/defaultAvatar.png",
      // 存储用户头像地址
      userName: getApp().globalData.username
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
    common_vendor.index.$on("LoginID", (deviceData) => {
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
    common_vendor.index.$on("addDevice", (deviceData) => {
      if (this.deviceSN.includes(deviceData.deviceSN)) {
        common_vendor.index.showToast({
          title: "设备已存在"
        });
      } else {
        const device = {
          deviceSN: deviceData.deviceSN,
          deviceName: deviceData.deviceName,
          devicePlace: deviceData.devicePlace,
          deviceUser: getApp().globalData.WxOpenId
        };
        common_vendor.Ws.callFunction({
          name: "creatDevice",
          data: {
            device
          }
        }).then((res) => {
          if (res.result.code == 0) {
            this.devices.push({
              deviceSN: deviceData.deviceSN,
              deviceName: deviceData.deviceName,
              devicePlace: deviceData.devicePlace
            });
            this.deviceSN.push(deviceData.deviceSN);
          } else {
            console.log("creatDevice Fail，", res.result.msg);
            common_vendor.index.showToast({
              title: res.result.msg
            });
          }
        });
      }
    });
    common_vendor.index.$on("deleteDevice", (deviceSN) => {
      console.log("删除设备列表", deviceSN);
      const deleteDeviceSN = deviceSN;
      const filteredDevices = this.devices.filter((device) => device.deviceSN !== deleteDeviceSN);
      this.devices = filteredDevices;
      console.log("设备列表", this.devices);
    });
    common_vendor.index.$on("saveUserInfo", (userData) => {
      this.avatarUrl = userData.avatarUrl;
      this.userName = getApp().globalData.username;
    });
  },
  onShow() {
    common_vendor.index.hideHomeButton();
  },
  onUnload() {
    common_vendor.index.$off("addDevice");
  },
  methods: {
    addDevice() {
      common_vendor.index.navigateTo({
        url: "/pages/addDevice/addDevice"
        // 跳转到添加设备页
      });
    },
    gotoAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/about/about"
        // 跳转到个人主页
      });
    },
    test() {
      console.log("tiaozhuan");
      common_vendor.index.navigateToMiniProgram({
        appId: "wxc8125e5b4219faab",
        path: "pages/ap/ap",
        envVersion: "release",
        success(res) {
          console.log("跳转成功", res);
        },
        fail(err) {
          console.error("跳转失败", err);
        }
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
    b: common_vendor.t($data.userName),
    c: $data.avatarUrl,
    d: common_vendor.o((...args) => $options.gotoAbout && $options.gotoAbout(...args)),
    e: common_vendor.f($data.devices, (device, index, i0) => {
      return {
        a: "27eb7476-0-" + i0,
        b: common_vendor.p({
          device
        }),
        c: index
      };
    }),
    f: $options.showAddDeviceBtn
  }, $options.showAddDeviceBtn ? {
    g: common_vendor.o((...args) => $options.addDevice && $options.addDevice(...args))
  } : {}, {
    h: common_vendor.o((...args) => $options.test && $options.test(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/pages/homepage/homepage.vue"]]);
wx.createPage(MiniProgramPage);
