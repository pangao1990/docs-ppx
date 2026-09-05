# 架构全景

```text
gui 业务页面
   │ import { ppx } from 'ppx-js'
   ▼
ppx-js：就绪、RPC、超时、错误、事件
   │ window.pywebview.api.call
   ▼
ppx-py Bridge：白名单分发、统一响应
   ├── system / storage / applicationUpdate 内置服务
   └── api.* 配置模块中的 @api_method 业务函数
```

`ppx-py` 是完整的 Python 侧产品边界。运行时读取配置、导入业务模块、创建 Bridge 与窗口；开发命令管理 Vite 生命周期；构建命令生成内部入口、PyInstaller spec 和当前平台安装器；更新命令只替换两个已安装包。

`ppx-js` 只使用浏览器标准能力和 pywebview 注入对象，不认识 Vue、React 或 Element Plus。这样任何前端框架都能共享相同通信协议。

源码仓库中的 `ppx/packages/` 用于开发这两个包；普通项目不包含它。开发者项目的 `ppx/` 只有可修改资源。运行态数据写到操作系统应用数据目录，发布资源进入 PyInstaller 临时目录，源码、运行态和生成物互不混放。

兼容性由项目格式、Python API、JavaScript API、数据模式四个维度共同决定。只有全部匹配才能无感更新；否则必须先解决调用或数据冲突。

## 两个包的职责

| 包内模块 | 职责 | 普通开发者是否直接使用 |
| --- | --- | --- |
| `ppx_py.settings` | 解析并验证 `ppx.toml`，计算源码、资源和应用数据路径 | 通常不需要 |
| `ppx_py.runtime` | 创建应用、导入 `[python].modules`、注册业务 API | 不需要 |
| `ppx_py.bridge` | RPC 白名单、参数绑定、统一成功/错误响应、Python 主动事件 | 只使用 `@api_method` |
| `ppx_py.application` | 组合窗口、存储、系统服务与成品更新器 | 不需要 |
| `ppx_py.commands` | `doctor/dev/update/build` 的命令实现 | 只运行命令 |
| `ppx_py.packaging` | 动态生成入口、spec 与三端安装器元数据 | 不需要 |
| `ppx_py.update` | 最终用户的软件安装包检查、下载与摘要校验 | 通过内置 RPC 使用 |
| `ppx-js` | 等待 pywebview、调用 RPC、超时、稳定错误和事件订阅 | 通过 `ppx.call/on/ready` 使用 |

`ppx-py` 和 `ppx-js` 共同实现一套协议，但不互相复制源码。Python 包负责可信业务执行和本机能力，JavaScript 包负责页面侧体验。Vue、React、Element Plus、Vite 等仍属于用户前端项目，既不会进入这两个包的公共 API，也不会限制 PPX 选择其他前端。

## 四类文件的所有权

| 所有者 | 位置 | 更新策略 |
| --- | --- | --- |
| 开发者 | `api/`、`gui/src/`、`ppx/assets/` | PPX 只计算摘要并保护，永不覆盖 |
| 开发者配置 | `ppx.toml`、业务依赖清单 | 只更新 `[framework]` 的精确版本 |
| PPX 管理 | `ppx.lock`、两个包的依赖版本 | `ppx update` 事务式修改，失败回滚 |
| 临时生成 | `build/cache/`、GUI `dist/`、三端构建目录 | 可删除重建，不作为业务源码 |

应用运行数据不属于以上源码目录。`JsonStorage` 写入各系统的用户应用数据目录，成品更新下载到用户下载目录，卸载或重新构建项目都不应误删用户数据。

## 为什么源码仓库比用户项目多目录

PPX 自身也是开源项目，所以维护仓库的 `ppx/packages/` 保存两个待发布包，`ppx/tooling/` 保存测试、发布检查和维护文档。这些目录服务于框架维护者。`ppx new` 从已安装的 `ppx-py` 生成普通项目时只复制可修改的默认图片，不复制框架源码或维护工具。

这使两种视角同时成立：框架维护者可以审查、测试和发布全部实现；应用开发者的工作区则只呈现业务代码、前端页面、配置和品牌图片。
