var fs = require('fs')
// //异步读取文件
// //readFile(文件名, 编码方式, 回调)
// fs.readFile('file.txt', 'utf-8', function(err, data) {
//     if(err) {
//         console.error(err)
//     }else {
//         console.log(data)
//     }
// })

// console.log('end.')

// var fs = require('fs')
// //同步加载文件
// var data = fs.readFileSync('file.txt', 'utf-8')
// console.log(data)
// console.log('end.')

fs.open('file.txt', 'r', function(err, fd) {
    if (err) {
        console.error(err)
        return
    }
    var buf = new Buffer(8)
    fs.read(fd, buf, 0, 8, null, function(err, bytesRead, buffer) {
        if (err) {
            console.error(err)
            return
        }
        console.log('bytesRead: ' + bytesRead)
        console.log(buffer)
    })
})