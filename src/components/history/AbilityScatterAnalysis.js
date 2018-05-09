/**
 * by xuxiaoqin
 * AbilityScatterAnalysis.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import CommonScatter from '../chartRealTime/CommonScatter';
import imgSrc from './img/noChart.png';
import {
  EXCEPT_CUST_JYYJ_MAP,
  EXCEPT_CUST_TGJX_MAP,
  EXCEPT_CUST_TOUGU_TGJX_MAP,
  EXCEPT_TOUGU_JYYJ_MAP,
} from '../../config/SpecialIndicators';
import { optionsMap, constants } from '../../config';
import report from '../../helper/page/report';
import { constructScatterData } from './ConstructScatterData';
import { constructScatterOptions } from './ConstructScatterOptions';
import styles from './abilityScatterAnalysis.less';
import { checkTooltipStatus } from '../../decorators/checkTooltipStatus';
import logable from '../../decorators/logable';

const Option = Select.Option;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const YI = '亿';
const WAN = '万';
// 按类别排序
const sortByType = optionsMap.sortByType;
// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;

export default class AbilityScatterAnalysis extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    optionsData: PropTypes.array,
    type: PropTypes.string.isRequired,
    switchDefault: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    contrastType: PropTypes.string.isRequired,
    isLvIndicator: PropTypes.bool.isRequired,
    level: PropTypes.string.isRequired,
    scope: PropTypes.string,
    boardType: PropTypes.string,
    currentSelectIndicatorKey: PropTypes.string.isRequired,
    isCommissionRate: PropTypes.bool.isRequired,
    orgId: PropTypes.string,
    summaryType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    optionsData: EMPTY_LIST,
    scope: '2', // 查询数据的维度
    boardType: '',
    orgId: '',
  };

  constructor(props) {
    super(props);
    const options = this.makeOptions(props.optionsData);
    const { scope } = props; // scope为维度
    // 默认第一个选项
    this.state = {
      scopeSelectValue: scope,
      scope,
      scatterElemHeight: 360,
      finalData: {},
      isShowTooltip: false,
      level2Name: '',
      level3Name: '',
      level4Name: '',
      level5Name: '',
      finalOptions: options,
      selectValue: !_.isEmpty(options) && options[0].value,
      averageInfo: '',
      tooltipInfo: '',
      scatterOptions: EMPTY_OBJECT,
      average: '',
      averageXUnit: '',
      averageYUnit: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: nextData,
      optionsData: nextOptions,
      switchDefault: nextSwitch,
      isLvIndicator,
      isCommissionRate,
      scope,
     } = nextProps;
    const {
      scope: preScope,
      description,
      optionsData: prevOptions,
      switchDefault: prevSwitch,
    } = this.props;
    const {
      core = EMPTY_OBJECT,
      contrast = EMPTY_OBJECT,
      scatterDiagramModels = EMPTY_LIST,
    } = nextData;

    if (!_.isEqual(preScope, scope) || !_.isEqual(prevSwitch, nextSwitch)) {
      this.setState({
        scopeSelectValue: scope,
        scope,
      });
    }

    // 有值就构造图表数据
    if (!_.isEmpty(scatterDiagramModels)) {
      const finalData = constructScatterData({
        core,
        contrast,
        scatterDiagramModels,
        description,
        isLvIndicator,
        isCommissionRate,
      });
      const { averageInfo, averageXUnit, averageYUnit } = finalData;
      this.getAnyPoint(finalData);
      this.setState({
        finalData,
        averageInfo,
        averageXUnit,
        averageYUnit,
      });
    } else {
      this.setState({
        finalData: EMPTY_OBJECT,
        averageInfo: '',
      });
    }

    // 恢复默认选项
    if (!_.isEqual(prevSwitch, nextSwitch)) {
      const options = this.state.finalOptions;
      this.setState({
        selectValue: !_.isEmpty(options) && options[0].value,
      });
    }

    // 切换对比数据
    if (prevOptions !== nextOptions) {
      const data = this.makeOptions(nextOptions);
      this.setState({
        finalOptions: data,
        selectValue: !_.isEmpty(data) && data[0].value,
      });
    }
  }

  /**
   * 根据斜率，计算出一个点，用来画直线，点必须靠近最大值，不然线不能延长
   * @param {*} seriesData series数据
   */
  getAnyPoint(seriesData) {
    const { xAxisMin, yAxisMin, yAxisMax, slope, xAxisMax, average } = seriesData;
    if (average) {
      // 代表率
      // 直接画出一条横线，代表平均线
      const scatterOptions = constructScatterOptions({
        ...seriesData,
        startCoord: [xAxisMin, average],
        endCoord: [xAxisMax, average],
      });

      this.setState({
        scatterOptions,
        average,
      });
      return true;
    }

    if (slope === 0) {
      // 处理斜率等于0
      // 画出两个空折线图，平均线横躺
      const scatterOptions = constructScatterOptions({
        ...seriesData,
        startCoord: [0, 0],
        endCoord: [1, 0],
      });

      this.setState({
        scatterOptions,
        average: '',
      });
      return true;
    } else if (slope <= 1) {
      // 处理斜率小于1的情况
      // 太小的斜率直接计算坐标
      const endYCood = xAxisMax * slope;
      let finalSeriesData = {
        ...seriesData,
        startCoord: [xAxisMin, yAxisMin],
        endCoord: [xAxisMax, endYCood],
      };

      // 如果算出来的y坐标小于或者大于轴刻度的最小或最大值
      // 则将计算出来的值，作为刻度边界值，取floor或者ceil
      if (endYCood < yAxisMin) {
        const newYAxisMin = Math.floor(endYCood);
        finalSeriesData = {
          ...finalSeriesData,
          yAxisMin: newYAxisMin,
          startCoord: [xAxisMin, newYAxisMin],
        };
      } else if (endYCood > yAxisMax) {
        finalSeriesData = {
          ...finalSeriesData,
          yAxisMax: Math.ceil(endYCood),
        };
      }
      const scatterOptions = constructScatterOptions({
        ...finalSeriesData,
      });

      this.setState({
        scatterOptions,
        average: '',
      });
      return true;
    }

    // x轴最大值为当前比较值，算出y轴的值
    let compare = xAxisMax;
    let current = yAxisMax;
    let point = current / slope;
    let endCoord = [point, current];
    let finalSeriesData = {
      ...seriesData,
      startCoord: [xAxisMin, yAxisMin],
    };
    if (point <= compare) {
      // 如果算出来的x坐标小于轴刻度的最小
      // 则将计算出来的值，作为刻度边界值，取floor
      if (point < xAxisMin) {
        const newXAxisMin = Math.floor(point);
        finalSeriesData = {
          ...seriesData,
          xAxisMin: newXAxisMin,
          startCoord: [newXAxisMin, yAxisMin],
        };
      }
    } else {
      // y轴最大值为当前比较值，算出x轴的值
      compare = yAxisMax;
      current = xAxisMax;
      point = current * slope;
      endCoord = [current, point];
      // 如果算出来的y坐标小于轴刻度的最小
      // 则将计算出来的值，作为刻度边界值，取floor
      if (point < yAxisMin) {
        const newYAxisMin = Math.floor(point);
        finalSeriesData = {
          ...seriesData,
          yAxisMin: newYAxisMin,
          startCoord: [xAxisMin, newYAxisMin],
        };
      }
    }

    const scatterOptions = constructScatterOptions({
      ...finalSeriesData,
      endCoord,
    });

    this.setState({
      scatterOptions,
      average: '',
    });
    return true;
  }

  @autobind
  getPopupContainer() {
    return document.querySelector('.react-app');
  }

  @autobind
  makeOptions(optionsData) {
    if (_.isEmpty(optionsData)) {
      return EMPTY_LIST;
    }

    return optionsData.map(item => ({
      key: item.key,
      value: item.key,
      label: item.name,
    }));
  }

  /**
  * 构造tooltip的信息
  * @param {*} currentItemInfo 当前鼠标悬浮的点数据
  */
  constructTooltipInfo(currentItemInfo) {
    const { description } = this.props;
    const { averageXUnit, averageYUnit } = this.state;
    const {
      currentSelectX,
      currentSelectY,
      xAxisName,
      xAxisUnit,
      yAxisName,
      yAxisUnit,
      slope,
      average,
    } = currentItemInfo;

    let compareSlope = '';
    let currentSlope;
    let tooltipInfo = `${xAxisName}：${currentSelectX}${xAxisUnit}，${yAxisName}：${currentSelectY}${yAxisUnit}`;
    let currentAverageValue = currentSelectY / currentSelectX;
    let finalXAxisUnit = xAxisUnit;
    let finalYAxisUnit = yAxisUnit;

    if (average) {
      // 对于率的指标作特殊处理
      // 比较每个点信息与平均值的比较
      compareSlope = average;
      currentSlope = currentSelectY;
      tooltipInfo = `${tooltipInfo}。${this.compareSlope(Number(currentSlope).toFixed(2), Number(compareSlope).toFixed(2))}于平均水平。`;
    } else {
      if (averageXUnit !== finalXAxisUnit
        || averageYUnit !== finalYAxisUnit) {
        // 0.00这一类的
        if (finalYAxisUnit.indexOf(YI) !== -1 && finalXAxisUnit.indexOf(WAN) === -1) {
          finalXAxisUnit = `万${finalXAxisUnit}`;
          currentAverageValue *= 10000;
        } else if (finalYAxisUnit.indexOf(WAN) !== -1 && finalXAxisUnit.indexOf(WAN) === -1) {
          finalYAxisUnit = finalYAxisUnit.replace(WAN, YI);
          if (currentAverageValue / 10000 > 0.01) {
            currentAverageValue /= 10000;
          } else {
            finalXAxisUnit = `万${finalXAxisUnit}`;
          }
        } else if (finalYAxisUnit.indexOf(WAN) === -1 && averageYUnit.indexOf(WAN) !== -1
          && averageXUnit === finalXAxisUnit) {
          finalYAxisUnit = `万${finalYAxisUnit}`;
          currentAverageValue /= 10000;
        }

        // 对于换算之后，是亿元/万户这样的做处理
        if (finalXAxisUnit !== averageXUnit && finalYAxisUnit !== averageYUnit
          && finalYAxisUnit.indexOf(YI) !== -1 && finalXAxisUnit.indexOf(WAN) !== -1) {
          finalYAxisUnit = finalYAxisUnit.replace(YI, WAN);
          finalXAxisUnit = finalXAxisUnit.replace(WAN, '');
        }
      }

      compareSlope = slope;
      currentSlope = currentSelectY / currentSelectX;
      tooltipInfo = `${tooltipInfo}。平均${description} ${yAxisName} ${currentAverageValue.toFixed(2)}${finalYAxisUnit}/${finalXAxisUnit}，${this.compareSlope(Number(currentSlope), Number(compareSlope))}于平均水平。`;
    }

    // 经总和分公司下，显示每个点的平均值
    // 正常显示每个点的x信息和y信息，和平均信息
    this.setState({
      tooltipInfo,
    });
  }

  /**
   * 比较斜率
   * @param {*} currentSlope 当前斜率
   * @param {*} compareSlope 比较的斜率
   */
  compareSlope(currentSlope, compareSlope) {
    let rank = '';
    if (currentSlope > compareSlope) {
      rank = '优';
    } else if (currentSlope === compareSlope) {
      rank = '等';
    } else {
      rank = '低';
    }

    return rank;
  }

  /**
  * 处理鼠标悬浮事件
  * @param {*} params 当前点的数据
  */
  @autobind
  @checkTooltipStatus
  @logable({ type: 'Click', payload: { name: '鼠标悬浮$state.finalData.yAxisName($state.finalData.yAxisUnit)' } })
  handleScatterHover(params) {
    const { isShowTooltip,
      finalData: {
        xAxisName,
        xAxisUnit,
        yAxisName,
        yAxisUnit,
        slope,
        yAxisMin,
        xAxisMin,
        average,
      } } = this.state;

    const { data: [
        xAxisData,
        yAxisData,
        { level2Name, level3Name, level4Name, level5Name },
      ] } = params;
    if (isShowTooltip) {
      // 设置state，切换tooltip的显示信息
      this.setState({
        level2Name,
        level3Name,
        level4Name,
        level5Name,
      });
      this.constructTooltipInfo({
        currentSelectX: xAxisData,
        currentSelectY: yAxisData,
        xAxisName,
        xAxisUnit,
        yAxisName,
        yAxisUnit,
        slope,
        xAxisMin,
        yAxisMin,
        average,
      });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$props.contrastType',
      value: '$args[0]',
    },
  })
  handleChange(value) {
    this.setState({
      selectValue: value,
    });
    const { queryContrastAnalyze, type } = this.props;
    const { scopeSelectValue } = this.state;
    queryContrastAnalyze({
      type,
      contrastIndicatorId: value, // y轴
      scope: scopeSelectValue,
    });
  }

  // 切换维度
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '切换维度',
      value: '$args[0]',
    },
  })
  handleScopeChange(v) {
    this.setState({
      scopeSelectValue: v,
    });
    const { queryContrastAnalyze, type } = this.props;
    const { selectValue } = this.state;
    queryContrastAnalyze({
      type,
      scope: v,
      contrastIndicatorId: selectValue,
    });
  }

  /**
   * 处理鼠标离开事件
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标离开$state.finalData.yAxisName($state.finalData.yAxisUnit)' } })
  handleScatterLeave() {
    const { isShowTooltip } = this.state;
    if (isShowTooltip) {
      this.setState({
        isShowTooltip: !isShowTooltip,
      });
    }
  }

  /**
   * 对特殊的指标作处理，在投顾绩效和经营业绩历史对比下，特殊的指标不展示散点图，展示无意义图
   */
  @autobind
  toggleChart() {
    const { boardType, currentSelectIndicatorKey, contrastType } = this.props;
    return (boardType === 'TYPE_LSDB_TGJX' &&
      (_.findIndex(EXCEPT_CUST_TOUGU_TGJX_MAP,
        item => item.key === currentSelectIndicatorKey) > -1
        || (contrastType === '客户类型' &&
          (_.findIndex(EXCEPT_CUST_TGJX_MAP,
            item => item.key === currentSelectIndicatorKey) > -1))
      ))
      || (boardType === 'TYPE_LSDB_JYYJ'
        && ((contrastType === '客户类型' &&
          (_.findIndex(EXCEPT_CUST_JYYJ_MAP,
            item => item.key === currentSelectIndicatorKey) > -1))
          || (contrastType === '投顾类型' &&
            _.findIndex(EXCEPT_TOUGU_JYYJ_MAP,
              item => item.key === currentSelectIndicatorKey) > -1))
      );
  }

  render() {
    const {
      scatterElemHeight,
      isShowTooltip,
      level2Name,
      level3Name,
      level4Name,
      level5Name,
      tooltipInfo,
      finalData,
      selectValue,
      finalOptions,
      averageInfo,
      scatterOptions,
      scopeSelectValue,
    } = this.state;
    const {
      level,
      boardType,
      title,
      style,
      contrastType,
      isLvIndicator,
      orgId,
      summaryType,
    } = this.props;

    // 隐藏选项
    const toggleScope2Option = classnames({
      hideOption: Number(level) !== 1,
    });
    const toggleScope3Option = classnames({
      hideOption: Number(level) === 3 ||
        Number(level) === 4 ||
        (Number(level) === 2 && !report.isNewOrg(orgId)),
    });
    const toggleScope4Option = classnames({
      hideOption: Number(level) === 4,
    });

    let sortByTypeArr = sortByType[boardType];
    if (summaryType === hbgxSummaryType) {
      sortByTypeArr = sortByType.REPORT_RELATION_TYPE;
    }

    const { xAxisName, yAxisName, xAxisUnit, yAxisUnit } = finalData;
    return (
      <div
        className={styles.abilityScatterAnalysis}
        style={{
          height: isLvIndicator ? '527px' : '540px',
        }}
      >
        <div
          className={styles.abilityHeader}
        >
          <div className={styles.title}>{title}</div>
          <div className={styles.customerDimensionSelect}>
            <span className={styles.contrastType}>{contrastType}</span>
            {
              _.isEmpty(finalOptions) ?
              null :
              <Select
                onChange={this.handleChange}
                allowClear={false}
                placeholder="无"
                value={selectValue} // 默认选中项
                dropdownClassName={styles.custDimenSelect}
              >
                {
                  !_.isEmpty(finalOptions) ? finalOptions.map(item =>
                    <Option value={item.value} key={item.key}>{item.label}</Option>) : null
                }
              </Select>
            }
          </div>
          <div className={styles.customerDimensionSelect}>
            <Select
              style={{ width: 90 }}
              value={scopeSelectValue}
              onChange={this.handleScopeChange}
              getPopupContainer={this.getPopupContainer}
            >
              {
                sortByTypeArr.map((item, index) => {
                  const sortByTypeIndex = index;
                  let optionClass = '';
                  // 按投顾所有级别均存在
                  if (index === 0) {
                    // 按分公司
                    optionClass = toggleScope2Option;
                  }
                  if (index === 1) {
                    // 按财富中心
                    optionClass = toggleScope3Option;
                  }
                  if (index === 2) {
                    // 按营业部
                    optionClass = toggleScope4Option;
                  }
                  return (
                    <Option
                      className={optionClass}
                      key={sortByTypeIndex}
                      value={item.scope}
                    >
                      按{item.name}
                    </Option>
                  );
                })
              }
            </Select>
          </div>
        </div>
        {
          // 无对比意义的判断
          this.toggleChart() ?
            <div className={styles.noChart}>
              <img src={imgSrc} alt="无对比意义" />
              <div className={styles.noChartTip}>无对比意义</div>
            </div>
          :
            <div>
              {
                // 投顾历史看板下的投顾与投顾对比无对应数据(4是投顾或服务经理)
              (scopeSelectValue === '5' && (selectValue === 'tgInNum' || selectValue === 'ptyMngNum')) ||
              _.isEmpty(finalData) ?
                <div className={styles.noChart}>
                  <img src={imgSrc} alt="无对应数据" />
                  <div className={styles.noChartTip}>无对应数据</div>
                </div>
              :
                (
                  <div>
                    <div className={styles.yAxisName} style={style}>{yAxisName}（{yAxisUnit}）</div>
                    <div
                      className={styles.abilityScatter}
                      ref={ref => (this.abilityScatterElem = ref)}
                    >
                      <CommonScatter
                        onScatterHover={this.handleScatterHover}
                        onScatterLeave={this.handleScatterLeave}
                        scatterOptions={scatterOptions}
                        scatterElemHeight={scatterElemHeight}
                      />
                      <div className={styles.xAxisName}>{xAxisName}（{xAxisUnit}）</div>
                    </div>
                    {
                      _.isEmpty(finalData) ?
                        null
                        :
                        <div className={styles.averageDescription}>
                          <div className={styles.averageIcon} />
                          <div className={styles.averageInfo}>{averageInfo}</div>
                        </div>
                    }

                    {isShowTooltip ?
                      <div className={styles.description}>
                        <div className={styles.orgDes}>
                          <i className={styles.desIcon} />
                          <span>
                            {_.isEmpty(level2Name) ? '' : `${level2Name}`}
                            {_.isEmpty(level3Name) ? '' : `-${level3Name}`}
                            {_.isEmpty(level4Name) ? '' : `-${level4Name}`}
                            {_.isEmpty(level5Name) ? '' : `-${level5Name}`}:
                          </span>
                        </div>
                        <div className={styles.detailDesc}>
                          <span>{tooltipInfo}</span>
                        </div>
                      </div>
                      : <div className={styles.noneTooltip} />
                    }
                  </div>
                )
              }
            </div>
        }
      </div>
    );
  }
}
