module.exports = app => {
    const {router, controller} = app;

    //登录相关
    router.post('/api/login', controller.admin.login);
    router.post('/api/logout', controller.admin.logout);
    router.post('/api/manage/changePwd', controller.admin.changePwd);
  

    //管理员
    router.get('/api/manage/admin/list', controller.admin.list);
    router.post('/api/manage/admin/edit', controller.admin.edit);
    router.get('/api/manage/admin/roleList', controller.admin.roleList);

    router.post('/api/manage/admin/del', controller.admin.del);
    router.post('/api/manage/admin/changeStatus', controller.admin.changeStatus);
    router.post('/api/manage/admin/resetPwd', controller.admin.resetPwd);
    router.post('/api/manage/admin/changePwd', controller.admin.changePwd);


    //菜单
    router.get('/api/manage/menu/treeMenu', controller.menu.treeMenu);
    router.post('/api/manage/menu/edit', controller.menu.edit);
    router.post('/api/manage/menu/changeStatus', controller.menu.changeStatus);
    router.post('/api/manage/menu/del', controller.menu.del);

    //角色
    router.get('/api/manage/role/list', controller.role.list);
    router.post('/api/manage/role/edit', controller.role.edit);
    router.post('/api/manage/role/del', controller.role.del);

    //商品
    router.get('/api/product/list', controller.product.list);
    router.get('/api/product/userList', controller.product.userList);
    router.post('/api/product/edit', controller.product.edit);
    router.post('/api/product/cancel', controller.product.cancel);
    router.get('/api/product/auditInfo', controller.product.auditInfo);
    router.get('/api/product/score', controller.product.score);

    //催账
    router.get('/api/product/urgeProductList', controller.product.urgeProductList);


    //审核相关
    router.get('/api/audit/list', controller.audit.list);
    router.post('/api/audit/apply', controller.audit.apply);
    router.post('/api/audit/do', controller.audit.do);
    router.get('/api/audit/info', controller.audit.info);



    //消息相关
    router.get('/api/message/list', controller.message.list);
    router.post('/api/message/send', controller.message.send);
    router.post('/api/message/sendAll', controller.message.sendAll);
    router.post('/api/message/read', controller.message.read);

};
