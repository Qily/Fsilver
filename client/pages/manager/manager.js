// pages/manager/manager.js

const my_config = require("../../commons/config.js");
Page({
  data: {
    devices: null,
    deviceNames: null,
    sensors: null,
    gnames: null,
    deviceSelected: true,
    groupSelected: false,
    groups: null,
  },
  onLoad: function () {
    var that = this;
    
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '设备管理',
    });
    try {
      var value = wx.getStorageSync('device-key');
      if (value) {
        this.getDeviceName(wx.getStorageSync("device-key"));
        wx.hideLoading();
      } else {
        const requestTask = wx.request({
          url: my_config.host + '/weapp/devices?id=6', //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading();
            // that.setData({
            //   devices: res.data.GroupId
            // });
            try {
              wx.setStorageSync('device-key', res.data.GroupId);
            } catch (e) {

            }
            console.log(wx.getStorageSync('device-key'));
            that.getDeviceName(wx.getStorageSync("device-key"));

            console.log(that.data.deviceNames);
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    } catch (e) {

    };

    let userId = wx.getStorageSync("userinfo").id;
    var gs = wx.request({
        url: my_config.host + "/weapp/groups?id=" + userId,
        method: 'GET',
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
        console.log(res.data.groups);
        that.setData({
            groups: res.data.groups,
        });
        },
        fail: function (err) {
        console.log("+++++++++++manager.js-68+++++++++++++++++++");
        console.log(err);
        }
    })
  },
  getDeviceName: function (devices) {
    var dns = new Array();
    var dls = new Array();
    var sensorFlows = new Array();
    var si = 0;
    for (var i in devices) {
      sensorFlows[i] = new Array();
      var isExist = false;
      for (var j in dns) {
        if (dns[j] === devices[i].dname) {
          sensorFlows[i][si] = devices[i].sdataflow;
          si++;
          isExist = true;
        }
      }
      if (isExist === false) {
        dns.push(devices[i].dname);
        dls.push(devices[i].gname);
        sensorFlows[i][si] = devices[i].sdataflow;
        si++;
      }
    }
    console.log(this.data.devices);
    this.setData({
      deviceNames: dns,
      gnames: dls,
      sensors: sensorFlows,
    });
  },
  deleteDevice:function(){
    wx.showModal({
      content: "是否删除？",
      success:function(res){
        if(res.confirm){          
          console.log("yes");
        } else if(res.cancel){
          console.log("no");
        }
      }
    })
  },

  deviceDetail:function(event){
    var name = event.currentTarget.dataset.dname;
    wx.navigateTo({
      url: '../manager-modify-device/manager-modify-device?name='+name,
    })
  },

  deviceSelected:function(e) {
    this.setData({
      groupSelected: false,
      deviceSelected: true
    })
  },
  groupSelected:function(e) {
    this.setData({
      deviceSelected: false,
      groupSelected: true
    })
  },
  deviceAdd:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  }
})