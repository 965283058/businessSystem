export default {

    '/login': {//落地页
        meta: {
            title: '招商业绩登记平台'
        },
        component: (resolve) => {
            require(['pages/account/login'], resolve)
        }
    },

    /*==================管理系统==================*/

    '/': {
        meta: {
            title: '招商业绩登记平台-主页'
        },
        component: (resolve) => {
            require(['pages/index'], resolve)
        },
        children: [
            {
                path: 'home',
                meta: {
                    title: '管理首页'
                },
                component: (resolve) => {
                    require(['pages/home'], resolve)
                }
            },
            {
                path: 'product/add',
                meta: {
                    title: '商品管理-新增'
                },
                component: (resolve) => {
                    require(['pages/product/edit.vue'], resolve)
                }
            },
            {
                path: 'product/edit/:id',
                meta: {
                    title: '商品管理-编辑'
                },
                component: (resolve) => {
                    require(['pages/product/edit.vue'], resolve)
                }
            },
            {
                path: 'product/:status',
                meta: {
                    title: '商品管理'
                },
                component: (resolve) => {
                    require(['pages/product'], resolve)
                }
            },
            {
                path: 'audit/:status',
                meta: {
                    title: '商品审核'
                },
                component: (resolve) => {
                    require(['pages/audit'], resolve)
                }
            },
            {
                path: 'score',
                meta: {
                    title: '业绩统计'
                },
                component: (resolve) => {
                    require(['pages/score'], resolve)
                }
            },
            {
                path: 'urge',
                meta: {
                    title: '收款管理'
                },
                component: (resolve) => {
                    require(['pages/urge'], resolve)
                }
            },
            {
                path: 'account/admin',
                meta: {
                    title: '管理员列表'
                },
                component: (resolve) => {
                    require(['pages/account/admin'], resolve)
                },
            }
            ,
            {
                path: 'account/role',
                meta: {
                    title: '角色列表'
                },
                component: (resolve) => {
                    require(['pages/account/role'], resolve)
                },

            },
            {
                path: 'account/menu',
                meta: {
                    title: '菜单列表'
                },
                component: (resolve) => {
                    require(['pages/account/menu'], resolve)
                },

            }
        ]
    },
}
