<template>
    <div class="container">
        <uni-section class="step" title="操作步骤" type="line" padding>
            <uni-steps :options="list1" :active="step_active" />
        </uni-section>
        <uni-section class="scan-device" title="步骤1-扫描设备" type="line">
            <template v-slot:right>
                <button class="mini-btn, scan-btn" size="mini" @click="scanDevices">扫描设备</button>
            </template>
            <uni-collapse>
                <uni-collapse-item class="collapse-item" title="蓝牙设备">
                    <scroll-view class="device-list" scroll-y="true">
                        <uni-list>
                            <uni-list-item v-for="(device, index) in test_devices" :key="index" :title="device.name"
                                :note=device.deviceId thumb="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" thumb-size="sm" rightText="连接设备">
                                <template v-slot:footer>
                                    <button @click="connectDevice(device)">
                                        <image class="slot-image" :src="connect_icon" mode="widthFix"></image>
                                    </button>
                                </template>
                            </uni-list-item>
                        </uni-list>
                    </scroll-view>
                </uni-collapse-item>
            </uni-collapse>
        </uni-section>
        <!-- 调试 -->
        <!-- <scroll-view class="device-list" scroll-y="true">
            <div class="device-card" v-for="device in test_devices" :key="device.deviceId">
                <h3>{{ device.name }}</h3>
                <button @click="connectDevice(device)" class="connect-button">
                    <img class='img' :src="connect_icon" alt="Connect" />
                    <text>connect</text>
                </button>
            </div>
        </scroll-view> -->


        <div v-if="connectedDevice" class="connected-device">
            <h2>Connected Device: {{ connectedDevice.name }}</h2>
            <button @click="startPairing">Start Pairing</button>
            <button @click="sendHelloWorld">Send HelloWorld</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            step_active: 0,
            list1: [{
                title: '扫描设备'
            }, {
                title: '连接设备'
            }, {
                title: '蓝牙配网'
            }, {
                title: '完成'
            }],
            devices: [],
            connectedDevice: null,
            connect_icon: '../static/icon/connection.png',
            isScanning: false, // 添加这个变量
            // 构建一个测试device
            test_devices: [
                { deviceId: '123456', name: 'Test Device' },
                { deviceId: '654321', name: 'Test Device 2' },
                { deviceId: '111111', name: 'Test Device 3' },
                { deviceId: '222222', name: 'Test Device 4' },
                { deviceId: '333333', name: 'Test Device 5' },
                { deviceId: '444444', name: 'Test Device 6' },
                { deviceId: '555555', name: 'Test Device 7' },
                { deviceId: '666666', name: 'Test Device 8' },
                { deviceId: '777777', name: 'Test Device 9' },
                { deviceId: '888888', name: 'Test Device 10' },
            ],
        };
    },
    methods: {
        async scanDevices() {
            this.isScanning = true; // 开始扫描时设置为 true
            this.devices = []; // 每次扫描前清空设备列表
            try {
                console.log('Scanning for Bluetooth devices...');
                let res = await uni.openBluetoothAdapter();
                console.log('openBluetoothAdapter', res);
                await uni.startBluetoothDevicesDiscovery();

                uni.onBluetoothDeviceFound((res) => {
                    const devices = res.devices.map(device => ({
                        deviceId: device.deviceId,
                        name: device.name || device.localName || 'Unknown Device'
                    }));
                    this.devices = [...this.devices, ...devices];
                });
            } catch (error) {
                console.error('Error scanning for Bluetooth devices:', error);
            } finally {
                this.isScanning = false; // 扫描结束时设置为 false
            }
        },
        // 连接设备
        async connectDevice(device) {
            try {
                console.log(`Connecting to device ${device.name}...`);
                await uni.createBLEConnection({
                    deviceId: device.deviceId
                });
                console.log(`Connected to device ${device.name}`);
                this.connectedDevice = device;

                // 获取设备的服务
                const servicesRes = await uni.getBLEDeviceServices({
                    deviceId: device.deviceId
                });
                const service = servicesRes.services[0]; // 假设使用第一个服务
                this.serviceId = service.uuid;

                // 获取服务的特征
                const characteristicsRes = await uni.getBLEDeviceCharacteristics({
                    deviceId: device.deviceId,
                    serviceId: this.serviceId
                });
                const characteristic = characteristicsRes.characteristics[0]; // 假设使用第一个特征
                this.characteristicId = characteristic.uuid;
                console.log(`Service ID: ${this.serviceId}, Characteristic ID: ${this.characteristicId}`);
                // 连接成功后跳转到下一步
                this.step_active = 1
            } catch (error) {
                console.error(`Error connecting to device ${device.name}:`, error);
            }
        },
        startPairing() {
            // 开始蓝牙配对过程的代码
        },
        async sendHelloWorld() {
            if (!this.connectedDevice || !this.serviceId || !this.characteristicId) {
                console.error('No connected device or service/characteristic ID not found');
                return;
            }

            try {
                const buffer = new ArrayBuffer(10);
                const dataView = new DataView(buffer);
                const message = 'helloworld';
                for (let i = 0; i < message.length; i++) {
                    dataView.setUint8(i, message.charCodeAt(i));
                }

                await uni.writeBLECharacteristicValue({
                    deviceId: this.connectedDevice.deviceId,
                    serviceId: this.serviceId, // 替换为你的服务ID
                    characteristicId: this.characteristicId, // 替换为你的特征ID
                    value: buffer
                });

                console.log('Message sent: helloworld');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }
};
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;

    .step {
        width: 100%;
    }

    .scan-device {
        background-color: aquamarine;
        width: 100%;
        gap: 20px;

        .scan-btn {
            background-color: #FFE100;
            color: #000;
        }

        .slot-image {
            width: 40rpx;
            height: 40rpx;
        }

        .device-list {
            // display: flex;
            // flex-direction: column;
            // justify-content: center;
            // align-items: center;
            width: 100%;
            height: 50vh;

        }
    }

}

// .device-list {
//     display: flex;
//     flex-direction: column;
//     // justify-content: center;
//     // align-items: center;
//     // gap: 16px;
//     // margin-top: 20px;
//     padding: 20px;
//     width: 90%;
//     height: 50vh;
//     background-color: #218838;

//     .device-card {
//         display: flex;
//         flex-direction: row;
//         justify-content: space-between;
//         align-items: center;
//         background-color: #da3c3c;
//         border: 1px solid #ddd;
//         border-radius: 8px;
//         margin: 10px;
//         padding: 10px;
//         width: 90%;
//         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         text-align: center;

//         h3 {
//             margin: 0 0 10px;
//             flex-grow: 1;
//         }

//         .connect-button {
//             background: none;
//             border: none;
//             padding: 0;
//             cursor: pointer;

//             .img {
//                 width: 20px;
//                 height: 20px;
//             }
//         }
//     }
// }



// .connected-device {
//     margin-top: 20px;

//     h2 {
//         margin-bottom: 10px;
//     }

//     button {
//         background-color: #28a745;
//         color: white;
//         border: none;
//         padding: 10px 20px;
//         border-radius: 4px;
//         cursor: pointer;
//         margin-right: 10px;

//         &:hover {
//             background-color: #218838;
//         }
//     }
// }</style>