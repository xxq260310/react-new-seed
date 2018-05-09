// 对用户数进行特殊处理
import FixNumber from '../chartRealTime/FixNumber';

export default {};

export const toFixedCust = (series) => {
  let newUnit = '户';
  const tempSeries = series.map(n => Math.abs(n));
  let newSeries = series;
  const max = Math.max(...tempSeries);
  // 1. 全部在万元以下的数据不做处理
  // 2.超过万元的，以‘万元’为单位
  // 3.超过亿元的，以‘亿元’为单位

  if (max >= 10000) {
    newUnit = '万户';
    newSeries = series.map(item => FixNumber.toFixedDecimal(item / 10000));
  } else {
    newUnit = '户';
    newSeries = series.map(item => FixNumber.toFixedDecimal(item));
  }

  return {
    newUnit,
    newSeries,
  };
};

/**
 * 针对小数，获取最大值，最小值
 * @param {*} type 类型，max或者min
 * @param {*} value 数值
 */
export const getMaxAndMinDecimal = (type, value) => {
  let newValue = value;
  const afterPointValue = newValue.toString().split('.')[1];
  if (afterPointValue.length === 1) {
    // 0.5
    newValue = type === 'max' ? (newValue + 0.1).toFixed(1) : (newValue - 0.1).toFixed(1);
  } else if (afterPointValue.length === 2) {
    // 0.05
    newValue = type === 'max' ? (newValue + 0.01).toFixed(2) : (newValue - 0.01).toFixed(2);
  } else if (afterPointValue.length === 1) {
    // 0.005
    newValue = type === 'max' ? (newValue + 0.001).toFixed(3) : (newValue - 0.001).toFixed(3);
  }

  return newValue;
};

/**
   * 获取最大值或者最小值
   * @param {*} m 数值
   * @param {*} type 类型，max或者min
   */
export const padFixedValue = (m, type) => {
  const value = Math.abs(m) || 0;
  let newValue = value;
  if (newValue >= 1) {
    newValue = type === 'max' ? Math.ceil(newValue) : Math.floor(newValue);
  } else if (newValue > 0) {
    newValue = getMaxAndMinDecimal(type, newValue);
  }
  return newValue;
};

// 针对金额确认图表最大和最小值
export const getMaxAndMinMoney = (series) => {
  let max = Math.max(...series);
  let min = Math.min(...series);
  // 处理只有一条数据的情况
  if (max === min) {
    min = 0;
  }
  max = padFixedValue(max, 'max');
  min = padFixedValue(min, 'min');
  if (max === 0 && min === 0) {
    max = 1;
  }
  return { max, min };
};

// 针对户获取图表最大和最小值
export const getMaxAndMinCust = (series) => {
  let max = Math.max(...series);
  let min = Math.min(...series);
  // 处理只有一条数据的情况
  if (max === min) {
    min = 0;
  }
  max = padFixedValue(max, 'max');
  min = padFixedValue(min, 'min');

  return { max, min };
};

// 针对次数获取图标最大和最小值
export const getMaxAndMinCi = (series) => {
  let max = Math.max(...series);
  let min = Math.min(...series);
  // 处理只有一条数据的情况
  if (max === min) {
    min = 0;
  }
  // 次数肯定都是正数
  max = padFixedValue(max, 'max');
  min = padFixedValue(min, 'min');
  return { max, min };
};

// 针对任务完成数的最大和最小值
export const getMaxAndMinGE = (series) => {
  let max = Math.max(...series);
  let min = Math.min(...series);
  // 处理只有一条数据的情况
  if (max === min) {
    min = 0;
  }
  // 个数肯定都是正数
  max = padFixedValue(max, 'max');
  min = padFixedValue(min, 'min');
  return { max, min };
};

// 针对百分比、千分比确认图表最大和最小值
// 针对百分比、千分比的数字来确认图表坐标轴的最大和最小值
// 不要设置最大值为100，不然会出现折线图很矮
export const getMaxAndMinPercentOrPermillage = (series) => {
  let max = Math.max(...series);
  let min = Math.min(...series);
  // 处理只有一条数据的情况
  if (max === min) {
    min = 0;
  }

  if (max >= 1) {
    max = Math.ceil(max).toFixed(0);
  } else if (max > 0) {
    max = getMaxAndMinDecimal('max', max);
  }

  if (min >= 1) {
    min = Math.floor(min).toFixed(0);
  } else if (min > 0) {
    min = getMaxAndMinDecimal('min', min);
  }

  if (max === 0) {
    max = 1;
  }
  if (min <= 0) {
    min = 0;
  }
  return {
    max,
    min,
  };
};

// 针对百分比数据进行处理
export const toFixedPercent = (series, isCommissionRate) =>
  series.map(o => FixNumber.toFixedDecimal(o * 100, isCommissionRate));

// 针对千分比数据进行处理
export const toFixedPermillage = (series, isCommissionRate) =>
  series.map(o => FixNumber.toFixedDecimal(o * 1000, isCommissionRate));

// 对人数进行特殊处理
export const toFixedRen = (series) => {
  let newUnit = '人';
  const tempSeries = series.map(n => Math.abs(n));
  let newSeries = series;
  const max = Math.max(...tempSeries);
  // 1. 全部在万元以下的数据不做处理
  // 2.超过万元的，以‘万元’为单位
  // 3.超过亿元的，以‘亿元’为单位
  if (max >= 10000) {
    newUnit = '万人';
    newSeries = series.map(item => FixNumber.toFixedDecimal(item / 10000));
  } else {
    newUnit = '人';
    newSeries = series.map(item => FixNumber.toFixedDecimal(item));
  }

  return {
    newUnit,
    newSeries,
  };
};
