//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    Liqi: '这是用户信息',
  },

  test:function(){
   
  },
  doOnetTest: function () {
    wx.request({
      url: 'https://tfyly2id.qcloud.la/weapp/onet',
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
