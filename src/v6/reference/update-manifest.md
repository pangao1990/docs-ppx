# 更新清单参考

每个可更新 Release 必须附带 `ppx-update.json`，Release 资产必须提供有效 SHA-256：

```json
{
  "schemaVersion": 1,
  "releaseVersion": "6.1.0",
  "channel": "stable",
  "requires": {
    "projectFormat": 6,
    "pythonApi": "6.0",
    "javascriptApi": "6.0",
    "dataSchema": "1"
  },
  "provides": {
    "pythonApi": "6.0",
    "javascriptApi": "6.0",
    "dataSchema": "1"
  },
  "packages": {
    "ppx-py": "6.1.0",
    "ppx-js": "6.1.0"
  }
}
```

`requires` 是当前项目必须满足的输入契约，`provides` 是更新后的契约，`packages` 是要安装的精确注册表版本。Release tag 与 `releaseVersion` 必须一致。更新器拒绝未知 schema、缺字段、通道不匹配、V5 版本、降级与无摘要资产。

发布清单之前必须确认两个包已经能从公开注册表安装；否则用户可能更新到无法恢复的半发布状态。
