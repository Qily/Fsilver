const my_config = require("../commons/config.js");

function GET(requestHandler) {
    var params = requestHandler.params;
    wx: wx.request({
        url: my_config.host + "/weapp" + requestHandler.uri,
        data: params,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: "GET",
        success: function (res) {
            requestHandler.success(res);
        },
        fail: function (res) {
            requestHandler.fail(res);
        },
        complete: function (res) { },
    })
}

module.exports = {
    GET: GET,
}