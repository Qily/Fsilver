/**
 * ajax 服务路由集合
 */
const controllers = require('../controllers');
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})

//路由测试
router.get('/devices', controllers.sqloper.getDevices);

router.get("/groups", controllers.sqloper.getGroups);

router.get("/products", controllers.sqloper.getProducts);

router.post("/buy_product", controllers.sqloper.buyProduct);

router.get("/cart_info", controllers.sqloper.cartInfo);

router.get("/userinfo", controllers.sqloper.userinfo);

router.get("/scenes", controllers.sqloper.scenes);

router.post("/change_pwd", controllers.sqloper.changePass);

router.post("/add_group", controllers.sqloper.addGroup);

router.post("/delete_group", controllers.sqloper.deleteGroup);

router.post("/update_group", controllers.sqloper.updateGroup);

router.get("/del_device", controllers.sqloper.delDevice);

router.post("/add_device", controllers.sqloper.addDevice);

router.post("/update_device", controllers.sqloper.updateDevice);

router.get("/del_cart", controllers.sqloper.delCart);


//云平台交互测试
router.get('/onet', controllers.onet.onetTest);

module.exports = router
