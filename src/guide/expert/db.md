# 数据库

## TinyDB 数据库

默认启用 **TinyDB** 数据库。  
单数据库文件小于 10M 时，建议选择 TinyDB 数据库；单数据库文件小于 1G 时，建议选择 SQLite 数据库。

## SQLite 数据库

若要启用 SQLite 数据库，请按如下步骤：

- 修改 pyapp/config/config.py 脚本中 typeDB 配置项。json 表示启用 TinyDB 数据库，sql 表示启用 SQLite 数据库。

  ```
  typeDB = 'sql'    # 数据库类型，目前支持: json, sql
  ```

- 修改 pyapp/requirements.txt 文件中的配置项。注释 TinyDB 数据库相关库，启用 SQLite 数据库相关库。

  ```
  # 数据库 - json
  # tinydb==4.8.2
  # cryptography==45.0.4
  # 数据库 - sql
  tinyaes==1.1.0
  sqlalchemy==2.0.7
  alembic==1.10.2
  ```

- 重新安装 SQLite 数据库相关库

  ```
  pnpm run init
  ```

### SQLite 数据库迁移

在 api/db/models.py 中修改数据库格式后，执行以下命令迁移数据库。

注意：迁移数据库前，需要对 sqlalchemy 数据库对象映射框架有所了解。

```
# 迁移数据库
m=备注迁移信息 pnpm run alembic
```
