// pages/manager-modify-device/manager-modify-device.js
const my_config = require("../../../commons/config.js");
const POST_REQ = require("../../../request/postReq.js");
const GET_REQ = require("../../../request/getReq.js");
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

    inputSerial: function (e) {
        this.setData({
            serial: e.detail.value,
        })
    },

    setDeviceDesc: function (e) {
        console.log(e);
        this.setData({
            desc: e.detail.value,
        })
    },
    setDeiveName: function (e) {
        this.setData({
            deviceName: e.detail.value
        })
    },

    setDeviceLoca: function (e) {
        this.setData({
            deviceLoca: e.detail.value
        })
    },
    getSerialByCode: function (e) {
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

    btnAddDevice: function () {
        //验证空
        //验证验证码格式
        // console.log(this.data.serial)
        var that = this;
        if (this.data.serial == '' || this.data.serial.length != 19) {
            wx.showModal({
                title: '唯一标识码有误',
                content: '',
            })
        } else if (this.data.deviceName == '') {
            wx.showModal({
                title: '设备名不能为空',
                content: '',
            })
        } else {
            console.log(this.data.group)
            wx.showLoading({
                title: '正在添加',
            });

            let reqAddDevice = this.reqAddDevice();
            reqAddDevice.then(res => {
                if (res == 1) {
                    // that.deviceUpdate(wx.getStorageSync('userinfo').id)
                    let deviceRequest = this.reqDevices();
                    deviceRequest.then(res => {
                        return this.setGlobalDeviceData(res);
                    }).then(res => {
                        for (let i in res) {
                            if (res[i][0] == null) {
                                res.splice(parseInt(i), i);
                            }
                        }
                        wx.setStorageSync("deal-device-key", res);
                    }).catch(e => {
                        console.log(e);
                    })

                } else if (res == -1) {

                } else if (res == -2) {

                } else {

                }
            }).then(() => {
                wx.hideLoading();
            }).catch(e => {
                console.log(e);
            })

        }

    },

    reqAddDevice: function () {
        return new Promise((resolve, reject) => {
            POST_REQ.POST({
                uri: "/add_device",
                params: {
                    serial: this.data.serial,
                    deviceName: this.data.deviceName,
                    deviceLoca: this.data.deviceLoca,
                    groupId: this.data.group.id,
                    desc: this.data.desc,
                },
                success: function (res) {
                    resolve(res.data.res);
                },
                fail: function (err) {
                    reject(false);
                }
            })
        });
    },

    /***********************************************************************
   *    Device
   ***********************************************************************/
    reqDevices: function () {
        var that = this;
        let params = new Object();
        params.id = wx.getStorageSync("userinfo").id;
        return new Promise((resolve, reject) => {
            GET_REQ.GET({
                uri: "/devices",
                params: params,
                success: function (res) {
                    resolve(res.data.GroupId);
                },
                fail: function (err) {
                    reject(false);
                }
            })
        })
    },

    //将设备的信息转化为更为合适的格式
    setGlobalDeviceData: function (data) {
        let temp = null;
        let deviceIndex = 0;
        let sensorCount = 0;
        let devices = [];
        let device = [];
        let dataflow = [];
        let dataInDF = [];
        for (let i in data) {
            if (i == 0) {
                temp = data[i].did;
                this.pushData(device, data, i, dataflow, dataInDF, sensorCount);
                sensorCount++;
            }
            else {
                if (temp != data[i].did) {
                    temp = data[i].did;
                    device.push(sensorCount);
                    device.push(dataflow);
                    device.push(dataInDF)
                    devices.push(device);

                    sensorCount = 0;
                    device = [];
                    dataflow = [];
                    dataInDF = [];
                    this.pushData(device, data, i, dataflow, dataInDF, sensorCount);

                    deviceIndex++;
                    sensorCount++;
                } else {
                    dataflow.push(data[i].sdataflow);
                    dataInDF.push(0);
                    sensorCount++;
                }
            }
        }

        device.push(sensorCount);
        device.push(dataflow);
        device.push(dataInDF);
        devices.push(device);

        return devices;
    },

    pushData: function (device, data, i, dataflow, dataInDF, sensorCount) {
        if (sensorCount == 0) {
            device.push(data[i].did);
            device.push(data[i].dname);
            device.push(data[i].dloca);
            device.push(data[i].ddesc);
            device.push(data[i].gid);
            device.push(data[i].gname);
            device.push(data[i].odid);
        }
        dataflow.push(data[i].sdataflow);
        dataInDF.push(0);
    },

})