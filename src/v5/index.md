# PPX V5 文档

这里保留 PPX V5.3.4 及更早版本的完整文档，供仍在维护旧项目的开发者查阅。

::: warning 已归档
V5 不再新增功能。V5 与 V6 的目录、配置、RPC、存储和构建方式均不兼容，不能把 V6 文件复制到 V5 项目，也没有自动迁移脚本。
:::

## 如何确认自己使用的是 V5？

出现以下结构或概念时，通常是 V5 项目：

- 项目根目录存在 `pyapp/`；
- 使用旧的 `main.py`、静态 `Config` 或 V5 域间通信方式；
- 版本为 `V5.x`；
- 打包脚本直接保存在项目目录中。

V6 普通项目只有 `api/`、`gui/`、`ppx/assets/` 和少量配置，并使用 `ppx-py`、`ppx-js` 两个包。不要在没有确认版本时混用两套文档。

## 原有文档

[V5 原版首页](/v5/home)保留了当时的首页介绍，以下链接继续使用旧路径。

- [V5 简介](/guide/start/introduction)
- [V5 快速上手](/guide/start/quick-start)
- [V5 目录结构](/guide/basics/tree)
- [V5 配置文件](/guide/basics/config)
- [V5 应用运行](/guide/basics/run)
- [V5 域间通信](/guide/expert/communication)
- [V5 应用更新](/guide/expert/update)
- [V5 应用打包](/guide/expert/package)
- [V5 pywebview API](/api/webview-create-window)

顶部导航的“版本”菜单可以随时切回 V6。所有旧 `/guide/` 和 `/api/` 页面顶部也会显示 V5 归档提示。

## 源码

V5.3.4 源码保存在 PPX 仓库的 [`V5.3.4` 标签](https://github.com/pangao1990/PPX/tree/V5.3.4)。继续维护旧项目时，请固定该标签和原有依赖。

开始新项目时，请使用 [PPX V6 快速上手](/v6/guide/quick-start)。

## 从 V5 到 V6

PPX 不提供自动迁移，因为两代版本无法安全判断哪些旧文件经过用户修改。推荐方式是：

1. 保留当前 V5 项目和可运行发布版本；
2. 用 V6 `ppx new` 创建新项目；
3. 只迁移经过确认的 Python 业务、页面和业务资源；
4. 按 V6 `@api_method` 重新定义前后端接口；
5. 为业务数据单独编写并测试迁移；
6. 在三端完整验收后再替换 V5 发布渠道。

不要复制 V5 的 `pyapp/`、入口、配置、存储基类和打包脚本到 V6。
