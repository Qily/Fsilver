// pages/shop/cart/cart.js
const my_config = require("../../../commons/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartInfo: null,
    needpay: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().editTabBar();
    this.getCartInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  getCartInfo:function(){
    let that = this;
    wx:wx.request({
      url: my_config.host + "/weapp/cart_info",
      data: {
        userId: 7,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "GET",
      // dataType: json,
      // responseType: text,
      success: function(res) {
        console.log(res.data.cartInfo);
        var needpay = 0;        
        if(res.data.cartInfo){
          for(var i in res.data.cartInfo){
            res.data.cartInfo[i].imgurl = "http://www.ddwulian.net"+res.data.cartInfo[i].imgurl.slice(2);
            res.data.cartInfo[i].checked = true;
            res.data.cartInfo[i].total = res.data.cartInfo[i].price * res.data.cartInfo[i].amount * res.data.cartInfo[i].user_discount;
            // res.data.cartInfo[i].
            needpay += res.data.cartInfo[i].price * res.data.cartInfo[i].amount * res.data.cartInfo[i].user_discount;
          }
        }
        // console.log(res.data.cartInfo);
        that.setData({
          cartInfo: res.data.cartInfo,
          needpay: needpay,
        });
      },
      fail: function(res) {
        console.log(res);
      },
    })

  },

  checkChange:function(e){
    var temp = 0;
    var value = e.detail.value;
    for(var i in value){
      temp += parseInt(value[i]);
    }
    this.setData({
      needpay: temp,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})