/**
 * by xuxiaoqin
 * ConstructScatterData.js
 */
import _ from 'lodash';
import FixNumber from '../chartRealTime/FixNumber';
import {
  toFixedCust,
  toFixedPercent,
  toFixedRen,
  toFixedPermillage,
  getMaxAndMinCi,
  getMaxAndMinCust,
  getMaxAndMinGE,
  getMaxAndMinMoney,
  getMaxAndMinPercentOrPermillage,
} from './FormatUnitAndSeries';
import { ZHUNICODE } from '../../config';

export default {};

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const PERCENT = ZHUNICODE.PERCENT;
const PERMILLAGE = ZHUNICODE.PERMILLAGE;
const REN = ZHUNICODE.REN;
const HU = ZHUNICODE.HU;
const CI = ZHUNICODE.CI;
const YUAN = ZHUNICODE.YUAN;
const GE = ZHUNICODE.GE;
const YUANNIAN = ZHUNICODE.YUANNIAN;

export const constructScatterData = (options = {}) => {
  const { core = EMPTY_OBJECT, contrast = EMPTY_OBJECT,
    scatterDiagramModels = EMPTY_LIST, description, isLvIndicator, isCommissionRate } = options;

  const xAxisOption = _.pick(contrast, ['key', 'name', 'value', 'unit']);

  const yAxisOption = _.pick(core, ['key', 'name', 'value', 'unit']);

  let finalData = [];
  const xAxisDataArray = [];
  const yAxisDataArray = [];
  const orgItemArray = [];
  let axisData;

  const constructHelper = {
    padFixedCust(m, method) {
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
    },
    // 计算y轴的刻度范围
    getYAxisTickMinAndMax(array, curUnit) {
      if (_.isEmpty(array)) {
        return {
          min: 0,
          max: 1,
        };
      }

      let minAndMax;
      if (curUnit === HU || curUnit === REN) {
        minAndMax = getMaxAndMinCust(array);
      } else if (curUnit === CI) {
        minAndMax = getMaxAndMinCi(array);
      } else if (curUnit === GE) {
        minAndMax = getMaxAndMinGE(array);
      } else if (curUnit.indexOf(YUAN) !== -1) {
        minAndMax = getMaxAndMinMoney(array);
      } else if (curUnit === PERCENT) {
        minAndMax = getMaxAndMinPercentOrPermillage(array);
      } else if (curUnit === PERMILLAGE) {
        minAndMax = getMaxAndMinPercentOrPermillage(array);
      }

      const { max, min } = minAndMax;
      // let newMax = max;
      // if (curUnit.indexOf('元') !== -1) {
      //   // 对于金额y轴，需要给最大刻度多加一个刻度，
      //   // 不然最大值z在散点图上显示不全
      //   if (max % 1000 === 0) {
      //     newMax = max + 1000;
      //   } else if (max % 100 === 0) {
      //     newMax = max + 100;
      //   } else if (max % 10 === 0) {
      //     newMax = max + 10;
      //   } else {
      //     newMax = max + 1;
      //   }
      // }

      return {
        max,
        min,
      };
    },
    // 计算x轴的刻度范围
    getXAxisTickMinAndMax(array) {
      if (_.isEmpty(array)) {
        return {
          min: 0,
          max: 1,
        };
      }
      return getMaxAndMinCust(array);
    },
    // 获取y轴的单位和格式化后的数据源
    getYAxisUnit(array, unit) {
      if (unit === YUAN) {
        return FixNumber.toFixedMoney(array);
      } else if (unit === YUANNIAN) {
        return FixNumber.toFixedNewMoney(array);
      } else if (unit === CI) {
        return FixNumber.toFixedCI(array);
      } else if (unit === GE) {
        return FixNumber.toFixedGE(array);
      } else if (unit === HU) {
        return toFixedCust(array);
      } else if (unit === REN) {
        return toFixedRen(array);
      } else if (unit === PERCENT) {
        return {
          newSeries: toFixedPercent(array, isCommissionRate),
          newUnit: unit,
        };
      } else if (unit === PERMILLAGE) {
        return {
          newSeries: toFixedPermillage(array, isCommissionRate),
          newUnit: unit,
        };
      }
      return {
        newSeries: [],
        newUnit: '',
      };
    },
    // 获取x轴的单位和格式化后的数据源
    getXAxisUnit(array, currentXUnit) {
      if (currentXUnit.indexOf(HU) !== -1) {
        return FixNumber.toFixedCust(array);
      } else if (currentXUnit.indexOf(REN) !== -1) {
        return toFixedRen(array);
      }
      return {
        newUnit: currentXUnit,
        newSeries: array,
      };
    },
    getFormatUnit(value, originUnit) {
      // 需要特殊处理，因为xy轴的单位不一定是平均值的单位
      let finalUnit = originUnit;
      let finalAxisData = value;
      if (value >= 100000000) {
        finalUnit = `亿${originUnit}`;
        finalAxisData = value / 100000000;
      } else if (value >= 10000) {
        finalUnit = `万${originUnit}`;
        finalAxisData = value / 10000;
      }
      return {
        unit: finalUnit,
        data: finalAxisData,
      };
    },
    getFormatValue(unit, totalValue) {
      let value;
      if (unit.indexOf('万') !== -1) {
        value = Number(totalValue) / 10000;
      } else if (unit.indexOf('亿') !== -1) {
        value = Number(totalValue) / 100000000;
      } else {
        value = Number(totalValue);
      }

      // 保留的位数与散点图的每个点保留位数一致
      // 以便计算某个点斜率时，保证与对比斜率不会相差
      if (value > 10000) {
        return Number.parseFloat(value.toFixed(0));
      }
      if (value > 1000) {
        return Number.parseFloat(value.toFixed(1));
      }
      return Number.parseFloat(value.toFixed(2));
    },
    // 计算当前散点图的斜率
    getSlope(unitInfo) {
      const { xAxisUnit, yAxisUnit } = unitInfo;
      const { value: xAxisTotalValue, unit: xAxisOriginUnit } = xAxisOption;
      const { value: yAxisTotalValue, unit: yAxisOriginUnit, name: yAxisName } = yAxisOption;
      if (isLvIndicator) {
        // 包含率
        // const total = _.reduce(yAxisData, (sum, n) => sum + n, 0);
        // const len = yAxisData.length;
        // let average;
        // if (len > 0) {
        //   average = total / len;
        // }
        let average;
        if (yAxisOriginUnit === PERCENT) {
          average = yAxisTotalValue * 100;
        } else if (yAxisOriginUnit === PERMILLAGE) {
          average = yAxisTotalValue * 1000;
        }
        return {
          slope: average,
          averageInfo: `${yAxisName}平均值${average && (isCommissionRate ? average.toFixed(3) : average.toFixed(2))}${yAxisUnit}`,
          average, // 平均值，用以区分
          averageXUnit: '',
          averageYUnit: yAxisUnit,
        };
      }

      // let xAxisFormatedValue;
      let average = 0;
      let xValue;
      let yValue;
      let finalYUnit = yAxisUnit;
      let finalXUnit = xAxisUnit;

      // 需要特殊处理，因为xy轴的单位不一定是平均值的单位
      finalXUnit = constructHelper.getFormatUnit(xAxisTotalValue, xAxisOriginUnit);
      finalYUnit = constructHelper.getFormatUnit(yAxisTotalValue, yAxisOriginUnit);
      const { unit: xUnit, data: xData } = finalXUnit;
      const { unit: yUnit, data: yData } = finalYUnit;
      // 平均值
      average = yData / xData;

      if (xAxisTotalValue !== 0) {
        // 保证x不为0，不然得到NaN
        xValue = constructHelper.getFormatValue(xAxisUnit, xAxisTotalValue);
        yValue = constructHelper.getFormatValue(yAxisUnit, yAxisTotalValue);
        const slope = yValue / xValue;
        let newAverage = average;
        let newYUnit = yUnit;
        if (newAverage * 100 < 1) {
          // 如果保留两位小数之后，依旧是0.00，那么转换单位
          if (yUnit.indexOf('万') !== -1) {
            newAverage = (Number(newAverage) * 10000).toFixed(2);
            newYUnit = String(newYUnit).replace('万', '');
          } else if (yUnit.indexOf('亿') !== -1) {
            newAverage = (Number(newAverage) * 100000000).toFixed(2);
            newYUnit = String(newYUnit).replace('亿', '');
          }
        }

        if (newAverage > 10000) {
          newAverage = (Number(newAverage) / 10000).toFixed(2);
          newYUnit = `万${newYUnit}`;
        }

        return {
          slope,
          averageInfo: `平均${description} ${yAxisName} ${Number(newAverage).toFixed(2)}${newYUnit}/${xUnit}`,
          averageXUnit: xUnit,
          averageYUnit: newYUnit,
        };
      }
      return {
        slope: average,
        averageInfo: `平均${description}0${yAxisUnit}/${xAxisUnit}`,
      };
    },
  };

  // 遍历scatter模型，取出x轴数据，y轴数据，和每一个组织的信息
  _.each(scatterDiagramModels, ((item) => {
    const xPointerData = _.pick(item.contrastIndicator, ['name', 'value']);
    const yPointerData = _.pick(item.coreIndicator, ['name', 'value']);
    const orgItem = _.pick(item.orgItemDto, ['level1Name', 'level2Name', 'level3Name', 'level4Name', 'level5Name']);
    if (!_.isEmpty(xPointerData.value)
      && !_.isEmpty(yPointerData.value)
      && xPointerData.value !== '0'
      && yPointerData.value !== '0') {
      xAxisDataArray.push(parseFloat(xPointerData.value));
      yAxisDataArray.push(parseFloat(yPointerData.value));
      orgItemArray.push(orgItem);
    }
  }));

  // 原始y轴、x轴单位
  // 后台给的unit有可能是null，所以加上一个默认值
  const { unit: currentYUnit = '元' } = scatterDiagramModels[0].coreIndicator || EMPTY_OBJECT;
  const { unit: currentXUnit = '户' } = scatterDiagramModels[0].contrastIndicator || EMPTY_OBJECT;

  if (_.isEmpty(xAxisDataArray) && _.isEmpty(yAxisDataArray)) {
    // x、y轴数据都是0，则展示空数据折线图
    axisData = {
      pointerData: [],
      xAxisMin: 0,
      xAxisMax: 1,
      yAxisMin: 0,
      yAxisMax: 1,
      xAxisName: xAxisOption.name,
      yAxisName: yAxisOption.name,
      xAxisUnit: currentXUnit,
      yAxisUnit: currentYUnit,
      slope: 0,
      averageInfo: `平均${description}0${currentYUnit}/${currentXUnit}`,
    };
    return axisData;
  }

  // 拿到x轴与y轴的单位与转换后的元数据
  const xAxisUnit = constructHelper.getXAxisUnit(xAxisDataArray, currentXUnit);
  const yAxisUnit = constructHelper.getYAxisUnit(yAxisDataArray, currentYUnit);

  // 拿到x轴与y轴转换后的具体刻度最大值与最小值
  const xAxisTickArea = constructHelper.getXAxisTickMinAndMax(xAxisUnit.newSeries);
  const yAxisTickArea = constructHelper.getYAxisTickMinAndMax(yAxisUnit.newSeries, currentYUnit);

  // 斜率
  const slope = constructHelper.getSlope({
    xAxisMin: xAxisTickArea.min,
    yAxisMin: yAxisTickArea.min,
    xAxisMax: xAxisTickArea.max,
    yAxisMax: yAxisTickArea.max,
    xAxisUnit: xAxisUnit.newUnit,
    yAxisUnit: yAxisUnit.newUnit,
    yAxisData: yAxisUnit.newSeries,
  });

  // 构造元数据给series，用来绘制scatter
  const ySeriesData = yAxisUnit.newSeries;
  finalData = xAxisUnit.newSeries.map((item, index) => [
    item,
    ySeriesData[index],
    {
      level1Name: orgItemArray[index].level1Name,
      level2Name: orgItemArray[index].level2Name,
      level3Name: orgItemArray[index].level3Name,
      level4Name: orgItemArray[index].level4Name,
      level5Name: orgItemArray[index].level5Name,
    },
  ]);

  axisData = {
    pointerData: finalData,
    xAxisMin: xAxisTickArea.min,
    xAxisMax: xAxisTickArea.max,
    yAxisMin: yAxisTickArea.min,
    yAxisMax: yAxisTickArea.max,
    xAxisName: xAxisOption.name,
    yAxisName: yAxisOption.name,
    xAxisUnit: xAxisUnit.newUnit,
    yAxisUnit: yAxisUnit.newUnit,
    slope: slope.slope,
    averageInfo: slope.averageInfo || '',
    average: slope.average,
    averageXUnit: slope.averageXUnit,
    averageYUnit: slope.averageYUnit,
  };

  return axisData;
};
