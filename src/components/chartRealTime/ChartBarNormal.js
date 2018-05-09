/**
 * @fileOverview chartRealTime/ChartBarNormal.js
 * @author sunweibin
 * @description 普通柱状图
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { AxisOptions, gridOptions, barShadow } from './ChartGeneralOptions';
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
} from './FixNumber';
import { data } from '../../helper';
import IECharts from '../IECharts';
import { iconTypeMap, ZHUNICODE, constants } from '../../config';
import report from '../../helper/page/report';
import Icon from '../common/Icon';
import styles from './ChartBar.less';
import imgSrc from './noChart.png';

const getIcon = iconTypeMap.getIcon;
const {
  PERCENT,
  PERMILLAGE,
  REN,
  HU,
  CI,
  YUAN,
  GE,
  UNDISTRIBUTED,
  YUANNIAN,
} = ZHUNICODE;
const defaultFilialeLevel = constants.filialeLevel;

export default class ChartBarNormal extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    chartData: PropTypes.object,
    iconType: PropTypes.string,
    barColor: PropTypes.string.isRequired,
    custRange: PropTypes.array,
    updateQueryState: PropTypes.func,
  }

  static defaultProps = {
    location: {},
    chartData: {},
    iconType: 'zichan',
    updateQueryState: () => { },
    custRange: [],
  }

  constructor(props) {
    super(props);
    this.custRange = data.convertCustRange2Array(props.custRange);
    this.state = {
      mouseoverLabelIndex: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { scope, chartData: { orgModel: nextOrgModel }, custRange } = nextProps;
    const { chartData: { orgModel: prevOrgModel }, custRange: preCustRange } = this.props;
    // 切换汇报方式custRange发生变化
    if (!_.isEqual(custRange, preCustRange)) {
      this.custRange = data.convertCustRange2Array(custRange);
    }
    if (!_.isEqual(nextOrgModel, prevOrgModel)) {
      const echart = this.instance;
      this.yAxisLabels = this.makeYaxisLabels(scope, nextOrgModel);
      this.setState({
        mouseoverLabelIndex: '',
      });
      if (echart) {
        echart.off('mouseover', this.registerMouseover);
        echart.off('mouseout', this.registerMouseout);
        echart.on('mouseover', this.registerMouseover);
        echart.on('mouseout', this.registerMouseout);
      }
    }
  }

  @autobind
  onReady(instance) {
    this.instance = instance;
    const { scope, chartData: { orgModel = [] } } = this.props;
    this.yAxisLabels = this.makeYaxisLabels(scope, orgModel);
    instance.on('click', (arg) => {
      if (arg.componentType !== 'yAxis') {
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
  getChartData(orgModel, key, axis) {
    const yAxisLabels = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          if (axis === 'yAxis') {
            yAxisLabels.push('--');
          } else if (axis === 'xAxis') {
            yAxisLabels.push(0);
          }
        } else {
          yAxisLabels.push(item[key]);
        }
      });
    }
    return yAxisLabels;
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
  makeYaxisLabels(scope, orgModel) {
    const levelName = `level${scope}Name`;
    const yAxisLabels = this.getChartData(orgModel, levelName, 'yAxis');
    const padLength = 10 - yAxisLabels.length;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
      }
    }
    return yAxisLabels;
  }

  @autobind
  createNewSeriesData(series, medianValue, unit, padLength) {
    let maxIndex = 10;
    if (padLength !== 0) {
      maxIndex = 10 - padLength;
    }

    const positions = {
      topRight: ['85%', -14],
      topLeft: [8, -14],
    };

    const howmanyno = (no) => {
      const l = String(no).length;
      const m = no < 0 ? 1 : 0;
      const d = String(no).indexOf('.') > -1 ? 1 : 0;
      const x = (m * 5) + (d * 3) + ((l - m - d) * 8);
      return x;
    };

    const judge = (item) => {
      // 正数最大值
      const plusMax = medianValue.plus * 2;
      // 负数最大值
      const minusMax = medianValue.minus * 2;
      if (minusMax >= 0) {
        // 全是正数
        // return medianValue.plus > item ? 'right' : 'insideRight';
        return positions.topRight;
      } else if (plusMax <= 0) {
        // 全是负数
        // return medianValue.minus < item ? 'left' : 'insideLeft';
        return medianValue.minus < item ? [-howmanyno(item), -14] : [8, -14];
      }
      // 有正有负
      // 判断正负所占比例
      const axisGap = plusMax - minusMax;
      const plusPercent = (plusMax / axisGap) * 100;
      const minusPercent = (Math.abs(minusMax) / axisGap) * 100;
      if (plusPercent < 20 && item >= 0) {
        // return 'left';
        // 此处需要判断有几个数字
        return [-howmanyno(item), -14];
      }
      if (minusPercent < 20 && item <= 0) {
        // return 'right';
        return ['100%', -14];
      }
      if (item > 0) {
        // return medianValue.plus > item ? 'right' : 'insideRight';
        return medianValue.plus > item ? [8, -14] : ['60%', -14];
        // return ['60%', -14];
      } else if (item < 0) {
        // return medianValue.minus < item ? 'left' : 'insideLeft';
        return medianValue.minus < item ? [-howmanyno(item), -14] : [8, -14];
      }
      return 'right';
    };

    return series.map((item, index) => ({
      value: (unit === PERCENT || unit === PERMILLAGE) ? Number(item.toFixed(2)) : item,
      label: {
        normal: {
          textStyle: {
            color: '#666',
          },
          show: false && index < maxIndex,
          position: judge(item),
          // position: ['85%', '-250%'],
          // position: 'top',
        },
      },
    }));
  }

  render() {
    // 取出需要处理的数据
    const { barColor, scope, chartData: { indiModel: { name }, orgModel = [] } } = this.props;
    let { chartData: { indiModel: { unit } } } = this.props;
    // 获取指标ICON
    const IndexIcon = getIcon(unit);
    const levelAndScope = Number(scope);
    // 得到y轴在数据结构中的key名
    const levelName = `level${levelAndScope}Name`;
    // 分公司名称数组
    const levelCompanyArr = this.getChartData(orgModel, 'level2Name', 'yAxis');
    // 财富中心
    const levelWealthArr = this.getChartData(orgModel, 'level3Name', 'yAxis');
    // 营业部
    const levelStoreArr = this.getChartData(orgModel, 'level4Name', 'yAxis');
    // 此处为y轴刻度值
    const yAxisLabels = this.getChartData(orgModel, levelName, 'yAxis');
    // 取出所有的value,并将value转化成数字
    let seriesData = this.getChartData(orgModel, 'value', 'xAxis');
    seriesData = seriesData.map(item => Number(item));
    // 补足10位数字
    const padLength = 10 - seriesData.length;
    if (padLength > 0) {
      for (let i = 0; i < padLength; i++) {
        yAxisLabels.push('--');
        seriesData.push(0);
      }
    }

    // 根据单位进行数字转换
    if (unit === PERCENT) {
      seriesData = seriesData.map(item => (item * 100));
    } else if (unit === PERMILLAGE) {
      seriesData = seriesData.map(item => (item * 1000));
    } else if (unit === YUAN) {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      const tempSeries = toFixedMoney(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    } else if (unit === YUANNIAN) {
      // 如果图表中的数据表示的是金额的话，需要对其进行单位识别和重构
      const tempSeries = toFixedNewMoney(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    } else if (unit === HU) {
      const tempSeries = toFixedCust(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    } else if (unit === CI) {
      const tempSeries = toFixedCI(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    } else if (unit === GE) {
      const tempSeries = toFixedGE(seriesData);
      seriesData = tempSeries.newSeries;
      unit = tempSeries.newUnit;
    }
    const seriesDataLen = seriesData.length;
    // 数据中最大的值
    const xMax = Math.max(...seriesData);
    // 图表边界值,如果xMax是0的话则最大值为1
    let gridXAxisMax = xMax * 1.1 || 1;
    let gridXaxisMin = 0;
    if (unit === PERCENT) {
      const maxAndMinPercent = getMaxAndMinPercent(seriesData);
      gridXAxisMax = maxAndMinPercent.max;
      gridXaxisMin = maxAndMinPercent.min;
    } else if (unit === PERMILLAGE) {
      const maxAndMinPermillage = getMaxAndMinPermillage(seriesData);
      gridXAxisMax = maxAndMinPermillage.max;
      gridXaxisMin = maxAndMinPermillage.min;
    } else if (unit.indexOf(YUAN) > -1) {
      const maxAndMinMoney = getMaxAndMinMoney(seriesData);
      gridXAxisMax = maxAndMinMoney.max;
      gridXaxisMin = maxAndMinMoney.min;
    } else if (unit === REN || unit.indexOf(HU) > -1) {
      const maxAndMinPeople = getMaxAndMinCust(seriesData);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    } else if (unit === CI) {
      const maxAndMinPeople = getMaxAndMinCi(seriesData);
      gridXAxisMax = maxAndMinPeople.max;
      gridXaxisMin = maxAndMinPeople.min;
    } else if (unit === GE) {
      const maxAndMinGE = getMaxAndMinGE(seriesData);
      gridXAxisMax = maxAndMinGE.max;
      gridXaxisMin = maxAndMinGE.min;
    }
    // 计算出所有值的中间值
    const medianValue = {};
    if (gridXAxisMax < 0 || gridXaxisMin > 0) {
      // 要么全是正数，要么全是负数
      medianValue.plus = (gridXAxisMax + gridXaxisMin) / 2;
      medianValue.minus = (gridXAxisMax + gridXaxisMin) / 2;
    } else {
      medianValue.plus = gridXAxisMax / 2;
      medianValue.minus = gridXaxisMin / 2;
    }
    // 需要针对不同的值编写不同的柱状图Label样式
    const newSeriesData = this.createNewSeriesData(seriesData, medianValue, unit, padLength);

    // 此处当 gridXAxisMax 和 gridXaxisMin都是负数的时候后，eChart会出现布局错乱
    // 因此需要改变
    if (gridXaxisMin < 0 && gridXAxisMax < 0) {
      gridXAxisMax = 0;
    }
    // 柱状图阴影
    const maxDataShadow = [];
    const minDataShadow = [];
    for (let i = 0; i < seriesDataLen; i++) {
      maxDataShadow.push(gridXAxisMax);
      minDataShadow.push(gridXaxisMin);
    }
    // tooltip 配置项
    const tooltipOtions = {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        const item = params[2];
        const axisValue = item.axisValue;
        const seriesName = item.seriesName;
        let value = item.data.value;
        const dataIndex = item.dataIndex;
        if (axisValue === '--') {
          value = '--';
        }

        let tooltipHead = '';
        const hasFundCenter = levelWealthArr[dataIndex] !== '--';
        if (levelAndScope === 5 && axisValue !== '--' && hasFundCenter) {
          // 5为投顾或服务经理,需要显示南京公司名称-财富中心-营业部(南京分公司有财富中心)
          tooltipHead = `
            <tr>
              <td>${levelCompanyArr[dataIndex]} - ${levelWealthArr[dataIndex]} - ${levelStoreArr[dataIndex]}</td>
            </tr>
          `;
        } else if (levelAndScope === 5 && axisValue !== '--' && !hasFundCenter) {
          // 5为投顾或服务经理,需要显示xx公司名称-营业部(非南京分公司没有有财富中心)
          tooltipHead = `
            <tr>
              <td>${levelCompanyArr[dataIndex]} - ${levelStoreArr[dataIndex]}</td>
            </tr>
          `;
        } else if (levelAndScope === 4 && axisValue !== '--' && hasFundCenter) {
          // 4为营业部,需要显示南京公司名称-财富中心(南京分公司有财富中心)
          tooltipHead = `
            <tr>
              <td>${levelCompanyArr[dataIndex]} - ${levelWealthArr[dataIndex]}</td>
            </tr>
          `;
        } else if ((levelAndScope === 4 && axisValue !== '--' && !hasFundCenter) ||
          (levelAndScope === 3 && axisValue !== '--')) {
          // 3为财富中心，需要显示南京分公司
          // 4为营业部,只需要显示xx公司名称(非南京分公司没有有财富中心)
          tooltipHead = `
            <tr>
              <td>${levelCompanyArr[dataIndex]}</td>
            </tr>
          `;
        }
        if (axisValue === UNDISTRIBUTED) {
          tooltipHead = '';
        }
        const tips = `
          <table class="echartTooltipTable">
            ${tooltipHead}
            <tr>
              <td>${axisValue}</td>
            </tr>
            <tr>
              <td class="itemValue">${seriesName}: <span>${value}</span> (${unit})</td>
            </tr>
          </table>
        `;
        return tips;
      },
      position(pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        const obj = { top: (pos[1] - size.contentSize[1]) };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      },
      backgroundColor: 'rgba(255, 255, 255, .9)',
      padding: [12, 11, 13, 13],
      extraCssText:
        `border-radius: 8px;
         box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),
                  0 1px 18px 0 rgba(0,0,0,0.12),
                  0 3px 5px -1px rgba(0,0,0,0.3);`,
    };

    const { mouseoverLabelIndex } = this.state;
    // eCharts的配置项
    const options = {
      color: [barColor],
      tooltip: {
        ...tooltipOtions,
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
        max: gridXAxisMax,
        min: gridXaxisMin,
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
          clickable: true,
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
        data: yAxisLabels,
        triggerEvent: true,
      },
      series: [
        {
          ...barShadow,
          clickable: false,
          data: maxDataShadow,
        },
        {
          ...barShadow,
          clickable: false,
          data: minDataShadow,
        },
        {
          name,
          type: 'bar',
          clickable: false,
          silent: true,
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
          barWidth: 6,
          data: newSeriesData,
        },
      ],
    };

    return (
      <div className={styles.chartMain}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <span className={styles.chartIcon} style={{ backgroundColor: barColor }}>
              <Icon type={IndexIcon} className={styles.chartTiltleTextIcon} />
            </span>
            <span className={styles.chartTitleText}>{`${name}(${unit})`}</span>
          </div>
        </div>
        <div className={styles.chartWrapper}>
          {
            (orgModel && orgModel.length > 0)
            ?
            (
              <IECharts
                onReady={this.onReady}
                option={options}
                resizable
                style={{
                  height: '335px',
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
