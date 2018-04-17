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
