# js 中的隐式转换

## 隐式转换规则

> 所谓隐式转换就是在进行比较（==）或者运算的时进行的数据类型转换

### ToPrimitive

> `Symbol.toPrimitive(input, PreferredType )`该对象操作接受一个参数 input 和一个可选的参数 PreferredType （[String, Number]）,如果不传默认是 default

- 当对象类型进行转换时， 按照以下步骤（原始数据类型不转换）

  - 如果 PreferredType 没有传，令 hint 为”default”

  - 如果 PreferredType 参数是 String 类型，那么令 hint 为”string”

  - 如果 PreferredType 参数是 Number 类型，那么令 hint 为”number”

  - 令 exoticToPrim 为 GetMethod(input, @@toPrimitive).【@@toPrimitive： Symbol.toPrimitive 的另一种写法】

  - 如果 exoticToPrim 不是 undefined，那么

    - 令 result 为 Call(exoticToPrim, input, « hint »).
    - 如果 result 类型不是 Object，直接返回 result
    - 扔出 TypeError 异常

  - 如果 hint 为”default”,令 hint 为”number”

  - 返回 OrdinaryToPrimitive(input, hint)的值【即 exoticToPrim 是不存在时使用这个函数】

    > 当抽象方法 OrdinaryToPrimitive 被执行时【OrdinaryToPrimitive（O, hint）】，采用如下步骤
    >
    > - 如果 hint 是"string"，让 methodNames 等于« "toString", "valueOf" »
    > - 如果 hint 是"number"，让 methodNames 等于« "valueOf", "toString" »
    > - 按顺序迭代列表 methodNames，对于每一个迭代值 name；
    >   - 令 method 为 Get(O, name).
    >   - 如果 IsCallable(method)返回 true,然后
    >     - 令 result 为 Call(method, O).
    >     - 如果 result 的类型不是 Object，返回 result
    >   - 返回 TypeError**异常**
    >
    > 这里通过英文翻译过来比较生硬， 其实就是， 按照 methodNames 中的顺序，判断对象上是否有这个方法， 如果有执行这个方法，如果没有判断下个方法。 如果该方法的返回值是原始值类型，则直接返回， 否则继续按照上述规则有序判断， 直到所有方法都执行后， 返回值仍不是原始值， 则 TypeError

- 总结一下有如下特点

  - ToPrimitive(input,hint)转换为原始类型的方法，根据 hint 目标类型进行转换。

  - hint 只有两个值：String 和 Number

  - 如果没有传 hint，Date 类型的 input 的 hint 默认为 String,其他类型的 input 的 hint 默认为 Number

    ```js
    let b = new Date();
    const c = b.toString.bind(b);
    b.toString = function() {
      console.log("toString");
      return c();
    };

    b.valueOf = function() {
      console.log("valueOf");
      return 6;
    };
    console.log(b + '');
    // 打印
    toString
    time: Wed Feb 26 2020 15:01:54 GMT+0800 (中国标准时间)
    ```

    此时打印的是`toString`, 说明此时调用 ToPrimitive 时可选参数默认是 string

* _可以重写对象的@@toPrimitive 方法来覆盖这个行为_

  > 我们常见的数组和对象上都没有`Symbol.toPrimitive`这个属性的
  >
  > ```js
  > const a = new Date();
  > const b = [1];
  > const c = { a: 1 };
  > console.log(
  >   a[Symbol.toPrimitive],
  >   b[Symbol.toPrimitive],
  >   c[Symbol.toPrimitive]
  > );
  > // [Function: [Symbol.toPrimitive]] undefined undefined
  >
  > let b = new Date();
  > b[Symbol.toPrimitive] = function(hint) {
  >   console.log(hint);
  >   if (hint == "number") {
  >     return 10;
  >   }
  >   if (hint == "string") {
  >     return "hello";
  >   }
  >   return true;
  > };
  > console.log(b + ""); //Wed Feb 26 2020 18:03:51 GMT+0800 (GMT+08:00)
  > 我这里改写了@@toPrimitive， 但是不起作用 求指点
  > ```
  >
  > 但是我们可以改写`Symbol.toPrimitive`, 我们看看如下例子
  >
  > - const a = [1] => a == 10 // true ？
  >
  >   1. 方法 1
  >
  >      ```js
  >      a[Symbol.toPrimitive] = function(hint) {
  >        return 10;
  >      };
  >      ```
  >
  >      我们改写了`toPrimitive`的方法， 这样在进行比较时， 数组 a 优先调用`toPrimitive`都返回 10
  >
  >   2. 方法 2
  >
  >      ```js
  >      a.valueOf = function() {
  >        return 10;
  >      };
  >      ```
  >
  >      我们改写`valueOf`方法，也可以达到结果【原生`valueOf`返回当前对象本身】,当`Symbol.toPrimitive`不存在时， 默认 hint 是 number, 则优先调用`valueOf`
  >
  >      > 那么`valueOf`和`Symbol.toPrimitive`有什么关系吗?
  >      >
  >      > 个人观点： 首先上面可以看出数组和而普通对象上并没有部署`Symbol.toPrimitive`做这个方法， 但是我们在整个转化过程中， 假设部署过这个方法， 然后按照上面的步骤就行转换， 这也就是部署了`Symbol.toPrimitive`后直接返回结果， 不在执行后面的步骤

* Number 类型先判断 `valueOf()`方法的返回值，如果不是原始值，再判断`toString()`方法的返回值，如果还是不能转换成原始值就会报错

* String 类型先判断 `toString()`方法的返回值，如果不是，再判断 `valueOf()`方法的返回值，如果还是不能转换成原始值就会报错

* 在实际转换中参数`PreferredType`根据实际期待转换的值确定， 为什么这么说呢， 我们看看以下例子

  ```js
  // 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
  let obj1 = {};
  console.log(+obj1); // NaN
  console.log(`${obj1}`); // "[object Object]"
  console.log(obj1 + ""); // "[object Object]"

  // // 接下面声明一个对象，手动赋予了 Symbol.toPrimitive 属性，再来查看输出结果
  let obj2 = {
    [Symbol.toPrimitive](hint) {
      if (hint == "number") {
        return 10;
      }
      if (hint == "string") {
        return "hello";
      }
      return true;
    }
  };

  console.log(+obj2); // 10      -- hint 参数值是 "number"
  console.log(`${obj2}`); // "hello" -- hint 参数值是 "string"
  console.log(obj2 + ""); // "true"  -- hint 参数值是 "default"
  console.log(Number(obj2)); // 10
  console.log(String(obj2)); //  hello

  let obj3 = {
    valueOf() {
      return 10;
    },
    toString() {
      return "hello";
    }
  };
  console.log(+obj3); // 10  -- hint 参数值是 "number"
  console.log(`${obj3}`); //  "hello" -- hint 参数值是 "string"
  console.log(obj3 + ""); // 10 // 默认 参数defalut => hint => number
  console.log(Number(obj3)); // 10
  console.log(String(obj3)); // hello
  ```

  上面的例子取自 MDN， 后面 ob3 时我个人加的， 这里我们可以看出不同使用情况下， 期待对象转换成的类型即是传入的`PreferredType`参数，字符串模板期望的 string , 写在字符串前面的+期望是 number， 这样我们啦测试一下

  ```js
  console.log(obj3 * 1); // 10
  console.log(Number(obj3)); // 10
  ```

  但是感觉有点不对呢，我们再次进行测试

  ```js
  var n = {
    // toString: function() {
    //   return 1;
    // },

    // valueOf: function() {
    //   return 2;
    // }
    [Symbol.toPrimitive](hint) {
      console.log(hint);
      if (hint == "number") {
        return 2;
      }
      if (hint == "string") {
        return 1;
      }
      return true;
    }
  };
  let obj = { 1: 1, 2: 2 };
  let arr = [1];
  arr[Symbol.toPrimitive] = function(hint) {
    console.log(hint);
    if (hint == "number") {
      return 2;
    }
    if (hint == "string") {
      return 1;
    }
    return true;
  };
  console.log(+n); // number  2
  console.log(obj[n]); // string 1
  console.log(obj[arr]); // string 1
  console.log(arr > 4); // number  false
  console.log(n > 4); // number false
  console.log(n > "4"); // number false
  console.log(n == 4); // default  false
  console.log(parseInt(n)); // string 1
  console.log(n / 2); // number 1
  ```

  通过上述一些测试可以得出以下结论：

  **当代码执行时， 明确清楚 需要什么类型的原始值（string, number），参数就是默认的类型， 否则都是 default**

### ToString

> 将参数转换成字符串

转换规则如下

| 参数      | 结果                                                                        |
| --------- | --------------------------------------------------------------------------- |
| undefined | 'undefined'                                                                 |
| null      | 'null'                                                                      |
| 布尔值    | 转换为'true' 或 'false'                                                     |
| 数字      | 数字转换字符串                                                              |
| 字符串    | 无须转换                                                                    |
| 对象(obj) | 先进行 ToPrimitive(obj, String)转换得到原始值，在进行 ToString 转换为字符串 |

### ToNumber

> 根据参数类型转换成数字类型

| 参数       | 结果                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| undefined  | NaN                                                                       |
| null       | +0                                                                        |
| 布尔值     | true 转换 1，false 转换为+0                                               |
| 数字       | 无须转换                                                                  |
| 字符串     | 有字符串解析为数字，例如：‘324’转换为 324，‘qwer’转换为 NaN               |
| ''(空字符) | 0                                                                         |
| 对象(obj)  | 先进行 ToPrimitive(obj, Number)转换得到原始值，在进行 ToNumber 转换为数字 |

### ToBoolean

> 布尔值转换

| 参数         | 结果  |
| ------------ | ----- |
| undefined    | false |
| null         | false |
| -0 +0        | false |
| NaN          | false |
| ''(空字符串) | false |
| 所有的对象   | true  |

### ==的判断规则（x==y）

- 如果 Type(x)和 Type(y)相同，返回 x===y 的结果

- 如果 Type(x)和 Type(y)不相同

  - 如果 x 是 null，y 是 undefined，返回 true

  - 如果 x 是 undefined，y 是 null，返回 true

  - 如果 Type(x)是 Number，Type(y)是 String，返回 x==ToNumber(y) 的结果

  - 如果 Type(x)是 String，Type(y)是 Number，返回 ToNumber(x)==y 的结果

  - 如果 Type(x)是 Boolean，返回 ToNumber(x)==y 的结果

  - 如果 Type(y)是 Boolean，返回 x==ToNumber(y) 的结果

  - 如果 Type(x)是 String 或 Number 或 Symbol 中的一种并且 Type(y)是 Object，返回 x==ToPrimitive(y) 的结果

  - 如果 Type(x)是 Object 并且 Type(y)是 String 或 Number 或 Symbol 中的一种，返回 ToPrimitive(x)==y 的结果

    其他返回 false

## 常见面试题

- `{} + [] => ?` `[] + {} => ?`

  ```js
  {} + []  => 0
  [] + {}  => "[object Object]"
  ```

为什么呢？
ji 中{}解析时， 被当成了代码块执行， 所以 {} + [] 实际就是 +[] => toPrimitive([], number) => valueOf => [](不是原始值) => toString => ''(原始值) => 0 (转换成 number)

而[] + {} => toPrimitive([]) + toPrimitive({}) => toPrimitive([],default) + toPrimitive({},default) => toPrimitive([],number) + toPrimitive({}, number) => valueOf + valueOf => [](不是原始值) + {}(不是原始值) => toString + toString => '' + "[object Object]" => "[object Object]"

这就是整个的计算过程
（{}） + [] => "[object Object]" 用括号包起来就没问题了

```

- `[] == !{} => ?`

```

1.!的优先级高于 == ， 所以 {}转成 boolean 是 true => !{} =false

2. 当有一端是布尔值时， 转成成数字 false => 0 => [] == 0
3. 后面就是[] 转换成原始值， [] => valueof => [] => toString => '' 转成数字 => 0

````

- ```js
const a = {
  i: 1,
  toString: function () {
    return a.i++;
  }
}
if (a == 1 && a == 2 && a == 3) {
  console.log('hello world!');
}
上面只写了一种， 所以只要我们了解规则之后，
const a = {
  i: 1,
  toString: function() {
    console.log("toString");
    return a.i++;
  },
  valueOf() {
    console.log("valueOf");
    return a.i++;
  },
  [Symbol.toPrimitive](hint) {
    console.log(hint);
    if (hint == "number") {
      return 10;
    }
    if (hint == "string") {
      return "hello";
    }
    return a.i++;
  }
}
这三种都行， 认选一种
````

- ```
  {} + {} =>NaN (火狐)
  {} + {} => "[object Object][object Object]" （谷歌）
  ({} + {}) =>"[object Object][object Object]" （谷歌, 火狐）
  {} + ({}) => NaN (谷歌， 火狐)
  ```

参考文档：

[详解 ECMAScript7 规范中 ToPrimitive 抽象操作的知识（示例）](https://www.php.cn/js-tutorial-410318.html)

[js 中==和===的区别](https://www.jianshu.com/p/36217b8a41b6)
