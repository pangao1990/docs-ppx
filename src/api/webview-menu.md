# webview.menu

创建应用程序菜单。

```Python
webview.menu
```

### webview.menu.Menu

实例化以创建一个菜单，该菜单可以是顶级菜单或嵌套菜单。`title` 是菜单的标题，`items` 是操作、分隔符或其他菜单的列表。

```Python
webview.menu.Menu(title, items=[])
```

### webview.menu.MenuAction

实例化以创建菜单项。`title` 是项目的名称，函数是单击菜单操作时调用的函数。

```Python
webview.menu.MenuAction(title, function)
```

### webview.menu.MenuSeparator

实例化以创建菜单分隔符。

```Python
webview.menu.MenuSeparator(title, function)
```

### 示例

```Python
import webview
import webview.menu as wm


def changeUrl():
    active_window = webview.active_window()
    if active_window:
        active_window.load_url('https://blog.pangao.vip')

def clickMe():
    active_window = webview.active_window()
    if active_window:
        active_window.load_html('<h1>You clicked me!</h1>')

def openFileDialog():
    active_window = webview.active_window()
    active_window.create_file_dialog(webview.SAVE_DIALOG, directory='/', save_filename='test.file')

def doNothing():
    pass


if __name__ == '__main__':
    window = webview.create_window('菜单示例', 'https://blog.pangao.vip/docs-ppx/')

    menuItems = [
        wm.Menu(
            '菜单1',
            [
                wm.MenuAction('切换页面', changeUrl),
                wm.MenuSeparator(),
                wm.Menu(
                    '其他操作',
                    [
                        wm.MenuAction('点我', clickMe),
                        wm.MenuAction('保存文件', openFileDialog)
                    ]
                )
            ]
        ),
        wm.Menu(
            '菜单2',
            [
                wm.MenuAction('啥也不是', doNothing)
            ]
        )
    ]

    webview.start(menu=menuItems)

```

效果展示：  
![image](https://cdn.jsdelivr.net/gh/pangao1990/docs-ppx/src/public/image/api-webview-menu-1.png)
