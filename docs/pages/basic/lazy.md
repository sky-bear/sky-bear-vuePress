# 图片的懒加载

这里的图片我用背景颜色替代

## 第一种方式： getBoundClientRect

```js
const box = document.querySelectorAll(".box");
const num = box.length;

const lazyLoad = (function(box) {
    let count = 0;
    box.forEach(item => { 
        let dom = item.getBoundingClientRect();
        if (dom.top < window.innerHeight) {
            item.style.backgroundColor = rgb(); // 根据屏幕高度首先需要显示的图片
            count += 1;
        }
    });
    let boxList = [...box].slice(count); // 去除已经显示的图片
    return function() {
        let deleteIndexList = [];
        boxList.forEach((item, index) => {
            let dom = item.getBoundingClientRect();
            if (dom.top < window.innerHeight) {
                item.style.backgroundColor = rgb();
                count += 1;
                deleteIndexList.push(index);
                if (count === num) { // 当所有的图片都显示时，移除监听
                    window.removeEventListener("scroll", lazyLoad);
                }
            }
        });
        boxList = boxList.filter(
            (_, index) => !deleteIndexList.includes(index)
        ); // 每次都更新， 只循环未加载的
    };
})(box);
window.addEventListener("scroll", lazyLoad);
```

## 第二种： IntersectionObserver

```js
const options = {
      root: null,
      // threshold: [0, 0.5, 1],
      rootMargin: "-200px -200px" // 控制root元素的宽度和高度
  };
const io = new IntersectionObserver(callBack, options);

// 添加监听
box.forEach(item => io.observe(item));

function callBack(entries) {
    console.log(entries);
    // boundingClientRect 目标元素的矩形信息
    // intersectionRatio 相交区域和目标元素的比例值 intersectionRect/boundingClientRect 不可见时小于等于0
    // intersectionRect 目标元素和视窗（根）相交的矩形信息 可以称为相交区域
    // isIntersecting 目标元素当前是否可见 Boolean值 可见为true
    // rootBounds 根元素的矩形信息，没有指定根元素就是当前视窗的矩形信息
    // target 观察的目标元素
    // time 返回一个记录从IntersectionObserver的时间到交叉被触发的时间的时间戳
    entries.forEach(item => {
        if (item.intersectionRatio) {
            item.target.style.backgroundColor = rgb();
            io.unobserve(item.target); // 停止观察当前元素 避免不可见时候再次调用callback函数
        }
    });
}
```

##### 参考文档

[谈谈IntersectionObserver懒加载](<https://www.jianshu.com/p/84a86e41eb2b>)

