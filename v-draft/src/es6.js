/*函数体只有一条return语句的时候可以不打大括号*/
// const double = x => x*2
// console.log(double(2))

/*默认参数*/
// const hello = (name='betamee') => {
//     console.log(name)
// }
// hello()  
// hello('Vickie')

/*展开运算符*/
// function hello(name1,name2) {
//     console.log(name1,name2)
// }
// arr = ['henry','vickie']
// hello(...arr)

/*object*/
// const obj = {
//     name:'imooc',
//     course:'React开发APP'
// }
// console.log(Object.keys(obj))
// console.log(Object.values(obj))
// console.log(Object.entries(obj))

// const name = 'imooc'
// const obj = {
//     [name]: 'hello',
//     hello(){ }
// }
// console.log(obj)

// const obj1 = {
//     name: 'imooc',
//     couse: 'React'
// }
// const obj2 = {
//     type: 'IT',
//     name: 'Vickie'
// }
// console.log({...obj1,...obj2,data:'2017'})

/*解构赋值*/
// const obj = {
//     name: 'imooc',
//     course: 'React'
// }
// const {name,course} = obj
// console.log(name, '|', course )

/*常见代码片段*/
let arr = [1, 2, 3]
console.log(arr.map(function(v){
    return v*2
}))
console.log(arr.map(v => v*2))

