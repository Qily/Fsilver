//index.js
const my_config = require("../../commons/config.js");
//获取应用实例

Page({
  data: {
    deviceNames: null,
    sensors: null,
    gnames: null,
    sensorDatas: null,
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
        // console.log("1");
        var that = this;
        const requestTask = wx.request({
          url: my_config.host + '/weapp/tes?id=6', //仅为示例，并非真实的接口地址
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
            console.log(wx.getStorageSync('device-key'));
            that.getDeviceName(wx.getStorageSync("device-key"));
            that.getDeviceSensor(that.data.deviceNames, wx.getStorageSync('device-key'));

            // console.log(that.data.deviceNames);
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    } catch (e){

    };
    this.getSenesorData(this.data.sensors);
    // console.log(this.data.sensorDatas)
    
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

  getSenesorData: function (sensorFlows){
    var sds = new Array();
    for(var i in sensorFlows){
      sds[i] = new Array();
      for(var si in sensorFlows[i]){
        sds[i][si] = Math.round(Math.random() * 10);
      }
    }
    this.setData({
      sensorDatas: sds,
    })
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
  },

  getDeviceSensor:function(deviceNames, devices){
    var sensorFlows = new Array();
    console.log(devices);
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
    console.log(sensorFlows);
  }

})

