---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "PPX"
  text: "构建跨平台客户端应用"
  tagline: 基于 JavaScript 和 Python，一键生成 macOS 和 Windows 平台客户端应用
  image:
    src: /logo.svg
    alt: PPX
  actions:
    - theme: brand
      text: 开始
      link: /guide/start/introduction
    - theme: alt
      text: 在 Github 上查看
      link: https://github.com/pangao1990/ppx

features:
  - title: 🔌 可扩展性
    details: 视图层可使用任意一款你喜欢的前端框架，比如 Vue、React、Angular、HTML 等，迁移无压力。
  - title: 🏗 模块化设计
    details: 采用 Python 编程语言开发业务层，海量模块任你挑选！
  - title: 📦 一键打包
    details: 本应用已经封装打包环节，一键生成 macOS 和 Windows 平台的客户端应用。
  - title: 💡 自动升级
    details: 基于 Github，打包后的客户端应用可自动检测升级。
  - title: 🔑 数据库支持
    details: 自带 SQLite 数据库支持，使用 sqlalchemy 进行 ORM 操作，使用 alembic 进行数据迁移与映射。
  - title: ⚙️ 热更新
    details: 视图层和业务层均支持热更新
---
