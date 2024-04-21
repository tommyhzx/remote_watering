"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      warteringimageSrc: "../../static/deviceCard/startwartering.png",
      connectStatusScr: "../../static/deviceCard/wifi_disconnect.png",
      connectStatus: "离线"
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
    setInterval(() => {
      this.getDeviceConnectionStatus();
    }, 5e3);
  },
  methods: {
    onWaterring(device) {
      console.log("send tcp message", device);
      this.sendTcpMessage(device, "on");
      this.warteringimageSrc = "../../static/deviceCard/stopwartering.png";
    },
    stopWaterring(device) {
      this.sendTcpMessage(device, "off");
      this.warteringimageSrc = "../../static/deviceCard/startwartering.png";
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
          console.log("发送成功");
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
        console.log("获取设备连接状态", this.device.deviceSN);
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
            console.log("getDeviceConnectionStatus发送成功", res.data);
            if (res.data.code == 0) {
              if (res.data.data == true) {
                this.connectStatusScr = "../../static/deviceCard/connect.png";
                this.connectStatus = "z在线";
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
    a: common_vendor.t($props.device.deviceSN),
    b: common_vendor.t($props.device.deviceName),
    c: common_vendor.t($props.device.devicePlace),
    d: $data.connectStatusScr,
    e: common_vendor.t($data.connectStatus),
    f: $data.warteringimageSrc,
    g: common_vendor.o(($event) => $options.onWaterring($props.device)),
    h: common_vendor.o(($event) => $options.stopWaterring($props.device)),
    i: common_vendor.o((...args) => $options.deleteDevice && $options.deleteDevice(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/tommybei/software/code_project/uniapp_project/warteringCloud/components/CustomModal/DeviceCard.vue"]]);
wx.createComponent(Component);
