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
  }
})
