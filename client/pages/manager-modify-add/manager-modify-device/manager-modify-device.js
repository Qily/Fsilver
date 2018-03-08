// pages/manager-modify-device/manager-modify-device.js
const my_config = require("../../../commons/config.js");
const POST_REQ = require("../../../request/postReq.js");
const GET_REQ = require("../../../request/getReq.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        device: null,
        groups: null,
        groupsName: null,
 
        ind: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        ind: 1,
      })
      let groups = null;
      let getGroups = new Promise((resolve, reject)=>{  
        groups = wx.getStorageSync("groups");
        if(groups){
          resolve(groups);
        } else{
          reject(false);
        }
      });
      getGroups.then(res=>{
        let deviceArr = JSON.parse(options.device);
        let groupIndex = 0;
        let groupsName = [];
        for (let i in res) {
          groupsName.push(res[i].name);
          if (deviceArr[4] == res[i].id) {
            groupIndex = i;
          }
        }
        this.setData({
          device: deviceArr,
          groups: res,
          ind: groupIndex,
          groupsName: groupsName,
        });
      });
    },

    getGroupId:function(e){
        this.setData({
            ind: e.detail.value,
            groupId:wx.getStorageSync('groups')[e.detail.value].id
        })
        
    },

    getDeviceName:function(e){
        console.log(e.detail.value);
        let deviceName = 'device[1]';
        this.setData({
            [deviceName]: e.detail.value
        })
    },

    getDeviceLoca:function(e){
        let deviceLoca = 'device[2]';
        this.setData({
            [deviceLoca]: e.detail.value
        })
    },
    getDeviceDesc:function(e){
        let deviceDesc = "device[3]";
        this.setData({
            [deviceDesc]: e.detail.value,
        })
    },


    updateDevice:function(){
        wx.showLoading({
          title: '正在更新……',
        })
        let params = new Object();
        params.deviceId = this.data.device[0];
        params.deviceName = this.data.device[1];
        params.deviceLoca = this.data.device[2];
        params.groupId = this.data.groups[this.data.ind].id;
        params.deviceDesc = this.data.device[3];
        // console.log(params)
        new Promise((resolve, reject)=>{
          POST_REQ.POST({
            uri: "/update_device",
            params: params,
            success: function (res) {
              // console.log(res.data);
              resolve(res.data);
            },
            fail: function (err) {
              reject(false);
            }
          })
        }).then(()=>{
          let deviceRequest = this.reqDevices();
          deviceRequest.then(res => {
            return this.setGlobalDeviceData(res);
          }).then(res => {
            for (let i in res) {
              if (res[i][0] == null) {
                res.splice(parseInt(i), i);
              }
            }
            wx.setStorageSync("deal-device-key", res);
          }).then(()=>{
            wx.hideLoading();
          }).catch(e => {
            console.log(e);
          })
        });
    },


  /***********************************************************************
   *    Device
   ***********************************************************************/
    reqDevices: function () {
      var that = this;
      let params = new Object();
      params.id = wx.getStorageSync("userinfo").id;
      return new Promise((resolve, reject) => {
        GET_REQ.GET({
          uri: "/devices",
          params: params,
          success: function (res) {
            resolve(res.data.GroupId);
          },
          fail: function (err) {
            reject(false);
          }
        })
      })
    },

    //将设备的信息转化为更为合适的格式
    setGlobalDeviceData: function (data) {
      let temp = null;
      let deviceIndex = 0;
      let sensorCount = 0;
      let devices = [];
      let device = [];
      let dataflow = [];
      let dataInDF = [];
      for (let i in data) {
        if (i == 0) {
          temp = data[i].did;
          this.pushData(device, data, i, dataflow, dataInDF, sensorCount);
          sensorCount++;
        }
        else {
          if (temp != data[i].did) {
            temp = data[i].did;
            device.push(sensorCount);
            device.push(dataflow);
            device.push(dataInDF)
            devices.push(device);

            sensorCount = 0;
            device = [];
            dataflow = [];
            dataInDF = [];
            this.pushData(device, data, i, dataflow, dataInDF, sensorCount);

            deviceIndex++;
            sensorCount++;
          } else {
            dataflow.push(data[i].sdataflow);
            dataInDF.push(0);
            sensorCount++;
          }
        }
      }

      device.push(sensorCount);
      device.push(dataflow);
      device.push(dataInDF);
      devices.push(device);

      return devices;
    },

    pushData: function (device, data, i, dataflow, dataInDF, sensorCount) {
      if (sensorCount == 0) {
        device.push(data[i].did);
        device.push(data[i].dname);
        device.push(data[i].dloca);
        device.push(data[i].ddesc);
        device.push(data[i].gid);
        device.push(data[i].gname);
        device.push(data[i].odid);
      }
      dataflow.push(data[i].sdataflow);
      dataInDF.push(0);
    },

})