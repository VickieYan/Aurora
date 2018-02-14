# 《深入浅出React和Redux》
之前学了一天React和一天Redux就开始写项目，项目过程中各种用法天马行空，全凭想象。为了在下次项目中不把小伙伴逼疯，利用这年前的闲暇读一波正常向的React以及Redux的用法。不过向来对这“深入浅出”颇为质疑，往往只有深入，没有浅出，希望这次能够走出“深入浅出”的阴影。

# 关键字
* React判断一个元素是HTML元素还是React组件的原则就是看第一个字母是否大写
* UI = render(data)
* 响应式编程(Reactive Programming)
* Render是一个纯函数
* prop是组件对外接口，state是组件内部状态
* babel-react-optimize可以去掉产品代码中的propTypes
* 单向数据流
* Redux = Reducer + Flux
* reselector
* 谨慎使用ref(直接接触DOM),也尽量让ref不要跨越组件的边界。
* bindActionCreators
* webpack的loader中使用 extract-text-webpack-plugin可以让CSS单独一个文件

# React生命周期
### 装载过程
* constructor
* getInitialState
* getDefaultProps
* componentWillMount(不用)
* render
* componentDidMount

通常不定义componentWillMount，不会引起重绘

### 更新过程
* componentWillReceiveProps(nextProps)
* shouldComponentUpdate(重要)
* componentWillUpdate
* render
* componentDidUpdate

### 卸载过程
* componentWillUnmount(请理性工作)

# Redux
### 基本原则
* 唯一数据源
* 保持状态只读
* 数据改变只通过纯函数完成

# 组织文件方式
### 按功能组织
todoList/
    action.js
    actionTypes.js
    index.js
    reducer.js
    views/
        component.js
        container.js
```javascript
import * as actions from './actions.js'
import reducer from './reducer.js'
import view from './views/container.js'

export { actions, reducer, view }
```

# 状态树的设计
### 原则
* 一个模块控制一个状态节点
* 避免冗余数据
* 树状结构扁平

>传统的关系型数据库中，对诗句结构的的各种“范式化”，其实就是在去除数据的冗余。而近年风生水起的NoSQL运动，提倡的就是在数据存储中“去范式化”，对数据结构的处理和关系型数据库正好相反，利用数据的冗余来减少读取数据库时的数据关联工作。

# 工具
* React Devtools
* Redux Devtools
* React Perf
* redux-immutable-state-invariant(检查reducer是否为纯函数)
* UglifyJsPlugin(不修改全局变量 如window)

# React组件的性能优化
### 单个React组件的性能优化
