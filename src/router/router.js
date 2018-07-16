import Main from '@/views/Main.vue';


// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component:resolve => void(require(['@/views/login.vue'],resolve)),// 懒加载 () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component:resolve => void(require(['@/views/error-page/404.vue'],resolve)),// 懒加载 () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component:resolve => void(require(['@/views/error-page/403.vue'],resolve)),// 懒加载 () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component:resolve => void(require(['@/views/error-page/500.vue'],resolve)),// 懒加载 () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component:resolve => void(require(['@/views/main-components/lockscreen/components/locking-page.vue'],resolve)),// 懒加载 () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => void(require(['@/views/home/home.vue'],resolve)),}, // 懒加载() => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component:resolve => void(require(['@/views/own-space/own-space.vue'],resolve)),}, // 懒加载 () => import('@/views/own-space/own-space.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/exam',
        icon: 'ios-infinite',
        name: 'exam',
        access: 0,
        title: '计时管理',
        component: Main,
        children: [
            { path: 'carTable', title: '教练车',access: 0, name: 'carTable', icon: 'link', component: resolve => void(require(['@/views/exam_car/carTable.vue'],resolve)),}, // 懒加载 () => import('@/views/customer-manager/basic_info/basic_infoTable.vue') },
            { path: 'coachTable', title: '教练员',access: 0, name: 'coachTable', icon: 'link', component: resolve => void(require(['@/views/exam_coach/coachTable.vue'],resolve)),},
            { path: 'expenseTable', title: '计费规则',access: 0, name: 'expenseTable', icon: 'link', component: resolve => void(require(['@/views/exam_expense/expenseTable.vue'],resolve)),},
            { path: 'ordersTable', title: '订单',access: 0, name: 'ordersTable', icon: 'link', component: resolve => void(require(['@/views/exam_orders/ordersTable.vue'],resolve)),},
            { path: 'rateCodeTable', title: '优惠券',access: 0, name: 'rateCodeTable', icon: 'link', component: resolve => void(require(['@/views/exam_rateCode/rateCodeTable.vue'],resolve)),},
        ]
    },
    {
        path: '/static',
        icon: 'ios-infinite',
        name: 'static',
        access: 0,
        title: '报表统计',
        component: Main,
        children: [
            { path: 'carTable', title: '教练返利统计',access: 0, name: 'coachRebateTable', icon: 'link', component: resolve => void(require(['@/views/coach_rebate_static/coachRebateTable.vue'],resolve)),},
            { path: 'coachTable', title: '营业额统计',access: 0, name: 'salesTable', icon: 'link', component: resolve => void(require(['@/views/sales_static/salesTable.vue'],resolve)),},
        ]
    },
    {
        path: '/sys-manage',
        icon: 'ios-infinite',
        name: 'sys-manage',
        access: 0,
        title: '系统管理',
        component: Main,
        children: [
            { path: 'functionTable', title: '功能管理',access: 0, name: 'functionTable', icon: 'link', component:resolve => void(require(['@/views/sys-manage/function/functionTable.vue'],resolve)),}, // 懒加载 () => import('@/views/sys-manage/function/functionTable.vue') },
            { path: 'userTable', title: '用户管理', access: 0, name: 'userTable', icon: 'link', component: resolve => void(require(['@/views/sys-manage/user/userTable.vue'],resolve)),}, // 懒加载() => import('@/views/sys-manage/user/userTable.vue') },
            { path: 'roleTable', title: '角色管理', access: 0, name: 'roleTable', icon: 'link', component:  resolve => void(require(['@/views/sys-manage/role/roleTable.vue'],resolve)),}, // 懒加载() => import('@/views/sys-manage/role/roleTable.vue') }
        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
