const timeout = 35 * 60 * 1000//session超时时间 30分钟
module.exports = app => {
    app.sessionStore = {
        async get(key) {
            const res = await app.redis.get(key);
            if (!res) return null;
            let diff = Date.now() - res.__time
            if (diff > timeout) {
                this.destroy(key)
                return null
            }
            if (diff > 300000) {
                this.set(key, res)
            }
            return JSON.parse(res);
        },
        async set(key, value, maxAge) {
            let expireDate = 30 * 60 * 1000;
            if (value) {
                value.__time = Date.now()
            }
            value = JSON.stringify(value);
            await app.redis.set(key, value, 'EX', expireDate);
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