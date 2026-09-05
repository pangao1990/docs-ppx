# 示例工作台详解

<span id="读懂-v6-示例工作台"></span>

源码仓库的 `gui/` 是一个可运行的 Vue 示例应用。它把通信、文件选择、本地存储和应用更新放在同一个界面中，帮助你确认环境可用，再把这些能力接入自己的产品。

`ppx new` 生成的是较小的 Vanilla、Vue 或 React 入门模板，并不会复制整个工作台。两者都调用同一个 `ppx-js`，也都使用 Python 的 `@api_method` 注册业务函数。

## 先把示例运行起来

在 PPX 源码仓库根目录中执行：

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell 使用：.venv\Scripts\Activate.ps1
python -m pip install -e ppx/packages/ppx-py
pnpm install --frozen-lockfile
pnpm start
```

`pnpm start` 会运行 `ppx dev`，启动 Vite 并打开真正的桌面窗口。右上角出现“Python 已连接”，表示 `ppx.ready()` 已找到可调用的桥接入口。应用信息与便签的读取是后续独立操作；某项操作失败时，页面会显示错误提示。

如果只想查看布局：

```bash
pnpm -C gui dev --host 127.0.0.1 --port 5173 --strictPort
```

浏览器访问终端给出的地址。约两秒后出现“浏览器预览”，桌面按钮保持禁用，页面导航仍可使用。此时没有 Python 后端，便签不会写入浏览器的 localStorage，也不会显示伪造的成功结果。随后可以保持这个服务运行，再执行 `ppx dev --skip-frontend`。

## 页面与源码怎么对应

| 页面或能力 | 应用源码 | 调用的 Python 接口 |
| --- | --- | --- |
| 侧边导航、连接提示、最近调用 | `gui/src/App.vue` | `system.getAppInfo` |
| 向 Python 打招呼 | `gui/src/App.vue`、`api/api.py` | `user.greet` |
| 当前用户名 | `gui/src/App.vue` | `system.getOwner` |
| 多文件与目录选择 | `gui/src/App.vue` | `system.openFileDialog`、`system.selectDirectory` |
| 本地便签 | `gui/src/App.vue` | `storage.get`、`storage.set`、`storage.delete` |
| 内置离线开发文档与项目资源 | `gui/src/components/GettingStarted.vue` | 外链使用 `system.openPath` |
| 检查、下载、取消应用更新 | `gui/src/components/BtnUpdate.vue` | `applicationUpdate.*` |
| 颜色、卡片、侧栏、窄窗口适配 | `gui/src/assets/main.scss` | 无 |

“开始构建”和“开发文档”打开随应用附带的离线入门说明。外部资源由系统浏览器打开，客户端保持当前页面；打开失败时会显示可复制的网址。窄窗口也保留这些入口。

下载失败或取消后，可在更新弹窗内直接重新下载；下载完成后关闭弹窗，再点击“更新已下载”，仍能打开已经校验的安装包。

`App.vue` 使用 Vue 的 Composition API。`ref()` 保存页面状态，`computed()` 计算当前页标题和是否存在未保存修改。`current` 只控制示例中显示哪一页；这个小应用不需要额外安装路由库。

## 一次问候是怎样完成的

### Python 负责验证和业务结果

`api/api.py` 中的函数包含真实的输入检查：

```python
from ppx_py import BridgeError, api_method


@api_method("user.greet")
def greet(name: str) -> dict[str, str]:
    if not isinstance(name, str) or not name.strip() or len(name.strip()) > 80:
        raise BridgeError("INVALID_PARAMS", "请输入 1 至 80 个字符的名字")
    return {"message": f"你好，{name.strip()}！"}
```

装饰器定义了页面可以调用的名称。`name: str` 是类型提示，本身不会在运行时阻止传入数字，所以业务函数仍然需要检查类型和取值范围。前端的输入长度限制用于改善操作体验，后端检查用于保证接口契约。

`BridgeError` 表示可以反馈给用户的预期错误。其他异常会转成 `INTERNAL_ERROR`，详细堆栈留在 Python 日志中。

### JavaScript 负责输入、等待和展示

工作台调用过程的简化形式如下：

```javascript
import { ppx, PpxError } from 'ppx-js'

async function greet(name) {
  try {
    const result = await ppx.call('user.greet', { name: name.trim() })
    return result.message
  } catch (error) {
    if (error instanceof PpxError) {
      console.error(error.code, error.requestId, error.message)
    }
    throw error
  }
}
```

工作台的 `run()` 对这个过程再做一层封装：

1. 用 `busy` 集合记录正在执行的操作，避免同一个按钮重复触发；
2. 调用 `ppx.call()`，等待业务结果；
3. 成功时返回 `{ value }`，因此 Python 返回 `false` 或空字符串也不会被误判成异常；
4. 失败时显示可关闭的错误提示，保留错误码和 requestId；
5. 在 `finally` 中恢复按钮状态，并记录耗时；
6. 最近调用只保存本次页面运行的最后五条记录，不保存接口参数或便签内容。

修改 `api/api.py` 后需要重启 Python 桌面进程；修改 Vue 或样式通常由 Vite 自动更新。

## 选择文件：选路径和处理文件是两件事

```javascript
const files = await ppx.call(
  'system.openFileDialog',
  { multiple: true },
  { timeoutMs: 0 },
)
```

用户可能花几分钟寻找文件，因此对话框调用关闭默认的 30 秒等待超时。取消后返回 `[]`，属于正常结果，不是错误。工作台保留之前的文件列表，避免取消操作清空已有选择。

每个文件包含：

```json
{
  "filename": "report.csv",
  "ext": ".csv",
  "dir": "/Users/example/Documents",
  "path": "/Users/example/Documents/report.csv"
}
```

这些字段只是路径信息，接口不会读取文件内容。Windows 返回 Windows 的路径形式，不要在 JavaScript 中假定路径分隔符始终为 `/`。需要处理内容时，把 `path` 传给自己的 Python API，并用 `pathlib.Path` 读取，同时验证文件类型、大小和访问权限。

目录选择返回一个字符串；取消时返回 `""`。对话框没有创建窗口时会返回 `WINDOW_NOT_READY`，应检查是否从 `ppx dev` 启动。

## 便签为什么重启后还在

页面连接后先读取 `demo.note`：

```javascript
const note = await ppx.call('storage.get', {
  key: 'demo.note',
  default: '',
})
```

读取成功之前，编辑器保持禁用。这样可以防止用户已经输入内容后，又被较慢的初次读取覆盖。读取失败时显示“重新读取”，不会把失败当成空数据后直接覆盖旧便签。

保存：

```javascript
await ppx.call('storage.set', {
  key: 'demo.note',
  value: '下一个应用：本地文件整理工具',
})
```

清空：

```javascript
await ppx.call('storage.delete', { key: 'demo.note' })
```

清空只删除这个示例键，其他应用设置不受影响。未点击“保存到本机”的编辑只在当前页面内存中存在，关闭应用或刷新页面会丢失。界面会用“有未保存的修改”提示这种状态。

存储目录由 `project.identifier` 和 `project.slug` 决定，具体规则见[本地存储](./storage)。本仓库使用 `storage-v6.json`；新建项目默认使用 `storage.json`。

JSON 存储采用先写 `.part` 再替换的方式，适合少量设置。它不是多进程数据库，也不是密码保险箱。处理多实例并发、结构化查询或事务时，应该在自己的 Python 业务中使用 SQLite 等合适的数据层。

## 更新流程如何保持可理解

工作台不会启动后立即联网检查，用户点击底部“检查应用更新”后才会请求配置的 Release 地址。

| 阶段 | 页面行为 |
| --- | --- |
| 检查中 | 禁止重复检查 |
| 有新版本 | 展示版本说明，可查看发布页面或稍后再说 |
| 下载中 | 展示进度，可后台下载或取消 |
| 已请求取消 | 保持“取消中”，等待后端结束并清理临时文件 |
| 下载并校验完成 | 展示保存路径，由用户点击“打开安装包” |
| 没有更新或发生错误 | 展示原因，可以关闭后重试 |

下载使用 `{ timeoutMs: 0 }`，避免大安装包超过 RPC 默认等待时间。网络读取本身仍有 15 秒无数据超时，连接超时为 5 秒。取消是协作式的：已经发出的网络读取结束或超时后才能响应，不是点击后立即中断所有系统调用。

返回下载成功只表示文件通过 SHA-256 校验，并不表示已经安装成功。安装包选择、哈希和发布要求见[成品应用更新](./application-update)。

## 替换成自己的应用

1. 在 `ppx.toml` 修改应用名称、版本、标识和更新地址。
2. 保留 `ppx-js` 调用方式，把 `api/api.py` 换成自己的业务函数。
3. 在 `python.modules` 中列出新增模块，明确每个公开 API 的参数和返回值。
4. 在 `gui/` 实现自己的界面和状态提示，按需拆分组件。
5. 将业务依赖写入 `api/requirements.txt`，通过 `ppx init` 安装。
6. 将只读资源放入 `api/resources/`，运行时数据通过 `app_data_path()` 定位。
7. 执行测试、`ppx doctor` 和 `ppx build --console`，再在目标系统验收正式安装包。

不需要把这套工作台 UI 放进 `ppx-py` 或 `ppx-js`。两个包维护通用框架能力，应用开发者拥有自己的业务和界面。
