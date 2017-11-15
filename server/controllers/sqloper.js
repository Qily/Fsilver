var wrapper = require('co-mysql'),
  mysql = require('mysql');
var options = {
  host: 'ttggcc.get.vip',
  port: 3306,
  database: 'ttggcc',
  user: 'ttggcc',
  password: 'xjwl6677123'
};
var pool = mysql.createPool(options),
  p = wrapper(pool);
  
module.exports = {
  username: async (ctx, next) => {
    console.log("MyTest success\n");
    var rows = await p.query("SELECT * from met_user");
    // console.log(rows[0]);
    ctx.body = {"Name":rows[0].username};
  }
};