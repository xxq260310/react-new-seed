/*
 * 格式化钱款数据和单位
 * 入参： 190000000 转化成 { value: '1.90', unit: '亿元' }
 */
const formatAsset = (num) => {
  // 数字常量
  const WAN = 1e4;
  const YI = 1e8;
  const WANYI = 1e12;

  // 单位常量
  const UNIT_DEFAULT = '元';
  const UNIT_WAN = '万元';
  const UNIT_YI = '亿元';
  const UNIT_WANYI = '万亿元';

  const newNum = Number(num);
  const absNum = Math.abs(newNum);

  if (absNum >= WANYI) {
    return {
      value: Number((newNum / WANYI).toFixed(2)),
      unit: UNIT_WANYI,
    };
  }
  if (absNum >= YI) {
    return {
      value: Number((newNum / YI).toFixed(2)),
      unit: UNIT_YI,
    };
  }
  if (absNum >= WAN) {
    return {
      value: Number((newNum / WAN).toFixed(2)),
      unit: UNIT_WAN,
    };
  }
  return { value: Number(newNum.toFixed(2)), unit: UNIT_DEFAULT };
};

export default {
  formatAsset,
};
