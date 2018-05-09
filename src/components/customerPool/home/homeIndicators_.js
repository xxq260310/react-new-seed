/**
 * @fileOverview home/homeIndictors.js
 * @author zhangjunli
 * @description 封装首页指标数据
 */
import _ from 'lodash';
import { openRctTab } from '../../../utils';
import { url as urlHelper, number as numberHelper, emp } from '../../../helper';
import getSeries, { singleColorBar } from './chartOption_';
import {
  toFomatterCust,
  toFixedCust,
  getPercentage,
  getBarAdaptiveMax,
  transformItemUnit,
} from '../../chartRealTime/FixNumber';
import { MAIN_MAGEGER_ID } from '../../../routes/customerPool/config';

export function filterEmptyToInteger(number) {
  return ((_.isEmpty(number)) ? 0 : _.parseInt(number, 10));
}

export function filterEmptyToNumber(number) {
  return ((_.isEmpty(number)) ? 0 : _.toNumber(number));
}

// 格式化数字，逢三位加一个逗号
export function numFormat(num) {
  return numberHelper.thousandFormat(num, false);
}

export function getNewFormattedUnitAndItem(data) {
  let newData = data;
  newData = _.map(newData, (item) => {
    const { newUnit, newItem } = transformItemUnit(item);
    const thousandsFormatItem = numFormat(newItem);
    return {
      unit: newUnit,
      item: thousandsFormatItem,
    };
  });
  return newData;
}

function getProgressDataSource({
  descArray,
  dataArray,
  categoryArray,
  colorArray,
  formatterMethod,
  type,
}) {
  const percenteArray = getPercentage(dataArray);
  let finalData = [];
  if (type === 'productSale') {
    finalData = formatterMethod(dataArray);
    const items = _.map(
      categoryArray,
      (item, index) => ({
        cust: item,
        thousandsCount: finalData[index].item,
        count: finalData[index].item,
        percent: percenteArray[index],
        color: colorArray[index],
        id: index,
        unit: finalData[index].unit,
        value: finalData[index].item,
        description: descArray[index],
      }),
    );
    return items;
  }
  const { newUnit, newSeries } = formatterMethod(dataArray);
  const thousandsFormatSeries = _.map(
    newSeries,
    item => numFormat(item),
  );
  const items = _.map(
    categoryArray,
    (item, index) => ({
      cust: item,
      thousandsCount: thousandsFormatSeries[index],
      count: newSeries[index],
      percent: percenteArray[index],
      color: colorArray[index],
      id: index,
    }),
  );
  return { newUnit, items };
}

// 经营指标的新增客户
export function getPureAddCust({ pureAddData }) {
  const param = {
    dataArray: pureAddData,
    categoryArray: ['新开有效户', '新增高净值客户', '新增高端产品户', '新增产品客户'],
    colorArray: ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'],
    formatterMethod: toFixedCust,
  };
  return getProgressDataSource(param);
}

// type：manage（经营指标）/ performance（投顾绩效）
// 产品销售
export function getProductSale({
  numberArray,
  nameArray = ['公募基金', '证券投资类私募', '紫金产品', 'OTC'],
  descArray,
}) {
  const param = {
    descArray,
    dataArray: numberArray,
    categoryArray: nameArray,
    colorArray: ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'],
    formatterMethod: getNewFormattedUnitAndItem,
    type: 'productSale',
  };
  return getProgressDataSource(param);
}

// 首页经营业绩和投顾业绩柱状图label 数组
export const businessOpenNumLabelList = ['天天发', '沪港通', '深港通', '融资融券', '股票期权', '创业版'];

// 经营指标的开通业务数
// 一柱多彩
export function getClientsNumber({
  numberArray,
  nameArray = businessOpenNumLabelList,
  colourfulIndex,
  colourfulData,
  colourfulTotalNumber,
}) {
  const {
    newUnit,
    newSeries,
  } = toFomatterCust(numberArray);
  const max = getBarAdaptiveMax(newSeries);
  const items = {
    grid: {
      left: '12px',
      right: '12px',
      bottom: '34px',
      top: '32px',
      containLabel: false,
    },
    xAxis: [
      {
        data: nameArray,
        type: 'category',
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          margin: 6,
          fontSize: 12,
          color: '#666',
          showMinLabel: true,
          clickable: true,
          rotate: 30,
          padding: [6, -8, -6, 8],
        },
        axisLine: {
          lineStyle: {
            color: '#999',
          },
        },
        triggerEvent: true,
      },
    ],
    yAxis: [{
      show: false,
      max,
      min: 0,
    }],
    series: singleColorBar({
      data: newSeries,
      width: 13,
      basicColor: '#7d9be0',
      colourfulTotal: colourfulTotalNumber,
      colourfulData,
      colourfulIndex,
    }),
  };
  return { newUnit, items };
}

// 经营指标的资产和交易量
export function getTradingVolume({ numberArray, nameArray, descArray }) {
  const finalTradingData = getNewFormattedUnitAndItem(numberArray);
  // { newUnit, items: thousandsFormatSeries || [] };
  return _.map(
    finalTradingData,
    (item, index) => ({ ...item, title: (nameArray[index] || '--'), description: (descArray[index] || '--') }),
  );
}

// 经营指标的服务指标
export function getServiceIndicatorOfManage({ motOkMnt, motTotMnt, taskCust, totCust }) {
  let motPercent = 0;
  let taskPercent = 0;
  if (!_.isEmpty(motTotMnt) && filterEmptyToNumber(motOkMnt) > 0) {
    motPercent = (_.toNumber(motOkMnt) / _.toNumber(motTotMnt)) * 100;
  }
  if (!_.isEmpty(totCust) && filterEmptyToNumber(taskCust) > 0) {
    taskPercent = (_.toNumber(taskCust) / _.toNumber(totCust)) * 100;
  }
  return [
    { category: '必做MOT完成率', percent: motPercent },
    { category: '客户服务覆盖率', percent: taskPercent },
  ];
}

// 投顾绩效的服务指标
export function getServiceIndicatorOfPerformance({ performanceData }) {
  return {
    grid: {
      left: '0px',
      right: '0px',
      bottom: '0px',
      top: '20px',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      triggerEvent: true,
      data: ['', '', '', ''],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: '12',
        interval: 0,
        margin: 6,
        show: false,
      },
    },
    yAxis: {
      show: false,
      splitLine: { show: false },
    },
    series: getSeries({
      data: performanceData,
      width: 25,
      maxValue: 100,
      bgColor: '#d8d8d8',
    }),
  };
}

// 投顾绩效的客户及资产
export function getCustAndProperty(dataArray) {
  const custArray = [];
  const properyArray = [];
  for (let i = 0; i < dataArray.length; i += 2) {
    const { value = '', name = '', key, description } = dataArray[i];
    const { value: propertyValue, description: propertyDesc } = dataArray[(i + 1)];
    custArray.push({ value: filterEmptyToInteger(value), name, key, description, propertyDesc });
    properyArray.push(filterEmptyToNumber(propertyValue || ''));
  }
  // formatter 资产数据，获得 unit
  // const { newUnit: propertyUnit, newSeries } = toFixedMoney(properyArray);
  const finalData = getNewFormattedUnitAndItem(properyArray);
  const datas = _.map(
    finalData,
    (item, index) => ({ ...(custArray[index]), property: item.item, unit: item.unit }),
  );
  // 降序排列
  const descData = _.orderBy(datas, ['value'], ['desc']);
  // 设置背景色 #7D9BE0
  const colors = ['#7D9be0', '#60bbea', '#38d8e8'];
  const newDatas = _.map(
    descData,
    (item, index) => ({ ...item, bgColor: colors[index] }),
  );
  return { color: '#000', data: newDatas };
}

// 投顾绩效/经营指标的沪深归集率
export function getHSRate(array) {
  return {
    series: [{
      type: 'liquidFill',
      name: '沪深归集率',
      amplitude: '3%',
      waveLength: '40%',
      radius: '120px',
      waveAnimation: false,
      animationDuration: 0,
      animationDurationUpdate: 0,
      data: array,
      outline: { show: false },
      backgroundStyle: {
        borderWidth: 3,
        borderColor: '#f0f0f0',
        color: 'white',
      },
      itemStyle: {
        normal: {
          opacity: 0.95,
          color: '#5eade5',
          shadowBlur: 0,
        },
        emphasis: { opacity: 0.8 },
      },
      label: {
        normal: {
          show: true,
          color: '#5eade5',
          insideColor: '#fff',
          fontSize: 24,
          align: 'center',
          baseline: 'middle',
          position: ['50%', '70%'],
        },
      },
    }],
  };
}

export function linkTo({
  source,
  value,
  bname,
  cycle,
  push,
  location,
  type = 'rightType',
  authority,
}) {
  if (_.isEmpty(location)) {
    return;
  }
  const { query: { orgId, cycleSelect } } = location;
  const pathname = '/customerPool/list';
  const obj = {
    source,
    [type]: value,
    bname: encodeURIComponent(bname),
    cycleSelect: cycleSelect || (cycle[0] || {}).key,
  };
  if (orgId) {
    if (orgId === MAIN_MAGEGER_ID) {
      // obj.ptyMng = `${empName}_${empNum}`;
      obj.orgId = MAIN_MAGEGER_ID;
    } else {
      obj.orgId = orgId;
    }
  } else if (!authority) {
    // 用户没有权限
    // obj.ptyMng = `${empName}_${empNum}`;
    obj.orgId = MAIN_MAGEGER_ID;
  } else {
    obj.orgId = emp.getOrgId();
  }
  const url = `${pathname}?${urlHelper.stringify(obj)}`;
  const param = {
    closable: true,
    forceRefresh: true,
    isSpecialTab: true,
    id: 'RCT_FSP_CUSTOMER_LIST',
    title: '客户列表',
  };
  openRctTab({
    routerAction: push,
    url,
    param,
    pathname,
    query: obj,
  });
}
