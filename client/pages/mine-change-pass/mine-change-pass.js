// pages/mine-change-pass/mine-change-pass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  modifyPass:function(){
    //这里要做数据库相应的操作
    //TODO
    wx.navigateBack({
      delta: 1,
    });
  }
})