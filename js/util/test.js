const localEmoji = new RegExp(/:([a-zA-Z0-9_\-\+]+):/g);
const Viewssss = [];

console.log(renderEmoji('微信注册 一个一块:yum::yum::yum:',Viewssss));

function renderEmoji(content,Views) {
    const startIndex = content.search(localEmoji);
    const endIndex = content.indexOf(':', startIndex + 1) + 1;
    const contentText = content.substring(0, startIndex);
    if (contentText.length > 0) {
        Views.push(contentText);
    }
    if (startIndex !== -1) {
        Views.push(`表情${content.substring(startIndex, endIndex)}表情`);

    }else{
        if(endIndex!==content.length){
            Views.push(content.substring(endIndex,content.length));
        }
        return Views;
    }

    return renderEmoji(content.substring(endIndex),Views);
}