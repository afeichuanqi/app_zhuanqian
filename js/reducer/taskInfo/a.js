// Function.prototype.myCall = function (fn, ...agrs) {
//     const thisAgr = Symbol();
//     fn[thisAgr] = this;
//     fn[thisAgr](agrs);
//     delete fn[thisAgr];
// }
//
// function add (b,c){
//     console.log(this.a)
//     console.log(b)
//     console.log(c)
// }
// const params = {a:1}
// // add.myCall(params);
//
// Function.prototype.myBind = function (fn) {
//     const context = this;
//     const fristAgrs = Array.prototype.slice.call(arguments,1);
//     const EmptyFun = function () {};
//     const newFn = function () {
//         const isNew = this instanceof context;
//         console.log(isNew)
//         context.apply(isNew ? this : fn, fristAgrs.concat(Array.from(arguments)))
//     }
//     if (this.prototype) {
//         EmptyFun.prototype = this.prototype;
//     }
//     newFn.prototype = new EmptyFun()
//     return newFn
// }
// const Addbind = add.myBind(params, 2,3)
// // addBind(3);
// const addB = new Addbind(1,2);

// var a1 = { name: 'a1', render = () => [b1, b2, b3] }
// var b1 = { name: 'b1', render = () => [c1] }
// var b2 = { name: 'b2', render = () => [c2] }
// var b3 = { name: 'b3', render = () => [] }
// var c1 = { name: 'c1', render = () => [d1] }
// var c2 = { name: 'c2', render = () => [] }
// var d1 = { name: 'd1', render = () => [d2] }
// var d2 = { name: 'd2', render = () => [] }
function add (a) {
    return function (b) {
        return a + b
    }
}
console.log(add(1))