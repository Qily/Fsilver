// pages/group-device/group-device.js
const GET_REQ = require("../../request/getReq.js");
const my_config = require("../../commons/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
      groupName: "",
      devices: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
      wx.setNavigationBarTitle({
          title: options.groupName,
      });
      this.setData({
          groupName: options.groupName
      });
      this.getDealDevices();
      this.setSensorValue();
  },

  getDealDevices: function(){
    let dealDevices = wx.getStorageSync("deal-device-key");
    let devices = [];
    for(let i in dealDevices){
      if(dealDevices[i][5] == this.data.groupName){
        devices.push(dealDevices[i]);
      }
    }

    this.setData({
      devices: devices
    })
  },

  setSensorValue: function(){
    for(let i in this.data.devices){
      for(let j in this.data.devices[i][8]){
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
})