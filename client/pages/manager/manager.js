// pages/manager/manager.js

const my_config = require("../../commons/config.js");
const util = require("../../utils/util.js");
const POST_REQ = require("../../request/postReq.js");
const GET_REQ = require("../../request/getReq.js");

var app = getApp() 
Page({
    data: {
        devices: null,

        deviceSelected: true,
        groupSelected: false,
        groups: null,
        inputinfo: "",
        addGroup: 0,
        animationData: "",
        showModalStatus: false 
    },
    onLoad: function () {
      this.onShow();
    },

    onShow:function(){
      let reqDevices = this.getDevices();
      reqDevices.then(res => {
        this.setData({
          devices: res,
        })
      });
      let reqGroups = this.getGroups();
      reqGroups.then(res => {
        this.setData({
          groups: res,
        })
      }).then(() => {
        console.log(this.data.groups);
      })
    },

    onPullDownRefresh:function(){
        this.onShow();
    },

    /****************************************************************** */
    getDevices: function(){
      return new Promise((resolve, reject)=>{
        let devices = wx.getStorageSync("deal-device-key");
        if(devices){
          resolve(devices);
        } else{
          reject(false);
        }
      })
    },

    getGroups: function(){
      return new Promise((resolve, reject)=>{
        let groups = wx.getStorageSync("groups");
        if(groups){
          resolve(groups);
        } else{
          reject(false);
        }
      });
    },

    delDevice:function(event){
      let that = this;
      let dName = event.currentTarget.dataset.dname;
      let device = null;
      let devices = this.data.devices;
      let removeIndex = null;
      for(let i in devices){
        if(dName = devices[i][1]){
          device = devices[i];
          removeIndex = parseInt(i);
          break;
        }
      }
      wx.showModal({
        content: "是否删除？",
        success:function(res){
          if(res.confirm){
            console.log("--------"+device);
            wx.showLoading({
              title: '正在删除设备……',
            })
            let reqDelDevice = that.reqDelDevice(device);
            reqDelDevice.then(res=>{
              // console.log(res);
              // that.onLoad();
              devices.splice(removeIndex, 1);
              for(let i in devices){
                if(devices[i][0] == null){
                  devices.splice(parseInt(i), 1);
                }
              }
              return devices;
            }).then(newDevices=>{
              wx.setStorageSync("deal-device-key", newDevices);
            }).then(()=>{
              that.onShow();
            }).then(()=>{
              wx.hideLoading();
            }).catch(e=>{
              console.log(e);
            })
            
          } else if(res.cancel){
            console.log("no");
          }
        }
      })
      
    },

    reqDelDevice: function(device){
      return new Promise((resolve, reject) => {
        //做设备删除操作
        GET_REQ.GET({
          uri: "/del_device?deviceId=" + device[0],
          param: {},
          success: function (res) {
            // req2Sync.reqDevices();
            // that.getDeviceName(wx.getStorageSync("device-key"));
            resolve(res);
          },
          fail: function (err) {
            reject(false);
          }
        });

      })
    },

    deviceDetail: function (event) {
      let dName = event.currentTarget.dataset.dname;
      let device = null;
      let devices = this.data.devices;
      let removeIndex = null;
      for (let i in devices) {
        if (dName == devices[i][1]) {
          device = devices[i];
          break;
        }
      }
      console.log(device);
      wx.navigateTo({
        url: '../manager-modify-add/manager-modify-device/manager-modify-device?device=' + JSON.stringify(device),
      })
    },


    /****************************************************************** */




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
      wx.navigateTo({
          url: '../manager-modify-add/manager-add-device/manager-add-device',
      })
  },


  groupDetail:function(event){
    var group = event.currentTarget.dataset.group;
    console.log("******************************")
    console.log(group);

    this.data.inputinfo = group.name;

    if (this.data.showModalStatus) {
        this.hideModal();
    } else {
        this.showModal();
    }
  },

    addGroup: function () {
        this.data.inputinfo = "";
        this.data.addGroup = 1;
        this.showModal();
    },

    addGroupReq:function(inputinfo){
        let that = this;

        let params = new Object();
        params.userId = wx.getStorageSync("userinfo").id;
        params.name = inputinfo;

        POST_REQ.POST({
            uri: "/add_group",
            params: params,
            success: function(res){
                //判断写数据库是否成功，成功则更新缓存
                console.log("-----------------------")
                console.log(res.data.addGroupRes);
                if (res.data.addGroupRes.affectedRows == 1) {
                    that.groupInit();
                } else {
                    wx.showToast({
                        title: '添加失败',
                        image: '../../images/icon/error.png',
                        duration: 200,
                        mask: true,
                    })
                }
            },
            fail: function(err){

            }
        })
    },

    updateGroupReq: function (inputinfo) {

    },

    deleteGroup: function (event) {
        let that = this;
        let group = event.currentTarget.dataset.group;
        wx.showModal({
            content: "是否删除？",
            success: function (res) {
                if (res.confirm) {
                    // console.log("yes");
                    that.deleteGroupReq(group);
                } else if (res.cancel) {
                    console.log("no");
                }
            }
        })
    },

    deleteGroupReq: function(group){
        let groupId = group.id;
        let that = this;
        wx.request({
            url: my_config.host + "/weapp/delete_group",
            data: util.json2Form({ groupId: groupId }),
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                //判断写数据库是否成功，成功则更新缓存
                console.log("-----------------------")
                console.log(res.data.deleteGroupRes);
                if (res.data.deleteGroupRes.affectedRows == 1) {
                    that.groupInit();
                } else {
                    wx.showToast({
                        title: '添加失败',
                        image: '../../images/icon/error.png',
                        duration: 200,
                        mask: true,
                    })
                }
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },

    // *********************************************************************
    // 自定义dialog相关
    showModal: function () {
        // 显示遮罩层  
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    
    hideModal: function () {
        // 隐藏遮罩层  
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    click_cancel: function () {
        console.log("点击取消");
        this.hideModal();
    },
    click_ok: function () {
        console.log("点击了确定===，输入的信息为为==", this.data.inputinfo);
        if(this.data.addGroup == 1){
            this.addGroupReq(this.data.inputinfo);
            this.data.addGroup = 0;
            this.data.inputinfo = "";
        } else{
            this.updateGroupReq(this.data.inputinfo);
            this.data.inputinfo = "";
        }
        this.hideModal();
    },
    input_content: function (e) {
        console.log(e);
        this.data.inputinfo = e.detail.value;
    }
//   ***************************************************************
})