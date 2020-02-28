## vuepress 搭建博客到发布

博客这个自己从来没搭建过， 最近忽然想试试怎么操作， 于是就用了`vuePresss`+`github`来搭建自己的博客， 使用`github`最大的好处就是免费， 免费的东东我们要提倡，下面就是我开发博客的过程， 后续如果添加什么新的功能， 会继续更新！

#### vuePress 是干啥的？

这个官网有， 很详细，[给个链接自己看吧](https://vuepress.vuejs.org/zh/)

#### 安装

既然使用 vuePress 搭建那第一步就是要安装了， 这个官网的教程很好的。 安装有全局安装和项目安装， 一般的话自己玩， 弄个项目安装就行。

```js
创建一个文件夹 //demo

初始化
npm init

安装 vuePress
npm install -D vuepress

新建一个文件夹
mkdir docs

新建一个markdown 文件，这里也可以直接拖入一个自己写好的markdowm文件， 这里对用就是博客首页的内容
echo '# Hello VuePress!' > docs/README.md
这样在docs文件夹中插入了一个md文本

接着就是启动项目， 在package.json中插入启动命令
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "docs:dev": "vuepress dev docs",  // 启动命令， 默认打开端口8080
    "docs:build": "vuepress build docs", // 打包命令
  },

启动之后打开http://localhost:8080/  就可以看到网页了

```

项目目录图

```
demo 文件夹
|——docs
	|——.vuepress ------ 这是增加配置的文件
		|——dist 执行 打包命令 npm run docs：build产生的文件夹， 也是就是要部署的代码
		|——public 用来存静态资源
		|——config.js 配置页面显示的文件
	|——pages 自己添加的文件夹 用来区分页面
	|——README.md  首页显示的内容
|——package.json
|——deploy.sh 添加的自动部署代码

```

`deploy.sh` 需要在`packjson.json`的 scripts 添加 `"deploy": "bash deploy.sh"`

```
# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'feat: v1.0版本'

# 如果发布到 https://<USERNAME>.github.io
 git push -f git@github.com:sky-bear/sky-bear.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

#### 增加基础配置

网页打开了， 但是系统给的配置太少， 我们要自己加点东西。
