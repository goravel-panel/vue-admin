import { ThemeEnum } from '@/enums/app.ts'

const defaultSetting = {
    showCrumb: true, // 是否显示面包屑
    showLogo: true, // 是否显示logo
    showWatermark: true, // 是否显示水印
    isUniqueOpened: true, // 只展开一个一级菜单
    sideWidth: 150, // 侧边栏宽度
    sideTheme: ThemeEnum.LIGHT, // 侧边栏主题
    sideDarkColor: '#1d2124', // 侧边栏深色主题颜色
    openMultipleTabs: false, // 是否开启多标签tab栏
    theme: '#4A5DFF', // 主题色
    successTheme: '#67c23a', // 成功主题色
    warningTheme: '#e6a23c', // 警告主题色
    dangerTheme: '#f56c6c', // 危险主题色
    errorTheme: '#f56c6c', // 错误主题色
    infoTheme: '#909399' // 信息主题色
}
// 以上各种主题色分别对应element-plus的几种行为主题
export default defaultSetting
