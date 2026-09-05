# 启动、调用与构建生命周期

## 开发启动

`ppx dev` 定位 `ppx.toml`，启动配置目录中的 `pnpm run dev`，等待端口就绪，然后由 `ppx-py` 加载 Settings、创建 Application、导入 `python.modules` 并注册所有 `@api_method`。pywebview 关闭后，命令终止自己启动的前端进程。

Application 内部组合 Bridge、JsonStorage、SystemService 和 ApplicationUpdater。只有 Bridge 被传给 pywebview 的 `js_api`，页面不能直接枚举 Python 业务对象。

## RPC

```text
ppx-js call(method, params)
  → 等待 pywebviewready
  → window.pywebview.api.call
  → ppx-py Bridge 白名单查找
  → 对象参数按关键字、数组参数按位置调用
  → { ok, data, error, requestId }
  → ppx-js 返回 data 或抛出 PpxError
```

Python 主动事件经 `Bridge.emit` JSON 序列化后进入 `window.__ppxDispatch`，再分发给 `ppx.on` 的监听器。存储写入使用进程内锁、同目录临时文件、fsync 和原子替换。

## 正式启动

PyInstaller 内的入口由构建命令生成，不存在于开发者源码。Settings 从 `_MEIPASS/ppx.toml` 读取配置，GUI 从 `_MEIPASS/web` 加载，业务资源位于 `_MEIPASS/resources`；持久化数据仍写入操作系统应用数据目录。

## 构建

```text
ppx build
  → GUI production build
  → build/cache/ppx_entry.py + ppx.spec
  → PyInstaller 当前平台应用
  → 当前平台安装器
  → 文件头 / hdiutil 校验
```

Windows 的 iss、macOS 的 dmgbuild 配置、Linux 的 control/desktop 与目录树都在 `build/cache` 动态生成。`--console` 在应用生成后停止，不生成正式安装器。

## 框架更新

`ppx update` 校验 Release 清单摘要、版本、通道和四项兼容契约，再保存受管文件与业务摘要，安装精确版本的 `ppx-py` 和 `ppx-js`，原子更新配置与锁，最后验证业务摘要。失败则恢复受管文件和原依赖。
