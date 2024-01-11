# webview.create_window

创建一个新的客户端窗口并返回其实例。在 GUI 循环启动之前，窗口不会显示。如果在 GUI 循环期间调用该函数，则会立即显示该窗口。

```Python
webview.create_window(title, url=None, html=None, js_api=None, width=800,
    height=600, x=None, y=None, screen=None, resizable=True, fullscreen=False,
    min_size=(200, 100), hidden=False, frameless=False, easy_drag=True,
    focus=True, minimized=False, maximized=False, on_top=False,
    confirm_close=False, background_color='#FFFFFF', transparent=False,
    text_select=False, zoomable=False, draggable=False,
    server=http.BottleServer, server_args={}, localization=None)
```

- **`title`** 窗口标题。
- **`url`** 要加载的 URL。如果 URL 没有协议前缀，则将其解析为相对于应用程序入口点的路径。**或者，可以传递 WSGI 服务器对象来启动本地 Web 服务器。**
- **`html`** 要加载的 HTML 代码。**如果同时指定了 URL 和 HTML，则 HTML 优先。**
- **`js_api`** 将 Python 对象暴露给当前应用窗口的 DOM。即可在 Javascript 代码中通过调用 `window.pywebview.api.<methodname>(<parameters>)` 执行 Python 对象的方法。**调用 Javascript 函数会收到一个 promise ，该 promise 将包含 Python 函数的返回值。只有基本的 Python 对象（如 int、str、dict、...）才能返回到 Javascript。**
- **`width`** 窗口宽度。默认值为 **800** 。
- **`height`** 窗户高度。默认值为 **600** 。
- **`x`** 窗口 x 坐标。默认值 **居中** 。
- **`y`** 窗口 y 坐标。默认值 **居中** 。
- **`screen`** 屏幕显示窗口。`screen` 是由 `webview.screens` 返回的屏幕实例 。
- **`resizable`** 是否可以调整窗口大小。默认值为 **True** 。
- **`fullscreen`** 是否开启全屏模式。默认为 **False** 。
- **`min_size`** 指定最小窗口大小的元组（宽度、高度）。默认值是 **(200, 100)** 。
- **`hidden`** 是否隐藏窗口。默认为 **False** 。
- **`frameless`** 是否开启无框窗口。默认值为 **False** 。
- **`easy_drag`** 是否开启无框窗口的拖动模式。可通过拖动任何点来移动窗口。默认值为**True**。**该参数仅对无框窗口有效，对普通窗口无效。**
- **`focus`** 是否创建一个可聚焦的窗口。默认为 **True** 。
- **`minimized`** 是否开启最小化模式。默认为 **False** 。
- **`maximized`** 是否开启最小化模式。默认为 **False** 。
- **`on_top`** 设置窗口始终在其他窗口的顶部。默认为 **False** 。
- **`confirm_close`** 是否显示窗口关闭确认对话框。默认为 **False** 。
- **`background_color`** 加载 WebView 之前显示的窗口的背景颜色。指定为十六进制颜色。默认是 **'#FFFFFF'** 。
- **`transparent`** 是否开启透明窗口。默认为 **False** 。**不支持 Windows 系统。**
- **`text_select`** 是否启用 document 文本选择。默认值为 **False** 。想要单独控制每个元素的文本选择，请使用 CSS 属性 [**user-select**](https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select) 。
- **`zoomable`** 是否启用文档缩放。默认为 **False** 。
- **`draggable`** 是否启用图像和链接对象拖动。默认为 **False** 。
- **`vibrancy`** 启用窗口毛玻璃效果。默认为 **False** 。**仅支持 macOS 。**
- **`server`** 设置自定义 WSGI 服务器实例。默认为 **http.BottleServer** 。
- **`server_args`** 传递给服务器实例化的字典参数。
- **`localization`** 传递给每个窗口的本地化字典参数。

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
