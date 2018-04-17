// 外部迭代器
const each = function(ary, callback) {
    const l = ary.length
    for (let i = 0; i < l; i++) {
        callback.call(ary[i], i, ary[i])
    }
}

// 内部迭代器
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
