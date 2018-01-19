// pages/monitor-chart/monitor-chart.js
const my_config = require("../../commons/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceName: null,
    dataflows: null,
    onetDeviceId: null,
    dataflowValues: null,
    sensorValueInfo: null,
    charts: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceName : options.name,
    });
    // 1 将设备名称获取就可以获取相应的传感器dataflow
    // 2 根据数据流确定该画什么类型的chart
    // 3 为了实现左滑与右滑改变设备，我们还需要将该设备的前驱后继获取
    this.getDataflows(options.name);
    this.initDataflowValue();
  },

  onHide:function(){
    clearInterval(this.data.charts);
  },
  // 返回，wx.navigateBack()或者重定向wx.rediectTo()，触发onUnload方法
  onUnload:function(){
    clearInterval(this.data.charts);
  },

  onShow:function(){
    this.getSensorsValue(0, this.data.onetDeviceId, 5);
    this.getSensorsValue(1, this.data.onetDeviceId, 5);
    var that = this;
    var i = 0;
    this.data.charts = setInterval(function(){
      that.getSensorsValue(i, that.data.onetDeviceId, 5);
      i++;
      if(i > that.data.dataflows.length){
        i = 0;
      }
    }, 5000);
  },

  /**
   * 该函数用于初始化代表sensor数值的数组，二维，第一维度是有多少个数据流，第二个是该数据流的时间和数值
   * @param:dataflows 该设备中的数据流个数
   */
  initDataflowValue:function(){
    var dfvs = new Array(this.data.dataflows.length);
    var sensorValueInfo = new Array(this.data.dataflows.length);
    for(var i in this.data.dataflows){
      dfvs[i] = new Array();
      sensorValueInfo[i] = new Array(3);
      if(this.data.dataflows[i] == "temperature_data_flow"){
        sensorValueInfo[i][0] = "温度传感器(℃)";
        sensorValueInfo[i][1] = "温度";
        sensorValueInfo[i][2] = "℃";
      } else if (this.data.dataflows[i] == "humidity_data_flow"){
        sensorValueInfo[i][0] = "湿度传感器(%RH)";
        sensorValueInfo[i][1] = "湿度";
        sensorValueInfo[i][2] = "%";
      }
    }
    this.setData({
      dataflowValues: dfvs,
      sensorValueInfo: sensorValueInfo,
    });
  },
  paintLineChart:function(canvasId, titleName, seriesName, unitName, xData, yData){
    let wWidth;
    let canvasIdStr = "chart"+canvasId;
    try {
      let res = wx.getSystemInfoSync();
      wWidth = res.screenWidth;
    } catch (e) {
      // do something when get system info failed
    }
    var wxCharts = require('../../utils/wxcharts.js');
    var xData = xData;
    new wxCharts({
        canvasId: canvasIdStr,
        background: '#eeeeee',
        animation: false,
        legend: false,
        type: 'line',
        categories: xData,
        series: [{
            name: seriesName,
            data: yData,
            format: function (val) {
                return val.toFixed(0) + unitName;
            }
        }],
        yAxis: {
            title: titleName,
            format: function (val) {
            return val.toFixed(2);
            },
            min: 0
        },
        width: wWidth,
        height: 200,
        });
  },

  getDataflows:function(deviceName){
    var devices = wx.getStorageSync("device-key");
    var deviceId;
    var dfs = new Array();
    for(var i in devices){
      if(devices[i].dname == deviceName){
        dfs.push(devices[i].sdataflow);
        deviceId = devices[i].odid;
      }
    }
    this.setData({
      onetDeviceId: deviceId,
      dataflows: dfs,
    });
  },

  /**
   * 通过request向后台请求数据
   * @param sensorId:向哪一个sensor中设置值
   * @param deviceId:device在onenet中的id
   * @param num: 请求的数据个数
   */
  getSensorsValue: function (sensorId, deviceId, num) {
    var that = this;
    var uri = encodeURIComponent("devices/" + deviceId + "/datapoints");
    var param = encodeURIComponent("&datastream_id=" + this.data.dataflows[sensorId] + "&limit=" + num)
    wx.request({
      url: my_config.host + '/weapp/onet?method=GET&uri=' + uri + '&param=' + param,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var dataValue = new Array(num);
        var dataTime = new Array(num);
        var sensorValue;
        if (JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0] != null) {
          sensorValue = JSON.parse(res.data._data.split('(')[1].split(')')[0]).data.datastreams[0];
          for(var i in sensorValue.datapoints){
            dataValue[i] = sensorValue.datapoints[i].value;
            dataTime[i] = sensorValue.datapoints[i].at.slice(5, 19);
          }
          that.data.dataflowValues[sensorId][0] = dataTime.reverse();
          that.data.dataflowValues[sensorId][1] = dataValue.reverse();
          that.paintLineChart(sensorId.toString(), that.data.sensorValueInfo[sensorId][0], that.data.sensorValueInfo[sensorId][1], that.data.sensorValueInfo[sensorId][2], that.data.dataflowValues[sensorId][0], that.data.dataflowValues[sensorId][1]);
        }
      },
      fail: function (err) {
        console.log("get Onet data error:", err);
      }
    })
  },
})