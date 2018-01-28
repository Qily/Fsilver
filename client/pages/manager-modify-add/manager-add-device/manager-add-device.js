// pages/manager-modify-device/manager-modify-device.js
const my_config = require("../../../commons/config.js");
const POST_REQ = require("../../../request/postReq.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        serial: '',
        deviceName: '',
        deviceLoca: '',
        group: null,
        desc: '',
        groups2: null,
        ind: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var groups = wx.getStorageSync("groups");
        var groups2 = [];
        for (var i in groups) {
            groups2.push(groups[i].name);
        }

        this.setData({
            groups2: groups2,
            group: wx.getStorageSync("groups")[0],
        })
    },

    bindPickerChanger: function (e) {
        // console.log(e.detail)
        this.setData({
            ind: e.detail.value,
            group: wx.getStorageSync("groups")[e.detail.value],
        })
        // console.log(this.data.group)
    },

    inputSerial:function(e){
        this.setData({
            serial: e.detail.value,
        })
    },

    setDeviceDesc:function(e){
        console.log(e);
        this.setData({
            desc: e.detail.value,
        })
    },
    setDeiveName:function(e){
        this.setData({
            deviceName: e.detail.value
        })
    },

    setDeviceLoca:function(e){
        this.setData({
            deviceLoca: e.detail.value
        })
    },
    getSerialByCode:function(e){
        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log(res.result)
                that.setData({
                    serial: res.result,
                })
            }
        })
    },
    deviceUpdate: function (userId) {
        var that = this;
        const requestTask = wx.request({
            url: my_config.host + '/weapp/devices?id=' + userId, //仅为示例，并非真实的接口地址
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                try {
                    wx.setStorageSync('device-key', res.data.GroupId);
                } catch (e) {

                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    btnAddDevice:function(){
        //验证空
        //验证验证码格式
        // console.log(this.data.serial)
        var that = this;
        if(this.data.serial == '' || this.data.serial.length != 19){
            wx.showModal({
                title: '唯一标识码有误',
                content: '',
            })
        } else if(this.data.deviceName == ''){
            wx.showModal({
                title: '设备名不能为空',
                content: '',
            })
        } else {
            console.log(this.data.group)
            POST_REQ.POST({
                uri: "/add_device",
                params: {
                        serial: this.data.serial,
                        deviceName: this.data.deviceName,
                        deviceLoca: this.data.deviceLoca,
                        groupId: this.data.group.id,
                        desc: this.data.desc,
                    },
                success:function(res){
                    // console.log(res.data)
                    if(res.data.res == 1){
                        wx.showModal({
                            title: '',
                            content: '添加成功',
                        })
                        that.deviceUpdate(wx.getStorageSync('userinfo').id)
                        wx.switchTab({
                            url: '../../manager/manager'
                        });
                    } else if(res.data.res == -1){

                    } else if(res.data.res == -2){

                    } else{

                    }
                },
                fail:function(err){

                }
            })

        }
        
    }
})