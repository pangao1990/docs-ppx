# 快速上手

这一章从空目录开始，创建一个带按钮的应用。点击按钮后，JavaScript 会调用 Python，并把 Python 返回的文字显示在窗口中。

## 完成后你会得到什么？

```text
hello-ppx/
├── api/          # Python 业务
├── gui/          # Web 页面
├── ppx/assets/   # 三端图片资源
├── ppx.toml
└── ppx.lock
```

整个过程不需要编写 `main.py`、创建 pywebview 窗口或配置 PyInstaller。

## 1. 准备环境

安装 Python 3.10+、Node.js 22.13+、pnpm 11.x。图像处理依赖使用已修复安全问题的 Pillow 12.3.0，因此不再支持 Python 3.9。旧环境请用新版 Python 重新创建虚拟环境，不要直接复制旧环境目录。建议每个项目使用独立虚拟环境：

```bash
python --version
node --version
pnpm --version
```

期望至少为：

- Python 3.10；
- Node.js 22.13；
- pnpm 11.x。

每个应用创建独立虚拟环境：

```bash
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

激活后，终端中的 `python` 和 `ppx` 都应来自这个环境。可以用以下命令确认：

```bash
python -c "import sys; print(sys.executable)"
```

Linux 还需要 GTK3、WebKitGTK 和 PyGObject。Windows 正式打包需要 Inno Setup 6；暂时只开发和运行时可以稍后安装打包工具。

## 2. 安装 ppx-py

当前版本正式发布后：

```bash
python -m pip install ppx-py==6.0.0
ppx --version
```

应该看到 `PPX 6.0.0`。

::: warning 从源码体验
当前版本仍处于发布候选阶段。如果 PyPI/npm 尚未提供两个新包，请不要安装同名的非正式内容，改用下面的源码方式。
:::

从源码运行框架仓库：

```bash
git clone https://github.com/pangao1990/PPX.git
cd PPX
python -m venv .venv
source .venv/bin/activate       # Windows 使用 .venv\Scripts\Activate.ps1
python -m pip install -e ppx/packages/ppx-py
pnpm install
ppx doctor
ppx dev
```

如果你的目标是开发自己的应用，两个包发布后优先使用 `ppx new`；源码仓库主要服务于 PPX 框架贡献者。

## 3. 创建项目

```bash
ppx new hello-ppx --frontend vue
cd hello-ppx
```

`--frontend` 可选：

| 值 | 生成内容 | 适合谁 |
| --- | --- | --- |
| `vanilla` | HTML + CSS + JavaScript | 想要最少依赖或使用其他框架 |
| `vue` | Vue 3 + Vite | Vue 开发者 |
| `react` | React + Vite | React 开发者 |

不写 `--frontend` 时默认使用 `vanilla`。三种模板都不会复制 PPX 框架源码。

如果目标目录需要单独指定：

```bash
ppx new "Hello PPX" --directory ./desktop-app --frontend react
```

## 4. 初始化并诊断

```bash
ppx init
```

执行顺序：

1. 如果 `api/requirements.txt` 有业务依赖，就安装到当前 Python 环境；
2. 在项目根目录运行 `pnpm install`；
3. 执行 `ppx doctor`。

最后应看到所有诊断项通过。出现失败时先按提示修复，不建议跳过 doctor 直接进入打包。

## 5. 启动应用

```bash
ppx dev
```

PPX 启动 Vite、等待配置端口可访问、导入业务 API，再创建 pywebview 窗口。退出桌面窗口后，PPX 会回收它启动的前端进程。

正常情况下会看到模板页面和“调用 Python”按钮。点击按钮，页面会显示 Python 返回的问候语。

普通浏览器没有 pywebview Bridge。直接调用 RPC 时，默认等待 30 秒后返回 `TIMEOUT`；源码工作台会提前显示浏览器预览提示并禁用桌面操作。真实 RPC 请在 `ppx dev` 打开的桌面窗口中测试。

## 6. 理解第一次调用

编辑 `api/api.py`：

```python
from ppx_py import api_method


@api_method("user.greet")
def greet(name: str):
    return {"message": f"你好，{name}！"}
```

`@api_method("user.greet")` 做了两件事：

- 明确允许页面调用这个函数；
- 给函数一个不依赖 Python 文件名的稳定 RPC 名称。

没有装饰器的辅助函数不会暴露给页面。

Vanilla 模板编辑 `gui/src/main.js`；Vue 模板使用 `App.vue`，React 模板使用 `App.jsx`。三者调用方式相同：

```javascript
import { ppx } from 'ppx-js'

const result = await ppx.call('user.greet', { name: 'PPX' })
console.log(result.message)
```

这里的对象键 `name` 与 Python 参数 `name` 一致。成功时 `ppx-js` 直接返回 Python 的业务结果；失败时抛出 `PpxError`。

开发者无需写 `main.py`、创建窗口或注册 Bridge。`ppx.toml` 中的 `python.modules` 决定加载哪些业务模块。

## 7. 修改应用信息

打开 `ppx.toml`，至少把下面内容改成自己的应用信息：

```toml
[project]
name = "Hello PPX"
slug = "hello-ppx"
version = "0.1.0"
identifier = "com.your-company"
developer = "Your Name"
description = "我的第一个 PPX 应用"
website = "https://example.com"
```

`windowsAppId` 是 Windows 识别同一应用的重要标识。它由脚手架自动生成，后续版本不要随意更改。

## 8. 增加业务依赖

把 Python 业务依赖写入 `api/requirements.txt`：

```text
pandas==2.3.3
```

然后重新执行：

```bash
ppx init
```

前端依赖仍使用 pnpm，例如：

```bash
pnpm --dir gui add dayjs
```

不要把业务依赖写进 `ppx-py`，也不要修改框架包源码。

## 9. 准备图标

准备一张至少 512×512 的方形 PNG、JPEG 或 WebP：

```bash
ppx icon ./app-icon.png
```

命令会生成：

- `ppx/assets/logo.png`；
- `ppx/assets/logo.ico`；
- `ppx/assets/logo.icns`。

DMG 背景图 `dmg-background.png` 需要单独设计，不会被图标命令覆盖。

## 10. 检查和打包

```bash
ppx doctor
ppx build --console   # 调试应用
ppx build             # 当前系统正式安装包
```

`--console` 用于排查启动异常，不制作正式安装器。正式命令会构建 GUI、执行 PyInstaller、生成当前系统安装包并做基础验证。

一个系统只能真实构建自己的安装包：Windows 生成 `.exe`，macOS 生成 `.app`/`.dmg`，Linux 生成 `.deb`。三端发布必须在三种系统上分别构建和真机验收。

## 下一步

- 先看 [项目结构](./project-structure)，避免把业务和框架代码混在一起；
- 再看 [Python API](./python-api) 和 [前端桥接](./frontend-bridge)；
- 发布前完整阅读 [三端打包](./packaging) 和 [CI 与发布](./ci-release)。
