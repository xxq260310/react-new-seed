/**
 * @fileOverview chartRealTime/FixNumber.js
 * @author sunweibin
 * @description 为图表chart提供单位数字的处理函数集
 */
import _ from 'lodash';

const WAN_YUAN = '万元';
const YI_YUAN = '亿元';
const YUAN = '元';
const WAN_YI = '万亿';

function padFixedMoney(m, method) {
  const money = Math.abs(m);
  let value = 0;
  if (money >= 10000) {
    value = Math[method](m / 1000) * 1000;
  } else if (money >= 1000) {
    value = Math[method](m / 1000) * 1000;
  } else if (money >= 100) {
    value = Math[method](m / 100) * 100;
  } else if (money >= 10) {
    value = Math[method](m / 10) * 10;
  } else {
    value = Math[method](m);
  }
  return value;
}

function padFixedCust(m, method) {
  const cust = Math.abs(m);
  let value = 0;
  if (cust >= 10000) {
    value = Math[method](m / 1000) * 1000;
  } else if (cust >= 100) {
    value = Math[method](m / 100) * 100;
  } else if (cust >= 10) {
    value = Math[method](m / 10) * 10;
  } else if (cust < 10) {
    value = Math[method](m);
  }
  return value;
}

const FixNumber = {
  // 对小数点进行处理
  toFixedDecimal(value, isCommissionRate) {
    if (value > 10000) {
      return Number.parseFloat(value.toFixed(0));
    }
    if (value > 1000) {
      return Number.parseFloat(value.toFixed(1));
    }
    if (isCommissionRate) {
      return Number.parseFloat(value.toFixed(3));
    }
    return Number.parseFloat(value.toFixed(2));
  },

  // 针对金额进行特殊处理
  toFixedMoney(series) {
    let newUnit = '元';
    const tempSeries = series.map(n => Math.abs(n));
    let newSeries = series;
    const MaxMoney = Math.max(...tempSeries);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (MaxMoney >= 100000000) {
      newUnit = '亿元';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 100000000));
    } else if (MaxMoney > 10000) {
      newUnit = '万元';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 10000));
    } else {
      newUnit = '元';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item));
    }

    return {
      newUnit,
      newSeries,
    };
  },

  // 针对每一个金额作处理，换算成相应单位的unit和item
  // 譬如123455.76747 换算成 12.34万元
  transformItemUnit(item) {
    let newUnit = '元';
    let newItem = Math.abs(item);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (newItem >= 100000000) {
      newUnit = '亿元';
      newItem = FixNumber.toFixedDecimal(newItem / 100000000);
    } else if (newItem > 10000) {
      newUnit = '万元';
      newItem = FixNumber.toFixedDecimal(newItem / 10000);
    } else {
      newUnit = '元';
      newItem = FixNumber.toFixedDecimal(newItem);
    }

    // 对于太大的数字再做特殊处理，这样页面上能展示的下，不然展示不下
    // 譬如5035.34万转换成0.50亿
    if (String(newItem).split('.')[0].length >= 4) {
      newItem = FixNumber.toFixedDecimal(newItem / 10000);
      // 将亿元转换成万亿
      if (newUnit.indexOf(YI_YUAN) !== -1) {
        newUnit = WAN_YI;
      } else if (newUnit.indexOf(WAN_YUAN) !== -1) {
        // 将万元转换成亿元
        newUnit = YI_YUAN;
      } else if (newUnit.indexOf(YUAN) !== -1) {
        // 将元转成万元
        newUnit = WAN_YUAN;
      }
    }

    // 保留符号
    if (item < 0) {
      // 负数
      newItem = `-${newItem}`;
    }

    return {
      newUnit,
      newItem,
    };
  },

  // 针对元/年这种单位进行特殊处理
  toFixedNewMoney(series) {
    let newUnit = '元/年';
    const tempSeries = series.map(n => Math.abs(n));
    let newSeries = series;
    const MaxMoney = Math.max(...tempSeries);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (MaxMoney >= 100000000) {
      newUnit = `亿${newUnit}`;
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 100000000));
    } else if (MaxMoney > 10000) {
      newUnit = `万${newUnit}`;
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 10000));
    } else {
      // newUnit = unit;
      newSeries = series.map(item => FixNumber.toFixedDecimal(item));
    }

    return {
      newUnit,
      newSeries,
    };
  },

  // 对用户数进行特殊处理
  toFixedCust(series) {
    let newUnit = '户';
    const tempSeries = series.map(n => Math.abs(n));
    let newSeries = series;
    const max = Math.max(...tempSeries);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位

    if (max >= 5000) {
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
  },

  // 1. 全部在万以下的数据不做处理
  // 2.超过万的，以‘万户’为单位
  toFomatterCust(series) {
    let newUnit = '户';
    const tempSeries = series.map(n => Math.abs(n));
    let newSeries = series;
    const max = Math.max(...tempSeries);

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
  },

  // 对登录次数进行特殊处理
  toFixedCI(series) {
    const newUnit = '次';
    let newSeries = series;
    newSeries = series.map(n => Number.parseFloat(n.toFixed(2)));
    return {
      newUnit,
      newSeries,
    };
  },

  // 针对任务完成数进行处理
  toFixedGE(series) {
    let newUnit = '个';
    const tempSeries = series.map(n => Math.abs(n));
    let newSeries = series;
    const max = Math.max(...tempSeries);
    if (max >= 5000) {
      newUnit = '万个';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 10000));
    } else {
      newUnit = '个';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item));
    }

    return {
      newUnit,
      newSeries,
    };
  },

  // 针对百分比的数字来确认图表坐标轴的最大和最小值
  getMaxAndMinPercent(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    if (max >= 10) {
      max = Math.ceil((max / 10)) * 10;
    } else {
      max = Math.ceil(max);
    }
    if (min >= 10) {
      min = Math.floor((min / 10)) * 10;
    } else {
      min = 0;
    }
    if (max === 0) {
      max = 100;
    }
    if (min === 100) {
      min = 0;
    }
    return {
      max,
      min,
    };
  },

  // 针对千分比确认图表最大和最小值
  getMaxAndMinPermillage(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = Math.ceil(max);
    min = Math.floor(min);
    if (max === 0) {
      max = 1;
    }
    return {
      max,
      min,
    };
  },

  // 针对金额确认图表最大和最小值
  getMaxAndMinMoney(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = padFixedMoney(max, 'ceil');
    min = padFixedMoney(min, 'floor');
    if (max === 0 && min === 0) {
      max = 1;
    }
    return { max, min };
  },

  // 针对户获取图表最大和最小值
  getMaxAndMinCust(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = padFixedCust(max, 'ceil');
    min = padFixedCust(min, 'floor');
    if (max < 10) {
      max = 10;
      min = 0;
    }

    return { max, min };
  },

  // 针对次数获取图标最大和最小值
  getMaxAndMinCi(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    // 次数肯定都是正数
    max = padFixedCust(max, 'ceil');
    min = padFixedCust(min, 'floor');
    if ((max === 0 && min === 0) || (max < 1 && min < 1)) {
      max = 1;
    }
    return { max, min };
  },

  // 针对任务完成数的最大和最小值
  getMaxAndMinGE(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    // 次数肯定都是正数
    max = padFixedCust(max, 'ceil');
    min = padFixedCust(min, 'floor');
    if ((max === 0 && min === 0) || (max < 10 && min < 10)) {
      max = 10;
      min = 0;
    }
    return { max, min };
  },

  // 换算比最大整数稍大的整数（纯美观），进度条百分数比例的分母
  getDenominator(max, method) {
    const money = Math.abs(max);
    const mLength = money.toString().length || 0;
    let value = 0;
    const powm = Math.pow(10, mLength - 1);
    const addwm = Math.pow(10, mLength - 2);
    if (mLength > 0 && money >= powm) {
      value = (Math[method](max / powm) * powm) + addwm;
    } else {
      value = Math[method](max);
    }
    return value;
  },

  // 百分比计算
  getPercentage(datas) {
    const maxAndMin = FixNumber.getMaxAndMinMoney(datas);
    const maxX = FixNumber.getDenominator(maxAndMin.max, 'ceil');
    return _.map(
      datas,
      item => (item / maxX) * 100,
    );
  },

  // 柱状图自适应的最大值
  getBarAdaptiveMax(datas) {
    const maxAndMin = FixNumber.getMaxAndMinMoney(datas);
    const maxX = FixNumber.getDenominator(maxAndMin.max, 'ceil');
    return maxX;
  },
};

export default FixNumber;
