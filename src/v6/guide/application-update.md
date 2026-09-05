# 成品应用更新

成品应用更新服务于你软件的最终用户；`ppx update` 服务于使用 PPX 的开发者。两套更新共享 GitHub Release 的思想，但对象、配置和安全责任完全不同。

## 配置自己的 Release

```toml
[applicationUpdate]
enabled = true
releaseUrl = "https://api.github.com/repos/your-name/your-app/releases/latest"
```

这里必须是你的应用仓库，而不是 PPX 仓库。

## 内置 RPC

```javascript
const result = await ppx.call('applicationUpdate.check')
```

有更新时返回：

```json
{
  "code": 0,
  "msg": "有新版 1.2.0，当前版本为 1.1.0",
  "htmlUrl": "https://github.com/.../releases/tag/v1.2.0",
  "assets": [],
  "body": "更新说明"
}
```

开始下载：

```javascript
const result = await ppx.call('applicationUpdate.download', null, { timeoutMs: 0 })
```

监听进度：

```javascript
const stop = ppx.on('applicationUpdate.progress', ({ percentage, sizeShow }) => {
  console.log(percentage, sizeShow)
})
```

取消：

```javascript
await ppx.call('applicationUpdate.cancel')
```

## 安装包选择规则

PPX 根据运行系统选择 `.exe`、`.dmg` 或 `.deb`，并通过文件名识别 Windows、macOS、Linux。优先选择匹配 CPU 架构的文件，支持 `arm64/aarch64`、`x64/x86_64/amd64`、`x86/i386/i686/ia32` 和 `arm/armv7l/armhf`。仅有一个候选但明确标记了其他架构时也会拒绝；未标记架构的文件作为通用候选，因此发布者必须保证这类文件确实适用于目标设备。

建议命名：

```text
MyApp-V1.2.0_Windows.exe
MyApp-V1.2.0_macOS.dmg
MyApp-V1.2.0_Linux.deb
```

需要同时发布不同 CPU 架构时，在文件名加入 `_arm64` 或 `_x64`。

## 下载安全

下载器强制要求 GitHub Release asset 提供 `sha256:` digest。下载时：

1. 拒绝包含 `/`、`\\` 或 `..` 的不安全文件名。
2. 写入 `.part` 临时文件。
3. 流式计算 SHA-256。
4. 哈希一致后原子替换为正式文件。
5. 失败、取消或哈希不一致时删除临时文件。

下载完成后，示例界面显示已校验的文件路径，由用户点击“打开安装包”后再通过 `system.openPath` 交给操作系统。

同一更新器只允许一个下载任务，重复请求返回 `code: -2`。取消请求会保持到整个任务结束，不会被自动重试清除。网络连接超时为 5 秒，读取无数据超时为 15 秒；取消需要等待当前读取结束。下载 RPC 关闭默认的 30 秒总超时，网络本身仍有上述超时约束。

## 为什么没有宣称完全静默安装

真正可靠的无感安装需要：

- Windows 代码签名、稳定 AppId、专用 updater helper 和失败回滚；
- macOS Developer ID、公证、Sparkle 等成熟更新器；
- Linux Flatpak/AppImageUpdate，或安装 deb 时处理系统权限；
- 启动健康检查、数据迁移和旧版本保留。

PPX 提供“安全检查、下载、校验和打开安装包”，不会绕过系统权限，也不会把下载成功误报为安装成功。

## 发布前验收

- 旧版本能检测到新版本。
- 同版本和更低版本不会提示。
- 三端各选中正确安装包和架构。
- 错误哈希无法落地正式文件。
- 取消后 `.part` 文件被清理。
- 安装覆盖后，应用数据仍然存在。
