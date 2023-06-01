# 应用打包

执行代码，一键打包。

```shell
pnpm run build
```

应用打包分为两步进行：

- 打包成可执行文件
- 打包成安装程序

### 打包成可执行文件

基于 [Pyinstaller](https://www.pyinstaller.org) 将项目代码打包成可执行文件。

- 在 `Windows` 环境下打包成 `exe` 格式的可执行文件
- 在 `macOS` 环境下打包成 `app` 格式的可执行文件

打包过程，会先由 `pyapp/spec/getSpec.py` 脚本生成 `windows.spec` 或 `macos.spec` 打包配置文件，之后基于该配置文件进行打包。

::: tip 注意  
这里需要注意一个问题。因 `Pyinstaller` 的打包机制，可能会造成某些动态库或者 Python 模块并没有被打包进可执行文件。因此，可能出现在生产环境运行没问题。但是打包后，就提示某些动态库或模块丢失。遇到这种情况，就需要在打包配置文件中添加丢失的动态库或模块。  
:::

##### 添加动态链接库

也可以简单的理解为， `addDll` 用于添加文件

```Python

# 示例
# 动态库是以元组形式字符串添加
# 以下示例表示将本地包中的 icudtl.dat 和 zh-CN.pak 文件添加到打包中
addDll = """
    ('../../pyapp/pyenv/pyenvCEF/Lib/site-packages/cefpython3/icudtl.dat', './'),
    ('../../pyapp/pyenv/pyenvCEF/Lib/site-packages/cefpython3/locales/zh-CN.pak','./locales')
    """
```

##### 添加 Python 模块

也可以简单的理解为， `addModules` 用于添加文件夹

```Python

# 模块是以元组形式字符串添加
# 以下示例表示将本地包中的 requests 模块整体添加到打包中
addModules = "('../../gui/dist', 'web'), ('../../static', 'static')"
```

### 打包成安装程序

- 在 `Windows` 环境下，基于 [InnoSetup](https://jrsoftware.org/isinfo.php) ，打包成 `exe` 格式的安装程序
- 在 `macOS` 环境下，基于 [appdmg](https://github.com/LinusU/node-appdmg) ，打包成 `dmg` 格式的安装程序

##### 打包成 exe

打包过程，会先由 `pyapp/package/exe/getIss.py` 脚本生成 `InnoSetup.iss` 打包配置文件，之后基于该配置文件进行打包。

打包所需的数据均来自于 `pyapp/config/config.py` 配置文件。该文件几乎不需要修改。

::: warning 注意  
值得一提的是，安装包的唯一 `GUID` 。这个唯一编号取自于 `pyapp/config/config.py` 配置文件。在 `pnpm run init` 初始化之前，需要手动把 `pyapp/config/config.py` 配置文件中的 `appISSID` 置空，**PPX** 会自动生成一个唯一 `appISSID` ，生成后请勿修改！否则安装程序将会重复安装多个应用，而非覆盖安装。  
:::

```Python
# pyapp/config/config.py

# 初始化之前，请手动将 appISSID 设置为 ''
appISSID = ''    # Inno Setup 打包唯一编号。在执行 pnpm run init 之前，请设置为空，程序会自动生成唯一编号，生成后请勿修改！！！
```

```Python
# pyapp/package/exe/getIss.py

import os
from config.config import Config

appName = Config.appName    # 应用名称
appVersion = Config.appVersion  # 应用版本号
appVersion = appVersion[1:]    # 去掉第一位V
appDeveloper = Config.appDeveloper  # 应用开发者
appBlogs = Config.appBlogs  # 个人博客
rootDir = os.path.dirname(pyappDir)
buildDir = os.path.join(rootDir, 'build')
logoPath = os.path.join(rootDir, 'pyapp', 'icon', 'logo.ico')
appISSID = Config.appISSID    # 安装包唯一GUID
```

##### 打包成 dmg

打包过程，会先由 `pyapp/package/dmg/getJson.py` 脚本生成 `dmg.json` 打包配置文件，之后基于该配置文件进行打包。

在打包之前，请替换 `pyapp/package/dmg/bg.png` 背景图片和 `pyapp/package/dmg/潘高的小站.webloc` 网址文件。

```Python{4,19-24}
{
    "title": "''' + appName + '''",
    "icon": "../../icon/logo.icns",
    "background": "bg.png",
    "icon-size": 50,
    "contents": [
        {
            "x": 160,
            "y": 120,
            "type": "file",
            "path": "../../../build/''' + appName + '''.app"
        },
        {
            "x": 430,
            "y": 120,
            "type": "link",
            "path": "/Applications"
        },
        {
            "x": 450,
            "y": 243,
            "type": "file",
            "path": "./潘高的小站.webloc"
        }
    ],
    "window": {
        "size": {
            "width": 590,
            "height": 416
        }
    },
    "format": "UDBZ"
}
```

### 跨平台打包

在本机电脑操作，只能打包出本系统对应的程序包。如果想打包出两种系统的程序包，需要借助 `Github Action` 的能力。

::: warning 提示  
这里需要有 Github 操作基础。  
:::

**PPX** 已经预先写好了 `.github/workflows/main.yml` 文件。

```yaml
name: build
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest]
    steps:
      - name: 拉取项目代码
        uses: actions/checkout@v3

      - name: 安装node环境
        uses: actions/setup-node@v3
        with:
          node-version: "19"

      - name: 安装pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: "8.3.1"
          run_install: false

      - name: 获取pnpm仓库目录
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: 设置pnpm缓存
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: 安装Python3环境
        uses: actions/setup-python@v4
        with:
          python-version: "3.9"
          cache: "pip"

      - name: 初始化打包环境
        run: pnpm run init

      - name: 开始打包
        run: pnpm run build

      - name: 上传打包完成的程序包
        uses: actions/upload-artifact@v3
        with:
          name: Setup
          retention-days: 1
          path: build/*-*_*.*
```

将代码提交至 `Github` 后，在 `Actions` 下会自动生成两种系统的程序包。

![image](https://pangao1990.gitee.io/vitepress/ppx/guide-expert-package-1.png)
