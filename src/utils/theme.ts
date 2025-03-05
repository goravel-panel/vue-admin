import colors from 'css-color-function'

const lightConfig = {
    'dark-2': 'shade(20%)',
    'light-3': 'tint(30%)',
    'light-5': 'tint(50%)',
    'light-7': 'tint(70%)',
    'light-8': 'tint(80%)',
    'light-9': 'tint(90%)'
}

const darkConfig = {
    'light-3': 'shade(20%)',
    'light-5': 'shade(30%)',
    'light-7': 'shade(50%)',
    'light-8': 'shade(60%)',
    'light-9': 'shade(70%)',
    'dark-2': 'tint(20%)'
}

const themeId = 'theme-vars'

export const generateVars = (color: string, type = 'primary', isDark = false) => {
    const colors = {
        [`--el-color-${type}`]: color
    }
    const config: Record<string, string> = isDark ? darkConfig : lightConfig
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            colors[`--el-color-${type}-${key}`] = `color(${color} ${config[key]})`
        }
    }
    return colors
}

/**
 * @author Jason
 * @description 用于设置css变量
 * @param key css变量key 如 --color-primary
 * @param value css变量值 如 #f40
 * @param dom dom元素
 */
export const setCssVar = (key: string, value: string, dom = document.documentElement) => {
    dom.style.setProperty(key, value)
}

/**
 * @author Jason
 * @description 设置主题
 */
export const setTheme = (options: Record<string, string>, isDark = false) => {
    const varsMap: Record<string, string> = Object.keys(options).reduce((prev, key) => {
        return Object.assign(prev, generateVars(options[key], key, isDark))
    }, {})

    let theme = Object.keys(varsMap).reduce((prev, key) => {
        const color = colors.convert(varsMap[key])
        return `${prev}${key}:${color};`
    }, '')
    theme = `:root{${theme}}`

    // 检查是否存在已有的样式元素
    const existingStyle = document.getElementById(themeId)
    if (existingStyle && existingStyle instanceof HTMLStyleElement) {
        existingStyle.textContent = theme
        return
    }
    // 创建新的样式元素
    const newStyle = document.createElement('style')
    newStyle.setAttribute('type', 'text/css')
    newStyle.setAttribute('id', themeId)
    newStyle.textContent = theme
    document.head.append(newStyle)
}
