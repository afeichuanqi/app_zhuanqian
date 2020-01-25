import moment from 'moment';
import React from 'react';
import {Text} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Emoji from 'react-native-emoji';

export const isPoneAvailable = (str) => {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (str.length == 0 || str == null) {
        return false;
    } else if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
};
export const formatData = (data, insertData, ziduan) => {
    const oldData = [...data];
    for (let i = 0; i < insertData.length; i++) {
        const lastItem = oldData.length > 0 ? oldData[oldData.length - 1] : {[ziduan]: '0000-00-00'};
        const lastViewDate1 = lastItem[ziduan];
        const newitem = insertData[i];
        const newViewDate1 = newitem[ziduan];
        if (lastViewDate1.substring(0, 10) == newViewDate1.substring(0, 10)) {
            oldData.push(newitem);
        } else {
            oldData.push({time: newViewDate1.substring(0, 10)});
            oldData.push(newitem);
        }
    }
    return oldData;
};
export const getCurrentTime = (time = 0) => {
    const nowTime = new Date(); // 当前日前对象
    const myyear = nowTime.getFullYear(); // 当前年份
    const myday = nowTime.getDay(); // 当前星期
    const delay = moment().diff(moment(time).toArray().slice(0, 3), 'days'); // 时间差
    const old = new Date(parseInt(time)); // 目标日期对象
    const oldyear = old.getFullYear(); // 目标年份
    const oldm = old.getMonth() + 1; // 目标月份
    const oldd = old.getDate(); // 目标日期
    const oldday = old.getDay(); // 目标星期
    const oldh = old.getHours(); // 目标时
    const oldmin = old.getMinutes() < 10 ? `0${old.getMinutes()}` : old.getMinutes(); // 目标分
    // 时间在一天之内只返回时分
    if (delay == 0) {
        return `${oldh}:${oldmin}`;
    }
    // 时间在两天之内的
    if (delay == 1) {
        return `昨天 ${oldh}:${oldmin}`;
    }

    // 当前星期内
    if (delay > 1 && myday > oldday && delay < 7) {
        let xingqi;
        switch (oldday) {
            case 0:
                xingqi = `星期日`;
                break;
            case 1:
                xingqi = `星期一`;
                break;
            case 2:
                xingqi = `星期二`;
                break;
            case 3:
                xingqi = `星期三`;
                break;
            case 4:
                xingqi = `星期四`;
                break;
            case 5:
                xingqi = `星期五`;
                break;
            case 6:
                xingqi = `星期六`;
                break;
        }
        return `${xingqi} ${oldh}:${oldmin}`;
    }

    if (delay > 1 && myday === oldday && oldyear === myyear) {
        return `${oldm}月${oldd}日 ${oldh}:${oldmin}`;
    }

    if (delay > 1 && myday === oldday && oldyear < myyear) {
        return `${oldyear}年${oldm}月${oldd}日 ${oldh}:${oldmin}`;
    }

    if (delay > 1 && myday < oldday && oldyear === myyear) {
        return `${oldm}月${oldd}日 ${oldh}:${oldmin}`;
    }

    if (delay > 1 && myday > oldday && oldyear === myyear && delay > 7) {
        return `${oldm}月${oldd}日 ${oldh}:${oldmin}`;
    }

    if (delay > 1 && myday > oldday && delay >= 7 && oldyear < myyear) {
        return `${oldyear}年${oldm}月${oldd}日 ${oldh}:${oldmin}`;
    }

    if (delay > 1 && myday < oldday && oldyear < myyear) {
        return `${oldyear}年${oldm}月${oldd}日 ${oldh}:${oldmin}`;
    }
};
export const getUUID = () => {
    var s = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
};
export const judgeTaskData = (data, update) => {
    const {
        task_type_id,
        task_device_id,
        task_name,
        task_title,
        task_info,
        order_time_limit_id,
        review_time,
        single_order_id,
        reward_price,
        reward_num,
        task_steps,
        task_id,
    } = data;
    if (!task_type_id || task_type_id === 0) {
        return '请认真填写任务类型哦 ~ ~';
    }
    if (!task_device_id || task_device_id === 0) {
        return '请认真填写设备类型哦 ~ ~';
    }
    if (!task_name || task_name.length === 0) {
        return '项目名称没写哦 ~ ~';
    }
    if (!task_title || task_title.length === 0) {
        return '标题是重点 但是您却忘了 ~ ~';
    }
    if (!task_info || task_info.length === 0) {
        return '任务说明是重点 但是您却忘了 ~ ~';
    }
    if (!order_time_limit_id || order_time_limit_id === 0) {
        return '接单时限您是不是忘记选了 ~ ~';
    }
    if (!review_time || review_time === 0) {
        return '审核时限您是不是忘记选了 ~ ~';
    }
    if (!single_order_id || single_order_id === 0) {
        return '用户做单次数您是不是忘记选了 ~ ~';
    }
    if (!update) {
        if (!reward_price || reward_price === 0) {
            return '悬赏单价记得填写哦 ~ ~';
        }
        if (!reward_num || reward_num === 0) {
            return '悬赏数量记得填写哦 ~ ~';
        }
    } else {
        if (!task_id) {
            return '数据发生错误 ~ ~';
        }
    }

    try {
        const obj = JSON.parse(task_steps);
        if (obj.length === 0) {
            return '任务步骤太少哦 至少要一项任务步骤 ';
        }
        // console.log(obj.length,"obj.length");
        let yanzhengtuNum = 0;

        for (let index = 0; index < obj.length; index++) {
            const item = obj[index];
            const {typeData, type} = item;
            if (typeData && typeData.uri) {
                if (typeData.uri.indexOf('file://') !== -1) {
                    return `您步骤${index + 1}图片未上传成功,请仔细检查`;
                }
            }
            if (type !== 6 && typeData.info.length === 0) {
                return `您步骤${index + 1}说明是不是太短了呀`;
            }
            if (type === 6 && typeData.collectInfo.length === 0) {
                return `您步骤${index + 1}说明是不是太短了呀`;
            }
            if (type === 5) {
                yanzhengtuNum += 1;
            }
        }
        if (yanzhengtuNum === 0) {
            return `必须要有一张验证图哦`;
        }


    } catch (e) {
        // console.log(e.toString());
        return '检查任务步骤';
    }
    return '';
};
export const judgeSendTaskData = (task_step_data) => {

    try {
        const obj = JSON.parse(task_step_data);
        for (let index = 0; index < obj.length; index++) {
            const item = obj[index];
            const typeData = item.typeData;
            if (item.type === 5) {

                // console.log(item,item.uploadStatus1);
                const uploadStatus1 = item.uploadStatus1;
                // console.log(isNaN(uploadStatus1),uploadStatus1 !== 1,!typeData.uri1,typeData.uri1.indexOf('file://')!==-1);
                if (isNaN(uploadStatus1)) {
                    return `您步骤${index + 1}验证图未上传`;
                }
                if (uploadStatus1 !== 1) {
                    return `您步骤${index + 1}验证图未上传成功`;
                }
                // console.log('typeData.uri1', typeData.uri1);
                if (!typeData.uri1) {
                    return `您步骤${index + 1}验证图未上传`;
                }
                if (typeData.uri1.indexOf('file://') !== -1) {
                    return `您步骤${index + 1}验证图未上传成功`;
                }

            }
            if (item.type === 6) {
                if (!typeData.collectInfoContent || typeData.collectInfoContent.length === 0) {
                    return `您步骤${index + 1}收集信息未填写`;
                }
            }
        }

    } catch (e) {
        // console.log(e.toString());
        return '检查任务步骤是否正确填写完毕';
    }
    return '';
};
export const equalsObj = (oldData, newData) => {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) {
        return true;
    }
    if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
        // 类型为对象并且元素个数相同

        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
                if (!equalsObj(oldData[key], newData[key]))
                    // 对象中具有不相同属性 返回false
                {
                    return false;
                }
            }
        }
    } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
        // 类型为数组并且数组长度相同

        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!equalsObj(oldData[i], newData[i]))
                // 如果数组元素中具有不相同元素,返回false
            {
                return false;
            }
        }
    } else {
        // 其它类型,均返回false
        return false;
    }

    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
};
export const renderEmoji = (content, Views, fontSize, index = 0, color = 'black',style_) => {
    // console.log("renderEmojirenderEmoji");

    // index += 1;
    const startIndex = content.search(new RegExp(/:([a-zA-Z0-9_\-\+]+):/g));
    const endIndex = content.indexOf(':', startIndex + 1) + 1;
    const contentText = content.substring(0, startIndex);
    if (contentText.length > 0) {
        Views.push(<Text  key={`startText${Math.random() * 100}`} style={{fontSize, color,...style_}}>{contentText}</Text>);
    }
    if (startIndex !== -1) {
        Views.push(<Emoji key={`Emoji${Math.random() * 100}`} name={content.substring(startIndex, endIndex)} style={{fontSize}}/>);

    } else {
        if (endIndex !== content.length) {
            Views.push(<Text key={`endText${Math.random() * 100}`}
                             style={{fontSize, color,...style_}}>{content.substring(endIndex, content.length)}</Text>);
        }

        return Views;
    }

    return renderEmoji(content.substring(endIndex), Views);
};
export const _renderEmoji = (content, Views, fontSize, index = 0, color = 'black') => {
    index += 1;
    const startIndex = content.search(new RegExp(/:([a-zA-Z0-9_\-\+]+):/g));
    const endIndex = content.indexOf(':', startIndex + 1) + 1;
    const contentText = content.substring(0, startIndex);
    if (contentText.length > 0) {
        Views.push(<Text key={`startText${index}`} style={{fontSize, color}}>{contentText}</Text>);
    }
    if (startIndex !== -1) {
        Views.push(<Emoji key={`Emoji${index}`} name={content.substring(startIndex, endIndex)} style={{fontSize}}/>);

    } else {
        if (endIndex !== content.length) {
            Views.push(<Text key={`endText${index}`}
                             style={{fontSize, color}}>{content.substring(endIndex, content.length)}</Text>);
        }

        return Views;
    }

    return renderEmoji(content.substring(endIndex), Views);
};
// export const getEmojis = (content) => {
//     let contentTmp = content;
//
//     const emoji = new RegExp(/:([a-zA-Z0-9_\-\+]+):/g);
//     let castArr = contentTmp.match(emoji);
//     const emojiArr = [];
//     if (castArr) {
//         castArr.forEach((item) => {
//             emojiArr.push(item);
//             contentTmp = contentTmp.replace(item, '');
//         });
//         return {
//             content: contentTmp,
//             emojiArr,
//         };
//     } else {
//         return null;
//     }
//
// };

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};
