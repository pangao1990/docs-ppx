---
layout: home

hero:
  name: PPX
  text: 用 Python + Web 开发三端桌面应用
  tagline: 界面交给 JavaScript，业务交给 Python；窗口、通信、打包和框架更新交给 PPX
  image:
    src: /logo.svg
    alt: PPX
  actions:
    - theme: brand
      text: 十分钟上手
      link: /v6/guide/quick-start
    - theme: alt
      text: 认识 PPX
      link: /v6/guide/introduction
    - theme: alt
      text: 进入 V5 文档
      link: /v5/

features:
  - title: 前端不设限
    details: Vue、React、Angular 或原生 HTML 都可以作为界面；PPX 不绑定任何 UI 框架。
  - title: Python 做业务
    details: 使用 Python 生态完成本地计算、文件处理、人工智能和生信分析，数据不必离开用户电脑。
  - title: 框架与业务分离
    details: 开发者只维护 api、gui 和图片资源，不需要保存窗口入口、spec 或安装器脚本。
  - title: 一条命令启动
    details: ppx dev 自动启动前端、等待服务就绪、加载 Python API 并打开桌面窗口。
  - title: 一键安全更新
    details: ppx update 先检查兼容契约，只更新框架包，绝不覆盖业务源码和用户数据。
  - title: 三端独立打包
    details: 在 Windows、macOS、Linux 分别生成对应安装包，并保留平台签名与真机验收边界。
---

::: info 文档版本
本站默认介绍 PPX 最新版。[V5 归档入口](/v5/)始终保留，旧项目请使用对应的归档教程。
:::

## PPX 解决什么问题？

Web 前端适合制作现代界面，Python 适合数据分析、人工智能、自动化、文件处理和科学计算。PPX 把两者组合成桌面应用：

```text
用户看到的桌面窗口
  └─ Vue / React / Angular / HTML 页面
       └─ ppx-js 调用稳定 RPC
            └─ ppx-py 执行本地 Python 业务
                 └─ pywebview 提供系统窗口
                      └─ PyInstaller 生成可分发应用
```

你不需要自己协调 Vite 和 Python 进程，不需要直接操作 `window.pywebview.api`，也不需要维护 PyInstaller spec、Inno Setup、DMG 或 Debian 打包脚本。

PPX 特别适合以下应用：

- 数据需要留在本机，不能上传到远程服务器；
- 业务依赖 NumPy、Pandas、AI、生信或其他 Python 模块；
- 希望使用成熟 Web 技术制作界面；
- 需要同时发布 Windows、macOS 和 Linux 版本；
- 希望框架以后可以独立更新，而不是每次手工复制文件。

## 第一次使用，从这里开始

按下面顺序阅读，能最快完成第一个可运行应用：

1. [认识 PPX](/v6/guide/introduction)：理解它负责什么、不负责什么。
2. [十分钟快速上手](/v6/guide/quick-start)：创建、启动并完成第一次 Python 调用。
3. [项目结构](/v6/guide/project-structure)：知道每个目录归谁维护。
4. [配置文件](/v6/guide/configuration)：设置应用名称、窗口、业务模块和版本。
5. [Python 业务 API](/v6/guide/python-api)：编写同步或异步 Python 方法。
6. [前端桥接](/v6/guide/frontend-bridge)：在任意前端框架中调用 Python。
7. [三端打包](/v6/guide/packaging)：生成当前操作系统的安装包。

最短使用流程只有五条命令：

```bash
python -m pip install ppx-py==6.0.0
ppx new hello-ppx --frontend vue
cd hello-ppx
ppx init
ppx dev
```

框架包：[ppx-py · PyPI](https://pypi.org/project/ppx-py/) · [ppx-js · npm](https://www.npmjs.com/package/ppx-js)。桌面示例安装包见 [GitHub Releases](https://github.com/pangao1990/PPX/releases)。

## 开发者真正需要维护什么？

普通 PPX 项目的核心只有三个目录：

```text
项目目录/
├── api/          # Python 业务代码和业务资源
├── gui/          # Web 页面
└── ppx/assets/   # Logo、图标和安装背景图
```

另外有两个配置文件：

- `ppx.toml`：应用开发者可以修改；
- `ppx.lock`：由 `ppx update` 维护，不要手工修改。

PPX 内部的运行入口、桥接实现和打包脚本都在 `ppx-py`、`ppx-js` 中。普通项目不会复制这些源码，所以以后升级框架时不需要逐个比较和替换文件。

## 两个框架包

| 包 | 安装位置 | 主要职责 |
| --- | --- | --- |
| `ppx-py` | Python 虚拟环境 | CLI、配置、窗口、RPC 服务端、存储、更新器、PyInstaller 和三端安装器 |
| `ppx-js` | `gui/node_modules` | Bridge 就绪、RPC 调用、超时、requestId、稳定错误和事件订阅 |

Vue、React、Element Plus、Vite 等属于应用前端，不属于这两个框架包。更换 UI 框架不会改变 Python API 的调用协议。

## 先体验，再理解

源码仓库附带可操作的工作台：体验 Python 问候、系统用户名、原生文件和目录选择、本地便签，以及可取消的应用更新。阅读[示例工作台详解](/v6/guide/example-workbench)，逐步对照界面、JavaScript 状态与 Python 接口。

<span id="v6-的常用能力"></span>

## 常用能力

### Python 与 JavaScript 通信

```python
from ppx_py import api_method


@api_method("user.greet")
def greet(name: str):
    return {"message": f"你好，{name}！"}
```

```javascript
import { ppx } from 'ppx-js'

const result = await ppx.call('user.greet', { name: '开发者' })
console.log(result.message)
```

### 系统能力

框架已经提供文件打开与保存、目录选择、窗口最小化/最大化/全屏/关闭、本地 JSON 存储和成品应用更新 RPC。业务页面只需调用 `ppx.call()`。

### 跨平台路径

```python
from ppx_py import app_data_path, resource_path

model = resource_path("models/model.dat")
database = app_data_path("database.sqlite3")
```

同一段代码在开发环境和 PyInstaller 应用中都能找到正确位置，并会阻止绝对路径、`..` 和符号链接越界。

### 框架更新

```bash
ppx update --check
ppx update --dry-run
ppx update
```

兼容更新只替换两个框架包和受管版本信息。不兼容时只输出冲突报告，不修改 Python 业务、前端页面、图片或用户数据。

## V5 文档仍然保留

PPX V5 与 V6 的入口、配置、通信、存储和打包结构不同，不能通过复制 V6 文件覆盖 V5 项目，也不能运行 `ppx update` 跨大版本迁移。

仍在维护旧项目时：

- 从顶部“版本”菜单选择 **V5（归档版本）**；
- 或直接打开 [PPX V5 文档入口](/v5/)；
- 源码固定使用 GitHub 仓库已公开的 [`V5.3.4` 标签](https://github.com/pangao1990/PPX/tree/V5.3.4)。

V5 原有的简介、快速上手、目录、配置、数据库、域间通信、应用更新、打包和 pywebview API 页面都保留原路径。每个 V5 页面顶部都会显示归档提示，并提供返回 V6 的入口。

## 深入理解与参与开发

如果你希望理解 PPX 内部如何工作，继续阅读：

- [总体架构](/v6/internals/architecture)
- [启动与调用链](/v6/internals/lifecycle)
- [安全边界](/v6/internals/security)
- [参与开发](/v6/internals/contributing)
- [故障排查](/v6/guide/troubleshooting)

源代码、问题反馈和变更记录：

- [PPX GitHub 仓库](https://github.com/pangao1990/PPX)
- [提交 Issue](https://github.com/pangao1990/PPX/issues)
- [变更记录](https://github.com/pangao1990/PPX/blob/main/CHANGELOG.md)
