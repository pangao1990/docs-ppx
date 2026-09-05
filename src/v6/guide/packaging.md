# 三端打包

PPX 把重复的 PyInstaller 和安装器配置收进 `ppx-py`。应用开发者维护业务、配置和图片，框架在构建时生成其余文件。

## 打包前准备

先确认：

```bash
ppx doctor
pnpm -C gui run build
```

至少检查：

- `ppx.toml` 中的名称、版本、标识符和开发者信息正确；
- `python.modules` 包含所有业务入口；
- `api/requirements.txt` 中的业务依赖已安装；
- `ppx/assets/` 中四张必要图片存在；
- 当前平台安装器工具已安装；
- GUI 的生产构建可以完成。

不要等到正式发布当天才第一次运行 PyInstaller。动态导入、原生库和模型资源的问题通常只有打包后才能发现。

## 调试构建与正式构建

```bash
ppx build --console   # 调试应用
ppx build             # 正式应用、安装包、自动校验
```

`--console` 保留控制台，方便观察 Python 导入错误、缺失动态库和业务异常。它只生成当前平台应用，不继续制作正式安装器。

正式构建在应用成功后继续制作安装包，并执行当前平台可用的基础校验。正式构建失败会返回非零退出码。

## 构建过程

构建顺序固定为：

1. 执行 `pnpm -C gui run build`；
2. 在 `build/cache/` 生成框架内部入口 `ppx_entry.py`；
3. 根据当前平台生成 PyInstaller spec；
4. 把 GUI 产物映射到包内 `web/`；
5. 把 `api/resources/` 映射到包内 `resources/`；
6. 收集 `ppx.toml` 和 `python.modules` 中的业务模块；
7. 生成当前系统可执行应用；
8. 正式模式继续生成安装器；
9. 校验安装包文件存在、大小和格式头，macOS 额外运行 `hdiutil verify`。

框架不会把 `api/requirements.txt` 本身当成运行依赖安装。必须先在打包使用的虚拟环境中执行 `ppx init`。

## 开发者需要维护的文件

开发者只维护 `ppx.toml` 与 `ppx/assets/`。Windows 使用 `logo.ico` 和系统安装的 Inno Setup 6；macOS 使用 `logo.icns`、`dmg-background.png` 和 dmgbuild，完成后调用 hdiutil 校验；Linux 使用 `logo.png` 和 dpkg-deb。spec、iss、DMG 配置、control 与 desktop 文件都由 `ppx-py` 临时生成。

构建缓存可以删除，不应作为业务源码修改：

```text
build/cache/
├── ppx_entry.py
├── ppx.spec
├── installer.iss       # Windows
├── dmg_settings.py     # macOS
└── deb/                # Linux
```

如果需要新的通用打包能力，应修改 `ppx-py` 并补测试；不要把缓存文件复制回普通项目作为长期模板。

## 用一张主图生成三端图标

不需要分别制作三种图标。准备一张至少 512×512 的方形 PNG、JPEG 或 WebP 主图；需要透明背景时使用 PNG 或 WebP。然后运行：

```bash
ppx icon ./app-icon.png
```

PPX 会在 `ppx/assets/` 生成 1024 像素 PNG、多尺寸 ICO 和 ICNS。`dmg-background.png` 及其他业务图片不会被覆盖；建议把设计主图保存在 `ppx/assets/` 之外。

Pillow 只用于执行 `ppx icon`。PPX 的打包配置会跳过 Pygments 中未使用的图片格式化器，避免仅仅因为图标工具就把整套 Pillow 收进成品；如果你的 `api/` 业务代码主动导入 Pillow，PyInstaller 仍会识别并完整收集它。

## Windows

### 要求

- Windows 构建机；
- Python、Node、pnpm 和项目依赖；
- Inno Setup 6；
- 用于运行页面的 WebView2 Runtime。

PyInstaller 先生成应用目录，Inno Setup 再生成：

```text
build/应用名-V版本_Windows.exe
```

`project.windowsAppId` 决定安装器是否把新版本识别为同一应用。脚手架会生成 GUID；应用发布后不要更改。发布前应在普通用户和管理员环境分别测试安装、覆盖、卸载和桌面快捷方式。

基础校验只检查输出存在、大小合理和 `MZ` 文件头，不能替代真实安装、代码签名和 SmartScreen 测试。

## macOS

PyInstaller 生成：

```text
build/应用名.app
```

正式构建继续生成：

```text
build/应用名-V版本_macOS.dmg
```

DMG 使用 `logo.icns` 和 `dmg-background.png`，并放置指向 `/Applications` 的快捷方式。完成后运行 `hdiutil verify` 检查镜像结构和校验和。

PyInstaller 的临时签名或 `codesign --verify` 通过，不等于可以公开分发。正式发布通常还需要：

1. Apple Developer ID Application 证书；
2. 对 `.app` 及嵌套内容正确签名；
3. 提交 Apple 公证；
4. stapler 附加公证票据；
5. 在一台没有开发环境的 Mac 上测试 Gatekeeper。

还要分别考虑 Apple Silicon 和 Intel 架构。当前机器生成的应用不会自动变成另一架构版本。

## Linux

Linux 使用 PyInstaller 单文件模式，再放入 Debian 包：

```text
build/应用名-V版本_Linux.deb
```

构建机需要 GTK3、WebKitGTK、PyGObject 和 `dpkg-deb`。包会把应用安装到 `/opt/<slug>/bin/`，生成 desktop 文件和图标。

可先检查包内容：

```bash
dpkg-deb --info build/*_Linux.deb
dpkg-deb --contents build/*_Linux.deb
```

Linux 二进制对 glibc 和系统 WebKitGTK 比较敏感。尽量在目标发行版或更旧的兼容基线构建，并至少选择一个干净系统安装测试。

## 为什么不能在一个系统打出全部安装包？

PyInstaller 不是通用交叉编译器。Windows 应用依赖 Windows 引导程序和 DLL，macOS 依赖 Mach-O、应用 bundle 和签名，Linux 依赖 ELF 与发行版系统库。

正确做法是使用三端 CI：

```text
同一 Git 提交
├── windows-latest → Windows.exe
├── macos-latest   → macOS.dmg
└── ubuntu-latest  → Linux.deb
```

三个任务必须使用同一应用版本和锁文件。任何一个平台失败，都不要发布“部分成功”的正式版本。

## 业务资源和第三方模块

`python.modules` 中声明的入口会作为 hidden imports 收集。业务资源放入 `api/resources/`，代码使用 `resource_path()` 访问。

第三方库如果在运行时动态导入插件，PyInstaller 可能无法自动识别。排查顺序：

1. 用 `ppx build --console` 查看缺失模块名；
2. 确认模块安装在当前虚拟环境；
3. 检查第三方库官方 PyInstaller hook；
4. 在框架层增加通用 hook/hidden import 支持；
5. 为该场景增加打包后启动测试。

不要为了修一个缺失模块，无选择地收集整个 Python 环境；这会显著增加包体和隐藏不必要依赖。

## 输出文件

默认正式安装包名称：

```text
应用名-V应用版本_Windows.exe
应用名-V应用版本_macOS.dmg
应用名-V应用版本_Linux.deb
```

版本来自 `[project].version`，不是 PPX 框架版本。

## 发布前真机验收

发布前还要在真机完成：安装/卸载、首次启动、Python RPC、文件选择、存储、业务资源读取、升级覆盖、代码签名与系统安全提示检查。CI 构建成功不能替代真机验收。

建议按以下顺序验收：

1. 在无源码、无开发依赖的干净机器安装；
2. 第一次启动并完成核心 RPC；
3. 测试打开/保存文件与目录选择；
4. 写入存储并重启验证；
5. 读取至少一个 `api/resources/` 文件；
6. 从上一版本覆盖升级；
7. 确认用户数据仍存在；
8. 测试卸载和残留策略；
9. 检查系统安全提示和签名信息；
10. 记录产物 SHA-256。

发布流程继续阅读 [CI 与发布](./ci-release)。
