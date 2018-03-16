# 《JavaScript设计模式与开发实践》
设计模式：在面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。

设计模式在很多时候都体现了语言的不足之处，设计模式是对语言不足的补充。
## 基础知识
### 面向对象的JavaScript
#### 静态和动态语言
##### 静态类型语言
定义：编译时已确定变量的类型

优点：
* 编译时就能发现类型不匹配的错误
* 明确规定了数据类型，编译器针对这些信息对程序进行了优化，提高程序执行速度

缺点：
* 迫使程序员依照强契约来编写程序，增加更多的代码

##### 动态类型语言
定义：程序运行时，待变量被赋予某个值之后，才会具有某种类型

优点：
* 编写的的代码数量较少，看起来更加简洁
* 精力放在业务逻辑上

缺点：
* 无法保证变量类型，运行期可能发生类型相关的错误

#### 鸭子类型（duck typing）
鸭子类型知道我们只关注对象的行为，而不关注对象本身

#### 多态、继承、封装
* 由于JavaScript不存在类型检查，所以它自带多态
```javascript
// 结合闭包和Symbol实现私有属性
const People = (function() {
  const name = Symbol("name")
  class People {
    constructor(n) { 
        this[name] = n
    }
    sayName() {
        console.log(this[name])
    }
  }
  return People
})()
```

#### 原型模式
原型模式是通过克隆来创建对象的
```javascript
    const Plane = function() {
        this.blood = 100
        this.attackLevel = 1
        this.defenseLevel = 1
    }
    const plane = new Plane()
    plane.blood = 500
    plane.attackLevel = 10
    plane.defenseLevel = 7
    const clonePlane = Object.create(plane)
    console.log(clonePlane.blood) //500
    console.log(clonePlane.attackLevel) //10
    console.log(clonePlane.defenseLevel) //7
```

#### new的过程
```javascript
function Person(name) {
    this.name = name
}

Person.prototype.getName = function() {
    return this.name
}

// new的过程相当于调用了下述构造器
const objectFatory = function() {
    const obj = new Object() // step1 创建一个对象
    const Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype //step2 将构造函数作用域复制给新对象并执行原型链连接
    const ret = Constructor.apply(obj, arguments) //step3 执行构造函数中的代码
    return typeof ret === 'object' ? ret : obj //step4 返回对象
}

```

#### 对象会记住它的原型
JavaScript给对象提供了一个名为__proto__的隐藏属性，某个对象的__proto__属性默认会指向构造器的原型对象。

### this、call和apply
#### this的指向
* 对象的方法调用 this指向该对象
* 普通函数调用 this指向全局对象window
* 构造器调用 this指向返回的对象
* Funtion.prototype.call或Function.prototype.apply 动态传入this

#### this的丢失
为了简化代码，我们尝试以下的操作
```javascript
const getId = document.getElementById
getId('box')
```
我们会发现通过上述方法是不能拿到box这个DOM节点的，因为在大多数浏览器的getElementById这个方法中，都是存在对this的引用的。我们在上述的做法中，相当于直接调用了该方法，this指向全局对象，这个现象就是this的丢失。

为了防止this的丢失，我们对document.getElementById这个方法做了如下改进：
```javascript
document.getElementById = (function(func) {
    return function() {
        return func.apply(document, arguments)
    }
})(document.getElementById)
```
理清这个函数的思路，归根结底就是在每次调用document.getElementById这个函数时将函数内的this指向document。

#### call和apply的区别
这个话题是老生常谈，肯定不止在这一本书里见过。他们的作用一模一样，只是传入的参数形式有别。
* func.apply(null, [1,2,3])
* func.call(null,1,2,3)

### bind
我们来手动实现一个bind方法
```javascript
Function.prototype.bind = function(context) {
    const self = this // 保存原函数
    return function() {
        return self.apply(context, arguments)
    }
}
```

#### call和apply的用处
* 改变this
* 借用方法 经常使用Array.prototype上的方法

### 闭包和高阶函数



## 设计模式
### 单例模式
### 策略模式
### 代理模式
### 迭代器模式
### 发布-订阅模式
### 命令模式
### 组合模式
### 模板方法模式
### 享元模式
### 职责链模式
### 中介者模式
### 装饰者模式
### 状态模式
### 适配器模式



## 设计原则和编程技巧
### 单一职责原则
### 最少知识原则
### 开放-封闭原则
### 接口和面向接口编程
### 代码重构
