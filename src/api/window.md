# window

`window` 窗口对象，由 `webview.create_window` 函数返回得到。

```Python
window = webview.create_window('窗口示例', 'https://blog.pangao.vip/docs-ppx/')
```

### window.on_top

获取或设置窗口是否始终位于顶部

```Python
window.on_top
```

### window.x

获取窗口左上角的 X 坐标

```Python
window.x
```

### window.y

获取窗口左上角的 Y 坐标

```Python
window.y
```

### window.width

获取窗口的宽度

```Python
window.width
```

### window.height

获取窗户的高度

```Python
window.height
```

### window.set_title

设置窗口的标题

```Python
window.set_title(title)
```

### window.toggle_fullscreen

在活动显示器上切换窗口的全屏模式。

```Python
window.toggle_fullscreen()
```

### window.resize

调整窗口大小。可选参数 `fix_point` 指定窗口调整大小的点。该参数接受 `webview.window.FixPoint` 枚举（`NORTH`、`SOUTH`、`EAST`、`WEST`）的值。

```Python
window.resize(width, height, fix_point=FixPoint.NORTH | FixPoint.WEST)
```

### window.move

将窗口移动到新位置。

```Python
window.move(x, y)
```

### window.minimize

最小化窗口。

```Python
window.minimize()
```

### window.restore

恢复最小化的窗口。

```Python
window.restore()
```

### window.hide

隐藏窗口。

```Python
window.hide()
```

### window.show

展示被隐藏的窗口。

```Python
window.show()
```

### window.destroy

销毁窗口。

```Python
window.destroy()
```

### window.create_confirmation_dialog

创建一个确认（确定/取消）对话框。

```Python
window.create_confirmation_dialog()
```

##### 示例

```Python
import webview


def open_confirmation_dialog(window):
    result = window.create_confirmation_dialog('提示', '你准备好了吗?')
    if result:
        print('确定')
    else:
        print('取消')


if __name__ == '__main__':
    window = webview.create_window('确认对话框示例', 'https://blog.pangao.vip/docs-ppx')
    webview.start(open_confirmation_dialog, window)
```

### window.create_file_dialog

创建打开的文件（`webview.OPEN_DIALOG`）、打开文件夹（`webview.FOLDER_DIALOG`）或保存文件（`webview.SAVE_DIALOG`）对话框。

```Python
window.create_file_dialog(dialog_type=webview.OPEN_DIALOG,
                          allow_multiple=False, save_filename='',
                          directory='', file_types=())
```

返回所选文件的元组，如果取消，则返回 `None` 。

- **`allow_multiple`** 是否启用多选模式。默认为 **False** 。
- **`directory`** 初始目录。
- **`save_filename`** 保存文件对话框的默认文件名。
- **`file_types`** 打开文件对话框中支持的文件类型字符串的元组。文件类型字符串必须遵循此格式`Description (*.ext1;*.ext2...)`。如果未指定参数，则默认使用`全部文件 (*.*)` 掩码。

##### 示例

加载页面内容后创建一个打开的文件对话框。

```Python

import webview


def open_file_dialog(window):
    file_types = ('图片文件 (*.bmp;*.jpg;*.gif)', '全部文件 (*.*)')

    result = window.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=True, file_types=file_types)
    print(result)


if __name__ == '__main__':
    window = webview.create_window('Open file dialog example', 'https://blog.pangao.vip/docs-ppx')
    webview.start(open_file_dialog, window)
```

### window.evaluate_js

执行 Javascript 代码。返回最后一个求值表达式。如果提供了回调函数，则 promises 将被解析，并将结果作为参数调用回调函数。更多细节，请查看 [域间通信](/guide/expert/communication) 。

```Python
window.evaluate_js(script, callback=None)
```

### window.expose

将一个或多个 Python 函数暴露给 JS API。函数暴露为 `window.pywebview.api.func_name` 。

```Python
window.expose(func_name)
```

### window.get_current_url

返回当前 URL。如果没有加载 URL，则返回 `None` 。

```Python
window.get_current_url()
```

### window.load_html

加载 HTML 代码。

```Python
window.load_html(content, base_uri=base_uri())
```

##### 示例

```Python
import webview
import time


def load_html(window):
    time.sleep(5)
    window.load_html('<h1>动态加载 HTML</h1>')


if __name__ == '__main__':
    window = webview.create_window('加载 HTML 示例', html='<h1>初始化 HTML</h1>')
    webview.start(load_html, window)
```

### window.load_url

加载 URL 。

```Python
window.load_url(url)
```

##### 示例

```Python
import webview
import time


def change_url(window):
    time.sleep(10)
    window.load_url('https://blog.pangao.vip')


if __name__ == '__main__':
    window = webview.create_window('加载 URL 示例', 'https://blog.pangao.vip/docs-ppx')
    webview.start(change_url, window)
```

### window.events

窗口对象有许多生命周期事件。要订阅事件，请使用 `+=` 语法，例如 `window.events.loaded += func` 。当事件被触发时，将调用函数。重复订阅被忽略，重复订阅者只能调用一次功能。取消订阅 `window.events.loaded -= func` 。

```Python
import webview
import time


def on_shown():
    print('窗口显示时')


def on_loaded():
    print('DOM准备就绪时')
    webview.windows[0].events.loaded -= on_loaded
    webview.windows[0].load_url('https://blog.pangao.vip')


def on_minimized():
    print('窗口最小化时')


def on_restored():
    print('窗口恢复时')


def on_maximized():
    print('窗口最大化时')


def on_resized(width, height):
    print('窗口调整大小时，新的窗口大小为: {width} x {height}'.format(width=width, height=height))


def on_moved(x, y):
    print('窗口移动时，新的坐标 x: {x}, y: {y}'.format(x=x, y=y))


def on_closing():
    print('窗口正在关闭')


def on_closed():
    print('窗口关闭')


if __name__ == '__main__':
    window = webview.create_window('事件示例', 'https://blog.pangao.vip/docs-ppx/', confirm_close=True)

    window.events.shown += on_shown
    window.events.loaded += on_loaded
    window.events.minimized += on_minimized
    window.events.maximized += on_maximized
    window.events.restored += on_restored
    window.events.resized += on_resized
    window.events.moved += on_moved
    window.events.closing += on_closing
    window.events.closed += on_closed

    webview.start()
```
