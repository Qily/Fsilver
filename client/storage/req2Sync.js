const app = getApp();
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
            console.log(setGlobalDeviceData(res.data.GroupId));

            storage.setDealDeviceData(setGlobalDeviceData(res.data.GroupId));
        },
        fail: function (err) {
            console.log(err)
        }
    })
}

let setGlobalGroupData=(data)=>{
  
}
//将设备的信息转化为更为合适的格式
let setGlobalDeviceData=(data)=>{
  let temp = null;
  let deviceIndex = 0;
  let sensorCount = 0;
  let devices = [];
  let device = [];
  let dataflow = [];
  let dataInDF = [];
  for(let i in data){
    if(i == 0){
      temp = data[i].did;
      pushData(device, data, i, dataflow, dataInDF, sensorCount);
      sensorCount++;
    } 
    else {
      if(temp != data[i].did){
        temp = data[i].did;
        device.push(sensorCount);
        device.push(dataflow);
        device.push(dataInDF)
        devices.push(device);

        sensorCount = 0;
        device = [];
        dataflow = [];
        dataInDF = [];
        pushData(device, data, i, dataflow, dataInDF, sensorCount);

        deviceIndex++;
        sensorCount++;
      } else{
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
}

let pushData = (device, data, i, dataflow, dataInDF, sensorCount)=>{
  if(sensorCount == 0){
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