//index.js
const my_config = require("../../commons/config.js");
// const sub_scenes = require("sub-monitor/scenes.js");
//获取应用实例

Page({
    data: {
        deviceNames: null,
        sensors: null,
        gnames: null,
        sensorDatas: null,
        timer0:null,
        deviceSelected: true,
        groupSelected: false,
        sceneData: null,
    },
    onLoad: function () {
        wx.showLoading({
        title: '加载中',
        });
        wx.setNavigationBarTitle({
        title: '实时监测',
        });
        try{
        var value = wx.getStorageSync('device-key');
        if(value){
            this.getDeviceName(wx.getStorageSync("device-key"));
            this.getDeviceSensor(this.data.deviceNames, wx.getStorageSync('device-key'));
            wx.hideLoading();
        } else{
            var that = this;
            var userId = wx.getStorageSync("userinfo").id;

            const requestTask = wx.request({
                url: my_config.host + '/weapp/devices?id=' + userId,
                method: 'GET',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    wx.hideLoading();
                    // that.setData({
                    //   devices: res.data.GroupId
                    // });
                    try{
                    wx.setStorageSync('device-key', res.data.GroupId);
                    } catch(e){

                    }
                    that.getDeviceName(wx.getStorageSync("device-key"));
                    that.getDeviceSensor(that.data.deviceNames, wx.getStorageSync('device-key'));
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        }
        } catch (e){

        };

        this.getSenesorData(this.data.sensors, wx.getStorageSync('device-key'));
    },

    onShow:function(){
        var that = this;
        this.data.timer0 = setInterval(function () {
            if (that.data.sensors) {
                that.getSenesorData(that.data.sensors, wx.getStorageSync('device-key'));
            }
        }, 5000);
    },

    onPullDownRefresh:function(){
        this.getSenesorData(this.data.sensors, wx.getStorageSync('device-key'));
        wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1000
        });
        wx.stopPullDownRefresh();
        
    },

    onHide:function(){
        clearInterval(this.data.timer0);
    },

    getDatapoint: function (i, j, deviceId, datastreamId, num) {
        var that = this;
        var uri = encodeURIComponent("devices/"+deviceId + "/datapoints");
        var param = encodeURIComponent("&datastream_id="+ datastreamId + "&limit=" + num)
        wx.request({
            url: my_config.host + '/weapp/onet?method=GET&uri='+uri+'&param='+param,
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                    var sensorValue = 0;
                    if (JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0] != null){
                    sensorValue = JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0].datapoints[0].value;
                }
                var sensorKey = 'sensorDatas[' + i + '][' + j + ']';
                that.setData({
                    [sensorKey]: sensorValue,
                });
            },
            fail: function (err) {
                console.log("get Onet data error:", err);
            }
        })
    },

    getSenesorData: function (sensorFlows, devices){
        var count = 0;
        var sds = new Array();
        for(var i in sensorFlows){
            sds[i] = new Array();
            for(var si in sensorFlows[i]){
                // sds[i][si] = Math.round(Math.random() * 10);
                this.getDatapoint(i, si, devices[count].odid, sensorFlows[i][si], 1)
                count++;
            }
        }
    },


    getDeviceName: function (devices) {
        var dns = new Array();
        var dgs = new Array();
        var sensorFlows = new Array();
        var si = 0;
        for (var i in devices) {
        var isExist = false;
        for (var j in dns) {
            if (dns[j] === devices[i].dname) {
            isExist = true;
            }
        }
        if (isExist === false) {
            dns.push(devices[i].dname);
            dgs.push(devices[i].gname);
        }
        }
        this.setData({
            deviceNames: dns,
            gnames: dgs,
        });
        try{
            wx.setStorageSync("deviceNames", dns);
            wx.setStorageSync("groupNames", dgs);
        } catch(e){
            console.log(e);
        }
    },

    getDeviceSensor:function(deviceNames, devices){
        var sensorFlows = new Array();
        for(var i in deviceNames){
        sensorFlows[i] = new Array();
        for(var j in devices){
            if(devices[j].dname == deviceNames[i]){
                sensorFlows[i].push(devices[j].sdataflow);
            }
        }
        }
        this.setData({
            sensors: sensorFlows,
        });
    },

    showCharts:function(event){
        var deviceName = event.currentTarget.dataset.dname;
        var that = this;
        wx.navigateTo({
            url: '../monitor-chart/monitor-chart?name='+deviceName,
            success: function(res) {
                console.log(deviceName);
            },
            fail: function(res) {},
            complete: function(res) {},
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

    paintAllScene: function(){
        for(var i in this.data.sceneData){
            this.paintSingleScene(i);
        }
    },

    paintSingleScene: function (canvasId) {
        
        var canvasIdStr = canvasId.toString();
        var context = wx.createCanvasContext(canvasIdStr)
        if (this.data.sceneData != null) {
            context.setStrokeStyle("#888888")
            context.setLineWidth(2)
            context.rect(0, 0, 350, 200)
            context.stroke()
            context.setFillStyle("#ff0000");
            context.drawImage(this.data.sceneData[canvasId].img_path, 4, 4, 342, 192);
            for(var i in this.data.sceneData[canvasId].devices){
                this.paintSingleSceneData(canvasId, context, i);
                
            }
            
            
            context.stroke()
        }
        wx.drawCanvas({
            //画布标识，传入<canvas/>的cavas-id
            canvasId: canvasIdStr,
            actions: context.getActions(),
        })
    },

    paintSingleSceneData:function(canvasId, context, index){
        var id = this.data.sceneData[canvasId].devices[index].deviceId
        var devicesInfo = wx.getStorageSync("device-key");
        for (var i in devicesInfo){
            //先从存储的device信息中找出设备名称
            if (devicesInfo[i].did == id){
                for(var j in this.data.deviceNames){
                    //找出设备对应的数组序号
                    if (devicesInfo[i].dname == this.data.deviceNames[j]){
                        // deviceNames的序号就是sensors的序号
                        for(var m in this.data.sensors[j]){
                            context.drawImage(this.getSensorImage(this.data.sensors[j][m]),
                                this.data.sceneData[canvasId].devices[index].rela_width,
                                this.data.sceneData[canvasId].devices[index].rela_height + 24 * m, 24, 24);
                            context.fillText(this.data.sensorDatas[j][m], this.data.sceneData[canvasId].devices[index].rela_width + 24,
                                this.data.sceneData[canvasId].devices[index].rela_height + 24 * m + 16, 20, 20);
                        }
                        break;
                    }
                
                }
            }
        }
    },

    getSensorImage:function(dataflowName){
        var sensorImgPath = "";
        switch(dataflowName){
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

//将从后台获取的数据整理成程序中可用的数据
    dealSceneData: function (scenes) {
        let devices = [];
        let sceneDatas = [];
        let count = 0;
        let deviceCount = 0;
        for (var i in scenes) {
            scenes[i].img_path = my_config.methost + "/upload" + scenes[i].img_path.split("/upload")[1];
            scenes[i].rela_width = Math.floor(scenes[i].rela_width * 342) + 4;
            scenes[i].rela_height = Math.floor(scenes[i].rela_height * 192) + 4;
            if (i == 0) {
                var device = {
                    deviceId: scenes[i].device_id,
                    rela_height: scenes[i].rela_height,
                    rela_width: scenes[i].rela_width
                };

                devices.push(device);

                var sceneData = {
                    id: scenes[i].id,
                    name: scenes[i].name,
                    img_path: scenes[i].img_path,
                    devices: devices
                };

                sceneDatas.push(sceneData);

            } else if (scenes[i].img_path == scenes[i - 1].img_path) {
                var device = {
                    deviceId: scenes[i].device_id,
                    rela_height: scenes[i].rela_height,
                    rela_width: scenes[i].rela_width
                };
                devices.push(device);
            } else {
                count++;
                devices = [];
                var device = {
                    deviceId: scenes[i].device_id,
                    rela_height: scenes[i].rela_height,
                    rela_width: scenes[i].rela_width
                };

                devices.push(device);

                var sceneData = {
                    id: scenes[i].id,
                    name: scenes[i].name,
                    img_path: scenes[i].img_path,
                    devices: devices
                };

                sceneDatas.push(sceneData);
            }
        }
        this.setData({
            sceneData: sceneDatas,
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
                that.dealSceneData(res.data.scenes);
                
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

