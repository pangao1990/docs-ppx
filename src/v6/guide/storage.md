# 本地存储

PPX 内置一个线程安全的 JSON 键值存储，适合保存主题、最近目录、用户偏好和少量应用状态。它不替代大型数据库。

存储键必须是字符串，值必须是标准 JSON 数据。字符串、数字、布尔值、`null`、数组和普通对象可以保存；`NaN`、无穷大、`set`、`Path`、函数和类实例会以 `INVALID_PARAMS` 拒绝，避免 Python 写入后 JavaScript 无法可靠读取。

## 基本调用

```javascript
await ppx.call('storage.set', { key: 'theme', value: 'dark' })
const theme = await ppx.call('storage.get', { key: 'theme', default: 'light' })
const removed = await ppx.call('storage.delete', { key: 'theme' })
```

`storage.delete` 返回该键在删除前是否存在。

## 文件位置

文件名来自：

```toml
[storage]
filename = "storage-v6.json"
```

实际文件保存在 `<系统应用数据目录>/<project.identifier>.<project.slug>/`。这保证：

- 应用升级不会覆盖数据；
- 安装目录可保持只读；
- 多个应用通过不同标识符隔离。

## 原子写入

每次写入先生成同目录 `.part` 临时文件，刷新到磁盘后再用原子替换覆盖正式文件。进程在写入中途崩溃时，旧文件仍然存在。

同一进程内使用可重入锁串行化读写。但它不是跨进程数据库：不要让两个应用进程同时频繁修改同一文件。

## 能存什么

值必须是 JSON 可序列化数据：字符串、数字、布尔、null、数组和对象。不要直接存 Path、日期、bytes 或自定义类。

## 什么时候换数据库

出现以下情况时应使用 SQLite 或其他数据库，并把实现放在用户业务目录：

- 数据量持续增长；
- 需要查询、排序、索引或事务；
- 多张关联表；
- 多进程并发访问；
- 需要结构化迁移。

V6 不再内置 V5 的 TinyDB/SQLAlchemy 业务实现。数据库属于应用需求，不应成为所有 PPX 项目的强制依赖。

## 数据结构升级

`compatibility.dataSchema` 描述的是 PPX 框架内置数据契约，不会替你迁移业务数据库。业务数据需要单独维护 schema 版本和迁移脚本。

建议启动顺序：

1. 读取业务 schema 版本。
2. 备份数据库。
3. 在事务中逐版本迁移。
4. 迁移失败则回滚并阻止应用继续写入。

不要通过 `ppx update` 修改或覆盖用户数据。
