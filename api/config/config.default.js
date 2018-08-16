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
    }

    config.static = {
        prefix: '/upload/',
        dir: path.join(appInfo.baseDir, '/upload'),
    }


    config.security = {
        csp: {
            enable: false,
        },
        csrf: {
            ignore: '/',
            queryName: '_jf_CSRF', // 通过 query 传递 CSRF token 的默认字段为 _csrf
            bodyName: '_jf_CSRF', // 通过 body 传递 CSRF token 的默认字段为 _csrf
        },
    }

    config.defaultLocale = 'zh-CN'

    exports.mongoose = {
        url: 'mongodb://127.0.0.1/businessSystem',
        options: {},
    };

    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 0,
        }
    }

    return config;
};


