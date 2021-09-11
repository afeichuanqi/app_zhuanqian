// const http = new XMLHttpRequest();
// http.open('POST', 'http://www.baidu.com')
// http.send('userName=p&passWord=a')
// http.onreadystatechange = function () {
//     if (http.readyState === 4 && http.status === 200) {
//     console.log(http.responseText)
//
//     }
// }

// 定义一个立即执行函数,传入生成的依赖关系图
// ;(function(graph) {
//     // 重写require函数
//     function require(moduleId) {
//         // 找到对应moduleId的依赖对象,调用require函数,eval执行,拿到exports对象
//         function localRequire(relativePath) {
//             return require(graph[moduleId].dependecies[relativePath]) // {__esModule: true, say: ƒ say(name)}
//         }
//         // 定义exports对象
//         var exports = {}
//         ;(function(require, exports, code) {
//             // commonjs语法使用module.exports暴露实现,我们传入的exports对象会捕获依赖对象(hello.js)暴露的实现(exports.say = say)并写入
//             eval(code)
//         })(localRequire, exports, graph[moduleId].code)
//         // 暴露exports对象,即暴露依赖对象对应的实现
//         return exports
//     }
//     // 从入口文件开始执行
//     require('./src/index.js')
// })({
//     './src/index.js': {
//         dependecies: { './hello.js': './src/hello.js' },
//         code: '"use strict";\n\nvar _hello = require("./hello.js");\n\nconsole.log.write((0, _hello.say)("webpack"));'
//     },
//     './src/hello.js': {
//         dependecies: {},
//         code:
//             '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}'
//     }
// })
// const map = new Map();
// // map.set(true,1);
// // console.log(map.get(true))
// function Animal () {
//     this.a = 1
// }
// Animal.prototype.sayHi = function () {console.log('hi')}
// function Cat () {
//     Animal.call(this);
// }
// const superProto = Object.create(Animal.prototype);
// superProto.constructor = Cat;
// Cat.prototype = superProto;
// Cat.prototype.constructor = Cat;
//
// const cat = new Cat();
// console.log(cat.a,cat.sayHi())
// function* a () {
//     yield 1+1;
//     yield 2+2;
//     return 'success'
// }
// const b = a();
// console.log(b.next())
// console.log(b.next())
// function Node(num)
// // {
// //        this.num   = num;
// //        this.count = 1;
// //        this.pLeft = null;
// //        this.pRight = null;
// //     }
// //
// //
// // function createNode(value)
// //  {
// //          var pNode      = new Node(value);
// //          pNode.num    = value;
// //          pNode.count  = 1;
// //          pNode.pLeft  = null;
// //          pNode.pRight = null;return pNode;
// //      }
// //
// //
// //  function  addNode(value, pNode)
// //  {
// //          if (pNode == null){
// //              return createNode(value);
// //           }
// //        if (value == pNode.num){
// //                  pNode.count++;
// //                  return pNode;
// //              }
// //          if (value < pNode.num){
// //                  if (pNode.pLeft == null){
// //                          pNode.pLeft = createNode(value);
// //                          return pNode.pLeft;
// //                      }else{
// //                          return addNode(value, pNode.pLeft);
// //                      }
// //              }else{
// //                  if (pNode.pRight == null){
// //                         pNode.pRight = createNode(value);
// //                         return pNode.pRight;
// //                    }else{
// //                        return addNode(value, pNode.pRight);
// //                      }
// //             }
// //      }
// //
// //  var list = [10,8,15,2,14,16,20,7,5,13,60,34,1,10];
// //  var pRoot = null;
// //  var lent = list.length;
// //
// //  for(var i=0; i<lent; i++){
// //          if (pRoot==null){
// //                  pRoot = createNode(list[i]);
// //          }else{
// //                  addNode(list[i], pRoot);
// //              }
// //      }
// // console.info(pRoot);

// const a = [1,[2,3,[4,5]]]
// console.log(new Set(a));
console.log(Array.toString())