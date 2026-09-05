# 配置文件

`ppx.toml` 是开发者可修改的应用配置，`ppx.lock` 是 `ppx update` 管理的框架锁，不要手改后者。

配置在开发启动、正式打包和框架更新时都会读取。PPX 会尽早拒绝错误值，避免到了安装器阶段才发现应用名、路径或版本无效。

## 完整示例

```toml
[project]
name = "My App"
slug = "my-app"
version = "1.0.0"
identifier = "com.example"
developer = "Your Name"
description = "应用说明"
website = "https://example.com"
windowsAppId = "12345678-1234-4ABC-8DEF-1234567890AB"
format = 6

[python]
modules = ["api.api", "api.report"]

[paths]
frontend = "gui"
resources = "api/resources"
assets = "ppx/assets"

[window]
widthRatio = 0.6667
heightRatio = 0.8
minWidthRatio = 0.5
minHeightRatio = 0.5
resizable = true
fullscreen = false
alwaysOnTop = false
confirmClose = false
backgroundColor = "#FFFFFF"

[development]
port = 5173

[storage]
filename = "storage.json"

[applicationUpdate]
enabled = false
releaseUrl = ""

[compatibility]
pythonApi = "6.0"
javascriptApi = "6.0"
dataSchema = "1"

[framework]
python = "6.0.0"
javascript = "6.0.0"
channel = "stable"
releaseUrl = "https://api.github.com/repos/pangao1990/PPX/releases/latest"
```

`name` 必须是 Windows、macOS、Linux 都能接受的文件名，`identifier` 必须是至少两段的反向域名，`slug` 只能使用小写字母、数字和中划线。`windowsAppId` 由 `ppx new` 自动生成，之后不要更改。窗口比例必须在 0 到 1 之间，最小比例不能超过初始比例；`backgroundColor` 必须是 `#RRGGBB`。所有布尔配置必须使用 TOML 的 `true/false`，带引号的字符串会被拒绝。`python.modules` 必须至少包含一个模块。`project.version` 使用语义化版本；它是你的应用版本，与 `[framework]` 的 PPX 版本不是一回事。

兼容性字段描述业务所依赖的契约，不能为了通过更新而随意修改。更新器只有在项目格式、Python API、JavaScript API 和数据模式完全满足 Release 要求时才更新两个包。

## project：应用身份

| 字段 | 例子 | 说明 |
| --- | --- | --- |
| `name` | `"My App"` | 窗口、应用和安装包显示名称 |
| `slug` | `"my-app"` | Linux 包名、内部目录名等稳定短标识 |
| `version` | `"1.0.0"` | 你的应用版本 |
| `identifier` | `"com.example"` | 反向域名，与 slug 共同标识应用数据 |
| `developer` | `"Your Name"` | 安装器维护者/发布者 |
| `description` | `"..."` | 安装器和系统菜单说明 |
| `website` | `"https://..."` | 项目网址 |
| `windowsAppId` | GUID | Windows 判断覆盖升级的重要标识 |
| `format` | `6` | PPX 项目格式，只能是整数 6 |

应用第一次发布后，应把 `slug`、`identifier`、`windowsAppId` 当成稳定身份。随意改变可能导致数据目录变化，或让系统把升级识别成另一款应用。

## python：业务入口

```toml
[python]
modules = ["api.api", "api.report"]
```

PPX 会导入每个模块并扫描 `@api_method`。动态业务入口不在数组中时，开发模式不会注册，PyInstaller 也可能不会收集。

模块名使用 Python 导入语法，不是文件路径：`api.report` 对应 `api/report.py`。

## paths：开发者目录

```toml
[paths]
frontend = "gui"
resources = "api/resources"
assets = "ppx/assets"
```

值必须是项目内相对路径，不能包含 `..`。一般保持默认结构；自定义后，doctor、构建和更新保护都会按配置寻找目录。

## window：窗口行为

窗口初始宽度按“主屏幕宽度 × `widthRatio`”计算，高度同理。最小尺寸再按初始窗口尺寸乘最小比例。

| 字段 | 默认值 | 作用 |
| --- | ---: | --- |
| `widthRatio` | `0.6667` | 初始窗口占主屏宽度比例 |
| `heightRatio` | `0.8` | 初始窗口占主屏高度比例 |
| `minWidthRatio` | `0.5` | 最小宽度占初始宽度比例 |
| `minHeightRatio` | `0.5` | 最小高度占初始高度比例 |
| `resizable` | `true` | 是否允许改变大小 |
| `fullscreen` | `false` | 是否全屏启动 |
| `alwaysOnTop` | `false` | 是否保持置顶 |
| `confirmClose` | `false` | 关闭前是否确认 |
| `backgroundColor` | `"#FFFFFF"` | 页面加载前背景色 |

TOML 中 `false` 和 `"false"` 完全不同。后者是字符串，PPX 会拒绝，而不是把它误判成真值。

## development：开发端口

```toml
[development]
port = 5173
```

`ppx dev` 会要求 Vite 使用这个端口，Python 窗口也加载同一地址。使用 `--skip-frontend` 时，外部服务必须自己监听这个端口。

## storage：轻量本地存储

```toml
[storage]
filename = "storage.json"
```

这里只允许文件名，不允许目录或 `..`。实际文件位于操作系统规范的应用数据目录，不在项目和安装目录中。

## applicationUpdate：更新你的成品应用

```toml
[applicationUpdate]
enabled = true
releaseUrl = "https://api.github.com/repos/OWNER/APP/releases/latest"
```

这里填写你的应用仓库，不是 PPX 框架仓库。关闭时调用更新检查会返回“应用更新已关闭”。详见 [成品应用更新](./application-update)。

## compatibility 与 framework

```toml
[compatibility]
pythonApi = "6.0"
javascriptApi = "6.0"
dataSchema = "1"

[framework]
python = "6.0.0"
javascript = "6.0.0"
channel = "stable"
releaseUrl = "https://api.github.com/repos/pangao1990/PPX/releases/latest"
```

`compatibility` 表示当前业务依赖的契约，`framework` 表示实际安装的两个包。两组信息共同参与 `ppx update` 判断。

不要通过手改版本伪装已完成更新。正确方式是：

```bash
ppx update --check
ppx update --dry-run
ppx update
ppx doctor
```

## ppx.lock

锁文件记录：

- lock 格式版本；
- 项目格式；
- `ppx-py` 精确版本；
- `ppx-js` 精确版本；
- 三项兼容契约。

它应提交到 Git，让团队和 CI 使用一致框架版本。手工修改只会制造“配置看起来正确、实际包版本不同”的漂移。

## 修改配置后的检查

```bash
ppx doctor
ppx dev
ppx build --console
```

应用身份、路径、业务模块或窗口配置变化后，都应至少执行一次打包后启动测试。逐字段定义见 [ppx.toml 参考](../reference/config)。
