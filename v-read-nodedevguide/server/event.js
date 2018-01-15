var EventEmitter = require('events').EventEmitter
var event = new EventEmitter()

//注册监听器
event.on('some_event', function() {
    console.log('some_event occured.')
})

setTimeout(function() {
    //发射事件
    event.emit('some_event')
},1000)