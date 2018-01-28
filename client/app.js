//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    userInfo: null,
    tabbar: {
      color: "#000000",
      selectedColor: "#0e932e",
      backgroundColor: "#ffffff",
      borderStyle: "white",
      list: [
        {
          pagePath: "/pages/shop/goods/goods",
          text: "商品",
          iconPath: "/images/icon/goods_0.png",
          selectedIconPath: "/images/icon/goods_1.png",
          selected: true
        },
        {
          pagePath: "/pages/shop/cart/cart",
          text: "购物车",
          iconPath: "/images/icon/cart_0.png",
          selectedIconPath: "/images/icon/cart_1.png",
          selected: false
        },
        {
          pagePath: "/pages/shop/myshop/myshop",
          text: "我的",
          iconPath: "/images/icon/my_shop_0.png",
          selectedIconPath: "/images/icon/my_shop_1.png",
          selected: false
        }
      ],
      position: "bottom"
    }
  }  
})