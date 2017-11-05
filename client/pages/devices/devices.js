//index.js
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
  test:function(){
    const requestTask = wx.request({
      url: 'https://tfyly2id.qcloud.la/weapp/tes', //仅为示例，并非真实的接口地址
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
  }
})
