//index.js
const my_config = require("../../commons/config.js");
//获取应用实例

Page({
  data: {
    devices: null,
    deviceNames: null,
    sensors: null,
    gnames: null,
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '实时监测',
    })
    var that = this;
    const requestTask = wx.request({
      url: my_config.host + '/weapp/tes?id=6', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          devices: res.data.GroupId
        });
        that.getDeviceName(that.data.devices);

        console.log(that.data.deviceNames);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  testMysql: function () {
    var that = this;
    const requestTask = wx.request({
      url: my_config.host + '/weapp/tes?id=6', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res.data.GroupId[0].gname)
        that.setData({
          devices: res.data.GroupId[0].gname
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  testScan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },

  testOnet: function () {
    wx.request({
      url: my_config.host + '/weapp/onet',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log("get Onet data error:", err);
      }
    })
  },

  getDeviceName: function (devices) {
    var dns = new Array();
    var dls = new Array();
    var sensorFlows = new Array();
    var si = 0;
    for (var i in devices) {
      sensorFlows[i] = new Array();
      var isExist = false;
      for (var j in dns) {
        if (dns[j] === devices[i].dname) {
          sensorFlows[i][si] = devices[i].sdataflow;
          si++;
          isExist = true;
        }
      }
      if (isExist === false) {
        dns.push(devices[i].dname);
        dls.push(devices[i].gname);
        sensorFlows[i][si] = devices[i].sdataflow;
        si++;
      }
    }
    console.log(this.data.devices);
    this.setData({
      deviceNames: dns,
      gnames: dls,
      sensors: sensorFlows,
    });
  },

})

