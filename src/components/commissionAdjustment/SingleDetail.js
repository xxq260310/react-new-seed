/**
 * @file components/commissionAdjustment/SingleDetail.js
 *  单佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import OtherCommission from './OtherCommission';
import CommonUpload from '../common/biz/CommonUpload';
import ApproveList from '../common/approveList';
import CommonTable from '../common/biz/CommonTable';
import {
  custTableColumns,
  createCustTableData,
  singleProColumns,
  createProTableData,
} from './detailConfig';
import styles from './detail.less';

export default class Singlecommissiondetail extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  render() {
    const {
      data: { base, attachmentList, approvalHistory, currentStep },
      location: { query: { currentId = '' } },
    } = this.props;
    if (_.isEmpty(base)) return null;
    const {
      orderId,
      comments,
      divisionName,
      createdByName,
      createdByLogin,
      created, // 提请时间
      status,
      newCommission, // 目标股基佣金率
      currentCommission, // 当前股基佣金率
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
      ddCommission, // 担保品大宗
      stbCommission, // 股转
      dCommission, // 大宗交易
      item, // 产品
    } = base;

    const custList = createCustTableData(base);
    const proList = createProTableData(item);
    const bugTitle = `编号:${currentId}`;
    const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;
    const currentCom = `${currentCommission}‰`;
    const targetCom = `${newCommission}‰`;
    const stepName = (currentStep && currentStep.curentStep) || '';
    const handleName = (currentStep && currentStep.curentUser) || '';

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
                    <InfoItem label="子类型" value="佣金调整" />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="CRM编号" value={orderId} />
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
                  titleList={custTableColumns}
                />
              </div>
            </div>
            <div id="choosecommission" className={styles.module}>
              <InfoTitle head="佣金" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.leftCurrentCom}>
                    <InfoItem label="当前股基佣金率" value={currentCom} />
                  </li>
                  <li className={styles.rightTargetCom}>
                    <InfoItem label="目标股基佣金率" value={targetCom} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="processing" className={styles.module}>
              <InfoTitle head="其他佣金费率" />
              <div className={styles.modContent}>
                <div className={styles.leftCommission}>
                  <OtherCommission name="债券：" value={zqCommission} />
                  <OtherCommission name="权证：" value={qCommission} />
                  <OtherCommission name="B股：" value={bgCommission} />
                  <OtherCommission name="大宗交易：" value={dCommission} />
                  <OtherCommission name="场内基金：" value={oCommission} />
                  <OtherCommission name="回购：" value={hCommission} />
                  <OtherCommission name="股转：" value={stbCommission} />
                  <OtherCommission name="港股通（净佣金）：" value={hkCommission} />

                </div>
                <div className={styles.rightCommission}>
                  <OtherCommission name="担保债券：" value={dzCommission} />
                  <OtherCommission name="担保权证：" value={dqCommission} />
                  <OtherCommission name="担保股基：" value={stkCommission} />
                  <OtherCommission name="担保品大宗交易：" value={ddCommission} />
                  <OtherCommission name="担保场内基金：" value={doCommission} />
                  <OtherCommission name="信用场内基金：" value={coCommission} />
                  <OtherCommission name="信用股基：" value={creditCommission} />
                </div>
              </div>
            </div>
            <div id="productSelectionmodal" className={styles.module}>
              <InfoTitle head="产品选择" />
              <div className={styles.modContent}>
                <CommonTable
                  data={proList}
                  titleList={singleProColumns}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
            <div id="enclosure" className={styles.module}>
              <InfoTitle head="附件" />
              <CommonUpload
                attachmentList={attachmentList}
              />
            </div>
            <div id="approvalRecord" className={styles.module}>
              <InfoTitle head="审批记录" />
              <ApproveList
                data={approvalHistory}
                nowStep={{
                  stepName,
                  handleName,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

