# 业务层

### 前言

本项目业务层（即：后端）使用 `Python` 脚本开发，建议将业务层代码置于 `api` 文件夹中。业务层的 Python 代码可通过 [域间通信](/guide/expert/communication) 与视图层的 `JavaScript` 通信。

### 功能

业务层的主脚本是 `api/api.py` 。目前业务层的功能分为 `系统类` 和 `存储类` 两大类。

#### 系统类

本类中包含常用的系统功能类，例如：**获取程序基础配置信息**、**程序检查更新**、**打开文件对话框**等等。如果有新的系统级需求，也请在本类中新增。

```Python
from pyapp.config.config import Config
from pyapp.update.update import AppUpdate

import webview

class System():
    '''系统类'''

    window = None

    def system_getAppInfo(self):
        '''程序基础配置信息'''
        return {
            'appName': Config.appName,  # 应用名称
            'appVersion': Config.appVersion  # 应用版本号
        }

    def system_checkNewVersion(self):
        '''检查更新'''
        appUpdate = AppUpdate()    # 程序更新类
        res = appUpdate.check()
        return res

    def system_pyCreateFileDialog(self, fileTypes=['全部文件 (*.*)'], directory=''):
        '''打开文件对话框'''
        # 可选文件类型
        # fileTypes = ['Excel表格 (*.xlsx;*.xls)']
        fileTypes = tuple(fileTypes)    # 要求必须是元组
        result = System.window.create_file_dialog(dialog_type=webview.OPEN_DIALOG, directory=directory, allow_multiple=True, file_types=fileTypes)
        resList = list()
        if result is not None:
            for res in result:
                filePathList = os.path.split(res)
                dir = filePathList[0]
                filename = filePathList[1]
                ext = os.path.splitext(res)[-1]
                resList.append({
                    'filename': filename,
                    'ext': ext,
                    'dir': dir,
                    'path': res
                })
        return resList
```

#### 存储类

本类用于操作存储在数据库中的数据。

```Python
from api.db.orm import ORM

class Storage:
    '''存储类'''

    orm = ORM()    # 操作数据库类

    def storage_get(self, key):
        '''获取关键词的值'''
        return self.orm.getStorageVar(key)

    def storage_set(self, key, val):
        '''设置关键词的值'''
        self.orm.setStorageVar(key, val)
```

#### 新增功能类

如果需要新增功能类，建议按照如下方式新增，PPX 会自动关联 JavaScript 对 Python 的函数调用。

- 在 `api` 文件夹下新增测试类 `test.py`

  ```Python
  # api/test.py
  class Test():
      '''测试类'''

      def run():
          print('test')
  ```

- 在 `api\api.py` 文件中继承该测试类

  ```Python
  # api/api.py
  from api.test import Test

  class API(Test):
    '''业务层API，供前端JS调用'''
    ...
  ```
