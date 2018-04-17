# 《深入浅出 React 和 Redux》

之前学了一天 React 和一天 Redux 就开始写项目，项目过程中各种用法天马行空，全凭想象。为了在下次项目中不把小伙伴逼疯，利用这年前的闲暇读一波正常向的 React 以及 Redux 的用法。不过向来对这“深入浅出”颇为质疑，往往只有深入，没有浅出，希望这次能够走出“深入浅出”的阴影。

噗 之前看了一半搁置了太久，于是决定学习 React Native 之余重新梳理一下这本书。

---

## React 新的前端思维方式

### 初始化一个 React 项目

*   create-react-app
*   手工配置 Webpack

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

*   高内聚(High Cohesion)
*   低耦合(Low Coupling)

### React 组件的数据

对外用 prop,对内用 state

```jsx
<SampleBUtton
    id="sample"
    borderWicth={2}
    onClick={onButtonClick}
    style={{ color: 'red' }}
/>
```

```jsx
const ControlPanel = () => (
    <div>
        <Conter cation="First" initValue={0} />
        <Conter cation="Second" initValue={10} />
        <Conter cation="Third" initValue={20} />
    </div>
)
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

*   prop 用于定义外部接口，state 用于记录内部状态
*   prop 的赋值在外部世界使用组件时，state 的复制在组件内部
*   组件不应该改变 prop 值，而 state 存在的目的就是让组件来改变

### 组件的生命周期

#### 装载过程

*   constructor

1.  初始化 state
2.  绑定函数的 this 环境

```
一种较新的绑定语法
this.foo = ::this.foo
```

*   getInitialState
*   getDefaultProps

使用 es6 语法时这个函数不会产生作用

*   componentWillMount

我们通常不定义该函数，因为这时调用 this.setState 不会引起任何重绘。

*   render
*   componentDidMount

    如果需要配合 Jquery 等 UI 库时可在该生命周期执行。

函数执行循序如下

```
enter componentWillMount First
enter render First
enter componentWillMount Second
enter render Second
enter componentWillMount Third
enter render Third
enter componentDidMount First
enter componentDidMount Second
enter componentDidMount Third
```

render 函数本身并不往 DOM 树上渲染或者装载内容，它只是返回一个 JSX 对象，然后由 React 库来根据返回对象绝对如何渲染。

componentWillMount 可以在服务端调用，componentDidMount 只能在客户端调用。

#### 更新过程

*   componentWillReceiveProps(nextProps)

    只要是父组件的 render 函数被调用，在 render 函数里面被渲染的子组件就会经历更新过程。

*   shouldComponentUpdate(nextProps, nextState)

默认返回 true，需要重新渲染时返回 ture,不需要时返回 false.

避免不必要的重新渲染，大大提升性能。

#### 卸载过程

*   componentWillUnmount

这个函数适合做一些清理工作

### 组件向外传递数据

在 props 上定义处理函数

### React 组件 state 和 prop 的局限

如何保证数据一致性

## 从 Flux 到 Redux

### Flux

Flux 以替换 Backbone.js、Ember.js 等 MVC 一族为目的。

#### MVC 框架的缺陷

*   Model 负责管理数据，大部分业务逻辑也应该放在 Model 中
*   View 负责渲染用户界面，应该避免在 View 中涉及业务逻辑
*   Controller 负责接受用户输入，根据用户输入调用对应 Model 逻辑，并把数据结果交给 View。

MVC 框架
![MVC框架](http://m.qpic.cn/psb?/V10ZHE9M4DB6nN/Md6ucSW5tklugO0c9EKOLIlZOLBdkPPs6Ds*Vn5cTPk!/b/dAgBAAAAAAAA&bo=7AEvAewBLwEDCSw!&rf=viewer_4)

在 MVC 框架中，让 View 和 Model 直接对话简直是灾难。

Flux 特点：更严格的数据流控制。

Flux 框架
![Flux框架](http://m.qpic.cn/psb?/V10ZHE9M4DB6nN/drX.OquFYn7ECand6tKe8X2HAlwIFKYt8zW3RlXE*bk!/b/dAgBAAAAAAAA&bo=QALIAEACyAADCSw!&rf=viewer_4)

*   Dispatcher 处理动作分发，维持 Store 之间的依赖关系
*   Store 负责存储数据和处理数据相关逻辑
*   Action 驱动 Dispatcher 和 JavaScript 对象
*   View 视图部分，负责显示用户界面

#### Flux 应用

1.  Dispatcher

Dispatcher 存在的作用，就是用来派发 action

```jsx
// AppDispatcher.js
import { Dispatcher } from 'flux'

export default new Dispatcher()
```

2.  action

```jsx
// ActionTypes.js
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'
```

```jsx
// Action.js
import * as ActionTypes from './ActionTypes.js'
import AppDispatcher from './AppDispatcher.js'

export const increment = counterCaption => {
    AppDispatcher.dispatch({
        type: AtionType.INCREMENT,
        counterCaption: counterCaption,
    })
}

export const decrement = counterCaption => {
    AppDispatcher.dispatch({
        type: AtionType.DECREMENT,
        counterCaption: counterCaption,
    })
}
```

3.  Store

```jsx
// CounterStore.js
import AppDispatcher from 'AppDispatcher.js'
import * as ActionTypes from './ActionTypes.js'
const counterValues = {
    First: 0,
    Second: 10,
    Third: 30,
}

const CounterStore = Object.assign({}, EventEmitter.prototype, {
    getConterValues: function() {
        return conterValues
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT)
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback)
    },
})
CounterStore.dispatchToken = AppDispatcher.register(action => {
    if (action.type === AtionType.INCREMENT) {
        counterValues[action.counterCaption]++, CounterStore.emitChange()
    } else if (action.type === AtionType.DECREMENT) {
        counterValues[action.counterCaption]--, CounterStore.emitChange()
    }
})
```

```jsx
// SummaryStore.js
const SummaryStore = Object.assign({}, EventEmitter.prototype, {
    getConterValues: function() {
        return conterValues
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT)
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback)
    },
    getSummary: function() {
        return computeSummary(CounterStore.getCounterValues)
    },
})

function computeSummary(counterValue) {
    let summary = 0
    for (const key in counterValues) {
        if (counterValues.hasOwnProperty(key)) {
            summary += counterValues[key]
        }
    }
    return summary
}

SummaryStore.dispatchToken = AppDispatcher.register(action => {
    if (
        action.type === ActionTypes.INCREMENT ||
        action.type === ActionTypes.DECREMENT
    ) {
        AppDispatcher.waitFor([CounterStore.dispatchToken])
        SummaryStore.emitChange()
    }
})
```

4.  View

```jsx
contructor(props) {
  super(props)
  this.state = {
    count: CounterStore.getCounterValues()[props.caption]
  }
  this.onClickIncrementButton = this.onClickIncrementButton.bind(this)
  this.onClickDecrementButton = this.onClickDecrementButton.bind(this)
}

componentDidMount() {
  CounterStore.addChangeListener(this.onChange)
}

componentWillUnmount() {
  CounterStore.removeChangeListener(this.onChange)
}

onChange() {
  const newCount = CounterStore.getCounterValues()[this.props.caption]
  this.setState({
    count: newCount
  })
}

onClickIncrementButton() {
  Actions.increment(this.props.caption)
}

onClickDecrementButton() {
  Actions.decrement(this.props.caption)
}


render() {
  const { caption } = this.props
  return(
    <div>
      <button onClick={this.onClickIncrementButton}>+</button>
      <button onClick={this.onClickDecrementButton}>-</button>
      <span>{caption} count: {this.state.count}</span>
    </div>
  )
}
```

#### Flux 的优势

“单项数据流”的管理方式。

在这种规矩之下，想要追溯一个应用的逻辑就变得非常容易。

#### Flux 的不足

*   Store 之间的依赖关系

两个 Store 之间有逻辑依赖关系，就必须用上 Dispatcher 的 waitFor 函数

*   难以进行服务端渲染
*   Store 混杂了逻辑和状态

## 模块化 React 和 Redux 应用

## React 组件的性能优化

## React 高级组件

## Redux 和服务器通信

## 单元测试

## 扩展 Redux

## 多页面应用

## 同构
