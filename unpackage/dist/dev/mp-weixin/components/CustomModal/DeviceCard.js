"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      warteringimageSrc: "../../static/deviceCard/startwartering.png",
      connectStatusScr: "../../static/deviceCard/wifi_disconnect.png",
      connectStatus: "离线",
      deviceUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/device.png",
      deletePicUrl: "https://mp-0c7f093e-1151-46a0-9859-1d831d548ad6.cdn.bspapp.com/delte-pic.png",
      buttonEnabled: true
      // 添加一个变量来控制按钮的可用性
    };
  },
  props: {
    device: {
      deviceSN: String,
      deviceName: String,
      devicePlace: String
    }
  },
  mounted() {
    this.getDeviceConnectionStatus();
    console.log("mounted");
    setInterval(() => {
      this.getDeviceConnectionStatus();
    }, 5e3);
  },
  methods: {
    onWaterring(device) {
      this.sendTcpMessage(device, "on");
      this.warteringimageSrc = "../../static/deviceCard/stopwartering.png";
      this.buttonEnabled = false;
    },
    stopWaterring(device) {
      setTimeout(() => {
        this.sendTcpMessage(device, "off");
        this.warteringimageSrc = "../../static/deviceCard/startwartering.png";
        this.buttonEnabled = true;
      }, 1e3);
    },
    sendTcpMessage(device, action) {
      common_vendor.index.request({
        url: "https://apis.bemfa.com/va/postmsg",
        //api接口，详见接入文档
        method: "POST",
        data: {
          //请求字段，详见巴法云接入文档，http接口
          uid: "c2421290f7d14fa38251e5f77aac931a",
          topic: this.device.deviceSN,
          type: 3,
          msg: action
          //发送消息为on的消息
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          console.log("发送成功：", action);
        }
      });
    },
    deleteDevice() {
      console.log("delete", this.device);
      const device = this.device;
      common_vendor.index.showModal({
        title: "删除设备",
        content: "是否确认要删除该设备？",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定", device);
            common_vendor.Ws.callFunction({
              name: "deleteDevice",
              data: {
                device
              }
            }).then((res2) => {
              if (res2.result.code != 0) {
                console.log("deleteDevice Fail，", res2.result.msg);
              } else {
                common_vendor.index.$emit("deleteDevice", device.deviceSN);
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    // 定义获取设备连接状态的方法
    async getDeviceConnectionStatus() {
      try {
        common_vendor.index.request({
          url: "https://apis.bemfa.com/va/online",
          //api接口，详见接入文档
          method: "GET",
          data: {
            //请求字段，详见巴法云接入文档，http接口
            uid: "c2421290f7d14fa38251e5f77aac931a",
            topic: this.device.deviceSN,
            type: 3
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: (res) => {
            if (res.data.code == 0) {
              if (res.data.data == true) {
                this.connectStatusScr = "../../static/deviceCard/connect.png";
                this.connectStatus = "在线";
              } else {
                this.connectStatusScr = "../../static/deviceCard/wifi_disconnect.png";
                this.connectStatus = "离线";
              }
            }
          }
        });
      } catch (error) {
        console.error("获取设备连接状态失败：", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.deviceUrl,
    b: common_vendor.t($props.device.deviceSN),
    c: common_vendor.t($props.device.deviceName),
    d: common_vendor.t($props.device.devicePlace),
    e: $data.connectStatusScr,
    f: common_vendor.t($data.connectStatus),
    g: $data.warteringimageSrc,
    h: common_vendor.o(($event) => $options.onWaterring($props.device)),
    i: common_vendor.o(($event) => $options.stopWaterring($props.device)),
    j: !$data.buttonEnabled,
    k: common_vendor.n($data.buttonEnabled == true ? "" : "img_notClick"),
    l: $data.deletePicUrl,
    m: common_vendor.o((...args) => $options.deleteDevice && $options.deleteDevice(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/components/CustomModal/DeviceCard.vue"]]);
wx.createComponent(Component);
