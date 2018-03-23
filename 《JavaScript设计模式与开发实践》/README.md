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

const p = objectFatory(Person, 'Vickie')

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
#### 什么是函数式编程
这里引用一下阮一峰博客里面的解释。我们来实现一个数学表达式：(1+2)*3-4
```javascript
// 传统的过程式编程
const a = 1 + 2
const b = a * 3
const c = b - 4

//函数式编程要求使用函数
const result = subtract(multiply(add(1, 2), 3), 4)
```

#### 闭包的经典应用
```html
<html>
    <body>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
    <script>
        const nodes = document.getElementByTagName('div')
        const len = nodes.length
        for(let i = 0; i < len; i++) {
            (function(i){
                nodes[i].onclick = function() {
                    alert(i)
                }
            })(i)
        }
    </script>
    </body>
</html>
```
#### 闭包的作用
##### 封装变量
```javascript
// 为了不把cache暴露在全局作用域下，我们做如下操作
const mult = (function() {
    const cache = {}
    const calculate = function() {
        return Array.prototype.slice.call(arguments).reduce((accumulator, currentValue) => accumulator * currentValue)
    }

    return function() {
        const args = Array.prototype.join.call(arguments, ',')
        if(args in cache) {
            return cache[args]
        }
        return cache[args] = calculate.apply(null, arguments)
    }
})()
```
##### 延续局部变量的寿命
img对象经常用于进行数据上报
```javascript
const report  = function(src) {
    cosnt img  = new Image()
    img.src = src
}
```
但是这种做法可能会造成数据丢失，因为img是report中的局部变量，当report函数的调用结束后，img局部变量随即被销毁，而此时还没来得及发出HTTP请求。我们可以利用闭包把img变量封装起来。
```javascript
const report = (function() {
    const imgs = []
    return function(src) {
        const img = new Image()
        imgs.push(img)
        img.src = src
    }
})()
```
#### 用闭包实现命令模式
命令模式的意图是把请求封装为对象，从而分离请求的发起者和请求的接收者

#### 闭包和内存管理
如果闭包的作用域链中保存着一些DOM节点，容易形成循环引用，可能造成内存泄漏。
将变量设置为null可以切断这种连接。

#### 高阶函数
高阶函数是指至少满足下列条件之一的函数
* 函数可以作为参数被传递
* 函数可以作为返回值输出

#### 高阶函数实现AOP
AOP(Aspect Oriented Programming)的主要作用是把一些核心业务逻辑模块无关的功能抽离出来

下面是一段我懵逼了半天的骚操作
```javascript
    Function.prototype.before = function(beforefn) {
        const __self = this // this -> 调用该函数的对象 -> 即func
        return function() { // this -> window
            beforefn.apply(this, arguments) // window调用beforefn
            return __self.apply(this, arguments) // window调用func 返回值为func()的返回值
        }
    }

    Function.prototype.after = function(afterfn) {
        const __self = this // 调用该函数的对象 -> 即调用 func.before() 返回的函数
        return function() { // [入口] 最后func()调用的是该函数 this -> window
            const ret = __self.apply(this, arguments) // window 调用 func.before() 返回的函数  ret为func()的返回值
            afterfn.apply(this, arguments) // window调用afterfn
            return ret // [出口]返回func()的返回值
        }
    }

    let func = function() {
        console.log(2)
        return 'i am ret'
    }

    func = func.before(function(){
        console.log(1)
    }).after(function() {
        console.log(3)
    })

    func()
```
这段操作是真的骚,作者说它叫装饰者模式。

#### 高阶函数的其他应用
##### currying
currying又称分步求值。
```javascript
const currying = function(fn) {
    const args = []
    return function() {
        if (arguments.length === 0) {
            return fn(...args)
        } else {
            args.push(...arguments)
            // console.log(this)
            console.log(arguments.callee)
            return arguments.callee //该函数本身
        }
    }
}

const cost = (function() {
    const money = 0
    return function() {
       return money = Array.prototype.slice.call(arguments).reduce((accumulator, currentValue) => accumulator + currentValue)
    }
})()
```



##### uncurrying
反柯里化扩大函数的适用范围
```javascript
Function.prototype.uncurrying = function() {
    const self = this
    return function() {
        const obj = Array.prototype.shift.call(arguments)
        return self.apply(obj, arguments)
    }
}

const push = Array.prototype.push.uncurrying()
```

##### 函数节流
函数被频繁调用的场景：
* window.onresize
* mousemove
* 上传进度
```javascript
const throttle = function(fn, interval) {
    const _self = fn,
          timer,
          firstTime = true
    return function() {
        const  args = arguments,
               __me = this
        if (firstTime) {
            __self.apply(__me, args)
            return firstTime = false
        }

        if(timer) {
            return false
        }

        timer = setTimeout(function() {
            clearTimeout(timer)
            timer = null
            __self.apply(__me, args)
        }, interval || 500)
    }
}
```

##### 分时函数
```javascript
const timeChunk = function(ary, fn, count) {
    const obj, t
    const len = ary.length
    const start =  function() {
        for (let i = 0; i < Math.min(count || 1, ary.length); i++) {
            const obj = ary.shift()
            fn(obj)
        }
    }

    return function() {
        t = setInterval(function() {
            if (ary.length === 0)  {
                return clearInterval(t)
            }
            start()
        }, 200)
    }
}
```
##### 惰性加载函数
```javascript
const addEvent = function(elem, type, handler) {
    if (window.addEventListener) {
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, false, false)
        }
    } else if (window.attachEvent) {
        addEvent = function(elem, type, handler) {
            elem.attachEvent('on' + type, handler)
        }
    }
    addEvent(elem, type, handler)
}
```
这个操作也比较神奇，第一次进入这个函数，函数内部会重写这个函数，减少了冗余的条件判断。


## 设计模式
### 单例模式
定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

场景：线程池、全局缓存、浏览器中的window对象、登录浮框
#### 实现单例模式
```javascript
const Singleton = function() {
    this.name = name
    this.instance = null
}
Singleton.prototype.getName = function() {
    alert(this.name)
}

Singleton.getInstance = function(name) {
    if(!this.instance) {
        this.instance = new Singleton(name)
    }
    return this.instance
}
```
#### 透明的单例模式
```javascript
const CreateDiv(function(){
    const instance
    const CreateDiv = function(html) {
        if(instance) {
            return instance
        }
        this.html = html
        this.init()
        return instance = this
    }
    CreateDiv.prototype.init = function() {
        const div = document.createElement('div')
        div.innerHTML = this.html
        document.body.appenChild(div)
    }
    return CreateDiv
})()

const CreateDiv = function(html) {
    if(instance) {
        return instance
    }
    this.html = html
    this.init()
    return instance = this
}
}
```
CreateDiv实际上负责了两件事，第一是创建对象和执行init方法，第二是保证只有一个对象。
#### 用代理实现单例模式
```javascript
const CreateDiv = function(html) {
    this.html = html
    this.init()
}

CreateDiv.prototype.init = function() {
    const div = document.createElement('div')
    div.innerHTML = this.html
    document.body.appendChild(div)
}

const ProxySingletonCreateDiv = (function(){
    let instance
    return function(html) {
        if(!instance) {
            instance = new CreateDiv(html)
        }
        return instance
    }
})()

const a = new ProxySingletonCreateDiv('box1')
const b = new ProxySingletonCreateDiv('box2')
alert(a === b) // true
```
#### JavaScript中的单例模式
JavaScript是一门无类（class-free）语言。全局变量不是单例模式，但是在JavaScript的开发中，我们经常会把全局变量当成单例来使用。

我们应该尽量减少全局变量的使用。解决这个问题我们可以通过动态创建命名空间。
```javascript
const MyApp = {}
MyApp.namespace = function(name) {
    const parts = name.split('.')
    const current = MyApp
    for(let i in parts) {
        if(!current[parts[i]]) {
            current[parts[i]] = {}
        }
        current = current[parts[i]]
    }
}
MyApp.namespace('event')
MyApp.namespace('dom.style')
```
用闭包封装私有变量。可用下划线来表示私有变量。
#### 惰性单例✨
惰性单例指的是在需要的时候才创建对象实例。
```javascript
const getSingle = function( fn ) {
    const result
    return function() {
        return result || (result = fn.apply(this,arguments))
    }
}

const createLoginLayer = function() {
    const div = document.createElement('div')
    div.innerHTML = '我是登录框'
    div.style.display = 'none'
    document.body.appendChild('div')
    return div
}

const createSingleLoginLayer = getSingle(createLoginLayer)

document.getElementById('loginBtn').onClick = function() {
    const createSingleLoginLayer = createSingleLoginLayer()
    createSingleLoginLayer.style.display = 'block' 
}
```
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
