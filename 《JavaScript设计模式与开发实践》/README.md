# 《JavaScript 设计模式与开发实践》

设计模式：在面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。

设计模式在很多时候都体现了语言的不足之处，设计模式是对语言不足的补充。

设计模式总是把不变的事物和变化的食物分离开来。

## 基础知识

### 面向对象的 JavaScript

#### 静态和动态语言

##### 静态类型语言

定义：编译时已确定变量的类型

优点：

*   编译时就能发现类型不匹配的错误
*   明确规定了数据类型，编译器针对这些信息对程序进行了优化，提高程序执行速度

缺点：

*   迫使程序员依照强契约来编写程序，增加更多的代码

##### 动态类型语言

定义：程序运行时，待变量被赋予某个值之后，才会具有某种类型

优点：

*   编写的的代码数量较少，看起来更加简洁
*   精力放在业务逻辑上

缺点：

*   无法保证变量类型，运行期可能发生类型相关的错误

#### 鸭子类型（duck typing）

鸭子类型知道我们只关注对象的行为，而不关注对象本身

#### 多态、继承、封装

*   由于 JavaScript 不存在类型检查，所以它自带多态

```javascript
// 结合闭包和Symbol实现私有属性
const People = (function() {
    const name = Symbol('name')
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

#### new 的过程

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

JavaScript 给对象提供了一个名为**proto**的隐藏属性，某个对象的**proto**属性默认会指向构造器的原型对象。

### this、call 和 apply

#### this 的指向

*   对象的方法调用 this 指向该对象
*   普通函数调用 this 指向全局对象 window
*   构造器调用 this 指向返回的对象
*   Funtion.prototype.call 或 Function.prototype.apply 动态传入 this

#### this 的丢失

为了简化代码，我们尝试以下的操作

```javascript
const getId = document.getElementById
getId('box')
```

我们会发现通过上述方法是不能拿到 box 这个 DOM 节点的，因为在大多数浏览器的 getElementById 这个方法中，都是存在对 this 的引用的。我们在上述的做法中，相当于直接调用了该方法，this 指向全局对象，这个现象就是 this 的丢失。

为了防止 this 的丢失，我们对 document.getElementById 这个方法做了如下改进：

```javascript
document.getElementById = (function(func) {
    return function() {
        return func.apply(document, arguments)
    }
})(document.getElementById)
```

理清这个函数的思路，归根结底就是在每次调用 document.getElementById 这个函数时将函数内的 this 指向 document。

#### call 和 apply 的区别

这个话题是老生常谈，肯定不止在这一本书里见过。他们的作用一模一样，只是传入的参数形式有别。

*   func.apply(null, [1,2,3])
*   func.call(null,1,2,3)

### bind

我们来手动实现一个 bind 方法

```javascript
Function.prototype.bind = function(context) {
    const self = this // 保存原函数
    return function() {
        return self.apply(context, arguments)
    }
}
```

#### call 和 apply 的用处

*   改变 this
*   借用方法 经常使用 Array.prototype 上的方法

### 闭包和高阶函数

#### 什么是函数式编程

这里引用一下阮一峰博客里面的解释。我们来实现一个数学表达式：(1+2)\*3-4

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
        return Array.prototype.slice
            .call(arguments)
            .reduce((accumulator, currentValue) => accumulator * currentValue)
    }

    return function() {
        const args = Array.prototype.join.call(arguments, ',')
        if (args in cache) {
            return cache[args]
        }
        return (cache[args] = calculate.apply(null, arguments))
    }
})()
```

##### 延续局部变量的寿命

img 对象经常用于进行数据上报

```javascript
const report  = function(src) {
    cosnt img  = new Image()
    img.src = src
}
```

但是这种做法可能会造成数据丢失，因为 img 是 report 中的局部变量，当 report 函数的调用结束后，img 局部变量随即被销毁，而此时还没来得及发出 HTTP 请求。我们可以利用闭包把 img 变量封装起来。

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

如果闭包的作用域链中保存着一些 DOM 节点，容易形成循环引用，可能造成内存泄漏。将变量设置为 null 可以切断这种连接。

#### 高阶函数

高阶函数是指至少满足下列条件之一的函数

*   函数可以作为参数被传递
*   函数可以作为返回值输出

#### 高阶函数实现 AOP

AOP(Aspect Oriented Programming)的主要作用是把一些核心业务逻辑模块无关的功能抽离出来

下面是一段我懵逼了半天的骚操作

```javascript
Function.prototype.before = function(beforefn) {
    const __self = this // this -> 调用该函数的对象 -> 即func
    return function() {
        // this -> window
        beforefn.apply(this, arguments) // window调用beforefn
        return __self.apply(this, arguments) // window调用func 返回值为func()的返回值
    }
}

Function.prototype.after = function(afterfn) {
    const __self = this // 调用该函数的对象 -> 即调用 func.before() 返回的函数
    return function() {
        // [入口] 最后func()调用的是该函数 this -> window
        const ret = __self.apply(this, arguments) // window 调用 func.before() 返回的函数  ret为func()的返回值
        afterfn.apply(this, arguments) // window调用afterfn
        return ret // [出口]返回func()的返回值
    }
}

let func = function() {
    console.log(2)
    return 'i am ret'
}

func = func
    .before(function() {
        console.log(1)
    })
    .after(function() {
        console.log(3)
    })

func()
```

这段操作是真的骚,作者说它叫装饰者模式。

#### 高阶函数的其他应用

##### currying

currying 又称分步求值。

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
        return (money = Array.prototype.slice
            .call(arguments)
            .reduce((accumulator, currentValue) => accumulator + currentValue))
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

*   window.onresize
*   mousemove
*   上传进度

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

场景：线程池、全局缓存、浏览器中的 window 对象、登录浮框

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
    if (!this.instance) {
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

CreateDiv 实际上负责了两件事，第一是创建对象和执行 init 方法，第二是保证只有一个对象。

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

const ProxySingletonCreateDiv = (function() {
    let instance
    return function(html) {
        if (!instance) {
            instance = new CreateDiv(html)
        }
        return instance
    }
})()

const a = new ProxySingletonCreateDiv('box1')
const b = new ProxySingletonCreateDiv('box2')
alert(a === b) // true
```

#### JavaScript 中的单例模式

JavaScript 是一门无类（class-free）语言。全局变量不是单例模式，但是在 JavaScript 的开发中，我们经常会把全局变量当成单例来使用。

我们应该尽量减少全局变量的使用。解决这个问题我们可以通过动态创建命名空间。

```javascript
const MyApp = {}
MyApp.namespace = function(name) {
    const parts = name.split('.')
    const current = MyApp
    for (let i in parts) {
        if (!current[parts[i]]) {
            current[parts[i]] = {}
        }
        current = current[parts[i]]
    }
}
MyApp.namespace('event')
MyApp.namespace('dom.style')
```

用闭包封装私有变量。可用下划线来表示私有变量。

#### 惰性单例 ✨

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

定义： 定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。

#### 用策略模式计算奖金

```javascript
const strategies = {
    S: function(salary) {
        return salary * 4
    },
    A: function(salary) {
        return salary * 3
    },
    B: function(salary) {
        return salary * 2
    },
}

const calculateBonus = function(level, salary) {
    return strategies[level](salary)
}
```

#### 多态在策略模式中的体现

#### 使用策略模式实现缓动动画

```javascript
// t动画消耗的时间 b初始位置 c目标位置 d持续的总时间
const tween = {
    linear: function(t, b, c, d) {
        return c * t / d + b
    },
    easeIn: function(t, b, c, d) {
        return c * (t /= d) * t + b
    },
    strongEaseIn: function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    strongEaseOut: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    sineaseIn: function(t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    sineaseOut: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
}

const Animate = function(dom) {
    this.dom = dom
    this.startTime = 0
    this.startPos = 0
    this.endPos = 0
    this.propertyName = null
    this.easing = null
    this.duration = null
}

Animate.property.start = function(propertyName, endPos, duration, easing) {
    this.startTime = +new Date()
    this.startPos = this.dom.getBoundingClientRect()[propertyName] //返回元素的大小及其相对于视口的位置
    this.propertyName = propertyName
    this.endPos = endPos
    this.duration = duration
    this.easing = tween[easing]

    const self = this
    const timeId = setInterval(function() {
        if (self.step === false) {
            clearInterval(timeId)
        }
    }, 19)
}

Animate.property.step = function() {
    const t = +new Date()
    if (t >= this.startTime + this.duration) {
        this.update(this.endPos)
        return false
    }
    const pos = this.easing(
        t - this.startTime,
        this.startPos,
        this.endPos - this.startPos,
        this.duration
    )
    this.update(pos)
}

Animate.property.update = function(pos) {
    this.dom.style[this.propertyName] = pos + 'px'
}

// 开始动画
const div = document.getElementById('div')
const animate = new Animate(div)
animate.start('left', 500, 1000, 'strongEaseOut')
```

#### 表单验证

```javascript
const strategies = {
    // 不为空
    isNonEmpty: function(value, errorMsg) {
        if (value === '') {
            return errorMsg
        }
    },
    // 限制最小长度
    minLength: function(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg
        }
    },
    // 手机号码格式
    isMobile: function(value, errorMsg) {
        if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
            return errorMsg
        }
    },
}

const Validator = function() {
    this.cache = []
}

Validator.property.add = function(dom, rule, errorMsg) {
    const ary = rule.split(':')
    this.cache.push(function() {
        const strategy = ary.shift()
        ary.unshift(dom.value)
        ary.push(errorMsg) //此处参数拼接很精妙
        return strategies[strategy].apply(dom, ary)
    })
}

Validator.prototype.start = function() {
    for (var i = 0, validatorFunc; (validatorFun = this.cache[i++]); ) {
        const msg = validatorFunc()
        if (msg) {
            return msg
        }
    }
}

const validataFunc = function() {
    const validator = new Validator()
    validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空')
    validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位')
    validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确')
    const errorMsg = validator.start()
    return errorMsg
}
```

添加多种校验规则，我们只需要改写 add 函数

```javascript
Validator.prototype.add = function(dom, rules) {
  const self = this
  for(let i=0,rule,;rule =rules[i++];) {
    (function(rule) {
      const ary = rule.split(":");
      this.cache.push(function() {
        const strategy = ary.shift();
        ary.unshift(dom.value);
        ary.push(errorMsg);
        return strategies[strategy].apply(dom, ary);
      });
    })(rule)
  }
}
```

#### 策略模式的优缺点

优点

*   策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件的选择语句
*   策略模式提供了对开放-封闭原则的完美支持，将算法封装在独立的 strategy 中，使得她们易于切换、易于理解、易于扩展
*   策略模式中的算法也可以服用在系统的其他地方，从而避免许多重复的复制粘贴工作
*   在策略模式中利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻便的替代方法缺点
*   strategy 要向客户暴露它的所有实现，这是违反最少知识原则的

### 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制它的访问。

#### 保护代理和虚拟代理

保护代理: 控制目标对象的访问，给不同用户提供不同的访问权限

虚拟代理: 把开销很大的对象，延迟到真正需要它的时候采取创建

#### 虚拟代理实现图片预加载

图片预加载： 先用一张 loading 图片占位，然后异步的方式加载图片，等加载好了再把它填充到 img 节点里。

```javascript
const myImage = (function() {
  const imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})();

const proxyImage = (function(){
  const img = new Image
  img.onload = function() {
    myImage.setSrc(this.src)
  }
  return {(
    setSrc: function(src) {
      myImage.setSrc('file:// /C:/Users/Desktop/loading.gif')
      img.src = src
    }
  }
})()

proxyImage.setSrc('http://imgcache.qq.com/music/photo/k/test.jpg')
```

#### 代理和本体接口的一致性

如果有一天我们不再需要预加载，那么就不再需要代理对象，可以选择直接请求本体。所以代理和本体实现同样的方法，这样有利于方法的替换。

```javascript
const myImage = (function() {
    const imgNode = document.createElement('img')
    document.body.appendChild(imgNode)
    return function(src) {
        imgNode.src = src
    }
})()

const proxyImage = (function() {
    const img = new Image()
    img.onload = function() {
        myImage(this.src)
    }
    return function(src) {
        myImage('file:// /C:/Users/Desktop/loading.gif')
        img.src = src
    }
})()
```

#### 虚拟代理合并 HTTP 请求

```javascript
const synchronousFile = function(id) {
  console.log("开始同步文件，id为：" + id);
};

const proxySynchronousFile = (function(){
  const cache = [], timer
  return function(id) {
    cache.push(id)
    if(timer) {
      return
    }
    timer = setTimeout(function(){
      synchronousFile(cache.join(','))
      clearTimeout(timer)
      timer = null
      cache.length = 0
    }, 2000)
  }
})()

const checkbox = document.getElementByTagName("input");
checkbox.foreach(item => {
  item.onclick = function() {
    if (this.checked === true) {
      proxySynchronousFile(this.id);
    }
  };
});
```

#### 虚拟代理在惰性加载中的应用

```javascript
const miniConsole = (function() {
    const cache = []
    const handler = function(ev) {
        if (ev.keyCode === 113) {
            const script = document.createElement('script')
            script.onload = function() {
                for (let i = 0, fn; (fn = cache[i++]); ) {
                    fn()
                }
            }
            script.src = 'miniConsole.js'
            document.getElementByTagName('head')[0].appendChild(script)
            document.body.removeEventListener('keydonw', handler)
        }
    }
    document.body.addEventListener('keydown', handler)
    return {
        log: function() {
            const args = arguments
            cache.push(function() {
                miniConsole.log.apply(miniConsole, args)
            })
        },
    }
})()

miniConsole = {
    log: function() {
        // 略
        console.log(Array.prototype.join.call(arguments))
    },
}
```

#### 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果。

计算乘积

```javascript
const mult = function() {
    return Array.prototype.reduce.call(arguments, (prev, curr) => prev * curr)
}

const proxyMult = (function() {
    const cache = {}
    return function() {
        const args = Array.prototype.join.call(arguments, ',')
        if (args in cache) {
            return cache[args]
        }
        return (cache[args] = mult.apply(this, arguments))
    }
})()
```

#### 用高阶函数动态创建代理

```javascript
/**********计算乘积**********/
const mult = function() {
    return Array.prototype.reduce.call(arguments, (prev, curr) => prev * curr)
}
/**********计算加和**********/
const plus = function() {
    return Array.prototype.reduce.call(arguments, (prev, curr) => prev + curr)
}
/**********创建缓存代理的工厂**********/
const createProxyFactory = function(fn) {
    const cache = {}
    return function() {
        const args = Array.prototype.join.call(arguments, ',')
        if (args in cache) {
            return chache[args]
        }
        return (cache[args] = fn.apply(this, arguments))
    }
}
```

### 迭代器模式

定义：迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。

#### 实现自己的迭代器

```javascript
const each = function(ary, callback) {
    const l = ary.length
    for (let i = 0; i < l; i++) {
        callback.call(ary[i], i, ary[i])
    }
}
```

#### 内部迭代器和外部迭代器

1.  内部迭代器

我们刚刚编写的 each 函数属于内部迭代器，each 函数的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。

```javascript
const compare = function(ary1, ary2) {
    if (ary1.length !== ary2.length) {
        throw new Error('ary1和ary2不相等')
    }
    each(ary1, function(i, n) {
        if (n !== ary2[i]) {
            throw new Error('ary1和ary2不相等')
        }
    })
    alert('ary1和ary2相等')
}
```

这样写非常的不优雅，我们来看看外部迭代器如何实现。

2.  外部迭代器

外部迭代器必须显式地请求迭代下一个元素。

在处理两个数组的时候这种做法的实现更优雅。

```javascript
const Iterator = function(obj) {
    const current = 0
    const next = function() {
        current += 1
    }
    const isDone = function() {
        return current >= obj.length
    }
    const getCurrItem = function() {
        return obj[current]
    }
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem,
        length: obj.length,
    }
}
const compare = function(iterator1, iterator2) {
    if (iterator1.length !== iterator2.length) {
        alert('iterator1和iterator2不相等')
    }
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw new Error('iterator1和iterator2不相等')
        }
        iterator1.next()
        iterator2.next()
    }
    alert('iterator1和iterator2相等')
}

const iterator1 = Iterator([1, 2, 3])
const iterator2 = Iterator([1, 2, 3])
comjpare(iterator1, iterator2)
```

#### 迭代类数组对象和字面量对象

#### 倒序迭代器

#### 中止迭代器

迭代器可以像普通 for 循环中的 break 一样，提供一种跳出循环的方法。

```js
const each = function(ary, callback) {
    const i = ary.length
    for (let i = 0; i < l; i++) {
        if (callback(i, ary[i]) === false) {
            break
        }
    }
}

each([1, 2, 3, 4, 5], function(i, n) {
    if (n > 3) {
        return false
    }
    console.log(n) // 1, 2, 3
})
```

#### 迭代器模式的应用列举

在不同的浏览器环境下，选择的上传方式是不一样的。我们会优先使用控件上传，或者 Flash 上传，如果都没有则使用原生表单上传。`

```javascript
// 控件
const getActiveUploadObj = function() {
    try {
        return new ActiveXObject('TXFTNActiveX.FTNUpload')
    } catch (e) {
        return false
    }
}

// Flash
const getFlashUploadObj = function() {
    if (supportFlash()) {
        const str = '<object type="application/x-shockwave-flash"></object>'
        return $(str).appendTo($('body'))
    }
    return false
}

// 表单
const getFormUploadObj = function() {
    const str = '<input name="file" class="ui-file" />'
    return $(str).appendTo($('body'))
}

const iteratorUploadObj = function() {
   const fn
   for(let i =0;fn = argument[i++];) {
       const uploadObj = fn()
       if(uploadObj !== false) {
           return uploadObj
       }
   }
}

const uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, iteratorUploadObj)
```

### 发布-订阅模式

又叫观察者模式，它定义对象见的一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都将得到通知。

#### 发布-订阅模式的作用

我们无需过多关注对象在异步运行期间内部的状态，而只需要订阅感兴趣的事件的发生点。

取代对象之间硬编码的通知机制，一个对象不再显式的调用另外一个对象的某个接口。

#### 自定义事件

*   首先要指定好谁充当发布者（售楼处）
*   然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者（售楼处的花名册）
*   最后发布消息的时候，发布者回遍历这个缓存列表，依次触发里面存放的订阅者回调函数（遍历花名册，挨个发短信）

```js
const salesOffices = {} // 定义售楼处
salesOffices.clientList = [] // 缓存列表，存放订阅者的回调函数
// 增加订阅者
salesOffices.listen = function(fn) {
    this.clientList.push(fn)
}
// 发布消息
salesOffices.trigger = function() {
    this.clientList.foreach(item => {
        item.apply(this, arguments)
    })
}
salesOffices.listen(function(price, squareMeter) {
    console.log('价格=' + price)
    console.log('squareMeter=' + squareMeter)
})
salesOffices.listen(function(price, squareMeter) {
    console.log('价格=' + price)
    console.log('squareMeter=' + squareMeter)
})
salesOffices.trigger(2000000, 88)
salesOffices.trigger(3000000, 110)
```

如果订阅者只想看到自己感兴趣的消息，我们可以进行如下改写

```js
const salesOffices = {}
salesOffices.clientList = []
salesOffices.listen = function(key, fn) {
    if (!this.clientList[key]) {
        this.clientList[key] = []
    }
    this.clientList[key].push(fn)
}
salesOffices.trigger = function() {
    const key = Array.property.shift.call(arguments),
        fns = this.clientList[key]
    fns.foreach(item => {
        item.apply(this, arguments)
    })
}
salesOffices.listen('squareMeter88', function(price, squareMeter) {
    console.log('价格=' + price)
    console.log('squareMeter=' + squareMeter)
})
salesOffices.listen('squareMeter110', function(price, squareMeter) {
    console.log('价格=' + price)
    console.log('squareMeter=' + squareMeter)
})
salesOffices.trigger('squareMeter88', 2000000, 88)
salesOffices.trigger('squareMeter110', 3000000, 110)
```

#### 发布-订阅模式的通用实现

```js
const event = {
    clientList: [],
    listen: function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    },
    trigger: function() {
        const key = Array.property.shift.call(arguments),
            fns = this.clientList[key]
        fns.foreach(item => {
            item.apply(this, arguments)
        })
    },
    remove: function(key, fn) {
        const fns = this.clientList[key]
        if (!fns) {
            // 如果key对应的消息没有被人订阅，则直接返回
            return false
        }
        if (!fn) {
            // 如果没有传入具体回调函数，表示需要取消key对应消息的所有订阅
            fns && (fns.length = 0)
        } else {
            fns.foreach((item, index) => {
                if (item === fn) {
                    fns.splice(index, 1)
                }
            })
        }
    },
}

// 给所有对象都动态安装发布-订阅模式
const installEvent = function(obj) {
    for (let i in event) {
        obj[i] = event[i]
    }
}
```

#### 真实的例子——网站登录

```javascript
$.ajax('http://xxx.com?login', function(data) {
    login.trigger('loginSucc', data)
})

const header = (function() {
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar)
    })
    return {
        setAvatar: function(data) {
            console.log('设置header模块的头像')
        },
    }
})()

const nav = (function() {
    login.listen('loginSucc', function(data) {
        nav.setAvatar(data.avatar)
    })
    return {
        setAvatar: function(data) {
            console.log('设置nav模块的头像')
        },
    }
})()
```

#### 全局的发布-订阅对象

全局对象相当于中介

```javascript
const Event = (function() {
    const clientList = {},
        listen,
        trigger,
        remove

    listen = function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    }

    trigger = function() {
        const key = Array.property.shift.call(arguments),
            fns = this.clientList[key]
        fns.foreach(item => {
            item.apply(this, arguments)
        })
    }

    remove = function(key, fn) {
        const fns = this.clientList[key]
        if (!fns) {
            // 如果key对应的消息没有被人订阅，则直接返回
            return false
        }
        if (!fn) {
            // 如果没有传入具体回调函数，表示需要取消key对应消息的所有订阅
            fns && (fns.length = 0)
        } else {
            fns.foreach((item, index) => {
                if (item === fn) {
                    fns.splice(index, 1)
                }
            })
        }
    }

    return {
        listen: listen,
        trigger: trigger,
        remove: remove,
    }
})()
```

#### 模块间通信

```js
const a = (function() {
    const count = 0
    const button = document.getElementById('count')
    button.onclick = function() {
        Event.trigger('add', count++)
    }
})()
const b = (function() {
    const div = document.getElementById('show')
    Event.listen('add', function(count) {
        div.innerHTML = count
    })
})()
```

#### 全局事件的命名冲突

```js
Event.create('namespace1').listen('click', function(a) {
    console.log(a)
})
Event.create('namespace1').trigger('click', 1)


const Event = (function() {
    const global = this,
        Event,
        _default = 'default' //默认命名空间
    Event = function() {
        const _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _unshift = Array.prototype.unshift
            namespaceCache = {},
            _create,
            find,
            each = function(ary, fn) {
                const ret
                ary.foreach((item,index) => {
                    ret = fn.call(item, index, item)
                })
                return ret
            }

        _listen = function(key, fn, cache) {
            if(!cache[key]) {
                cache[key] = []
            }
            cache[key].push(fn)
        }

        _trigger = function() {
            const cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = _shift.call(arguments),
                _self = this,
                ret,
                stack = cache[key]

                if(!stack || !stack.length) {
                    return
                }

                return each(stack, function() {
                    return this.apply(_self, args)
                })
        }

        _remove(key, cache, fn) {
            if(cache[key]) {
                if(fn) {
                    cache[key].foreach((item, index) => {
                        if(item === fn) {
                            cache[key].splice(index, 1)
                        }
                    })
                } else {
                    cache[key] = []
                }
            }
        }

        _create = function(namespace) {
            const namespace = namespace || _default
            const cache = {},
                offlineStack = [], // 离线事件
                ret = {
                    listen: function(key, fn, last) { // last ??
                        _listen: function(key, fn, cache)
                        if(offlineStack === null) { // 如果没有离线缓存 gg
                            return
                        }
                        if (last === 'last') {
                            offlineStack.length && offlineStack.pop()()
                        } else {  // 执行缓存栈内所有方法
                            each(offlineStack, function() {
                                this()
                            })
                        }
                        offlineStack = null
                    },
                    remove: function(key, fn) {
                        _remove(key, cache, fn)
                    },
                    trigger: function() {
                        const fn,
                            args,
                            _self = this
                        _unshift.call(arguments, cache) // cache, key, value
                        args = arguments
                        fn = function() {
                            return _trigger.apply(_self, args)
                        }
                        if(offlineStack) {
                            return offlineStack.push(fn) // 当offline存在时即证明此时还没有调用listen, 将发布的事件压入离线栈
                        }
                        return fn()

                    },
                    one() {
                        _remove(key, cache)
                        this.listen(key, cache, last)
                    }
                }
                return namespace ? ( namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret ) : ret
        }
        return {
            create: _create,
            one: function(key, fn, last) {
                const event = this.create()
                event.one(key, fn, last)
            },
            remove: function() {
                const event = this.create()
                event.remove(key, fn)
            },
            listen: function(key, fn, last) {
                const event = this.create()
                event.listen(key, fn, last)
            },
            trigger: function() {
                var event = this.create()
                event.trigger.apply(this, arguments)

            },
        }
    }
    return Event
})()
```

#### 小结

优点

*   时间上的解耦
*   对象之间的解耦缺点
*   订阅者始终存于内存中
*   程序难以跟踪维护和理解

### 命令模式

#### 命令模式的例子——菜单程序

有时候需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么，此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接受者能够消除彼此的耦合关系。

```js
    const button1 = document.getElementById('button1')

    const setCommand = function(button, command) {
        button.onclick = function() {
            command.execute()
        }
    }

    const MenuBar = {
        refresh: function() {
            console.log('刷新菜单')
        }
    }

    const RefreshMenuBarCommand = function(receiver) {
        this.receiver = receiver
    }

    RefreshMenuBarCommand.prototype.execute = function() {
        this.receiver.refresh()
    }

    consty refreshCommandBarCommand = new RefreshMenuBarCommand(MenuBar)

    setCommand(button1, refreshMenuBarCommand)
```

#### JavaScript 中的命令模式

```js
const setCommand = function(button, func) {
    button.onclick = function() {
        func()
    }
}

const MenuBar = {
    refresh: function() {
        console.log('刷新页面菜单')
    },
}

const ReafreshMenuBarCommand = function(receiver) {
    return function() {
        receiver.fresh()
    }
}

const refreshMenuBarCommand = ReafreshMenuBarCommand(MenuBar)

setCommand(button1, refreshMenuBarCommand)
```

为了让命令模式具有可拓展性，我们对代码进行如下修改。

```js
const MenuBar = {
    refresh: function() {
        console.log('刷新页面菜单')
    },
}

const RefreshMenuBarCommand = function(receiver) {
    return {
        execute: function() {
            receiver.refresh()
        },
    }
}

const setCommand = function(button, command) {
    button.onclick = function() {
        command.exec()
    }
}

const refreshMenuBarCommand = ReafreshMenuBarCommand(MenuBar)
setCommand(button1, refreshMenuBarCommand)
```

#### 撤销命令

```js
const ball = document.getElementById('ball')
const pos = document.getElementById('pos')
const moveBtn = document.getElementById('moveBtn')
const cancelBtn = document.getElementById('cancelBtn')

const MoveCommand = function(receiver, pos) {
    this.receiver = receiver
    this.pos = pos
    this.oldPos = null
}

MoveCommand.prototype.excute = function() {
    this.receiver.start('left', this.pos, 1000, 'strongEaseOut')
    this.oldPos = this.receiver.dom.getBoundingClentRect()[
        this.receiver.propertyName
    ]
}

MoveCommand.prototype.undo = function() {
    this.receiver.start('left', this.oldPos, 1000, 'strongEaseOut')
}

const moveCommand

moveBtn.onclick = function() {
    const animate = new Animate(ball)
    moveCommand = new MoveCommand(animate, pos.value)
    moveCommand.execute()
}

moveBtn.undo = function() {
    moveCommand.undo()
}
```

#### 撤销和重做

HTML5 版《拳王争霸》

```js
const Ryu = {
    attack: function() {
        console.log('攻击')
    },
    defense: function() {
        console.log('防御')
    },
    jump: function() {
        console.log('跳跃')
    },
    crouch: function() {
        console.log('蹲下')
    },
}

const makeCommand = function(receiver, state) {
    return function() {
        reseiver[state]()
    }
}

const commands = {
    '119': 'jump', // W
    '115': 'crouch', // S
    '97': 'defense', // A
    '100': 'attack', // D
}

const commandStack = []

document.onpress = fucntion(ev) {
    const keyCode = ev.keyCode
    command = mackCommand(Ryu, commands[keyCode])

    if(command) {
        command()
        commandStack.push(command)
    }
}

document.getElementById('replay').onclick = function() {
    const command
    while(command = commandStack.shift()) {
        command
    }
}
```

#### 命令队列

#### 宏命令

一次执行多个命令。

```js
const MacroCommand = function() {
    return {
        commandsList: [],
        add: function(command) {
            this.commandsList.push(command)
        },
        excute: function() {
            this.commandsList.foreach(item => {
                item.execute()
            })
        },
    }
}
```

#### 智能命令和傻瓜命令

而把命令交由 receiver 处理的称为傻瓜命令。这种模式的好处是请求发起者和请求接受者之间尽可能得到了解耦。

没有 receiver 的是智能命令，可以直接实现请求。这种模式和策略模式非常相似，我们只能从意图上去区分他们。

### 组合模式

定义：用小的子对象来构建更大的对象，而这些小的子对象本身也许是由更小的“孙对象”构成的。

#### 回顾宏命令

macroCommand 比较像代理，而它于真正代理的区别在于它不控制对象的访问。

#### 透明性带来的安全

组合对象可以拥有子节点，叶对象下面没有子节点。解决方法是给叶对象添加该方法，并在调用此方法时抛出异常。

```js
const MacroCommand = function() {
    return {
        commandsList: [],
        add: function(command) {
            this.commandsList.push(command)
        },
        excute: function() {
            this.commandsList.foreach(item => {
                item.execute()
            })
        },
    }
}

const openTvCommand = {
    execute: function() {},
    add: function() {
        throw new Error('叶对象不能添加子节点')
    },
}
```

#### 组合模式的例子——扫描文件夹

```js
/*****Folder*****/
const Folder = function(name) {
    this.name = name
    this.parent = null
    this.Files = []
}

Folder.prototype.add = function(file) {
    file.parent = this
    this.files.push(file)
}

Folder.prototype.scan = function() {
    console.los('开始扫描文件夹' + this.name)
    this.files.foreach(item => {
        item.scan()
    })
}

Folder.prototype.remove = function() {
    if (!this.parent) {
        return
    }
    const { files } = this.parent
    files.foreach((item, index) => {
        if (item === this) {
            files.splice(index, 1)
        }
    })
}

/*****File*****/
const File = function() {
    this.parent = null
    this.name = name
}
File.prototype.add = function() {
    throw new Error('文件下面不能添加文件')
}
File.prototype.scan = function() {
    console.los('开始扫描文件夹' + this.name)
}

File.prototype.remove = function() {
    if (!this.parent) {
        return
    }
    const { files } = this.parent
    files.foreach((item, index) => {
        if (item === this) {
            files.splice(index, 1)
        }
    })
}
```

#### 一些值得注意的地方

*   组合模式不是父子关系
*   对叶对象操作的一致性
*   双向映射关系
*   用职责链模式提高组合模式性能

#### 何时使用组合模式

*   表示对象的部分-整体层次结构。
*   客户希望统一对待树中的所有对象。

### 模板方法模式

定义：一种只需使用继承就可以实现的非常简单的模式。即 java 中的继承抽象类。

#### 模版方法模式的使用场景

模版方法常被架构师用于搭建项目的框架。架构师定好了框架的骨架，程序员继承框架的结构之后，负责往里面天空。

#### 钩子方法

放置钩子是隔离变化的一种常见手段。

```js
const Beverage = function() {}
Beverage.prototype.boilWater = function() {
    console.log('把水煮沸')
}
Beverage.prototype.brew = function() {
    throw new Error('子类必须重写brew方法')
}
Beverage.prototype.pourInCup = function() {
    throw new Error('子类必须重写pourInCup方法')
}
Beverage.prototype.addCondiments = function() {
    throw new Error('子类必须重写addCondiments方法')
}
Beverge.prototype.init = function() {
    this.boilWater()
    this.brew()
    this.pourInCup()
    if (this.customerWantsCondiments()) {
        this.addCondiments()
    }
}

const CoffeeWithHook = function() {}
CoffeeWithHook.prototype.brew = function() {
    console.log('用沸水冲泡咖啡')
}
CoffeeWithHook.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子')
}
CoffeeWithHook.prototype.addCondiments = function() {
    console.log('加糖和牛奶')
}
CoffeeWithHook.prototype.customerWantsCondiments = function() {
    return window.confirm('请问需要调料吗')
}
const coffeeWithHook = new CoffeeWithHook()
coffeeWithHook.init()
```

#### 好莱坞原则

我们允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件。

*   发布-订阅模式
*   回调函数

### 享元模式
享元模式的核心是运用共享技术来有效支持大量细粒度的对象。

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
