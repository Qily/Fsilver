const my_config = require("../commons/config.js");
const util = require("../utils/util.js");

let requestHandler = {
    uri: "",
    params:{},
    success:function(res){

    },
    fail:function(err){

    }
}

function POST(requestHandler){
    var params = requestHandler.params;
    wx:wx.request({
        url: my_config.host + "/weapp" + requestHandler.uri,
        data: util.json2Form(params),
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function(res) {
            requestHandler.success(res);
        },
        fail: function(res) {
            requestHandler.fail(res);
        },
        complete: function(res) {},
    })
}

module.exports = {
    POST: POST,
}