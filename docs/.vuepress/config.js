module.exports = {
  title: "sky-bear",
  description: "sky-bear的网站",
  head: [["link", { rel: "icon", href: "/image/icon.png" }]],
  port: 9000,
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "javaScript", link: "/pages/javascript/async-await.md" },
      { text: "vue", link: "/pages/vue/react.md" }
    ]
  }
};
