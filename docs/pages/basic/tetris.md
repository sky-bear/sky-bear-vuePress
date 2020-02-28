# 俄罗斯方块

实现如下图所示的俄罗斯方块游戏

![](~@image/squer.gif)

## 原理

- 游戏区域 `200px * 400px` 下一个提示区域 `80px * 80px` 每个形状的方块有`20px * 20px` 的小方块构成

- 游戏区域的数据通过一个二维数组控制

  - 控制游戏区域的数据

    ```js
    // 定义当前游戏的数据
    // 20行 10列
    const gameData = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    // const gameData = Array.from({ length: 20 }).map(_ =>
    //   Array.from({ length: 10 }).fill(0)
    // );
    ```

  - 上面是游戏区域的数据， 此时还需要一个数据控制游戏区域的每个小方块， 通过游戏数据的初始化生成

    ```js
    /*
     *@Descripttion: '初始化游戏数据函数'
     *@param: 'data' { Array } 游戏数据
     *@param: 'contain' { Element } DOM
     *@param: 'divs'  { Array } 存储对应的div节点
     *@return:
     */
    const initDiv = (contain, data, divs) => {
      const { length } = data;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < length; i++) {
        const div = [];
        for (let j = 0; j < data[i].length; j++) {
          const dom = document.createElement("div");
          dom.className = "none";
          dom.style.top = i * 20 + "px";
          dom.style.left = j * 20 + "px";
          fragment.appendChild(dom);
          div.push(dom);
        }
        divs.push(div);
      }
      // 全部循环完成后再插入
      contain.appendChild(fragment);
    };
    ```

- 同理右侧的下一个方块的显示规则和游戏区域差不多

  - 通过二位数组控制

    ```js
    const nextData = [[0, 2, 0, 0], [0, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]];
    // const nextData = Array.from({ length: 4 }).map(_ =>
    //   Array.from({ length: 4 }).fill(0)
    // );
    ```

  - 同游戏区域一样， 生成插入的 div

整体而言通过控制二维数组的数据， 从而控制方块在界面上的显示

## 例子(只是显示方块）

下面是一个简单的例子：生成一个同下一个区域一样的方块

- `html`

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>俄罗斯方块</title>
      <link rel="stylesheet" href="./index.css" />
    </head>
    <body>
      <main>
        <!-- 游戏区域 -->
        <div class="game" id="game"></div>
        <!-- 下一个区域 -->
        <div class="next" id="next"></div>
        <div class="info">
          <div>已用时：<span id="time">0</span></div>
          <div>已得分：<span id="score">0</span></div>
        </div>
      </main>
    </body>
    <script src="./index.js"></script>
  </html>
  ```

- css

  ```css
  html,
  body {
    width: 100%;
    height: 100%;
    position: relative;
  }
  main {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .game {
    width: 200px;
    height: 400px;
    border-width: 0 1px 1px 1px;
    border-style: solid;
    border-color: blue;
    background-color: #f2faff;
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .next {
    width: 80px;
    height: 80px;
    background-color: #f2faff;
    border: 1px solid blue;
    position: absolute;
    top: 10px;
    left: 250px;
  }
  .info {
    position: absolute;
    top: 100px;
    left: 250px;
  }
  .none,
  .current,
  .done {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    position: absolute;
  }
  .none {
    background-color: #f2faff;
  }
  .current {
    border: 1px solid red;
    background-color: pink;
  }
  .done {
    border: 1px solid black;
    background-color: gray;
  }
  ```

- js

  ```js
  // 定义下一个的数据
  const nextData = [[0, 2, 0, 0], [0, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]];
  // const nextData = Array.from({ length: 4 }).map(_ =>
  //   Array.from({ length: 4 }).fill(0)
  // );
  // 定义当前游戏的数据
  // 20行 10列
  const gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  // const gameData = Array.from({ length: 20 }).map(_ =>
  //   Array.from({ length: 10 }).fill(0)
  // );
  // gameData中对应数据的类名
  const gameDataClassName = {
    0: "none",
    1: "done",
    2: "current"
  };
  // 下一个div的数据
  const nextDivs = [];
  // 当前游戏的div数据
  const gameDivs = [];

  const gameDom = document.querySelector("#game");
  const nextDom = document.querySelector("#next");
  const timeDom = document.querySelector("#time");
  const scorDom = document.querySelector("#score");

  // 初始化游戏数据
  const initGame = () => {
    let gameLength = gameData.length;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < gameLength; i++) {
      const gameDiv = [];
      for (let j = 0; j < gameData[i].length; j++) {
        const dom = document.createElement("div");
        (dom.className = "none"), (dom.style.top = i * 20 + "px");
        dom.style.left = j * 20 + "px";
        fragment.appendChild(dom);
        gameDiv.push(dom);
      }
      gameDivs.push(gameDiv);
    }
    // 全部循环完成后再插入
    gameDom.appendChild(fragment);
  };

  // 初始化下一个游戏数据
  const initNext = () => {
    let nextLength = nextData.length;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < nextLength; i++) {
      const nextDiv = [];
      for (let j = 0; j < nextData[i].length; j++) {
        const dom = document.createElement("div");
        (dom.className = "none"), (dom.style.top = i * 20 + "px");
        dom.style.left = j * 20 + "px";
        fragment.appendChild(dom);
        nextDiv.push(dom);
      }
      nextDivs.push(nextDiv);
    }
    // 全部循环完成后再插入
    nextDom.appendChild(fragment);
  };

  // 根据gameData中的数据， 更改对应的gameDivs的类名
  const refreshGame = () => {
    let gameLength = gameData.length;
    for (let i = 0; i < gameLength; i++) {
      for (let j = 0; j < gameData[i].length; j++) {
        gameDivs[i][j].className = gameDataClassName[gameData[i][j]];
      }
    }
  };

  // 根据nextData中的数据， 更改对应的nextDivs的类名
  const refreshNext = () => {
    let nextLength = nextData.length;
    for (let i = 0; i < nextLength; i++) {
      for (let j = 0; j < nextData[i].length; j++) {
        nextDivs[i][j].className = gameDataClassName[nextData[i][j]];
      }
    }
  };

  initGame();
  initNext();
  refreshGame();
  refreshNext();
  ```

此时界面显示

![](~@image/demo1.png)

这只是实现了一个单独方块， 接下来我们来实现完整的功能

## 例子（实现单机的俄罗斯方块）

由于功能比较多代码比较多， 我们分出去

- html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>俄罗斯方块</title>
      <link rel="stylesheet" href="./css/index.css" />
    </head>
    <body>
      <main>
        <!-- 游戏区域 -->
        <div class="game" id="game"></div>
        <!-- 下一个区域 -->
        <div class="next" id="next"></div>
        <div class="info">
          <div>已用时：<span id="time">0</span>s</div>
          <div>已得分：<span id="score">0</span></div>
        </div>
        <div id="over" class="over">游戏结束了</div>
      </main>
    </body>
    <script src="js/square.js"></script>
    <script src="js/squareFactory.js"></script>
    <script src="js/game.js"></script>
    <script src="js/local.js"></script>
    <script src="js/remote.js"></script>
    <script src="js/index.js"></script>
  </html>
  // 这里注意引用js的先后顺序
  ```

- css

  ```css
  html,
  body {
    width: 100%;
    height: 100%;
    position: relative;
  }
  * {
    padding: 0;
    margin: 0;
  }
  main {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .game {
    width: 200px;
    height: 400px;
    border-width: 0 1px 1px 1px;
    border-style: solid;
    border-color: blue;
    background-color: #f2faff;
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .next {
    width: 80px;
    height: 80px;
    background-color: #f2faff;
    border: 1px solid blue;
    position: absolute;
    top: 10px;
    left: 250px;
  }
  .info {
    position: absolute;
    top: 100px;
    left: 250px;
  }
  .none,
  .current,
  .done {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    position: absolute;
  }
  .none {
    background-color: #f2faff;
  }
  .current {
    border: 1px solid red;
    background-color: pink;
  }
  .done {
    border: 1px solid black;
    background-color: gray;
  }

  .over {
    position: absolute;
    left: 75px;
    top: 250px;
    transition: all 0.5s;
    display: none;
    color: red;
  }
  ```

- js

  - index.js

    ```js
    这里可以配置相关的参数;
    const options = {
      rowScore: 10
    };

    const locale = new Local(); // 实例化
    locale.start(options);
    ```

  - squere.js

    ```JS
    const Square = function() {
      // 方块数据
      // this.data = [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]];
      this.data = Array.from({ length: 4 }).map(_ =>
        Array.from({ length: 4 }).fill(0)
      );
      // 原点
      this.origin = {
        x: 0,
        y: 0
      };
      this.dir = 0; // 旋转的角度
    };

    // 验证是否可以下移， 左移， 右移, 旋转
    Square.prototype.canDown = function(isValid) {
      const test = {
        x: this.origin.x + 1,
        y: this.origin.y
      };
      return isValid(test, this.data);
    };
    Square.prototype.canLeft = function(isValid) {
      const test = {
        x: this.origin.x,
        y: this.origin.y - 1
      };
      return isValid(test, this.data);
    };
    Square.prototype.canRight = function(isValid) {
      const test = {
        x: this.origin.x,
        y: this.origin.y + 1
      };
      return isValid(test, this.data);
    };
    Square.prototype.canRotate = function(isValid) {
      let d = (this.dir + 1) % 4;
      const test = Array.from({ length: 4 }).map(_ =>
        Array.from({ length: 4 }).fill(0)
      );
      for (let i = 0; i < this.data.length; i += 1) {
        for (let j = 0; j < this.data[i].length; j += 1) {
          test[i][j] = this.rotates[d][i][j];
        }
      }

      return isValid(this.origin, test);
    };

    // 下移
    Square.prototype.down = function() {
      this.origin.x += 1;
    };
    // 左移
    Square.prototype.left = function() {
      this.origin.y -= 1;
    };
    // 右移
    Square.prototype.right = function() {
      this.origin.y += 1;
    };
    // 旋转
    Square.prototype.rotate = function(num) {
      this.dir = num ? this.dir + num : this.dir + 1;
      this.dir = this.dir % 4;
      // this.dir = (this.dir + num) % 4;
      for (let i = 0; i < this.data.length; i += 1) {
        for (let j = 0; j < this.data[i].length; j += 1) {
          this.data[i][j] = this.rotates[this.dir][i][j];
        }
      }
    };

    ```

  - game.js

    ```js
    const Game = function() {
      // 定义下一个的数据
      // const nextData = Array.from({ length: 4 }).map(_ =>
      //   Array.from({ length: 4 }).fill(0)
      // );
      // 定义当前游戏的数据
      // 20行 10列
      const gameData = Array.from({ length: 20 }).map(_ =>
        Array.from({ length: 10 }).fill(0)
      );
      // gameData中对应数据的类名
      const gameDataClassName = {
        0: "none",
        1: "done",
        2: "current"
      };

      // 当前分数
      let score = 0;
      let scoreDom;
      // 时间dom
      let timeDom;

      let overDom;

      // 定义2个方块
      let cur; //当前方块
      let next; // 下一个方块

      // 下一个div的数据 存储相应的div
      const nextDivs = [];
      // 当前游戏的div数据
      const gameDivs = [];

      // 游戏的相关参数
      const params = {
        rowScore: 10 // number表示 总共消row行 ，分数 row* 10  // 数组表示对应消行的分数
      };
      /*
       *@Descripttion: '初始化游戏数据函数'
       *@param: 'data' { Array } 游戏数据
       *@param: 'contain' { Element } DOM
       *@param: 'divs'  { Array } 存储对应的div节点
       *@return:
       */
      const initDiv = (contain, data, divs) => {
        const { length } = data;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < length; i++) {
          const div = [];
          for (let j = 0; j < data[i].length; j++) {
            const dom = document.createElement("div");
            dom.className = "none";
            dom.style.top = i * 20 + "px";
            dom.style.left = j * 20 + "px";
            fragment.appendChild(dom);
            div.push(dom);
          }
          divs.push(div);
        }
        // 全部循环完成后再插入
        contain.appendChild(fragment);
      };

      /*
       *@Descripttion: '通过游戏数据更新对应的dom 刷新div'
       *@param: 'data' { Array } 游戏数据
       *@param: 'divs'  { Array } 存储对应的div节点
       *@return:
       */
      const refreshGame = (data, divs) => {
        let { length } = data;
        for (let i = 0; i < length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            divs[i][j].className = gameDataClassName[data[i][j]];
          }
        }
      };

      // 检测对应点的数据是否合理
      const isValid = function(pos, data) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j += 1) {
            if (data[i][j] !== 0 && !check(pos, i, j)) {
              return false;
            }
          }
        }
        return true;
      };
      // 检测点是否合法
      const check = (pos, x, y) => {
        if (pos.x + x >= gameData.length) return false; // 超出下边界
        if (pos.x + x < 0) return false; // 超出上边界
        if (pos.y + y < 0) return false; // 超出左边界
        if (pos.y + y >= gameData[0].length) return false; //超出右边界
        if (gameData[pos.x + x][pos.y + y] === 1) return false; // 已经有落下的
        return true;
      };

      // 清除数据
      const clearData = () => {
        for (let i = 0; i < cur.data.length; i += 1) {
          for (let j = 0; j < cur.data[i].length; j += 1) {
            if (check(cur.origin, i, j)) {
              gameData[cur.origin.x + i][cur.origin.y + j] = 0;
            }
          }
        }
      };

      // 初始数据 初始化游戏中正在落下的方块数据
      const setData = () => {
        for (let i = 0; i < cur.data.length; i += 1) {
          for (let j = 0; j < cur.data[i].length; j += 1) {
            if (check(cur.origin, i, j)) {
              gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
            }
          }
        }
      };

      // 下移
      const down = function() {
        if (cur.canDown(isValid)) {
          clearData(); // 先清楚原有的数据
          cur.down(); // 更新原点的位置
          setData(); //  更新保存游戏界面的数据
          refreshGame(gameData, gameDivs); // 更新保存的游戏界面中div样式
          return true;
        }
        return false;
      };

      // 左移
      const left = function() {
        if (cur.canLeft(isValid)) {
          clearData(); // 先清楚原有的数据
          cur.left(); // 更新原点的位置
          setData(); //  更新保存游戏界面的数据
          refreshGame(gameData, gameDivs); // 更新保存的游戏界面中div样式
        }
      };
      // 右移
      const right = function() {
        if (cur.canRight(isValid)) {
          clearData(); // 先清楚原有的数据
          cur.right(); // 更新原点的位置
          setData(); //  更新保存游戏界面的数据
          refreshGame(gameData, gameDivs); // 更新保存的游戏界面中div样式
        }
      };
      // 旋转
      const rotate = function() {
        if (cur.canRotate(isValid)) {
          clearData(); // 先清楚原有的数据
          cur.rotate(); // 更新原点的位置
          setData(); //  更新保存游戏界面的数据
          refreshGame(gameData, gameDivs); // 更新保存的游戏界面中div样式
        }
      };
      // 固定
      const fixed = function() {
        for (let i = 0; i < cur.data.length; i += 1) {
          for (let j = 0; j < cur.data[i].length; j += 1) {
            if (check(cur.origin, i, j)) {
              if (gameData[cur.origin.x + i][cur.origin.y + j] === 2) {
                gameData[cur.origin.x + i][cur.origin.y + j] = 1;
              }
            }
          }
        }
        refreshGame(gameData, gameDivs);
      };

      //  生成新的
      const performNext = function(type, dir) {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshGame(gameData, gameDivs);
        refreshGame(next.data, nextDivs);
      };

      // 消行
      checkClear = function() {
        try {
          let list = [];
          for (let i = gameData.length - 1; i >= 0; i -= 1) {
            let clear = true;
            for (let j = 0; j < gameData[i].length; j += 1) {
              if (gameData[i][j] !== 1) {
                clear = false;
                break;
              }
            }
            if (clear) {
              list.push(i);
            }
          }
          if (list.length) {
            list.forEach(item => {
              gameData.splice(item, 1);
            });
            const data = Array.from({ length: list.length }).map(_ =>
              Array.from({ length: 4 }).fill(0)
            );
            gameData.unshift(...data);

            showScore(rowAndScore(list.length));
          }
        } catch (err) {
          console.log(err);
        }
      };
      // 消除行数和分数的关系
      const rowAndScore = function(row) {
        const { rowScore } = params;
        let current;
        if (Array.isArray(rowScore)) {
          if (rowScore[row]) {
            current = row * rowScore[row];
          }
        }
        if (typeof rowScore === "number") {
          current = rowScore * row;
        }
        score += current;
        return score;
      };
      // 实时显示分数
      const showScore = function(score) {
        scoreDom.innerHTML = score;
      };
      // 更新时间
      const setTime = function(time) {
        timeDom.innerHTML = time;
      };

      const gameOverShow = () => {
        overDom.style.display = "block";
      };

      // 检查游戏结束
      const checkGameOver = function() {
        let gameOver = false;
        gameData[0].forEach((_, index) => {
          if (gameData[1][index] === 1) {
            // 判断第二行
            gameOver = true;
          }
        });
        return gameOver;
      };

      // 添加干扰行
      const addTailLines = function(lines) {
        // lines是一个二维数组
        gameData.push(...lines);
        gameData.splice(0, lines.length);
        cur.origin.x = cur.origin.x - lines.length;
        if (cur.origin.x < 0) {
          cur.origin.x = 0;
        }
        refreshGame(gameData, gameDivs);
      };

      // 初始化
      const init = function(doms, type, dir, options) {
        // debugger;
        const { gameDiv, nextDiv, timeDiv, scoreDiv, overDiv } = doms;
        // 初始化数据
        timeDom = timeDiv;
        scoreDom = scoreDiv;
        overDom = overDiv;
        Object.assign(params, options);
        // params = { ...params, ...options };
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        refreshGame(next.data, nextDivs);
      };
      // 导出API
      this.init = init;
      this.down = down;
      this.left = left;
      this.right = right;
      this.rotate = rotate;
      this.fall = function() {
        while (down()) {}
      };
      this.fixed = fixed;
      this.performNext = performNext;
      this.checkClear = checkClear;
      this.checkGameOver = checkGameOver;
      this.setTime = setTime;
      this.gameOverShow = gameOverShow;
      this.addTailLines = addTailLines;
    };
    ```

  - local.js

    ```js
    function Local() {
      // 游戏对象
      let game;
      // 间隔时间
      const TIME = 200;
      // 时间计数器
      let timeCount = 0;
      // 时间 游戏时间
      let time = 0;
      // 定时器
      let timer;
      // 绑定键盘事件
      const bindKeyEvent = function() {
        document.onkeydown = function(e) {
          if (e.keyCode === 38) {
            game.rotate();
            // up
          } else if (e.keyCode === 39) {
            // right
            game.right();
          } else if (e.keyCode === 40) {
            // down
            game.down();
          } else if (e.keyCode === 37) {
            // left
            game.left();
          } else if (e.keyCode === 32) {
            // space
            game.fall();
          } else {
            console.log(1);
          }
        };
      };
      // 随机的旋转数
      const generateDir = () => {
        return Math.floor(Math.random() * 4);
      };
      // 随机的图形数
      const generateType = () => {
        return Math.floor(Math.random() * 7);
      };
      const stop = function() {
        if (timer) {
          clearInterval(timer);
        }
        document.onkeydown = null;
      };

      // 随机生成干扰函数
      // 生成的line的行数
      const generateBottomLine = function(line) {
        const list = Array.from({ length: line }).map(_ =>
          Array.from({ length: 10 }, _ => Math.floor(Math.random() * 2))
        );
        return list;
      };

      // 计时函数
      const timeFun = function() {
        timeCount += 1;
        if (timeCount === 5) {
          timeCount = 0;
          time += 1;
          game.setTime(time);
          if (time % 10 === 0) {
            game.addTailLines(generateBottomLine(1));
          }
        }
      };

      // 自动下落
      const move = function() {
        timeFun();
        if (!game.down()) {
          game.fixed();
          game.checkClear();
          if (!game.checkGameOver()) {
            game.performNext(generateType(), generateDir());
          } else {
            stop();
            game.gameOverShow();
          }
        }
      };

      // 开始
      const start = function(options) {
        const doms = {
          gameDiv: document.querySelector("#game"),
          nextDiv: document.querySelector("#next"),
          timeDiv: document.querySelector("#time"),
          scoreDiv: document.querySelector("#score"),
          overDiv: document.querySelector("#over")
        };

        game = new Game();
        game.init(doms, generateType(), generateDir(), options || {});
        // 绑定键盘事件
        game.performNext(generateType(), generateDir());
        bindKeyEvent();
        timer = setInterval(move, TIME);
      };
      this.start = start;
    }
    ```

  - squareFactory.js (定义俄罗斯方块的 7 中形状数据和旋转数据）

    ```js
    const Square1 = function() {
      // 方块数据
      Square.call(this);
      this.rotates = [
        [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]],
        [[0, 0, 0, 0], [2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]],
        [[0, 0, 0, 0], [2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]]
      ];
    };
    const Square2 = function() {
      Square.call(this);
      this.rotates = [
        [[0, 2, 0, 0], [2, 2, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 0, 0, 0], [2, 2, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 2, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 2, 0, 0], [2, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0]]
      ];
    };
    const Square3 = function() {
      Square.call(this);
      this.rotates = [
        [[2, 2, 2, 0], [0, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 2, 0, 0], [0, 2, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0]],
        [[2, 0, 0, 0], [2, 2, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]]
      ];
    };
    const Square4 = function() {
      Square.call(this);
      this.rotates = [
        [[2, 2, 2, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 2, 0], [2, 2, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 0, 0, 0], [2, 0, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0]]
      ];
    };
    const Square5 = function() {
      Square.call(this);
      this.rotates = [
        [[2, 2, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
      ];
    };
    const Square6 = function() {
      Square.call(this);
      this.rotates = [
        [[0, 2, 2, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 0, 0, 0], [2, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0]],
        [[0, 2, 2, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 0, 0, 0], [2, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0]]
      ];
    };
    const Square7 = function() {
      Square.call(this);
      this.rotates = [
        [[2, 2, 0, 0], [0, 2, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 2, 0, 0], [2, 2, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 2, 0, 0], [0, 2, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 2, 0, 0], [2, 2, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]]
      ];
    };
    Square1.prototype = Square2.prototype = Square3.prototype = Square4.prototype = Square5.prototype = Square6.prototype = Square7.prototype =
      Square.prototype;

    const SquareFactory = function() {};
    SquareFactory.prototype.make = function(index, dir) {
      let s;
      index += 1;
      switch (index) {
        case 1:
          s = new Square1();
          break;
        case 2:
          s = new Square2();
          break;
        case 3:
          s = new Square3();
          break;
        case 4:
          s = new Square4();
          break;
        case 5:
          s = new Square5();
          break;
        case 6:
          s = new Square6();
          break;
        case 7:
          s = new Square7();
          break;
        default:
          break;
      }
      s.origin.x = 0;
      s.origin.y = 0;
      s.rotate(dir);
      return s;
    };
    ```

源码地址：<https://github.com/sky-bear/Grow-Up/tree/master/%E4%BF%84%E7%BD%97%E6%96%AF%E6%96%B9%E5%9D%97%E7%9A%84%E5%AE%9E%E7%8E%B0/%E7%AC%AC%E4%BA%8C%E9%98%B6%E6%AE%B5/demo2>

