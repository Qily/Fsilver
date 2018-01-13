// pages/manager-modify-device/manager-modify-device.js
const my_config = require("../../commons/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceName:'',
    groups: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceName: options.name,
    });

    var devices = wx.getStorageSync('device-key');
    // console.log(devices);
    

  },

  
})