<template>
    <div class="container">
        <uni-section class="step" title="操作步骤" type="line" padding>
            <uni-steps :options="list1" :active="step_active" />
        </uni-section>

        <uni-section class="scan-device" title="步骤1-扫描设备" type="line">
            <template v-slot:right>
                <button class="mini-btn scan-btn" size="mini" @click="scanDevices">扫描设备</button>
            </template>
            <uni-collapse>
                <uni-collapse-item class="collapse-item" title="蓝牙设备" :open="isCollapseOpen">
                    <scroll-view class="device-list" scroll-y="true">
                        <uni-list>
                            <uni-list-item v-for="(device, index) in devices" :key="index" :title="device.name"
                                :note="device.deviceId"
                                thumb="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
                                thumb-size="sm" rightText="连接设备">
                                <template v-slot:footer>
                                    <button @click="connectDevice(device)">
                                        <image class="slot-image" :src="connect_icon" mode="widthFix"></image>
                                        <text>{{ device.RSSI }}</text>
                                    </button>
                                </template>
                            </uni-list-item>
                        </uni-list>
                    </scroll-view>
                </uni-collapse-item>
            </uni-collapse>
        </uni-section>

        <uni-section title="已连接设备" type="line" v-if="connectedDevice">
            <uni-card :title="connectedDevice.name" extra="状态：已连接">
                <text class="uni-body">MAC地址: {{ connectedDevice.deviceId }}</text>
            </uni-card>
        </uni-section>
        <uni-section title="配置设备连接WiFi的账号密码" type="line">
            <div v-if="connectedDevice" class="connected-device">
                <uni-forms :modelValue="WiFiFormData">
                    <uni-forms-item label="账号" required>
                        <uni-easyinput v-model="WiFiFormData.ssid" placeholder="请输入WiFi名" />
                    </uni-forms-item>
                    <uni-forms-item label="密码" required>
                        <uni-easyinput type="password" v-model="WiFiFormData.password"
                            placeholder="请输入密码"></uni-easyinput>
                    </uni-forms-item>
                </uni-forms>
                <button type="primary" :loading="configDevice" @click="startPairing">开始配网</button>
            </div>
        </uni-section>
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
            // 默认收起设备列表
            isCollapseOpen: false,
            // 配网过程中的状态
            configDevice: false,
            // wifi表单数据
            WiFiFormData: {
                ssid: '123',
                password: '123'
            },
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
            // 步骤1- 扫描设备->连接设备
            this.step_active = 1
            this.devices = []; // 每次扫描前清空设备列表
            try {
                console.log('Scanning for Bluetooth devices...');
                let res = await uni.openBluetoothAdapter();
                console.log('openBluetoothAdapter', res);
                await uni.startBluetoothDevicesDiscovery();

                uni.onBluetoothDeviceFound((res) => {
                    console.log('onBluetoothDeviceFound', res);
                    res.devices.forEach(device => {
                        // 获取设备的名字，如果没有名字则使用 localName 或者 Unknown Device
                        const deviceName = device.name || device.localName || 'Unknown Device';
                        // 过滤掉名字为 Unknown Device 的设备
                        if (deviceName !== 'Unknown Device') {
                            const existingDevice = this.devices.find(d => d.deviceId === device.deviceId);
                            if (!existingDevice) {
                                this.devices.push({
                                    deviceId: device.deviceId,
                                    name: deviceName
                                });
                            }
                        }
                    });
                });
                // 扫描出设备时，展开设备列表
                this.isCollapseOpen = true;
            } catch (error) {
                console.error('Error scanning for Bluetooth devices:', error);
            } finally {
                this.isScanning = false; // 扫描结束时设置为 false
            }
        },
        // 连接设备
        async connectDevice(device) {
            try {
                await uni.createBLEConnection({
                    deviceId: device.deviceId
                });
                this.connectedDevice = device;
                // 停止蓝牙设备扫描
                await uni.stopBluetoothDevicesDiscovery();
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
                this.step_active = 2
                // 连接完设备后，清空设备列表
                this.devices = [];
                // 连接完设备后，收起设备列表
                this.isCollapseOpen = false;
            } catch (error) {
                console.error(`Error connecting to device ${device.name}:`, error);
            }
        },
        // 开始配对
        async startPairing() {
            // 开始蓝牙配对过程的代码
            if (!this.connectedDevice || !this.serviceId || !this.characteristicId) {
                uni.showToast({
                    title: "蓝牙未连接，请先连接蓝牙设备",
                    icon: 'none', duration: 2000
                });
                return;
            }
            this.configDevice = true;
            // 发送WiFi账号密码
            try {
                // 拼接要发送的消息
                const ssid = this.WiFiFormData.ssid;
                const password = this.WiFiFormData.password;
                const message = `SSID:${ssid}-PASSWORD:${password}`;
                const buffer = new ArrayBuffer(message.length);
                const dataView = new DataView(buffer);

                for (let i = 0; i < message.length; i++) {
                    dataView.setUint8(i, message.charCodeAt(i));
                }

                await uni.writeBLECharacteristicValue({
                    deviceId: this.connectedDevice.deviceId,
                    serviceId: this.serviceId, // 服务ID
                    characteristicId: this.characteristicId, // 特征ID
                    value: buffer
                });
                // 等待蓝牙反馈结果
                const result = await this.waitForBluetoothResponse();
                if (result) {
                    uni.showToast({
                        title: "配对成功",
                        icon: "success"
                    });
                } else {
                    uni.showToast({
                        title: "配对失败",
                        icon: "none"
                    });
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                // 关闭按钮等待状态
                this.configDevice = false;
                // 配对完成后，显示完成
                this.step_active = 3
            }
        },
        // 等待蓝牙反馈结果，20秒内没有反馈则认为配对失败
        waitForBluetoothResponse() {
            return new Promise((resolve, reject) => {
                let isResponseReceived = false;

                // 模拟接收蓝牙反馈结果
                uni.onBLECharacteristicValueChange((res) => {
                    const value = new TextDecoder().decode(res.value);
                    console.log('Received value:', value);
                    if (value === 'true') {
                        isResponseReceived = true;
                        resolve(true);
                    } else {
                        isResponseReceived = true;
                        resolve(false);
                    }
                });

                // 如果20秒内没有接收到反馈结果，则认为配对失败
                setTimeout(() => {
                    if (!isResponseReceived) {
                        console.log('No response received');
                        resolve(false);
                    }
                }, 20000);
            });
        },
        // 退出页面时关闭蓝牙连接
        onUnload() {
            console.log('beforeDestroy');
            if (this.connectedDevice) {
                uni.closeBLEConnection({
                    deviceId: this.connectedDevice.deviceId,
                    success: () => {
                        console.log('Bluetooth connection closed');
                    },
                    fail: (error) => {
                        console.error('Error closing Bluetooth connection:', error);
                    }
                });
            } 
        }
    },
    onUnload() {
        this.onUnload();
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

    // 每个标题靠左对齐
    uni-section {
        text-align: left;
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
            width: 100%;
            height: 50vh;

        }
    }

}
</style>