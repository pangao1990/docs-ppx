# JavaScript API 参考

```javascript
import ppx, { PpxError } from 'ppx-js'
```

包是 ESM，包含 `src/index.d.ts`，没有运行时依赖。

## `ppx.ready(options?)`

```typescript
ready(options?: { timeoutMs?: number }): Promise<void>
```

如果 `window.pywebview.api.call` 已存在则立即完成，否则等待一次 `pywebviewready`。默认 30 秒超时。完成或超时后会移除此次注册的就绪事件监听器，允许安全重试。

## `ppx.call(method, params?, options?)`

```typescript
call<T = unknown>(
  method: string,
  params?: unknown,
  options?: { timeoutMs?: number },
): Promise<T>
```

流程：等待 ready → 调用 `window.pywebview.api.call` → 检查响应 `ok` → 返回 `data` 或抛出 `PpxError`。

超时是一次调用的总预算，同时覆盖等待桥接和等待 RPC 结果。设置非有限值、0 或负数会禁用超时。调用开始时生成 requestId 并作为第三个内部参数传给 Python，因此 `TIMEOUT` 和 `BRIDGE_ERROR` 也带有可追踪的 requestId。

## `ppx.on(event, listener)`

```typescript
on<T = unknown>(event: string, listener: (data: T) => void): () => boolean
```

注册事件监听并返回取消函数。取消函数返回该 listener 是否原本存在。

同一事件可以有多个 listener。某个 listener 的同步异常或 Promise 拒绝会写入控制台，不会阻断其他监听器。业务仍应自行捕获异常并显示适当提示。

## `PpxError`

```typescript
class PpxError extends Error {
  readonly code: string
  readonly requestId?: string
}
```

构造自 RPC `error` 与 `requestId`。当 error 缺字段时，code 为 `UNKNOWN`，message 为“PPX API 调用失败”。

## SSR 和普通浏览器

模块加载时先检查 `typeof window`，所以服务端渲染构建不会因导入而失败。调用 API 时若没有 window，则拒绝 Promise 并返回 `BRIDGE_UNAVAILABLE`。

## 全局事件入口

浏览器环境导入包时会安装：

```javascript
window.__ppxDispatch(event, data)
```

这是 Python `Bridge.emit()` 的内部入口。业务代码应使用 `ppx.on()`，不要覆盖或直接依赖该全局函数。
