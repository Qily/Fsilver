// pages/mine/mine.js
const my_config = require("../../commons/config.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的账户',
        });
    },

    shiftCount:function(){
        wx.showModal({
            title: '切换账户',
            content: '确定切换当前账户？',
            success: function(res){
                if(res.confirm){
                    //点击确认
                    //清除当前缓存信息
                    //TODO:
                    wx.removeStorageSync("userinfo");
                    wx.removeStorageSync("device-key");
                    wx.clearStorageSync();

                    // console.log(wx.getStorageSync("********"+'userinfo'));
                    
                    //跳转到登录页面
                    wx.redirectTo({
                    url: '../index/index',
                    })
                } else if(res.cancel){
                    //do nothing
                }
            }
        })
    },

    changePass:function(){
    wx.navigateTo({
        url: '../mine-change-pass/mine-change-pass',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
    })
    },

    myMsg:function(){

    },

    shop:function(){
    wx.navigateTo({
        url: '../shop/goods/goods',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
    });
    }
})