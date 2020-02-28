// 验证改写valueOf 和 toString 的调用先后顺序

// 都改写
let obj1 = {
  valueOf() {
    console.log("valueOf");
    return 10;
  },
  toString() {
    console.log("toString");
    return 10;
  }
};
console.log(+obj1); //  10 参数 hint => number => valueOf
console.log(`${obj1}`); // 10 参数 hint => string => toString
console.log(obj1 + ""); // 10 参数 default => hint => number => valueOf
console.log(Number(obj1)); // 10 参数 hint => number => valueOf
console.log(String(obj1)); // 10 参数 hint => string => toString

console.log("----------------");

// 只改写valueOf
let obj2 = {
  valueOf() {
    console.log("valueOf");
    return 10;
  }
  // toString() {
  // console.log('toString')
  //   return "10";
  // }
};

console.log(+obj2); //  10 参数 hint => number => valueOf
console.log(`${obj2}`); //  [object Object] 参数 hint => string => toString
console.log(obj2 + ""); // 10 参数 default => hint => number => valueOf
console.log(Number(obj2)); // 10 参数 hint => number => valueOf
console.log(String(obj2)); // [object Object] 参数 hint => string => toString

console.log("----------------");
// 只改写toString
let obj3 = {
  // valueOf() {
  //   console.log("valueOf");
  //   return 10;
  // },
  toString() {
    console.log("toString");
    return 10;
  }
};

console.log(+obj3); //
console.log(`${obj3}`); //
console.log(obj3 + ""); //
console.log(Number(obj3)); //
console.log(String(obj3)); //

// 忽然发现没有实际意义， 不管怎么样都会调用toString
