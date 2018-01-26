# 《Node.js开发指南》读书笔记
关键字
```
异步式I/O
事件驱动
V8引擎
libuv
REPL read-eval-print loop
为网络诞生的平台
单线程非阻塞i/o相较于多线程阻塞i／o节省了创建多线程的开销
缺点是不符合设计思维，让流程控制变得晦涩难懂
node不鼓励使用同步io
模块和包机制参照了CommonJS的标准，但并未完全遵循 
Node--npm Python--pip Ruby--gem
npm安装包时如果注册在本地可以通过require引用，如果需要使用命令行，则需安装到全局（安装到全局时配置了PATH）
```
监控模块的工具
```
nodemon 
suepervisor
node-dev
```
# 核心模块
## 全局对象
* process
* console
## 常用工具
* util.inherits
* util.inspect（将任意对象转换为字符串）
## 事件机制(最重要的模块没有之一)
EventEmitter
## 文件系统访问
文件的读取、写入、更名、删除、遍历目录、链接
* fs.readFile()
* fs.readFileSync()
* fs.open()
* fs.read()
## HTTP 服务器与客户端
