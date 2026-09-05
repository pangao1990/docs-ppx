# 项目结构

PPX 用目录边界区分“应用开发者拥有的文件”和“框架管理的能力”。理解这个边界后，开发、更新和排查问题都会简单很多。

## 普通开发者项目

```text
hello-ppx/
├── api/
│   ├── __init__.py
│   ├── api.py                 # 业务 RPC
│   ├── requirements.txt       # 业务 Python 依赖
│   └── resources/             # 随应用分发的业务资源
├── gui/
│   ├── src/                   # 页面业务
│   ├── index.html
│   └── package.json
├── ppx/
│   └── assets/
│       ├── logo.png           # Linux 图标
│       ├── logo.ico           # Windows 图标
│       ├── logo.icns          # macOS 图标
│       └── dmg-background.png # macOS 安装背景
├── package.json
├── pnpm-workspace.yaml
├── ppx.toml
└── ppx.lock
```

只有三个主要目录。`api/`、`gui/src/`、`ppx/assets/` 永远归应用开发者所有，`ppx update` 会在更新前后计算文件摘要，发现变化就回滚受管元数据并报错。

## 每个目录放什么？

### api

`api/` 放所有 Python 业务：

- 带 `@api_method` 的页面接口；
- 数据处理、模型调用和远程 API；
- 数据库和业务迁移；
- `requirements.txt` 中的额外依赖；
- `resources/` 中随应用分发的只读资源。

不要把 PyInstaller spec、窗口入口或 PPX 源码放进这里。

### gui

`gui/` 是独立 Web 前端项目。除了必须提供 `dev`、`build` script 并安装 `ppx-js`，其余技术选择由开发者决定。

页面业务通常放在 `gui/src/`。`gui/dist/` 是生产构建结果，可以随时重新生成，不应手工维护。

### ppx/assets

这里仅保存需要开发者替换的打包图片：

- `logo.png`：Linux 和图标生成源结果；
- `logo.ico`：Windows；
- `logo.icns`：macOS；
- `dmg-background.png`：macOS DMG 背景。

PPX 内部 Python、JavaScript 和安装器代码不放在普通项目的 `ppx/` 中。

## 根目录文件

| 文件 | 用途 | 是否建议手改 |
| --- | --- | --- |
| `ppx.toml` | 应用、窗口、路径、版本和兼容配置 | 是，但不要伪造兼容字段 |
| `ppx.lock` | 两个框架包及契约的精确版本 | 否，由 `ppx update` 管理 |
| `package.json` | 常用命令快捷入口 | 可增加业务命令 |
| `pnpm-workspace.yaml` | 把 `gui` 纳入工作区 | 一般不需要 |
| `.gitignore` | 排除环境、依赖、缓存和构建结果 | 可按项目补充 |

## 谁可以修改什么？

| 范围 | 所有者 | 框架更新行为 |
| --- | --- | --- |
| `api/` | 应用开发者 | 摘要保护，绝不覆盖 |
| `gui/src/` | 应用开发者 | 摘要保护，绝不覆盖 |
| `ppx/assets/` | 应用开发者 | 摘要保护，绝不覆盖 |
| 应用数据目录 | 最终用户 | 不读取、不覆盖 |
| `ppx.toml` | 共同 | 只原子更新框架版本字段 |
| `ppx.lock` | PPX | 成功更新后原子替换 |
| 两个包及依赖锁 | PPX | 按更新清单安装精确版本 |

这就是“兼容更新无感”的基础：框架代码不在业务目录里，所以不需要拿新模板覆盖旧模板。

## 生成目录

`build/`、`gui/dist/`、`node_modules/` 和 `.venv/` 都是生成内容。入口脚本、PyInstaller spec、Inno Setup iss、DMG 配置和 Debian 元数据只会临时出现在 `build/cache/`，不属于项目源码。

```text
.venv/             Python 虚拟环境
node_modules/      pnpm 工作区依赖
gui/node_modules/  前端依赖链接
gui/dist/          Vite 生产输出
build/             PyInstaller 应用、安装包和缓存
```

这些内容不应提交到 Git。需要重新构建时让包管理器和 `ppx build` 重新生成。

## PPX 开源仓库

开源仓库也以 `api/`、`gui/`、`ppx/` 为顶层源码目录，但 `ppx/` 额外包含：

```text
ppx/
├── assets/
├── packages/
│   ├── ppx-py/
│   └── ppx-js/
└── tooling/
    ├── docs/
    ├── scripts/
    └── tests/
```

这是框架维护者的源码，不会由 `ppx new` 复制进普通项目。

`ppx/packages/ppx-py` 与 `ppx/packages/ppx-js` 是将来发布到 PyPI/npm 的源码；`ppx/tooling` 只服务于框架测试和发布。应用开发者不应该复制其中任意目录到自己的项目。

## 路径规则

目录名可在 `ppx.toml [paths]` 调整，但都必须是项目内相对路径，禁止绝对路径和 `..`。打包后，GUI 映射到 `_MEIPASS/web`，业务资源映射到 `_MEIPASS/resources`；业务代码通过配置的模块名作为 hidden import 收入应用。

```toml
[paths]
frontend = "gui"
resources = "api/resources"
assets = "ppx/assets"
```

通常保持默认即可。即使自定义目录，`ppx update` 也会根据配置找到正确的前端源码和图片目录进行保护。

## 新增文件应该放哪里？

| 内容 | 推荐位置 |
| --- | --- |
| Python 页面接口 | `api/` 中按领域拆分 |
| Python 业务依赖 | `api/requirements.txt` |
| 模型、模板、初始数据 | `api/resources/` |
| Vue/React 组件 | `gui/src/` |
| 前端静态资源 | 按前端框架规则放入 `gui/` |
| 应用运行后生成的数据 | `app_data_path()` 返回位置 |
| 三端 Logo | `ppx/assets/` |
| PPX 通用能力修复 | 框架仓库对应的 `ppx-py` 或 `ppx-js` |

不确定时先问：这个文件是某个应用独有，还是所有 PPX 应用都应该拥有？前者进入业务目录，后者应在框架仓库实现并发布新包。
