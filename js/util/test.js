const emoji = new RegExp(/:([a-zA-Z0-9_\-\+]+):/g);

let str = 'Sdadsadsa:sa:';
let emojiIndex = str.search(emoji);
console.log(emojiIndex);

let castStr = str.match(emoji);

if(castStr){
    castStr.forEach((item)=>{
        str = str.replace(item,'')
    })
    console.log(str);
}

