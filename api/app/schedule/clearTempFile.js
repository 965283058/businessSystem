const Subscription = require('egg').Subscription;
const baseDir = process.cwd()
const fs = require('fs');
const path = require('path');

class clearTemptCollage extends Subscription {
    static get schedule() {
        return {
            cron: '0 3 0 * * *',//秒 分 时 天 月 周几
            type: 'all', // 指定所有的 worker 都需要执行,
            immediate: false //项目启动后不要执行
        };
    }

    async subscribe() {
        try {
            runTask()
        } catch (e) {
            this.ctx.logger.error("凌晨3点清理临时文件夹错误：" + e.message)

        }
    }
}

module.exports = clearTemptCollage;


let runTask = ()=> {
    let dirPath = path.join(baseDir, 'upload/temp')
    if (fs.existsSync(dirPath)) {  //检测路径是否存在
        fs.readdir(dirPath, function (err, files) {
            if (!err) {
                files.forEach(file=> {
                    fs.unlink(path.join(dirPath, file))
                })
            }
        })
    }
}

