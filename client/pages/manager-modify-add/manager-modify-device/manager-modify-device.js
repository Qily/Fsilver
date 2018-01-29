// pages/manager-modify-device/manager-modify-device.js
const my_config = require("../../../commons/config.js");
const POST_REQ = require("../../../request/postReq.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        device: null,
        sensorCount: 0,
        groups2: null,
        ind: 0,
        groupId: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var devices = wx.getStorageSync('device-key');
        console.log(devices);
        let sensorCount = 0;
        let index = 0;
        for(var i in devices){
            if(options.name == devices[i].dname){
                index = i;
                sensorCount++;
            }
        }

        var groups = wx.getStorageSync("groups");
        var groups2 = [];
        let groupId = 0;
        for(var i in groups){
            groups2.push(groups[i].name);
            if(groups[i].name == devices[index].gname){
                groupId = groups[i].id;
            }
        }

        this.setData({
            device: devices[index],
            sensorCount: sensorCount,
            groups2: groups2,
            groupId: groupId,
        })
    },

    getGroupId:function(e){
        this.setData({
            ind: e.detail.value,
            groupId:wx.getStorageSync('groups')[e.detail.value].id
        })
        // console.log(this.data.groupId);
        
    },

    getDeviceName:function(e){
        console.log(e.detail.value);
        let deviceName = 'device.dname';
        this.setData({
            [deviceName]: e.detail.value
        })
    },

    getDeviceLoca:function(e){
        let deviceLoca = 'device.dloca';
        this.setData({
            [deviceLoca]: e.detail.value
        })
    },
    getDeviceDesc:function(e){
        let deviceDesc = "device.ddesc";
        this.setData({
            [deviceDesc]: e.detail.value,
        })
    },


    updateDevice:function(){
        let params = new Object();
        params.deviceId = this.data.device.did;
        params.deviceName = this.data.device.dname;
        params.deviceLoca = this.data.device.dloca;
        params.groupId = this.data.groupId;
        params.deviceDesc = this.data.device.ddesc;
        console.log(params)

        POST_REQ.POST({
            uri: "/update_device",
            params: params,
            success:function(res){
                console.log(res.data);
            },
            fail:function(err){

            }
        })
    }
})