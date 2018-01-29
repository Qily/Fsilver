// pages/group-device/group-device.js
const GET_REQ = require("../../request/getReq.js");
const Storage = require("../../storage/storSync.js");
const my_config = require("../../commons/config.js");

Page({

/**
 * 页面的初始数据
 */
data: {
    groupName: "",

    deviceNames: null,
    deviceLocas: null,
    sensors: null,
    sensorDatas: null,

},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {    
    wx.setNavigationBarTitle({
        title: options.groupName,
    });
    // console.log(options.groupId);
    this.setData({
        groupName: options.groupName
    });

    this.getDeviceName(Storage.getDeviceData());
    this.getDeviceSensor(this.data.deviceNames, Storage.getDeviceData());
    this.getSenesorData(this.data.sensors, Storage.getDeviceData());
},

    
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
    var that = this;
    this.data.timer0 = setInterval(function () {
        if (that.data.sensors) {
            that.getSenesorData(that.data.sensors, Storage.getDeviceData());
        }
    }, 5000);
},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function () {
    clearInterval(this.data.timer0);
},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {
    

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {

},

getDatapoint: function (i, j, deviceId, datastreamId, num) {
    var that = this;
    var uri = encodeURIComponent("devices/" + deviceId + "/datapoints");
    var param = encodeURIComponent("&datastream_id=" + datastreamId + "&limit=" + num)
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

getSenesorData: function (sensorFlows, devices) {
    var count = 0;
    var sds = new Array();
    for (var i in sensorFlows) {
        sds[i] = new Array();
        for (var si in sensorFlows[i]) {
            // sds[i][si] = Math.round(Math.random() * 10);
            this.getDatapoint(i, si, devices[count].odid, sensorFlows[i][si], 1)
            count++;
        }
    }
},


getDeviceName: function (devices) {
    var dns = new Array();
    var dls = new Array();
    var sensorFlows = new Array();
    var si = 0;
    for (var i in devices) {
        var isExist = false;
        for (var j in dns) {
            if (dns[j] === devices[i].dname) {
                isExist = true;
            }
        }
        if (isExist === false && devices[i].gname == this.data.groupName) {
            dns.push(devices[i].dname);
            dls.push(devices[i].dloca)
        }
    }
    this.setData({
        deviceNames: dns,
        deviceLocas: dls,
    });
    try {
        wx.setStorageSync("deviceNames", dns);
    } catch (e) {
        console.log(e);
    }
},

getDeviceSensor: function (deviceNames, devices) {
    var sensorFlows = new Array();
    for (var i in deviceNames) {
        sensorFlows[i] = new Array();
        for (var j in devices) {
            if (devices[j].dname == deviceNames[i]) {
                sensorFlows[i].push(devices[j].sdataflow);
            }
        }
    }
    this.setData({
        sensors: sensorFlows,
    });
},
})