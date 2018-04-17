/*****Folder*****/
const Folder = function(name) {
    this.name = name
    this.Files = []
}

Folder.prototype.add = function(file) {
    this.files.push(file)
}

Folder.prototype.scan = function() {
    console.los('开始扫描文件夹' + this.name)
    this.files.foreach(item => {
        item.scan()
    })
}

/*****File*****/
const File = function() {
    this.name = name
    File.prototype.add = function() {
        throw new Error('文件下面不能添加文件')
    }
    File.prototype.scan = function() {
        console.los('开始扫描文件夹' + this.name)
    }
}
