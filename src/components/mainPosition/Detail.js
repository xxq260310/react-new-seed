/**
 * @Author: hongguangqing
 * @Description: 服务经理主职位设置右侧详情
 * @Date: 2018-02-26 15:19:37
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-03-21 10:44:14
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import ApprovalRecord from '../permission/ApprovalRecord';
import config from './config';
import styles from './detail.less';

// 表头
const { mainPosition: { titleList } } = config;
export default class Detail extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const {
      id,
      empId,
      empName,
      orgName,
      createTime,
      status,
      ptyMngName,
      ptyMngId,
      empPostns,
      currentApproval,
      workflowHistoryBeans,
      currentNodeName,
    } = this.props.data;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 服务经理
    const empInfo = `${ptyMngName} (${ptyMngId})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;

    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <div className={styles.propertyList}>
                  <div className={styles.item}>
                    <InfoItem label="服务经理" value={empInfo} />
                  </div>
                </div>
                <CommonTable
                  data={empPostns}
                  titleList={titleList}
                  rowKey={'positionId'}
                />
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
                    <InfoItem label="提请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                currentNodeName={currentNodeName}
                statusType="ready"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
