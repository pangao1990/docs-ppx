# CI 与发布

这一章面向 PPX 框架维护者。普通应用开发者只需要参考 [三端打包](./packaging)，不需要发布 `ppx-py` 或 `ppx-js`。

## 发布对象

PPX 只发布两个框架包：

- `ppx-py` → PyPI；
- `ppx-js` → npm。

旧设计中的 `ppx-core`、`ppx-build`、`ppx-bridge` 不再是当前项目的依赖。已经上传到注册表的同版本文件不能覆盖，也不应继续作为当前项目的安装入口。

应用安装包是第三类产物，由具体应用项目在 Windows、macOS、Linux 分别构建，再上传到该应用自己的 GitHub Release。

## 使用 GitHub Actions 在线打包

在线打包功能保留。代码推送到 `main` 或向 `main` 提交 PR 后会自动触发 `build` 工作流，也可以手动操作：

1. 在自己的仓库打开 **Actions → build → Run workflow**。fork 仓库首次使用时，需要启用 Actions；手动入口要求工作流已存在于默认分支。
2. 选择要打包的分支，点击 **Run workflow**。
3. 等质量检查和三个打包任务全部完成，在运行记录的 **Artifacts** 下载 `Setup_Windows_架构`、`Setup_macOS_架构`、`Setup_Linux_架构`。
4. 每份压缩包包含当前系统安装包与 `SHA256SUMS`，保留 **14 天**。下载时通常需要登录 GitHub。
5. 在对应系统安装验收，再将通过验收的安装包上传至 Release，供用户长期下载。

工作流会安装业务依赖，准备 Windows 的 Inno Setup 6 和 Linux 的 GTK/WebKitGTK、PyGObject、dpkg，并验证渲染后端可导入。没有生成安装包时任务会失败，不会上传空产物。Linux 固定使用 Ubuntu 24.04；更早发行版和其他 CPU 架构需另行构建和验收。

`build` 自动打包只上传候选文件，不会自动发布包或创建 Release。独立的 `publish-pypi` 手动工作流可以通过 PyPI 可信发布上传 Python 包，具体配置见下文。

## CI 为什么分两阶段？

第一阶段验证源码和协议，第二阶段才构建三端安装包：

```text
质量矩阵全部通过
  └─ Windows / macOS / Linux 构建
       └─ 三端真机验收
            └─ 两包发布
                 └─ GitHub Release 与更新清单
```

如果单元测试失败，继续打安装包没有意义。三端构建依赖质量矩阵，避免产出明知有问题的候选文件。

## 质量矩阵

质量矩阵使用 Python 3.10、3.11、3.13 和 Node.js 22、24 运行环境诊断、Python/JavaScript 测试、GUI 构建、发布源码一致性检查与 `pip check`。npm 官方安全审计和 Python 的 `pip-audit` 在矩阵中固定执行一次，避免重复请求；前端高危漏洞或 Python 已知依赖漏洞会阻止后续三端构建。

推荐矩阵：Python 3.10/3.11/3.13 运行 Python 测试；Node 22/24 运行 `ppx-js` 测试与 GUI 构建；Windows、macOS、Linux 各自执行 `ppx build` 和安装包验证。

本地提交前先运行：

```bash
pnpm run check
python -m pip check
pnpm audit --audit-level high --registry=https://registry.npmjs.org
git diff --check
```

`pnpm run check` 已组合 doctor、Python 测试、JavaScript 测试、GUI 生产构建和发布源码检查。

## 三端构建任务

三个 runner 使用同一 Git 提交、`ppx.toml`、`ppx.lock` 和 pnpm lockfile：

| Runner | 预期产物 | 验证重点 |
| --- | --- | --- |
| `windows-latest` | `*_Windows.exe` | MZ 文件头、Inno Setup 成功 |
| `macos-latest` | `.app`、`*_macOS.dmg` | bundle、hdiutil verify |
| `ubuntu-24.04` | `*_Linux.deb` | ar/deb 文件头、dpkg 内容 |

CI 构建只能证明构建环境成功产出文件。代码签名、安装权限、系统安全提示、图形界面、RPC 和覆盖升级仍需要真机验收。

## 生成两个包的候选产物

两个包全部测试通过后才构建候选产物：

```bash
python -m build --outdir dist/release ppx/packages/ppx-py
pnpm --dir ppx/packages/ppx-js pack --pack-destination ../../../dist/release
python ppx/tooling/scripts/check_release.py --dist dist/release
python -m twine check dist/release/ppx_py-*
(cd ppx/packages/ppx-js && npm publish --dry-run --access public)
```

检查目录中应包含：

```text
ppx_py-6.0.0-py3-none-any.whl
ppx_py-6.0.0.tar.gz
ppx-js-6.0.0.tgz
```

记录 SHA-256：

```bash
shasum -a 256 dist/release/*
```

## 必须从候选文件重新安装

不能只测试 editable 源码。wheel 和 tgz 可能因为打包配置遗漏文件，即使源码目录能运行，用户安装后仍会失败。

Python 示例：

```bash
python -m venv /tmp/ppx-candidate-python
/tmp/ppx-candidate-python/bin/python -m pip install \
  dist/release/ppx_py-6.0.0-py3-none-any.whl
/tmp/ppx-candidate-python/bin/ppx --version
/tmp/ppx-candidate-python/bin/ppx new Smoke --directory /tmp/ppx-smoke
```

Windows 请把 `/tmp/.../bin/` 换成虚拟环境的 `Scripts\`。

JavaScript 示例：

```bash
mkdir -p /tmp/ppx-candidate-js
npm install --prefix /tmp/ppx-candidate-js --ignore-scripts \
  "$PWD/dist/release/ppx-js-6.0.0.tgz"
cd /tmp/ppx-candidate-js
node --input-type=module -e "import('ppx-js').then(m => console.log(typeof m.ppx.call))"
```

随后用候选 wheel 创建的新项目安装候选 tgz，执行 `ppx init`、GUI 构建、`ppx build --console`，并真实点击页面完成一次 JavaScript → Python RPC。

## 发布前人工清单

- 根项目、`ppx-py`、`ppx-js`、`ppx.toml`、`ppx.lock`、更新清单版本一致；
- `CHANGELOG.md` 有本次版本；
- README 和在线文档的命令、版本、错误码一致；
- wheel 包含运行、CLI、更新、打包、默认图片和许可证；
- tgz 只包含入口、类型、说明和许可证；
- Python 3.10/3.11/3.13 全部通过；
- Node 22/24 全部通过；
- Windows、macOS、Linux 安装器全部构建；
- 三台真实系统完成安装、启动、RPC、升级和卸载；
- npm audit 没有高危漏洞；
- 所有候选文件已记录 SHA-256。

缺任何一项都不要上传同版本。

## 正式发布顺序

正式顺序是：发布 `ppx-py`；从 PyPI 重装验证；发布 `ppx-js`；从 npm 重装验证；三端安装包完成后创建 Release 并附带 SHA-256 与 `ppx-update.json`。PyPI/npm 不能覆盖同一版本。`6.0.0` 已发布，以下上传命令仅说明流程，维护者不要重新执行相同版本的上传。

```bash
python -m twine upload dist/release/ppx_py-6.0.0*
```

上传 Python 包后，必须在全新环境从 PyPI 安装，而不是继续使用本地 wheel。确认版本、CLI、脚手架和构建后再发布 JavaScript：

```bash
cd ppx/packages/ppx-js
npm publish --access public --registry=https://registry.npmjs.org
```

再从 npm 注册表创建全新项目安装验证。两个包都公开可用后，才能创建供 `ppx update` 使用的 GitHub Release。

## GitHub Release

框架 Release 至少需要：

- tag 与 `releaseVersion` 一致；
- 清晰的变更说明；
- `ppx-update.json`；
- 更新清单 asset 的 SHA-256 digest；
- 两个包在公开注册表中确实可下载。

如果更新清单先于包公开，用户可能在兼容检查通过后安装失败。发布顺序不能颠倒。

## 同版本不能覆盖

PyPI 和 npm 都不允许重新上传已经存在的相同版本。即使应用本身尚未正式发布，也不能假设注册表允许“覆盖修正”。

因此：

- 上传前把 `6.0.0` 当成不可撤销操作；
- 上传后发现问题只能发布更高版本；
- 不要为了保持版本号而删除、覆盖或伪造产物；
- 候选目录和最终上传文件的 SHA-256 必须一致。

旧的 `ppx-core`、`ppx-build`、`ppx-bridge` 已停止使用，当前项目只依赖 `ppx-py` 与 `ppx-js`。后续发布仍需完成两包的独立验证，不能覆盖已发布的 `6.0.0`。


## PyPI 可信发布配置

仓库保留 `build` 三端在线打包，另提供 `publish-pypi` 手动发布工作流。普通推送不会直接上传 PyPI。

首次配置时，在 PyPI 项目管理的 Publishing 页面（新项目使用账号的 Publishing 页面）选择 GitHub，填写：

| 字段 | PPX 官方仓库的配置 |
| --- | --- |
| PyPI Project Name | `ppx-py` |
| Owner | `pangao1990` |
| Repository name | `PPX` |
| Workflow name | `publish-pypi.yml` |
| Environment name | `pypi` |

GitHub 仓库的 `pypi` 环境限制为 `main` 分支。维护自己的派生项目时，必须替换为自己的包名与仓库信息；推荐添加维护者审批。

发布时先等待 `build` 的六组质量检查和三个安装包任务全部成功，再进入 **Actions → publish-pypi → Run workflow**，输入这次成功运行的数字 ID。工作流要求该运行与当前 `main` 的源码提交完全一致，同时检查仓库、分支、触发事件与结果；通过后构建并检查 wheel/sdist，最后使用短期 OIDC 身份完成 PyPI 上传，不需要保存长期 API token。

如果期间又推送了新提交，先完成新提交的构建，再输入新的运行 ID。不要为了通过发布检查而借用旧提交的成功结果。
