import fsExtra from 'fs-extra'
import path from 'path'

const { existsSync, remove, copy } = fsExtra
const cwd = process.cwd()
// 打包发布路径，谨慎改动
const releaseRelativePath = './public/cms'
const distPath = path.resolve(cwd, 'dist')
const releasePath = path.resolve(cwd, releaseRelativePath)

async function build() {
    if (existsSync(releasePath)) {
        await remove(releasePath)
    }
    console.log(`文件正在复制 ==> ${releaseRelativePath}`)
    try {
        await copyFile(distPath, releasePath)
        console.log(`文件已复制到 ==> ${releaseRelativePath}`)
        // 删除 dist 目录
        await remove(distPath)
    } catch (error) {
        console.log(`\n ${error}`)
    }
}

async function copyFile(sourceDir, targetDir) {
    return new Promise((resolve, reject) => {
        copy(sourceDir, targetDir, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

;(async () => {
    await build()
})()
