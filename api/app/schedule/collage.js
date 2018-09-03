const Subscription = require('egg').Subscription;
const nodeFetch = require("node-fetch")
class autoGetBTC {
    async fetch(token, url, method = "GET") {
        let res = await nodeFetch(url, {
            method: method,
            headers: {
                Host: 'walletgateway.gxb.io',
                Origin: 'https://blockcity.gxb.io',
                'Accept-Encoding': 'br, gzip, deflate',
                Connection: 'keep-alive',
                Accept: 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 (4328808448)',
                Authorization: token,
                Referer: 'https://blockcity.gxb.io/',
                'Accept-Language': 'zh-CN'
            }
        })
        let objData = await res.json()
        return objData.data
    }

    async  getUserData(token, user) {
        let infoData = await this.fetch(token, 'https://walletgateway.gxb.io/miner/steal/' + user.userId + '/mine/list')
        for (let info of infoData) {
            if (info.canSteal) {
                let result = await this.fetch(token, 'https://walletgateway.gxb.io/miner/steal/' + user.userId + '/mine/' + info.mineId, 'POST')
                //console.info(`收取【${user.nickName}】的币${result.stealPercent}%`)
            }
        }
    }

    async  get(token) {
        let listData = await
            this.fetch(token, 'https://walletgateway.gxb.io/miner/steal/user/list/v2?change=true&hasLocation=true')
        for (let user of listData.list) {
            await this.getUserData(token, user)
        }
        return listData.list.length
    }

    async  getOther(token) {
        let listData = await
            this.fetch(token, 'https://walletgateway.gxb.io/miner/steal/often/list')
        for (let user of listData) {
            await this.getUserData(token, user)
        }
        return listData.length
    }

    async  getBTC() {
        let canGet = 0
        let count = 1

        let jiang = 'TWhpb0hjUjBFbncwNDl0OTdmdjAyMzgyNDg4NDQ6MDU4OXFhQXRiQWhpamNXMWdhUVFhT245ODM5'

        do {
            canGet = await this.get(jiang)
             console.info(`第${count}次可收取人数${canGet}`)
            count++
        } while (canGet > 0)
         console.info(`收取偷我的人的币`)
        await this.getOther(jiang)
    }
}
const autoGet = new autoGetBTC()



class setCollage extends Subscription {
    static get schedule() {
        return {
            cron: '0 0 * * * *',//秒 分 时 天 月 周几
            type: 'all', // 指定所有的 worker 都需要执行,
            immediate: true //项目启动后执行一次
        };
    }

    async subscribe() { // subscribe 是真正定时任务执行时被运行的函数
        try {
            await  autoGet.getBTC()
        } catch (e) {

        }
    }
}

module.exports = setCollage;





