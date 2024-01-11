# 快速上手

## 应用安装

### 运行环境

- pnpm 8.x+ ([pnpm 安装教程](https://pnpm.io/zh/installation))

- Python 3.8-3.11 ([Python 安装教程](https://blog.pangao.vip/Python环境搭建及模块安装))

### 应用下载

利用 git（[git 安装教程](https://blog.pangao.vip/Git安装教程/)） 下载应用，如下所示：

```shell
git clone https://github.com/pangao1990/PPX.git
```

或者，直接在 [github](https://github.com/pangao1990/PPX) 下载。

```shell
# 进入项目
cd PPX
```

进入项目，项目清单如下所示：

![image](https://pangao1990.gitee.io/pic/JavaScript和Python打造跨平台客户端应用——vue-pywebview-pyinstaller-1.png)

### 初始化

下载完毕后，运行初始化命令，程序会自动下载安装对应操作平台的所需依赖软件，如下所示：

```shell
# 初始化
pnpm run init
```

没报错信息，则初始化完成，如下所示：

![image](https://pangao1990.gitee.io/pic/JavaScript和Python打造跨平台客户端应用——vue-pywebview-pyinstaller-2.png)

![image](https://pangao1990.gitee.io/pic/JavaScript和Python打造跨平台客户端应用——vue-pywebview-pyinstaller-3.png)

项目根目录多了一个 node_modules 文件夹和 pnpm-lock.yaml 文件，用于存放 pnpm 下载的包。

## 应用运行

输入如下命令，即可启动应用：

```shell
pnpm run start
```

终端显示如下：

![image](https://pangao1990.gitee.io/pic/JavaScript和Python打造跨平台客户端应用——vue-pywebview-pyinstaller-4.png)

同时，启动一个客户端程序，如下：

![image](https://pangao1990.gitee.io/pic/JavaScript和Python打造跨平台客户端应用——vue-pywebview-pyinstaller-5.png)

整体效果如下所示（gif 图片加载可能有点慢）：

![image](https://pangao1990.gitee.io/pic/JavaScript和Python打造跨平台客户端应用——vue-pywebview-pyinstaller-6.gif)
