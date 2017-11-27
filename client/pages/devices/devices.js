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
    devices:null,
  },
  onLoad:function(){
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
          devices: res.data.GroupId
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  testMysql:function(){
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
          devices:res.data.GroupId[0].gname
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  // testMysql: function () {
  //   this.setData({
  //     devices:"bb"
  //   })
  // },

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
