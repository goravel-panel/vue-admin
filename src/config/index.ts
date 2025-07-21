const config = {
    terminal: 1, // 终端
    name: 'goravel-panel', // 名字
    title: '后台管理系统', // 标题
    baseUrl: `${import.meta.env.VITE_APP_BASE_URL || ''}/`, // 接口域名
    urlPrefix: 'backend', // 请求前缀
    secretKey: 'fc37003fa029efc1c5079ede45ff9b7d', // 请求密钥
    timeout: 10 * 1000 // 超时时长
}

export default config
