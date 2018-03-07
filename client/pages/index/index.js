//index.js
//获取应用实例
const app = getApp();
const md5 = require('../../utils/md5.js');
const my_config = require("../../commons/config.js");
const GET_REQ = require("../../request/getReq.js");

Page({
  data: {
    username: '',
    password: '',
  },
  onLoad:function(opts){
  },

  enter:function(){
    wx.showLoading({
      title: '登陆中……',
    });

    //用Promise处理程序保证在进入界面之前数据已经获取到并且已经放在Storage中
    //这里存储的是用户信息数据：如test06用户对应的密码是234234，且id为6
    let metUserRequest = this.getMetUserInfo(this.data.username);
    metUserRequest.then((res)=>{
      return this.judgeUser(res);
    }).then(res=>{
      if(res == 1){
        wx.switchTab({
          url: '../home/home'
        });
      }

    })
    //这里用于初始化组别数据
    //由于下面的数据要用到上面函数所获得的结果，所以要将这个过程放在then()中
    .then(()=>{
      let groupRequest = this.reqGroups();
      groupRequest.then(res => {
        wx.setStorageSync("groups", res);
      }).catch(e => {

      });
    }).then(()=>{
      let deviceRequest = this.reqDevices();
      deviceRequest.then(res=>{
        return this.setGlobalDeviceData(res);
      }).then(res=>{
        wx.setStorageSync("deal-device-key", res);
      })
    }).then(()=>{
      wx.hideLoading();
    }).catch(e=>{

    })
  },

  //将所有数据处理好后再进入home页面
  judgeUser: function(res){
    let judgeRes = -1;
    if (res.data.userinfo.length == 0) {
      wx.showToast({
        title: '用户名错误',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    } else {
      if (res.data.userinfo[0].password == this.data.password) {
        judgeRes = 1;
        //当用户名和密码正确之后，将用户名和id存入到Storage中作为session
        let value = res.data.userinfo[0];
        wx.setStorageSync("userinfo", value);
      } else {
        wx.showToast({
          title: '密码错误',
          image: '../../images/icon/error.png',
          duration: 2000
        })
      }
    }
    return judgeRes;
  },

  bindUsernameInput:function(e){
    this.setData({
      username: e.detail.value
    })
  },

  bindPasswordInput: function (e) {
    let passMd5 = md5.hex_md5(e.detail.value);
    this.setData({
      password: passMd5
    })
  },

  //向后台发起请求，根据用户名获取相应的用户信息
  getMetUserInfo: function (username) {
    let that = this;
    return new Promise((resolve, reject)=>{
      wx.request({
        url: my_config.host + "/weapp/userinfo?username=" + username,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "GET",
        success: (res)=>{
          resolve(res);
        },
        fail: ()=>{
          reject(false);
        }
      });
    });
  },

  /***************************************************************************
   *    Group
   ***************************************************************************/
  reqGroups:function() {
    var that = this;
    let params = new Object();
    params.id = wx.getStorageSync("userinfo").id;
    return new Promise((resolve, reject)=>{
      GET_REQ.GET({
        uri: "/groups",
        params: params,
        success: function (res) {
          resolve(res.data.groups);
        },
        fail: function (err) {
          reject(false);
        }
      })
    })
  },

  /***********************************************************************
   *    Device
   ***********************************************************************/
  reqDevices:function(){
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
setGlobalDeviceData:function(data){
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

  pushData :function(device, data, i, dataflow, dataInDF, sensorCount){
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
