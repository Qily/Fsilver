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

let getGroupData = () => {
    try {
        return wx.getStorageSync("groups")
    } catch (e) {

    }
}

let getDeviceData = () => {
    try {
        return wx.getStorageSync("device-key")
    } catch (e) {

    }
}

let getUserinfo = () => {
    try {
        return wx.getStorageSync("userinfo")
    } catch (e) {

    }
}

module.exports = {
    setGroupData: setGroupData,
    setDeviceData: setDeviceData,
    setUserinfo: setUserinfo,
    getGroupData: getGroupData,
    getDeviceData: getDeviceData,
    getUserinfo: getUserinfo, 
}