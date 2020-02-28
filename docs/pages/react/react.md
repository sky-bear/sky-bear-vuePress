## React 框架学习

#### React 元素渲染

React 元素都是不可变的。当元素被创建之后，你是无法改变其内容或属性的。

目前更新界面的唯一办法是创建一个新的元素，然后将它传入 ReactDOM.render() 方法：

```javascript
const element = <h1>Hello, world!</h1>;
ReactDOM.render(element, document.getElementById("example"));
```

React 元素都是不可变的。当元素被创建之后，你是无法改变其内容或属性的。

目前更新界面的唯一办法是创建一个新的元素，然后将它传入 ReactDOM.render() 方法：

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>现在是 {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById("example"));
}

setInterval(tick, 1000);

封装展示的部分;

function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>现在是 {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById("example")
  );
}

setInterval(tick, 1000);

使用ES6的写法;

class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>现在是 {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById("example")
  );
}

setInterval(tick, 1000);
```

#### 组件 dom 添加样式

想给虚拟 dom 添加行内样式，需要使用表达式传入样式对象的方式来实现：

```

```

行内样式需要写入一个样式对象，而这个样式对象的位置可以放在很多地方，例如 React.createClass 的配置项中、render 函数里、组件原型上、外链 js 文件中

React 推荐我们使用行内样式，因为 react 觉得每一个组件都是一个独立的整体

其实我们大多数情况下还是大量的在为元素添加类名、id 以使用某些样式，但是需要注意的是，class 需要写成 className（因为毕竟是在写类 js 代码，会收到 js 规则的现在，而 class 是关键字）

```
<p className="bg-p" id="myp" style = { this.style }>Hello world</p>
```

#### JSX

优点：

- JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化
- 它是类型安全的，在编译过程中就能发现错误
- 使用 JSX 编写模板更加简单快速。

注意:

由于 JSX 就是 JavaScript，一些标识符像 `class` 和 `for` 不建议作为 XML 属性名。作为替代，React DOM 使用 `className` 和 `htmlFor` 来做对应的属性。

添加自定义属性需要使用 **data-** 前缀。

在 JSX 中不能使用 **if else** 语句，但可以使用 **conditional (三元运算)** 表达式来替代。以下实例中如果变量 **i** 等于 **1** 浏览器将输出 **true**, 如果修改 i 的值，则会输出 **false**.

JSX 允许在模板中插入数组，数组会自动展开所有成员

#### 属性扩散

有时候你需要给组件设置多个属性，你不想一个个写下这些属性，或者有时候你甚至不知道这些属性的名称，这时候 _spread attributes_ 的功能就很有用了

```javascript
var props = {};
props.foo = x;
props.bar = y;
var component = <Component {...props} />;
```

`props` 对象的属性会被设置成 `Component` 的属性。

后面添加的属性会覆盖前面的属性（属性相同的话）

#### 组件

##### props

`props` 就是组件的属性，由外部通过 JSX 属性传入设置，一旦初始设置完成，就可以认为 `this.props` 是不可更改的，所以**不要**轻易更改设置 `this.props` 里面的值（虽然对于一个 JS 对象你可以做任何事）。

使组件拥有属性的方式：

1. 在装载（mount）组件的时候给组件传入

传入数据的时候，除了字符串类型，其他的都应该包上表达式，但是为了规整，所有的数据传递，最好都包上{}

```
var Gouzi = React.createClass({
    render(){
        console.log(this)
        return (
            <div>
                <p>我的名字：{this.props.name}</p>
                <p>我的性别：{this.props.sex}</p>
                <p>我的年龄：{this.props.age}</p>
                <p>我的父亲是：{this.props.father}</p>
            </div>
        )
    }
})

let info = {
    sex:'male',
    father:'狗爸'
}

ReactDOM.render(<Gouzi {...info} name={"大狗子"} age={26}/>,app)
```

2.父组件给子组件传入

父组件在嵌套子组件的时候为子组件传入，传入的方式和上面的方式一样

```
//父组件的render函数
render(){
    return (
        <div>
            <p>父组件：</p>
            <hr/>
            <Son name={'大狗子'}/>
            <Son name={'二狗子'}/>
        </div>
    )
}
```

3.子组件自己设置

子组件可以通过 getDefaultProps 来设置默认的属性

getDefaultProps 的值是函数，这个函数会返回一个对象，我们在这里对象里为组件设置默认属性

这种方式设置的属性优先级低，会被外部传入的属性值所覆盖

```
getDefaultProps:function () {
    console.log('getDefaultProps')
    return {
        name:'狗爸',
        sonname:'二狗子'
    }
},
//render
<p>我是{this.props.sonname}的父亲-{this.props.name}</p>
```

根据属性或状态，我们可以在 render 中的表达式里做一些逻辑判断，可以使用||、三元表达式、子执行函数等等

```
getName(){
    return this.props.name || '野狗子'
},
render:function () {
    let {name} = this.props
    return (
    <div>
        <p>我是子组件-{this.props.name || '野狗子'}</p>
        <p>我是子组件-{this.props.name?this.props.name:'野狗子'}</p>
        <p>我是子组件-{this.getName()}</p>
        <p>我是子组件-{(function (obj) {
            return obj.props.name || '野狗子'
        })(this)}</p>
    </div>
    )
}
```

##### 状态(state)

##### state

`state` 是组件的当前状态，可以把组件简单看成一个“状态机”，根据状态 `state` 呈现不同的 UI 展示。

一旦状态（数据）更改，组件就会自动调用 `render` 重新渲染 UI，这个更改的动作会通过 `this.setState`方法来触发。

state 修改规则

- 数组 使用 concat slice filter 这三个方法会返回新想数组、
- 字符串、数字、布尔值、null、undefined
- 状态的类型是普通对象（不包含字符串和数组） 使用 Object.assign() ,或者使用扩展运算符 （...）

##### 无状态组件

你也可以用纯粹的函数来定义无状态的组件(stateless function)，这种组件没有状态，没有生命周期，只是简单的接受 props 渲染生成 DOM 结构。无状态组件非常简单，开销很低，如果可能的话尽量使用无状态组件。比如使用箭头函数定义：

```javascript
const HelloMessage = props => <div> Hello {props.name}</div>;
render(<HelloMessage name="John" />, mountNode);
```

##### 生命周期

组件是一个构造器，每一次使用组件都相当于在实例化组件，在这个时候，组件就会经历一次生命周期，从实例化实例开始到这个实例销毁的时候，都是一次完整的生命周期

组件的生命周期，我们会分为三个阶段，初始化、运行中、销毁

##### 初始化阶段

1. 实例化组件之后，组件的 getDefaultProps 钩子函数会执行

   这个钩子函数的目的是为组件的实例挂载默认的属性

   这个钩子函数只会执行一次，也就是说，只在第一次实例化的时候执行，创建出所有实例共享的默认属性，后面再实例化的时候，不会执行 getDefaultProps，直接使用已有的共享的默认属性

   理论上来说，写成函数返回对象的方式，是为了防止实例共享，但是 react 专门为了让实例共享，只能让这个函数只执行一次

   组件间共享默认属性会减少内存空间的浪费，而且也不需要担心某一个实例更改属性后其他的实例也会更改的问题，因为组件不能自己更改属性，而且默认属性的优先级低。

2. 执行 getInitialState 为实例挂载初始状态，且每次实例化都会执行，也就是说，每一个组件实例都拥有自己独立的状态呢

3. 执行 componentWillMount，相当于 Vue 里的 created+beforeMount，这里是在渲染之前最后一次更改数据的机会，在这里更改的话是不会触发 render 的重新执行

   多做一些初始数据的获取

4. 执行 render，渲染 dom

5. 执行 componentDidMount ，相当于 Vue 里的 mounted,多用于操作真实 dom

##### 运行中阶段

当组件 mount 到页面中之后，就进入了运行中阶段，在这里有 5 个钩子函数，但是这 5 个函数只有在数据（属性、状态）发送改变的时候才会执行

1. componentWillReceiveProps

当父组件给子组件传入的属性改变的时候，子组件的这个函数才会执行

当执行的时候，函数接收的参数是子组件接收到的新参数，这个时候，新参数还没有同步到 this.props 上,多用于判断新属性和原有属性的变化后更改组件的状态

1. 接下来就会执行 shouldComponentUpdate,这个函数的作用：

   当属性或状态发送改变后控制组件是否要更新，提高性能,返回 true 就更新，否则不更新，默认返回 true

   接收 nextProp、nextState，根据根据新属性状态和原属性状态作出对比、判断后控制是否更新

2. componentWillUpdate,在这里，组件马上就要重新 render 了，多做一些准备工作，千万千万，不要在这里修改状态，否则会死循环
   相当于 Vue 中的 beforeUpdate

3. render，重新渲染 dom

4. componentDidUpdate，在这里，新的 dom 结构已经诞生了,相当于 Vue 里的 updated

##### 销毁阶段

当组件被销毁之前的一刹那，会触发 componentWillUnmount，临死前的挣扎

相当于 Vue 里的 beforeDestroy，所以说一般会做一些擦屁股的事情

为什么 Vue 中有 destroyed，而 react 却没有 componentDidUnmount

Vue 在调用\$destroy 方法的时候就会执行 beforeDestroy，然后组件被销毁，这个时候组件的 dom 结构还存在于页面结构中，也就说如果想要对残留的 dom 结构进行处理必须在 destroyed 处理，但是 react 执行完 componentWillUnmount 之后把事件、数据、dom 都全部处理掉了，所以根本不需要其他的钩子函数了

怎么样就算组件被销毁：

1. 当父组件从渲染这个子组件变成不渲染这个子组件的时候，子组件相当于被销毁
2. 调用 ReactDOM.unmountComponentAtNode(node) 方法来将某节点中的组件销毁

一个组件类由 `extends Component` 创建，并且提供一个 `render` 方法以及其他可选的生命周期函数、组件相关的事件或方法来定义

```javascript
import React, { Component } from "react";
import { render } from "react-dom";

class LikeButton extends Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  handleClick(e) {
    this.setState({ liked: !this.state.liked });
  }

  render() {
    const text = this.state.liked ? "like" : "haven't liked";
    return (
      <p onClick={this.handleClick.bind(this)}>
        You {text} this. Click to toggle.
      </p>
    );
  }
}

render(<LikeButton />, document.getElementById("example"));
```

组件的生命周期分为三个阶段：初始化、运行中、销毁

每个阶段都会有自己的钩子函数供我们在不同的情况下使用

组件是一个构造器，当我们在使用组件的时候其实是在实例化组件，在这个时候组件就会经历生命周期

```javascript
初始化;
var props_num = 1;
var state_num = 1;
var Hello = React.createClass({
  getDefaultProps() {
    //作用： 给组件设置默认的属性
    //特点： 不管实例化多少次组件，只执行一次！因为组件实例间的默认属性是可以共用的
    console.log("1. getDefaultProps");
    return { num: ++props_num };
  },
  getInitialState() {
    console.log("2. getInitialState");
    //作用： 给组件设置初始状态
    //特点：每一次都会执行，也就说会为每一个组件的时候都去挂载独立的状态
    return { num: ++state_num };
  },
  componentWillMount() {
    //created beforeMount
    console.log("3. componentWillMount");
    //在这个钩子函数可以更改状态并且不会触发rerender
    this.setState({ num: 10 });
    //注意，在vue中可以在created、beforeMount里进行初始数据的获取,但是在react中官方不推荐我们在componentWillMount里这么做，会有安全的问题
  },
  render() {
    //生成组件的虚拟dom结构
    console.log("4. render");
    return (
      <div>
        <p ref="myp">props_num: {this.props.num}</p>
        <p>state_num: {this.state.num} </p>
      </div>
    );
  },
  componentDidMount() {
    // mounted
    //在这里可以操作真实dom了, 并且可以做初始数据的获取
    this.refs.myp.style.color = "red";
    console.log("5.componentDidMount");
  }
});

ReactDOM.render(<Hello />, document.querySelector("#app"));
ReactDOM.render(<Hello />, document.querySelector("#app1"));
```

```javascript
运行中;
// 属性变化 componentWillReceiveProps -> shouldComponentUpdate
// 状态变化 shouldComponentUpdate ->
var Son = React.createClass({
  componentWillReceiveProps(props, state) {
    //在这里能得知属性的变化，去执行对应的操作
    // 比如： 当传入的属性变化后执行对应的数据的重新获取， 根据变化后的属性来更改状态
    //注意，在这里this.props上的属性还没有更新，如果需要最新的数据从参数中得到
    // console.log(this.props.hitnum, props.hitnum)
    if (props.hitnum === 4) {
      this.setState({ isHurt: true });
    }
    console.log("1. componentWillReceiveProps");
  },
  shouldComponentUpdate(props, state) {
    // 默认是return true， 如果写了话就必须返回
    // 控制组件是否重新渲染，提高性能
    console.log("2. shouldComponentUpdate");
    if (state.isHurt) return true;
    return false;
  },
  componentWillUpdate() {
    //beforeUpdate
    //没用,一般也就输出、测试一下
    console.log("3. componentWillUpdate");
  },
  getInitialState() {
    return { isHurt: false };
  },
  render() {
    console.log("4.render");
    return (
      <div>
        <p>我是儿子</p>
        <p>我的爸爸打了我 {this.props.hitnum} 下</p>
        <p>我 {this.state.isHurt ? "" : "不"} 疼</p>
      </div>
    );
  },
  componentDidUpdate() {
    // updated
    console.log("5. componentDidUpdate");
    //可以操作更改后的真实dom了
  }
});
```

##### getInitialState

初始化 `this.state` 的值，只在组件装载之前调用一次。

ES6 语法

```javascript
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
  }

  render() {
    // ...
  }
}
```

##### ref 标记

```javascript
 <p ref = "p"> Hello World </p>
 <p ref = { (el) => { this.pp = el } }> Hello World </p>
 推荐使用第二种方法

  componentDidMount () {
      //ref的标记官方推荐使用函数的方式，接收到要做标记的元素或者子组件，将其挂载this上
      this.refs.p.style.color = 'red'
      this.pp.style.color = 'pink'
  }
```

##### 事件处理

```javascript
import React, { Component } from "react";
import { render } from "react-dom";

class LikeButton extends Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  handleClick(e) {
    this.setState({ liked: !this.state.liked });
  }

  render() {
    const text = this.state.liked ? "like" : "haven't liked";
    return (
      <p onClick={this.handleClick.bind(this)}>
        You {text} this. Click to toggle.
      </p>
    );
  }
}

render(<LikeButton />, document.getElementById("example"));
```

可以看到 React 里面绑定事件的方式和在 HTML 中绑定事件类似，使用驼峰式命名指定要绑定的 `onClick`属性为组件定义的一个方法 `{this.handleClick.bind(this)}`。

注意要显式调用 `bind(this)` 将事件函数上下文绑定要组件实例上，这也是 React 推崇的原则：没有黑科技，尽量使用显式的容易理解的 JavaScript 代码

##### 原生事件

比如你在 `componentDidMount` 方法里面通过 `addEventListener` 绑定的事件就是浏览器原生事件。

使用原生事件的时候注意在 `componentWillUnmount` 解除绑定 `removeEventListener`。

所有通过 JSX 这种方式绑定的事件都是绑定到“合成事件”，除非你有特别的理由，建议总是用 React 的方式处理事件。

##### 参数传递

```javascript
render: function() {
    return <p onClick={this.handleClick.bind(this, 'extra param')}>;
},
handleClick: function(param, event) {
    // handle click
}
```

##### 父子组件通信

1. 父组件将自己的状态传递给子组件，子组件当做属性来接收，当父组件更改自己状态的时候，子组件接收到的属性就会发生改变（子组件可以在 componentWillReceiveProps, shouldComponentUpdate 根据 props 发生变化更新自己的 state）
2. 父组件利用 ref 对子组件做标记，通过调用子组件的方法以更改子组件的状态,也可以调用子组件的方法..

##### 子组件与父组件通信

父组件将自己的某个方法传递给子组件，在方法里可以做任意操作，比如可以更改状态，子组件通过 this.props 接收到父组件的方法后调用。

##### Mixins

Mixin 就是用来定义一些方法，使用这个 mixin 的组件能够自由的使用这些方法（就像在组件中定义的一样），所以 mixin 相当于组件的一个扩展，在 mixin 中也能定义“生命周期”方法。

##### context 传递(https://juejin.im/post/5be10e436fb9a04a053f21f5#heading-6)

以下 3 种方式都可以

```js
const ThemeContext = React.createContext("theme");

const B = props => {
  return (
    <div>
      <ThemeContext.Consumer>
        {theme => <h4>这里是B组件 -- {theme}</h4>}
      </ThemeContext.Consumer>
    </div>
  );
};
const A = props => {
  return (
    <div>
      <h2>这里是A组件</h2>
      <hr />
      <B />
    </div>
  );
};
class Mine extends Component {
  state = {
    theme: "primary"
  };
  render() {
    let { theme } = this.state;
    return (
      <div className="app-mine">
        <ThemeContext.Provider value={theme}>
          Mine
          <A theme={theme} />
        </ThemeContext.Provider>
        <AppNav />
      </div>
    );
  }
}
```

```js
class B extends Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div>
        <h4>这里是B组件 -- {this.context}</h4>
      </div>
    );
  }
}
const A = props => {
  return (
    <div>
      <h2>这里是A组件</h2>
      <hr />
      <B />
    </div>
  );
};
class Mine extends Component {
  state = {
    theme: "primary"
  };

  // componentWillMount () {
  //     //在即将渲染Mine的时候去判断是否登录
  //     if ( !this.store.getState().user_info ) {
  //         this.props.history.push('/login')
  //     }
  // }

  render() {
    let { theme } = this.state;
    return (
      <div className="app-mine">
        <ThemeContext.Provider value={theme}>
          Mine
          <A theme={theme} />
        </ThemeContext.Provider>

        <AppNav />
      </div>
    );
  }
}
```

```JS
class Mine extends React.Component {
  state = {
    theme: 'primary',
  };
  getChildContext() {
    return { theme: this.state.theme };
  }
  render() {
    return (
      <div className="app-mine">
        mine
        <A />
      </div>
    );
  }
}

Mine.childContextTypes = {
  theme: PropsTypes.string,
};



const A = () => {
  return (
    <div>
      <h2>这里是A组件</h2>
      <hr />
      <B />
    </div>
  );
};

export default A;

class B extends React.Component {
  render() {
    console.log(this.context);
    const { theme } = this.context;
    return <h4>这里是B组件 -- {theme}</h4>;
  }
}
B.contextTypes = {
  theme: PropsTypes.string,
};
export default B;

```

#### React Router

```javascript
JSX;
React.render(
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
    </Route>
  </Router>,
  document.body
);
对象;

const routes = {
  path: "/",
  component: App,
  childRoutes: [
    { path: "about", component: About },
    { path: "inbox", component: Inbox }
  ]
};

React.render(<Router routes={routes} />, document.body);
```

##### 路由配置

```javascript
import React from "react";
import { Router, Route, Link } from "react-router";

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/inbox">Inbox</Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
});

const About = React.createClass({
  render() {
    return <h3>About</h3>;
  }
});

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.children || "Welcome to your Inbox"}
      </div>
    );
  }
});

const Message = React.createClass({
  render() {
    return <h3>Message {this.props.params.id}</h3>;
  }
});

React.render(
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>,
  document.body
);
```

##### 添加首页

I 想象一下当 URL 为 `/` 时，我们想渲染一个在 `App` 中的组件。不过在此时，`App` 的 `render` 中的 `this.props.children` 还是 `undefined`。这种情况我们可以使用 [`IndexRoute`](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/API.md#indexroute) 来设置一个默认页面。

```js
mport { IndexRoute } from 'react-router'

const Dashboard = React.createClass({
  render() {
    return <div>Welcome to the app!</div>
  }
})

React.render((
  <Router>
    <Route path="/" component={App}>
      {/* 当 url 为/时渲染 Dashboard */}
      <IndexRoute component={Dashboard} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>
), document.body)
```

| URL                   | 组件                      |
| --------------------- | ------------------------- |
| `/`                   | `App -> Dashboard`        |
| `/about`              | `App -> About`            |
| `/inbox`              | `App -> Inbox`            |
| `/inbox/messages/:id` | `App -> Inbox -> Message` |

##### 让 UI 从 URL 中解耦出来

如果我们可以将 `/inbox` 从 `/inbox/messages/:id` 中去除，并且还能够让 `Message` 嵌套在 `App -> Inbox` 中渲染，那会非常赞。绝对路径可以让我们做到这一点。

```js
React.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        {/* 使用 /messages/:id 替换 messages/:id */}
        <Route path="/messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>,
  document.body
);
```

我们现在的 URL 对应关系如下：

| URL             | 组件                      |
| --------------- | ------------------------- |
| `/`             | `App -> Dashboard`        |
| `/about`        | `App -> About`            |
| `/inbox`        | `App -> Inbox`            |
| `/messages/:id` | `App -> Inbox -> Message` |

**提醒**：绝对路径可能在[动态路由](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/guides/advanced/DynamicRouting.md)中无法使用。

##### 重定向

现在任何人访问 `/inbox/messages/5` 都会看到一个错误页面。:(

从定向页面

```js
import { Redirect } from "react-router";

React.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="/messages/:id" component={Message} />

        {/* 跳转 /inbox/messages/:id 到 /messages/:id */}
        <Redirect from="messages/:id" to="/messages/:id" />
      </Route>
    </Route>
  </Router>,
  document.body
);
```

##### 路由守卫，类似于 vue 的 beforeRouter

在路由跳转过程中，[`onLeave` hook](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#leavehook) 会在所有将离开的路由中触发，从最下层的子路由开始直到最外层父路由结束。然后[`onEnter` hook](http://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#enterhook)会从最外层的父路由开始直到最下层子路由结束。

可以在跟组件的 componentWillReceiveProps 查看路由跳转情况起到 onEnter 的作用

```js
 componentWillReceiveProps (props) {
    console.log('全局路由监听：pathname:'+ props.location.pathname )
  }
```

##### 跳转前确认

eact Router 提供一个 [`routerWillLeave` 生命周期钩子](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/Glossary.md#routehook)，这使得 React [组件](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/Glossary.md#component)可以拦截正在发生的跳转，或在离开 [route](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/Glossary.md#route) 前提示用户。[`routerWillLeave`](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/API.md#routerwillleavenextlocation) 返回值有以下两种：

1. `return false` 取消此次跳转
2. `return` 返回提示信息，在离开 route 前提示用户进行确认。

你可以在 [route 组件](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/Glossary.md#routecomponent) 中引入 `Lifecycle` mixin 来安装这个钩子。

```js
import { Lifecycle } from "react-router";

const Home = React.createClass({
  // 假设 Home 是一个 route 组件，它可能会使用
  // Lifecycle mixin 去获得一个 routerWillLeave 方法。
  mixins: [Lifecycle],

  routerWillLeave(nextLocation) {
    if (!this.state.isSaved)
      return "Your work is not saved! Are you sure you want to leave?";
  }

  // ...
});
```

如果你在组件中使用了 ES6 类，你可以借助 [react-mixin](https://github.com/brigand/react-mixin) 包将 `Lifecycle` mixin 添加到组件中，不过我们推荐使用 `React.createClass` 来创建组件，初始化路由的生命周期钩子函数。

如果你想在一个深层嵌套的组件中使用 [`routerWillLeave`](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/API.md#routerwillleavenextlocation) 钩子，只需在 [route 组件](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/Glossary.md#routecomponent) 中引入 [`RouteContext`](http://react-guide.github.io/react-router-cn/docs/guides/advanced/docs/API.md#routecontext-mixin)mixin，这样就会把 `route` 放到 context 中。

```js
import { Lifecycle, RouteContext } from "react-router";

const Home = React.createClass({
  // route 会被放到 Home 和它子组件及孙子组件的 context 中，
  // 这样在层级树中 Home 及其所有子组件都可以拿到 route。
  mixins: [RouteContext],

  render() {
    return <NestedForm />;
  }
});

const NestedForm = React.createClass({
  // 后代组件使用 Lifecycle mixin 获得
  // 一个 routerWillLeave 的方法。
  mixins: [Lifecycle],

  routerWillLeave(nextLocation) {
    if (!this.state.isSaved)
      return "Your work is not saved! Are you sure you want to leave?";
  }

  // ...
});
```

#### redux(https://www.redux.org.cn/docs/introduction/CoreConcepts.html)

redux 的流程：

1.store 通过 reducer 创建了初始状态
2.view 通过 store.getState()获取到了 store 中保存的 state 挂载在了自己的状态上 3.用户产生了操作，调用了 actions 的方法
4.actions 的方法被调用，创建了带有标示性信息的 action
5.actions 将 action 通过调用 store.dispatch 方法发送到了 reducer 中
6.reducer 接收到 action 并根据标识信息判断之后返回了新的 state
7.store 的 state 被 reducer 更改为新 state 的时候，store.subscribe 方法里的回调函数会执行，此时就可以通知 view 去重新获取 state

##### 三个基本原则

- 整个应用只有唯一一个可信数据源，也就是只有一个 Store
- State 只能通过触发 Action 来更改
- State 的更改必须写成纯函数，也就是每次更改总是返回一个新的 State，在 Redux 里这种函数称为 Reducer

##### Action

Action 很简单，就是一个单纯的包含 `{ type, payload }` 的对象，`type` 是一个常量用来标示动作类型，`payload` 是这个动作携带的数据。Action 需要通过 `store.dispatch()` 方法来发送。

```js
import { CHANGE_USER_INFO } from "./const";
const actionCreator = {
  login(username) {
    let action = {
      type: CHANGE_USER_INFO,
      username
    };
    return action;
  }
};

export default actionCreator;
```

如果有异步

```js
const actionCreator = {
  // addNewTodo (title) {//同步方法直接返回的
  //   let action ={
  //     type:ADD_NEW_TODO,
  //     title
  //   }
  //   return action
  // }
  addNewTodo(title) {
    return dispatch => {
      backend.saveTitle(title).then(res => {
        let action = { type: ADD_NEW_TODO, title: title + Date.now() };
        dispatch(action);
      });
    };
  }
};

export default actionCreator;
```

##### Reduce

reducer 是一个纯函数，能接受到当前的状态，以及 action，返回一个新状态就代表着 store 中的 state 改变了,

不能调用不纯的函数，例如`Data.now()` `Math.random()`

```js
const reducer = (previousState = state, action) => {
  let new_state = { ...previousState };

  switch (action.type) {
    case CHANGE_USER_INFO:
      new_state.user_info = { username: action.username };
      break;

    default:
      break;
  }

  return new_state;
};
```

##### reducer 划分

```js
import { createStore, applyMiddleware } from "redux";

import thunk from "redux-thunk";

import reducer from "./reducer";

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
```

```js
import { combineReducers } from "redux";
import todolist from "./todolist"; // 是一个单独reducer，里面有action,state,reducer
const reducer = combineReducers({
  todolist
});
export default reducer;
```

##### store

- Hold 住整个应用的 State 状态树
- 提供一个 `getState()` 方法获取 State
- 提供一个 `dispatch()` 方法发送 action 更改 State
- 提供一个 `subscribe()` 方法注册回调函数监听 State 的更改

```js
import { createStore } from "redux";
import reducer from "./reducer";
const store = createStore(reducer);
export default store;
```

使用 store.dispatch 分发 action

```js
let action = actionCreator.login("二狗子");
this.store.dispatch(action);

或者;
store.dispatch({ type: "CHANGE_B", payload: "Modified b" });
```

//store.subscribe 方法中传入的函数会等到 store 中状态改变的时候执行

```js
componentWillMount () {
      console.log(1)
        //store.subscribe方法中传入的函数会等到store中状态改变的时候执行
        this.store.subscribe(() => {
            if ( this.store.getState().user_info ) {
                this.props.history.go(-1)
            }
        })
    }
```

#### redux-saga

`redux-saga` 是一个 redux 中间件，意味着这个线程可以通过正常的 redux action 从主应用程序启动，暂停和取消，它能访问完整的 redux state，也可以 dispatch redux action。

#### react-redux(https://github.com/rackt/react-redux)

#### 插件

##### react-document-title

因为 react 是单页应用，所以我们可能需要根据不同的路由改变文档的 title;react-document-title 组件可以实现

```js
import DocumentTitle from "react-document-title";

var App = React.createClass({
  render: function() {
    // Use "My Web App" if no child overrides this
    return (
      <DocumentTitle title="My Web App">
        <this.props.activeRouteHandler />
      </DocumentTitle>
    );
  }
});

var HomePage = React.createClass({
  render: function() {
    // Use "Home" while this component is mounted
    return (
      <DocumentTitle title="Home">
        <h1>Home, sweet home.</h1>
      </DocumentTitle>
    );
  }
});

var NewArticlePage = React.createClass({
  mixins: [LinkStateMixin],

  render: function() {
    // Update using value from state while this component is mounted
    return (
      <DocumentTitle title={this.state.title || "Untitled"}>
        <div>
          <h1>New Article</h1>
          <input valueLink={this.linkState("title")} />
        </div>
      </DocumentTitle>
    );
  }
});
```

##### memoize-one（https://segmentfault.com/a/1190000015301672）

使用 React 开发的时候，我们请求服务器拿回来一个复杂的数据，我们在 render 里去处理这个数据，但是 state 和 props 频繁修改会触发 render，每次触发 render，数据都要去处理一次，每次处理都是对性能的损耗

例如： 找出大于 18 岁的人

```js
class Example extends Component {
    ...
    render() {
        const { dataList } = this.props;
        const newDataList = dataList.filter((item) => item.age > 18);
        return (
            <div>
                {newDataList.map((item, i) =>
                    <p key={i}>{item.name}:{item.age}岁</p>
                )}
            </div>
        )
    }
    ...
}
```

从例子中我们看到 render 中我们处理数据，但是每次 state 和 props 的修改都会触发 render，都会去处理数据 dataList，生成新的数据 newDataList，每次处理都是对性能的损耗！

memoize-one 官方案例

```js
import memoizeOne from "memoize-one";

const add = (a, b) => a + b;
const memoizedAdd = memoizeOne(add);

memoizedAdd(1, 2); // 3

memoizedAdd(1, 2); // 3
// Add 函数并没有执行: 前一次执行的结果被返回

memoizedAdd(2, 3); // 5
// Add 函数再次被调用，返回一个新的结果

memoizedAdd(2, 3); // 5
// Add 函数并没有执行: 前一次执行的结果被返回

memoizedAdd(1, 2); // 3
// Add 函数再次被调用，返回一个新的结果
```

我们可以发现连续两次相同传参，第二次会直接返回上次的结果，每次传参不一样，就直接调用函数返回新的结果，会丢失之前的记录，并不是完全记忆，这也是个不足点！

```js
import memoize from "memoize-one";

class Example extends Component {
    ...
    filter = memoize((dataList, age) => dataList.filter((item) => item.age > age))
    render() {
        const { dataList } = this.props;
        const newDataList = this.filter(dataList, 18)
        return (
            <div>
                ...
                {newDataList.map((item, i) =>
                    <p key={i}>{item.name}:{item.age}岁</p>
                )}
                ...
            </div>
        )
    }
    ...
}
```

#### 高阶组件

- ##### 高阶组件示例

  ```js
  // 封装高阶组件
  import React from "react";

  function GetToken(Component) {
    return class extends React.PureComponent {
      // constructor(props) {
      //   super(props);
      //   this.state = {
      //     token: '',
      //   };
      // }
      componentWillMount() {
        const token = localStorage.getItem("token");
        this.setState({ token });
      }
      render() {
        return <Component token={this.state.token} {...this.props} />;
      }
    };
  }

  export default GetToken;
  ```

// 调用高阶组件
class PostItem extends React.Component {
constructor(props) {
super(props);
this.state = {
posts: {},
};
}

    handle = () => {
      this.props.onVote(this.props.post.id);
    };

    render() {
      const { post } = this.props;
      console.log(this.props);
      return (
        <li>
          <div>创建人：{post.author}</div>
          <div>创建时间： {post.data}</div>
          <div>{post.title}</div>
          <div>
            <button onClick={this.handle}>点赞</button>
            <span>{post.vote}</span>
            <span>token: {this.props.token}</span>
          </div>
        </li>
      );
    }

}

export default GetToken(PostItem);

```

- 使用场景

- 操纵 props
  - 优先拦截 props，进行处理
- 通过 ref 访问组件实例
- 组件状态提升
  - 将受控组件需要管理的状态和方法统一提得到高阶组件中，统一维护
  - 包装组件的状态和相应的状态处理方法提升到高阶组件自身内部实现包装组件的无状态化
- 用其他元素包装组件
  - 渲染时增加额外的元素，通常来增加布局或者修改样式

#### React Router
```
