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
  },
  bindUsernameInput:function(e){
    this.setData({
      username: e.detail.value
    })
  },

  bindPasswordInput: function (e) {
    let passMd5 = md5.hex_md5(e.detail.value);
    this.setData({
      password: passMd5
    })
  },
    
  getMetUserInfo:function(username){
    let that = this;
    wx.request({
      url: my_config.host + "/weapp/userinfo?username=" + username,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "GET",
      success: function(res) {
        if(res.data.userinfo.length == 0){
          wx.showToast({
            title: '用户名错误',
            image: '../../images/icon/error.png',
            duration: 2000
          })
        } else{
          if (res.data.userinfo[0].password == that.data.password){
            wx.switchTab({
              url: '../home/home'
            });
            //当用户名和密码正确之后，将用户名和id存入到Storage中作为session
            let value = res.data.userinfo[0];
            wx.setStorageSync("userinfo", value);
          } else{
            wx.showToast({
              title: '密码错误',
              image: '../../images/icon/error.png',
              duration: 2000
            })
          }
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {},
    })
  },
})
