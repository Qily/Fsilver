/**
 * ajax 服务路由集合
 */
const controllers = require('../controllers');
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})

//路由测试
router.get('/tes', controllers.sqloper.username);

//云平台交互测试
router.get('/onet', controllers.onet.onetTest);

module.exports = router
