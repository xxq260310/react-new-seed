/**
 * @description 历史排名堆叠图表
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Icon } from 'antd';
import _ from 'lodash';

import IECharts from '../../IECharts';
import { stackBarColors, yAxis, xAxis, chartGrid, stackTootip } from './rankChartGeneralConfig';
import {
  filterData,
  filterStackSeriesData,
  filterRankData,
  dealStackSeriesData,
  designStackGrid,
  getStackSummury,
  optimizeGrid,
} from './rankDataHandle';
import { data as dataHelper } from '../../../helper';
import { ZHUNICODE, constants } from '../../../config';
import report from '../../../helper/page/report';
import styles from './RankChart.less';

const { UNDISTRIBUTED } = ZHUNICODE;
const defaultFilialeLevel = constants.filialeLevel;

export default class RankStackChart extends PureComponent {
  static propTypes = {
    chartData: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    showChartUnit: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.custRange = dataHelper.convertCustRange2Array(props.custRange);
  }

  componentWillMount() {
    this.initialChartData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { chartData: preData, custRange: preCustRange } = this.props;
    const { chartData, custRange } = nextProps;
    if (!_.isEqual(chartData, preData)) {
      this.state.echart.clear();
      this.initialChartData(nextProps);
    }
    // 切换汇报方式custRange发生变化
    if (!_.isEqual(custRange, preCustRange)) {
      this.custRange = dataHelper.convertCustRange2Array(custRange);
    }
  }

  // Echarts渲染后onReady
  @autobind
  onReady(echart) {
    this.setState({
      echart,
    });
    echart.on('click', (arg) => {
      if (arg.componentType !== 'series') {
        return;
      }
      if (arg.name === '--') {
        return;
      }
      this.custRange.forEach((item) => {
        if (arg.name === item.name) {
          this.props.updateQueryState({
            orgId: item.id,
            level: item.level,
            scope: item.level && item.level === defaultFilialeLevel && !report.isNewOrg(item.id) ?
              String(Number(item.level) + 2) : String(Number(item.level) + 1),
          });
        }
      });
    });
  }

  // 初始化图表数据，
  // props为传递的值，
  // flag表示在constructor设置state，
  // 还是在改变的时候设置
  @autobind
  initialChartData(props) {
    const { scope, chartData: { indiModel: { name, key }, orgModel = [] } } = props;
    let { chartData: { indiModel: { unit } } } = props;
    const levelName = `level${scope}Name`;
    // 分公司名称数组
    const company = filterData(orgModel, 'level2Name', 'yAxis');
    // 财富中心名称数组
    const wealth = filterData(orgModel, 'level3Name', 'yAxis');
    // 营业部名称数组
    const stores = filterData(orgModel, 'level4Name', 'yAxis');
    // 此处为y轴刻度值
    const yAxisLabels = filterData(orgModel, levelName, 'yAxis');
    // 获取排名信息数据
    const rank = filterRankData(orgModel);
    // 获取合计值，即orgModel的value值，用于右侧显示使用
    const summury = filterData(orgModel, 'value', 'xAxis');
    // 补足Y轴刻度值不够的情况
    // 补足10位数字
    const realLength = yAxisLabels.length;
    const padLength = 10 - realLength;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
      }
    }
    // 获取原始的stackSeries数据
    const stack = filterStackSeriesData(orgModel, 'indiModelList', key);
    // 原始stackSeries数据
    let stackSeries = stack.series;
    const legends = stack.legends;
    // 根据单位进行数据处理
    const dealResult = dealStackSeriesData(stackSeries, unit, summury);
    stackSeries = dealResult.newStackSeries;
    unit = dealResult.newUnit;
    const custSummury = getStackSummury(stackSeries);
    // 设计直角坐标系
    const newGrid = designStackGrid(stackSeries, unit);
    // 改变头部的单位显示
    this.props.showChartUnit(unit);
    this.setState({
      scope,
      unit,
      name,
      company,
      wealth,
      stores,
      yAxisLabels,
      grid: newGrid,
      stackSeries,
      rank,
      summury: custSummury,
      legends,
      realLength,
    });
  }

  @autobind
  makeDataArray(v) {
    return new Array(10).fill(v);
  }
  // 生成坐标轴
  @autobind
  makeAxis(gridIndex, base, others) {
    return {
      ...base,
      gridIndex,
      ...others,
    };
  }
  // 用来占位的
  @autobind
  makeLabelShadowSeries(name, data) {
    return {
      name,
      data,
      stack: 'label-shadow',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      label: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        normal: { color: 'transparent' },
      },
      barWidth: '22',
    };
  }
  // 柱状图阴影
  @autobind
  makeDataShadowSeries(name, data) {
    return {
      name,
      data,
      type: 'bar',
      stack: 'data-shadow',
      xAxisIndex: 0,
      yAxisIndex: 0,
      label: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      barGap: 0,
      barWidth: '4',
    };
  }
  // 柱状图Label
  @autobind
  makeLabelSeries(name, data, labels, realLength) {
    const flag = name === 'max-label';
    const position = flag ? 'insideRight' : 'insideLeft';
    const textColor = flag ? '#999' : '#333';
    const hoverTextColor = flag ? '#999' : '#348cf0';
    return {
      name,
      data,
      type: 'bar',
      stack: 'label',
      xAxisIndex: 1,
      yAxisIndex: 1,
      barWidth: '22',
      animation: false,
      itemStyle: {
        normal: { color: 'transparent' },
      },
      label: {
        normal: {
          show: true,
          position,
          textStyle: { color: textColor },
          formatter(p) {
            const index = p.dataIndex;
            if (index < realLength) {
              return labels[p.dataIndex];
            }
            return '--';
          },
        },
        emphasis: {
          show: true,
          textStyle: { color: hoverTextColor },
        },
      },
    };
  }

  @autobind
  optimizeLableSeriesOrder(grid, maxLabelSeries, minLabelSeries) {
    // label显示还跟其在echart中series中的顺序有关
    const { max } = grid;
    if (max <= 0) {
      return [
        maxLabelSeries,
        minLabelSeries,
      ];
    }
    return [
      minLabelSeries,
      maxLabelSeries,
    ];
  }

  @autobind
  makeRealSeries(data) {
    return data.map((item) => {
      const newItem = {
        ...item,
        xAxisIndex: 1,
        yAxisIndex: 1,
        barGap: 0,
        barWidth: '4',
      };
      return newItem;
    });
  }

  @autobind
  makeTooltip(base, scope, company, wealth, store, unit, legends) {
    return {
      ...base,
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
          if (index > 5) {
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
              let title = '';
              const hasFundCenter = wealth[dataIndex] !== '--';
              // 针对不同的机构级别需要显示不同的分类
              if ((scope === 3 && axisValue !== '--') || (scope === 4 && axisValue !== '--' && !hasFundCenter)) {
                // 3为财富中心，需要显示南京分公司名称
                // 4为营业部,只需要显示xx公司名称(非南京分公司没有财富中心)
                title = `${company[dataIndex]}`;
              } else if (scope === 4 && axisValue !== '--' && hasFundCenter) {
                // 4为营业部,需要显示南京公司名称-财富中心(南京分公司有财富中心)
                title = `${company[dataIndex]} - ${wealth[dataIndex]}`;
              } else if (scope === 5 && axisValue !== '--' && hasFundCenter) {
                // 5为投顾或服务经理,需要显示南京公司名称-财富中心-营业部(南京分公司有财富中心)
                title = `${company[dataIndex]} - ${wealth[dataIndex]} - ${store[dataIndex]}`;
              } else if (scope === 5 && axisValue !== '--' && !hasFundCenter) {
                 // 5为投顾或服务经理,需要显示xx公司名称-营业部(非南京分公司没有有财富中心)
                title = `${company[dataIndex]} - ${store[dataIndex]}`;
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
            const legend = index - 6;
            // const legendStateKey = `legend${legend}`;
            // if (true || !legendState[legendStateKey]) {
            seriesTips.push(`
              <tr>
                <td>
                  <span class="echartTooltip" style="background-color:${legends[legend].backgroundColor}"></span>
                </td>
                <td class="tooltipItem">${seriesName}:</td>
                <td class="itemValue" colspan="2">
                  <span>${value}</span>
                </td>
              <tr>
            `);
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
    };
  }

  render() {
    const {
      scope,
      unit,
      company,
      wealth,
      stores,
      yAxisLabels,
      grid,
      stackSeries,
      rank,
      summury,
      legends,
      realLength,
    } = this.state;
    // 生成最大值数组和最小值数组
    const realGrid = optimizeGrid(grid);
    const maxData = this.makeDataArray(realGrid.max);
    const minData = this.makeDataArray(realGrid.min);
    // Label的series
    const maxLabelSeries = this.makeLabelSeries('max-label', maxData, summury, realLength);
    const minLabelSeries = this.makeLabelSeries('min-label', minData, yAxisLabels, realLength);

    const options = {
      color: [...stackBarColors],
      tooltip: this.makeTooltip(stackTootip, scope, company, wealth, stores, unit, legends),
      grid: [
        ...chartGrid,
      ],
      xAxis: [
        this.makeAxis(0, xAxis, grid),
        this.makeAxis(1, xAxis, grid),
      ],
      yAxis: [
        this.makeAxis(0, yAxis, { data: yAxisLabels }),
        this.makeAxis(1, yAxis, { data: yAxisLabels }),
      ],
      series: [
        this.makeLabelShadowSeries('min-shadow', minData),
        this.makeLabelShadowSeries('max-shadow', maxData),
        this.makeDataShadowSeries('data-shadow', minData),
        this.makeDataShadowSeries('data-shadow', maxData),
        ...this.optimizeLableSeriesOrder(realGrid, maxLabelSeries, minLabelSeries),
        ...this.makeRealSeries(stackSeries),
      ],
    };
    return (
      <div className={styles.rankChart}>
        {/* 排名序号,以及名次变化 */}
        <div className={styles.ranking}>
          {
            rank.map((item, index) => {
              const key = `rank-${index}`;
              const { change } = item;
              let { current } = item;
              let rankClass;
              let changeText;
              let changeIcon;
              if (change === null) {
                rankClass = classnames({
                  [styles.rankHold]: true,
                });
                changeIcon = '--';
                changeText = '--';
              } else {
                const icon = change < 0 ? 'arrow-down' : 'arrow-up';
                rankClass = classnames({
                  [styles.rankUp]: change > 0,
                  [styles.rankDown]: change < 0,
                  [styles.rankHold]: change === 0,
                });
                changeText = change === 0 ? '不变' : `${Math.abs(change)}名`;
                changeIcon = change === 0 ? '--' : (<Icon type={icon} />);
              }
              if (current === null) {
                current = '--';
              }
              return (
                <div key={key} className={styles.rankNumberAndChange}>
                  <span className={styles.rankNumber}>{current}</span>
                  <span className={rankClass}>{changeIcon}</span>
                  <span className={styles.rankChange}>{changeText}</span>
                </div>
              );
            })
          }
        </div>
        <div className={styles.rankingchart}>
          <IECharts
            option={options}
            resizable
            onReady={this.onReady}
            style={{
              height: '370px',
            }}
          />
        </div>
      </div>
    );
  }
}
