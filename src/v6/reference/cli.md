# CLI 参考

`ppx` 由 `ppx-py` 提供，会从当前目录向父级寻找 `ppx.toml`。

| 命令 | 作用 |
| --- | --- |
| `ppx --version` | 显示框架版本 |
| `ppx new NAME` | 在默认 slug 目录创建新项目 |
| `ppx new NAME --directory PATH` | 在指定空目录创建项目 |
| `ppx new NAME --frontend vanilla\|vue\|react` | 选择前端模板 |
| `ppx init` | 安装业务 Python/Node 依赖并执行 doctor |
| `ppx doctor` | 检查结构、版本、资源和当前平台工具 |
| `ppx doctor --json` | 输出机器可读诊断结果并保留退出码语义 |
| `ppx icon SOURCE` | 从方形主图生成 PNG、ICO、ICNS |
| `ppx icon SOURCE --output PATH` | 把图标生成到指定目录 |
| `ppx dev` | 启动 Vite 与 pywebview |
| `ppx dev --skip-frontend` | 不启动 Vite |
| `ppx dev --cef` | Windows 使用 CEF |
| `ppx build --console` | 生成当前平台调试应用 |
| `ppx build --skip-frontend` | 复用现有 GUI 产物 |
| `ppx build` | 生成并验证正式安装包 |
| `ppx update --check` | 只检查更新 |
| `ppx update --dry-run` | 只显示更新计划 |
| `ppx update --to VERSION` | 指定同一主版本内的目标版本 |

所有诊断、初始化、构建和更新错误返回非零退出码。`ppx update` 的不兼容返回码与网络/执行失败区分，适合 CI 记录。
