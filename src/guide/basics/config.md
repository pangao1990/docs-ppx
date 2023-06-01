# 配置文件

### 程序基础配置信息

```Python
# 程序基础配置信息
appName = 'PPX'  # 应用名称
appNameEN = 'ppx'    # 应用名称-英文（用于生成缓存文件夹，必须是英文）
appVersion = "V4.1.0"  # 应用版本号
appDeveloper = "PanGao"  # 应用开发者
appBlogs = "https://blog.pangao.vip"  # 个人博客
appPackage = 'vip.pangao'    # 应用包名，用于在本地电脑生成 vip.pangao.ppx 唯一文件夹
appUpdateUrl = 'https://api.github.com/repos/pangao1990/ppx/releases/latest'    # 获取程序更新信息 https://api.github.com/repos/pangao1990/ppx/releases/latest
appISSID = ''    # Inno Setup 打包唯一编号。在执行 pnpm run init 之前，请设置为空，程序会自动生成唯一编号，生成后请勿修改！！！
```

**注意：**  
`appISSID` 参数，在执行 `pnpm run init` 之前，请设置为空，程序会自动生成唯一编号，生成后请勿修改！！！  
`appUpdateUrl` 参数，填入 `Github releases` 的 api url 值。

### 系统配置信息（不需要修改，可以自动获取）

```Python
# 系统配置信息（不需要修改，可以自动获取）
appSystem = platform.system()    # 本机系统类型
appIsMacOS = appSystem == 'Darwin'    # 是否为macOS系统
codeDir = sys.path[0].replace('base_library.zip', '')    # 代码根目录
appDir = codeDir.replace(appName+'.app/Contents/MacOS/', '')    # 程序所在绝对目录
staticDir = os.path.join(codeDir, 'static')    # 程序包中的static文件夹的绝对路径
storageDir = ''    # 电脑上的存储目录
downloadDir = ''    # 电脑上的下载目录
```

### 其他配置信息

```Python
# 其他配置信息
devPort = '5173'    # 开发环境中的前端页面端口
cryptoKey = ''    # 对Python字节码加密。在执行 pnpm run init 之前，请设置为空，程序会自动生成密钥
devEnv = True    # 是否为开发环境，不需要手动更改，在程序运行的时候自动判断
ifCoverDB = False    # 是否覆盖电脑上存储的数据库，默认不覆盖。只有在数据库改动非常大，不得已的情况下才建议覆盖数据库
```

**注意：**  
`cryptoKey` 参数，在执行 `pnpm run init` 之前，请设置为空，程序会自动生成密钥  
`devPort` 参数，填入视图层（前端）的开发模式的端口。
