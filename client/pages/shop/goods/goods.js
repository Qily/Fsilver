// pages/shop/goods/goods.js
const my_config = require("../../../commons/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: null,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().editTabBar();
    this.getProducts();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  getProducts:function(){
    let that = this;
    wx.request({
      url: my_config.host+"/weapp/products",
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
          console.log("++++++++++++++++++++++");
          console.log(res.data);
        if (res.data.products) {
          for (var i in res.data.products) {
            res.data.products[i].imgurl = "http://www.ddwulian.net" + res.data.products[i].imgurl.slice(2);
          }
        }
        that.setData({
          products: res.data.products,
        })
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  detailProduct:function(event){
    let info = event.currentTarget.dataset.info;
    info = encodeURIComponent(JSON.stringify(info));
    // console.log(info);

    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?info='+info,
      success:function(res){

      },
      fail:function(err){
        console.log(err);
      }
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