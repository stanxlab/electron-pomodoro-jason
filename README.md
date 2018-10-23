# Electron-Pomodoro-Jason

个人使用的番茄钟, electron + vue.js + parcel 构建


## TODO: 
- play mp3 audio

## build

- TODO: `electron-builder` 无法将`dist` 打包进去

- 生成 package 目录但是没有打包为一个文件
npm run pack

- 生成一个 exe 或者 dmg 文件
npm run dist

- 指定平台和架构
```
# windows 64bit
electron-builder --win --x64
# windows and mac 32bit
electron-builder --win --mac --ia32
```