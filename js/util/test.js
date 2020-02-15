const url = 'easy://openTask?&task_id=1';
const coverdomain = url.substring(7)
const findIndex = coverdomain.indexOf('?');
const funName = coverdomain.substring(0,findIndex);
const paramsStr = coverdomain.substring(findIndex+2);

console.log(funName,paramsStr);