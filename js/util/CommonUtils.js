import moment from 'moment';

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
