// pages/manager-modify-device/manager-modify-device.js
const my_config = require("../../../commons/config.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        group: null,
        device: null,
        sensorCount: 0,
        groups2: null,
        ind: 0,
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
        for(var i in groups){
            groups2.push(groups[i].name);
        }

        this.setData({
            device: devices[index],
            sensorCount: sensorCount,
            groups2: groups2,
        })
    },

    bindPickerChanger:function(e){
        this.setData({
            ind: e.detail.value
        })
    },
})