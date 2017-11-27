const wrapper = require('co-mysql');
const mysql = require('mysql');
const options = {
  host: 'ttggcc.get.vip',
  port: 3306,
  database: 'ttggcc',
  user: 'ttggcc',
  password: 'xjwl6677123'
};
let p = wrapper(mysql.createPool(options));




let getDeviceByUserId = async(ctx, next)=>{
  console.log("sqloper::getDeviceByUsername");
  let userId = ctx.request.query.id;
  let queryStr = "SELECT t1.id, t1.username,  t2.name as gname, t3.id as did, t3.name as dname, t3.location as dloca, t5.data_flow as sdataflow \
  from met_user t1 RIGHT JOIN met_userdata_group  t2 ON t1.id = t2.create_man_id  LEFT JOIN met_userdata_device t3 ON t2.id = t3.group_id\
  LEFT JOIN met_userdata_sensor t4 ON t3.id = t4.device_id  LEFT JOIN met_userdata_type t5 ON t5.id = t4.type_id WHERE t1.id= "+userId;
  var rows = await p.query(queryStr);
  // var rows = await p.query("SELECT * FROM met_userdata_device WHERE ");
  ctx.body = {"GroupId": rows};
};

module.exports = {
  username: getDeviceByUserId,
};