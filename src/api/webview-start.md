# webview.start

启动 GUI 循环，并显示已经创建的窗口。**此函数必须从主线程调用。**

```Python
webview.start(func=None, args=None, gui=None, debug=False, menu=[],
              http_server=False, http_port=None, user_agent=None,
              server=http.BottleServer, server_args={}, localization={})
```

- **`func`** 启动 GUI 循环时调用的函数。
- **`args`** 调用函数的传参。可以是单个变量，也可以是元组。
- **`gui`** 指定 GUI 模式，可选值为 `None`、`cef`、`qt`、`gtk`。更多细节请查看 [渲染器](https://pywebview.flowrl.com/guide/renderer.html#gtk-webkit2) 。
- **`debug`** 是否启用调试模式。默认为 **False** 。
- **`http_server`** 是否启用内置 HTTP 服务器。默认为 **False** 。如果启用，将会为每个窗口开启一个独立的 HTTP 服务器，并使用随机端口。对于非本地 URL，此参数被忽略。
- **`http_port`** 指定 HTTP 服务器的端口号。默认 **随机端口** 。
- **`user_agent`** 设置 User-Agent 字符串。
- **`menu`** 传递菜单对象列表以创建应用程序菜单。
- **`server`** 设置自定义 WSGI 服务器实例。默认为 **http.BottleServer** 。
- **`server_args`** 传递给服务器实例化的字典参数。
- **`localization`** 本地化字典参数。

```Python
# 修改应用自带文字

localization = {
    'global.quitConfirmation': u'Do you really want to quit?',
    'global.ok': u'OK',
    'global.quit': u'Quit',
    'global.cancel': u'Cancel',
    'global.saveFile': u'Save file',
    'cocoa.menu.about': u'About',
    'cocoa.menu.services': u'Services',
    'cocoa.menu.view': u'View',
    'cocoa.menu.hide': u'Hide',
    'cocoa.menu.hideOthers': u'Hide Others',
    'cocoa.menu.showAll': u'Show All',
    'cocoa.menu.quit': u'Quit',
    'cocoa.menu.fullscreen': u'Enter Fullscreen',
    'windows.fileFilter.allFiles': u'All files',
    'windows.fileFilter.otherFiles': u'Other file types',
    'linux.openFile': u'Open file',
    'linux.openFiles': u'Open files',
    'linux.openFolder': u'Open folder',
}
```
