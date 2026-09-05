# 一键更新框架

这一章讲的是“应用开发者更新 PPX 框架”，不是“最终用户更新你的成品软件”。成品软件更新请看 [成品应用更新](./application-update)。

## 为什么需要专用更新命令？

`ppx-py` 和 `ppx-js` 共同实现一套 RPC 协议。如果只执行 `pip install -U ppx-py`，Python 已经变成新版，而页面仍使用旧版 JavaScript，可能出现返回结构、错误码或超时行为不一致。

过去复制框架目录也有同样的问题：开发者很难分辨哪些文件属于自己，哪些应该被新版本替换。

PPX 使用 `ppx.toml`、`ppx.lock` 和 Release 更新清单统一处理两个包。

## 推荐操作顺序

```bash
ppx update --check
ppx update --dry-run
ppx update
ppx doctor
```

### 只检查

```bash
ppx update --check
```

读取远程 Release 和清单，显示是否有可用版本，不安装包、不写文件。

### 预演

```bash
ppx update --dry-run
```

显示当前版本、目标版本、两个包的精确版本和业务保护范围。它同样不会修改环境。

### 执行更新

```bash
ppx update
```

只有所有兼容与安全检查都通过后，才开始安装。

需要指定目标版本时：

```bash
ppx update --to 6.1.0
```

更新器目前只接受同一主版本（6.x）内的更新，且目标版本不能低于当前已安装版本。

## 更新清单是什么？

每个可供框架更新的 GitHub Release 都必须携带 `ppx-update.json`。核心内容类似：

```json
{
  "schemaVersion": 1,
  "releaseVersion": "6.1.0",
  "channel": "stable",
  "requires": {
    "projectFormat": 6,
    "pythonApi": "6.0",
    "javascriptApi": "6.0",
    "dataSchema": "1"
  },
  "provides": {
    "pythonApi": "6.0",
    "javascriptApi": "6.0",
    "dataSchema": "1"
  },
  "packages": {
    "ppx-py": "6.1.0",
    "ppx-js": "6.1.0"
  }
}
```

GitHub Release asset 还必须提供有效 `sha256:` digest。Release tag、清单版本和两个包版本需要相互一致。

## 四项兼容契约

| 字段 | 说明 | 不一致时意味着什么 |
| --- | --- | --- |
| `projectFormat` | 项目目录和配置的大结构版本 | 当前项目不能直接使用目标版本 |
| `pythonApi` | Python 公共 API 契约 | 装饰器、路径或运行时接口可能不兼容 |
| `javascriptApi` | JavaScript RPC 契约 | 调用、返回值或错误行为可能不兼容 |
| `dataSchema` | PPX 内置数据契约 | 数据读取规则可能需要迁移 |

这些字段是保护条件，不是“把值改成目标版本就能兼容”的开关。手工伪造兼容字段可能让更新通过，却把错误留到运行时。

## 兼容更新会修改什么？

允许修改：

- 当前虚拟环境中的 `ppx-py`；
- `gui` 依赖中的 `ppx-js`；
- 包管理器生成的受管依赖锁；
- `ppx.toml` 的 `[framework].python/javascript`；
- `ppx.lock` 中的框架和兼容版本。

明确禁止修改：

- `api/`；
- `gui/src/`；
- `ppx/assets/`；
- 操作系统中的应用数据目录；
- 业务数据库。

更新前后会计算三个业务目录中每个文件的 SHA-256。若包安装过程意外改变这些文件，更新立即失败并恢复受管状态。

## 一次成功更新的过程

```text
读取本地配置和锁
  → 下载并验证 Release 清单
  → 检查版本、通道和四项契约
  → 记录业务目录摘要
  → 备份受管配置与 lockfile
  → 安装精确版本 ppx-py
  → 安装精确版本 ppx-js
  → 原子更新 ppx.toml 和 ppx.lock
  → 再次校验业务目录摘要
```

安装的是清单指定的精确版本，不是当时注册表里“任意最新版本”。这样相同清单在不同时间执行仍能得到相同结果。

## 失败怎么回滚？

任一步抛出错误时，更新器会：

1. 恢复更新前的 `ppx.toml`、`ppx.lock`、`package.json` 和相关 lockfile；
2. 尝试重新安装原来的 `ppx-py`；
3. 用恢复后的 lockfile 重新同步前端依赖；
4. 返回非零退出码。

网络中断、包不存在、摘要变化或安装命令失败，都不能被报告成成功。回滚后仍应运行 `ppx doctor`；如果回滚安装也受网络影响，请保留完整日志再人工恢复锁定版本。

## 什么情况下会直接拒绝？

- 目标是 V5 或其他大版本；
- 目标低于当前版本；
- 任一包版本构成降级；
- stable/beta/nightly 通道不一致；
- Release 缺少更新清单；
- 清单格式未知或字段不完整；
- asset 缺少 SHA-256 或摘要不匹配；
- 四项兼容契约存在冲突。

这些情况会在修改业务源码之前停止。

## 不兼容时怎么办？

更新器会输出类似下面的冲突报告：

```text
[不兼容] 该版本与当前项目不兼容，已停止且没有修改任何业务文件：
- javascriptApi: 项目为 6.0，新版本要求 7.0
```

PPX 不会自动猜测如何修改业务函数和数据。正确做法是：

1. 阅读目标版本变更记录；
2. 用 `ppx new` 创建目标版本空项目；
3. 对照新接口人工迁移业务；
4. 完整测试后替换旧项目发布流程。

重大结构变化宁可明确重建，也不要静默覆盖用户业务。

## 更新后检查清单

- `ppx doctor` 全部通过；
- Python 与 JavaScript 的实际安装版本和 `ppx.lock` 一致；
- 业务单元测试通过；
- `ppx dev` 能完成关键 RPC；
- `ppx build --console` 能启动打包后应用；
- 业务数据和资源读取正常。

完整清单格式见 [更新清单参考](../reference/update-manifest)。
