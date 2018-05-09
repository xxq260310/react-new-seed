/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-投顾绩效
 * @author zhangjunli
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col, Popover } from 'antd';
import _ from 'lodash';
import 'echarts-liquidfill';

import CheckLayout from './CheckLayout';
import CustomerService from './CustomerService';
import Funney from './Funney';
import IfEmpty from '../common/IfEmpty';
import RectFrame from './RectFrame';
import IECharts from '../../IECharts';
import ProgressList from './ProgressList';
import styles from './performanceIndicators.less';
import logable from '../../../decorators/logable';
import {
  getHSRate,
  getProductSale,
  getClientsNumber,
  getCustAndProperty,
  filterEmptyToNumber,
  filterEmptyToInteger,
  getServiceIndicatorOfPerformance,
  linkTo,
  getPureAddCust,
  getTradingVolume,
} from './homeIndicators_';

// [{name: 1}, {name: 2}] 转成 [1,2]
const getLabelList = arr => arr.map(v => (v || {}).name);

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    indicators: PropTypes.object,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]), // 问了后端的逻辑，当有报错时，返回的是空对象，当正常时，返回的是数组
    authority: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    category: 'manager',
    indicators: {},
    cycle: [],
    custCount: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isToolTipVisible: false, // 是否显示柱状图lable上的Popover
      posX: 0, // 鼠标距离浏览器可视区域左上角的水平距离clientX
      posY: 0, // toolTip距离浏览器可视区域左上角的垂直距离clientY
      desc: '', // 指标说明
    };
  }

  getNameAndValue(data, formatterNumber) {
    const numberArray = [];
    const nameArray = [];
    const descArray = [];
    _.forEach(
      data,
      (item) => {
        numberArray.push(formatterNumber(item.value));
        nameArray.push(item.name);
        descArray.push(item.description);
      },
    );
    return { nameArray, numberArray, descArray };
  }

  // 过滤掉假值(false, null, 0, '', undefined, NaN)的数组
  filterFalsityArray(array) {
    return _.isEmpty(_.compact(array)) ? [] : _.compact(array);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '业务开通区域下钻' } })
  handleClick(labelList, arg) {
    const {
      push,
      cycle,
      authority,
      location,
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
    if (_.includes(arr, labelList[0])) {
      param.value = 'ttfCust';
    } else if (_.includes(arr, labelList[1])) {
      param.value = 'shHkCust';
    } else if (_.includes(arr, labelList[2])) {
      param.value = 'szHkCust';
    } else if (_.includes(arr, labelList[3])) {
      param.value = 'rzrqCust';
    } else if (_.includes(arr, labelList[4])) {
      param.value = 'xsb';
    } else if (_.includes(arr, labelList[5])) {
      param.value = 'optCust';
    } else if (_.includes(arr, labelList[6])) {
      param.value = 'cyb';
    }
    linkTo(param);
  }

  @autobind
  handleBusinessOpenClick(instance) {
    const {
      indicators,
    } = this.props;
    let formatIndicator = [];
    const tempArr = this.formatIndicators(indicators || {});
    if (!_.isEmpty(tempArr)) {
      formatIndicator = (tempArr[1] || {}).data;
    }
    const labelList = getLabelList(formatIndicator);
    instance.on('click', (arg) => {
      this.handleClick(labelList, arg);
    });

    // timeout变量用于鼠标移出label时，取消显示Popover
    let timeout;
    instance.on('mouseover', (arg) => {
      // clientX鼠标距离浏览器可视区域左上角的水平距离
      // clientY鼠标距离浏览器可视区域左上角的垂直距离
      const { event: { event: { clientX: posX, clientY: posY } }, value } = arg;
      const descKey = _.findKey(indicators, o => o.name === value);
      timeout = setTimeout(() => {
        this.setState({
          isToolTipVisible: true,
          posX,
          posY,
          desc: indicators[descKey].description,
        });
      }, 200);
    });

    instance.on('mouseout', () => {
      clearTimeout(timeout);
      this.setState({
        isToolTipVisible: false,
        desc: '',
      });
    });
  }

  formatIndicators(indicator, category) {
    // 资产和交易量指标数据
    const assetAndTradeData = [
      indicator.purFinAset,  // 净新增客户资产
      indicator.tradTranAmt,  // 累计基础交易量
      indicator.zhTranAmt,  // 累计综合交易量
      indicator.gjPurRake,  // 股基累计净佣金
    ];
    // 服务指标数据
    const managerSeviceData = [
      indicator.gjzMotCompletePercent,   // 必做MOT任务完成率
      indicator.gjzServiceCompPercent,   // 高净值客户服务覆盖率
    ];
    // 客户及资产数据
    const custAndPropertyData = [
      indicator.custNum,  // 服务客户数
      indicator.totAset,  // 服务客户资产
      indicator.currSignCustNum,  // 签约客户数
      indicator.currSignCustAset,  // 签约客户资产
      indicator.newCustNum,  // 新开客户数
      indicator.newCustInAset,  // 新开客户资产
    ];
    // 业务开通
    const establishBusinessData = [
      indicator.ttfBusiCurr, // 天天发
      indicator.hgtBusiCurr, // 港股通
      indicator.sgtBusiCurr, // 深港通
      indicator.rzrqBusiCurr, // 融资融券
      indicator.xsbBusiCurr, // 新三板
      indicator.gpqqBusiCurr, // 个股期权
      indicator.cybBusiCurr, // 创业板
    ];
    // 沪深归集率数据
    const hsRateData = [
      indicator.shzNpRate, // 沪深归集率
    ];
    // 产品销售数据
    const productSaleData = [
      indicator.kfTranAmt, // 公募
      indicator.smTranAmt, // 私模
      indicator.taTranAmt, // 紫金
      indicator.otcTranAmt, // OTC
    ];
    // 净创收数据
    const pureIcomeData = [
      indicator.purRake, // 净佣金收入
      indicator.prdtPurFee, // 产品净手续费收入
      indicator.purInteIncome, // 净利息收入
    ];
    // 服务指标数据
    const serviceIndicatorData = [
      indicator.motCompletePercent,  // 必做MOT任务完成率
      indicator.serviceCompPercent,  // 服务覆盖率
      indicator.feeConfigPercent,  // 多元产品覆盖率
      indicator.infoCompPercent,  // 客户信息完善率
    ];

    // 是否是经营指标的展示
    const isManager = category === 'manager';
    if (isManager) {
      // 展示经营指标区域
      return [
        { key: 'yewukaitong', headLine: '业务开通', data: this.filterFalsityArray(establishBusinessData) },  // 业务开通指标块
        { key: 'hushenguijilv', headLine: '沪深归集率', data: this.filterFalsityArray(hsRateData) }, // 沪深归集率指标块
        { key: 'zichanhejiaoyiliang', headLine: '资产和交易量', data: this.filterFalsityArray(assetAndTradeData) }, // 资产与交易量指标块
        { key: 'chanpinxiaoshou', headLine: '产品销售', data: this.filterFalsityArray(productSaleData) },  // 产品销售指标块
        { key: 'fuwuzhibiao', headLine: '服务指标', data: this.filterFalsityArray(managerSeviceData) },  // 服务指标块
      ];
    }
    // 展示投顾绩效
    return [
      { key: 'kehujizichan', headLine: '客户及资产', data: this.filterFalsityArray(custAndPropertyData) },  // 客户及资产指标块
      { key: 'yewukaitong', headLine: '业务开通', data: this.filterFalsityArray(establishBusinessData) },  // 业务开通指标块
      { key: 'hushenguijilv', headLine: '沪深归集率', data: this.filterFalsityArray(hsRateData) }, // 沪深归集率指标块
      { key: 'chanpinxiaoshou', headLine: '产品销售', data: this.filterFalsityArray(productSaleData) },  // 产品销售指标块
      { key: 'jingchuangshou', headLine: '净创收', data: this.filterFalsityArray(pureIcomeData) },  // 净创收指标块
      { key: 'fuwuzhibiao', headLine: '服务指标', data: this.filterFalsityArray(serviceIndicatorData) },  // 服务指标
    ];
  }

  @autobind
  renderIndictors(item, category) {
    if (item.key === 'kehujizichan') {
      return this.renderCustAndPropertyIndicator(item);
    } else if (item.key === 'yewukaitong') {
      return this.renderBusinessIndicator(item);
    } else if (item.key === 'hushenguijilv') {
      return this.renderHSRateIndicators(item);
    } else if (item.key === 'chanpinxiaoshou' || item.key === 'jingchuangshou') {
      return this.renderProductSaleAndPureIcomeIndicators(item);
    } else if (item.key === 'fuwuzhibiao' && category === 'performance') {
      return this.renderServiceIndicators(item);
    } else if (item.key === 'fuwuzhibiao' && category === 'manager') {
      return this.renderManagerServiceIndicators(item);
    } else if (item.key === 'xinzengkehu') {
      return this.renderPureAddCustIndicators(item);
    } else if (item.key === 'zichanhejiaoyiliang') {
      return this.renderAssetAndTradeIndicators(item);
    }
    return null;
  }

  // 服务指标（经营指标）
  renderManagerServiceIndicators(param) {
    const headLine = { icon: 'kehufuwu', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <CustomerService data={param.data} />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 客户及资产（投顾绩效）
  renderCustAndPropertyIndicator(param) {
    const data = getCustAndProperty(param.data);
    const headLine = { icon: 'kehu', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <Funney dataSource={data} push={this.props.push} />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 业务开通数（投顾绩效）
  renderBusinessIndicator(param) {
    const argument = this.getNameAndValue(param.data, filterEmptyToInteger);
    const { newUnit, items } = getClientsNumber(argument);
    const headLine = { icon: 'kehuzhibiao', title: `${param.headLine}（${newUnit}次）` };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <IECharts
              onReady={this.handleBusinessOpenClick}
              option={items}
              resizable
              style={{
                height: '170px',
              }}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 沪深归集率（投顾绩效）
  renderHSRateIndicators(param) {
    const { value = '' } = param.data[0] || {};
    const data = getHSRate([filterEmptyToNumber(value)]);
    const headLine = { icon: 'jiaoyiliang', title: param.headLine };
    // description指标说明
    let description = null;
    const { indicators: { shzNpRate } } = this.props;
    if (shzNpRate && shzNpRate.description) {
      description = shzNpRate.description;
    }
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} desc={description}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <IECharts
              option={data}
              resizable
              style={{
                height: '180px',
                cursor: 'auto',
              }}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 产品销售 & 净创收（投顾绩效）
  renderProductSaleAndPureIcomeIndicators(param) {
    const argument = this.getNameAndValue(param.data, filterEmptyToNumber);
    const finalData = getProductSale(argument);
    const headLine = { icon: 'shouru', title: param.headLine };
    const { authority } = this.props;
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <ProgressList
              dataSource={finalData}
              key={param.key}
              type={'productSale'}
              authority={authority}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 服务指标（投顾绩效）
  renderServiceIndicators(param) {
    const performanceData = [];
    const colors = ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'];
    _.forEach(
      param.data,
      (item, index) => (
        performanceData.push({
          value: (filterEmptyToNumber(item.value) * 100),
          color: colors[index],
        })
      ),
    );
    const option = getServiceIndicatorOfPerformance({ performanceData });
    const headLine = { icon: 'kehufuwu', title: param.headLine };
    const { data } = param;
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <div>
              <IECharts
                option={option}
                resizable
                style={{
                  height: '132px',
                }}
              />
              <div className={styles.labelWrap}>
                <Popover
                  title={`${data[0].name}`}
                  content={data[0].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                >
                  <span className={styles.chartLabel}>{data[0].name}</span>
                </Popover>
                <Popover
                  title={`${data[1].name}`}
                  content={data[1].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                >
                  <span className={styles.chartLabel}>{data[1].name}</span>
                </Popover>
                <Popover
                  title={`${data[2].name}`}
                  content={data[2].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                >
                  <span className={styles.chartLabel}>{data[2].name}</span>
                </Popover>
                <Popover
                  title={`${data[3].name}`}
                  content={data[3].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                >
                  <span className={styles.chartLabel}>{data[3].name}</span>
                </Popover>
              </div>
            </div>
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 新增客户
  @autobind
  renderPureAddCustIndicators(param) {
    const { cycle, push, location, empInfo, custCount, authority } = this.props;
    const isEmpty = _.isEmpty(custCount);
    const { newUnit: pureAddUnit, items: pureAddItems } = getPureAddCust({
      pureAddData: isEmpty ? [0, 0, 0, 0] : custCount,
    });
    const headLine = { icon: 'kehu', title: `新增客户（${pureAddUnit}）` };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={isEmpty}>
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
    );
  }

  // 资产和交易量
  @autobind
  renderAssetAndTradeIndicators(param) {
    // 资产和交易量（经营指标）
    const argument = this.getNameAndValue(param.data, filterEmptyToNumber);
    const finalTradeingVolumeData = getTradingVolume(argument);
    const headLine = { icon: 'chanpinxiaoshou', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <CheckLayout dataSource={finalTradeingVolumeData} />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  render() {
    const { indicators, category } = this.props;
    const { posX, posY, isToolTipVisible, desc } = this.state;
    let formatIndicator = this.formatIndicators((indicators || {}), category);
    if (category === 'manager') {
      formatIndicator = [{ key: 'xinzengkehu' }, ...formatIndicator];
    }
    const firstRowData = _.slice(formatIndicator, 0, 3);
    const secondRowData = _.slice(formatIndicator, 3);
    return (
      <div className={styles.indexBox}>
        <div className={`${styles.listItem} ${styles.firstListItem}`}>
          <Row gutter={28}>
            {
              _.map(
                firstRowData,
                item => this.renderIndictors(item, category),
              )
            }
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={28}>
            {
              _.map(
                secondRowData,
                item => this.renderIndictors(item, category),
              )
            }
          </Row>
        </div>
        <Popover
          visible={isToolTipVisible}
          title={null}
          content={desc}
          placement="bottom"
        >
          <span style={{ position: 'fixed', left: posX, top: posY }} />
        </Popover>
      </div>
    );
  }
}
