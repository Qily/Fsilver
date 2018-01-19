const my_config = require("../../../commons/config.js");

let data = {
    sceneData: null,
}

let PaintSingleScene = function(canvasId) {
    var context = wx.createCanvasContext('0')
    
    if (data.sceneData != null){
        console.log(data.sceneData[canvasId])
        context.setStrokeStyle("#888888")
        context.setLineWidth(2)
        context.rect(0, 0, 350, 200)
        context.stroke()
        context.drawImage(data.sceneData[canvasId].img_path, 4, 4, 342, 192);
        context.drawImage("../../../images/icon/monitor_temp.png",
            data.sceneData[canvasId].devices[0].rela_width,
            data.sceneData[canvasId].devices[0].rela_height, 24, 24);
        // console.log(data.sensorData[0])
        context.stroke()
    }
    wx.drawCanvas({
        //画布标识，传入<canvas/>的cavas-id
        canvasId: '0',
        actions: sub_scenes.PaintSingleScene(0).getActions(),
    })
    
}

//将从后台获取的数据整理成程序中可用的数据
let dealSceneData = function(scenes) {
    console.log(scenes);
    let devices = [];
    let sceneDatas = [];
    let count = 0;
    let deviceCount = 0;
    for (var i in scenes) {
        scenes[i].img_path = my_config.methost + "/upload" + scenes[i].img_path.split("/upload")[1];
        scenes[i].rela_width = Math.floor(scenes[i].rela_width * 342) + 4;
        scenes[i].rela_height = Math.floor(scenes[i].rela_height * 192) + 4;
        if (i == 0) {
            var device = {
                deviceId: scenes[i].device_id,
                rela_height: scenes[i].rela_height,
                rela_width: scenes[i].rela_width
            };

            devices.push(device);

            var sceneData = {
                id: scenes[i].id,
                name: scenes[i].name,
                img_path: scenes[i].img_path,
                devices: devices
            };

            sceneDatas.push(sceneData);

        } else if (scenes[i].img_path == scenes[i - 1].img_path) {
            var device = {
                deviceId: scenes[i].device_id,
                rela_height: scenes[i].rela_height,
                rela_width: scenes[i].rela_width
            };
            devices.push(device);
        } else {
            count++;
            devices = [];
            var device = {
                deviceId: scenes[i].device_id,
                rela_height: scenes[i].rela_height,
                rela_width: scenes[i].rela_width
            };

            devices.push(device);

            var sceneData = {
                id: scenes[i].id,
                name: scenes[i].name,
                img_path: scenes[i].img_path,
                devices: devices
            };

            sceneDatas.push(sceneData);
        }
    }
    data.sceneData = sceneDatas;
}

let getScene = function() {
    // var that = this;
    let userId = wx.getStorageSync("userinfo").id;
    // console.log("****************"+ userId +"*************")
    wx.request({
        url: my_config.host + '/weapp/scenes?userId=' + userId,
        method: 'GET',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
            // console.log(res.data.scenes);
            dealSceneData(res.data.scenes);
            console.log(data.sceneData);

            // setInterval(function () {
            //     PaintSingleScene(1);
            // }, 5000)
        },
        fail: function (err) {
            console.log("get scene error:", err);
        }
    })
}

module.exports=({
    PaintSingleScene: PaintSingleScene,
    getScene: getScene,
});