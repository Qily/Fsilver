let req2Sync = require("../../storage/req2Sync.js");

Page({
    data: {
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 100,
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
        let groupId = this.data.groups[groupIndex].id;
        // console.log(groupId);
        wx.redirectTo({
            url: '../group-device/group-device?groupId=' + groupId,
        })
    }
})