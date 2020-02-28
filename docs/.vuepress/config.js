const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  title: "sky-bear",
  description: "sky-bear的网站",
  head: [["link", { rel: "icon", href: "/image/icon.png" }]],
  port: 9000,
  themeConfig: {
    sidebarDepth: 2,
    nav: [
      { text: "首页", link: "/" },
      { text: "基础", link: "/pages/basic/basic.md" },
      { text: "javaScript", link: "/pages/javascript/async-await.md" },
      // {
      //   text: "vue",
      //   items: [
      //     { text: "vue", link: "/pages/vue/react.md" },
      //     { text: "vuePress", link: "/pages/vue/vuepress.md" }
      //   ]
      // }
      { text: "react", link: "/pages/react/react.md" },
      { text: "vuePress", link: "/pages/vuepress/vuepress.md" }
    ],
    sidebar: {
      "/pages/basic/": [
        ["basic", "基础知识"],
        ["copy", "javascript的复制"],
        ["debounceAndThrottle", "防抖和节流"],
        ["lazy", "图片懒加载"],
        ["websocket", "websocket的简单应用"],
        ["tetris", "俄罗斯方块的实现"],
        ["typeChange", "js中的隐式转换"]
      ],
      "/pages/javascript/": [["async-await", "async-await"]],
      "/pages/react/": [["react", "react"]],
      "/pages/vuepress/": [["vuepress", "vuepress"]]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@image": resolve("./public/image")
      }
    }
  }
};
