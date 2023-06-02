# webview.DRAG_REGION_SELECTOR

使用无框窗口时，可以通过在 html 中添加一个名为 `pywebview-drag-region` 的特殊类来移动或拖动窗口。

```html
<div class="pywebview-drag-region">此元素可以像原生bar一样移动窗口</div>
```

可以通过重新分配 `webview.DRAG_REGION_SELECTOR` 常量来覆盖魔法类名。
