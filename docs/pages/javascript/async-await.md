### async

#### 含义

​	一句话，它就是 Generator 函数的语法糖.

​	Generator函数，一次读取2个文件

```js
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

如果使用async函数

```js
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

`async`函数就是将 Generator 函数的星号（`*`）替换成`async`，将`yield`替换成`await`，仅此而已

相比较Generator函数的优点：

- 内置执行器

  Generator 函数的执行必须靠执行器，所以才有了`co`模块，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行

- 更好的语义

  `async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果

- 更广的适用性

  `async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作

- 返回值是 Promise

  `async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作

#### 基本用法

`async`函数返回一个 Promise 对象，可以使用`then`方法添加回调函数。当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```js
 const delay = timeout => new Promise(resolve=> setTimeout(() => {
      resolve(123)
    }, timeout))

async function foo() {
    const res = await delay(3000)
    console.log(res)  // 123 
    console.log('done')
    return res 
}
foo() 
// 3s后输出 
// Promise {<pending>}
// 123
// done
foo().then(v => console.log(v)) // 123
如果没有return 返回 undefined


async function foo1(name) {
   	await delay(1000)
  	await delay(2000)
    await delay(3000)
    console.log(name)
}
foo1('done') // 6s 之后输出 ‘done'
```

```js
async search() {
    this.searchData.pageSize = 20
    const res = await this.API.getUserList(this.searchData)
    this.page = res.page
    this.data = res.list
    return res
},
```

函数前面的`async`关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个`Promise`对象。

因此上面代码可以改成

```js
async function time(timeout) {
    const res = await new Promise(resolve=> setTimeout(() => {
   	 resolve(123)
	}, timeout))
    return res // 一定要return，不然返回 undefuned
}
async function foo() {
    const res = await time(3000)
    console.log(res)
    console.log('done')
    return res 
}
foo()
// 3s后输出 
// Promise {<pending>}
// 123
// done
foo().then(v => console.log(v)) // 123
```

​	async 函数有多种使用形式。

​	

```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

#### 语法

##### 返回Promise对象

`async`函数返回一个 Promise 对象

`async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数

```javascript
async function f() {
  return 'hello world';
}
// 等同于
async function f() {
    return Promise.resolve('hello world')
}
f().then(v => console.log(v))
// "hello world"
```

上面代码中，函数`f`内部`return`命令返回的值，会被`then`方法回调函数接收到。

`async`函数内部抛出错误，会导致返回的 Promise 对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

```javascript
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```

##### Promise对象的状态变化

`async`函数返回的 Promise 对象，必须等到内部所有`await`命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。

也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。

```js
async function foo(name) {
   	await delay(1000)
  	await delay(2000)
    await delay(3000)
    console.log(name)
    return 123
}
foo('done') // 6s 之后输出 ‘done'
foo().then(v => console.log(v)) // 6s后输出123
```

##### await命令

正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```

上面代码中，`await`命令的参数是数值`123`，这时等同于`return 123`。

如果`await`后面跟的不是promise直接返回

看看下面返回什么

```js
async function foo() {
    console.log(1)
    await 123
    console.log(2)
}
setTimeout(() => {
    console.log(4)
},0)
foo()
console.log(3)



async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
},0)  
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')

```

`await`命令后面的 Promise 对象如果变为`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到。

```javascript
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了


 async function foo() {
     await Promise.resolve(123)
     // return  await Promise.resolve(123)
 }
foo().then(v => console.log(v)) // undefined 这里和reject不一样
```

注意，上面代码中，`await`语句前面没有`return`，但是`reject`方法的参数依然传入了`catch`方法的回调函数。这里如果在`await`前面加上`return`，效果是一样的。

任何一个`await`语句后面的 Promise 对象变为`reject`状态，那么整个`async`函数都会中断执行

```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve(123) // 不会执行
}
```

上面代码中，第二个`await`语句是不会执行的，因为第一个`await`语句状态变成了`reject`。

```js
async function foo() {
    try {
    	await Promise.reject('出错了');
    	console.log(1) // 不会执行
    } catch(e) {
    	console.log(e)
    }
    return   await Promise.resolve(123)
}
foo().then(v => console.log(v), res => console.log(res))
// 123
```

第一个`await`放在`try...catch`结构里面，这样不管这个异步操作是否成功，第二个`await`都会执行

另一种方法是`await`后面的 Promise 对象再跟一个`catch`方法，处理前面可能出现的错误。

```js
async function foo() {
    await Promise.reject('出错了').catch(e =>console.log(e))
    let res1 = await Promise.resolve(123)
    let res2 = await Promise.resolve(1456)
    return  {res1, res2}
}
foo().then(v => console.log(v), res => console.log(res))
出错了
{res1: 123, res2: 1456}
```

##### 错误处理

如果`await`后面的异步操作出错，那么等同于`async`函数返回的 Promise 对象被`reject`。

```javascript
async function f() {
  await new Promise(function (resolve, reject) {
    throw new Error('出错了');
  });
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// Error：出错了

async function f() {
  await new Promise(function (resolve, reject) {
    throw new Error('出错了'); 
  }).catch(e => console.log(2,e)); // 内部捕获错误后
}

f()
.then(v => console.log(v))
.catch(e => console.log(e)) // 2 Error: 出错了
```

`async`函数`f`执行后，`await`后面的 Promise 对象会抛出一个错误对象，导致`catch`方法的回调函数被调用，它的参数就是抛出的错误对象

http://es6.ruanyifeng.com/#docs/async

**错误**：如果有多个`await`命令，可以统一放在`try...catch`结构中。

```javascript
async function main() {
  try {
    const val1 = await firstStep();
    const val2 = await secondStep(val1);
    const val3 = await thirdStep(val1, val2);

    console.log('Final: ', val3); // 不能执行到这里，一旦出现reject，就会停止执行
  }
  catch (err) {
    console.error(err);
  }
}

```

例如

```js
const delayResolve= timeout => new Promise(resolve=> setTimeout(() => {
        resolve(123)
      }, timeout));
const delayReject= timeout => new Promise((resolve, reject)=> setTimeout(() => {
    reject("错了")
}, timeout));

async function time(name) {
    try {
        console.log(1)
        await delayResolve(1000)
        console.log(2)
        await delayReject(2000)
        console.log(3)
        await delayResolve(3000)
        console.log(4)
    }
    catch (err) {
        console.log(err)
    }
}
time().then(v => console.log(v), res => console.log(res))
// 1
// Promise {<pending>}
// 2
// 错了
// undefined
如果在promise后加上catch捕获错误
 const delayReject= timeout => new Promise((resolve, reject)=> setTimeout(() => {
     reject("错了")
 }, timeout)).catch(e => console.log(e));
// 1
// Promise {<pending>}
//  2
// 错了
//  3
//  4
//  undefined
```

多个异步写法

```js
const delayResolve= timeout => new Promise(resolve=> setTimeout(() => {
     resolve(123)
 }, timeout));
const delayReject= timeout => new Promise((resolve, reject)=> setTimeout(() => {
    reject("错了")
}, timeout)).catch(e => console.log(e));

async function time(name) {

    console.log(1)
    let res1 = await delayResolve(1000)
    console.log(2)
    let res2 = await delayReject(2000)
    console.log(3)
    let res3 = await delayResolve(3000)
    console.log(4)
    return {res1,res2,res3}
}
time().then(v => console.log(v), res => console.log(res))
// 1
// Promise {<pending>}
//  2
//  错了
//  3
//  4
// {res1: 123, res2: undefined, res3: 123}
```

##### 使用注意点

- `await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好把`await`命令放在`try...catch`代码块中

  ```js
  async function myFunction() {
    try {
      await somethingThatReturnsAPromise();
    } catch (err) {
      console.log(err);
    }
  }
  
  // 另一种写法
  
  async function myFunction() {
    await somethingThatReturnsAPromise()
    .catch(function (err) {
      console.log(err);
    });
  }
  ```

- 多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

  ```js
   const delay = timeout => new Promise(resolve=> setTimeout(() => {
        resolve(timeout)
   }, timeout));
   async function foo() {
       await Promise.all([delay(1000),delay(3000)])
      // let [res1, res2] =   await Promise.all([delay(1000),delay(3000)])
       console.log(123)
       return 'done'
   }
  
  或者
   async function foo() {
     let res1 = delay(3000)
     let res2 = delay(2000)
     let res3 = delay(1000)
     	console.log(0)
      await res1
       console.log(1)
      await res2
      console.log(2)
      await res3
      console.log(3)
   }
  ```


#### async函数的实现原理

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```javascript
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

所有的`async`函数都可以写成上面的第二种形式，其中的`spawn`函数就是自动执行器。

下面给出`spawn`函数的实现，基本就是前文自动执行器的翻版。

```javascript
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

**async 处理异步的原理**​	

- async 函数遇到`await`操作符会挂起；
- `await`后面的表达式求值（通常是个耗时的异步操作）前 async 函数一直处于挂起状态，避免阻塞 async 函数后面的代码；
- `await`后面的表达式求值求值后（异步操作完成），`await`可以对该值做处理：如果是非 promise，直接返回该值；如果是 promsie，则提取 promise 的值并返回。同时告诉 async 函数接着执行下面的代码；
- 哪里出现异常，结束 async 函数。

`await`后面的那个异步操作，往往是返回 promise 对象（比如 [axios](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Faxios%2Faxios)），然后交给 `await` 处理，毕竟，async-await 的设计初衷就是为了解决异步请求数据时的回调地狱问题，而使用 promise 是关键一步。

#### 按顺序完成异步操作

Promise 的写法如下。

```javascript
function logInOrder(urls) {
  // 远程读取所有URL
  const textPromises = urls.map(url => {
    return fetch(url).then(response => response.text());
  });

  // 按次序输出
  textPromises.reduce((chain, textPromise) => {
    return chain.then(() => textPromise)
      .then(text => console.log(text));
  }, Promise.resolve());
}
```

上面代码使用`fetch`方法，同时远程读取一组 URL。每个`fetch`操作都返回一个 Promise 对象，放入`textPromises`数组。然后，`reduce`方法依次处理每个 Promise 对象，然后使用`then`，将所有 Promise 对象连起来，因此就可以依次输出结果。

这种写法不太直观，可读性比较差。下面是 async 函数实现。

```javascript
async function logInOrder(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

上面代码确实大大简化，问题是所有远程操作都是继发。只有前一个 URL 返回结果，才会去读取下一个 URL，这样做效率很差，非常浪费时间。我们需要的是并发发出远程请求。

```javascript
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

上面代码中，虽然`map`方法的参数是`async`函数，但它是并发执行的，因为只有`async`函数内部是继发执行，外部不受影响。后面的`for..of`循环内部使用了`await`，因此实现了按顺序输出。

#### 异步遍历器(ES9)

异步遍历器的最大的语法特点，就是调用遍历器的`next`方法，返回的是一个 Promise 对象。

```javascript
asyncIterator
  .next()
  .then(
    ({ value, done }) => /* ... */
  );
```

上面代码中，`asyncIterator`是一个异步遍历器，调用`next`方法以后，返回一个 Promise 对象。因此，可以使用`then`方法指定，这个 Promise 对象的状态变为`resolve`以后的回调函数。回调函数的参数，则是一个具有`value`和`done`两个属性的对象，这个跟同步遍历器是一样的。



