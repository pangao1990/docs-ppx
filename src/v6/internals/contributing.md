# 参与框架开发

这一章只面向 PPX 维护者。普通应用开发者不需要打开 `ppx/packages/` 或 `ppx/tooling/`。

开源仓库顶层是 `api/` 示例业务、`gui/` 示例前端和 `ppx/` 框架区。Python 源码位于 `ppx/packages/ppx-py/src/ppx_py/`，JavaScript 源码位于 `ppx/packages/ppx-js/src/`，测试与发布脚本位于 `ppx/tooling/`。

本地初始化：

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -e ppx/packages/ppx-py
pnpm install --frozen-lockfile
```

提交前运行 Python 全量测试、`ppx-js` 测试、GUI 构建、doctor、pip check、npm audit、发布源检查、wheel/tgz 全新环境安装测试、当前平台调试应用与正式安装包。三端安装器必须由三端 CI 和真机共同验证。

新增能力时先判断归属：浏览器通信协议进入 `ppx-js`；其余运行、协调、构建和升级进入 `ppx-py`；业务示例只进入 `api/` 或 `gui/`。不要把 UI 框架放进任一 PPX 包，也不要要求普通项目保存内部打包模板。

两包、根项目、更新清单和变更记录的版本必须一致。发布前运行：

```bash
python ppx/tooling/scripts/check_release.py
```

不得覆盖 PyPI/npm 已发布版本。发现问题必须提升补丁版本。
