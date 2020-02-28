下面是我在`gitChat`上面买的课程的学习笔记，记录一下自己的学习过程， 整理一下自己的基础知识。



## this

**this的指向**： 是在函数调用时根据执行上下文动态决定的

调用函数会创建新的属于函数自身的执行上下文。执行上下文的调用创建阶段会决定 `this`的指向

常见的几条规律如下：

- 在函数体中，简单调用该函数时（非显式/隐式绑定下），严格模式下 `this` 绑定到 `undefined`，否则绑定到全局对象 `window`／`global`；
- 一般构造函数 `new` 调用，绑定到新创建的对象上；
- 一般由 `call`/`apply`/`bind` 方法显式调用，绑定到指定参数的对象上；
- 一般由上下文对象调用，绑定在该对象上；
- 箭头函数中，根据外层上下文绑定的 `this` 决定 `this` 指向。



### 实战

- **全局环境下的this**

  - ```js
    function f1 () {
        console.log(this)
    }
    function f2 () {
        'use strict'
        console.log(this)
    }
    f1() // window
    f2() // undefined
    ```

  - ```js
    const foo = {
        bar: 10,
        fn: function() {
           console.log(this)
           console.log(this.bar)
        }
    }
    var fn1 = foo.fn
    fn1() // 虽然fn是在foo对象中当作方法被引用，但是赋值给fn1后， fn1的执行环境是window
    // window
    // undefined
    
    如果稍作改动, 直接执行foo.fn() 这时候，fn函数中的this就是foo
    foo.fn() 
    ```

    在执行函数时，如果函数中的 `this` 是被上一级的对象所调用，那么 `this` 指向的就是上一级的对象；否则指向全局环境。

- **上下文对象调用的this**

  - 有了上面的基础

    ```js
    const student = {
        name: 'Lucas',
        fn: function() {
            return this
        }
    }
    console.log(student.fn() === student) // true
    ```

  - 当存在更复杂的关系时

    ```js
    const person = {
        name: 'Lucas',
        brother: {
            name: 'Mike',
            fn: function() {
                return this.name
            }
        }
    }
    console.log(person.brother.fn()) // Mike
    ```

    在这种嵌套的关系中，`this` 指向**最后**调用它的对象

  - 更复杂的来了

    ```js
    const o1 = {
        text: 'o1',
        fn: function() {
            return this.text
        }
    }
    const o2 = {
        text: 'o2',
        fn: function() {
            return o1.fn()
        }
    }
    const o3 = {
        text: 'o3',
        fn: function() {
            var fn = o1.fn
            return fn()  // 直接调用指向windwow
        }
    }
    
    console.log(o1.fn()) // o1
    console.log(o2.fn()) // o1
    console.log(o3.fn()) // undefinec
    ```

    假设让`console.log(o2.fn()) 输出 o2`怎么处理？， 如何修改?

    ```js
    方法1：
    const o1 = {
        text: 'o1',
         fn: function() {
            return this.text
        }
    }
    const o2 = {
        text: 'o2',
        fn: function() {
            returno1.fn.call(this) //通过call改变this指向
        }
    }
    console.log(o2.fn())
    方法2：
    const o1 = {
        text: 'o1',
         fn: function() {
            return this.text
        }
    }
    const o2 = {
        text: 'o2',
        fn:o1.fn // 提前进行赋值， 指向最后调用它的对象
    }
    console.log(o2.fn())
    ```

    ###### `call,apply,bind`的区别

    都能改变this的指向， 但是 `call/apply` 是直接进行相关函数调用；`bind` 不会执行相关函数，而是返回一个新的函数，这个新的函数已经自动绑定了新的 `this` 指向，开发者需要手动调用即可

    ```js
    const target = {}
    fn.call(target, 'arg1', 'arg2')
    fn.apply(target, ['arg1', 'arg2'])
    fn.bind(target, 'arg1', 'arg2')()
    ```

- **构造函数中的this**

  - new操作符调用构造函数，具体做了什么？

    - 创建一个新的对象；

    - 将构造函数的 `this` 指向这个新对象；

    - 为这个对象添加属性、方法等；

    - 最终返回新对象

      ```js
      function Foo(){
          this.user = "Lucas"
          const o = {}
          return o
      }
      const instance = new Foo()
      console.log(instance.user) // undefined
      
      function Foo(){
          this.user = "Lucas"
          return 1
      }
      const instance = new Foo()
      console.log(instance.user) // Lucas
      ```

      **结论：**如果构造函数中显式返回一个值，且返回的是一个对象，那么 `this` 就指向这个返回的对象；如果返回的不是一个对象，那么 `this` 仍然指向实例。

- **箭头函数中的this**

  **结论：**箭头函数使用 `this` 不适用以上标准规则，而是根据外层（函数或者全局）上下文来决定

  - ```js
    const foo = {  
        fn: function () {  
            setTimeout(function() {  
                console.log(this)  // 这里的匿名函数的this指向window
            })
        }  
    }  
    console.log(foo.fn()) // window
    ```

  - ```js
    const foo = {  
        fn: function () {  
            setTimeout(() => {  
                console.log(this)
            })
        }  
    } 
    console.log(foo.fn())  // foo
    
    
    ```

- **this优先级**

  我们常常把通过 `call`、`apply`、`bind`、`new` 对 `this` 绑定的情况称为显式绑定；根据调用关系确定的 `this` 指向称为隐式绑定

  首先显示绑定肯定的优先级肯定高于隐式绑定，这个就不考虑了， 我们考虑new的优先级

  ```js
  function foo (a) {
      this.a = a
  }
  
  const obj1 = {}
  
  var bar = foo.bind(obj1)
  bar(2)
  console.log(obj1.a)  // 2
  
  var baz = new bar(3)
  console.log(baz.a) // 3
  ```

  - **new 绑定修改了 bind 绑定中的 this，因此 new 绑定的优先级比显式 bind 绑定更高**

  - 箭头函数的this无法被修改
  - `let  const` 定义的变量， 不会挂载到window全局对象中



### 实现一个bind函数

```js
// 利用apply
Function.prototype.bind =  Function.prototype.bind ||  function(content) {
    const that = this;
    const args = [].slice.call(arguments, 1); // 利用闭包预设参数
    return function bound() {
        const finallyArgs = [...args, ...arguments];
        return that.apply(content, finallyArgs);
    };
};
// 不利用apply
Function.prototype.bind =  Function.prototype.bind ||  function(content) {
    const args = [].slice.call(arguments, 1);
    content.fn = this;
    return function bound() {
        const finallyArgs = [...args, ...arguments];
        const result = content.fn(...finallyArgs);
        delete content.fn;
        return result;
    };
};
```





## 闭包

### 基本知识

#### 作用域

- 作用域其实就是一套规则：这个规则**用于确定在特定场景下如何查找变量**。ES6 出现之前只有函数作用域和全局作用域之分。
- 作用域链：JavaScript 执行一段函数时，遇见变量读取其值，这时候会“就近”先在函数内部找该变量的声明或者赋值情况，如果在函数内无法找到该变量，就要跳出函数作用域，到更上层作用域中查找。
- ES6 增加了 `let` 和 `const` 声明变量的块级作用域，**在这个块级作用域当中，如果在声明变量前访问该变量，就会报 referenceError 错误**；如果在声明变量后访问，则可以正常获取变量值：
  - 死区： 在相应花括号形成的作用域中，存在一个“死区”，起始于函数开头，终止于相关变量声明的一行。在这个范围内无法访问 `let` 或 `const` 声明的变量。这个“死区”的专业名称为： TDZ（Temporal Dead Zone）

#### 执行上下文

- 执行上下文就是当前代码的执行环境/作用域
- 代码执行分为两个阶段： 
  - 代码预编译阶段 
    - 预编译阶段进行变量声明；
    - 预编译阶段变量声明进行提升，但是值为 undefined；
    - 预编译阶段所有非表达式的函数声明进行提升
  - 代码执行阶段

- 作用域在预编译阶段确定，但是作用域链是在执行上下文的创建阶段完全生成的。因为函数在调用时，才会开始创建对应的执行上下文。执行上下文包括了：变量对象、作用域链以及 `this` 的指向

- 调用栈:先进后出

  ```js
  function foo1() {
    foo2()
  }
  function foo2() {
    foo3()
  }
  function foo3() {
    foo4()
  }
  function foo4() {
    console.log('foo4')
  }
  foo1()
  ```

  

- 正常来讲，在函数执行完毕并出栈时，函数内局部变量在下一个垃圾回收节点会被回收，该函数对应的执行上下文将会被销毁，这也正是我们在外界无法访问函数内定义的变量的原因。也就是说，只有在函数执行时，相关函数可以访问该变量，该变量在预编译阶段进行创建，在执行阶段进行激活，在函数执行完毕后，相关上下文被销毁。

#### 闭包

- 函数嵌套函数时，内层函数引用了外层函数作用域下的变量，并且内层函数在全局环境下可访问，就形成了闭包。

#### 内存管理基本概念

- 栈空间： ：由操作系统自动分配释放，存放函数的参数值，局部变量的值等，其操作方式类似于数据结构中的栈。

- 堆空间：一般由开发者分配释放，这部分空间就要考虑垃圾回收的问题。

- 基本数据类型保存在栈内存当中，引用类型保存在堆内存当中（栈中存放引用类型指向堆内存的指针）

- **内存泄漏**是指内存空间明明已经不再被使用，但由于某种原因并没有被释放的现象

  ```js
  var element = document.getElementById("element")
  element.mark = "marked"
  
  // 移除 element 节点
  function remove() {
      element.parentNode.removeChild(element)
  }
  ```

  节点已经移除但是变量`element`依然可以访问到节点

#### 实战

- ```js
  const foo = (function() {
      var v = 0
      return () => {
          return v++
      }
  }())
  
  console.log(foo) // 10
  ```

- ```js
  const foo = () => {
      var arr = []
      var i
  
      for (i = 0; i < 10; i++) {
          arr[i] = function () {
              console.log(i)
          }
      }
  
      return arr[0]
  }
  
  foo()() // 10 
  当调用函数时，i = 10
  ```

- ```js
  var fn = null
  const foo = () => {
      var a = 2
      function innerFoo() { 
          console.log(a)
      }
      fn = innerFoo    
  }
  
  const bar = () => {
      fn()
  }
  
  foo() // undefined
  bar() // 2 undefined
  ```

- ```js
  var fn = null
  const foo = () => {
      var a = 2
      function innerFoo() { 
          console.log(c)            
          console.log(a)
      }
      fn = innerFoo
  }
  
  const bar = () => {
      var c = 100
      fn()    
  }
  
  foo()
  bar()  ReferenceError: c is not defined。
  
  
  function add() {
     var c = 1
     fn()
   }
   function fn() {
      console.log(c)
   }
  add() ReferenceError: c is not defined。
  ```

  预编译阶段已经确定作用域

- ```js
  function Person() {
      this.name = 'lucas'
  }
  
  const getSingleInstance = (function(){
       var singleInstance
      return function() {
           if (singleInstance) {
              return singleInstance
           } 
          return singleInstance = new Person()
      }
  })()
  
  const instance1 = new getSingleInstance()
  const instance2 = new getSingleInstance()
  ```

  

### API的实现

#### reduce

- 实现按顺序运行Promise

  ```js
  const runPromiseInSequence = (array, value) => array.reduce(
      (promiseChain, currentFunction) => promiseChain.then(currentFunction),
      Promise.resolve(value)
  )
  ```

- 实现一个reduce

  ```js
  // 实现一个reduce
      Array.prototype.reduce =
        Array.prototype.reduce ||
        function(fn, initValue) {
          const arr = this;
          let base = typeof initValue === "undefinde" ? arr[0] : initValue;
          const startPoint = typeof initValue === "undefinde" ? 1 : 0;
          arr.slice(startPoint).forEach((val, index) => {
            base = fn(base, arr[index], index + startPoint, arr);
          });
          return base;
        };
  ```

- reduce实现pipe.`pipe(f, g, h)` 是一个 curry 化函数，它返回一个新的函数，这个新的函数将会完成 `(...args) => h(g(f(...args)))` 的调用。即 `pipe` 方法返回的函数会接收一个参数，这个参数传递给 `pipe` 方法第一个参数，以供其调用

  ```js
  const pipe = (...functions) => input => functions.reduce(
      (acc, fn) => fn(acc),
      input
  )
  
  
   const pipe = function(...args) {
        return function(input) {
          return args.reduce((acc, fn) => fn(acc), input);
        };
      };
  ```

- 实现bind函数

  ```js
  Function.prototype.bind = Function.prototype.bind || function (context) {
        const me  = this
        const params = arguments[1] // 预设参数
        return function (arg) {
          return me.apply(context, [params, ...arguments])
        }
      }
  ```

  

## 数据类型及其判断

### 数据类型

- null
- undefined
- boolean
- number
- string
- object
- symbol
- bigint (只有少数浏览器支持谷歌， 火狐)

前面五种为基本类型。第六种 object 类型又具体包含了 function、array、date 等。

[基本数据类型有7种： 除过前五种，还包括symbol, bigint]

判断数据类型常用的方法：

- `typeof`

  　使用 typeof 可以准确判断出**除 null** 以外的基本类型，以及 function 类型、symbol 类型；null 会被 typeof          

  ​    判断为 object。

- `instanceof`

  判断左侧的对象是否是右侧对象的实例

- `Object.prototype.toString`

  ```js
  console.log(Object.prototype.toString.call(1)) 
  // [object Number]
  
  console.log(Object.prototype.toString.call('lucas')) 
  // [object String]
  
  console.log(Object.prototype.toString.call(undefined)) 
  // [object Undefined]
  
  console.log(Object.prototype.toString.call(true)) 
  // [object Boolean]
  
  console.log(Object.prototype.toString.call({})) 
  // [object Object]
  
  console.log(Object.prototype.toString.call([])) 
  // [object Array]
  
  console.log(Object.prototype.toString.call(function(){})) 
  // [object Function]
  
  console.log(Object.prototype.toString.call(null)) 
  // [object Null]
  
  console.log(Object.prototype.toString.call(Symbol('lucas'))) 
  // [object Symbol]
  ```

  

- `constructor`

### 类型转换

- 当使用 + 运算符计算 string 和其他类型相加时，都会转换为 string 类型；其他情况，都会转换为 number 类型，但是 undefined 会转换为 NaN，相加结果也是 NaN

- 对象在转换基本类型时，会调用该对象上 valueOf 或 toString 这两个方法，该方法的返回值是转换为基本类型的结果

  ```js
  const foo = {
    toString () {
      return 'lucas'
    },
    valueOf () {
      return 1
    }
  }
  console.log(1 + foo) // 2
  ```

- 总结
  - 加号两边有至少一个是字符串，其规则为
    - 如果 + 号两边存在 NaN，则结果为 NaN（typeof NaN 是 'number'）
    - 如果是 Infinity + Infinity，结果是 Infinity
    - 如果是 -Infinity + (-Infinity)，结果是 -Infinity
    - 如果是 Infinity + (-Infinity)，结果是 NaN
  - 加号两边有至少一个是字符串，其规则为：
    - 如果 + 号两边都是字符串，则执行字符串拼接
    - 如果 + 号两边只有一个值是字符串，则将另外的值转换为字符串，再执行字符串拼接
    - 如果 + 号两边有一个是对象，则调用 valueof() 或者 toStrinig() 方法取得值，转换为基本类型再进行字符串拼接。

### 函数参数传递

- 参数为基本类型时，函数体内复制了一份参数值，对于任何操作不会影响参数实际值
- 函数参数是一个引用类型时，当在函数体内修改这个值的某个属性值时，将会对参数进行修改
- 函数参数是一个引用类型时，如果我们直接修改了这个值的引用地址，则相当于函数体内新创建了一份引用，对于任何操作不会影响原参数实际值

## 异步体验

- 移动页面上元素 target（document.querySelectorAll('#man')[0]）

  先从原点出发，向左移动 20px，之后再向上移动 50px，最后再次向左移动 30px，请把运动动画实现出来。

  ```js
  const Wark = function(ele) {
        this.ele = ele;
        this.list = [];
      };
      Wark.prototype.init = function() {
        this.ele.style.cssText = `  position: absolute;
                                    left: 0px;
                                    top: 0px
                                  `;
        return this;
      };
      Wark.prototype.add = function(direction, distance, fn) {
        const noop = () => {
          console.log(1);
        };
        this.list.push({
          direction, // 方向
          distance, // 距离
          callback: fn || noop 
        });
        return this;
      };
      Wark.prototype.change = function({ direction, distance, callback }) {
        return new Promise(resolve => {
          setTimeout(() => {
            this.ele.style[direction] = `${distance}px`;
            callback();
            resolve(); // 这里可把resolve当参数传给callback， 如果callback中有异步需要执行的话
          }, 1000);
        });
      };
      Wark.prototype.move = async function() {
        if (!this.list.length) return this;
        const currentMOve = this.list.shift();
        const that = this;
        await that.change(currentMOve);
        if (this.list.length) {
          this.move();
        }
      };
      const work = new Wark(document.querySelector("div"));
      work
        .init()
        .add("left", 20, () => {
          console.log(2);
        })
        .add("top", 50, () => console.log(3))
        .move();
  ```

  ```js
  // promise
      const walk = (direction, distance) =>
        new Promise((resolve, reject) => {
          const innerWalk = () => {
            setTimeout(() => {
              let currentLeft = parseInt(target.style.left, 10);
              let currentTop = parseInt(target.style.top, 10);
  
              const shouldFinish =
                (direction === "left" && currentLeft === -distance) ||
                (direction === "top" && currentTop === -distance);
  
              if (shouldFinish) {
                // 任务执行结束
                resolve();
              } else {
                if (direction === "left") {
                  currentLeft--;
                  target.style.left = `${currentLeft}px`;
                } else if (direction === "top") {
                  currentTop--;
                  target.style.top = `${currentTop}px`;
                }
  
                innerWalk();
              }
            }, 20);
          };
          innerWalk();
        });
  
  // 
  
  
  walk("left", 20)
      .then(() => walk("top", 50))
      .then(() => walk("left", 30));
  
  const task = async function () {
      await walk('left', 20)
          await walk('top', 50)
          await walk('left', 30)
  } 
  ```

  

- 依次加载图片

  ```js
  // 加载单张图片
  const loadImg = urlId => {
      const url = `https://www.image.com/${urlId}`
  
      return new Promise((resolve, reject) => {
          const img = new Image()
          img.onerror = function() { 
              reject(urlId)
          }
  
          img.onload = function() { 
              resolve(urlId)
          }
          img.src = url
      })
  }
  
  一次请求加载多张图片
  const urlIds = [1, 2, 3, 4, 5]
  urlIds.reduce((prevPromise,urlId) => {
      return prevPromise.then(() =>loadImg(urlIds) )
  }, Promise.resolve())
  
  
  
  const loadImgOneByOne = async () => {
      for (i of urlIds) {
          await loadImg(urlIds[i])
      }
  }
  loadImgOneByOne()
  
  ```

- 一次性请求

  ```JS
  const urlIds = [1, 2, 3, 4, 5]
  
  const promiseArray = urlIds.map(urlId => loadImg(urlId))
  
  Promise.all(promiseArray)
      .then(() => {
          console.log('finish load all')
      })
      .catch(() => {
          console.log('promise all catch')
      })
  ```

## 异步行为

- eventloop
- 宏任务
- 微任务

### `setTimeout`

- ```js
  setTimeout(() => {
      console.log('setTimeout block')
  }, 100)
  
  while (true) {
  
  }
  
  console.log('end here')
  
  不会有任何输出， 由于主线程一直被占用
  ```

- 任务分类

  - 同步任务是指：当前主线程将要消化执行的任务，这些任务一起形成执行栈
  - 异步任务是指：不进入主线程，而是进入任务队列（task queue），即不会马上进行的任务。

  **当同步任务全都被消化，主线程空闲时，即上面提到的执行栈 execution context stack 为空时，将会执行任务队列中的任务，即异步任务。**

  **虽然 JavaScript 是单线程的，但是对于一些耗时的任务，我们可以将其丢入任务队列当中，这样一来，也就不会阻碍其他同步代码的执行。等到异步任务完成之后，再去进行相关逻辑的操作。**

- ```js
  setTimeout(() => {
      console.log('here 1')
  }, 1)
  
  setTimeout(() => {
      console.log('here 2')
  }, 0)
  
  // here 1 先输出
  ```

  `MDN` 上给出的最小延时概念是 4 毫秒



### **宏任务VS微任务**

- ```js
  console.log('start here')
  
  new Promise((resolve, reject) => {
    console.log('first promise constructor')
    resolve()
  })
    .then(() => {
      console.log('first promise then')
      return new Promise((resolve, reject) => {
        console.log('second promise')
        resolve()
      })
        .then(() => {
          console.log('second promise then')
        })
    })
    .then(() => {
      console.log('another first promise then')
    })
  
  console.log('end here')
  
  
  // 输出顺序
  // start here
  // first promise constructor
  // end here
  // first promise then
  // second promise
  // second promise then
  // another first promise then
  ```

- 宏任务

  - setTimeout
  - setInterval
  - I/O
  - 事件
  - `postMessage`
  - setImmediate (Node.js，浏览器端该 API 已经废弃)
  - requestAnimationFrame
  - UI 渲染

- 微任务
  - Promise.then
  - MutationObserver
  - `process.nextTick (Node.js)`

- ```js
  console.log('start here')
  
  const foo = () => (new Promise((resolve, reject) => {
      console.log('first promise constructor')
  
      let promise1 = new Promise((resolve, reject) => {
          console.log('second promise constructor')
  
          setTimeout(() => {
              console.log('setTimeout here')
              resolve()
          }, 0)
  
          resolve('promise1')
      })
  
      resolve('promise0')
  
      promise1.then(arg => {
          console.log(arg)
      })
  }))
  
  foo().then(arg => {
      console.log(arg)
  })
  
  console.log('end here')
  
  //  start here
  //  first promise constructor
  //  second promise constructor
  //  end here
  //  promise1
  //  promise0
  //  setTimeout here
  
  ```

- ```js
  async function async1() {
      console.log('async1 start')
      await async2()
      console.log('async1 end')
  }
  
  async function async2() {
      console.log('async2')
  }
  
  console.log('script start')
  
  setTimeout(function() {
      console.log('setTimeout') 
  }, 0)  
  
  async1()
  
  new Promise(function(resolve) {
      console.log('promise1')
      resolve()
  }).then(function() {
      console.log('promise2')
  })
  
  console.log('script end')
  
  
  // script start
  // async1 start
  // async2
  // promise1
  // script end
  // async1 end
  // promise2
  // setTimeout
  ```

## Promise

- 微信接口的promise封装

  ```js
  const Wechat = (name,opts) => {
      return new Promise((success,fail) => {
          const options = {...opts,success,fail }
          wx[name](options)
      }) 
  }
  ```

  

## 面向对象和原型

### new

- 创建一个空对象， 这个对象会作为执行new构造函数（）之后， 返回的对象实例
- 将上面创建的空对象的原型（`__proto__`）,指向构造函数的prototype属性
- 将这个空对象赋值给构造函数内部的this,并执行构造函数逻辑
- 根据构造函数执行逻辑，返回第一步创建的对象或者构造函数的显示返回值

```js
// 实现一个简单的new
function Person(name) {
  this.name = name
}
function newFun(...args) {
  const constructor   = args.shift()
  const obj =  Object.create(constructor.prototype)
  const result = constructor.apply(obj, args)
  return typeof result === 'object' && result !== null ? result : obj
}
const person = new newFunc(Person, 'lucas')

console.log(person)
```

### 继承

- 原型链继承（类式继承）

  ```js
  Child.prototype = new Parent()
  ```

- 构造函数继承（只继承了属性，没有继承方法）

  ```js
  function Child (args) {
      // ...
      Parent.call(this, args)
  }
  ```

- 组合继承

  ```js
  function Child (args1, args2) {
      // ...
      this.args2 = args2
      Parent.call(this, args1)
  }
  Child.prototype = new Parent()
  Child.prototype.constrcutor = Child
  ```

  它的问题在于 Child 实例会存在 Parent 的实例属性。因为我们在 Child 构造函数中执行了 Parent 构造函数。同时，`Child.__proto__` 也会存在同样的 Parent 的实例属性，且所有 Child 实例的 `__proto__` 指向同一内存地址。

- 原型对象的获取和设置

  ```js
  let b = {}
  Object.getPrototypeOf(b)
  // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
  Object.setPrototypeOf(b, null)
  // null 
  Object.create(null) 
  ```

  

## 与时俱进的ES next

- **Array.prototype.includes**  ( **SameValueZero()**)

  ```js
  [NaN].includes(NaN) // true
  [NaN].indexOf(NaN) // -1
  
  NaN === NaN
  Object.is(NaN, NaN) // true
  Object.is(+0, -0) // false
  ```

- **Object Spread VS Object.assign**

  ```js
  const Benchmark = require('benchmark');
  
  const suite = new Benchmark.Suite;
  
  const obj = { foo: 1, bar: 2 };
  
  suite.
    add('Object spread', function() {
      ({ baz: 3, ...obj });
    }).
    add('Object.assign()', function() {
      Object.assign({}, obj, { baz: 3 });
    })
  
  
  
  
  Object spread x 3,065,831 ops/sec +-2.12% (85 runs sampled)
  Object.assign() x 2,461,926 ops/sec +-1.52% (88 runs sampled)
  Fastest is Object spread
  ```

​       Object Spread 的性能高于Objec.assign

- #### **箭头函数不适合用的地方**
  - 构造函数的原型方法（）[构造函数的原型方法需要通过 this 获得实例]

    ```js
    Person.prototype = () => {
      // ...
    }
    ```

  - 需要获得 arguments 时

  - 对象使用方法时

    ```js
    const person = {
      name: 'lucas',
      getName: () => {
        console.log(this.name) // 指向window
      }
    };
    person.getName()
    ```

  - 使用动态回调时

    ```js
    const btn = document.getElementById('btn')
    
    btn.addEventListener('click', () => {
        console.log(this === window) // true
    });
    ```

    

## 面子工程

- 如何理解语义化

  - 根据结构化的内容，选择合适的标签。

  - 目的： 
    - 利于SEO
    - 开发维护体验更好
    - 用户体验更好
    - 更好的accessibility，方便任何设备解析（如盲人阅读器）

  - ```js
    if (导航) {
      return <nav />
    }
    else if (文稿内容、博客内容、评论内容...包含标题元素的内容) {
      return <article />
    }
    else if (目录抽象、边栏、广告、批注) {
      return <aside />
    }
    else if (含有附录、图片、代码、图形) {
      return <figure />
    }
    else if (含有多个标题或内容的区块) {
     return <section />
    }
    else if (含有段落、语法意义) {
      return <p /> || <address /> || <blockquote /> || <pre /> || ...
    }
    else {
      return <div />
    }
    ```

  - `Microformats`

    ```
    Microformats，翻译为微格式，是 HTML 标记某些实体的小模式，这些实体包括人、组织、事件、地点、博客、产品、评论、简历、食谱等。它们是在 HTML 中嵌套语义的简单协议，且能迅速地提供一套可被搜索引擎、聚合器等其他工具使用的 API。
    ```

    

- BFC

  - 块级格式化上下文

    ```
    它会创建一个特殊的区域，在这个区域中，只有 block box 参与布局。而 BFC 的一套特点和规则就规定了在这个特殊的区域中如何进行布局，如何进行定位，区域内元素的相互关系和相互作用。这个特殊的区域不受外界影响。
    ```

    - block box: display 属性为 block、list-item、table ， flex的元素

    -  inline box: display 属性为 inline、inline-block、inline-table 的元素

  - 创建BFC的条件

    - 根元素或其他包含它的元素
    - 浮动元素 (元素的 float 不是 none)
    - 绝对定位元素 (元素具有 position 为 absolute 或 fixed)
    - 内联块 (元素具有 display: inline-block)
    - 表格单元格 (元素具有 display: table-cell，HTML 表格单元格默认属性)
    - 表格标题 (元素具有 display: table-caption, HTML 表格标题默认属性)
    - 具有 overflow 且值不是 visible 的块元素
    - display: flow-root 的元素
    - column-span: all 的元素

  - BFC规则

    - 内部的 box 将会独占宽度，且在垂直方向，一个接一个排列
    - box 垂直方向的间距由 margin 属性决定，但是同一个 BFC 的两个相邻 box 的 margin 会出现边距折叠现象
    - 每个 box 水平方向上左边缘，与 BFC 左边缘相对齐，即使存在浮动也是如此
    - BFC 区域不会与浮动元素重叠，而是会依次排列
    - BFC 区域内是一个独立的渲染容器，容器内元素和 BFC 区域外元素不会形成任何干扰
    - 浮动元素的高度也参与到 BFC 高度的计算当中

  - 常见问题

    - 边距折叠
    - 多栏自适应
    - 高度塌陷

  - 多种方式实现居中

    - ```css
       position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
      // 父元素 设置positon不为static
      
      
      // 父级元素
      display: table-cell;
          text-align: center;
          vertical-align: middle;
      
      // 父级元素
       display: flex;
          justify-content: center;
          align-items: center;
      ```

      

##   进击的CSS和HTML       

- HTML5 给开发者提供了哪些便利呢？ （举例）

  - 用于绘画的 canvas 元素

  - 用于媒介播放的 video 和 audio 元素

  - 对本地离线存储更好的支持（localStorage、sessionStorage）

  - 新的语义化标签（article、footer、header、nav、section...)

  - 新的表单控件（calendar、date、time、email、url、search...)

  - 给汉字加拼音

    ```
    <ruby> 
        前端开发核心知识进阶
        <rt>
            qianduankaifahexinzhishijinjie
        </rt> 
    </ruby>
    ```

  - 展开收起组件

    ```
    <details>
      <summary>前端开发核心知识进阶</summary>
    前端领域，入门相对简单，可是想要“更上一层楼”却难上加难，也就是我们常说的“职业天花板较低”，君不见——市场上高级/资深前端工程师凤毛麟角。这当然未必完全是坏事，一旦突破瓶颈，在技能上脱颖而出，便是更广阔的空间。那么，如何从夯实基础到突破瓶颈？
    </details>
    ```

  - 点击元素禁止产生背景或边框

    ```css
    -webkit-tap-highlight-color: rgba(0,0,0,0); 
    ```

  - 禁止长按链接与图片弹出菜单

    ```css
    -webkit-touch-callout: none;
    ```

  - 禁止用户选中文字

    ```css
    -webkit-user-select:none; 
    user-select: none;
    ```

  - 取消 input 输入时，英文首字母的默认大写

    ```
    <input autocapitalize="off" autocorrect="off" />
    ```

  - 怎么让 Chrome 支持小于 12px 的文字

    ```
    -webkit-text-size-adjust:none;
    ```

- CSS

  - CSS变量

    ```css
    :root {
      --bg: white;
      --text-color: #555;
      --link-color: #639A67;
      --link-hover: #205D67;
    }
    
    
    body {
      background: var(--bg);
      color: var(--text-color);
    }
    
    a, a:link {
      color: var(--link-color);
    }
    a:hover {
      color: var(--link-hover);
    }
    
    ```

  - 一键切换主题

    ```
    :root {
      --bg: white;
      --text-color: #555;
      --link-color: #639A67;
      --link-hover: #205D67;
    }
    
    .pink-theme {
      --bg: hotpink;
      --text-color: white;
      --link-color: #B793E6;
      --link-hover: #3532A7;
    }
    
    const toggleBtn = document.querySelector('.toggle-theme')
    
    toggleBtn.addEventListener('click', e => {
      e.preventDefault()
    
      if (document.body.classList.contains('pink-theme')) {
         // 当前主题为粉色主题，需要移除 pink-theme class
        document.body.classList.remove('pink-theme')
    
        toggle.innerText = '切换正常主题色'
      } else {
        document.body.classList.add('pink-theme')
        toggle.innerText = '切换为粉色少女主题'
      }
    })
    
    
    ```

    

##  响应式布局

### 响应式布局

- 方案

  - 传统 float 浮动布局
  - 相对单位布局
  - 媒体查询
  - 基于相对单位 rem 的 flexible 布局
  - flex 布局
  - grid 布局
  - 借助 JavaScript

- CSS 中的相对单位有

  - em

    ```
    em 相对于当前元素或当前元素继承来的字体的宽度，但是每个字母或汉字的宽度有可能是不一样的，那么一般来说，就是一个大写字母 M 的宽度（事实上，规范中有一个 x-height 概念，建议取 X 的高度，但并没有推荐绝对的计算执行标准，还需要看浏览器的实现，也有的地方采用 O 的高度）；一个非常容易出错的点在于：很多同学会认为 em 相对于父元素的字体大小，但是实际上取决于应用在什么 CSS 属性上。对于 font-size 来说，em 相对于父元素的字体大小；line-height 中，em 却相对于自身字体的大小。
    ```

  - rem

    ```
    rem 相对于根节点（html）的字体大小，根节点一个大写字母 M 的宽度（同上）。
    ```

  - vh、vw、vmin、vmax

    - vw 相对于视口宽度，100vw 就相当于一个视口宽度
    - vh 同理，1vh 表示视口高度的 1/100，100vh 就是一个视口高度
    - vmin 相对于视口的宽度或高度中较小的那个，也就是 1vw 和 1vh 取最小（Math.min(1vw, 1vh)）；vmax 相对于视口的宽度或高度中较大的那个，（Math.max(1vw, 1vh)）

  - %

  - calc() 

    ```
    width: calc(100vw - 80px)
    ```

- 案例分析

  - 禁止用户缩放

    （淘宝案例）

    ```
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
    ```

    




## 框架

- 基本原理

  - 数据劫持与代理`Object.defineProperty`和数组方法重写

    ```js
    let data = {
      stage: "gitchat",
      course: {
        title: "前端"
      }
    };
    const observe = data => {
      if (!data || typeof data !== "object") {
        return;
      }
      Object.keys(data).forEach(key => {
        let currentValue = data[key];
        observe(currentValue);
        Object.defineProperty(data, key, {
          enumerable: true,
          configurable: false,
          get() {
            console.log("get" + currentValue);
            return currentValue;
          },
          set(newValue) {
            console.log("set" + newValue);
            currentValue = newValue;
            observe(currentValue);
          }
        });
      });
    };
    observe(data);
    
    data.stage = { a: 1 };
    console.log(data.stage.a);
    //
    set[object Object]
    get[object Object]
    get1
    1
    ```

    这样就是监听了普通数据的更改，但是针对数组的操作并没有监听

    ```js
    const arrExtend = Object.create(Array.prototype);
        const arrMethods = [
          "push",
          "pop",
          "shift",
          "unshift",
          "splice",
          "sort",
          "reverse"
        ];
        arrMethods.forEach(key => {
          const oldMethod = Array.prototype[key];
          const newMethod = function(...args) {
            oldMethod.apply(this, args);
            console.log(`${key}方法执行了`);
          };
          arrExtend[key] = newMethod;
        });
        Array.prototype = Object.assign(Array.prototype, arrExtend);
    // 对数组方法进行重写
    ```

  - `Proxy`

    ```js
    let data = {
      stage: 'GitChat',
      course: {
        title: '前端开发进阶',
        author: ['Lucas'],
        publishTime: '2018 年 5 月'
      }
    }
    
    const observe = data => {
      if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
          return
      }
    
      Object.keys(data).forEach(key => {
        let currentValue = data[key]
        // 事实上 proxy 也可以对函数类型进行代理。这里只对承载数据类型的 object 进行处理，读者了解即可。
        if (typeof currentValue === 'object') {
          observe(currentValue)
          data[key] = new Proxy(currentValue, {
            set(target, property, value, receiver) {
              // 因为数组的 push 会引起 length 属性的变化，所以 push 之后会触发两次 set 操作，我们只需要保留一次即可，property 为 length 时，忽略
              if (property !== 'length') {
                console.log(`setting ${key} value now, setting value is`, currentValue)
              }
              return Reflect.set(target, property, value, receiver)
            }
          })
        }
        else {
          Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get() {
              console.log(`getting ${key} value now, getting value is:`, currentValue)
              return currentValue
            },
            set(newValue) {
              currentValue = newValue
              console.log(`setting ${key} value now, setting value is`, currentValue)
            }
          })
        }
      }) 
    }
    
    observe(data)
    ```

    

  - 首先罗列 `Object.defineProperty()` 的缺点:

    1. `Object.defineProperty()` 不会监测到数组引用不变的操作(比如 `push/pop` 等);
    2. `Object.defineProperty()` 只能监测到对象的属性的改变, 即如果有深度嵌套的对象则需要再次给之绑定 `Object.defineProperty()`;

    关于 `Proxy` 的优点

    1. 可以劫持数组的改变;
    2. `defineProperty` 是对属性的劫持, `Proxy` 是对对象的劫持;

- 虚拟DOM
  - 虚拟 DOM 就是用数据结构表示 DOM 结构，它并没有真实 append 到 DOM 上

  - 操作数据结构远比和浏览器交互去操作 DOM 快很多。请读者准确理解这句话：操作数据结构是指改变对象（虚拟 DOM），这个过程比修改真实 DOM 快很多。但虚拟 DOM 也最终是要挂载到浏览器上成为真实 DOM 节点，因此使用虚拟 DOM 并不能使得操作 DOM 的数量减少，但能够精确地获取最小的、最必要的操作 DOM 的集合。



## react

- JSX : JSX 只是函数调用和表达式的语法糖

- JSX中使用if-else

  ```js
  const list = ({isLoading, list, error}) => {
    return (
      <div>
        {
          (() => {
            console.log(list)
            console.log(isLoading)
            console.log(error)
  
            if (error) {
              return <span>Something is wrong!</span>
            }
            if (!error && isLoading) {
              return <span>Loading...</span>
            }
            if (!error && !isLoading && !list.length) {
              return <p>Sorry, the list is empty </p>
            }
            if (!error && !isLoading && list.length > 0) {
              return <div>
                {
                  list.map(item => <ListItem item={item} />)
                }
              </div>
            }
          })()
        }
      </div>
    )
  }
  
  ```

  “为什么不能直接在 JSX 中使用 if...else，只能借用函数逻辑实现呢”？实际上，我们都知道 JSX 会被编译为 React.createElement。直白来说，React.createElement 的底层逻辑是无法运行 JavaScript 代码的，而它只能渲染一个结果。因此 JSX 中除了 JS 表达式，不能直接写 JavaScript 语法。准确来讲，JSX 只是函数调用和表达式的语法糖。

- HoC

  ```js
  class WindowWidth extends React.Component {
    constructor() {
      super()
      this.state = {
        width: 0
      }
    }
  
    componentDidMount() {
      this.setState(
        {
          width: window.innerWidth
        },
        window.addEventListener('resize', ({target}) => {
          this.setState({
            width: target.innerWidth
          })
        })
      )
    }
  
    render() {
      return this.props.children(this.state.width)
    }
  }
  
  <WindowWidth>
    {
      width => (width > 800 ? <div>show</div> : null)
    }
  <WindowWidth>
  ```

- `this.setSate`

  - 既不是异步更新也不是同步更新， 所谓的延迟更也不是针对所有的情况

    React 控制的事件处理过程，setState 不会同步更新 this.state。而在 React 控制之外的情况， setState 会同步更新 this.state。

    ```js
    onClick() {
      this.setState({
        count: this.state.count + 1
      })
    }
    
    componentDidMount() {
      document.querySelectorAll('#btn-raw')
        .addEventListener('click', this.onClick)
    }
    
    render() {
      return (
        <React.Fragment>
          <button id="btn-raw">
            click out React
          </button>
    
          <button onClick={this.onClick}>
            click in React
          </button>
        </React.Fragment>
      )
    }
    ```

    id 为 btn-raw 的 button 上绑定的事件，是在 componentDidMount 方法中通过 addEventListener 完成的，这是脱离于 React 事件之外的，因此它是同步更新的。反之，代码中第二个 button 所绑定的事件处理函数对应的 setState 是异步更新的。

  - `this.setState  promise`化

    - 异步更新的方法： setState 接受第二个参数，作为状态更新后的回调

    - setState  的更新方式

      - 常规的state更新 **(不适用于频繁更新)

        ```js
        const { data } = this.state
        const list = []
        .....
        this.setState({data: list })
        ```

      - 频繁更新

        ```js
        this.setState(prevState => {
           const list = prevState.submitAccessList.map(item => {
                if (data.courseId === item.courseId) {
                    // eslint-disable-next-line
                    item = { ...item, ...data };
                }
                return item;
            });
            return {
                submitAccessList: list,
            };
        }); 使用每次更新后的state
        ```

      - state更新之后再调用

        ```js
        this.setState({data:list}, () => {
            const { data } = this.state
            ....
        }) // 跟新数据之后需要做什么操作
        ```

  - 事件

    - React 中的事件机制并不是原生的那一套，事件没有绑定在原生 DOM 上 ，大多数事件绑定在 document 上（除了少数不会冒泡到 document 的事件，如 video 等)
    - 同时，触发的事件也是对原生事件的包装，并不是原生 event
    - 出于性能因素考虑，合成事件（syntheticEvent）是被池化的。这意味着合成事件对象将会被重用，在调用事件回调之后所有属性将会被废弃。这样做可以大大节省内存，而不会频繁的创建和销毁事件对象。

    

    - 异步访问事件对象

      - ```js
        function handleClick(e) {
          console.log(e)
        
          setTimeout(() => {
            console.log(e) // undefined
          }, 0)
        }
        ```

      - ```js
        function handleClick(e) {
          console.log(e)
        
          e.persist() // 持久化合成事件
        
          setTimeout(() => {
            console.log(e)
          }, 0)
        }
        ```

    - 如何阻止冒泡

      - 在 React 中，直接使用 e.stopPropagation 不能阻止原生事件冒泡，因为事件早已经冒泡到了 document 上，React 此时才能够处理事件句柄。

      ```js
      componentDidMount() {
        document.addEventListener('click', () => {
          console.log('document click')
        })
      }
      
      handleClick = e => {
        console.log('div click')
        e.stopPropagation()
      }
      
      render() {
        return (
          <div onClick={this.handleClick}>
            click
          </div>
        )
      }
      
      执行后会打印出 div click，之后是 document click。e.stopPropagation 是没有用的
      ```

      但是 React 的合成事件还给使用原生事件留了一个口子，通过合成事件上的 nativeEvent 属性，我们还是可以访问原生事件。原生事件上的 stopImmediatePropagation 方法：除了能做到像 stopPropagation 一样阻止事件向父级冒泡之外，也能阻止当前元素剩余的、同类型事件的执行（第一个 click 触发时，调用 e.stopImmediatePropagtion 阻止当前元素第二个 click 事件的触发）

      ```js
      componentDidMount() {
        document.addEventListener('click', () => {
          console.log('document click')
        })
      }
      
      handleClick = e => {
        console.log('div click')
        e.nativeEvent.stopImmediatePropagation()
      }
      
      render() {
        return (
          <div onClick={this.handleClick}>
            click
          </div>
        )
      }
      
      只会打印出 div click。
      ```

  - 组件设计

    - 单一原则， 必要的时候可以使用高阶组件强制保持组件的单一原则
    - 一处组件的改动完全独立，不影响其他组件
    - 更好的复用设计
    - 更好的可测试性

    （准）纯组件是渲染数据全部来自于 props，但是会产生副作用的组件）

## 性能优化

- **页面工程优化**从页面请求开始，涉及网络协议、资源配置、浏览器性能、缓存等

- **代码细节优化**上相对零散，比如 JavaScript 对 DOM 操作，宿主环境的单线程相关内容等。

  - 尽量减少回流（布局发生改变）

  - ```js
    document.createDocumentFragment
    ```

  - ```
    window.requestAnimationFrame(callback)
    该方法告诉浏览器你希望执行的操作，并请求浏览器在下一次重绘之前调用指定的函数来更新。
    ```

    ```js
    var h1 = element1.clientHeight
    element1.style.height = (h1 * 2) + 'px'
    
    var h2 = element2.clientHeight
    element2.style.height = (h2 * 2) + 'px'
    
    var h3 = element3.clientHeight
    element3.style.height = (h3 * 2) + 'px'
    
    ```

    **布局抖动**是指 DOM 元素被 JavaScript 多次反复读写，导致文档多次无意义重排。我们知道浏览器很“懒”，它会收集（batch）当前操作，统一进行重排。可是，如果在当前操作完成前，从 DOM 元素中获取值，这会迫使浏览器提早执行布局操作，这称为**强制同步布局**。这样的副作用对于低配置的移动设备来说，后果是不堪设想的。

    ```js
    // 读
    var h1 = element1.clientHeight
    var h2 = element2.clientHeight
    var h3 = element3.clientHeight
    
    // 写（无效布局）
    element1.style.height = (h1 * 2) + 'px'
    element2.style.height = (h2 * 2) + 'px'
    element3.style.height = (h3 * 2) + 'px'
    ```

    ```js
    // 读
    var h1 = element1.clientHeight
    // 写
    requestAnimationFrame(() => {
        element1.style.height = (h1 * 2) + 'px'
    })
    
    // 读
    var h2 = element2.clientHeight
    // 写
    requestAnimationFrame(() => {
        element2.style.height = (h2 * 2) + 'px'
    })
    
    // 读
    var h3 = element3.clientHeight
    // 写
    requestAnimationFrame(() => {
        element3.style.height = (h3 * 2) + 'px'
    })
    ```

    我们将代码中所有 DOM 的写操作在下一帧一起执行，保留所有 DOM 的读操作在当前同步状态。这样有效减少了无意义的重排，显然效率更高。

  - 事件委托

  - 实现节流和防抖

    - 防抖：抖动现象本质就是指短时间内高频次触发。因此，我们可以把短时间内的多个连续调用合并成一次，也就是只触发一次回调函数。
    - 节流：顾名思义，就是将短时间的函数调用以一个固定的频率间隔执行，这就如同水龙头开关限制出水口流量



## 设计模式

### 设计模式原则

- 开闭原则
  - 开是指对外扩展  闭式说对修改关闭
- 里氏替换原则
- 依赖反转原则
- 接口隔离原则
- 最小知道原则
- 合成复用原则

### 三大类型

- 创建型

  - 简单工厂模式

    ```js
    class A {
      constructor(name) {
        this.name = name;
      }
      get value() {
        return this.name;
      }
    }
    class B {
      constructor(name) {
        this.name = name;
      }
      get value() {
        return this.name;
      }
    }
    class C {
      constructor(name) {
        this.name = name;
      }
      get value() {
        return this.name;
      }
    }
    
    function Factory(type, name) {
      switch (type) {
        case "A":
          return new A(name);
        case "B":
          return new B(name);
        case "C":
          return new C(name);
      }
    }
    const a = Factory("A", "a"); 
    const b = Factory("B", "b");
    const c = Factory("C", "c");
    
    a.value, b.value, c.value // a b c
    ```

  - 工厂方法模式

  - 抽象工厂模式

  - 建造者模式

    ```js
        constructor(size) {
            this.size = size
        }
    
        addMushroom() {
            this.mushroom = true
            return this
        }
    
        addOliver() {
            this.oliver = true
            return this
        }
    
        addPoulet() {
            this.poulet = true
            return this
        }
    
        addChesse() {
            this.chesse = true
            return this
        }
    
        addTomato() {
            this.tomato = true
            return this
        }
    
        addLettuce() {
            this.lettuce = true
            return this
        }
    
        build() {
            return new Pizza(this)
        }
    }
    
    
    new Pizza(32)
        .addOliver()
        .addTomato()
        .build()
    ```

    

  - 单例模式

    ```js
    const singleton = function(name) {
      this.name = name
      this.instance = null
    }
    
    singleton.prototype.getName = function() {
      console.log(this.name)
    }
    
    singleton.getInstance = function(name) {
      if (!this.instance) { // 关键语句
        this.instance = new singleton(name)
      }
      return this.instance
    }
    
    // test
    const a = singleton.getInstance('a') // 通过 getInstance 来获取实例
    const b = singleton.getInstance('b')
    ```

    

- 结构型

  - 适配器模式

  - 外观模式

    ```js
    // 例1 兼容浏览器
    function addEvent(dom, type, fn) {
      if (dom.addEventListener) {
        dom.addEventListener(type, fn, false);
      } else if (dom.attachEvent) {
        dom.attachEvent(`on${type}`, fn);
      } else {
        dom[`on${type}`] = fn;
      }
    }
    // 例2
    // 获取事件源对象
    const getEvent = function() {
      return event || window.event;
    };
    
    // 获取元素
    const getTarget = function() {
      const event = getEvent();
      return event.target || event.srcElement;
    };
    
    // 阻止默认行为
    const preventDefault = function() {
      const event = getEvent();
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    };
    
    // 阻止冒泡行为
    const stopPropagation = function() {
      const event = getEvent();
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    };
    ```

  - 。。。 

- 行为型

  - 职责链
  - 命令模式



## 网络基础知识

