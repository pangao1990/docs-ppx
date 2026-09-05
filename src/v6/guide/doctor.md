# 环境诊断

```bash
ppx doctor
```

诊断项包括：项目格式；Python、Node.js、pnpm 版本；`ppx-py` 与 `ppx-js` 安装版本；`api/`、`gui/`、`ppx/assets/` 和 `api/requirements.txt`；四个必要打包资源；`ppx.toml` 与 `ppx.lock` 一致性；当前系统的平台工具。

macOS 检查 dmgbuild 与 hdiutil，Windows 检查 Inno Setup 6，Linux 检查 dpkg-deb。任一失败都会返回非零退出码，适合放进 CI。

若两包版本漂移，不要分别升级，依次运行：

```bash
ppx update --dry-run
ppx update
ppx doctor
```

若 `ppx-js` 缺失，先执行 `ppx init`。若图标缺失，从新项目取回对应默认文件后再按自己的品牌替换。

CI、IDE 插件或问题收集工具可以使用：

```bash
ppx doctor --json
```

输出包含 `ok`、项目路径、通过/失败统计和全部检查项。命令仍以 0 表示全部通过，以非 0 表示存在失败项。
