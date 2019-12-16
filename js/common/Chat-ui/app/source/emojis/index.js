import xiao from './xiao.png'  /* 高兴 */
import daxiao from './daxiao.png'  /* 口罩 */
import bizui from './bizui.png'  /* 笑哭 */
import kouzhao from './kouzhao.png'  /* 吐舌头 */
import ku from './ku.png'  /* 傻呆 */
import mianwubiaoqi from './mianwubiaoqi.png'  /* 恐惧 */
import outu from './outu.png'  /* 悲伤 */
import qinwen from './qinwen.png'  /* 不屑 */
import relian from './relian.png'  /* 嘿哈 */
import shengqi from './shengqi.png'  /* 捂脸 */
import shoushang from './shoushang.png'  /* 奸笑 */
import sikao from './sikao.png'  /* 机智 */
import tushe from './tushe.png'  /* 皱眉 */
import xieyan from './xieyan.png'  /* 耶 */
import zhongdu from './zhongdu.png'  /* 耶 */
import xiaoku from './xiaoku.png'  /* 耶 */
import diluo from './diluo.png'  /* 耶 */
import mengb from './mengb.png'  /* 耶 */
import jiangshi from './jiangshi.png'  /* 耶 */
import haipa from './haipa.png'  /* 耶 */





export const EMOJIS_DATA = {
  '/{xiao}': xiao,/* 高兴 */
  '/{daxiao}': daxiao,/* 口罩 */
  '/{bizui}': bizui,/* 笑哭 */
  '/{kouzhao}': kouzhao,/* 吐舌头 */
  '/{ku}': ku,/* 傻呆 */
  '/{mianwubiaoqi}': mianwubiaoqi,/* 恐惧 */
  '/{outu}': outu,/* 悲伤 */
  '/{qinwen}': qinwen,/* 不屑 */
  '/{relian}': relian,/* 嘿哈 */
  '/{shengqi}': shengqi,/* 捂脸 */
  '/{shoushang}': shoushang,/* 奸笑 */
  '/{sikao}': sikao,/* 机智 */
  '/{tushe}': tushe,/* 耶 */
  '/{xieyan}': xieyan,/* 耶 */
  '/{zhongdu}': zhongdu,/* 耶 */
  '/{xiaoku}': xiaoku,/* 耶 */
  '/{diluo}': diluo,/* 耶 */
  '/{mengb}': mengb,/* 耶 */
  '/{jiangshi}': jiangshi,/* 耶 */
  '/{haipa}': haipa,/* 耶 */
};

//符号->中文
export const EMOJIS_ZH = {
  '/{xiao}': '[笑]',
  '/{daxiao}': '[大笑]',
  '/{bizui}':  '[闭嘴]',
  '/{kouzhao}':  '[口罩]',
  '/{ku}':  '[酷]',
  '/{mianwubiaoqi}':  '[面无表情]',
  '/{outu}':  '[呕吐]',
  '/{qinwen}': '[亲吻]',
  '/{relian}':  '[热恋]',
  '/{shengqi}':  '[生气]',
  '/{shoushang}':  '[受伤]',
  '/{sikao}':  '[思考]',
  '/{tushe}':  '[吐舌]',
  '/{xieyan}':  '[斜眼]',
  '/{zhongdu}':  '[中毒]',
  '/{xiaoku}':  '[笑哭]',
  '/{diluo}':  '[低落]',
  '/{mengb}':  '[懵了]',
  '/{jiangshi}':  '[僵尸]',
  '/{haipa}':  '[害怕]',
}

export const invertKeyValues = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key;
    return acc;
  }, {});

const default_emoji = () => {
  let strMap = new Map()
  let index = 0
  let data = []
  for (let key of Object.keys(EMOJIS_DATA)) {
    strMap.set(key, EMOJIS_DATA[key])
  }
  for (let val of strMap.keys()) {
    data.push({
      key:index,
      value:val,
    });
    index++
  }

  let page0 = data.slice(0,25)
  // let page1 = data.slice(23,46)
  // let page2 = data.slice(46,69)
  // let page3 = data.slice(69,92)
  // let page4 = data.slice(92,115)

  page0.push({
    key:100,
    value:'/{del}'
  });
  // page1.push({
  //   key:101,
  //   value:'/{del}'
  // });
  // page2.push({
  //   key:102,
  //   value:'/{del}'
  // });
  // page3.push({
  //   key:103,
  //   value:'/{del}'
  // });
  // page4.push({
  //   key:104,
  //   value:'/{del}'
  // });
  // return [page0, page1, page2, page3, page4]
  return [page0]
}

export const DEFAULT_EMOJI = default_emoji()
