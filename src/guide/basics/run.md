# 应用运行

## 简单用法

### 初始化

自动下载构建 PPX 运行所需环境。

```shell
pnpm run init
```

### 开发模式

启动开发模式，自带热更新。

```shell
pnpm run start
```

### 正式打包

macOS 系统打包 dmg 程序，Windows 系统打包 exe 程序。当然，也可以基于 Github Action 实现同时打包两种安装包。

```shell
pnpm run build
```

### 预打包

预打包，带 console，方便输出日志信息。

```shell
pnpm run pre
```

## 进阶用法

### 初始化，cef 兼容模式

自动下载构建 cef 模式运行所需环境。初始化 cef 模式之前，请确保已经运行过普通初始化命令 `pnpm run init`。

```shell
pnpm run init:cef
```

### 开发模式，cef 兼容模式

仅 win 系统。

```shell
pnpm run start:cef
```

### 预打包，带 console，cef 兼容模式

仅 win 系统。

```shell
pnpm run pre:cef
```

### 预打包，带 console，生成文件夹

仅 win 系统。

```shell
pnpm run pre:folder
```

### 预打包，带 console，生成文件夹，cef 兼容模式

仅 win 系统。

```shell
pnpm run pre:folder:cef
```

### 正式打包，单个 exe 程序

仅 win 系统。

```shell
pnpm run build:pure
```

### 正式打包，cef 兼容模式

仅 win 系统。

```shell
pnpm run build:cef
```

### 正式打包，生成文件夹

仅 win 系统。

```shell
pnpm run build:folder
```

### 正式打包，生成文件夹，cef 兼容模式

仅 win 系统。

```shell
pnpm run build:folder:cef
```
