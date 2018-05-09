/**
 * @file components/commissionAdjustment/Detail.js
 *  批量佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import OtherCommission from './OtherCommission';
import CommonTable from '../common/biz/CommonTable';
import styles from './detail.less';
import logable from '../../decorators/logable';

// 表头
const tableHeader = [
  {
    dataIndex: 'econNum',
    key: 'econNum',
    title: '经纪客户号',
  },
  {
    dataIndex: 'custName',
    key: 'custName',
    title: '客户名称',
  },
  {
    dataIndex: 'custLevel',
    key: 'custLevel',
    title: '客户等级',
  },
  {
    dataIndex: 'openAccDept',
    key: 'openAccDept',
    title: '开户营业部',
  },
  {
    dataIndex: 'status',
    key: 'status',
    title: '状态',
  },
];

export default class Commissiondetail extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    checkApproval: PropTypes.func.isRequired,
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '客户信息表审批记录列',
    },
  })
  handleCheckApproval(record, index) {
    this.props.checkApproval(record, index);
  }

  render() {
    const {
      custList = [],
      batchNum, // 批量佣金调整的批处理号
      businessType,
      comments,
      divisionName,
      createdByName,
      createdByLogin,
      created,
      status,
      newCommission, // 目标股基佣金率
      prodCode, // 目标产品
      bgCommission, // B股
      zqCommission, // 债券
      hCommission, // 回购
      oCommission, // 场内基金
      qCommission, // 权证
      stkCommission, // 担保股基
      dzCommission, // 担保债券
      doCommission, // 担保场内基金
      dqCommission, // 担保权证
      creditCommission, // 信用股基
      coCommission, // 信用场内基金
      hkCommission, // 港股通（净佣金）
      opCommission, // 个股期权
      ddCommission, // 担保品大宗
      stbCommission, // 股转
      dCommission, // 大宗交易
    } = this.props.data;
    const { location: { query: { currentId = '' } } } = this.props;
    if (_.isEmpty(businessType) || _.isEmpty(custList)) {
      return null;
    }

    const bugTitle = `编号:${currentId}`;
    const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;
    const targetCom = `${newCommission}‰`;
    // 表格中需要的操作
    const operation = {
      column: {
        key: 'view', // 'check'\'delete'\'view'
        title: '审批记录',
      },
      operate: this.handleCheckApproval,
    };

    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.bugTitle}>{bugTitle}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="子类型" value="批量佣金调整" />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="CRM编号" value={batchNum} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="备注" value={comments} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="提请时间" value={created} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="customer_module" className={styles.module}>
              <InfoTitle head="客户信息" />
              <div className={styles.modContent}>
                <CommonTable
                  data={custList}
                  titleList={tableHeader}
                  operation={operation}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
            <div id="choosecommission" className={styles.module}>
              <InfoTitle head="佣金产品" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="目标股基佣金率" value={targetCom} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="目标产品" value={prodCode} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="processing" className={styles.module}>
              <InfoTitle head="其他佣金费率" />
              <div className={styles.modContent}>
                <div className={styles.leftCommission}>
                  <OtherCommission name="B股：" value={bgCommission} />
                  <OtherCommission name="债券：" value={zqCommission} />
                  <OtherCommission name="回购：" value={hCommission} />
                  <OtherCommission name="场内基金：" value={oCommission} />
                  <OtherCommission name="权证：" value={qCommission} />
                  <OtherCommission name="担保股基：" value={stkCommission} />
                  <OtherCommission name="担保债券：" value={dzCommission} />
                  <OtherCommission name="担保场内基金：" value={doCommission} />
                </div>
                <div className={styles.rightCommission}>
                  <OtherCommission name="担保权证：" value={dqCommission} />
                  <OtherCommission name="信用股基：" value={creditCommission} />
                  <OtherCommission name="信用场内基金：" value={coCommission} />
                  <OtherCommission name="港股通（净佣金）：" value={hkCommission} />
                  <OtherCommission name="个股期权：" value={opCommission} />
                  <OtherCommission name="担保品大宗：" value={ddCommission} />
                  <OtherCommission name="股转：" value={stbCommission} />
                  <OtherCommission name="大宗交易：" value={dCommission} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

