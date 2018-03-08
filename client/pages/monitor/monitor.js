//index.js
const my_config = require("../../commons/config.js");

//获取应用实例
Page({
    data: {
        devices: null,
        scenes: null,

        timer0: null,
        deviceSelected: true,
        groupSelected: false,
    },
    onLoad: function () {
        wx.showLoading({
            title: '加载中',
        });
        wx.setNavigationBarTitle({
            title: '实时监测',
        });

        this.getDealDevices();
        this.setSensorValue();

        wx.hideLoading();
    },
    getDealDevices: function () {
        let dealDevices = wx.getStorageSync("deal-device-key");

        this.setData({
            devices: dealDevices
        })
    },

    setSensorValue: function () {
        for (let i in this.data.devices) {
            for (let j in this.data.devices[i][8]) {
                this.getSensorValue(i, j, 1);
            }
        }
        console.log(this.data.devices);
    },

    getSensorValue: function (i, j, num) {
        var that = this;
        let devices = this.data.devices;
        console.log(devices);
        var uri = encodeURIComponent("devices/" + devices[i][6] + "/datapoints");
        var param = encodeURIComponent("&datastream_id=" + devices[i][8][j] + "&limit=" + num)
        wx.request({
            url: my_config.host + '/weapp/onet?method=GET&uri=' + uri + '&param=' + param,
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var sensorValue = 0;
                if (JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0] != null) {
                    sensorValue = JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0].datapoints[0].value;
                }
                var sensorKey = 'devices[' + i + '][9][' + j + ']';
                that.setData({
                    [sensorKey]: sensorValue,
                });
            },
            fail: function (err) {
                console.log("get Onet data error:", err);
            }
        })
    },

    onShow: function () {
        var that = this;
        this.data.timer0 = setInterval(function () {
            if (that.data.sensors) {
                that.setSensorValue();
            }
        }, 5000);
    },

    onPullDownRefresh: function () {
        this.setSensorValue();
        wx.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 1000
        });
        wx.stopPullDownRefresh();

    },

    onHide: function () {
        if (this.data.thimer0) {
            clearInterval(this.data.timer0);
        }
    },

    showCharts: function (event) {
        var deviceName = event.currentTarget.dataset.dname;
        var that = this;
        wx.navigateTo({
            url: '../monitor-chart/monitor-chart?name=' + deviceName,
            success: function (res) {
                console.log(deviceName);
            },
            fail: function (res) { },
            complete: function (res) { },
        })
    },

    deviceSelected: function (e) {
        this.setData({
            groupSelected: false,
            deviceSelected: true
        })
    },
    groupSelected: function (e) {
        this.setData({
            deviceSelected: false,
            groupSelected: true
        })
        this.getScene();
    },





    /**************************************************************************
     * 和场景页面相关函数
     */
    paintAllScene: function () {
        for (var i in this.data.scenes) {
            this.paintSingleScene(i);
        }
    },
    /**
     * 设置画布canvas
     */
    paintSingleScene: function (canvasId) {
        var canvasIdStr = canvasId.toString();
        var context = wx.createCanvasContext(canvasIdStr)
        if (this.data.scenes != null) {
            context.setStrokeStyle("#888888")
            context.setLineWidth(2)
            context.rect(0, 0, 350, 200)
            context.stroke()
            context.setFillStyle("#ff0000");
            
            //绘制场景图片
            context.drawImage(this.data.scenes[canvasId][2], 4, 4, 342, 192);
            // wx.saveFile({
            //     tempFilePath: '',
            // })

            this.paintSingleSceneData(canvasId, context);

            context.stroke()
        }
        wx.drawCanvas({
            //画布标识，传入<canvas/>的cavas-id
            canvasId: canvasIdStr,
            actions: context.getActions(),
        })
    },

    paintSingleSceneData: function (canvasId, context) {
        let scenes = this.data.scenes;
        for (let i in scenes[canvasId][3]) {
            let device = this.getDeviceById(scenes[canvasId][3][i][0]);
            if(device){
                for (let j in device[8]) {
                    // console.log(this.getSensorImage(device[8][j]));
                    context.drawImage(this.getSensorImage(device[8][j]),
                        this.data.scenes[canvasId][3][i][1],
                        this.data.scenes[canvasId][3][i][2] + 24 * j, 24, 24);
                    context.fillText(device[9][j], this.data.scenes[canvasId][3][i][1] + 24,
                        this.data.scenes[canvasId][3][i][2] + 24 * j + 16, 20, 20);
                }
            }
        }
    },

    getDeviceById: function (deviceId) {
        let devices = this.data.devices;
        for (let i in devices) {
            if (deviceId == devices[i][0]) {
                return devices[i];
            }
        }
    },


    getSensorImage: function (dataflowName) {
        var sensorImgPath = "";
        switch (dataflowName) {
            case "temperature_data_flow":
                sensorImgPath = "../../../images/icon/monitor_temp.png";
                break;
            case "humidity_data_flow":
                sensorImgPath = "../../../images/icon/monitor_humi.png";
                break;
            case "light_data_flow":
                sensorImgPath = "../../../images/icon/monitor_light.png";
                break;
            case "colse_on_data_flow":
                sensorImgPath = "../../../images/icon/monitor_close_on.png";
                break;
            case "co2_data_flow":
                sensorImgPath = "../../../images/icon/monitor_co2.png";
                break;
            default:
                break;
        }
        return sensorImgPath;
    },

    //将得到的数据进行转化
    shiftSceneData: function (originScenes) {
        let scenes = [];
        let temp = null;
        let scene = [];
        let device = [];
        let devices = [];
        let deviceCount = 0;
        for (let i in originScenes) {
            originScenes[i].img_path = my_config.methost + "/upload" + originScenes[i].img_path.split("/upload")[1];
            originScenes[i].rela_width = Math.floor(originScenes[i].rela_width * 342) + 4;
            originScenes[i].rela_height = Math.floor(originScenes[i].rela_height * 192) + 4;
            if (i == 0) {
                temp = originScenes[i].id;
                scene.push(originScenes[i].id);
                scene.push(originScenes[i].name);
                scene.push(originScenes[i].img_path);

                device.push(originScenes[i].device_id);
                device.push(originScenes[i].rela_width);
                device.push(originScenes[i].rela_height);

                devices.push(device);
                device = [];

                deviceCount++;

            } else {
                if (temp != originScenes[i].id) {
                    temp = originScenes[i].id;
                    //将之前的数据存储起来
                    deviceCount = 0;
                    scene.push(devices);
                    scenes.push(scene);
                    //开始存储新的数据
                    devices = [];
                    scene = [];

                    scene.push(originScenes[i].id);
                    scene.push(originScenes[i].name);
                    scene.push(originScenes[i].img_path);

                    device.push(originScenes[i].device_id);
                    device.push(originScenes[i].rela_width);
                    device.push(originScenes[i].rela_height);

                    devices.push(device);
                    device = [];


                    deviceCount++;
                } else {
                    device.push(originScenes[i].device_id);
                    device.push(originScenes[i].rela_width);
                    device.push(originScenes[i].rela_height);

                    devices.push(device);
                    device = [];
                    deviceCount++;
                }
            }
        }
        scene.push(devices);
        scenes.push(scene);
        this.setData({
            scenes: scenes,
        })
    },

    getScene: function () {
        var that = this;
        let userId = wx.getStorageSync("userinfo").id;
        wx.request({
            url: my_config.host + '/weapp/scenes?userId=' + userId,
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

                that.shiftSceneData(res.data.scenes);

                that.paintAllScene();
                setInterval(function () {
                    that.paintAllScene();
                }, 5000)
            },
            fail: function (err) {
                console.log("get scene error:", err);
            }
        })
    }
})

