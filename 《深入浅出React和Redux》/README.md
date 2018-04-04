# 《深入浅出 React 和 Redux》

之前学了一天 React 和一天 Redux 就开始写项目，项目过程中各种用法天马行空，全凭想象。为了在下次项目中不把小伙伴逼疯，利用这年前的闲暇读一波正常向的 React 以及 Redux 的用法。不过向来对这“深入浅出”颇为质疑，往往只有深入，没有浅出，希望这次能够走出“深入浅出”的阴影。

噗 之前看了一半搁置了太久，于是决定学习 React Native 之余重新梳理一下这本书。

---

## React 新的前端思维方式

### 初始化一个 React 项目

* create-react-app
* 手工配置 Webpack

### 增加一个新的 React 组件

组件：完成某个特定功能的独立的、可重用的代码。

```jsx
// clickCouter
class ClickCouter extends Component {
    constructor(props) {
        super(props)
        this.state = { count: 0 }
    }

    @autobind
    onClickButton() {
        this.setState(prevState => {
            count: prevState.count + 1
        })
    }

    render() (
        <div>
            <button>Click me</button>
            <div>Click Count: </div>
        </div>
    )
}
```

在 React 出现之初，使用的是 React.createClass 方法来创造组件类，这种方法已经被废弃了。

在 JSX 代码的文件中，即使代码中并没有直接使用 React，也一定要导入 React，这是因为 JSX 最终会被转译成依赖于 React 的表达式

### 分解 React 应用

```
npm run eject
```

eject: 把隐藏在 react-scripts 中的一系列技术栈配置都弹射到应用的顶层，该操作是不可逆的。

### React 的工作方式

UI = render(data)

#### Virtual DOM

Web 前端开发关于性能优化有一个原则：尽量减少 DOM 操作。

Virtual DOM 是对 DOM 树的抽象，不会触及浏览器的部分，只是存在于 JavaScript 空间的树形结构。每次自上而下渲染 React 组件时，会对比这一次产生的 Virtual DOM 和上一次渲染的 Virtual DOM，对比就会发现差别，然后修改真正的 DOM 树时就只需要触及差别中的部分。

---

## 设计高质量的 React 组件

### 易于维护的组件的设计要素

* 高内聚(High Cohesion)
* 低耦合(Low Coupling)

### React 组件的数据

对外用 prop,对内用 state

```jsx
<SampleBUtton
  id="sample"
  borderWicth={2}
  onClick={onButtonClick}
  style={{ color: "red" }}
/>
```

```jsx
const ControlPanel = () => (
  <div>
    <Conter cation="First" initValue={0} />
    <Conter cation="Second" initValue={10} />
    <Conter cation="Third" initValue={20} />
  </div>
);
```

```jsx
class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
        count: props.initValue
    }
  }

  @autobind
  onClickIncrementButton() {
      this.setState(prevState => {
          count: prevState + 1
      })
  }

  @autobind
  onClickDecrementButton() {
      this.setState(prevState => {
          count: prevState - 1
      })
  }

  render() {
    const { caption } = this.props;
    return (
      <div>
        <button onClick={this.onClickIncrementButton}>+</button>
        <button onClick={this.onClickDecrementButton}>-<button>
        <span>{caption} count: {this.state.count}</span>
      </div>
    )
  }
}

Counter.propTypes = {
    caption: PropTypes.string.isRequired
    initValue: PropTypes.number
}

Counter.defaultProps = {
    initValue: 0
}
```

#### props 和 state 的区别

* prop 用于定义外部接口，state 用于记录内部状态
* prop 的赋值在外部世界使用组件时，state 的复制在组件内部
* 组件不应该改变 prop 值，而 state 存在的目的就是让组件来改变

### 组件的生命周期

#### 装载过程

* constructor

1.  初始化 state
2.  绑定函数的 this 环境

```
一种较新的绑定语法
this.foo = ::this.foo
```

* getInitialState
* getDefaultProps

使用 es6 语法时这个函数不会产生作用

* componentWillMount
* render
* componentDidMount

## 从 Flux 到 Redux

## 模块化 React 和 Redux 应用

## React 组件的性能优化

## React 高级组件

## Redux 和服务器通信

## 单元测试

## 扩展 Redux

## 多页面应用

## 同构
