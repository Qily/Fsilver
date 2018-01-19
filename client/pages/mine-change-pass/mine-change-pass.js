// pages/mine-change-pass/mine-change-pass.js
const my_config = require("../../commons/config.js");
const md5 = require('../../utils/md5.js');
const util = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        originPass: '',
        changedPass: '',
        rechangedPass: '',
    },
    modifyPass:function(){
        
        if(wx.getStorageSync("userinfo").password != this.data.originPass){
            wx.showToast({
                title: '原始密码错误',
                image: '../../images/icon/error.png',
                duration: 1000,
            })
        } else{
            if (this.data.changedPass != this.data.rechangedPass){
                wx.showToast({
                    title: '两次密码不一致',
                    image: '../../images/icon/error.png',
                    duration: 1000,
                }) 
            } else{
                //这里要做数据库相应的操作
                //TODO
                this.changePwd();
                wx.navigateBack({
                    delta: 1,
                });
            }
                
        }
        
    },

    changePwd:function(){
        var that = this;
        wx.request({
            url: my_config.host + "/weapp/change_pwd",
            data: util.json2Form({userId: wx.getStorageSync("userinfo").id, pwd: that.data.changedPass}),
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success:function(res){
                console.log(res.data);
            },
            fail:function(err){
                console.log(err);
            }
        })
    },

    originPass:function(e){
        let originPass = md5.hex_md5(e.detail.value);
        this.setData({
            originPass: originPass
        })
    },
    changedPass: function (e) {
        let changedPass = md5.hex_md5(e.detail.value);
        this.setData({
            changedPass: changedPass
        })
    },
    rechangedPass: function (e) {
        let rechangedPass = md5.hex_md5(e.detail.value);
        this.setData({
            rechangedPass: rechangedPass
        })
    }
    
})