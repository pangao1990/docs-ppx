# 认识 PPX

<span id="认识-ppx-v6"></span>

PPX 用 Web 技术绘制界面，用 Python 编写本地业务，再通过 pywebview 和 PyInstaller 把它们组合成 Windows、macOS、Linux 桌面应用。

如果你已经会写 Python，并熟悉 Vue、React、Angular 或原生 HTML 中的任意一种，就可以使用 PPX。你不需要先学习另一套桌面 UI 组件，也不需要从零研究三个操作系统的打包脚本。

## 一句话理解 PPX

把一个 PPX 应用拆开看，它由三层组成：

```text
界面层：gui/ 中的 Web 页面
   ↓ ppx-js 发起 RPC
桥接层：pywebview + ppx-py
   ↓ 只调用显式注册的方法
业务层：api/ 中的 Python 函数
```

页面负责展示、交互和状态；Python 负责本地计算、文件、数据库、AI 等业务；PPX 负责连接两者，并把它们打包成桌面程序。

## 为什么要有 V6？

V5 可以完成 Python + Web 桌面开发，但框架源码、业务代码、配置和打包脚本混在同一个项目里。框架升级时，开发者需要下载新项目，再人工比较和复制文件。这样容易出现三个问题：

1. 不知道哪些是自己的业务文件，哪些是框架文件；
2. 手工覆盖时可能丢失业务修改；
3. Python 和 JavaScript 两侧只更新一部分，造成通信协议不一致。

V6 从结构上解决这些问题。框架实现进入可独立安装的包，普通应用只保存业务和少量配置：

```text
api/          Python 业务
gui/          Web 前端
ppx/assets/   开发者可替换的打包图片
ppx.toml      应用配置
ppx.lock      框架版本锁
```

以后执行 `ppx update` 时，更新的是 `ppx-py`、`ppx-js` 和版本锁，不再把一份新模板覆盖到旧项目。

## 两个包分别做什么？

### ppx-py

`ppx-py` 是 Python 侧完整运行环境，包含：

- `ppx` 命令行；
- `ppx.toml` 读取和严格校验；
- Python 业务模块加载；
- RPC 白名单注册和统一返回格式；
- pywebview 窗口创建；
- 文件对话框、窗口控制、本地存储；
- 框架更新和成品应用更新；
- PyInstaller 配置生成；
- Windows、macOS、Linux 安装器元数据生成与基础验证。

普通开发者只需要从中导入 `api_method`、`resource_path`、`app_data_path`，以及使用 `ppx` 命令。无需理解内部 `Application` 或 `Bridge` 才能开发应用。

### ppx-js

`ppx-js` 是页面侧很小的 ESM 包，包含：

- 等待 pywebview Bridge 就绪；
- `ppx.call()` 调用 Python；
- 一次调用的总超时；
- requestId 生成和透传；
- `PpxError` 稳定错误；
- `ppx.on()` 事件订阅；
- TypeScript 声明。

它不依赖 Vue、React、Element Plus，也不包含任何页面组件。这样同一个 RPC 协议可以用于任意前端。

## 一次 RPC 到底发生了什么？

以页面调用 `user.greet` 为例：

```javascript
const result = await ppx.call('user.greet', { name: '小明' })
```

执行过程是：

1. `ppx-js` 在浏览器侧生成 requestId；
2. 如果 pywebview 尚未就绪，就等待 `pywebviewready`；
3. JavaScript 只调用 Python 暴露的 `Bridge.call(method, params, requestId)`；
4. `ppx-py` 查找显式注册的 `user.greet`；
5. 参数先与 Python 函数签名匹配；
6. 同步函数直接执行，异步函数等待协程完成；
7. 返回值经过严格 JSON 校验；
8. Python 返回统一的成功或失败结构；
9. `ppx-js` 自动解包 `data`，失败则抛出带 code/requestId 的 `PpxError`。

这样页面不必处理 pywebview 的底层细节，Python 也不会把整个业务对象无选择地暴露出去。

## PPX 适合什么？

适合：

- 需要现代 Web 界面的本地工具；
- 数据不适合上传服务器的分析软件；
- 依赖 Python 科学计算、人工智能或生信生态的应用；
- 文件批处理、桌面自动化和内部业务工具；
- 希望用一套业务代码发布三端版本的项目。

不适合：

- 必须获得完全原生控件行为的复杂系统级应用；
- 强依赖移动端 iOS/Android 的项目；
- 要求一个操作系统直接交叉编译另外两个系统安装器的流程；
- 需要绕过系统权限完成完全静默更新的应用。

## 开发者和 PPX 的边界

| 内容 | 谁负责 |
| --- | --- |
| 页面设计、组件、路由、前端状态 | 应用开发者 |
| Python 业务、数据库、模型、远程 API | 应用开发者 |
| Logo、应用图标、DMG 背景 | 应用开发者 |
| 前后端 RPC、窗口生命周期 | PPX |
| PyInstaller 与安装器配置生成 | PPX |
| 框架包兼容更新和失败回滚 | PPX |
| 代码签名、公证、证书和商店规则 | 应用发布者 |
| 三端最终安装、升级、卸载验收 | 应用发布者 |

PPX 会减少重复工程工作，但不会代替应用作者做业务数据迁移、平台证书申请和真机发布验收。

## V5 与 V6 的关系

V6 是全新项目，不兼容 V5，也不提供原地迁移脚本。两代版本的入口、配置、RPC、存储和构建方式不同。

仍在维护 V5 时，请使用：

- [V5 归档文档](/v5/)；
- GitHub 仓库的 [`V5.3.4` 标签](https://github.com/pangao1990/PPX/tree/V5.3.4)。

开始新项目时直接创建 V6 项目。确实需要复用旧项目内容时，只人工迁移已经确认独立的 Python 业务、页面和资源，不要复制 V5 框架文件。

## 建议学习顺序

1. [十分钟快速上手](./quick-start)
2. [项目结构](./project-structure)
3. [配置文件](./configuration)
4. [Python 业务 API](./python-api)
5. [前端桥接](./frontend-bridge)
6. [三端打包](./packaging)

如果只想先看到应用运行，直接进入 [快速上手](./quick-start)。
