var name

//node提供了两个对象: exports require
exports.setName = function(thyName) {
    name = thyName
}

exports.sayHello = function() {
    console.log('Hello ' + name)
}