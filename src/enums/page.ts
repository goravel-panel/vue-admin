export enum PageEnum {
    // 首页
    INDEX = '/',
    // 登录页面
    LOGIN = '/login',
    // 无权限页面
    Forbidden = '/403',
    // 未找到页面
    NotFound = '/:pathMatch(.*)*',
    // 服务器错误页面
    ServerError = '/500',
}
