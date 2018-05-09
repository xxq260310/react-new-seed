/**
 * @description 历史排名对比柱状图数据处理程序
 * @author sunweibin
 */
import _ from 'lodash';
import { ZHUNICODE } from '../../../config';
import {
  getMaxAndMinPercent,
  getMaxAndMinPermillage,
  getMaxAndMinMoney,
  getMaxAndMinCust,
  getMaxAndMinCi,
  getMaxAndMinGE,
  toFixedMoney,
  toFixedNewMoney,
  toFixedCust,
  toFixedCI,
  toFixedGE,
} from '../FixNumber';

import {
  getStackSeries,
  dealStackSeriesMoney,
  dealStackSeriesNewMoney,
  dealStackSeiesHu,
  dealStackData,
  fixedMoneyMaxMin,
  fixedPeopleMaxMin,
} from '../chartData';

const PERCENT = ZHUNICODE.PERCENT;
const PERMILLAGE = ZHUNICODE.PERMILLAGE;
const REN = ZHUNICODE.REN;
const HU = ZHUNICODE.HU;
const CI = ZHUNICODE.CI;
const YUAN = ZHUNICODE.YUAN;
const GE = ZHUNICODE.GE;
const YUANNIAN = ZHUNICODE.YUANNIAN;
const yiwan = 10000;

function toFixedDecimal(value) {
  if (value > 10000) {
    return Number.parseFloat(value.toFixed(0));
  }
  if (value > 1000) {
    return Number.parseFloat(value.toFixed(1));
  }
  return Number.parseFloat(value.toFixed(2));
}

// 对人数进行特殊处理
function toFixedRen(series) {
  let newUnit = '人';
  const tempSeries = series.map(n => Math.abs(n));
  let newSeries = series;
  const max = Math.max(...tempSeries);
  // 1. 全部在万元以下的数据不做处理
  // 2.超过万元的，以‘万元’为单位
  // 3.超过亿元的，以‘亿元’为单位
  if (max >= yiwan) {
    newUnit = '万人';
    newSeries = series.map(item => toFixedDecimal(item / yiwan));
  } else {
    newUnit = '人';
    newSeries = series.map(item => toFixedDecimal(item));
  }

  return {
    newUnit,
    newSeries,
  };
}

const dataHandle = {
  // 过滤普通柱状图数据
  filterData(orgModel, key, axis) {
    const data = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          if (axis === 'yAxis') {
            data.push('--');
          } else if (axis === 'xAxis') {
            data.push(0);
          }
        } else {
          data.push(item[key]);
        }
      });
    }
    return data;
  },
  // 过滤出排名信息
  filterRankData(orgModel) {
    const data = [];
    if (Array.isArray(orgModel) && orgModel.length) {
      orgModel.forEach((item) => {
        const {
          rank_current: current,
          rand_change: change,
          rank_contrast: contrast,
        } = item;
        const current1 = _.isEmpty(current) ? null : Number.parseInt(current, 10);
        const contrast1 = _.isEmpty(contrast) ? 0 : Number.parseInt(contrast, 10);
        let change1;
        if (_.isEmpty(change)) {
          change1 = null;
        } else {
          change1 = Number.parseInt(change, 10);
        }
        data.push({
          current: current1,
          change: change1,
          contrast: contrast1,
        });
      });
    }
    return data;
  },
  // 针对普通视图中的数据处理
  dealNormalData(series, unit) {
    let result = {};
    const seriesData = series;
    switch (unit) {
      case PERCENT:
        result = {
          newSeries: seriesData.map(item => toFixedDecimal(item * 100)),
          newUnit: unit,
        };
        break;
      case PERMILLAGE:
        result = {
          newSeries: seriesData.map(item => toFixedDecimal(item * 1000)),
          newUnit: unit,
        };
        break;
      case REN:
        result = toFixedRen(seriesData);
        break;
      case HU:
        result = toFixedCust(seriesData);
        break;
      case CI:
        result = toFixedCI(seriesData);
        break;
      case YUAN:
        result = toFixedMoney(seriesData);
        break;
      case YUANNIAN:
        result = toFixedNewMoney(seriesData);
        break;
      case GE:
        result = toFixedGE(seriesData);
        break;
      default:
        result = {
          newSeries: series,
          newUnit: unit,
        };
        break;
    }
    return result;
  },
  // 设计指标坐标系
  designGrid(series, unit) {
    let grid = {};
    const seriesData = series;
    if (unit === PERCENT) {
      grid = getMaxAndMinPercent(seriesData);
    } else if (unit === PERMILLAGE) {
      grid = getMaxAndMinPermillage(seriesData);
    } else if (unit.indexOf(YUAN) > -1) {
      grid = getMaxAndMinMoney(seriesData);
    } else if (unit === REN || unit.indexOf(HU) > -1) {
      grid = getMaxAndMinCust(seriesData);
    } else if (unit === CI) {
      grid = getMaxAndMinCi(seriesData);
    } else if (unit === GE) {
      grid = getMaxAndMinGE(seriesData);
    }
    return grid;
  },
  // 过滤出stackSeries的数据
  filterStackSeriesData(orgModel, key, stack) {
    return getStackSeries(orgModel, key, stack);
  },
  // 根据单位处理stackSeries数据
  dealStackSeriesData(stackSeries, unit, summury) {
    let result = {};
    switch (unit) {
      case YUAN:
        result = dealStackSeriesMoney(stackSeries, summury);
        break;
      case YUANNIAN:
        result = dealStackSeriesNewMoney(stackSeries, summury);
        break;
      case HU:
        result = dealStackSeiesHu(stackSeries, summury);
        break;
      default:
        break;
    }
    return result;
  },
  // 设计stack的直角坐标系
  designStackGrid(stackSeries, unit) {
    // 处理Echarts图表刻度值
    // 此处处理图表中的数据，与tooltip中的数据无关
    // stackSeries的data中
    const gridAxisTick = dealStackData(stackSeries);
    // 图表边界值,如果xMax是0的话则最大值为1
    let max = 1;
    let min = 0;
    if (unit.indexOf(YUAN) > -1) {
      const maxAndMinMoney = fixedMoneyMaxMin(gridAxisTick);
      max = maxAndMinMoney.max;
      min = maxAndMinMoney.min;
    } else if (unit.indexOf(HU) > -1 || unit === REN) {
      const maxAndMinPeople = fixedPeopleMaxMin(gridAxisTick);
      max = maxAndMinPeople.max;
      min = maxAndMinPeople.min;
    }
    return {
      max,
      min,
    };
  },

  // 计算出stack的合计值
  getStackSummury(stackSeries) {
    const summury = [];
    if (stackSeries.length) {
      const totalData = stackSeries.map(item => item.data);
      const jlen = totalData[0].length;
      const ilen = totalData.length;
      for (let i = 0; i < jlen; i++) {
        let subsummury = 0;
        for (let j = 0; j < ilen; j++) {
          subsummury += totalData[j][i];
        }
        summury.push(Number.parseFloat(subsummury.toFixed(2)));
      }
    }
    return summury;
  },
  // 优化Grid
  optimizeGrid(grid) {
    const gridHelper = _.cloneDeep(grid);
    let { max } = gridHelper;
    const { min } = gridHelper;
    if (max > 0 && min > 0) {
      max -= min;
    }
    if (max < 0 && min < 0) {
      // TODO 不存在两者都小于零的情况
      max = 0;
    }
    return {
      max,
      min,
    };
  },
};

export default dataHandle;
