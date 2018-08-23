'use strict';
const path = require('path')
module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1520320676232_6910';

    // add your config here
    config.middleware = ['errorHandler', 'adminCheck'];

    config.errorHandler = {
        match: '/'
    }

    config.adminCheck = {
        match: '/api'
    }
    config.multipart = { //上传大小限制
        fileSize: '100mb',
        fields: 1000,//最多1000个字段
        fieldSize: '10mb',//字段最大10兆
        whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.bmp']


    }

    config.static = {
        prefix: '/upload/',
        dir: path.join(appInfo.baseDir, '/upload'),
    }


    config.security = {
        csp: {
            enable: true,
        },
        csrf: {
            useSession:true,
            ignore: '/api/login',
            headerName: 'x-csrf-token', // request csrf token's name in header
        },
    }

    config.defaultLocale = 'zh-CN'

    exports.mongoose = {
        url: 'mongodb://127.0.0.1/businessSystem',
        options: {
            auto_reconnect: true,
            poolSize: 5
        },
    };

    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 1,
        }
    }

    config.session = {
        maxAge: 30 * 60 * 1000, // 30分钟超时
        key: 'zs_key',
        httpOnly: true,
        encrypt: false,
        renew: true
    };

    return config;
};


