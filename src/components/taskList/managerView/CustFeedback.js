/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-06 16:26:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-27 18:08:53
 * 客户反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { constructPieOptions } from './ConstructPieOptions';
import { constructEmptyPie } from './ConstructEmptyPie';
import IECharts from '../../IECharts';
import { data as dataHelper } from '../../../helper';
import { custFeedbackColorCollection } from '../../../config/CustFeedbackPieColor';
import styles from './custFeedback.less';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// 获取一级、二级反馈颜色表
const getLevelColor = (index = 0, childIndex = 0) => {
  const indexColorArray = custFeedbackColorCollection[index].value;
  return indexColorArray[childIndex];
};

export default class CustFeedback extends PureComponent {

  static propTypes = {
    // 客户反馈
    custFeedback: PropTypes.array,
    onPieHover: PropTypes.func,
    onPieLeave: PropTypes.func,
    onPreviewCustDetail: PropTypes.func,
  }

  static defaultProps = {
    custFeedback: EMPTY_LIST,
    onPieHover: (params) => {
      console.log(params);
    },
    onPieLeave: () => { },
    onPreviewCustDetail: () => { },
  }

  constructor(props) {
    super(props);
    const {
      level1Data = EMPTY_LIST,
      level2Data = EMPTY_LIST,
    } = this.renderCustFeedbackChart(props.custFeedback);
    this.state = {
      level1Data,
      level2Data,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { custFeedback: nextFeedback } = nextProps;
    const { custFeedback } = this.props;
    if (custFeedback !== nextFeedback) {
      // 需要重新绘制饼图时，清除echarts的当前实例
      if (this.chartInstance) {
        this.chartInstance.getChartsInstance().clear();
      }
      const { level1Data, level2Data } = this.renderCustFeedbackChart(nextFeedback);
      this.setState({
        level1Data,
        level2Data,
      });
    }
  }

  /**
   * 根据当前索引得出二级反馈颜色，二级反馈第一个为一级反馈的颜色，然后往后一直到第五个往后，颜色都相同
   * @param {*string} index 索引
   * @param {*string} childIndex child索引
   */
  @autobind
  getCurrentColor(index, childIndex) {
    let newChildIndex = childIndex;
    if (newChildIndex > 4) {
      newChildIndex = 4;
    }
    return getLevelColor(index, newChildIndex);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  handlePieClick(params) {
    const { data: { children, parent, key } } = params;
    const { level1Data } = this.state;
    const currentFeedback = _.map(level1Data, item => ({
      feedbackIdL1: item.key,
      feedbackName: item.name,
      childList: _.map(item.children, child => ({
        feedbackIdL2: child.key,
        feedbackName: child.name,
      })),
    }));
    let feedbackIdL1 = '';
    if (!_.isEmpty(parent)) {
      // 代表点击的是外圈，也就是二级反馈
      // 取出parent的key
      feedbackIdL1 = parent.key;
    } else if (!_.isEmpty(children)) {
      // 代表点击的是内圈，也就是一级反馈
      // 取出当前的key
      feedbackIdL1 = key;
    }

    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail({
      // 当前选中的一级反馈类型
      feedbackIdL1,
      canLaunchTask: true,
      // 代表是从饼图点击的
      isEntryFromPie: true,
      currentFeedback,
    });
  }

  @autobind
  renderParent(name, value) {
    let parentElem = '';
    parentElem = `<div class="title">
        ${name}：${dataHelper.toPercent(Number(value))}
      </div>`;
    return parentElem;
  }

  /**
   * 构造tooltip string
   * @param {*object} params charts series数据源
   */
  @autobind
  renderTooltip(params) {
    // componentType: 'series',
    // // 系列类型
    // seriesType: string,
    // // 系列在传入的 option.series 中的 index
    // seriesIndex: number,
    // // 系列名称
    // seriesName: string,
    // // 数据名，类目名
    // name: string,
    // // 数据在传入的 data 数组中的 index
    // dataIndex: number,
    // // 传入的原始数据项
    // data: Object,
    // // 传入的数据值
    // value: number|Array,
    // // 数据图形的颜色
    // color: string,
    // // 饼图的百分比
    // percent: number,

    const {
      name,
      data,
      value,
      seriesIndex,
    } = params;

    const { children, parent } = data;
    const { level1Data } = this.state;
    let childrenElem = '';
    let parentElem = '';

    // 一级反馈，内部
    if (seriesIndex === 0) {
      // 一级反馈有children
      parentElem = this.renderParent(name, Number(value));
      childrenElem = this.renderChildren(children);
    } else if (seriesIndex === 1) {
      // 二级反馈，外部
      // 二级反馈有parent
      // 找出parent对应的children
      parentElem = this.renderParent(parent.name, Number(parent.value));
      const parentTree = _.find(level1Data, item => item.name === parent.name);
      if (!_.isEmpty(parentTree)) {
        if (!_.isEmpty(parentTree.children)) {
          childrenElem = this.renderChildren(parentTree.children);
        }
      }
    }

    return `<div class="tooltipContent">
      ${parentElem}
      <div class="content">
        ${childrenElem}
      </div>
    </div>`;
  }

  @autobind
  renderChildren(children) {
    let childrenElem = '';
    _.each(children, item =>
      childrenElem += `<div class="item">
          <i class="icon" style='background: ${item.color}'></i>
          <span class="type">${item.name}：</span>
          <span class="percent">${dataHelper.toPercent(Number(item.realValue))}</span>
        </div>`,
    );
    return childrenElem;
  }

  @autobind
  renderCustFeedbackChart(custFeedback) {
    // 前后台定义返回的格式可以直接给一级饼图作数据源
    if (_.isEmpty(custFeedback)) {
      return {
        level1Data: [],
        level2Data: [],
      };
    }

    let level1Data = custFeedback || [];
    // 然后添加颜色
    level1Data = _.map(level1Data, (item, index) => {
      const currentLevel1ItemColor = getLevelColor(index, 0);
      return {
        ...item,
        color: currentLevel1ItemColor,
        itemStyle: {
          normal: {
            color: currentLevel1ItemColor,
          },
        },
        children: _.map(item.children, (itemData, childIndex) => {
          const currentColor = this.getCurrentColor(index, childIndex);
          return {
            ...itemData,
            color: currentColor,
            // 将子级数据的占比乘以父级占比
            value: item.value * itemData.value,
            // 真实的占比
            realValue: itemData.value,
          };
        }),
      };
    });

    // 构造二级数据源
    let level2Data = [];

    _.each(level1Data, (item, index) => {
      if (!_.isEmpty(item.children)) {
        level2Data.push(_.map(item.children, (itemData, childIndex) => {
          const currentLevel2ItemColor = this.getCurrentColor(index, childIndex);
          return {
            // 真实的占比
            realValue: itemData.realValue,
            value: itemData.value,
            name: itemData.name,
            color: currentLevel2ItemColor,
            itemStyle: {
              normal: {
                color: currentLevel2ItemColor,
              },
            },
            parent: {
              name: item.name,
              value: item.value,
              color: getLevelColor(index, 0),
              key: item.key,
            },
          };
        }));
      }
    });

    // 将二维数组抹平
    level2Data = _.flatten(level2Data);

    return {
      level1Data,
      level2Data,
    };
  }

  render() {
    const { level1Data, level2Data } = this.state;

    const options = _.isEmpty(level1Data) && _.isEmpty(level2Data) ? constructEmptyPie() :
      constructPieOptions({
        renderTooltip: this.renderTooltip,
        level1Data,
        level2Data,
      });

    return (
      <div className={styles.custFeedbackSection}>
        <div className={styles.title}>
          已服务客户反馈
        </div>
        <div className={styles.content}>
          <IECharts
            option={options}
            resizable
            style={{
              height: '162px',
              width: '50%',
            }}
            ref={ref => this.chartInstance = ref}
            onEvents={{
              click: this.handlePieClick,
            }}
          />
          <div className={styles.chartExp}>
            {_.isEmpty(level1Data) && _.isEmpty(level2Data) ?
              <div className={styles.emptyContent}>暂无客户反馈</div> :
              _.map(level1Data, (item) => {
                // 过滤掉没有比例的数据
                if (item.value === 0) {
                  return null;
                }

                return (
                  <div
                    className={styles.content}
                    key={item.key}
                  >
                    <i className={styles.parentIcon} style={{ background: item.color }} />
                    <span>{item.name}</span>：<span>{dataHelper.toPercent(Number(item.value))}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
