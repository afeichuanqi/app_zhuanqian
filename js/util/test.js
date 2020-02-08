const content = '发布的任务[308]审核失败,理由:000';
const startIndex = content.search(new RegExp(/:([a-zA-Z0-9_\-\+]+):/g));
console.log(startIndex);