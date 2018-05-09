/**
 * @description 历史对比数据处理逻辑
 * @author sunweibin
 */

function fetchSeriesData(item) {
  const value = Number(item.indicatorMetaDto.value);
  const { year, month, day } = item.timeModel;
  let dayStr = `${year}/${month}`;
  if (day !== '') {
    // 显示天
    dayStr = `${month}/${day}`;
  }
  return [dayStr, value];
}

const historyDeal = {
  // 1. 取出相关数据
  getContrastData(data) {
    // 历史对比数据中本期的数据
    const currentData = data.current;
    // 历史对比数据中上期的数据
    const previousData = data.previous;
    // 获取指标数据
    const indicator = currentData[0].indicatorMetaDto;
    const curSeries = currentData.map(fetchSeriesData);
    const preSeries = previousData.map(fetchSeriesData);
    return {
      indicator,
      current: curSeries,
      previous: preSeries,
    };
  },
};

export default historyDeal;
