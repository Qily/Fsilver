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

    shiftCount: function () {
        wx.showModal({
            title: '切换账户',
            content: '确定切换当前账户？',
            success: function (res) {
                if (res.confirm) {
                    //点击确认
                    //清除当前缓存信息
                    //TODO:
                    wx.removeStorageSync("userinfo");
                    wx.removeStorageSync("deal-device-key");
                    wx.removeStorageSync("groups");
                    wx.clearStorageSync();

                    //跳转到登录页面
                    wx.redirectTo({
                        url: '../index/index',
                    })
                } else if (res.cancel) {
                    //do nothing
                }
            }
        })
    },

    changePass: function () {
        wx.navigateTo({
            url: '../mine-change-pass/mine-change-pass',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },

    myMsg: function () {

    },

    shop: function () {
        let products = this.getProducts();
        products.then(res=>{
            if (res) {
                for (var i in res) {
                    res[i].imgurl = my_config.methost + res[i].imgurl.slice(2);
                }
            }
            wx.setStorageSync("products-key", res);
        }).then(()=>{
            wx.navigateTo({
                url: '../shop/goods/goods',
            });
        })
        
    },

    getProducts: function(){
        let that = this;
        return new Promise((resolve, reject)=>{
            wx.request({
                url: my_config.host + "/weapp/products",
                method: "GET",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    resolve(res.data.products);
                },
                fail: function (err) {
                    console.log(err);
                }
            })
        })
    }
})