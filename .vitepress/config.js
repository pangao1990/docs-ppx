import { defineConfig } from 'vitepress'

const currentGuide = [
  {
    text: '从这里开始',
    collapsed: false,
    items: [
      { text: '认识 PPX', link: '/v6/guide/introduction' },
      { text: '十分钟快速上手', link: '/v6/guide/quick-start' },
      { text: '示例工作台详解', link: '/v6/guide/example-workbench' },
      { text: '项目结构', link: '/v6/guide/project-structure' },
      { text: '配置文件', link: '/v6/guide/configuration' },
    ],
  },
  {
    text: '开发应用',
    collapsed: false,
    items: [
      { text: '开发工作流', link: '/v6/guide/development' },
      { text: 'Python 业务 API', link: '/v6/guide/python-api' },
      { text: '前端桥接', link: '/v6/guide/frontend-bridge' },
      { text: '本地存储', link: '/v6/guide/storage' },
      { text: '环境诊断', link: '/v6/guide/doctor' },
    ],
  },
  {
    text: '更新与发布',
    collapsed: false,
    items: [
      { text: '一键更新框架', link: '/v6/guide/framework-update' },
      { text: '成品应用更新', link: '/v6/guide/application-update' },
      { text: '三端打包', link: '/v6/guide/packaging' },
      { text: 'CI 与发布', link: '/v6/guide/ci-release' },
      { text: '故障排查', link: '/v6/guide/troubleshooting' },
    ],
  },
]

const currentReference = [
  {
    text: 'API 参考',
    collapsed: false,
    items: [
      { text: '命令行', link: '/v6/reference/cli' },
      { text: 'ppx.toml', link: '/v6/reference/config' },
      { text: 'Python API', link: '/v6/reference/python' },
      { text: 'JavaScript API', link: '/v6/reference/javascript' },
      { text: '内置 RPC', link: '/v6/reference/rpc' },
      { text: '更新清单', link: '/v6/reference/update-manifest' },
    ],
  },
  {
    text: '理解内部实现',
    collapsed: false,
    items: [
      { text: '总体架构', link: '/v6/internals/architecture' },
      { text: '启动与调用链', link: '/v6/internals/lifecycle' },
      { text: '安全边界', link: '/v6/internals/security' },
      { text: '参与开发', link: '/v6/internals/contributing' },
    ],
  },
]

const v5Guide = [
  {
    text: 'V5 文档（已归档）',
    collapsed: false,
    items: [
      { text: 'V5 文档入口', link: '/v5/' },
      { text: 'V5 原版首页', link: '/v5/home' },
      { text: '简介', link: '/guide/start/introduction' },
      { text: '快速上手', link: '/guide/start/quick-start' },
      { text: '目录结构', link: '/guide/basics/tree' },
      { text: '配置文件', link: '/guide/basics/config' },
      { text: '视图层', link: '/guide/basics/gui' },
      { text: '业务层', link: '/guide/basics/server' },
      { text: '客户端', link: '/guide/basics/main' },
      { text: '应用运行', link: '/guide/basics/run' },
      { text: '数据库', link: '/guide/expert/db' },
      { text: '域间通信', link: '/guide/expert/communication' },
      { text: '应用更新', link: '/guide/expert/update' },
      { text: '应用打包', link: '/guide/expert/package' },
    ],
  },
]

v5Guide.push({
  text: 'V5 pywebview API',
  collapsed: false,
  items: [
    { text: 'webview.create_window', link: '/api/webview-create-window' },
    { text: 'webview.start', link: '/api/webview-start' },
    { text: 'webview.screens', link: '/api/webview-screens' },
    { text: 'webview.menu', link: '/api/webview-menu' },
    { text: '拖拽区域', link: '/api/webview-DRAG-REGION-SELECTOR' },
    { text: 'window', link: '/api/window' },
  ],
})

export default defineConfig({
  lang: 'zh-CN',
  title: 'PPX',
  description: 'PPX：使用 Python 和任意 Web 前端构建 Windows、macOS、Linux 桌面应用',
  base: '/docs-ppx/',
  srcDir: './src',
  outDir: './dist',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/docs-ppx/logo.svg' }],
    [
      'script',
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement('script');
          hm.src = 'https://hm.baidu.com/hm.js?e2f1267b862442d982dfdc8fff4ec5a1';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'PPX',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/v6/guide/introduction', activeMatch: '^/v6/guide/' },
      { text: 'API', link: '/v6/reference/cli', activeMatch: '^/v6/(reference|internals)/' },
      {
        text: '版本',
        activeMatch: '^/(v5|v6|guide|api)/',
        items: [
          { text: 'V6（当前版本）', link: '/v6/guide/introduction' },
          { text: 'V5（归档版本）', link: '/v5/' },
        ],
      },
      { text: '致谢', link: '/thanks/' },
      {
        text: '资源',
        items: [
          { text: 'GitHub 仓库', link: 'https://github.com/pangao1990/PPX' },
          { text: '更新日志', link: 'https://github.com/pangao1990/PPX/blob/main/CHANGELOG.md' },
          { text: 'ppx-py 源码', link: 'https://github.com/pangao1990/PPX/tree/main/ppx/packages/ppx-py' },
          { text: 'ppx-js 源码', link: 'https://github.com/pangao1990/PPX/tree/main/ppx/packages/ppx-js' },
        ],
      },
    ],
    sidebar: {
      '/v6/guide/': currentGuide,
      '/v6/reference/': currentReference,
      '/v6/internals/': currentReference,
      '/v5/': v5Guide,
      '/guide/': v5Guide,
      '/api/': v5Guide,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pangao1990/PPX' },
    ],
    lastUpdated: { text: '最后更新' },
    editLink: {
      pattern: 'https://github.com/pangao1990/docs-ppx/edit/main/src/:path',
      text: '为此页提供修改建议',
    },
    docFooter: { prev: '上一页', next: '下一页' },
    footer: {
      message: '默认介绍 PPX 最新版；V5 文档已归档，可从版本菜单访问。',
      copyright: 'Copyright © PanGao',
    },
    outline: { level: [2, 4], label: '本页目录' },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
  },
})
