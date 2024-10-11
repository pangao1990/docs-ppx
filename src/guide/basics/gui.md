# 视图层

### 前言

本示例视图层（即：前端）使用的是 [**Vue**](https://cn.vuejs.org) 技术。当然了，本项目可以使用任意前端技术。只需要在 `gui` 文件夹下存放前端代码，并且在 `pyapp\config\config.py` 脚本设置开发环境中的前端页面端口即可。

### 启动前端

在项目根目录下，运行如下代码，即可启动前端网页。

```shell
pnpm run dev
```

![image](https://cdn.jsdelivr.net/gh/pangao1990/docs-ppx/src/public/image/guide-basics-gui-1.png)

**注意:** 一般情况下，并不建议直接启动前端应用。单纯的启动前端不利于整体客户端的联调。建议使用如下代码，直接开启完整客户端测试。

```shell
pnpm run start
```

![image](https://cdn.jsdelivr.net/gh/pangao1990/docs-ppx/src/public/image/guide-basics-gui-2.png)

更多 Vue 前端基础知识，请访问 [**Vue**](https://cn.vuejs.org) 官网。
