const timeout = 35 * 60 * 1000//session超时时间 30分钟
module.exports = app => {
    app.sessionStore = {
        async get(key) {
            try {
                let data = await app.redis.get(key);
                if (!data) return null;
                return JSON.parse(data)
            } catch (e) {
                return null
            }
        },
        async set(key, value, maxAge) {
            await app.redis.set(key, JSON.stringify(value), 'EX', maxAge);
        },
        async destroy(key) {
            await app.redis.del(key);
        }
    };

    app.beforeStart(async() => {
        app.domian = app.config.env == "prod" ? "http://47.94.83.98/" : 'http://localhost:7001/'
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