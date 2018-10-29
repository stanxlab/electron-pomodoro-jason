# Electron-Pomodoro-Jason

个人使用的番茄钟, electron + vue.js + parcel 构建


## 使用说明

- 开发调试
> 需要修改parcel 包下 reload 模块的源码, 屏蔽启用`WebSocket`的地方
```

npm install -g parcel-bundler

# 实时编译js
npm run dev

# 开启调试 electron 
npm start

```

- 正式包
```
# 打包js
npm run buildjs
# 打包windows, 打包后位于 ./OutApp 目录下
npm run package
```

## 代码说明
- `src/webIpc` 下面的目录是不通过`parcel`打包的, 可以使用渲染进程的公共模块,并且负责和main进程通信,全局调用的方式为`webIpc.foo()`
- `src/renderer/entry.js` 为vue代码的入口,需要通过`parcel src/renderer/entry.js`打包到`dist/`目录
- `index.html`中会直接引入`src/webIpc/index.js` 和`dist/entry.js`,`dist/entry.css`

**这种方式并不是很好,是目前的折中方式,因为`parcel`打包时会将渲染进程内的`process`变量编译为`let process = require('process')`, 无法正常使用了,目前没有深究原因**


## TODO: 
- [x] play mp3 audio
- [x] 最小化到托盘时 快捷菜单
- [] setting page
- [] 长时间休息,长休间隔
- [] audio select
- [] 自动更新到最新版本


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