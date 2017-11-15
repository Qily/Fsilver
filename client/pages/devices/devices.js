//index.js
const my_config = require("../../commons/config.js");
//获取应用实例
const app = getApp()
var bodyHeight = 500;
var bodyWidth = 375;

Page({
  data: {
    title: '设备信息',
    allViewHeight: bodyHeight,
  },
  onLoad:function(){
    wx.getSystemInfo({
      success: function(res) {
        bodyHeight = res.windowHeight - 100;
      },
    })
    this.setData({
      allViewHeight:bodyHeight,
    })
  },
  testMysql:function(){
    const requestTask = wx.request({
      url: my_config.host + '/weapp/tes', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  testScan:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },

  testOnet:function(){
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
  }


})
