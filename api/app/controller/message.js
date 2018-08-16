const Controller = require('../core/baseController');

const sendRule = {
    productIds: {type: 'string', required: true},
    content: {type: 'string', required: false, allowEmpty: true}
}

const sendAllRule = {
    type: {type: 'int', required: true},
    content: {type: 'string', required: true}
}


const readRule = {
    id: {type: 'string', required: true}
}


class MessageController extends Controller {

    async send() {
        if (!this.checkPower("message_send")) {
            return
        }
        const {request, service} = this.ctx;
        let params = request.body
        this.ctx.validate(sendRule, params);
        params.productList = params.productIds.split(',')
        delete params.productIds
        let reuslt = await service.message.send(params)
        this.output(reuslt)
    }

    async sendAll() {
        if (!this.checkPower("message_send")) {
            return
        }
        const {request, service} = this.ctx;
        let params = request.body
        this.ctx.validate(sendAllRule, params);
        let reuslt = await service.message.sendAll(params)
        this.output(reuslt)
    }

    async list() {
        if (!this.checkPower("message_list")) {
            return
        }
        const {service} = this.ctx;
        let reuslt = await service.message.list()
        this.output(reuslt)
    }

    async read() {
        if (!this.checkPower("message_read")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(readRule, request.body);

        let reuslt = await service.message.read(request.body.id)
        this.output(reuslt)
    }
}

module.exports = MessageController;
