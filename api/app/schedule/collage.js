const Subscription = require('egg').Subscription;
const nodeFetch = require("node-fetch")
class autoGetBTC {
    constructor() {
        this.otherMap = new Map()
    }

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
        if (!this.otherMap.has(user.userId)) {
            this.otherMap.set(user.userId, user)
        }
        let infoData = await this.fetch(token, 'https://walletgateway.gxb.io/miner/steal/' + user.userId + '/mine/list')
        for (let info of infoData) {
            if (info.canSteal) {
                let result = await this.fetch(token, 'https://walletgateway.gxb.io/miner/steal/' + user.userId + '/mine/' + info.mineId, 'POST')
                console.info(`收取【${user.nickName}】的${info.symbol}币${result.stealPercent}%,数量${result.stealAmount}`)
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

    async getMyInfo(token) { //获取个人信息
        return await this.fetch(token, 'https://walletgateway.gxb.io/customer/MhioHcR0Enw049t97fv0238248844')
    }

    async getMyBTC(token) {
        let data = await this.fetch(token, 'https://walletgateway.gxb.io/miner/MhioHcR0Enw049t97fv0238248844/mine/list/v2')
        if (data && data.mines) {
            for (let item of data.mines) {
                if (Date.now() >= item.validTime){
                    let oneData = await this.fetch(token, `https://walletgateway.gxb.io/miner/MhioHcR0Enw049t97fv0238248844/mine/${item.id}/v2`)
                    console.info(`收取自己的币[${item.symbol}]：${oneData.drawAmount}`)
                }
            }
        }
    }

    async getMyVoucher(token) {
        let data = await this.fetch(token, 'https://walletgateway.gxb.io/miner/MhioHcR0Enw049t97fv0238248844/mine/cardVoucher/list')
        if (data && data.mines) {
            for (let item of data.mines) {
                try {
                    await this.fetch(token, `https://walletgateway.gxb.io/miner/mine/cardVoucher/gain/${item.id}`)
                    console.info(`收取自己的券[${item.appName}]-[${item.title}]：${oneData.amount}${item.unit}`)
                } catch (e) {

                }
            }
        }
    }

    async  getBTC() {
        let canGet = 0
        let count = 1

        let jiang = 'TWhpb0hjUjBFbncwNDl0OTdmdjAyMzgyNDg4NDQ6MDU4OXFhQXRiQWhpamNXMWdhUVFhT245ODM5'

        this.getMyInfo(jiang)

        this.getMyBTC(jiang)

        do {
            canGet = await this.get(jiang)
            console.info(`第${count}次可收取人数${canGet}`)
            count++
        } while (canGet > 0)
        console.info(`收取偷我的人的币`)
        await this.getOther(jiang)

        console.info(`收取存储人的币`)

        for (let user of this.otherMap) {
            await this.getUserData(jiang, user)
        }
    }
}
const autoGet = new autoGetBTC()


class setCollage extends Subscription {
    static get schedule() {
        return {
            cron: '0 0 */2 * * *',//秒 分 时 天 月 周几   两个小时执行一次
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





