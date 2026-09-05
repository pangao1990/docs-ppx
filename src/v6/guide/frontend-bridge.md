# 前端桥接 ppx-js

`ppx-js` 是页面与 Python 之间的唯一推荐入口。它不包含 UI 组件，也不依赖 Vue、React 或 Element Plus。

## 安装

`ppx-js` 是无 UI 框架依赖的 ESM 包：

```bash
pnpm --dir gui add --save-exact ppx-js@6.0.0
```

使用 `--save-exact` 是为了让 JavaScript 端与 `ppx.lock` 保持一致。日常框架更新请运行 `ppx update`，不要单独把 `ppx-js` 升到任意最新版。

## 等待 Bridge

```javascript
import { ppx, PpxError } from 'ppx-js'

await ppx.ready()
const value = await ppx.call('user.greet', { name: 'PPX' })
```

如果调用时 Bridge 已存在，`ready()` 立即完成；否则等待 pywebview 的 `pywebviewready` 事件。在普通浏览器或 SSR 环境中导入不会崩溃。SSR 调用时因没有 `window` 而返回 `BRIDGE_UNAVAILABLE`；普通浏览器会等待就绪事件，通常在默认 30 秒后返回 `TIMEOUT`。

通常不必在每次调用前手工执行 `ready()`，因为 `ppx.call()` 内部已经等待。只有页面初始化逻辑需要明确知道 Bridge 状态时才单独使用。

## 调用方法

`call(method, params, options)` 中的 params 可以是对象、数组或 null；默认总超时 30 秒，可用 `{ timeoutMs: 60000 }` 调整。总超时同时覆盖等待 pywebview 桥接和等待 Python 结果，不会分别计时。每次调用在浏览器侧生成 requestId 并传给 Python，因此成功日志、业务错误、超时和传输错误都能关联同一次请求。Python 成功响应会自动解包 `data`，失败会抛出包含 `code` 与 `requestId` 的 `PpxError`。

对象参数最清晰，也最适合以后新增可选参数：

```javascript
const result = await ppx.call('report.create', {
  source: '/path/input.csv',
  format: 'pdf',
})
```

数组按 Python 参数位置传入：

```javascript
const total = await ppx.call('math.add', [1, 2])
```

无参数方法可以省略第二个参数：

```javascript
const owner = await ppx.call('system.getOwner')
```

## 超时

```javascript
const result = await ppx.call(
  'report.create',
  { id: 1 },
  { timeoutMs: 60_000 },
)
```

`timeoutMs` 是单一总预算，不是“等待 Bridge 60 秒，再等待 Python 60 秒”。如果等待 Bridge 已使用 10 秒，Python 结果最多再等待 50 秒。

`timeoutMs: 0` 会关闭超时。只建议用于本身有可靠取消机制的调用；否则 Python 卡住时页面可能一直等待。

JavaScript 超时不会自动终止已经开始执行的 Python 函数。长任务应由业务层设计 taskId、进度和取消接口。

## 错误处理

```javascript
import { ppx, PpxError } from 'ppx-js'

try {
  await ppx.call('report.open', { id: 'missing' })
} catch (error) {
  if (error instanceof PpxError) {
    console.error({
      code: error.code,
      requestId: error.requestId,
      message: error.message,
    })
  } else {
    throw error
  }
}
```

常见错误：

| code | 处理建议 |
| --- | --- |
| `BRIDGE_UNAVAILABLE` | 确认页面由 PPX 窗口打开 |
| `BRIDGE_ERROR` | 记录 requestId，检查窗口和 Python 进程 |
| `TIMEOUT` | 检查任务是否阻塞，评估是否应改为后台任务 |
| `METHOD_NOT_FOUND` | 检查名称、装饰器和 `python.modules` |
| `INVALID_PARAMS` | 对照 Python 函数参数名和类型 |
| `INVALID_RESULT` | 把 Python 返回值转换为标准 JSON |
| `INTERNAL_ERROR` | 查看 Python 日志，不向用户展示内部堆栈 |

业务自定义错误码应稳定、可搜索，不要让页面依赖容易变化的错误文案。

## 事件订阅

事件订阅：

```javascript
const unsubscribe = ppx.on('applicationUpdate.progress', progress => {
  console.log(progress.percentage)
})
unsubscribe()
```

`ppx.on()` 返回取消订阅函数。Vue/React 组件卸载时必须调用它，避免重复进入页面后累积监听器。

Vue 示例：

```javascript
import { onBeforeUnmount } from 'vue'
import { ppx } from 'ppx-js'

const stop = ppx.on('applicationUpdate.progress', updateProgress)
onBeforeUnmount(stop)
```

事件适合进度、状态变化和后台任务消息。需要明确成功/失败结果的短操作仍应使用 `ppx.call()`。

## TypeScript

包自带类型声明：

```typescript
import { ppx, PpxError, type PpxCallOptions } from 'ppx-js'

interface Greeting {
  message: string
}

const greeting = await ppx.call<Greeting>('user.greet', { name: 'PPX' })
```

泛型描述的是业务返回的 `data`，不是 Python Bridge 外层响应。成功响应已经由 `ppx-js` 解包。

## 在不同前端框架中使用

PPX 不关心组件框架。以下代码在 Vue、React、Svelte、Angular 或原生 JavaScript 中完全相同：

```javascript
import { ppx } from 'ppx-js'

export function getAppInfo() {
  return ppx.call('system.getAppInfo')
}
```

推荐在 `gui/src/services/` 中集中封装业务调用，组件不要到处散落字符串方法名。这样 Python API 改名时只有一处需要调整，也更容易写前端 mock 测试。

## 为什么不能直接访问 pywebview？

包可在 SSR/Node 环境安全导入，但没有 pywebview 时调用会抛出稳定错误。不要直接访问 `window.pywebview.api`，否则会绕过超时、错误规范和未来兼容层。

直接访问还会把页面和 pywebview 当前实现绑定，未来无法在 `ppx-js` 中统一增加调用追踪、取消、兼容适配或安全策略。

完整接口签名见 [JavaScript API 参考](../reference/javascript)，全部内置方法见 [内置 RPC](../reference/rpc)。
