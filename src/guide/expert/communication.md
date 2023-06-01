# 域间通信

这里的通信指的是 JavaScript（视图层，前端）和 Python（业务层，后端）的相互访问。

### 从 Python 调用 JavaScript

在 `Python` 代码中调用 `window.evaluate_js(code, callback=None)` 可以执行 `JavaScript` 代码。

- 在视图层代码中，绑定函数到 `window` 。

```JavaScript
// JavaScript

window['py2js_demo'] = (res) => {
    const resDict = JSON.parse(res)
    console.log('js', resDict)
}
```

- 在业务层代码中，调用视图层的函数。

```Python
# Python

import webview

def system_py2js(window):
    '''调用js中挂载到window的函数'''
    info = {'appName': 'PPX'}
    infoJson = json.dumps(info)
    window.evaluate_js(f"py2js_demo('{infoJson}')")

window = webview.create_window()
webview.start(system_py2js, window)
```

### 从 JavaScript 调用 Python

在 `Python` 代码中将类的实例传给 `create_window` 的 `js_api` 。在 `JavaScript` 代码中调用 `pywebview.api.method_name` 即可。

- 在业务层代码中，将类的实例传给 `create_window` 的 `js_api` 。

```Python
# Python

import webview

class Api:
    def system_getAppInfo(self):
        return {'appName': 'PPX'}

if __name__ == '__main__':
    api = Api()
    webview.create_window(js_api=api)
    webview.start()
```

- 在视图层代码中，调用业务层的函数。

```JavaScript
// JavaScript

window.pywebview.api.system_getAppInfo().then((res) => {
    console.log('js', res)
})
```
