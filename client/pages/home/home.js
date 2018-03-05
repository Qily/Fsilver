let req2Sync = require("../../storage/req2Sync.js");

Page({
    data: {
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],

        //用于滚动窗口参数
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 100,

        //用于记录device数据和group数据
        devices: null,
        groups: null,
    },

    onLoad:function(){
        this.updataData();
    },

    onShow:function(){
        
    },

    onPullDownRefresh: function () {
        this.updataData();
    },

    updataData:function(){
        req2Sync.reqGroups();
        req2Sync.reqDevices();
        let devices = null;
        let groups = null;
        try {
            devices = wx.getStorageSync("device-key");
        } catch (e) {

        }
        try {
            groups = wx.getStorageSync("groups");
        } catch (e) {

        }
        this.setData({
            devices: devices,
            groups: groups
        })
        console.log(this.data.groups);
        console.log(this.data.devices);
        wx.stopPullDownRefresh();
    },
    
    groupData:function(e){
        let groupIndex = e.currentTarget.dataset.groupid;
        let groupName = this.data.groups[groupIndex].name;
        // console.log(groupId);
        wx.navigateTo({
            url: '../group-device/group-device?groupName=' + groupName,
        })
    }
})