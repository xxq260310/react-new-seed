/**
 * @file components/advisory/AdvisoryDetail.js
 *  咨询订阅详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonUpload from '../common/biz/CommonUpload';
import ApproveList from '../common/approveList';
import CommonTable from '../common/biz/CommonTable';
import {
  custTableColumns,
  createCustTableData,
  advisoryProColumns,
  createSubProTableData,
} from './detailConfig';
import styles from './detail.less';

export default class AdvisoryDetail extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const { name, data: { base, attachmentList, approvalHistory, currentStep } } = this.props;
    const { location: { query: { currentId = '' } } } = this.props;
    if (_.isEmpty(base)) return null;
    const {
      // 订单Id
      orderId,
      // 备注
      comments,
      // 营业部名称
      divisionName,
      // 创建者姓名
      createdByName,
      // 创建者工号
      createdByLogin,
      // 创建时间
      created,
      // 状态
      status,
      // 产品
      item,
    } = base;
    const custList = createCustTableData(base);
    const proList = createSubProTableData(item);
    const bugTitle = `编号:${currentId}`;
    const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;
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
                    <InfoItem label="子类型" value={name} />
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
            <div id="productSelectionmodal" className={styles.module}>
              <InfoTitle head="产品选择" />
              <div className={styles.modContent}>
                <CommonTable
                  data={proList}
                  titleList={advisoryProColumns}
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

