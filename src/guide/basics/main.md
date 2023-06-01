# 主程序

主程序位于项目根目录下的 `main.py` ，是 PPX 程序的入口文件。

### 获取环境状态

```python
from pyapp.config.config import Config

# 是否为开发环境
Config.devEnv = sys.flags.dev_mode
```

### 获取视图层页面 URL

开发环境中，视图层页面 URL 是前端 [Vite](https://cn.vitejs.dev/) 开启的本地服务器网址；生产环境中，视图层页面 URL 是相对入口文件的路径。

```python
import os
from pyapp.config.config import Config

# 视图层页面URL
if Config.devEnv:
    # 开发环境
    MAIN_DIR = f'http://localhost:{Config.devPort}/'
    template = os.path.join(MAIN_DIR, "")    # 设置页面，指向远程
else:
    # 生产环境
    MAIN_DIR = os.path.join(".", "web")
    template = os.path.join(MAIN_DIR, "index.html")    # 设置页面，指向本地
```

### 创建窗口

传入客户端标题`title`，加载视图层地址`url`，绑定 JavaScript 对 Python 的访问通信`js_api` 。可重复调用函数，创建多个窗口。

```python
import webview
from api.api import API
from pyapp.config.config import Config

api = API()    # 本地接口

# 创建窗口
window = webview.create_window(title=Config.appName, url=template, js_api=api)
```

### 启动窗口

启动窗口后，页面才会依次展示此前创建的窗口。

```python
import webview
from pyapp.config.config import Config

# 启动窗口
webview.start(debug=Config.devEnv, http_server=True)
```
