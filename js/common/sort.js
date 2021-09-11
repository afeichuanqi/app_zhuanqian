// // function getDoubleNumForMap (arr) {
// //     const saveDoubleMap = new Map();
// //     for (let i = 0; i< arr.length; i++ ) {
// //         const currentNum = arr[i];
// //         if (!saveDoubleMap.has(currentNum)) saveDoubleMap.set(currentNum,1);
// //         for (let j = i + 1; j< arr.length; j++) {
// //             const nextNum = arr[j];
// //             if (currentNum === nextNum) {
// //                 saveDoubleMap.set(currentNum, saveDoubleMap.get(currentNum) + 1);
// //             }
// //         }
// //     }
// //     const sortArr = Array.from(saveDoubleMap).sort((current, next) => {
// //         if (current[1] < next[1]) return 1
// //         if (current[1] > next[1]) return -1
// //         return 0
// //     })
// //     console.log('出现次数最多的是' + sortArr[0][0])
// //     console.log('次数' + sortArr[0][1])
// //     return saveDoubleMap;
// // }
// //
// // const arr = [1,2,3,3,4,5,6];
// // const doubleMap = getDoubleNumForMap(arr);
// // console.log(doubleMap)
// var arr = [1,1,1,2,2,2,2,2,2,2,3,3,3,4,4,5,6,7,7,8];
// var maxNum = 0;
// var maxName = "";
// var obj = {};
// arr.forEach((ele,index)=>{
//     obj[ele] ? obj[ele] += 1 : obj[ele] = 1;
// })
// for(let r in obj) {
//     if(obj[r]>maxNum){
//         maxNum = obj[r]
//     }
// }
// console.log(`最多重复的数${maxName},重复次数为:${maxNum}`)
// const a = {
//     b: 2,
//     foo: function () { console.log(this.b) }
// }
//
// function b(foo) {
//     // 输出什么？
//     foo()
// }
//
// b(a.foo)
console.log(+ '1888888888787878')