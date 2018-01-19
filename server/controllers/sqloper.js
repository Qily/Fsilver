const wrapper = require('co-mysql');
const mysql = require('mysql');
const options = {
  host: 'ttggcc.dot.vip',
  port: 3306,
  database: 'ttggcc',
  user: 'ttggcc',
  password: 'xjwl6677123'
};
let p = wrapper(mysql.createPool(options));

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

let getProducts = async (ctx, next) => {
  console.log("sqlOper::getProducts");
  let queryStr = "SELECT t1.id, t1.title, t1.description, t1.content, t1.imgurl, t2.price, t2.stock, t2.original from met_product t1 LEFT JOIN met_shopv2_product t2 ON t1.id = t2.pid";
  var rows = await p.query(queryStr);
  ctx.body = { "products": rows };
};

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


module.exports = {
  getDevices: getDeviceByUserId,
  getGroups: getGroupByUserId,
  getProducts: getProducts,
  buyProduct: buyProduct,
  cartInfo: cartInfo,
  userinfo: getMetUserinfo,
  scenes: getScenes,
  changePass: changePass,
};