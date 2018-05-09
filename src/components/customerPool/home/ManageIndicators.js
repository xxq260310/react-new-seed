/**
 * @file customerPool/ManageIndicators.js
 *  目标客户池-经营指标
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import 'echarts-liquidfill';
import _ from 'lodash';

import RectFrame from './RectFrame';
import IECharts from '../../IECharts';
import IfEmpty from '../common/IfEmpty';
import CheckLayout from './CheckLayout';
import ProgressList from './ProgressList';
import CustomerService from './CustomerService';
import styles from './performanceIndicators.less';
import {
  getHSRate,
  getPureAddCust,
  getProductSale,
  getClientsNumber,
  getTradingVolume,
  filterEmptyToInteger,
  filterEmptyToNumber,
  linkTo,
} from './homeIndicators_';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    hsRateAndBusinessIndicator: PropTypes.array,
    empInfo: PropTypes.object.isRequired,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]), // 问了后端的逻辑，当有报错时，返回的是空对象，当正常时，返回的是数组
    authority: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    indicators: EMPTY_OBJECT,
    cycle: EMPTY_LIST,
    hsRateAndBusinessIndicator: EMPTY_LIST,
    custCount: EMPTY_LIST,
  }

  @autobind
  handleBusinessOpenClick(instance) {
    instance.on('click', (arg) => {
      const { clientNameData } = this.analyticHSRateAndBusinessIndicator();
      // 当无数据是，展示 暂无数据，下面的下钻不需要了
      if (_.isEmpty(clientNameData)) {
        return;
      }
      // 当数据展示出来，需要下钻
      const {
        push,
        cycle,
        location,
        authority,
      } = this.props;

      const param = {
        source: 'numOfCustOpened',
        cycle,
        push,
        location,
        bname: arg.name || arg.value,
        authority,
      };
      // 点击柱子，arg.name，arg.value都有值
      // 点击x轴， arg.value有值，不存在arg.name
      // 数组的顺序不能变
      const arr = [arg.name, arg.value];
      if (_.includes(arr, clientNameData[0])) {
        param.value = 'ttfCust';
      } else if (_.includes(arr, clientNameData[1])) {
        param.value = 'shHkCust';
      } else if (_.includes(arr, clientNameData[2])) {
        param.value = 'szHkCust';
      } else if (_.includes(arr, clientNameData[3])) {
        param.value = 'rzrqCust';
      } else if (_.includes(arr, clientNameData[4])) {
        param.value = 'xsb';
      } else if (_.includes(arr, clientNameData[5])) {
        param.value = 'optCust';
      } else if (_.includes(arr, clientNameData[6])) {
        param.value = 'cyb';
      }
      linkTo(param);
    });
  }

  @autobind
  analyticHSRateAndBusinessIndicator() {
    // 返回数据是数组，元素的位置是固定的，根据位置取元素，最后一个是沪深归集率，其余的是业务开通的指标
    const { hsRateAndBusinessIndicator = [] } = this.props;
    // 沪深归集率
    let hsRate = 0;
    // 业务开通数据
    const clientNumberData = [];
    // 业务开通name
    const clientNameData = [];
    // 是否为空
    const isEmpty = _.isEmpty(hsRateAndBusinessIndicator);
    const length = isEmpty ? 0 : hsRateAndBusinessIndicator.length;
    _.forEach(
      hsRateAndBusinessIndicator,
      (item, index) => {
        if (index === (length - 1)) {
          hsRate = filterEmptyToNumber(item.value).toFixed(2);
        } else {
          clientNumberData.push(filterEmptyToInteger(item.value));
          clientNameData.push(item.name);
        }
      },
    );
    return { isEmpty, hsRate, clientNumberData, clientNameData };
  }

  render() {
    const {
      indicators,
      cycle,
      push,
      location,
      empInfo,
      custCount,
      authority,
    } = this.props;
    // 解析hsRateAndBusinessIndicator数据
    const {
      isEmpty: isIndicatorEmpty, // 控制对应的指标区域，是否显示 暂无数据
      hsRate,
      clientNumberData,
      clientNameData,
    } = this.analyticHSRateAndBusinessIndicator();
    // 字段语义，在mock文件内：/mockup/groovynoauth/fsp/emp/kpi/queryEmpKPIs.js
    const {
      motOkMnt, motTotMnt, taskCust, totCust,
      otcTranAmt, fundTranAmt, finaTranAmt, privateTranAmt,
      purAddCustaset, purRakeGjpdt, tranAmtBasicpdt, tranAmtTotpdt,
    } = _.isEmpty(indicators) ? {} : indicators;
    // 控制是否显示 暂无数据
    const isEmpty = _.isEmpty(indicators);

    // 新增客户（经营指标）
    const isCustCountEmpty = _.isEmpty(custCount);
    const { newUnit: pureAddUnit, items: pureAddItems } = getPureAddCust({
      pureAddData: _.isEmpty(custCount) ? [0, 0, 0, 0] : custCount,
    });
    const pureAddHead = { icon: 'kehu', title: `新增客户（${pureAddUnit}）` };

    // 业务开通数（经营指标）
    const param = { clientNumberData, names: clientNameData };
    const { newUnit: clientUnit, items: clientItems } = getClientsNumber(param);
    const clientHead = { icon: 'kehuzhibiao', title: `业务开通数（${clientUnit}次）` };

    // 沪深归集率
    const hsRateData = getHSRate([filterEmptyToNumber(hsRate)]);
    const hsRateHead = { icon: 'jiaoyiliang', title: '沪深归集率' };

    // 资产和交易量（经营指标）
    const tradeingVolumeData = [
      filterEmptyToNumber(purAddCustaset),
      filterEmptyToNumber(tranAmtBasicpdt),
      filterEmptyToNumber(tranAmtTotpdt),
      filterEmptyToNumber(purRakeGjpdt),
    ];
    const finalTradeingVolumeData = getTradingVolume({ tradeingVolumeData });
    const tradeVolumeHead = { icon: 'chanpinxiaoshou', title: '资产和交易量' };

    // 产品销售（经营指标）
    const productSaleData = [
      filterEmptyToNumber(fundTranAmt),
      filterEmptyToNumber(privateTranAmt),
      filterEmptyToNumber(finaTranAmt),
      filterEmptyToNumber(otcTranAmt),
    ];
    const finalProductSaleData = getProductSale({ productSaleData });
    const productSaleHead = { icon: 'shouru', title: '产品销售' };

    // 服务指标（经营业绩）
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    const serviceIndicatorHead = { icon: 'kehufuwu', title: '服务指标' };

    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={28}>
              <Col span={8}>
                <RectFrame dataSource={pureAddHead}>
                  <IfEmpty isEmpty={isCustCountEmpty}>
                    <ProgressList
                      key={'pureAdd'}
                      dataSource={pureAddItems}
                      cycle={cycle}
                      push={push}
                      location={location}
                      empInfo={empInfo}
                      authority={authority}
                    />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={clientHead}>
                  <IfEmpty isEmpty={isIndicatorEmpty}>
                    <IECharts
                      onReady={this.handleBusinessOpenClick}
                      option={clientItems}
                      resizable
                      style={{
                        height: '170px',
                      }}
                    />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={hsRateHead}>
                  <IfEmpty isEmpty={isIndicatorEmpty}>
                    <IECharts
                      option={hsRateData}
                      resizable
                      style={{
                        height: '180px',
                      }}
                    />
                  </IfEmpty>
                </RectFrame>
              </Col>
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={28}>
              <Col span={8}>
                <RectFrame dataSource={tradeVolumeHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <CheckLayout dataSource={finalTradeingVolumeData} />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={productSaleHead}>
                  <IfEmpty isEmpty={isEmpty} className={styles.empty}>
                    <ProgressList type={'productSale'} dataSource={finalProductSaleData} key={'productSale'} />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={serviceIndicatorHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <CustomerService data={customerServiceData} />
                  </IfEmpty>
                </RectFrame>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
