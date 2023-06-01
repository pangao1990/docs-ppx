# 应用更新

基于 **Github releases** ，实现应用的版本控制和更新升级。

`Github releases` 的 api url 格式为:

```shell
https://api.github.com/repos/用户名/仓库名/releases/latest

# 示例
# 用户名：pangao1990
# 仓库名：PPX
# 那么，Github releases 的 api url 为
# https://api.github.com/repos/pangao1990/ppx/releases/latest
```

[Github releases](https://api.github.com/repos/pangao1990/ppx/releases/latest) 地址返回的数据为 `JSON` 格式：

::: details 点击我查看代码

```Json
{
"url": "https://api.github.com/repos/pangao1990/PPX/releases/104341620",
"assets_url": "https://api.github.com/repos/pangao1990/PPX/releases/104341620/assets",
"upload_url": "https://uploads.github.com/repos/pangao1990/PPX/releases/104341620/assets{?name,label}",
"html_url": "https://github.com/pangao1990/PPX/releases/tag/V4.0.1",
"id": 104341620,
"author": {
"login": "pangao1990",
"id": 36030293,
"node_id": "MDQ6VXNlcjM2MDMwMjkz",
"avatar_url": "https://avatars.githubusercontent.com/u/36030293?v=4",
"gravatar_id": "",
"url": "https://api.github.com/users/pangao1990",
"html_url": "https://github.com/pangao1990",
"followers_url": "https://api.github.com/users/pangao1990/followers",
"following_url": "https://api.github.com/users/pangao1990/following{/other_user}",
"gists_url": "https://api.github.com/users/pangao1990/gists{/gist_id}",
"starred_url": "https://api.github.com/users/pangao1990/starred{/owner}{/repo}",
"subscriptions_url": "https://api.github.com/users/pangao1990/subscriptions",
"organizations_url": "https://api.github.com/users/pangao1990/orgs",
"repos_url": "https://api.github.com/users/pangao1990/repos",
"events_url": "https://api.github.com/users/pangao1990/events{/privacy}",
"received_events_url": "https://api.github.com/users/pangao1990/received_events",
"type": "User",
"site_admin": false
},
"node_id": "RE_kwDOHDjPp84GOCB0",
"tag_name": "V4.0.1",
"target_commitish": "main",
"name": "V4.0.1",
"draft": false,
"prerelease": false,
"created_at": "2023-05-26T02:31:45Z",
"published_at": "2023-05-26T03:04:37Z",
"assets": [
{
"url": "https://api.github.com/repos/pangao1990/PPX/releases/assets/109869064",
"id": 109869064,
"node_id": "RA_kwDOHDjPp84GjHgI",
"name": "PPX-V4.0.1_macOS.dmg",
"label": null,
"uploader": {
"login": "pangao1990",
"id": 36030293,
"node_id": "MDQ6VXNlcjM2MDMwMjkz",
"avatar_url": "https://avatars.githubusercontent.com/u/36030293?v=4",
"gravatar_id": "",
"url": "https://api.github.com/users/pangao1990",
"html_url": "https://github.com/pangao1990",
"followers_url": "https://api.github.com/users/pangao1990/followers",
"following_url": "https://api.github.com/users/pangao1990/following{/other_user}",
"gists_url": "https://api.github.com/users/pangao1990/gists{/gist_id}",
"starred_url": "https://api.github.com/users/pangao1990/starred{/owner}{/repo}",
"subscriptions_url": "https://api.github.com/users/pangao1990/subscriptions",
"organizations_url": "https://api.github.com/users/pangao1990/orgs",
"repos_url": "https://api.github.com/users/pangao1990/repos",
"events_url": "https://api.github.com/users/pangao1990/events{/privacy}",
"received_events_url": "https://api.github.com/users/pangao1990/received_events",
"type": "User",
"site_admin": false
},
"content_type": "application/octet-stream",
"state": "uploaded",
"size": 11949605,
"download_count": 12,
"created_at": "2023-05-26T02:49:15Z",
"updated_at": "2023-05-26T02:56:01Z",
"browser_download_url": "https://github.com/pangao1990/PPX/releases/download/V4.0.1/PPX-V4.0.1_macOS.dmg"
},
{
"url": "https://api.github.com/repos/pangao1990/PPX/releases/assets/109870682",
"id": 109870682,
"node_id": "RA_kwDOHDjPp84GjH5a",
"name": "PPX-V4.0.1_Windows.exe",
"label": null,
"uploader": {
"login": "pangao1990",
"id": 36030293,
"node_id": "MDQ6VXNlcjM2MDMwMjkz",
"avatar_url": "https://avatars.githubusercontent.com/u/36030293?v=4",
"gravatar_id": "",
"url": "https://api.github.com/users/pangao1990",
"html_url": "https://github.com/pangao1990",
"followers_url": "https://api.github.com/users/pangao1990/followers",
"following_url": "https://api.github.com/users/pangao1990/following{/other_user}",
"gists_url": "https://api.github.com/users/pangao1990/gists{/gist_id}",
"starred_url": "https://api.github.com/users/pangao1990/starred{/owner}{/repo}",
"subscriptions_url": "https://api.github.com/users/pangao1990/subscriptions",
"organizations_url": "https://api.github.com/users/pangao1990/orgs",
"repos_url": "https://api.github.com/users/pangao1990/repos",
"events_url": "https://api.github.com/users/pangao1990/events{/privacy}",
"received_events_url": "https://api.github.com/users/pangao1990/received_events",
"type": "User",
"site_admin": false
},
"content_type": "application/x-msdownload",
"state": "uploaded",
"size": 15265219,
"download_count": 5,
"created_at": "2023-05-26T02:56:01Z",
"updated_at": "2023-05-26T03:04:26Z",
"browser_download_url": "https://github.com/pangao1990/PPX/releases/download/V4.0.1/PPX-V4.0.1_Windows.exe"
}
],
"tarball_url": "https://api.github.com/repos/pangao1990/PPX/tarball/V4.0.1",
"zipball_url": "https://api.github.com/repos/pangao1990/PPX/zipball/V4.0.1",
"body": "修复 python 创建 venv 虚拟环境时，pip 不是最新版的问题"
}
```

:::

本应用已经内置解析 `Github releases` 的脚本，即 `pyapp/update/update.py` 。结合视图层的 `BtnUpdate.vue` 组件，已经实现如下功能：

- 新版本提示，更新内容提示，更新失败提示
- 自动更新
- 手动更新（跳转到 [Github releases](https://github.com/pangao1990/PPX/releases) 主页手动下载应用安装包）
- 后台更新
- 展示下载进度
- ...

<br />

![image](https://pangao1990.gitee.io/vitepress/ppx/guide-expert-update-1.png)
