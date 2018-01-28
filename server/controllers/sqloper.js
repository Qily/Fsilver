const wrapper = require('co-mysql');
const mysql = require('mysql');
const tranquery = require('../middlewares/tranquery.js');

const options = {
  host: 'ttggcc.dot.vip',
  port: 3306,
  database: 'ttggcc',
  user: 'ttggcc',
  password: 'xjwl6677123'
};

let pool = mysql.createPool(options);
let p = wrapper(pool);

let getDeviceByUserId = async(ctx, next)=>{
  console.log("sqloper::getDeviceByUsername");
  let userId = ctx.request.query.id;
  let queryStr = "SELECT t1.id, t1.username,  t2.name as gname, t3.id as did, t3.name as dname, t3.location as dloca, t5.data_flow as sdataflow, t6.onet_device_id as odid \
  from met_user t1 RIGHT JOIN met_userdata_group  t2 ON t1.id = t2.create_man_id  LEFT JOIN met_userdata_device t3 ON t2.id = t3.group_id\
  LEFT JOIN met_userdata_sensor t4 ON t3.id = t4.device_id  LEFT JOIN met_userdata_type t5 ON t5.id = t4.type_id LEFT JOIN met_userdata_onet t6 ON t6.device_id = t3.id WHERE t1.id= "+userId;
  var rows = await p.query(queryStr);
  // var rows = await p.query("SELECT * FROM met_userdata_device WHERE ");
  ctx.body = {"GroupId": rows};
};

let getGroupByUserId = async(ctx, next)=>{
  console.log("sqlOper::getGroupByUserId");
  let userId = ctx.request.query.id;
  let queryStr = "SELECT id, name from met_userdata_group WHERE create_man_id = "+userId;
  var rows = await p.query(queryStr);
  ctx.body = {"groups": rows};
};

let getProducts = async(ctx, next) => {
    // console.log("sqlOper::getProducts");
    // let queryStr = "SELECT t1.id, t1.title, t1.description, t1.content, t1.imgurl, t2.price, t2.stock, t2.original from met_product t1 LEFT JOIN met_shopv2_product t2 ON t1.id = t2.pid";
    // var rows = await p.query(queryStr);
    // ctx.body = { "products": -1 };





    /********************************************************************************** */
    let queryStr = "UPDATE met_userdata_device SET name = 'test3' WHERE id = 94";
    let queryStr2 = "UPDATE met_userdata_device SET name = 'test5' WHERE id = ?";
    let dataList = await tranquery.tranquery2p(pool, queryStr, queryStr2);
    ctx.body = { "products": dataList };

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

}
/*********************************没有transaction的情况******************/
// let myquery = function () {
//     let queryStr = "SELECT t1.id, t1.title, t1.description, t1.content, t1.imgurl, t2.price, t2.stock, t2.original from met_product t1 LEFT JOIN met_shopv2_product t2 ON t1.id = t2.pid";
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 reject(err)
//             } else {
//                 connection.query(queryStr, (err, rows) => {

//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(rows)
//                     }
//                     connection.release()
//                 })
//             }
//         })
//     })
// }




//-------------------------------------------解决了代码的事务问题，但是不好看------------------------------------





//-------------------------------------------解决了代码的事务问题，但是不好看------------------------------------
// let myquery = function () {
//     let queryStr = "SELECT t1.id, t1.title, t1.description, t1.content, t1.imgurl, t2.price, t2.stock, t2.original from met_product1 t1 LEFT JOIN met_shopv2_product t2 ON t1.id = t2.pid";
//     let queryStr2 = "SELECT t1.pid, t1.amount, t2.title, t2.imgurl, t3.price, t3.user_discount FROM met_shopv2_cart t1 LEFT JOIN met_product t2 ON t1.pid = t2.id LEFT JOIN met_shopv2_product t3 ON t1.pid = t3.pid WHERE t1.uid = 7";
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 reject(err)
//             }
//             connection.beginTransaction(function(err){
//                 if(err){
//                     reject(err);
//                 }
//                 try{
//                     let row1 = connection.query(queryStr)
//                     let row2 = connection.query(queryStr2)
//                 } catch(err){
//                     reject(err);
//                 }
                
//                 connection.commit(function(err){
//                     if(err){
//                         return connection.rollback(function(){
//                             throw err;
//                         })
//                     }
//                 })
//                 resolve(rows2);
//             })

//             connection.release()
//         })
//     })
// }






let buyProduct = async (ctx, next) => {
  console.log("sqlOper::buyProduct");
  let userId = ctx.request.body.userId;
  let productId = ctx.request.body.productId;
  let productCount = ctx.request.body.productCount;
  // let queryStr = "SELECT t1.id, t1.title, t1.description, t1.content, t1.imgurl, t2.price, t2.stock, t2.original from met_product t1 LEFT JOIN met_shopv2_product t2 ON t1.id = t2.pid";
  // var rows = await p.query(queryStr);
  // ctx.body = { "products": rows };
  console.log(userId);
};

let cartInfo = async (ctx, next)=>{
  console.log("sqlOper::cartInfo");
  let userId = ctx.request.query.userId;
  let queryStr = "SELECT t1.pid, t1.amount, t2.title, t2.imgurl, t3.price, t3.user_discount FROM met_shopv2_cart t1 LEFT JOIN met_product t2 ON t1.pid = t2.id LEFT JOIN met_shopv2_product t3 ON t1.pid = t3.pid WHERE t1.uid = " + userId;
  var rows = await p.query(queryStr);
  console.log(rows);  
  ctx.body = { "cartInfo": rows };
}

let getMetUserinfo = async (ctx, next)=>{
  let username = ctx.request.query.username;
  // 这里如果是字符串注意在连边加上单引号
  let queryStr = "SELECT id, password FROM met_user WHERE username = '" + username + "'";
  var rows = await p.query(queryStr);
  ctx.body = { "userinfo": rows };
}

let getScenes = async (ctx, next)=>{
    console.log("******************************************sqlOper::GetScenes");    
    let userId = ctx.request.query.userId;
    let queryStr = "SELECT t1.id, t1.name, t1.img_path, t2.device_id, t2.rela_width, t2.rela_height FROM met_userdata_scene t1 LEFT JOIN met_userdata_scene_device t2 ON t1.id = t2.scene_id WHERE t1.create_man_id = " + userId + " ORDER BY t1.img_path ASC";
    var rows = await p.query(queryStr);
    ctx.body = { "scenes": rows };
}

let changePass = async (ctx, next) => {
    let userId = ctx.request.body.userId;
    let pwd = ctx.request.body.pwd;
    // let queryStr = "SELECT t1.id, t1.title, t1.description, t1.content, t1.imgurl, t2.price, t2.stock, t2.original from met_product t1 LEFT JOIN met_shopv2_product t2 ON t1.id = t2.pid";
    // var rows = await p.query(queryStr);
    // ctx.body = { "products": rows };
    let sqlStr = "UPDATE met_user SET password='" + pwd + "' WHERE id="+userId;
    var res = await p.query(sqlStr);
    ctx.body = {"changePass": res};
};

let addGroup = async (ctx, next) => {
    let userId = ctx.request.body.userId;
    let groupName = ctx.request.body.name;

    let sqlStr = "insert into met_userdata_group(name, create_man_id, status) values ('"+ groupName +"', " + userId + ", 1)";
    var res = await p.query(sqlStr);
    ctx.body = {"addGroupRes": res};
}

let deleteGroup = async (ctx, next) => {
    
    let groupId = ctx.request.body.groupId;
    // 这里还要做删除设备传感器等操作的处理
    let sqlStr = "delete from met_userdata_group where id =" + groupId;
    var res = await p.query(sqlStr);
    ctx.body = { "deleteGroupRes": res };
}

let delDevice = async (ctx, next) =>{
    let deviceId = ctx.request.query.deviceId;
    console.log("+++++++++++" + deviceId + "+++++++++++++");
    
    let queryStr1 = "DELETE FROM met_userdata_sensor WHERE device_id =" + deviceId;
    let queryStr2 = "DELETE FROM met_userdata_scene_device WHERE device_id =" + deviceId;
    let queryStr3 = "UPDATE met_userdata_onet SET device_id = null WHERE device_id =" + deviceId;
    let queryStr4 = "DELETE FROM met_userdata_device WHERE id =" + deviceId;
    let dataList = await tranquery.tranquery4p(pool, queryStr1, queryStr2, queryStr3, queryStr4);
    ctx.body = { "res": dataList };
}
//添加设备，事务操作
//在ddwl_device表中查看唯一标识码是否存在
let addDevice = async(ctx, next)=>{
    let serial = ctx.request.body.serial;
    let deviceName = ctx.request.body.deviceName;
    let deviceLoca = ctx.request.body.deviceLoca;
    let groupId = ctx.request.body.groupId;
    let desc = ctx.request.body.desc;
    
    let row = await p.query("SELECT id from met_userdata_ddwl_device WHERE serial_number = '" + serial + "'");
    console.log(row);
    if(row[0].id){
        let queryStr1 = "insert into met_userdata_device(group_id, name, location, serial_number, description) values ("+groupId+", '"+deviceName+"', '"+deviceLoca+"', '"+serial+"', '"+desc+"')";
        // let res = await p.query(queryStr1);
        let res = await subAddDevice(row[0].id, queryStr1);
        if(res.row3[0].id){
            for (var i in res.row3) {
                await p.query("insert into met_userdata_sensor(device_id, type_id) values (" + res.row1.insertId + ", " + res.row3[i].type_id + ")")
            }
            ctx.body = { "res": 1 };
        } else{
            ctx.body = { "res": -2 };
        }
        
        
    } else{
        ctx.body = {"res": -1};
    }


}
//添加设备
let subAddDevice = function (ddwlDeviceId, queryStr1) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                connection.query(queryStr1, (err, rows1) => {
                    if (err) {
                        connection.rollback(function () {
                            reject(err);
                        })
                    }
                    // console.log(row1)
                    connection.query("update met_userdata_onet set device_id=" + rows1.insertId + " where ddwl_device_id = " + ddwlDeviceId, (err, row2) => {
                        if (err) {
                            connection.rollback(function () {
                                reject(err);
                            })
                        }
                        
                        connection.query("select * from met_userdata_ddwl_sensor where device_id = " + ddwlDeviceId, (err, row3) => {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                })
                            }
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        reject(err);
                                    })
                                }
                            })

                            let res = new Object();
                            res.row1 = rows1;
                            res.row2 = row2;
                            res.row3 = row3;
                            resolve(res);
                        })
                    })
                })
            })
            connection.release()
        })
    })
}


module.exports = {
  getDevices: getDeviceByUserId,
  getGroups: getGroupByUserId,
  getProducts: getProducts,
  buyProduct: buyProduct,
  cartInfo: cartInfo,
  userinfo: getMetUserinfo,
  scenes: getScenes,
  changePass: changePass,
  addGroup: addGroup,
  deleteGroup: deleteGroup,
  delDevice: delDevice,
  addDevice: addDevice,
};