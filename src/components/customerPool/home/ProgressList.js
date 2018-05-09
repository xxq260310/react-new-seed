/**
 * @file components/customerPool/common/ProgressList.js
 *  彩色的，长条形进度条列表,row如下图：-----代表进度条
 * xxxxx         50
 * ----------------
 * @author zhangjunli
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Progress, Popover } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { linkTo } from './homeIndicators_';
import logable from '../../../decorators/logable';
import styles from './progressList.less';

/* 新增客户传给列表页的参数
 * 净开增有效户： 817001
 * 净新增非零售客户： 817002
 * 净新增高端产品户： 817003
 * 新增产品客户： 817004
*/
const newCustomerLinkIdx = ['817001', '817002', '817003', '817004'];

export default class ProgressList extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    cycle: PropTypes.array,
    push: PropTypes.func,
    location: PropTypes.object,
    empInfo: PropTypes.object,
    type: PropTypes.string,
    authority: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    cycle: [],
    location: {},
    push: () => { },
    empInfo: {},
    type: '',
  }

  componentDidMount() {
    this.setProgressColor();
  }

  componentDidUpdate() {
    this.setProgressColor();
  }

  // 为每个progress设置颜色
  @autobind
  setProgressColor() {
    const { dataSource, location } = this.props;
    if (_.isEmpty(dataSource)) {
      return;
    }
    dataSource.forEach(
      (item, index) => {
        // 拿到容纳了progress的div
        const rowElem = this[`row${index}`];
        if (rowElem && !_.isEmpty(location)) {
          // 支持下钻，鼠标为小手形状
          rowElem.style.cursor = 'pointer';
        }
        // progress 组件
        const antProgressElem = rowElem.childNodes[1];
        // antProgressElem内部子节点div, div的内部节点是 outer
        const antProgressOuter = antProgressElem.childNodes[0].childNodes[0];
        // outer 内部子节点 inner
        const antProgressInner = antProgressOuter.childNodes[0];
        // inner 内部子节点 bg
        const antProgressBg = antProgressInner.childNodes[0];
        if (antProgressBg) {
          antProgressBg.style.backgroundColor = item.color;
        }
      },
    );
  }

  /*
  */
  @autobind
  @logable({ type: 'Click', payload: { name: '新增客户区域下钻' } })
  handleClick(index, item) {
    const { cycle, push, location, authority } = this.props;
    const bname = this.transformName(item.cust);
    const param = {
      source: 'custIndicator',
      type: 'customerType',
      value: newCustomerLinkIdx[index],  // 提供给列表页传给后端的customerType的值
      bname,
      cycle,
      push,
      location,
      authority,
    };
    linkTo(param);
  }

  // 根据现有的name返回列表页所需要展示的 name文案
  @autobind
  transformName(name) {
    switch (name) {
      case '新开有效户':
        return '新开有效下钻客户';
      case '新增非零售客户':
        return '新增非零售下钻客户';
      case '新增高端产品户':
        return '新增高端产品下钻客户';
      default:
        return name;
    }
  }

  @autobind
  renderList() {
    // const { cycle, push, location, empInfo } = this.props;
    const { dataSource, location, type } = this.props;
    // 新增客户模块指标说明文案
    const description = {
      新开有效户: '统计周期内新开客户数量',
      新增高净值客户: '本考核期新增的高净值客户数-上一考核期末的高净值客户在本考核期内降级为零售客户且资产降幅超过同期市场指数跌幅的客户数量',
      新增高端产品户: '年初到当前新增高端客户数',
      新增产品客户: '年初到当前新增产品客户数',
    };
    // 动态设置progress间距
    const length = dataSource.length;
    const style = { marginTop: `${(172 - (length * 25)) / (length + 1)}px` };
    return dataSource.map(
      (item, index) => {
        const rowId = `row${index}`;
        return (
          <div
            onClick={() => { this.handleClick(index, item); }}
            className={styles.row} style={style}
            key={item.id}
            ref={ref => (this[rowId] = ref)}
          >
            <div className={styles.intro}>
              {/*
                接口传了description字段，则用接口的指标说明
                接口未传description字段，则用页面中定义的指标说明
              */}
              <Popover
                content={item.description || description[item.cust]}
                placement="bottom"
                overlayStyle={{ maxWidth: '320px' }}
                mouseEnterDelay={0.2}
              >
                <div className={styles.title}>{item.cust}</div>
              </Popover>
              <div
                className={classnames(
                  styles.count,
                  { [styles.supportClick]: !_.isEmpty(location) },
                )}
              >
                {
                  /**
                   * 当为产品销售的时候，特殊处理一下展示单位和数值
                  */
                }
                {
                  type === 'productSale' ?
                    <div>
                      <span title={item.value}>{item.value}</span>
                      <span title={item.unit}>{item.unit}</span>
                    </div> :
                    <span title={item.thousandsCount}>{item.thousandsCount}</span>
                }</div>
            </div>
            <Progress
              percent={(item.percent < 0 ? 0 : item.percent)}
              strokeWidth={6}
              showInfo={false}
            />
          </div>
        );
      },
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderList()}
      </div>
    );
  }
}
