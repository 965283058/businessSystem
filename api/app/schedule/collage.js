const Subscription = require('egg').Subscription;

class setCollage extends Subscription {
    static get schedule() {
        return {
            cron: '0 0 4 * * *',//秒 分 时 天 月 周几
            type: 'all', // 指定所有的 worker 都需要执行,
            immediate: false //项目启动后不要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        let now = Date.now()

        try {

        } catch (e) {

        }
    }
}

module.exports = setCollage;