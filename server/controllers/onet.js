var request = require('koa2-request');

let onetTest = async (ctx, next) => {
  console.log("MyTest success\n");
  var currTimestamp = new Date().getTime();
  let method = ctx.request.query.method;
  let uri = ctx.request.query.uri;
  let param = ctx.request.query.param;
  let result = await request({
    url: 'http://open.iot.10086.cn/api/jsonpresend?key=Pj3ho%3D07dPOUkQuHVunpJoa5QnA%3D&method='+ method +'&uri='+ uri +'&callback=callback1&_=' + currTimestamp + param,
    // method: 'get',
    headers: {
      'content-type': 'application/json',
      'charset': 'UTF-8'
    },
  });
  console.log(result.body);
  ctx.body = { "_data": result.body };
};

module.exports = {
  onetTest: onetTest,
}
