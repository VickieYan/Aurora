# 《Node.js 开发指南》

关键字

*   异步式 I/O
*   事件驱动
*   V8 引擎
*   libuv
*   REPL read-eval-print loop
*   为网络诞生的平台
*   单线程非阻塞 i/o 相较于多线程阻塞 i／o 节省了创建多线程的开销
*   缺点是不符合设计思维，让流程控制变得晦涩难懂
*   node 不鼓励使用同步 io
*   模块和包机制参照了 CommonJS 的标准，但并未完全遵循
*   Node--npm Python--pip Ruby--gem
*   npm 安装包时如果注册在本地可以通过 require 引用，如果需要使用命令行，则需安装到全局（安装到全局时配置了 PATH）
*   Express 在处理路由规则时，会优先匹配先定义的路由规则
*   connect-mongo

监控模块的工具

```
nodemon
suepervisor
node-dev
```

# 核心模块

## 全局对象

*   process
*   console

## 常用工具

*   util.inherits
*   util.inspect（将任意对象转换为字符串）

## 事件机制(最重要的模块没有之一)

EventEmitter

## 文件系统访问

文件的读取、写入、更名、删除、遍历目录、链接

*   fs.readFile()
*   fs.readFileSync()
*   fs.open()
*   fs.read()

## HTTP 服务器与客户端

*   app.all() 支持把所有的请求绑定到同一个响应函数
*   next() 转移控制权

# REST(Representational State Transfer) 表征状态转移

*   GET（获取）： 请求获取制定资源
*   HEAD： 请求制定资源的响应头
*   POST（新增）： 向指定资源提交数据
*   PUT（更新）： 请求服务器存储一个资源
*   DELETE（删除）： 请求服务器删除指定资源
*   TRACE: 回显服务器收到的请求，主要用于测试或诊断
*   CONNECT： HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器（？）
*   OPTIONS： 返回服务器支持的 HTTP 请求方式

# ejs 语法

*   <% code %>: JavaScript 代码
*   <%= code %>: 显示替换过 HTML 特殊字符的内容
*   <%- code %>: 显示原始 HTML 内容

# Q&A

## app.all('\*') and app.use('/') 的区别

app.use 只匹配前缀

```
app.use( "/product" , mymiddleware);
// will match /product
// will match /product/cool
// will match /product/foo
```

app.all 匹配完整路径

```
app.all( "/product" , handler);
// will match /product
// won't match /product/cool   <-- important
// won't match /product/foo    <-- important

app.all( "/product/*" , handler);
// won't match /product        <-- Important
// will match /product/cool
// will match /product/foo
```

## Using Partials in a Jade file

Jade newest version doesn't support partials.

## HTTP 是一个无状态的协议。这句话里的无状态是什么意思？

```
有状态：
A：你今天中午吃的啥？
B：吃的大盘鸡。
A：味道怎么样呀？
B：还不错，挺好吃的。

无状态：
A：你今天中午吃的啥？
B：吃的大盘鸡。
A：味道怎么样呀？
B：？？？啊？啥？啥味道怎么样？

所以需要cookie这种东西：
A：你今天中午吃的啥？
B：吃的大盘鸡。
A：你今天中午吃的大盘鸡味道怎么样呀？
B：还不错，挺好吃的。
```
