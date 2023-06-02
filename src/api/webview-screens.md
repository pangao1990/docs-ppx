# webview.screens

返回显示器大小信息的列表，列表元素是 `Screen` 对象（包含宽度，高度等信息）。主显示器是列表第一个元素。

```Python
webview.screens
```

### 示例

```Python
import webview

screensList = webview.screens
print(screensList)    # [(1440, 900), (1920, 1080)]

screens = screensList[0]
width = screens.width
height = screens.height
print(width, height)    # 1440 900

```
