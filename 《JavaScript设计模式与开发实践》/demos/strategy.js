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