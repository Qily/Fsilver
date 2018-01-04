//index.js
const my_config = require("../../commons/config.js");
//获取应用实例

Page({
  data: {
    deviceNames: null,
    sensors: null,
    gnames: null,
    sensorDatas: null,
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '实时监测',
    });
    try{
      var value = wx.getStorageSync('device-key');
      if(value){
        this.getDeviceName(wx.getStorageSync("device-key"));
        this.getDeviceSensor(this.data.deviceNames, wx.getStorageSync('device-key'));
        wx.hideLoading();
      } else{
        // console.log("1");
        var that = this;
        const requestTask = wx.request({
          url: my_config.host + '/weapp/tes?id=6', //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading();
            // that.setData({
            //   devices: res.data.GroupId
            // });
            try{
              wx.setStorageSync('device-key', res.data.GroupId);
            } catch(e){

            }
            console.log(wx.getStorageSync('device-key'));
            that.getDeviceName(wx.getStorageSync("device-key"));
            that.getDeviceSensor(that.data.deviceNames, wx.getStorageSync('device-key'));

            // console.log(that.data.deviceNames);
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    } catch (e){

    };
    
    // console.log(this.data.sensors);
  },
  onReady:function(){
    this.getSenesorData(this.data.sensors, wx.getStorageSync('device-key'));
    
    var that = this;
    setInterval(function () {
      if (that.data.sensors) {
        that.getSenesorData(that.data.sensors, wx.getStorageSync('device-key'));
      }
    }, 5000);
  },
  getDatapoint: function (i, j, deviceId, datastreamId, num) {
    var that = this;
    // var deviceId = 17700678;
    var uri = encodeURIComponent("devices/"+deviceId + "/datapoints");
    // var datastreamId = "humidity_data_flow";
    // var num = 1;
    var param = encodeURIComponent("&datastream_id="+ datastreamId + "&limit=" + num)
    wx.request({
      url: my_config.host + '/weapp/onet?method=GET&uri='+uri+'&param='+param,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0].datapoints[0].value);
        var sensorValue = 0;
        if (JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0] != null){
          sensorValue = JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0].datapoints[0].value;
          console.log(sensorValue);
        }
        var sensorKey = 'sensorDatas[' + i + '][' + j + ']';
        that.setData({
          [sensorKey]: sensorValue,
        });
        console.log(that.data.senosrDatas);
      },
      fail: function (err) {
        console.log("get Onet data error:", err);
      }
    })
  },

  getSenesorData: function (sensorFlows, devices){
    var count = 0;
    var sds = new Array();
    for(var i in sensorFlows){
      sds[i] = new Array();
      for(var si in sensorFlows[i]){
        // sds[i][si] = Math.round(Math.random() * 10);
        this.getDatapoint(i, si, devices[count].odid, sensorFlows[i][si], 1)
        count++;
      }
    }
  },


  getDeviceName: function (devices) {
    var dns = new Array();
    var dgs = new Array();
    var sensorFlows = new Array();
    var si = 0;
    for (var i in devices) {
      var isExist = false;
      for (var j in dns) {
        if (dns[j] === devices[i].dname) {
          isExist = true;
        }
      }
      if (isExist === false) {
        dns.push(devices[i].dname);
        dgs.push(devices[i].gname);
      }
    }
    this.setData({
      deviceNames: dns,
      gnames: dgs,
    });
  },

  getDeviceSensor:function(deviceNames, devices){
    var sensorFlows = new Array();
    console.log(devices);
    for(var i in deviceNames){
      sensorFlows[i] = new Array();
      for(var j in devices){
        if(devices[j].dname == deviceNames[i]){
          sensorFlows[i].push(devices[j].sdataflow);
        }
      }
    }
    this.setData({
      sensors: sensorFlows,
    });
    console.log(sensorFlows);
  }
})

