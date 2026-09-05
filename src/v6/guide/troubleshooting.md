# 故障排查

排查 PPX 时先判断属于环境、前端、Python/RPC、PyInstaller 还是安装器，不要同时修改多层。

## 初始化失败

先记录版本：

```bash
python3 --version
node --version
pnpm --version
```

确认网络能访问 npm/PyPI，系统磁盘空间足够，路径不包含异常权限。Linux 还要确认 apt 系统依赖安装成功。

如果初始化中断，确认虚拟环境仍处于激活状态后重新执行 `ppx init`。它不会清理或覆盖业务目录。

## doctor 报包版本不一致

不要手工把 `ppx.toml` 改成已安装版本。先运行：

```bash
ppx update --check
ppx update --dry-run
```

确认目标清单和两个包完整后再更新。如果当前是框架源码仓库，确认 Python 包仍以 editable 方式指向根目录的 `ppx/packages/`。

## 窗口打开但白屏

按顺序检查：

1. 开发模式的 Vite 地址能否在浏览器打开。
2. `development.port` 是否与 Vite 一致。
3. `pnpm -C gui run build` 是否生成 `gui/dist/index.html`。
4. 前端资源是否使用相对路径。
5. Windows 是否安装可用 WebView2 Runtime。
6. 打包资源中是否存在 `web/index.html`。

先用 `ppx build --console` 保留控制台，不要直接反复生成正式安装器。

## `BRIDGE_UNAVAILABLE`

SSR 环境中没有 `window`，或者 `pywebviewready` 已触发但没有可调用的 PPX Bridge。请确认页面由 `ppx dev` 打开的桌面窗口加载，且 Python 端使用当前运行时。普通浏览器没有就绪事件，直接调用通常在默认 30 秒后得到 `TIMEOUT`；示例工作台会显示浏览器预览提示。

## `METHOD_NOT_FOUND`

检查：

- Python 方法是否有 `@api_method("namespace.method")`；
- API 所在模块是否写入 `ppx.toml` 的 `python.modules`；
- 前端名称大小写和命名空间是否一致；
- Python 修改后进程是否已经重启。

## `INVALID_PARAMS`

对象参数名必须与 Python 关键字参数一致。用数组时顺序必须一致。不要传 DOM、Proxy、函数或循环引用对象。

## RPC 超时

短操作超时通常表示 Python 卡住或窗口已关闭。耗时操作不要简单把超时无限增大；应改成后台任务、进度事件和取消 API。

## 打包后缺 Python 模块

这通常是动态导入未被 PyInstaller 自动发现。先确认依赖安装在 `.venv`，再为模块增加 PyInstaller hook/hidden import，并增加打包后启动测试。不要把整个开发环境无选择塞入安装包。

## macOS 无法打开

区分：

- 架构不匹配：arm64 应用不能直接运行在 Intel Mac。
- Gatekeeper 拒绝：需要 Developer ID 签名和公证。
- DMG 损坏：运行 `hdiutil verify build/*_macOS.dmg`。
- 应用启动崩溃：先运行 `ppx build --console` 查看控制台。

## Windows 安装或覆盖异常

确认 `windowsAppId` 没有变化，应用名没有包含安装器不支持的字符，旧进程已关闭，并在普通用户/管理员场景分别测试。WebView2 问题与安装器问题要分开判断。

## Linux 启动失败

检查 GTK3、WebKitGTK、GI 和 glibc 版本。尽量在目标发行版或更旧的兼容基线构建。用以下命令检查 deb：

```bash
dpkg-deb --info build/*_Linux.deb
dpkg-deb --contents build/*_Linux.deb
```

## 更新失败

错误“缺少 ppx-update.json”表示目标 GitHub Release 不是可供当前框架更新的 Release；“缺少 SHA-256”表示 Release asset 不满足完整性要求；“不兼容”则应停止，按目标版本建立新项目，而不是绕过检查。

提交 issue 时附上：操作系统和架构、Python/Node/pnpm 版本、`ppx doctor` 完整输出、复现步骤、错误日志和最小示例。不要上传 Token、用户数据或本机隐私路径。
