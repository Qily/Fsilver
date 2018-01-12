// pages/shop/goodsdetail/goodsdetail.js
const my_config = require("../../../commons/config.js");
const Util = require("../../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    count:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(decodeURIComponent(options.info)));
    this.setData({
      info: JSON.parse(decodeURIComponent(options.info)),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

  decProdect:function(){
    var a = 0;
    if (this.data.count - 1 > 0) {
      a = this.data.count - 1;
      this.setData({
        count: a,
      })
    }
  },

  addProduct:function(){
    var a = 0;
    if(this.data.count < this.data.info.stock){
      a = this.data.count + 1;
      this.setData({
        count:a,
      })
    }
  },

  buyProduct:function(){
    let that = this;
    wx:wx.request({
      url: my_config.host+"/weapp/buy_product",
      data: Util.json2Form({userId: 6, productId: that.data.info.id, productCount: that.data.count}),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      // dataType: json,
      // responseType: text,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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