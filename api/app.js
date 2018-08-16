module.exports = app => {
    app.beforeStart(async() => {
        app.domian = app.config.env == "prod" ? "https://choujiang.58jinbao.com/" : 'http://localhost:7001/'
        const ctx = app.createAnonymousContext();


        await ctx.service.admin.addDeafultSuperAdmin({
            email: "965283058@qq.com",
            name: '姜鹏',
            status: 1,
            power: [],
            job: '超级管理员'
        })
    });
};