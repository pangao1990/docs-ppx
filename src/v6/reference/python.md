# Python API 参考

```python
from ppx_py import api_method
```

## `api_method(name)`

把同步函数或 `async def` 标记为可被前端调用的 RPC。`name` 必须包含点号命名空间；重复注册会抛出错误。装饰器不改变原函数行为，因此函数仍可被 Python 单元测试直接调用。返回值必须能序列化为严格 JSON；不支持的值返回 `INVALID_RESULT`。

## `resource_path(relative="")`

返回开发时 `api/resources/`、打包后内置 `resources/` 下的绝对 `Path`。目标不存在时抛出 `FileNotFoundError`；拒绝绝对路径和 `..` 越界。

## `app_data_path(relative="")`

返回当前用户、当前应用独立的可写数据路径并确保应用数据根目录存在。macOS、Windows、Linux 自动使用各自规范目录；拒绝绝对路径和 `..` 越界。

## `Settings.load(path='ppx.toml')`

框架内部读取并验证项目配置。普通业务通常不需要调用；高级业务可只读使用设置对象。常见路径属性包括 `project_root`、`frontend_source_dir`、`frontend_dir`、`resource_source_dir`、`resource_dir`、`asset_dir` 和 `app_data_dir`。

## 高级公开接口

`Bridge`、`Application`、`create_application` 与 `run_project` 主要供测试和框架集成使用。常规项目由 CLI 自动创建应用生命周期，不应自行复制启动逻辑。

包版本可通过以下方式读取：

```python
import ppx_py
print(ppx_py.__version__)
```
