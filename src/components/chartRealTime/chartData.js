/**
 * @fileOverview chartRealTime/chartData.js
 * @author sunweibin
 * @description 堆叠图表数据相关方法
 */

import moment from 'moment';
import _ from 'lodash';

import { stackBarColors } from './ChartGeneralOptions';

function convert2number(v) {
  if (v === null || v === 'null') {
    return '--';
  }
  return Number(v);
}

function toFixedTotals(v) {
  return (item) => {
    const newItem = item;
    if (newItem === '--') {
      return '--';
    }
    return Number.parseFloat((item / v).toFixed(2));
  };
}

function toFixedDecimal(value) {
  if (value > 10000) {
    return Number.parseFloat(value.toFixed(0));
  }
  if (value > 1000) {
    return Number.parseFloat(value.toFixed(1));
  }
  return Number.parseFloat(value.toFixed(2));
}

function toFixedData(v) {
  return (item) => {
    const newItem = item;
    const data = item.data;
    newItem.data = data.map(n => toFixedDecimal(n / v));
    return newItem;
  };
}

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

function padFixedPeople(people, method) {
  const p = Math.abs(people);
  let value = 0;
  if (p >= 10000) {
    value = Math[method](people / 1000) * 1000;
  } else if (p > 200) {
    value = Math[method](people / 100) * 100;
  } else if (p <= 200 && p > 10) {
    value = Math[method](people / 10) * 10;
  } else {
    value = Math[method](people);
  }
  return value;
}

const chartData = {
  // 取出orgModel中分公司、营业部、的名称数组
  // 用于Y轴刻度值，或者tooltip提示信息
  filterOrgModelData(orgModel, key) {
    const yAxisLabels = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          yAxisLabels.push('--');
        } else {
          yAxisLabels.push(item[key]);
        }
      });
    }
    return yAxisLabels;
  },

  // 获取series的值
  getNormalSeries(orgModel, key) {
    const series = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          series.push(0);
        } else {
          series.push(item[key]);
        }
      });
    }
    return series;
  },

  /**
   * 获取stackSeries
   * @param  {[Array]} orgModel 元数据
   * @param  {[String]} key      数据键
   * @return {[Array]}          [{},{},{}...]
   */
  getStackSeries(orgModel, key, stack) {
    const stackSeries = [];
    const stackLegend = [];
    // 设置一个uniqueStack值
    const now = moment().format('x');
    const uniqueStack = `${stack}-${now}`;
    if (orgModel) {
      // 首先确定stackSeries的长度
      const stackLen = orgModel[0][key].length;
      // 取出stackSeries数组
      for (let i = 0; i < stackLen; i++) {
        const name = orgModel[0][key][i].name;
        stackLegend.push({
          legendName: name,
          backgroundColor: stackBarColors[i],
        });
        const stackObj = {
          // itemStyle: {
          //   normal: {
          //     barBorderRadius: 3,
          //   },
          // },
          label: {
            normal: {
              show: false,
            },
          },
          stack: uniqueStack,
          type: 'bar',
          name,
          barWidth: 6,
        };
        const data = [];
        orgModel.forEach((item) => {
          let stackValue = item[key][i].value;
          if (stackValue === '' || stackValue === 'null' || stackValue === null || stackValue === undefined) {
            stackValue = 0;
          }
          data.push(Number(stackValue));
        });
        // 补足数据
        const padLength = 10 - data.length;
        for (let j = 0; j < padLength; j++) {
          data.push(0);
        }
        _.assign(stackObj, { data });
        stackSeries.push(stackObj);
      }
    }
    return {
      series: stackSeries,
      legends: stackLegend,
    };
  },

  /**
   * 处理stackSeries中的金额数据以及单位
   * 此处需要新增对总数的处理
   * 总数的单位由各项来决定
   */
  dealStackSeriesMoney(stackSeries, totals) {
    let newUnit = '元';
    let newStackSeries = stackSeries;
    // 合计值
    let newTotals = totals.map(convert2number);
    // 判断stackSeries中最大值是多少
    let allData = [];
    const len = newStackSeries.length;
    for (let i = 0; i < len; i++) {
      allData = _.concat(allData, newStackSeries[i].data);
    }
    const maxMoney = Math.max(...allData);
     // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (maxMoney > 100000000) {
      newUnit = `亿${newUnit}`;
      newStackSeries = newStackSeries.map(toFixedData(100000000));
      newTotals = newTotals.map(toFixedTotals(100000000));
    } else if (maxMoney > 10000) {
      newUnit = `万${newUnit}`;
      newStackSeries = newStackSeries.map(toFixedData(10000));
      newTotals = newTotals.map(toFixedTotals(10000));
    }
    return {
      newStackSeries,
      newUnit,
      newTotals,
    };
  },
  /**
   * 处理stackSeries中的金额数据以及单位
   * 此处需要新增对总数的处理
   * 总数的单位由各项来决定
   */
  dealStackSeriesNewMoney(stackSeries, totals) {
    let newUnit = '元/年';
    let newStackSeries = stackSeries;
    // 合计值
    let newTotals = totals.map(convert2number);
    // 判断stackSeries中最大值是多少
    let allData = [];
    const len = newStackSeries.length;
    for (let i = 0; i < len; i++) {
      allData = _.concat(allData, newStackSeries[i].data);
    }
    const maxMoney = Math.max(...allData);
     // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (maxMoney > 100000000) {
      newUnit = `亿${newUnit}`;
      newStackSeries = newStackSeries.map(toFixedData(100000000));
      newTotals = newTotals.map(toFixedTotals(100000000));
    } else if (maxMoney > 10000) {
      newUnit = `万${newUnit}`;
      newStackSeries = newStackSeries.map(toFixedData(10000));
      newTotals = newTotals.map(toFixedTotals(10000));
    }
    return {
      newStackSeries,
      newUnit,
      newTotals,
    };
  },
  /**
   * 处理stackSeries中的户单位
   */
  dealStackSeiesHu(stackSeries, totals) {
    let newUnit = '户';
    let newStackSeries = stackSeries;
    // 合计值
    let newTotals = totals.map(convert2number);
     // 判断stackSeries中最大值是多少
    let allData = [];
    const len = newStackSeries.length;
    for (let i = 0; i < len; i++) {
      allData = _.concat(allData, newStackSeries[i].data);
    }
    const maxHu = Math.max(...allData);
     // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (maxHu > 5000) {
      newUnit = '万户';
      newStackSeries = newStackSeries.map(toFixedData(10000));
      newTotals = newTotals.map(toFixedTotals(10000));
    }
    return {
      newStackSeries,
      newUnit,
      newTotals,
    };
  },

  /**
   * 处理StackData数据,返回stack轴上正数和负数的最大最小值
   * @return {[type]} [description]
   */
  dealStackData(stackSeries) {
    const newStackSeries = stackSeries;
    // 判断stackSeries中最大值是多少
    const allData = [];
    const len = newStackSeries.length; // 3
    const dataLen = newStackSeries[0].data.length; // 10
    for (let i = 0; i < dataLen; i++) {
      const stackSingleValue = {
        plus: [],
        minus: [],
      };
      for (let j = 0; j < len; j++) {
        const v = newStackSeries[j].data[i];
        if (v >= 0) {
          stackSingleValue.plus.push(v);
        } else {
          stackSingleValue.minus.push(v);
        }
      }
      allData.push(stackSingleValue);
    }
    // 计算出每条柱状图的负值合并以及正值合并
    const minusAndPlusLen = allData.length;
    const minusMerge = [];
    const plusMerge = [];
    for (let j = 0; j < minusAndPlusLen; j++) {
      minusMerge.push(_.sum(allData[j].minus));
      plusMerge.push(_.sum(allData[j].plus));
    }
    const plusMax = Math.max(...plusMerge);
    const plusMin = Math.min(...plusMerge);
    const minusMax = Math.max(...minusMerge);
    const minusMin = Math.min(...minusMerge);
    return {
      plus: { max: plusMax, min: plusMin },
      minus: { max: minusMax, min: minusMin },
    };
  },

  fixedPercentMaxMin(percent) {
    const plus = percent.plus;
    const minus = percent.mnus;
    // 首先判断正值的最大值和负值的最小值是否为0
    let max = 100;
    let min = -100;
    if (plus.max === 0 && minus.min !== 0) {
      // 当正值的最大值是0的时候，只存在负值
      max = 0;
      min = Math.floor((minus.min / 10)) * 10;
    } else if (minus.min === 0 && plus.max !== 0) {
      // 当负值的最小值为0的时候，只存在正值
      max = Math.ceil((plus.max / 10)) * 10;
      min = 0;
    } else if (plus.max !== 0 && minus.min !== 0) {
      // 其余有正有负的情况，均是0的情况为默认值
      max = Math.ceil((plus.max / 10)) * 10;
      min = Math.floor((minus.min / 10)) * 10;
    }

    return {
      max,
      min,
    };
  },

  fixedPermillageMaxMin(permillage) {
    const plus = permillage.plus;
    const minus = permillage.minus;
    let max = 10;
    let min = -10;
    if (plus.max === 0 && minus.min !== 0) {
       // 当正值的最大值是0的时候，只存在负值
      max = 0;
      min = Math.floor(minus.min);
    } else if (minus.min === 0 && plus.max !== 0) {
      // 当负值的最小值为0的时候，只存在正值
      max = Math.ceil(plus.max);
      min = 0;
    } else if (plus.max !== 0 && minus.min !== 0) {
      // 其余有正有负的情况，均是0的情况为默认值
      max = Math.ceil(plus.max);
      min = Math.floor(minus.min);
    }
    return { max, min };
  },

  fixedMoneyMaxMin(money) {
    const plus = money.plus;
    const minus = money.minus;
    let max = 10;
    let min = -10;
    if (plus.max === 0 && minus.min !== 0) {
      // 当正值的最大值是0的时候，只存在负值
      max = 0;
      min = padFixedMoney(minus.min, 'floor');
    } else if (minus.min === 0 && plus.max !== 0) {
      // 当负值的最小值为0的时候，只存在正值
      max = padFixedMoney(plus.max, 'ceil');
      min = 0;
    } else if (plus.max !== 0 && minus.min !== 0) {
      // 其余有正有负的情况，均是0的情况为默认值
      max = padFixedMoney(plus.max, 'ceil');
      min = padFixedMoney(minus.min, 'floor');
    }
    return { max, min };
  },

  fixedPeopleMaxMin(people) {
    // 正向柱条
    const plus = people.plus;
    // 负向柱条
    const minus = people.minus;

    let max = 10;
    let min = -10;
    if (plus.max === 0 && minus.min !== 0) {
      // 当正值的最大值是0的时候，只存在负值
      max = 0;
      min = padFixedPeople(minus.min, 'floor');
    } else if (minus.min === 0 && plus.max !== 0) {
      // 当负值的最小值为0的时候，只存在正值
      max = padFixedPeople(plus.max, 'ceil');
      min = 0;
    } else if (plus.max !== 0 && minus.min !== 0) {
      // 其余有正有负的情况，均是0的情况为默认值
      max = padFixedPeople(plus.max, 'ceil');
      min = padFixedPeople(minus.min, 'floor');
    }
    return { max, min };
  },

  fixedStackLegendData(legends) {
    const newLegends = legends.map((item) => {
      const obj = {
        icon: 'circle',
        name: item,
      };
      return obj;
    });
    return newLegends;
  },
};

export default chartData;
