import vue from '@vitejs/plugin-vue'
import dayjs from 'dayjs'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg
// 应用信息
const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// https://vitejs.dev/config/
export default defineConfig({
    base: '/cms/',
    server: {
        host: '0.0.0.0',
        // 端口号
        port: 9000,
        // 是否允许跨域
        cors: true,
        // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
        warmup: {
            clientFiles: ["./index.html", "./src/{types,hooks,views,layout,components}/*"]
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api'],
                api: 'modern-compiler'
            }
        }
    },
    plugins: [
        vue(),
        vueSetupExtend(),
        AutoImport({
            imports: ['vue', 'vue-router', "pinia"],
            resolvers: [ElementPlusResolver()],
            dts: 'auto-imports.d.ts'
        }),
        Components({
            directoryAsNamespace: true,
            resolvers: [ElementPlusResolver()],
            dts: 'components.d.ts'
        }),
        createStyleImportPlugin({
            resolves: [ElementPlusResolve()]
        }),
        createSvgIconsPlugin({
            iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
            symbolId: 'local-icon-[dir]-[name]'
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        exclude: ['vue-demi']
    },
    build: {
        sourcemap: false,
        reportCompressedSize: false,
        target: 'modules',
        assetsInlineLimit: 4096, // 单位 b，小于此阈值的导入或引用资源将内联为 base64 编码
        chunkSizeWarningLimit: 4096, // 单位 b，chunk 大小警告的限制
        minify: 'terser', // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
        emptyOutDir: true, // 打包前先清空原有打包文件
        // minify 配置为 terser 时必须配置此项
        terserOptions: {
            compress: {
                keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
                drop_console: true, // 生产环境去除 console
                drop_debugger: true // 生产环境去除 debugger
            },
            format: {
                comments: false // 删除注释
            }
        },
        rollupOptions: {
            output: {
                // 静态资源分类打包
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const { names } = assetInfo
                    const name = names && names[0]
                    const suffix = "[name]-[hash].[ext]"
                    let type = "[ext]"
                    if (/\.(jpg|jpeg|png|gif|svg|ico)$/i.test(name)) {
                        type = "img"
                    }
                    return `assets/${type}/${suffix}`
                },
                manualChunks(id) {
                    // 静态资源分拆打包
                    if (id.includes('node_modules')) {
                        const chunkName = id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString()
                        const excludeChunks = [
                            'birpc',
                            'hookable',
                            'dayjs',
                            'memoize-one',
                            'memoize-one.esm',
                            '@floating-ui',
                            '@floating-ui.dom',
                            'lodash-unified',
                            'perfect-debounce',
                            'vue-demi'
                        ]
                        // 避免打包空文件
                        if (excludeChunks.includes(chunkName)) {
                            return ''
                        }
                        return chunkName
                    }
                },
            },
        }
    },
    define: {
        __APP_INFO__: JSON.stringify(__APP_INFO__),
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_HYDRATION__: true,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
})
