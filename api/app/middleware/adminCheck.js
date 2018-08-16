module.exports = () => {
    return async function adminCheck(ctx, next) {
        if (ctx.path != "/api/login" && ctx.session.admin == null) {
            return ctx.body = {status: -1, message: '登录超时！'}
        }
        await next()
    }
};