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
        needModGroupIndex: null,
        addGroup: 0,
        animationData: "",
        showModalStatus: false
    },
    onLoad: function () {
        this.onShow();
    },

    onShow: function () {
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

    onPullDownRefresh: function () {
        this.onShow();
    },

    /****************************************************************** */
    getDevices: function () {
        return new Promise((resolve, reject) => {
            let devices = wx.getStorageSync("deal-device-key");
            if (devices) {
                resolve(devices);
            } else {
                reject(false);
            }
        })
    },

    getGroups: function () {
        return new Promise((resolve, reject) => {
            let groups = wx.getStorageSync("groups");
            if (groups) {
                resolve(groups);
            } else {
                reject(false);
            }
        });
    },

    /************************************************************** 
     * 设备相关操作
    */
    //删除设备操作
    delDevice: function (event) {
        let that = this;
        let dName = event.currentTarget.dataset.dname;
        let device = null;
        let devices = this.data.devices;
        let removeIndex = null;
        for (let i in devices) {
            if (dName = devices[i][1]) {
                device = devices[i];
                removeIndex = parseInt(i);
                break;
            }
        }
        wx.showModal({
            content: "是否删除？",
            success: function (res) {
                if (res.confirm) {
                    console.log("--------" + device);
                    wx.showLoading({
                        title: '正在删除设备……',
                    })
                    let reqDelDevice = that.reqDelDevice(device);
                    reqDelDevice.then(res => {
                        //更新后的数据
                        devices.splice(removeIndex, 1);
                        for (let i in devices) {
                            if (devices[i][0] == null) {
                                devices.splice(parseInt(i), 1);
                            }
                        }
                        return devices;
                    }).then(newDevices => {
                        //将缓存的数据更新，也就是在删除远程数据库的同时，将本地的数据和远程数据同步
                        wx.setStorageSync("deal-device-key", newDevices);
                    }).then(() => {
                        //刷新页面，保证当前页面显示的是最新的数据
                        that.onShow();
                    }).then(() => {
                        wx.hideLoading();
                    }).catch(e => {
                        console.log(e);
                    })

                } else if (res.cancel) {
                    console.log("no");
                }
            }
        })

    },
    //后台做删除设备操作请求将数据库也删除
    reqDelDevice: function (device) {
        return new Promise((resolve, reject) => {
            //做设备删除操作（后台请求）
            GET_REQ.GET({
                uri: "/del_device?deviceId=" + device[0],
                param: {},
                success: function (res) {
                    resolve(res);
                },
                fail: function (err) {
                    reject(false);
                }
            });

        })
    },
    //这里是设备更新操作跳转
    deviceDetail: function (event) {
        //更新之前先获取这个设备的基本信息，这样能在更新页面看到更新前的信息，方便修改
        let device = event.currentTarget.dataset.dname;
        wx.navigateTo({
            //这里device是一个数组，如果不JSON.stringify(device)传参过去就是一个字符串
            //接受到后要JSON.parse(device),相当于编码和解码
            url: '../manager-modify-add/manager-modify-device/manager-modify-device?device=' + JSON.stringify(device),
        })
    },

    //这里做的是设备的添加操作，当添加设备按钮触发，调用该函数，调到添加页面填写信息
    deviceAdd: function () {
        wx.navigateTo({
            url: '../manager-modify-add/manager-add-device/manager-add-device',
        })
    },

    /************************* Device Operation Over ***************************************** */



    /**************************************************************************************
     *              设备，组别界面转换操作
     */
    deviceSelected: function (e) {
        this.setData({
            groupSelected: false,
            deviceSelected: true
        })
    },
    groupSelected: function (e) {
        this.setData({
            deviceSelected: false,
            groupSelected: true
        })
    },
    /******************************Shift Operation Over********************************* */
    

    /**********************************************************************************
     *          组别操作相关
     */
    groupDetail: function (event) {
        var group = this.data.groups[event.currentTarget.dataset.gindex];
        // console.log("******************************")
        // console.log(group);

        // this.data.inputinfo = group.name;
        this.setData({
            inputinfo: group.name,
            needModGroupIndex: event.currentTarget.dataset.gindex,
        })

        if (this.data.showModalStatus) {
            this.hideModal();
        } else {
            this.showModal();
        }
    },

    addGroup: function () {
        this.setData({
            inputinfo: "",
            addGroup: 1,
        })
        this.showModal();
    },

    //添加组别，添加组别->点击确定后调用
    addGroupReq: function (inputinfo) {
        
        if(inputinfo == ""){
            wx.showModal({
                title: '',
                content: '输入组别名为空',
            });
            return;
        } else if (true == this.isGroupNameSame(inputinfo)){
            wx.showModal({
                title: '',
                content: '该组名已存在',
            });
            return;
        }
        let that = this;

        let reqAddGroup = this.subAddGroup(inputinfo);
        reqAddGroup.then(res=>{
            //判断写数据库是否成功，成功则更新缓存
            if (res.affectedRows == 1) {
                // that.groupInit();
                let groupRequest = this.reqGroups();
                groupRequest.then(res => {
                    try{
                        wx.setStorageSync("groups", res);
                    }catch(e){
                        console.log("同步组别数据时出错");
                    }
                    
                }).then(()=>{
                    this.onShow();
                }).catch(e=>{
                    console.log("添加设备时出错了")
                })
                // console.log(res);
            } else {
                wx.showToast({
                    title: '添加失败',
                    image: '../../images/icon/error.png',
                    duration: 200,
                    mask: true,
                })
            }
        })
    },

    //添加组别de子函数，供addGroupReq调用
    subAddGroup: function(inputinfo){
        let params = new Object();
        params.userId = wx.getStorageSync("userinfo").id;
        params.name = inputinfo;

        return new Promise((resolve, reject)=>{
            POST_REQ.POST({
                uri: "/add_group",
                params: params,
                success: function (res) {
                    resolve(res.data.addGroupRes)
                },
                fail: function (err) {
                    reject(false);
                }
            })
        })
    },

    //获取组别信息，添加更改删除后需要调用它刷新本地数据以保证数据显示正常
    reqGroups: function () {
        var that = this;
        let params = new Object();
        params.id = wx.getStorageSync("userinfo").id;
        return new Promise((resolve, reject) => {
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

    isGroupNameSame:function(inputinfo){
        let isSame = false;
        let groups = wx.getStorageSync("groups");
        let modGroupIndex = this.data.needModGroupIndex;
        if (modGroupIndex != null){
            groups.splice(modGroupIndex, 1);
        }
        for(let group of groups){
            if(inputinfo == group.name){
                isSame = true;
                break;
            }
        }
        return isSame;
    },

    //更新组别信息
    updateGroupReq: function (inputinfo) {
        let that = this;
        if (inputinfo == "") {
            wx.showModal({
                title: '',
                content: '输入组别名为空',
            });
            return;
        } else if (inputinfo == this.data.groups[this.data.needModGroupIndex].name) {
            return;
        } else if(true == this.isGroupNameSame(inputinfo)){
            wx.showModal({
                title: '',
                content: '该组名已存在',
            });
            return;
        } else{
            let upGroup = this.subUpdateGroup(inputinfo);
            upGroup.then(res => {
                //判断写数据库是否成功，成功则更新缓存
                if (res.affectedRows == 1) {
                    // that.groupInit();
                    let groupRequest = this.reqGroups();
                    groupRequest.then(res => {
                        try {
                            wx.setStorageSync("groups", res);
                        } catch (e) {
                            console.log("同步组别数据时出错");
                        }

                    }).then(() => {
                        this.onShow();
                    }).catch(e => {
                        console.log("更新组别时出错了")
                    })
                    // console.log(res);
                } else {
                    wx.showToast({
                        title: '添加失败',
                        image: '../../images/icon/error.png',
                        duration: 200,
                        mask: true,
                    })
                }
            })
        }
    },

    subUpdateGroup:function(inputinfo){
        let params = new Object();
        params.userId = wx.getStorageSync("userinfo").id;
        params.name = inputinfo;
        params.groupId = this.data.groups[this.data.needModGroupIndex].id;

        return new Promise((resolve, reject) => {
            POST_REQ.POST({
                uri: "/update_group",
                params: params,
                success: function (res) {
                    resolve(res.data.updateGroupRes)
                },
                fail: function (err) {
                    reject(false);
                }
            })
        })
    },
    
    //删除设备函数，确定删除键触发
    deleteGroup: function (event) {
        let that = this;
        let group = this.data.groups[event.currentTarget.dataset.gindex];
        console.log("++++++++++++---------------")
        console.log(event.currentTarget.dataset.gindex);
        wx.showModal({
            content: "是否删除？",
            success: function (res) {
                if (res.confirm) {
                    that.deleteGroupReq(group);
                } else if (res.cancel) {
                    console.log("no");
                }
            }
        })
    },

    //删除设备函数，供deleteGroup函数调用
    deleteGroupReq: function (group) {
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
                    let groupRequest = that.reqGroups();
                    groupRequest.then(res => {
                        try {
                            wx.setStorageSync("groups", res);
                        } catch (e) {
                            console.log("同步组别数据时出错");
                        }
                    }).then(() => {
                        that.onShow();
                    }).catch(e => {
                        console.log("删除设备时出错了")
                    })
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
    /******************************************************************* */



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
        //当addGroup=1时做添加操作。调用的是addGroupReq函数
        if (this.data.addGroup == 1) {
            this.addGroupReq(this.data.inputinfo);
            this.setData({
                addGroup: 0,
                inputinfo: "",
            })
        } else {
            this.updateGroupReq(this.data.inputinfo);
            this.data.inputinfo = "";
        }
        this.hideModal();
    },
    input_content: function (e) {
        this.data.inputinfo = e.detail.value;
    }
    /***************************************************************/
})