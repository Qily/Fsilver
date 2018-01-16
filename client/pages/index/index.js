//index.js
//获取应用实例
const app = getApp();
const md5 = require('../../utils/md5.js');
const my_config = require("../../commons/config.js");

Page({
  data: {
    username: '',
    password: '',
  },
  onLoad:function(opts){
  },
  enter:function(){
    this.getMetUserInfo(this.data.username);
    
    wx.switchTab({
      url: '../home/home'
    })
  },
  bindUsernameInput:function(e){
    this.setData({
      username: e.detail.value
    })
  },

  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
    
  getMetUserInfo:function(username){
    wx:wx.request({
      url: my_config.host + "/weapp/userinfo?username=" + username,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "GET",
      success: function(res) {
        console.log("+++++++++++++")
        console.log(res.data.userinfo);
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {},
    })
    console.log(md5.hex_md5("123123"));
  },
  
})
