const storage = require("./storSync.js");
const GET_REQ = require("../request/getReq.js");
const my_config = require("../commons/config.js")

let reqDevices= ()=> {
    var userId = wx.getStorageSync("userinfo").id;
    var that = this;
    const requestTask = wx.request({
        url: my_config.host + '/weapp/devices?id=' + userId, //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
            storage.setDeviceData(res.data.GroupId);
        },
        fail: function (err) {
            console.log(err)
        }
    })
}

let reqGroups = ()=>{
    var that = this;
    let params = new Object();
    params.id = wx.getStorageSync("userinfo").id;

    GET_REQ.GET({
        uri: "/groups",
        params: params,
        success: function (res) {
            storage.setGroupData(res.data.groups);
        },
        fail: function (err) {
            console.log(err);
        }
    })
}

module.exports = {
    reqDevices: reqDevices,
    reqGroups: reqGroups,
}