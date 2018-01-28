// pages/manager/manager.js

const my_config = require("../../commons/config.js");
const util = require("../../utils/util.js");
const POST_REQ = require("../../request/postReq.js");
const GET_REQ = require("../../request/getReq.js");
var app = getApp() 
Page({
  data: {
    devices: null,
    deviceNames: null,
    sensors: null,
    gnames: null,
    deviceSelected: true,
    groupSelected: false,
    groups: null,
    inputinfo: "",
    addGroup: 0,
    animationData: "",
    showModalStatus: false 
  },
  onLoad: function () {
    var that = this;
    let userId = wx.getStorageSync("userinfo").id;
    
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
        this.deviceInit(userId)
      }
    } catch (e) {

    };

    this.groupInit();
  },
    //初始化设备操作
    deviceInit: function(userId){
        var that =this;
        const requestTask = wx.request({
            url: my_config.host + '/weapp/devices?id=' + userId, //仅为示例，并非真实的接口地址
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
    },

    onShow:function(){
        this.deviceInit(wx.getStorageSync('userinfo').id);
        this.groupInit();
    },

    groupInit: function(){
        var that = this;

        let params = new Object();
        params.id = wx.getStorageSync("userinfo").id;

        GET_REQ.GET({
            uri: "/groups",
            params: params,
            success:function(res){
                let groups = wx.getStorageSync("groups");
                if (!groups) {
                    groups = wx.setStorageSync("groups", res.data.groups)
                }
                that.setData({
                    groups: res.data.groups,
                });
            },
            fail: function(err){
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
    deleteDevice:function(event){
        //由于时间紧迫，只能先按照之前的方案，根据设备名称，找出设备id
        let that = this;
        let dName = event.currentTarget.dataset.dname;
        let devices = wx.getStorageSync("device-key");
        let deviceId = 0;
        for(var i in devices){
            if(devices[i].dname == dName){
                deviceId = devices[i].did;
                break;
            }
        }
        // console.log(deviceId);
        wx.showModal({
        content: "是否删除？",
            success:function(res){
                if(res.confirm){          
                    console.log("yes");

                    //做设备删除操作
                    GET_REQ.GET({
                        uri: "/del_device?deviceId="+deviceId,
                        param: {},
                        success:function(res){
                            console.log(res.data);
                            that.deviceInit(wx.getStorageSync("userinfo").id);
                        },
                        fail:function(err){
                            
                        } 
                    });
                    

                } else if(res.cancel){
                    console.log("no");
                }
            }
        })
    },

  deviceDetail:function(event){
    var name = event.currentTarget.dataset.dname;
    wx.navigateTo({
      url: '../manager-modify-add/manager-modify-device/manager-modify-device?name='+name,
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
                console.log(err);
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