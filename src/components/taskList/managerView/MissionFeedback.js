/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author zhushengnan
 * @description 管理者视图右侧详情任务反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import LabelInfo from '../common/LabelInfo';
import IECharts from '../../IECharts';
// import Icon from '../../common/Icon';
import Pagination from '../../common/Pagination';
import { constructEmptyPie } from './ConstructEmptyPie';

import styles from './missionFeedback.less';

const EMPTY_LIST = [];
// 检查二维数组是否都是空数据
// 形式如：
// [
//  {infoProblem: '', infoData: [{ a: 11, value: 0 }, { a: 11, value: 0 }]},
//  {infoProblem: '', infoData: [{ a: 11, value: 0 }, { a: 11, value: 0 }]}
// ]

// 分页默认参数
const curPageNum = 1;
const curPageSize = 5;
// 后台返回题目类型
const TYPE = {
  radioType: '1',
  checkboxType: '2',
  textAreaType: '3',
};

const isEmptyData = (data, type, value) => {
  if (_.isEmpty(data)) {
    return true;
  }
  // 得到[type]组成的二维数组
  let newData = _.map(data, item => item[type]);
  // 将二维数组抹平
  newData = _.flatten(newData);
  // 选出每一个对象的[value]属性组成的数组
  const itemDataArray = _.filter(newData, i => i[value] !== 0);
  return _.isEmpty(itemDataArray);
};

export default class MissionFeedback extends PureComponent {

  static propTypes = {
    // 父容器宽度变化,默认宽度窄
    isFold: PropTypes.bool,
    // 任务反馈统计数据
    missionFeedbackData: PropTypes.array.isRequired,
    // 任务反馈已反馈总数
    missionFeedbackCount: PropTypes.number.isRequired,
    // 服务经理总数
    serveManagerCount: PropTypes.number.isRequired,
    // 模板Id
    templateId: PropTypes.string,
  }

  static defaultProps = {
    isFold: false,
    templateId: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      expandAll: false,
      cycleSelect: '',
      createCustRange: [],
      finalData: {
        allFeedback: {},
        radioFeedback: [],
        checkboxFeedback: [],
        dataInfo: [],
        pageInfo: {},
      },
    };
    this.chartInstance = {};
  }

  componentWillReceiveProps(nextProps) {
    const {
      missionFeedbackCount,
      missionFeedbackData = EMPTY_LIST,
      serveManagerCount,
    } = this.props;
    const {
      missionFeedbackCount: nextFeedbackCount,
      missionFeedbackData: nextFeedbackData = EMPTY_LIST,
      serveManagerCount: nextManagerCount,
    } = nextProps;

    if (missionFeedbackCount !== nextFeedbackCount
      || missionFeedbackData !== nextFeedbackData
      || serveManagerCount !== nextManagerCount) {
      const { finalData } = this.formatData(
        nextFeedbackData,
        nextFeedbackCount,
        nextManagerCount,
      );

      this.setState({
        finalData,
      });
    }
  }

  /**
   * 构造饼图和进度条需要的数据结构
   * @param {*array} missionFeedbackData 任务反馈数据
   * @param {*number} missionFeedbackCount 任务反馈已反馈数
   * @param {*number} serveManagerCount 服务经理总数
   */
  @autobind
  formatData(missionFeedbackData, missionFeedbackCount, serveManagerCount) {
    let finalData = [];
    let countPercent = 0;
    if (serveManagerCount !== 0) {
      countPercent = ((missionFeedbackCount / serveManagerCount) * 100).toFixed(0);
    }

    let radioFeedback = [];
    let checkboxFeedback = [];
    let answerTotalCount = 0;
    let dataInfo = [];
    let singleInfo = {};
    _.each(missionFeedbackData, (item) => {
      if (_.isArray(item)) {
        let radioData = [];
        let checkboxData = [];
        let infoData = [];

        // 拿到当前题目所有count之和,下面需要计算每一个答案占的比率
        answerTotalCount = _.reduce(_.map(item, childItem =>
          childItem.cnt), (sum, n) => sum + n, 0);

        _.each(item, (childItem) => {
          const { quesTypeCode } = childItem;
          if (quesTypeCode === TYPE.radioType || quesTypeCode === TYPE.checkboxType) {
            const tempData = [{
              name: childItem.optionValue,
              value: childItem.cnt,
              optionPer: answerTotalCount === 0 ? '0%' : `${((childItem.cnt / answerTotalCount) * 100).toFixed(0) || 0}%`,
            }];
            if (quesTypeCode === TYPE.radioType) {
              // 单选题
              radioData = _.concat(radioData, tempData);
            } else {
              // 多选题
              checkboxData = _.concat(checkboxData, tempData);
            }
          } else if (quesTypeCode === TYPE.textAreaType) {
            // 主观题
            infoData = _.concat(infoData, [
              {
                data: childItem.answerText || 0,
                quesId: childItem.quesId,
              },
            ]);
          }
        });

        if (!_.isEmpty(radioData)) {
          radioFeedback = _.concat(radioFeedback, [{
            radioTaskFeedbackDes: item[0].quesValue,
            radioData,
          }]);
        }

        if (!_.isEmpty(checkboxData)) {
          checkboxFeedback = _.concat(checkboxFeedback, [{
            checkboxFeedbackDes: item[0].quesValue,
            checkboxData,
          }]);
        }
        if (!_.isEmpty(infoData)) {
          dataInfo = _.concat(dataInfo, [{
            infoProblem: item[0].quesValue,
            quesId: item[0].quesId,
            infoData,
          }]);
          // 存储主观题分页，当前页
          singleInfo = {
            ...singleInfo,
            [item[0].quesId]: curPageNum,
          };
        }
      }
    });
    finalData = {
      allFeedback: {
        serviceAllNum: serveManagerCount || 0,
        aFeedback: missionFeedbackCount || 0,
        aFeedbackPer: countPercent,
        allTaskFeedbackDes: '所有问题反馈结果',
      },
      radioFeedback,
      checkboxFeedback,
      dataInfo,
      singleInfo,
    };
    return {
      finalData,
    };
  }

  handleOptionCake(value, names) {
    const option = {
      title: {
        text: '',
        subtext: '',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const dataShow = `${params.data.name}<br/>共选择人数：${params.data.value}<br/>所占百分比：${params.data.optionPer}`;
          return dataShow;
        },
        ...this.getCommonTooltipStyle(),
      },
      series: [
        {
          name: names,
          type: 'pie',
          radius: [0, 55],
          center: ['50%', '52%'],
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: value,
        },
      ],
      color: ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8', '#4adad5'],
    };
    return option;
  }

  @autobind
  getCommonTooltipStyle() {
    return {
      position: 'right',
      backgroundColor: '#fff',
      textStyle: {
        color: '#333',
      },
      borderWidth: 1,
      borderColor: '#ddd',
      // 额外附加到浮层的 css 样式
      extraCssText: 'box-shadow: -1px 1px 5px 1px #c2c2c2;',
    };
  }

  @autobind
  handleOptionBar(value, names) {
    const { isFold } = this.props;
    const grids = isFold ? { left: '20%', right: '20%', top: 20, bottom: 10, containLabel: true } :
      { left: '20%', right: '20%', top: 30, bottom: 10, containLabel: true };
    const option = {
      tooltip: {
        formatter: (params) => {
          const dataShow = `${params.data.name}<br/>共选择人数：${params.data.value}<br/>所占百分比：${params.data.optionPer}`;
          return dataShow;
        },
        ...this.getCommonTooltipStyle(),
      },
      grid: grids,
      xAxis: {
        type: 'category',
        data: value,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e2e2e2',
          },
        },
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          name: names,
          type: 'bar',
          barWidth: '14',
          data: value,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 0, 0, 0],
              color: (params) => {
                const colorList = ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8', '#4adad5'];
                return colorList[params.dataIndex];
              },
            },
          },
        },
      ],
    };
    return option;
  }

  handleShowData(onOff, nameDes, data, item, isRadio = false, options = {}, key) {
    let finalOptions = {};
    if (!_.isEmpty(options)) {
      // 空图
      if (!isRadio) {
        // 多选，空图，不展示
        return (<div />);
      }
      finalOptions = options;
    } else if (isRadio) {
      // 单选
      finalOptions = this.handleOptionCake(data, nameDes);
    } else {
      // 多选
      finalOptions = this.handleOptionBar(data, nameDes);
    }

    return (
      <div className={styles.radioFeedAll} key={key}>
        <div
          className={classnames({
            [styles.firBorder]: !onOff,
            [styles.firBorderTwo]: onOff,
          })}
        >
          <h5>{nameDes}</h5>
        </div>
        <div
          className={classnames({
            [styles.sedBoder]: !onOff,
            [styles.sedBoderTwo]: onOff,
          })}
        >
          <div className={styles.charts}>
            <IECharts
              option={finalOptions}
              resizable
              style={{
                height: '140px',
                width: 'auto',
              }}
              // 不要将前面的option与后面的option合并
              notMerge
              ref={ref => this.chartInstance[key] = ref}
            />
          </div>
          <div className={styles.tips}>
            <div className={styles.content}>
              {item}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, quesId) {
    const { finalData } = this.state;
    const { singleInfo } = finalData;
    this.setState({
      finalData: {
        ...finalData,
        singleInfo: {
          ...singleInfo,
          [quesId]: nextPage,
        },
      },
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleSizeChange(currentPageNum, changedPageSize) {
    const { finalData } = this.state;
    const {
      curDataInfo,
    } = this.renderProblemsData(currentPageNum, changedPageSize);
    this.setState({
      finalData: {
        ...finalData,
        pageInfo: {
          curPageNum: currentPageNum,
          curPageSize: changedPageSize,
        },
        dataInfo: curDataInfo,
      },
    });
  }

  @autobind
  renderProblemsData(pageNum, infoData) {
    let curDataInfo = [];
    if (pageNum <= 1) {
      // 第一页
      curDataInfo = _.slice(infoData, 0, curPageSize);
    } else {
      // 大于一页
      curDataInfo = _.slice(infoData,
        (pageNum - 1) * curPageSize, curPageSize * pageNum);
    }
    return {
      curDataInfo,
      pageNum,
    };
  }

  @autobind
  renderCheckBox(data) {
    const { isFold } = this.props;

    // 是否显示空的多选图
    const isShowEmptyCheckboxPie = isEmptyData(data, 'checkboxData', 'value');

    const options = isShowEmptyCheckboxPie ? constructEmptyPie() : {};

    const oDiv = _.map(data, (item, index) => {
      const checkBox = _.map(item.checkboxData, itemChild =>
        (<div key={itemChild.name} className={styles.radioItem}>
          <span className={styles.icon} />
          <span className={styles.name} title={itemChild.name}>{itemChild.name}</span>
          <span className={styles.value} title={itemChild.value}>
            ：{itemChild.value}({itemChild.optionPer})
          </span>
        </div>));
      return this.handleShowData(isFold, item.checkboxFeedbackDes,
        item.checkboxData, checkBox, false, options, `checkbox-${index}`);
    });
    return oDiv;
  }

  @autobind
  renderRadios(data) {
    const { isFold } = this.props;
    const isRadio = true;

    // 是否显示空的单选图
    const isShowEmptyRadioPie = isEmptyData(data, 'radioData', 'value');

    const options = isShowEmptyRadioPie ? constructEmptyPie() : {};

    const oDiv = _.map(data, (item, index) => {
      const radios = _.map(item.radioData, itemChild => (
        <div key={itemChild.name} className={styles.radioItem}>
          <span className={styles.icon} />
          <span className={styles.name} title={itemChild.name}>{itemChild.name}</span>
          <span className={styles.value} title={itemChild.value}>
            ：{itemChild.value}({itemChild.optionPer})
          </span>
        </div>
      ));
      return this.handleShowData(isFold, item.radioTaskFeedbackDes,
        item.radioData, radios, isRadio, options, `radio-${index}`);
    });
    return oDiv;
  }

  renderAllFeedback(allCount, count, countPer, residue) {
    const type = '服务经理总数';
    const per = '已反馈人数';
    return (
      <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info">
        <div>
          <div className="ant-progress-outer">
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(per, count, countPer)}
              arrowPointAtCenter
              overlayClassName={styles.missionFeedbackTooltipOverlay}
            >
              <div
                className="ant-progress-bg"
                style={{ width: `${countPer}%` }}
              />
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(type, allCount)}
              arrowPointAtCenter
              overlayClassName={styles.missionFeedbackTooltipOverlay}
            >
              <div
                className="ant-progress-inner"
                style={{ width: `${residue}%` }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  renderTooltipContent(type, currentCount, per = null) {
    return (
      <div className={styles.content}>

        {_.isEmpty(per) ?
          <div className={styles.currentType}>{type}&nbsp;:&nbsp;{currentCount || 0}位</div> :
          <div className={styles.currentType}>{type}&nbsp;:&nbsp;{currentCount || 0}({per}%)</div>
        }
      </div>
    );
  }

  renderOneInfo({ data, pageNum = 1 }) {
    return _.map(data, (itemChild, index) => {
      if (_.isEmpty(itemChild.data)) {
        return null;
      }
      // 手动设置问题的index展示
      if (pageNum > 1) {
        return (
          <div title={itemChild.data} key={itemChild.data}>
            {index + ((pageNum - 1) * curPageSize) + 1 }.{itemChild.data || ''}
          </div>
        );
      }
      return (
        <div title={itemChild.data} key={itemChild.data}>
          {index + 1}.{itemChild.data || ''}
        </div>
      );
    });
  }

  @autobind
  renderProblemsInfo(dataInfo) {
    const { isFold } = this.props;
    const { finalData: { singleInfo } } = this.state;
    const paginationOption = {
      pageSize: curPageSize,
      onShowSizeChange: this.handleSizeChange,
    };
    // 是否显示主观题统计栏目

    if (_.isEmpty(dataInfo)) {
      return null;
    }
    const value = _.map(dataInfo, (item) => {
      let info = null;
      if (_.isEmpty(item.infoData)) {
        return null;
      }
      // 当主观题答案条数大于5时，进行分页处理
      if (_.size(item.infoData) > curPageSize) {
        const firstPageData = this.renderProblemsData(singleInfo[item.quesId], item.infoData);
        info = this.renderOneInfo({ data: firstPageData.curDataInfo,
          pageNum: firstPageData.pageNum });
      } else {
        info = this.renderOneInfo({ data: item.infoData });
      }

      return (
        <div className={styles.subjective} key={item.quesId}>
          <div
            className={classnames({
              [styles.problemsInfo]: !isFold,
              [styles.problemsInfoTwo]: isFold,
            })}
          >
            <h5>{item.infoProblem}</h5>
          </div>
          <div
            className={classnames({
              [styles.thrBoder]: !isFold,
              [styles.thrBoderTwo]: isFold,
            })}
          >
            <div className={styles.problems}>
              <div>
                <div className={styles.problemList}>
                  {info}
                </div>
                {/* 判断当前主观题是否超过5条，超过显示分页组件 */}
                {
                  _.size(item.infoData) > curPageSize ?
                    <Pagination
                      {...paginationOption}
                      total={_.size(item.infoData)}
                      onChange={current =>
                        this.handlePageChange(current, item.quesId)}
                      current={singleInfo[item.quesId]}
                      className={styles.rowTop}
                    /> : null
                }
              </div>
            </div>
          </div>
        </div>
      );
    });
    return value;
  }

  render() {
    const { isFold, templateId } = this.props;
    const { finalData } = this.state;
    const { allFeedback, radioFeedback, checkboxFeedback, dataInfo } = finalData;
    const residue = (1 - (Number(allFeedback.aFeedbackPer) / 100)) * 100;

    if ((_.isEmpty(dataInfo) &&
      _.isEmpty(allFeedback) &&
      _.isEmpty(radioFeedback) &&
      _.isEmpty(checkboxFeedback)) ||
      _.isEmpty(templateId)) {
      return null;
    }

    return (
      <div className={styles.basicInfo}>
        <div className={styles.feedbackTitle}>
          <div>
            <LabelInfo value="任务反馈" />
          </div>
          {/* <div>
            <div className={styles.down}>
              <div className={styles.iconDown}>
                <Icon type="xiazai" />
              </div>
              <div className={styles.downLoad}>
                导出
            </div>
            </div>
          </div> */}
        </div>
        <div className={styles.feedback}>
          <Row className={styles.feedbackContent}>
            <Col span={24}>
              <div className={styles.FeedAll}>
                <div
                  className={classnames({
                    [styles.firAllBorder]: !isFold,
                    [styles.firAllBorderTwo]: isFold,
                  })}
                >
                  {allFeedback.allTaskFeedbackDes}
                </div>
                <div
                  className={classnames({
                    [styles.allSedBoder]: !isFold,
                    [styles.allSedBoderTwo]: isFold,
                  })}
                >
                  <div className={styles.layBox}>
                    <div className={styles.charts}>
                      {this.renderAllFeedback(allFeedback.serviceAllNum,
                        allFeedback.aFeedback, allFeedback.aFeedbackPer, residue)}
                    </div>
                    <div className={styles.allService}>
                      <div className={styles.content}>
                        <span>服务经理总数：<b>{allFeedback.serviceAllNum}</b></span>
                        <span>已反馈：<b>{allFeedback.aFeedback}</b>
                          <b>{allFeedback.aFeedbackPer ? `(${allFeedback.aFeedbackPer}%)` : ''}</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.renderRadios(radioFeedback)}
              {this.renderCheckBox(checkboxFeedback)}
              {this.renderProblemsInfo(dataInfo)}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
