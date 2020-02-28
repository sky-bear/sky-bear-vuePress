## HTML5 websocket

### 什么是webSocket？

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

现在，很多网站为了实现推送技术，所用的技术都是 Ajax 轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。



### 作用

解决ajax轮询， 使前后端可以实时通讯， 能更好的节省服务器资源和带宽。



### 方法和使用

- **创建对象**

  ```js
  const Socket = new WebSocket(url, [protocol] );
  ```

  第一个参数 url, 指定连接的 URL。第二个参数 protocol 是可选的，指定了可接受的子协议。

- **属性**

  |         属性          | 描述                                                         |
  | :-------------------: | :----------------------------------------------------------- |
  |   Socket.readyState   | 只读属性 **`readyState**` 表示连接状态，可以是以下值：-0 - 表示连接尚未建立。 1 - 表示连接已建立，可以进行通信。 2 - 表示连接正在进行关闭。 3 - 表示连接已经关闭或者连接不能打开。 |
  | Socket.bufferedAmount | 只读属性 **`bufferedAmount**` 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。 |

- **事件**

  | 事件    | 事件处理程序     | 描述                       |
  | :------ | :--------------- | :------------------------- |
  | open    | Socket.onopen    | 连接建立时触发             |
  | message | Socket.onmessage | 客户端接收服务端数据时触发 |
  | error   | Socket.onerror   | 通信发生错误时触发         |
  | close   | Socket.onclose   | 连接关闭时触发             |

- **方法**

  | 方法           | 描述             |
  | :------------- | :--------------- |
  | Socket.send()  | 使用连接发送数据 |
  | Socket.close() | 关闭连接         |

### demo

- ```js
  <h3>webssocket</h3>
  <input type="text" />
  <div>未连接</div>
  <button>发送</button>
  <script>
      const websocket = new WebSocket("ws://echo.websocket.org/");
      websocket.onopen = function() {
          document.querySelector("div").innerHTML = "连接上了";
      };
      websocket.onclose = function() {
          console.log("关闭了");
      };
      websocket.onmessage = function(e) {
          console.log(e);
          document.querySelector("div").innerHTML = e.data;
      };
      document.querySelector("button").onclick = function() {
          const value = document.querySelector("input").value;
          websocket.send(value);
      };
  </script>
  ```

  简单的创建`WebSocket`对象， 并在页面实现通讯

  ![](F:\常用工作表\learn\sky-bear\俄罗斯方块的实现\第一阶段\image\websocket.png)

  

- 通过使用`nodejs-websocket`

  ```js
  server.js
  const WS = require("nodejs-websocket");
  
  const port = 9000;
  const createServer = WS.createServer(connection => {
    connection.on("text", function(result) {
      console.log("发送消息", result);
      connection.sendText(result.toUpperCase() + "!!!");
    });
    connection.on("connect", function(code) {
      console.log("开启连接", code);
    });
    connection.on("close", function(code) {
      console.log("关闭连接", code);
    });
    connection.on("error", function(code) {
      console.log("异常关闭", code);
    });
  }).listen(port)
  ```

- `socket.io`详细使用方法<https://socket.io/>

  ```js
  server.js
  var app = require("http").createServer();
  var io = require("socket.io")(app);
  
  app.listen(3000);
  
  io.on("connection", function(socket) {
    socket.emit("news", { hello: "world" });
    socket.on("my other event", function(data) {
      console.log(data);
    });
  });
  
  ```

  