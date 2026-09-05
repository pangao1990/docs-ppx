# 日常开发

这一章说明从启动、修改代码到提交前检查的完整日常流程。普通应用开发者不需要进入 `ppx/packages/` 或理解 PPX 内部入口。

## 启动前检查

进入项目并激活虚拟环境：

```bash
cd your-project
source .venv/bin/activate       # Windows 使用 .venv\Scripts\Activate.ps1
ppx doctor
```

doctor 不通过时优先修复环境、版本和资源问题。开发阶段可以暂时缺少当前平台的正式安装器工具，但 Python、Node、pnpm、两个 PPX 包和项目结构必须一致。

## 一条命令启动前后端

```bash
ppx dev
```

内部执行顺序：

1. 从当前目录向上查找 `ppx.toml`；
2. 读取并校验全部配置；
3. 启动 `pnpm -C gui run dev --host 127.0.0.1 --port <development.port> --strictPort`；
4. 等待本机端口真正可连接；
5. 导入 `python.modules` 中的业务模块；
6. 注册带 `@api_method` 的函数；
7. 创建 pywebview 窗口并加载 Vite 地址；
8. 窗口退出后终止 PPX 自己启动的前端进程。

启动前若发现配置端口已被占用，会明确报错。确认该端口是当前项目的前端时可使用 `--skip-frontend`；否则应修改 `development.port`，不会自动连接到其他服务。

如果 Vite 提前退出或端口在规定时间内没有就绪，`ppx dev` 会返回错误，不会继续打开一个注定白屏的窗口。

## 前端由 IDE 单独运行

有时需要使用前端 IDE 的专用启动方式：

```bash
pnpm -C gui run dev --host 127.0.0.1 --port 5173 --strictPort
ppx dev --skip-frontend
```

`--skip-frontend` 表示 PPX 不启动和回收 Vite。此时必须保证实际端口与 `ppx.toml` 的 `development.port` 一致。

Windows 需要显式使用 CEF 时可以运行：

```bash
ppx dev --cef
```

CEF 不是默认方案，也不适用于其他平台。是否使用要根据 Windows 目标环境实际测试决定。

## 组织 Python 业务

小项目可以只用 `api/api.py`。项目增大后按领域拆分模块，并把每个模块都写入 `python.modules`。业务函数应保持参数和返回值可被 pywebview 序列化，不要返回数据库连接、文件句柄或自定义运行时对象。

```text
api/
├── api.py          # 简单入口或公共 API
├── report.py       # 报表领域
├── analysis.py     # 分析领域
├── repository.py   # 数据访问，不直接暴露给页面
└── resources/
```

```toml
[python]
modules = ["api.api", "api.report", "api.analysis"]
```

只有带装饰器的方法会注册，普通辅助函数和数据访问函数可以留在相同模块中：

```python
from ppx_py import api_method


def _load_private_data():
    return [1, 2, 3]


@api_method("analysis.summary")
def summary():
    values = _load_private_data()
    return {"count": len(values), "total": sum(values)}
```

## 组织前端

前端开发工具完全由 `gui/` 决定。替换 Vue、React、Angular 或原生 HTML 不需要修改 PPX；只要保留 `dev` 与 `build` 两个 npm script，并使用 `ppx-js` 调用 RPC。

最低要求：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "ppx-js": "6.0.0"
  }
}
```

不要直接调用 `window.pywebview.api.call()`。统一经过 `ppx-js`，才能获得 Bridge 就绪等待、总超时、requestId 和稳定错误。

## 在普通浏览器调试页面

普通浏览器没有 Python Bridge，默认等待 30 秒后 `ppx.call()` 会得到 `TIMEOUT`；无浏览器环境或已发出就绪事件却没有桥接入口时返回 `BRIDGE_UNAVAILABLE`。页面层可以在自己的开发代码中提供 mock，但不要把 mock 混入生产路径。

一种简单做法是把业务调用封装到自己的前端 service：

```javascript
import { ppx } from 'ppx-js'

export const api = {
  getSummary() {
    return ppx.call('analysis.summary')
  },
}
```

组件只依赖 `api.getSummary()`；前端单元测试替换这个 service，而不是伪造整个 pywebview 对象。

## 处理耗时业务

RPC 默认总超时 30 秒。几百毫秒到几秒的操作可以直接等待；很长的 CPU 或文件任务应设计为“启动任务、查询状态、取消任务”，并通过事件报告进度。

异步函数可以直接注册，但 `async def` 不会自动让 CPU 密集计算变快。CPU 密集工作应使用线程、进程池或业务任务队列，避免长期占用 RPC 调用线程。

不要仅把 `timeoutMs` 调得无限大来掩盖卡死。超时应该能在日志中通过 requestId 定位到具体调用。

## 资源和数据

- 随应用分发且只读的资源放入 `api/resources/`；
- Logo 和安装器图片放入 `ppx/assets/`；
- 运行时生成的数据使用 `app_data_path()`；
- 不要把数据库写入应用安装目录或 PyInstaller 临时目录。

详见 [本地存储](./storage) 和 [Python 业务 API](./python-api)。

## 推荐的日常循环

1. 激活当前项目虚拟环境；
2. 运行 `ppx dev`；
3. 修改 `api/` 或 `gui/src/`；
4. Python 代码变化后重启桌面进程；
5. 前端代码由 Vite 热更新；
6. 完成功能后执行业务测试；
7. 执行 `ppx doctor`；
8. 执行 `ppx build --console` 做打包后启动测试。

## 提交前检查

普通应用至少执行：

```bash
ppx doctor
pnpm -C gui run build
ppx build --console
```

框架源码贡献者还需要执行根目录的：

```bash
pnpm run check
python -m pip check
git diff --check
```

正式发布前再执行当前平台正式打包，并在 Windows、macOS、Linux 真机分别验收。详见 [CI 与发布](./ci-release)。
