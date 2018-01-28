let setGroupData = (data)=>{
    try {
        wx.setStorageSync("groups", data)
    } catch (e) {

    }
}

let setDeviceData = (data)=>{
    try{
        wx.setStorageSync("device-key", data)
    } catch(e){

    }
}

let setUserinfo = (data)=>{
    try {
        wx.setStorageSync("userinfo", data)
    } catch (e) {

    }
}

module.exports = {
    setGroupData: setGroupData,
    setDeviceData: setDeviceData,
    setUserinfo: setUserinfo,    
}