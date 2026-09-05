# 内置 RPC 参考

## 系统

### `system.getAppInfo`

参数：无。

返回：

```json
{
  "name": "PPX",
  "version": "6.0.0",
  "frameworkVersion": "6.0.0"
}
```

### `system.getOwner`

返回当前操作系统用户名。

### `system.openPath`

参数：`{ "path": string }`。HTTP(S) 使用系统浏览器打开；本地路径使用 Finder、Windows Shell 或 `xdg-open`。

### `system.openFileDialog`

参数：

```json
{
  "file_types": ["图片 (*.png;*.jpg)", "全部文件 (*.*)"],
  "directory": "/initial/path",
  "multiple": true
}
```

`multiple` 默认 `true`，设为 `false` 时只允许选择一个文件。返回数组，每项含 `filename`、`ext`、`dir`、`path`；取消返回空数组。

### `system.saveFileDialog`

参数：

```json
{
  "filename": "report.pdf",
  "file_types": ["PDF (*.pdf)"],
  "directory": "/initial/path"
}
```

返回用户选择的保存路径；取消返回空字符串。PPX 只选择路径，不会自动写文件。

### `system.selectDirectory`

参数：`{ "directory": string }`。返回路径字符串，取消返回空字符串。

## 窗口

- `window.getState`：无参数，返回 `x`、`y`、`width`、`height`、`onTop`。
- `window.minimize`：最小化当前窗口。
- `window.maximize`：最大化当前窗口。
- `window.restore`：从最小化或最大化状态恢复。
- `window.toggleFullscreen`：切换全屏。
- `window.close`：关闭当前窗口。

控制命令成功均返回 `true`。它们适合自定义标题栏；普通系统标题栏不需要调用。

## 存储

### `storage.get`

参数：`{ "key": string, "default"?: any }`。返回值或默认值。

### `storage.set`

参数：`{ "key": string, "value": any }`。写入成功返回 `true`。

### `storage.delete`

参数：`{ "key": string }`。返回删除前是否存在。

## 成品应用更新

### `applicationUpdate.check`

无参数。返回 code/message；有更新时额外含 `htmlUrl`、`assets`、`body`。

### `applicationUpdate.download`

无参数。内部重新检查版本、选择当前系统 asset、校验 SHA-256 并下载。成功返回 `downloadPath`。

### `applicationUpdate.cancel`

无参数。设置取消标记并返回 `true`。正在读取下一个下载块时生效。

## 返回层级

上述返回值是业务 `data`。Python Bridge 外层仍包含 `ok/data/error/requestId`，但 `ppx-js` 已自动解包，所以前端通常直接获得此页描述的值。
