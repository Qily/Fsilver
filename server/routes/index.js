/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})

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
var request = require('koa2-request');

const controllers = require('../controllers')
//路由测试
router.get('/tes', async(ctx, next)=>{
  console.log("MyTest success\n");

  var rows = await p.query("SELECT * from met_user");
  // console.log(rows[0]);

  ctx.body = {"Name":rows[0].username};
})

//云平台交互测试
router.get('/onet', async (ctx, next) => {
  console.log("MyTest success\n");

  var currTimestamp = new Date().getTime();

  let result = await request({
    url: 'http://open.iot.10086.cn/api/jsonpresend?key=Pj3ho%3D07dPOUkQuHVunpJoa5QnA%3D&method=GET&uri=devices/17703392/datastreams&callback=callback1&_=' + currTimestamp,
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'charset': 'UTF-8'
    },
  });
  console.log(result.body);
  ctx.body = { "_data":result.body };
})
module.exports = router
