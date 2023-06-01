import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PPX",
  description:
    "基于 pywebview 和 PyInstaller 框架，构建 macOS 和 Windows 平台的客户端",
  lang: "zh-CN",
  base: "/docs-ppx/", // 公共基础路径
  srcDir: "./src", // 源目录
  outDir: "./dist", // 构建输出位置
  lastUpdated: true, //开启上次更新时间
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    // 侧边栏
    sidebar: {
      "/guide/": [
        {
          text: "开始",
          collapsed: false,
          items: [
            { text: "简介", link: "/guide/start/introduction" },
            { text: "快速上手", link: "/guide/start/quick-start" },
          ],
        },
        {
          text: "基础",
          collapsed: false,
          items: [
            { text: "目录结构", link: "/guide/basics/tree" },
            { text: "配置文件", link: "/guide/basics/config" },
            { text: "视图层", link: "/guide/basics/gui" },
            { text: "业务层", link: "/guide/basics/server" },
            { text: "客户端", link: "/guide/basics/main" },
            { text: "应用运行", link: "/guide/basics/run" },
          ],
        },
        {
          text: "高级",
          collapsed: false,
          items: [
            { text: "域间通信", link: "/guide/expert/communication" },
            { text: "应用更新", link: "/guide/expert/update" },
            { text: "应用打包", link: "/guide/expert/package" },
          ],
        },
      ],
      "/api/": [],
    },

    // 定义右侧菜单导航
    nav: [
      {
        text: "指南",
        link: "/guide/start/introduction",
        activeMatch: "/guide", // activeMatch表示当URL中存在那些内容时，点亮该菜单按钮
      },
      {
        text: "相关链接",
        items: [
          {
            text: "讨论问题",
            link: "https://github.com/pangao1990/PPX/issues",
          },
          {
            text: "更新日志",
            link: "https://github.com/pangao1990/PPX/releases",
          },
        ],
      },
    ],

    lang: "zh-CN",

    // 导航栏最左侧的LOGO
    logo: "/logo.svg",

    // 导航栏最左侧的大标题
    siteTitle: "PPX",

    // 最右侧的友情链接小图标
    socialLinks: [
      { icon: "github", link: "https://github.com/pangao1990/PPX" },
      {
        icon: {
          svg: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M512 1007.3590325C238.41320635 1007.3590325 16.6409675 785.58679365 16.6409675 512S238.41320635 16.6409675 512 16.6409675s495.3590325 221.77223885 495.3590325 495.3590325-221.77223885 495.3590325-495.3590325 495.3590325z m-158.16813907-426.90041421a89.41230537 89.41230537 0 1 0 0 178.82461073 89.41230537 89.41230537 0 0 0 0-178.82461073zM303.05756009 406.7857415a38.68754044 38.68754044 0 0 0-38.63800453 38.68754043v1.68422072c0 21.3499743 17.28803023 38.68754044 38.63800453 38.73707634a235.04786093 235.04786093 0 0 1 234.80018141 234.7506455c0 21.3499743 17.33756614 38.63800453 38.68754043 38.68754044h1.73375662a38.68754044 38.68754044 0 0 0 38.63800454-38.68754044 314.20623431 314.20623431 0 0 0-313.859483-313.85948299z m0-142.31665005a38.73707634 38.73707634 0 0 0 0 77.42461679c208.84336811 0 378.75151625 169.90814814 378.75151625 378.75151625a38.68754044 38.68754044 0 0 0 77.42461679 0c0-121.85832199-47.45539531-236.38533031-133.59833108-322.57780196a453.30305065 453.30305065 0 0 0-322.57780196-133.59833108z"></path></svg>',
        },
        link: "https://blog.pangao.vip",
      },
    ],

    // 为此页提供修改建议
    editLink: {
      pattern: "https://github.com/pangao1990/docs-ppx/edit/main/src/:path",
      text: "为此页提供修改建议",
    },

    // 修改 上一页 或 下一页
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 页脚。注意，当侧边栏可见时，不会显示页脚
    footer: {
      copyright:
        '本文档内容版权为 <a href="https://blog.pangao.vip/about" target="_blank" style="color:#10b981" onMouseOver="this.style.color=\'#059669\';this.style.textDecoration=\'underline\'" onMouseOut="this.style.color=\'#10b981\';this.style.textDecoration=\'none\'">PanGao</a> 所有，保留所有权利。',
    },

    // 本地搜索
    search: {
      provider: "local",
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                },
              },
            },
          },
        },
      },
    },

    // carbonAds
    // carbonAds: {
    //   code: "your-carbon-code",
    //   placement: "your-carbon-placement",
    // },
  },
});
