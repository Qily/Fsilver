//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    Liqi: '这是用户信息',
  },

  test:function(){
    const requestTask = wx.request({
      url: 'https://qcachyoe.qcloud.la/weapp/tes', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  doOnetTest: function () {
    wx.request({
      url: 'https://qcachyoe.qcloud.la/weapp/onet',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res.data)
      },
      fail:function(err){
        console.log("get Onet data error:", err);
      }
    })
  }
})
