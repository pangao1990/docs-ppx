# `ppx.toml` 参考

## `[project]`

### `name: string`

必填。窗口标题、PyInstaller 输出名和安装包名称。必须是合法的跨平台文件名：不能使用 Windows 保留名，不能含控制字符或 `<>:\"/\\|?*`，也不能以空格或句点结尾。

### `slug: string`

必填。正则约束：小写字母/数字开头和结尾，中间允许小写字母、数字、中划线。

### `version: string`

必填。由 Python `packaging.version.Version` 解析。建议严格使用语义化版本 `主.次.补丁`。

### `identifier: string`

必填。必须是至少两段的反向域名，例如 `com.example`；与 slug 组成应用数据目录标识：`<identifier>.<slug>`。

### `developer: string`

必填。写入安装器维护者信息，必须是单行文本。

### `description: string`

可选。写入 Linux desktop/control 等安装元数据，必须是单行文本。

### `website: string`

可选。Windows 安装器 URL，必须是单行文本。

### `windowsAppId: string`

必填。Windows 安装器使用的标准 GUID。值不含花括号，生成 Inno Setup 时脚本负责格式化。`ppx new` 会自动生成，不要在后续版本中更改，否则 Windows 会把升级识别成另一款应用。

### `format: integer`

当前项目格式必须为 `6`。其他值会拒绝加载并提示重新创建项目。

## `[python]`

### `modules: string[]`

至少包含一个 Python 模块名。PPX 在启动时导入这些模块并扫描 `@api_method`，打包时也把它们加入 hidden imports。

## `[paths]`

`frontend`、`resources`、`assets` 分别默认是 `gui`、`api/resources`、`ppx/assets`。必须是项目内相对路径，不能包含 `..`。

## `[window]`

| 字段 | 默认值 | 约束 |
| --- | ---: | --- |
| `widthRatio` | `0.6667` | `0 < value <= 1` |
| `heightRatio` | `0.8` | `0 < value <= 1` |
| `minWidthRatio` | `0.5` | 不大于 widthRatio |
| `minHeightRatio` | `0.5` | 不大于 heightRatio |
| `resizable` | `true` | 是否允许调整窗口大小 |
| `fullscreen` | `false` | 是否以全屏模式启动 |
| `alwaysOnTop` | `false` | 是否保持窗口置顶 |
| `confirmClose` | `false` | 关闭窗口前是否由系统确认 |
| `backgroundColor` | `"#FFFFFF"` | `#RRGGBB`，页面加载前的窗口背景色 |

初始宽高用主屏尺寸乘 `widthRatio/heightRatio`。最小尺寸再按初始窗口宽高乘 `minWidthRatio/minHeightRatio`。

## `[development]`

### `port: integer = 5173`

范围 1～65535。Python 开发窗口加载 `http://localhost:<port>/`。

## `[storage]`

### `filename: string = "storage.json"`

只能是文件名，不能是 `.`、`..`，不能包含目录分隔符或 `..`。

## `[applicationUpdate]`

### `enabled: boolean = true`

是否启用成品应用更新。

### `releaseUrl: string`

应用 GitHub Release API。为空时调用检查会返回配置错误。

## `[compatibility]`

三个字符串字段均必填：`pythonApi`、`javascriptApi`、`dataSchema`。

## `[framework]`

### `python`、`javascript`

`ppx-py` 与 `ppx-js` 的精确版本，必须是合法版本字符串。

### `channel: string = "stable"`

只能为 `stable`、`beta`、`nightly`。

### `releaseUrl: string`

PPX 框架 GitHub Release API。`ppx update --to` 只有在地址以 `/latest` 结尾时才能自动构造 tag 地址。

## 派生路径

`Settings` 还提供：

- `app_id`：`identifier.slug`
- `app_data_dir`：操作系统用户数据目录下的 app_id
- `download_dir`：用户 Downloads
- `frontend_source_dir`：前端源码根目录
- `frontend_dir`：开发时 `<frontend>/dist`，PyInstaller 内为 `web`
- `resource_source_dir`：业务资源源码目录
- `resource_dir`：开发时业务资源目录，PyInstaller 内为 `resources`
- `asset_dir`：开发者可修改的打包图片目录

这些路径应通过 Settings 获取，不要在业务代码中硬编码用户名和系统路径。
