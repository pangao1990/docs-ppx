# Python 业务 API

Python 业务代码属于应用开发者，放在 `api/`。PPX 只负责加载配置指定的模块，并注册明确标记的方法。

## 第一个方法

开发者只需要从 `ppx_py` 导入 `api_method`：

```python
from ppx_py import api_method


@api_method("math.add")
def add(left: float, right: float) -> float:
    return left + right
```

前端使用对象参数调用：

```javascript
const total = await ppx.call('math.add', { left: 1, right: 2 })
```

API 名称必须包含命名空间和句点。推荐使用“业务领域.动作”：

- `user.getProfile`；
- `report.create`；
- `analysis.run`。

不要使用容易与框架冲突的 `system.*`、`window.*`、`storage.*`、`applicationUpdate.*`。

## 模块加载

在配置中声明所有业务入口：

```toml
[python]
modules = ["api.api", "api.report", "api.analysis"]
```

启动时 PPX 会逐个导入。任一模块导入失败都会显示具体模块名并停止启动，避免应用在缺少一部分业务能力的情况下继续运行。

模块里可以保留任意私有辅助代码。只有带 `@api_method` 的可调用对象才会注册：

```python
def _load_records():
    return []


@api_method("report.count")
def count_records():
    return len(_load_records())
```

## 参数如何传入？

`ppx.call()` 的第二个参数支持三种形式：

| JavaScript params | Python 调用方式 |
| --- | --- |
| 对象 `{ left: 1, right: 2 }` | 关键字参数 `add(left=1, right=2)` |
| 数组 `[1, 2]` | 位置参数 `add(1, 2)` |
| `null` 或省略 | 无参数 `method()` |

PPX 在真正执行函数前使用 Python 签名检查参数。缺少参数、多余参数或对象键拼错时返回 `INVALID_PARAMS`。

Python 类型标注主要用于代码可读性和 IDE，不会自动把字符串转换成数字。业务需要严格类型时，请在函数内主动验证并返回清晰错误。

## 同步与异步

异步业务函数不需要包装线程或事件循环：

```python
import asyncio
from ppx_py import api_method


@api_method("report.create")
async def create_report(source: str) -> dict:
    result = await asyncio.to_thread(run_expensive_python_job, source)
    return {"path": str(result)}
```

PPX 会等待协程完成，再把结果返回给 JavaScript；即使调用线程已经有事件循环，也会在隔离线程中运行协程。CPU 密集计算仍建议使用 `asyncio.to_thread`、进程池或业务任务队列，避免阻塞调用线程。

适合直接 `async def` 的场景包括 HTTP 请求、等待文件和异步数据库。大量 CPU 计算不会因为写成 `async def` 自动变快。

超过几十秒的任务建议拆为：

1. `task.start` 创建后台任务并返回 taskId；
2. Python 保存进度和取消标记；
3. 页面订阅进度事件或调用 `task.getState`；
4. `task.cancel` 请求停止。

## 返回值规则

前端 params 为对象时按关键字调用，为数组时按位置调用，为 null 时无参数调用。参数数量或名称错误返回 `INVALID_PARAMS`；未知方法返回 `METHOD_NOT_FOUND`；业务内部异常在日志中记录，但前端只得到稳定的 `INTERNAL_ERROR`，不会泄露 Python 堆栈。

返回值必须是可序列化的字符串、有限数字、布尔值、null、数组或对象。返回 `Path`、set、协程或 NaN 等值时会得到 `INVALID_RESULT`，请先转换成字符串或普通 JSON 数据。耗时任务可通过事件报告进度。

| Python 值 | 是否允许 | 建议转换 |
| --- | --- | --- |
| `str/int/float/bool/None` | 是，浮点数必须有限 | 无 |
| `list/tuple` | 是，内部元素也必须合法 | 元组会按数组传输 |
| `dict` | 是，键和值应符合 JSON | 使用字符串键 |
| `Path` | 否 | `str(path)` |
| `datetime` | 否 | `.isoformat()` |
| `bytes` | 否 | Base64 或保存文件后返回路径 |
| `set` | 否 | `list(value)` |
| `NaN/Infinity` | 否 | 返回 `null` 或业务定义值 |

严格限制是为了确保 Python、JavaScript、日志和持久化看到相同的数据，不产生“Python 能写、JavaScript 不能读”的隐性兼容问题。

## 返回业务错误

预期内的业务失败可以抛出稳定的 `BridgeError`：

```python
from ppx_py import BridgeError, api_method


@api_method("report.open")
def open_report(report_id: str):
    report = find_report(report_id)
    if report is None:
        raise BridgeError("REPORT_NOT_FOUND", "找不到指定报表")
    return report
```

前端根据 `error.code` 区分业务分支。不要把数据库连接字符串、Token、堆栈或本机隐私路径写进对用户展示的错误消息。

未处理异常会记录到 Python 日志，页面只收到 `INTERNAL_ERROR` 和通用文案。

## 业务资源与用户数据

资源文件与用户数据必须使用跨平台路径辅助函数：

```python
from ppx_py import app_data_path, resource_path

template = resource_path("templates/report.html")
database = app_data_path("database.sqlite3")
```

`resource_path` 开发时指向 `api/resources/`，打包后自动指向应用内的 `resources/`；文件不存在会抛出 `FileNotFoundError`。`app_data_path` 指向 macOS Application Support、Windows APPDATA 或 Linux XDG data 目录，并自动创建应用数据根目录。两者都拒绝绝对路径和 `..` 越界。

子目录不会自动全部创建：

```python
cache = app_data_path("cache")
cache.mkdir(parents=True, exist_ok=True)
```

不要把用户数据写入 `resource_path()` 返回的位置；打包资源应视为只读。

## 测试业务 API

装饰器不会阻止函数作为普通 Python 函数测试：

```python
def test_add():
    assert add(1, 2) == 3
```

建议分别测试：

- 正常返回；
- 缺失和非法参数；
- 业务错误码；
- 返回值 JSON 合法性；
- 资源不存在；
- 异步取消和超时策略。

RPC 集成测试再通过真实 PPX 窗口确认 JavaScript 参数、Python 结果和错误码一致。

## 哪些框架类通常不需要直接使用？

PPX 已内置 `system.*`、`window.*`、`storage.*` 与 `applicationUpdate.*`。业务方法不要复用这些名字，也无需创建 `Application`、`Bridge` 或 `main.py`。

`Application`、`Bridge`、`Settings` 等对象仍属于公开 Python 包，主要用于框架扩展、高级集成和测试。普通业务优先使用最小 API：`api_method`、`resource_path`、`app_data_path`。
