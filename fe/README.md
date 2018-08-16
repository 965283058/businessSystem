# 招商系统管理平台

## 开发使用

```
git clone https://github.com/965283058/panic-buy-manage.git // 从仓库上拉取代码
cd panic-buy-manage                                      // 进入项目
npm i                                              // 安装依赖
npm start [port]                                   // 启动项目，参数 port 代表端口，默认是 8888
```

## 上线发布

```
git clone https://github.com/965283058/panic-buy-manage.git // 从仓库上拉取代码
cd panic-buy-manage                                      // 进入项目
npm i                                              // 安装依赖
npm run build                                   // 完成后，dist目录下为要发布的文件
```

## 依赖

Vue  

Vue-router

Vue-http

## 前端服务器配置

### 端口配置

```
打开 webpack.dev.conf.js 文件，找到 port 字段，默认是 8888
修改为任意端口，重新 npm start 即可用新的端口访问前端服务器
```

### 代理配置

```

打开 webpack.dev.conf.js 文件，找到 server 字段，在此字段上添加一个新字段

proxy: {
    host: '',
    match: /^/
}

host 为接口的主机名
match 为正则表达式

Example:

server: {
    port: 8866,
    proxy: {
        host: '192.168.1.226:8089',
        match: /^\/api\//
    }
}

当请求地址: http://localhost:8866/api/getUserId 时
如果配置了代理，那么代理会自动转发到: http://192.168.1.226:8089/getUserId 上
```

## 目录结构

```
/panic-buy-manage
├─┬ build 项目打包文件
├── node_modules // 项目依赖包
├── server // 项目开发本地服务
├─┬ src 
│ ├── components // 组件
│ ├── pages // 页面 
│ ├── plugin // 插件 （封装Ajax等）
│ ├── router // 路由
│ ├── utils // 工具类
│ ├── App.vue // 主文件
│ └── entry.js // 启动文件，给 webpack 使用
├── index.html // 承载各页面的容器
├── package.json // 项目配置文件
 
```



 