var request = require('koa2-request');

module.exports = {
  onetTest: async (ctx, next) => {
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
    ctx.body = { "_data": result.body };
  }
}
