# JavaScript 经典案例

敲黑板 划重点

* 尾调用优化
* 局部应用

## 第一部分 经典 JavaScipt

### 第 1 章 JavaScript 不只是简单的构建块

#### 1.1 JavaScript 对象、基本类型和字面值之间的关系

基本类型有：String、Boolean、Number、null、undefined

```javascript
// boolean和number同理，基本类型严格等于字面量，因为基本类型事根据值来进行比较的，而包装类型不相等。
const str1 = 'test'
const str2 = new String('test')

str1 === 'test' // true
str2 === 'test' // false
```

#### 1.2 从字符串提取一个列表

提取之前：

This is one sentence.This is a list of items: cherries, limes, oranges, apples. That was the list of items.

提取之后：

['cherries', 'limes', 'oranges', 'apples']

```javascript
const sentence =
    'This is one sentence.This is a list of items: cherries, limes, oranges, apples. That was the list of items.'
const start = sentence.indexOf(':')
const end = sentence.indexOf('.', start + 1)
const fruits = sentence.substring(start + 1, end).split(',')
fruits.forEach((ele, index, arr) => {
    arr[index] = ele.trim()
})
```

考点：indexOf()的第二个参数. [String.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)

```
str.indexOf(searchValue[, fromIndex])
```

#### 1.3 检查一个存在的、非空的字符串

```javascript
if((typeof unknownVariable != 'undefined' && unknownVariable) && (typeof unknownVariable.valueOf() == 'string'))
```

首先排除空对象的情况。当你使用字符串的时候并且不确定他们是否设置时，你是不能检查长度的。

下面看一下松散等于和严格等于：

```javascript
const num = 0
const str = '0'
num == str // true 松散等于存在隐式转换
num === str // false
```

推荐使用严格等于，但是当你不关心参数类型时可以使用松散等于节约时间。

#### 1.4 插入特殊字符

转义符

```
\'
\"
\\
\b 退格
\f 换页
\n 换行
\r 回车
\t 水平制表符
```

#### 1.5 使用新字符串替换模式

正则表达式特殊字符：

```
^ 匹配输入的开头
$ 匹配输入的结尾
* 匹配0次或多次
? 匹配0次或1次
+ 匹配1次或多次
{n} 严格匹配n次
{n,} 匹配n次或多次
{n,m} 至少匹配n次，至多匹配m次
[…] 方括号中的任何字符
[^…] 除了方括号中的任何字符
\b 匹配单词边界  /\bno/匹配'nono'中的第一个no
\B 匹配非单词边界
\d 数字0到9
\D 匹配非数字字符
\w 匹配任何单词字符
\W 匹配任何非单词字符
\n 匹配一个换行
\s 一个单个空白字符
\S 一个单个非空白字符
\t 一个制表符
() 捕获括号
```

```javascript
const searchString = 'Now is the time, this is the tame'
const re = /t\w{2}e/g
const replacement = searchString.replace(re, 'place')
console.log(replacement) // 'Now is the place, this is the place'
```

#### 1.6 找到并突出显示一个模式的所有实例

RegExp exec()方法如果没有找到一个匹配，返回 null；如果找到一个匹配，返回下列结果

```javascript
const searchString = 'Now is the time'
undefined
const pattern = /t\w*e/g
undefined
pattern.exec(searchString) // ["the", index: 7, input: "Now is the time", groups: undefined]
```

#### 1.7 使用捕获圆括号交换一个字符串中的单词

```javascript
const name = 'Vickie Yan'
const re = /^(\w+)\s(\w+)$/
const newName = name.replace(re, '$2 $1')
```

#### 1.8 使用命名实体来替换 HTML 标签

```Javascript
const pieceOfHtml = '<p>This is a <span>paragraph</span></p>'
pieceOfHtml = pieceOfHtml.replace('/</g', '&lt')
pieceOfHtml = pieceOfHtml.replace('/>/g', '&gt')
```

#### 1.9 把一个ISO 8601格式的日期转换为Date对象可接受的一种形式

```javascript
const dtstr = "2014-3-04T19:35:32Z"
dtstr = dtstr.replace('/\D/g', ' ')
const dtcomps = dtstr.split(' ')
dtcomps[1]--
const convdt = new Date(Date.UTC(...dtcomps))
```

#### 1.10 使用带有定时器的函数闭包

```javascript
const intervalId = null
document.getElementById('redbox').addEventListener('click', startBox, false)
function startBox() {
    if(intervalId === null) {
        const x = 100
        intervalId = setInterval(function() {
            x += 5
            const left = x + 'px'
            document.getElementById('redbox').style.left = left
        }, 100)
    } else {
        clearInterval(intervalId)
        intervalId = null
    }
}
```

#### 1.11 记录消耗时间

```javascript
const firstDate = new Date()
setTimeout(function() {
    const secondDate = new Date()
    const diff = secondDate - firstDate
    console.log(diff)
}, 25000)
```

#### 1.12 把十进制数转换为一个十六进制值

```javascript
const num = 225
num.toString(16)
```

##### 严格模式

* 通常赋值失败会非常安静，现在会抛出一个错误
* 试图删除一个不能删除的属性失败
* 使用非唯一性的函数名称
* 使用非唯一性的函数参数名称
* 在严格模式下不支持八进制
* eval()语句受到限制，并且不再支持with
* 当构建一个新的对象的时候，new是必需的，以保证this正常地工作

#### 1.13 把表中一列的所有数字加和

```javascript
const sum = 0
// nth-of-type 属于其父元素的第二个元素 这里是找到第二例所有单元格
const cells = document.querySelectorAll('td:nth-of-type(2)')
cells.forEach(item => {
    sum += parseFloat(item.firstChild.data)
})
```

#### 1.14 在角度和弧度之间转换

```javascript
// 弧度
const radians = degrees * (Math.PI / 180)
// 角度
const degrees = radians * (180 / Math.PI)
```

#### 1.15 找到页面元素可容纳的一个圆的半径和圆心

```javascript
const circleRadius = Math.min(elementWidth, elementHeight) / 2
const x = elementWidth / 2
const y = elementHeight / 2
```

#### 1.16 计算圆弧的长度

```javascript
const radians = degrees * (Math.PI / 180)
// 弧长 = 弧度 * 半径
const arclength = radians * radius
```

#### 1.17 使用ES6字符串新增方法而不会弄丢用户

使用ES6新增的语法比如startsWith()和endWith()等，如何防止低版本用户不能正常使用的问题。

###  第 2 章 JavaScript数组

#### 2.1 在数组中搜索

```javascript
indexOf()
lastIndexOf()
findIndex() // es6
```

#### 2.2 用concat()和apply()将一个二维数组扁平化

总感觉面试哪家公司的时候考到过 0 0

```javascript
const fruitarray = []
fruitarray[0] = ['strawberry', 'orange']
fruitarray[1] = ['lime', 'peach', 'banana']
fruitarray[2] = ['tangerine', 'apricot']
fruitarray[3] = ['raspberry', 'kiwi']
// 方法1
const newArray = Array.prototype.concat.apply([], fruitarray)
// 方法2
const newArray2 = [].concat(...fruitarray)
```

#### 2.3 删除或替换数组元素

splice()

#### 2.4 提取一个数组的一部分

slice() 它执行浅拷贝， 如果元素是对象， 将是拷贝地址值。

#### 2.5 对每个数组元素应用一个函数

forEach() map()

#### 2.6 使用forEach() 和 call() 遍历querySelectorAll()的结果

NodeList是“类数组”，可以强制用forEach()来遍历。

```javascript
const cells = document.querySelector('td + td')
[].forEach.call(cells, function(cell) {
    sum += parseFloat(cell.firstChild.data)
})
```

#### 2.7 对数组中的每个元素执行一个函数并返回一个函数并返回一个新数组

map()

#### 2.8 创建一个过滤后的数组

```javascript
const charSet = ['**', 'bb', 'cd', '**', 'dd', '**']
const newArray = charSet.filter(ele => {
    return ele !== '**'
})
```

#### 2.9 验证数组内容

```javascript
function testValue(element, index, array) {
    const testValue = /^[a-zA-Z]+$/
    return textExp.test(element)
}

const elemSet = ['elephant', 'lion', 'cat', 'dog']
const result = elemSet.every(testValue)
```

#### 2.10 使用一个关联数组来存储表单元素名和值

##### dict模式

创建拥有一个空的原型的对象，以避免已有的属性可能会搞乱应用程序

```javascript
const newMap = {}
const key = 'toString'
console.log(key in newMap) // true
console.log(newMap[key]) // function toString() { [native code] }

const secondMap = Object.create(null)
console.log(key in secondMap) // false
secondMap[key] = 'something diff'
console.log(key in secondMap) // true
console.log(secondMap[key]) // 'something diff'
```

#### 2.11 使用解构赋值简化代码

```javascript
const stateValues = [459, 144, 96, 34, 0, 14]
const  [Arizona, Missouri, Idaho, Nebraska, Texas, Minnesota] = stateValues
```

### 第 3 章 函数：JavaScript中的构建块

#### 3.1 放置函数并提升

```javascript
// 声明式函数，在访问函数之前，提升将确保把函数声明移动到当前作用域顶部。
console.log(test()) // 'hello'
function test() {
    return 'hello'
}

// 而一个函数表达式就会报错
console.log(test()) // test声明了，然而还没有实例化，会报错
const test = function() {
    return 'hello'
}
```

#### 3.2 把一个函数当做参数传递给另一个函数

一个函数接受另一个函数作为参数，或者返回一个函数，或者两者都具备，这称为一个高阶函数。

函数式编程的好处：代码更具有可读性。减少了不可预期的副作用。



给定函数一个相同的数值的时候，总是会得到相同的结果，并且这不回修改任何外部数据或触发任何副作用，这叫做**纯函数**。

#### 3.3 实现递归选法

向要实现一个函数，它递归地便利一个数组并返回一个反向的数组字符串。

```javascript
const reverseArray = function(x, index, str) {
    return index === 0 ? str : reverseArray(x, --index, str += ' ' + x[index])
}
```

递归的一个例子是斐波那契数列：

```javascript
const fibonacci = function(n) {
    return n < 2 ? n : fibonacci(n-1) + fibonacci(n-2)
}
```

阶乘

```javascript
const factorial(n) {
    return n === 1 ? 1 : n * factorial(n-1)
}
```

#### 尾调用优化

ES6提出尾调用优化（tail call optimization）

[阮老师讲尾调用优化](http://www.ruanyifeng.com/blog/2015/04/tail-call.html) 

"调用帧"（call frame）

"调用栈"（call stack）

#### 3.4 使用一个定时器和回调防止代码阻塞

```javascript
const factorial(n) {
    console.log(n)
    return n === 1 ? 1 : n * factorial(n - 1)
}

const noBlock(n, callback) {
    setTimeout(function() {
        const val = factorial(n)
        if(callback && typeof callback === 'function') {
            callback(val)
        }
    }, 0)
}

noBlock(3, function(n) {
    noBlock(n, function(m) {
        console.log(m)
    })
})
```

#### 3.5 创建能够记住状态的函数

闭包  - > 可能会造成持久性内存泄漏

#### 3.6 将函数参数转换到一个数组中

```javascript
function someFunc() {
    const args = Array.propotype.slice.apply(arguments)
}
```

类数组 - > 数组：arguments, NodeList

#### 3.7 使用一个局部应用减少冗余性

局部应用容易和柯里化混淆

```javascript
// 方法1
function partial(fn /*, args*/) {
    const args = Array.prototype.slice.apply(arguments, 1)
    return function() {
        return fn.apply(this, args.concat(Array.prototype.slice.apply(arguments)))
    }
}

function makeString(ldelim, rdelim, str) {
    return ldelim + str + rdelim
}

const namedEntity = partial(makeString, '&#', ';')

console.log(namedEntity(169))
// 方法2
function makeString(ldelim, rdelim, str) {
    return ldelim + str + rdelim
}

const named = makeString.bind('&#', ';')

console.log(named(169))
```

#### 3.8使用缓存计算来提高程序性能

```javascript
const fibonacci = function() {
    
}
```



## 第二部分 JavaScript 全面兴起

