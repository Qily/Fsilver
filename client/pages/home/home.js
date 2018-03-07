const app = getApp();

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

        //用于记录group数据
        groups: null,
    },

    onLoad:function(){
        this.onShow();
    },

    onShow:function(){
      let groups = null;
      new Promise((resolve, reject)=>{
        groups = wx.getStorageSync("groups");
        if(groups){
          resolve(groups);
        } else{
          reject(false);
        }
      }).then(res=>{
        this.setData({
          groups: groups
        })
      }).catch(e=>{
        console.log(e);
      })
    },

    onPullDownRefresh: function () {
        this.onShow();
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