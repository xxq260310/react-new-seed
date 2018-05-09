/**
 * @description 历史对比折线图
 * @author sunweibin
 * @fileOverview history/HistoryComparePolyChart.js
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { constructPolyChartOptions } from './ConstructPolyChartOptions';
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
import FixNumber from '../chartRealTime/FixNumber';
import IECharts from '../IECharts';
import { ZHUNICODE } from '../../config';
import { checkTooltipStatus } from '../../decorators/checkTooltipStatus';
import styles from './HistoryComparePolyChart.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const PERCENT = ZHUNICODE.PERCENT;
const PERMILLAGE = ZHUNICODE.PERMILLAGE;
const REN = ZHUNICODE.REN;
const HU = ZHUNICODE.HU;
const CI = ZHUNICODE.CI;
const YUAN = ZHUNICODE.YUAN;
const YUANNIAN = ZHUNICODE.YUANNIAN;
const GE = ZHUNICODE.GE;

export default class HistoryComparePolyChart extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      unit: '',
      currentValue: '',
      previousValue: '',
      currentDate: '',
      previousDate: '',
      curWeekDay: '',
      prevWeekDay: '',
      chartOptions: EMPTY_OBJECT,
      isShowTooltip: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    const { data: prevData } = this.props;
    if (prevData !== data && !_.isEmpty(prevData) && !_.isEmpty(data)) {
      // 构造数据
      // 构造配置项
      const {
        xSeries,
        series,
        unit,
        yAxisTickArea,
      } = this.formatData(data.current, data.isCommissionRate);

      const finalCurrentData = this.formatDate(xSeries, series,
        unit, yAxisTickArea);

      const {
        series: previousNewSeries,
        yAxisTickArea: previousYAxisTickArea,
      } = this.formatData(data.previous);

      const finalPreviousData = {
        series: previousNewSeries,
        yAxisMin: previousYAxisTickArea.min,
        yAxisMax: previousYAxisTickArea.max,
      };

      const {
        yAxisMin: curYAxisMin,
        yAxisMax: curYAxisMax,
        xAxisTickArea,
        series: curSeries,
      } = finalCurrentData;

      const {
        yAxisMin: previousYAxisMin,
        yAxisMax: previousYAxisMax,
        series: previousSeries,
      } = finalPreviousData;

      const options = constructPolyChartOptions({
        xAxisTickArea,
        current: curSeries || EMPTY_ARRAY,
        previous: previousSeries || EMPTY_ARRAY,
        yAxisMin: Math.min(curYAxisMin, previousYAxisMin),
        yAxisMax: Math.max(curYAxisMax, previousYAxisMax),
        onAxisPointerMouseMove: this.handlePloyChartMove,
      });

      // 默认选中第一条展示信息
      const { date: currentDate, value: currentValue,
        name, weekDay: curWeekDay } = curSeries[0] || EMPTY_ARRAY;
      const { date: previousDate, value: previousValue,
        weekDay: prevWeekDay } = previousSeries[0] || EMPTY_ARRAY;

      this.setState({
        chartOptions: options, // 折线图配置项
        name,
        unit,
        currentValue,
        previousValue,
        currentDate,
        previousDate,
        curWeekDay,
        prevWeekDay,
      });
    }
  }

  // 当前单位为元时
  // 计算y轴的刻度范围
  @autobind
  getYAxisTickMinAndMax(array, curUnit) {
    if (_.isEmpty(array)) {
      return {
        min: 0,
        max: 1,
      };
    }

    let minAndMax;
    if (curUnit.indexOf(YUAN) !== -1) {
      minAndMax = getMaxAndMinMoney(array);
    } else if (curUnit.indexOf(HU) !== -1 || curUnit.indexOf(REN) !== -1) {
      minAndMax = getMaxAndMinCust(array);
    } else if (curUnit.indexOf(GE) !== -1) {
      minAndMax = getMaxAndMinGE(array);
    } else if (curUnit.indexOf(CI) !== -1) {
      minAndMax = getMaxAndMinCi(array);
    } else if (curUnit.indexOf(PERCENT) !== -1) {
      minAndMax = getMaxAndMinPercentOrPermillage(array);
    } else if (curUnit.indexOf(PERMILLAGE) !== -1) {
      minAndMax = getMaxAndMinPercentOrPermillage(array);
    }

    const { max, min } = minAndMax;
    return {
      max,
      min,
    };
  }

  // 获取y轴的单位和格式化后的数据源
  @autobind
  getYAxisUnit(array, yAxisUnit, isCommissionRate) {
    if (!_.isEmpty(array)) {
      if (yAxisUnit.indexOf(YUANNIAN) !== -1) {
        return FixNumber.toFixedNewMoney(array);
      } else if (yAxisUnit.indexOf(YUAN) !== -1) {
        return FixNumber.toFixedMoney(array);
      } else if (yAxisUnit.indexOf(HU) !== -1) {
        return toFixedCust(array);
      } else if (yAxisUnit.indexOf(REN) !== -1) {
        return toFixedRen(array);
      } else if (yAxisUnit.indexOf(GE) !== -1) {
        return FixNumber.toFixedGE(array);
      } else if (yAxisUnit.indexOf(CI) !== -1) {
        return FixNumber.toFixedCI(array);
      } else if (yAxisUnit.indexOf(PERCENT) !== -1) {
        return {
          newSeries: toFixedPercent(array, isCommissionRate),
          newUnit: yAxisUnit,
        };
      } else if (yAxisUnit.indexOf(PERMILLAGE) !== -1) {
        return {
          newSeries: toFixedPermillage(array, isCommissionRate),
          newUnit: yAxisUnit,
        };
      }
    }

    return {
      newUnit: '',
      newSeries: [],
    };
  }

  @autobind
  formatData(data, isCommissionRate) {
    const newYSeries = [];
    const xSeries = [];
    const weekDayArray = [];
    let yAxisData = '';
    let xAxisData = '';
    _.each(data, (item) => {
      const indicatorMeta = item.indicatorMetaDto || EMPTY_OBJECT;
      const timeModel = item.timeModel || EMPTY_OBJECT;
      yAxisData = _.pick(indicatorMeta, ['name', 'value', 'unit']);
      xAxisData = _.pick(timeModel, ['year', 'month', 'day', 'weekDay']);
      if (!_.isEmpty(yAxisData.value) && yAxisData.value !== 0 && yAxisData.value !== '0') {
        newYSeries.push(Number(yAxisData.value));
      } else {
        newYSeries.push(0);
      }
      if (_.isEmpty(xAxisData.day)) {
        xSeries.push(`${Number(xAxisData.year)}年${Number(xAxisData.month)}月`);
      } else {
        xSeries.push(`${Number(xAxisData.year)}/${xAxisData.month}/${xAxisData.day}`);
      }
      weekDayArray.push(xAxisData.weekDay);
    });

    const newYAxisUnit = this.getYAxisUnit(newYSeries, yAxisData.unit, isCommissionRate);

    // y轴的刻度范围
    const yAxisTickArea = this.getYAxisTickMinAndMax(newYAxisUnit.newSeries, yAxisData.unit);

    const itemDataArray = newYAxisUnit.newSeries.map((item, index) => (
      {
        value: item,
        name: yAxisData.name,
        unit: newYAxisUnit.newUnit,
        date: xSeries[index],
        weekDay: weekDayArray[index],
      }
    ));

    return {
      xSeries,
      series: itemDataArray,
      unit: newYAxisUnit.newUnit,
      yAxisTickArea,
    };
  }

  /**
   * 格式化
   * @param {*} xSeries x轴的数据
   * @param {*} newSeries 新的series
   * @param {*} newUnit 新的单位
   * @param {*} newYAxisTickArea y轴刻度
   */
  @autobind
  formatDate(xSeries, newSeries, newUnit, newYAxisTickArea) {
    const finalData = {
      series: newSeries,
      yAxisUnit: newUnit,
      xAxisTickArea: xSeries,
      yAxisMin: newYAxisTickArea.min,
      yAxisMax: newYAxisTickArea.max,
    };

    return finalData;
  }

  /**
 * 处理鼠标离开事件
 */
  @autobind
  handlePloyChartLeave() {
    const { isShowTooltip } = this.state;
    if (isShowTooltip) {
      this.setState({
        isShowTooltip: !isShowTooltip,
      });
    }
  }

  @autobind
  @checkTooltipStatus
  handlePloyChartMove(params) {
    const { seriesData } = params;
    let comparePoly = EMPTY_OBJECT;
    if (seriesData.length === 1) {
      const [{ seriesName }] = seriesData;
      if (seriesName === '本期') {
        const [
          { data: { value: currentValue, date: currentDate, weekDay: curWeekDay } },
        ] = seriesData;
        comparePoly = {
          currentValue,
          currentDate,
          previousValue: '',
          previousDate: '',
          curWeekDay,
          prevWeekDay: '',
        };
      } else {
        const [
          { data: { value: previousValue, date: previousDate, weekDay: prevWeekDay } },
        ] = seriesData;
        comparePoly = {
          currentValue: '',
          currentDate: '',
          previousValue,
          previousDate,
          prevWeekDay,
          curWeekDay: '',
        };
      }
    } else if (seriesData.length === 2) {
      const [
        { data: { value: currentValue, date: currentDate, weekDay: curWeekDay } },
        { data: { value: previousValue, date: previousDate, weekDay: prevWeekDay } },
      ] = seriesData;

      comparePoly = {
        currentValue,
        previousValue,
        currentDate,
        previousDate,
        curWeekDay,
        prevWeekDay,
      };
    } else {
      comparePoly = {
        currentValue: '',
        currentDate: '',
        previousValue: '',
        previousDate: '',
        prevWeekDay: '',
        curWeekDay: '',
      };
    }
    this.setState({
      ...comparePoly,
    });
  }

  render() {
    const {
      chartOptions,
      name,
      unit,
      curWeekDay,
      prevWeekDay,
      currentValue,
      previousValue,
      currentDate,
      previousDate,
      isShowTooltip,
     } = this.state;

    if (_.isEmpty(chartOptions)) {
      return null;
    }

    return (
      <div className={styles.historyPoly}>
        <div className={styles.chartHd}>
          <div className={styles.headerLeft}>
            <span className={styles.chartHdCaption}>历史对比</span>
            <span className={styles.chartUnit}>({unit})</span>
          </div>
        </div>
        <div className={styles.chartMain}>
          <IECharts
            option={chartOptions}
            resizable
            // 处理全局离开事件
            onEvents={{
              globalout: this.handlePloyChartLeave,
            }}
            style={{
              height: '350px',
            }}
          />
        </div>
        {
          isShowTooltip ?
            <div className={styles.chartFoot}>
              <div className={styles.leftGuide}>
                <span className={styles.tipDot} />
                {/* 指标名称 */}
                <span className={styles.tipIndicator}>{name}对比:</span>
              </div>
              <div className={styles.descriptionSection}>
                <div className={styles.currentDescription}>
                  <i className={styles.currentIndicatior} />
                  <span>本期</span>
                  {/* 本期时间 */}
                  <span className={styles.tipTime}>{currentDate ? `${currentDate}${curWeekDay ? `(${curWeekDay})` : ''}:` : ''}</span>
                  {/* 本期Value */}
                  <span className={styles.currentValue}>{(currentValue === 0 || currentValue) ? `${currentValue}` : ''}</span>
                  {/* 本期Vlaue单位 */}
                  <span className={styles.tipUnit}>{(currentValue === 0 || currentValue) ? `${unit}` : ''}</span>
                </div>
                <div className={styles.previousDescription}>
                  <i className={styles.previousIndicatior} />
                  <span>上期</span>
                  {/* 上期时间 */}
                  <span className={styles.tipTime}>{previousDate ? `${previousDate}${prevWeekDay ? `(${prevWeekDay})` : ''}:` : ''}</span>
                  {/* 本期Vlaue */}
                  <span className={styles.contrastValue}>{(previousValue === 0 || previousValue) ? `${previousValue}` : ''}</span>
                  {/* 本期Vlaue单位 */}
                  <span className={styles.tipUnit}>{(previousValue === 0 || previousValue) ? `${unit}` : ''}</span>
                </div>
              </div>
            </div>
            : <div className={styles.noneTooltip} />
        }
      </div>
    );
  }
}
