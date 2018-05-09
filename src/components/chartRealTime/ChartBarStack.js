/**
 * @fileOverview chartRealTime/ChartBarStack.js
 * @author sunweibin
 * @description 堆叠柱状图
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Resize from 'element-resize-detector';
import _ from 'lodash';

import { AxisOptions, gridOptions, stackBarColors, barShadow } from './ChartGeneralOptions';
import {
  filterOrgModelData,
  getStackSeries,
  dealStackSeriesMoney,
  dealStackSeriesNewMoney,
  dealStackData,
  fixedMoneyMaxMin,
  fixedPeopleMaxMin,
  dealStackSeiesHu,
} from './chartData';
import { data } from '../../helper';
import { stackTooltip } from './chartTooltipConfig';
import IECharts from '../IECharts';
import { iconTypeMap, ZHUNICODE, constants } from '../../config';
import report from '../../helper/page/report';
import Icon from '../common/Icon';
import styles from './ChartBar.less';
import imgSrc from '../chartRealTime/noChart.png';
import logable from '../../decorators/logable';

const {
  REN,
  HU,
  YUAN,
  UNDISTRIBUTED,
  YUANNIAN,
} = ZHUNICODE;
const getIcon = iconTypeMap.getIcon;
const defaultFilialeLevel = constants.filialeLevel;

export default class ChartBarStack extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    chartData: PropTypes.object,
    custRange: PropTypes.array,
    updateQueryState: PropTypes.func,
  }

  static defaultProps = {
    location: {},
    chartData: {},
    updateQueryState: () => { },
    custRange: [],
  }

  constructor(props) {
    super(props);
    this.custRange = data.convertCustRange2Array(props.custRange);
    // 堆数据进行初步的分析
    // 初始化的时候，可能不存在值
    this.initialData(props, true);
  }

  componentDidMount() {
    // 此处需要对legend进行宽高进行监测
    // 先进行初始化的处理
    this.handleResize();
    this.registerResizeListener();
  }

  componentWillReceiveProps(nextProps) {
    const { scope: preScope, chartData: preData, custRange: preCustRange } = this.props;
    const { scope, chartData, custRange } = nextProps;
    if (!_.isEqual(scope, preScope) || !_.isEqual(chartData, preData)) {
      this.initialData(nextProps);
    }
    // 切换汇报方式custRange发生变化
    if (!_.isEqual(custRange, preCustRange)) {
      this.custRange = data.convertCustRange2Array(custRange);
    }
  }

  componentWillUnmount() {
    const { resize } = this.state;
    if (resize && resize.uninstall) {
      const dom = this.legendDom;
      resize.uninstall(dom);
    }
  }

  @autobind
  onReady(instance) {
    this.instance = instance;
    instance.on('click', (arg) => {
      if (arg.componentType !== 'yAxis') {
        return;
      }
      if (Number(this.props.scope) === 5) { // 5为最底层level(投顾，服务经理)
        return;
      }
      this.custRange.forEach((item) => {
        if (arg.value === item.name) {
          this.props.updateQueryState({
            orgId: item.id,
            custRangeLevel: item.level,
            level: item.level,
            scope: item.level && item.level === defaultFilialeLevel && !report.isNewOrg(item.id) ?
              (Number(item.level) + 2) : (Number(item.level) + 1),
          });
        }
      });
    });
    instance.on('mouseover', this.registerMouseover);
    instance.on('mouseout', this.registerMouseout);
  }

  @autobind
  setLegendRef(input) {
    this.legendDom = input;
  }

  @autobind
  setHeight(wrapperH) {
    this.setState({
      wrapperH,
    });
  }

  @autobind
  registerMouseover(arg) {
    if (arg.componentType !== 'yAxis') {
      return;
    }
    if (arg.value === '--') {
      return;
    }
    const anid = arg.event.target.anid;
    const index = anid.split('_')[1];
    this.setState({
      mouseoverLabelIndex: Number(index),
    });
  }

  @autobind
  registerMouseout(arg) {
    if (arg.componentType !== 'yAxis') {
      return;
    }
    this.setState({
      mouseoverLabelIndex: '',
    });
  }

  @autobind
  initialData(props, flag) {
    const { scope, chartData: { indiModel: { name, key }, orgModel = [] } } = props;
    let { chartData: { indiModel: { unit } } } = props;
    const iconType = getIcon(unit);
    // 查询当前需要的Y轴字段名称
    const levelAndScope = Number(scope);
    const levelName = `level${levelAndScope}Name`;
    // 分公司名称数组
    const levelCompanyArr = filterOrgModelData(orgModel, 'level2Name');
    // 财富中心名称数组
    const levelWealthArr = filterOrgModelData(orgModel, 'level3Name');
    // 营业部名称数组
    const levelStoreArr = filterOrgModelData(orgModel, 'level4Name');
    // 此处为y轴刻度值
    const yAxisLabels = filterOrgModelData(orgModel, levelName);
    // 补足Y轴刻度值不够的情况
    const padLength = 10 - yAxisLabels.length;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
      }
    }
    // 获取合计的值
    const totals = filterOrgModelData(orgModel, 'value');
    // 获取原始的stackSeries数据
    const stack = getStackSeries(orgModel, 'indiModelList', key);
    const stackLegend = stack.legends;
    let stackSeries = stack.series;
    // 此处需要进行对stackSeries中的每一个data根据单位来进行特殊处理
    if (unit === YUAN) {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      // 此处先前写的newTotals不在使用，需要注销
      const tempStackSeries = dealStackSeriesMoney(stackSeries, totals);
      stackSeries = tempStackSeries.newStackSeries;
      unit = tempStackSeries.newUnit;
    } else if (unit === YUANNIAN) {
      // 如果图表中的数据表示的是金额并且单位为元/年，需要对其进行单位识别和重构
      // 此处先前写的newTotals不在使用，需要注销
      const tempStackSeries = dealStackSeriesNewMoney(stackSeries, totals);
      stackSeries = tempStackSeries.newStackSeries;
      unit = tempStackSeries.newUnit;
    } else if (unit === HU) {
      const tempStackSeries = dealStackSeiesHu(stackSeries, totals);
      stackSeries = tempStackSeries.newStackSeries;
      unit = tempStackSeries.newUnit;
    }

    const grid = this.calculateBarChartXaxisTick(stackSeries, unit);
    // 初始化所有的数据，并存入state
    // 此为后面需要修改echarts的series做准备
    if (flag) {
      this.state = {
        mouseoverLabelIndex: '',
        wrapperH: 0,
        chartName: name,
        iconType,
        unit,
        key,
        levelAndScope,
        levelCompanyArr,
        levelWealthArr,
        levelStoreArr,
        yAxisLabels,
        stackLegend,
        stackSeries, // Echarts图表绘制需要的数据
        originalStackSeries: _.cloneDeep(stackSeries), // 保存计算后的原始数据,必须深度拷贝
        totals,
        grid,
        legendState: {},
      };
    } else {
      this.setState({
        mouseoverLabelIndex: '',
        iconType,
        unit,
        key,
        levelAndScope,
        levelCompanyArr,
        levelWealthArr,
        levelStoreArr,
        yAxisLabels,
        stackLegend,
        stackSeries, // Echarts图表绘制需要的数据
        originalStackSeries: _.cloneDeep(stackSeries), // 保存计算后的原始数据,必须深度拷贝
        totals,
        grid,
        legendState: {},
      });
      const echart = this.instance;
      if (echart) {
        echart.off('mouseover', this.registerMouseover);
        echart.off('mouseout', this.registerMouseout);
        echart.on('mouseover', this.registerMouseover);
        echart.on('mouseout', this.registerMouseout);
      }
    }
  }

  @autobind
  handleResize() {
    const legend = this.legendDom;
    const legendH = legend.clientHeight;
    const echartH = 380 - 45 - legendH - 5;
    this.setHeight(echartH);
  }

  @autobind
  registerResizeListener() {
    const dom = this.legendDom;
    const resize = this.state.resize || Resize({ strategy: 'scroll' });
    resize.listenTo(dom, () => this.handleResize());
    // 此处需要将resize记住，后面需要将其注销掉
    this.setState({
      resize,
    });
  }

  // 计算出Echarts图表坐标轴的刻度相关
  @autobind
  calculateBarChartXaxisTick(stackSeries, unit) {
    // 处理Echarts图表刻度值
    // 此处处理图表中的数据，与tooltip中的数据无关
    // stackSeries的data中
    const gridAxisTick = dealStackData(stackSeries);
    // 图表边界值,如果xMax是0的话则最大值为1
    let gridXAxisMax = 1;
    let gridXaxisMin = 0;
    if (unit.indexOf(YUAN) > -1) {
      const maxAndMinMoney = fixedMoneyMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinMoney.max;
      gridXaxisMin = maxAndMinMoney.min;
    } else if (unit.indexOf(HU) > -1 || unit === REN) {
      const maxAndMinPeople = fixedPeopleMaxMin(gridAxisTick);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    }

    // 柱状图阴影的数据series
    const maxDataShadow = [];
    const minDataShadow = [];
    for (let i = 0; i < 10; i++) {
      maxDataShadow.push(gridXAxisMax);
      minDataShadow.push(gridXaxisMin);
    }

    return {
      gridXAxisMax,
      gridXaxisMin,
      maxDataShadow,
      minDataShadow,
    };
  }

  // 改变图例的状态
  @autobind
  changeLegendState(state) {
    const { legendState } = this.state;
    this.setState({
      legendState: {
        ...legendState,
        ...state,
      },
    });
  }

  // 取消Legend
  // 需要将某个series的数据修改为0
  @autobind
  cancelLegend(legend) {
    const legendStateKey = `legend${legend}`;
    this.changeLegendState({
      [legendStateKey]: true,
    });
    const { stackSeries, unit } = this.state;
    const newStackSeeries = stackSeries.map((item, index) => {
      const newItem = item;
      if (index === legend) {
        newItem.data = newItem.data.map(() => 0);
      }
      return newItem;
    });
    const grid = this.calculateBarChartXaxisTick(stackSeries, unit);
    this.setState({
      stackSeries: newStackSeeries,
      grid,
    });
  }

  // 点亮Legend
  // 需要将某个series的数据恢复为初始值
  @autobind
  lightenLegend(legend) {
    const legendStateKey = `legend${legend}`;
    this.changeLegendState({
      [legendStateKey]: false,
    });
    const { stackSeries, originalStackSeries, unit } = this.state;
    // 需要进行新的数据图表切换
    const newStackSeeries = stackSeries.map((item, index) => {
      const newItem = item;
      if (index === legend) {
        newItem.data = originalStackSeries[legend].data;
      }
      return newItem;
    });
    const grid = this.calculateBarChartXaxisTick(stackSeries, unit);
    this.setState({
      stackSeries: newStackSeeries,
      grid,
    });
  }

  @autobind
  @logable({
    type: 'DrillDown',
    payload: {
      name: '图例',
      element: '$args[0].currentTarget',
    },
  })
  handleLegendClick(e) {
    const current = e.currentTarget;
    const legend = Number.parseInt(current.dataset.legend, 10);
    const legendStateKey = `legend${legend}`;
    const { legendState } = this.state;
    if (!legendState[legendStateKey]) {
      // 默认情况下，所有图例均被点亮,
      // 变暗Legend
      this.cancelLegend(legend);
    } else {
      // 点亮Legend
      this.lightenLegend(legend);
    }
  }

  render() {
    const {
      chartName,
      iconType,
      unit,
      key,
      levelAndScope,
      levelCompanyArr,
      levelWealthArr,
      levelStoreArr,
      yAxisLabels,
      stackLegend,
      stackSeries,
      grid,
      legendState,
      mouseoverLabelIndex,
    } = this.state;

    // eCharts的配置项
    const options = {
      color: [...stackBarColors],
      tooltip: {
        ...stackTooltip,
        formatter(params) {
          // 堆叠柱状图上因为有多系列的值
          // 所有此处需要做处理
          // 需要对总计进行新的处理
          const series = params;
          const total = [];
          // const total = statckTotal;
          // 判断有没有讲y轴的名称放入到tooltip中
          let hasPushedAxis = false;
          // 因为第一个series是阴影
          const seriesTips = [];
          series.forEach((item, index) => {
            if (index > 1) {
              const axisValue = item.axisValue;
              const seriesName = item.seriesName;
              const dataIndex = item.dataIndex;
              let value = item.value;
              if (axisValue === '--') {
                // 无数据的情况
                value = '--';
              }
              if (axisValue !== '--') {
                total.push(value);
              }
              if (!hasPushedAxis) {
                hasPushedAxis = true;
                const hasFundCenter = levelWealthArr[dataIndex] !== '--';
                let title = '';
                // 针对不同的机构级别需要显示不同的分类
                if ((levelAndScope === 4 && axisValue !== '--' && !hasFundCenter) ||
                  (levelAndScope === 3 && axisValue !== '--')) {
                  // 3为财富中心，需要显示南京分公司名称
                  // 4为营业部,只需要显示xx公司名称(非南京分公司没有财富中心)
                  title = `${levelCompanyArr[dataIndex]}`;
                } else if (levelAndScope === 4 && axisValue !== '--' && hasFundCenter) {
                  // 4为营业部,需要显示南京公司名称-财富中心(南京分公司有财富中心)
                  title = `${levelCompanyArr[dataIndex]} - ${levelWealthArr[dataIndex]}`;
                } else if (levelAndScope === 5 && axisValue !== '--' && hasFundCenter) {
                  // 5为投顾或服务经理,需要显示南京公司名称-财富中心-营业部(南京分公司有财富中心)
                  title = `${levelCompanyArr[dataIndex]} - ${levelWealthArr[dataIndex]} - ${levelStoreArr[dataIndex]}`;
                } else if (levelAndScope === 5 && axisValue !== '--' && !hasFundCenter) {
                   // 5为投顾或服务经理,需要显示xx公司名称-营业部(非南京分公司没有有财富中心)
                  title = `${levelCompanyArr[dataIndex]} - ${levelStoreArr[dataIndex]}`;
                }
                let toolTipNewHeader = `
                  <tr>
                    <td colspan="4">${title}</td>
                  <tr>
                `;
                if (axisValue === UNDISTRIBUTED) {
                  toolTipNewHeader = '';
                }
                seriesTips.push(`
                  ${toolTipNewHeader}
                  <tr>
                    <td colspan="4">${axisValue}</td>
                  </tr>
                `);
              }
              // 此处需要将取消掉的Legend的tooltip隐藏掉
              const legend = index - 2;
              const legendStateKey = `legend${legend}`;
              if (!legendState[legendStateKey]) {
                seriesTips.push(`
                  <tr>
                    <td>
                      <span class="echartTooltip" style="background-color:${stackLegend[legend].backgroundColor}"></span>
                    </td>
                    <td class="tooltipItem">${seriesName}:</td>
                    <td class="itemValue" colspan="2">
                      <span>${value}</span>
                    </td>
                  <tr>
                `);
              }
              // // 判断是否到最后一个了
              // if ((series.length - 1) === index) {
              //   // 如果到了最后一个
              //   tips.push(`共 <span style="color:#ffd92a; font-size:14px;">
              //   ${total[dataIndex]}</span> ${unit}`);
              // }
            }
          });
          let totalV = '';
          if (total.length > 0) {
            totalV = Number.parseFloat(_.sum(total).toFixed(2));
          } else {
            totalV = '--';
          }
          // 此处为新增对共计数据的处理，因为他们要求直接使用提供的值
          const tips = `
            <table class="echartTooltipTable">
              ${seriesTips.join('')}
              <tr>
                <td></td>
                <td class="tooltipItem">合计:</td>
                <td class="itemValue">
                  <span>${totalV}</span>
                </td>
                <td>
                   (${unit})
                </td>
              </tr>
            </table>
          `;
          return tips;
        },
      },
      grid: {
        ...gridOptions,
      },
      xAxis: {
        type: 'value',
        nameGap: '6',
        nameTextStyle: {
          color: '#999',
        },
        max: grid.gridXAxisMax,
        min: grid.gridXaxisMin,
        ...AxisOptions,
        axisTick: {
          show: true,
          lineStyle: {
            color: '#e7eaec',
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#e7eaec',
          },
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        ...AxisOptions,
        axisLabel: {
          ...AxisOptions.axisLabel,
          formatter(value) {
            if (!value) {
              return '--';
            }
            if (value.length > 4) {
              return `${value.substr(0, 4)}...`;
            }
            return value;
          },
          textStyle: {
            color(v, index) {
              return index === mouseoverLabelIndex ? '#348cf0' : '#999';
            },
          },
        },
        triggerEvent: true,
        data: yAxisLabels,
      },
      series: [
        {
          ...barShadow,
          clickable: false,
          data: grid.maxDataShadow,
        },
        {
          ...barShadow,
          clickable: false,
          data: grid.minDataShadow,
        },
        ...stackSeries,
      ],
    };
    return (
      <div className={styles.chartMain}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <span className={styles.chartIcon}>
              <Icon type={iconType} className={styles.chartTiltleTextIcon} />
            </span>
            <span className={styles.chartTitleText}>{`${chartName}(${unit})`}</span>
          </div>
        </div>
        <div className={styles.chartLegend} ref={this.setLegendRef}>
          {
            stackLegend.map((item, index) => {
              const { legendName, backgroundColor } = item;
              const bkc = legendState[`legend${index}`] ? '#ccc' : backgroundColor;
              const color = legendState[`legend${index}`] ? '#ccc' : '#777';
              const uniqueKey = `${key}-legend-${index}`;
              return (
                <div
                  className={styles.oneLegend}
                  key={uniqueKey}
                  data-legend={index}
                  onClick={this.handleLegendClick}
                  style={{
                    color,
                  }}
                >
                  <div
                    className={styles.legendIcon}
                    style={{
                      backgroundColor: bkc,
                    }}
                  />
                  {legendName}
                </div>
              );
            })
          }
        </div>
        <div className={styles.chartWrapper}>
          {
            (stackSeries && stackSeries.length > 0)
            ?
            (
              <IECharts
                onReady={this.onReady}
                option={options}
                resizable
                style={{
                  height: this.state.wrapperH,
                }}
              />
            )
            :
            (
              <div className={styles.noChart}>
                <img src={imgSrc} alt="图表不可见" />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
