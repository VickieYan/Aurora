// 全局的发布-订阅对象
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

