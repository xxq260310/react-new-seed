/**
 * @file components/customerPool/list/SixMonthEarnings.js
 *  客户列表项中的近6个月的收益图
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { fspContainer } from '../../../config';
import ChartLineWidget from './ChartLine';
import logable from '../../../decorators/logable';
// import { helper } from '../../../utils';

import styles from './sixMonthEarnings.less';

const getLastestData = (arr) => {
  if (arr && arr instanceof Array && arr.length !== 0) {
    return arr[arr.length - 1];
  }
  return {};
};

export default class SixMonthEarnings extends PureComponent {

  static propTypes = {
    listItem: PropTypes.object.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    formatAsset: PropTypes.func.isRequired,
    displayText: PropTypes.string,
  }

  static defaultProps = {
    displayText: '峰值和最近收益',
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCharts: false,
    };
    this.debounced = _.debounce(
      this.getCustIncome,
      500,
      { leading: false },
    );
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标进入$props.displayText' } })
  getCustIncome() {
    const { getCustIncome, listItem, monthlyProfits, custIncomeReqState } = this.props;
    const thisProfits = monthlyProfits[listItem.custId];
    if (!thisProfits || _.isEmpty(thisProfits)) {
      // test data empId = 01041128、05038222、035000002899、02004642
      getCustIncome({ custNumber: listItem.custId });
    }
    this.setState({
      isShowCharts: !custIncomeReqState,
    });
  }

  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标离开$props.displayText' } })
  handleMouseLeave() {
    this.debounced.cancel();
    this.setState({
      isShowCharts: false,
    });
  }

  render() {
    const {
      listItem,
      monthlyProfits,
      custIncomeReqState,
      formatAsset,
      displayText,
    } = this.props;
    const {
      isShowCharts,
    } = this.state;
    const thisProfits = monthlyProfits[listItem.custId] || [];
    const lastestProfit = getLastestData(thisProfits).assetProfit;
    const lastestProfitRate = getLastestData(thisProfits).assetProfitRate;
    // 格式化本月收益的值和单位、本月收益率
    let lastestPrifitsValue = '--';
    let lastestPrifitsUnit = '';
    let lastestPrifitsRate = '--';
    if (thisProfits.length) {
      if (lastestProfit !== null || lastestProfitRate !== null) {
        if (lastestProfit !== 0 || lastestProfitRate !== 0) {
          const obj = formatAsset(Number(lastestProfit));
          lastestPrifitsValue = obj.value;
          lastestPrifitsUnit = obj.unit;
          lastestPrifitsRate = `${Number(lastestProfitRate.toFixed(2))}%`;
        } else {
          lastestPrifitsValue = '0';
          lastestPrifitsRate = '0%';
        }
      }
    }
    // 格式化年最大时点资产的值和单位
    let maxTotAsetYValue = '--';
    let maxTotAsetYUnit = '';
    if (listItem.maxTotAsetY !== null) {
      if (listItem.maxTotAsetY !== 0) {
        const obj = formatAsset(listItem.maxTotAsetY);
        maxTotAsetYValue = obj.value;
        maxTotAsetYUnit = obj.unit;
      } else {
        maxTotAsetYValue = '0';
      }
    }
    const lastestProfitCls = classnames({
      red: lastestProfit >= 0,
      green: lastestProfit < 0,
    });
    const lastestProfitRateCls = classnames({
      red: lastestProfitRate >= 0,
      green: lastestProfitRate < 0,
    });
    const suspendedLayer = (
      <div
        className={`${styles.showCharts}`}
      >
        <div className={styles.chartsContent}>
          <ChartLineWidget chartData={thisProfits} formatAsset={formatAsset} />
        </div>
        <div className={styles.chartsText}>
          <div>
            <p className="tit">本年峰值</p>
            <p className="asset">
              <span className="num">{maxTotAsetYValue}</span>
              <span className="unit">{maxTotAsetYUnit}</span>
            </p>
          </div>
          <div>
            <p className="tit">本月收益</p>
            <p className="asset">
              <span className={`num ${lastestProfitCls}`}>{lastestPrifitsValue}</span>
              <span className={`unit ${lastestProfitCls}`}>{lastestPrifitsUnit}</span>
            </p>
          </div>
          <div>
            <p className="tit">本月收益率</p>
            <p className="asset">
              <span className={`num ${lastestProfitRateCls}`}>{lastestPrifitsRate}</span>
            </p>
          </div>
        </div>
      </div>
    );
    return (
      <div
        className={styles.showChartBtn}
        style={{
          cursor: custIncomeReqState ? 'wait' : 'pointer',
        }}
      >
        <Tooltip
          title={suspendedLayer}
          overlayClassName={styles.sixMonthEarnings}
          mouseEnterDelay={0.5}
          onMouseEnter={this.debounced}
          onMouseLeave={this.handleMouseLeave}
          autoAdjustOverflow
          placement="bottomLeft"
          getPopupContainer={this.getPopupContainer}
          visible={isShowCharts}
        >
          <em className={styles.showDetail}>{displayText}</em>
        </Tooltip>
      </div>
    );
  }
}

