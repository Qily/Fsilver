// pages/monitor-chart/monitor-chart.js
const my_config = require("../../commons/config.js");
const GET_REQ = require("../../request/getReq.js");

var lineChart = new Array();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        device: null,
        sensorsData: null,
        charts: null,
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            deviceName: options.name,
        });
        // 1 将设备名称获取就可以获取相应的传感器dataflow
        // 2 根据数据流确定该画什么类型的chart
        // 3 为了实现左滑与右滑改变设备，我们还需要将该设备的前驱后继获取
        let getDeviceData = new Promise((resolve, reject) => {
            resolve(this.getDeviceByName(options.name));
        });
        getDeviceData.then(res => {
            this.setData({
                device: res,
            });
        }).then(() => {
            return this.initSensorsData();
        }).then(res => {
            this.setData({
                sensorsData: res,
            })
        }).then(() => {
            for (let i in this.data.sensorsData) {
                this.getSensorsValue(i);
                // this.data.sensorsData[i].pop();
                console.log(this.data.sensorsData[i]);
            }
        })
    },

    getDeviceByName: function (deviceName) {
        let devices = wx.getStorageSync('deal-device-key');
        for (let i in devices) {
            if (deviceName == devices[i][1]) {
                return devices[i];
            }
        }
    },

    onHide: function () {
        if (this.data.charts) {
            clearInterval(this.data.charts);
        }
    },
    // 返回，wx.navigateBack()或者重定向wx.rediectTo()，触发onUnload方法
    onUnload: function () {
        if (this.data.charts) {
            clearInterval(this.data.charts);
        }
    },

    onShow: function () {
        //每隔5秒重新获取数据并绘图
        let i = 0;
        var that = this;
        this.data.charts = setInterval(() => {
            that.getSensorsValue(i);
            i++;
            if (i == that.data.sensorsData.length) {
                i = 0;
            }
        }, 5000);
    },

    getSensorsValue: function (i) {
        let sensorValue = this.getSensorValue(i, this.data.device[6], 10);
        sensorValue.then(res => {
            let dataValue = [];
            let dataTime = [];
            let data = [];
            let reqSensorValue = null;
            if (JSON.parse(res.split('(')[1].split(')')[0]).data.datastreams[0] != null) {
                reqSensorValue = JSON.parse(res.split('(')[1].split(')')[0]).data.datastreams[0];
                for (var j in reqSensorValue.datapoints) {
                    dataValue.push(reqSensorValue.datapoints[j].value);
                    dataTime.push(reqSensorValue.datapoints[j].at.slice(5, 19));
                }
                if (this.data.sensorsData[i][0] == reqSensorValue.id) {
                    data.push(dataTime.reverse());
                    data.push(dataValue.reverse());
                    let sensorValue = "sensorsData[" + i + "][2]";
                    this.setData({
                        [sensorValue]: data,
                    })
                }
            }
        }).then(() => {
            if(this.data.sensorsData[i][2]){
                this.paintLineChart(i.toString(), this.data.sensorsData[i][1][0], this.data.sensorsData[i][1][1], this.data.sensorsData[i][1][2], this.data.sensorsData[i][2][0], this.data.sensorsData[i][2][1]);
            }
        }).catch(e => {
            console.log(e);
        })
    },

    initSensorsData: function () {
        let device = this.data.device;
        let sensorsData = [];
        let singleSensorData = [];
        let singleSensorInfo = [];
        for (let i in device[8]) {
            if (device[8][i] == "temperature_data_flow") {
                singleSensorInfo.push("温度传感器(℃)");
                singleSensorInfo.push("温度");
                singleSensorInfo.push("℃");
            } else if (device[8][i] == "humidity_data_flow") {
                singleSensorInfo.push("湿度传感器(%RH)");
                singleSensorInfo.push("湿度");
                singleSensorInfo.push("%");
            }
            singleSensorData.push(device[8][i]);
            singleSensorData.push(singleSensorInfo);
            singleSensorInfo = [];
            sensorsData.push(singleSensorData);
            singleSensorData = [];
        }
        return sensorsData;
    },


    paintLineChart: function (canvasId, titleName, seriesName, unitName, xData, yData) {
        let wWidth;
        let canvasIdStr = "chart" + canvasId;
        try {
            let res = wx.getSystemInfoSync();
            wWidth = res.screenWidth;
        } catch (e) {
            // do something when get system info failed
        }
        var wxCharts = require('../../utils/wxcharts.js');
        var xData = xData;
        lineChart[canvasId] = new wxCharts({
            canvasId: canvasIdStr,
            background: '#eeeeee',
            animation: false,
            legend: false,
            type: 'line',
            categories: xData,
            series: [{
                name: seriesName,
                data: yData,
                format: function (val) {
                    return val.toFixed(0) + unitName;
                }
            }],
            yAxis: {
                title: titleName,
                format: function (val) {
                    return val.toFixed(0);
                },
                // min: 0
            },
            width: wWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },

    /**
     * 通过request向后台请求数据
     * @param sensorId:向哪一个sensor中设置值
     * @param deviceId:device在onenet中的id
     * @param num: 请求的数据个数
     */
    getSensorValue: function (sensorId, deviceId, num) {
        var uri = encodeURIComponent("devices/" + deviceId + "/datapoints");
        var param = encodeURIComponent("&datastream_id=" + this.data.device[8][sensorId] + "&limit=" + num)
        return new Promise((resolve, reject) => {
            wx.request({
                url: my_config.host + '/weapp/onet?method=GET&uri=' + uri + '&param=' + param,
                method: 'GET',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    resolve(res.data._data);
                },
                fail: () => {
                    reject(false);
                }
            })
        })
    },


    touchHandler: function (e) {
        try {
            let idx = parseInt(e.target.id);
            lineChart[idx].scrollStart(e);
        } catch (err) {

        }

    },
    moveHandler: function (e) {
        try {
            let idx = parseInt(e.target.id);
            lineChart[idx].scroll(e);
        } catch (err) {

        }
    },
    touchEndHandler: function (e) {
        let idx = parseInt(e.target.id);
        lineChart[idx].scrollEnd(e);
        lineChart[idx].showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
})