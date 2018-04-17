// 缓存代理
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
