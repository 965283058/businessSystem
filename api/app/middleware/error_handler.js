module.exports = () => {
    return async function errorHandler(ctx, next) {
        try {
            await next();
        } catch (err) {
            switch (err.status) {
                case -1:
                    ctx.body = {status: err.status, message: err.data}
                    break;
                case 422:
                    ctx.body = {status: err.status, message: '字段验证失败', data: err.data || err}
                    break;
                case 403:
                    ctx.body = {status: err.status, message: err.message}
                    break;

                default:
                    ctx.app.emit('error', err, ctx); // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
                    let status = err.status || 500;
                    // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
                    const message = (status === 500 && ctx.app.config.env === 'prod') ? 'Internal Server Error' : err.message;
                    ctx.body = {status: 500, message};
                    if (ctx.app.config.env === 'prod') {
                        console.error(ctx.request.path, err.message)
                    }
            }
        }
    };
};