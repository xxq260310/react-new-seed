/**
 * @Author: sunweibin
 * @Date: 2018-02-26 13:49:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-02 14:24:07
 * @description 套利软件展示页详情组件
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import styles from './detail.less';
import MultiUploader from '../common/biz/MultiUploader';
import { seibelConfig } from '../../config';
import { time } from '../../helper';
import {
  isInvolvePermission,
  isInvolveSoftware,
} from './auth';

const EMPTY_PARAM = '暂无';
// 合约条款的表头、状态对应值
const { contract: { status } } = seibelConfig;
export default class Detail extends PureComponent {
  static propTypes = {
    protocolDetail: PropTypes.object.isRequired,
    flowHistory: PropTypes.array.isRequired,
    attachmentList: PropTypes.array,
    currentView: PropTypes.string,
  }

  static defaultProps = {
    attachmentList: [],
    flowHistory: [],
    uploadAttachment: () => { },
    currentView: '',
  }

  @autobind
  changeEdit() {
    this.setState({
      edit: true,
    });
  }

  // 拼接开通权限的显示文本
  @autobind
  joinPermissionText(textArray) {
    if (!Array.isArray(textArray)) return '';
    return textArray.map(item => item.value).join('，');
  }

  // 将拟稿人信息中的状态切换成中文
  @autobind
  convertDraftStatus(draftStatus) {
    let statusLabel = '';
    if (draftStatus) {
      statusLabel = status[Number(draftStatus)].label;
    }
    return statusLabel;
  }

  render() {
    const {
      protocolDetail,
      flowHistory,
      attachmentList,
    } = this.props;
    // 客户姓名，
    // 由于后台接口之前contactName和accountName同时存在，
    // 有时候有有时候没有，
    // 所以采取两个字段同时判断，来显示客户名称以及经纪客户号
    // 都没有数据则显示暂无
    const custName = `${(protocolDetail.contactName || protocolDetail.accountName) || EMPTY_PARAM} ${protocolDetail.econNum || EMPTY_PARAM}`;
    const approverName = protocolDetail.approver ? `${protocolDetail.approverName} (${protocolDetail.approver})` : EMPTY_PARAM;
    const nowStep = {
      // 当前步骤
      stepName: protocolDetail.workflowNode || EMPTY_PARAM,
      // 当前审批人
      handleName: approverName,
    };
    // 拟稿信息状态文字
    const statusLabel = this.convertDraftStatus(protocolDetail.status);
    // 开通权限文字显示
    const permissionText = this.joinPermissionText(protocolDetail.softPermission);
    const involvePermission = isInvolvePermission(protocolDetail.softBusinessType);
    const involveSoftware = isInvolveSoftware(protocolDetail.softBusinessType);
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{protocolDetail.appId}</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={protocolDetail.operationTypeText || EMPTY_PARAM} />
          <InfoItem label="子类型" value={protocolDetail.subType || EMPTY_PARAM} />
          <InfoItem label="客户" value={custName} />
          <InfoItem label="申请单编号" value={protocolDetail.appId} />
          <InfoItem label="协议编号" value={protocolDetail.agreementNum} />
          <InfoItem label="协议模板" value={protocolDetail.templateId} />
          <InfoItem label="协议开始日期" value={time.format(protocolDetail.startDt) || EMPTY_PARAM} />
          <InfoItem label="协议有效期" value={time.format(protocolDetail.vailDt) || EMPTY_PARAM} />
          <InfoItem label="业务类型" value={protocolDetail.softBusinessTypeText || EMPTY_PARAM} />
          {
            !involvePermission ? null :
            (<InfoItem label="开通权限" value={permissionText || EMPTY_PARAM} />)
          }
          {
            !involveSoftware ? null :
            (
              <InfoItem label="软件账号" value={protocolDetail.softAccount || EMPTY_PARAM} />
            )
          }
          {
            !involveSoftware ? null :
            (<InfoItem label="软件密码" value={protocolDetail.softPassword || EMPTY_PARAM} />)
          }
          <InfoItem label="备注" value={protocolDetail.content || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={`${protocolDetail.divisionName || EMPTY_PARAM} ${protocolDetail.createdName || EMPTY_PARAM}`} />
          <InfoItem label="提请时间" value={protocolDetail.createdDt} />
          <InfoItem label="状态" value={statusLabel || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="附件信息" />
          {
            !_.isEmpty(attachmentList) ?
              attachmentList.map(item => (<MultiUploader
                attachmentList={item.attachmentList}
                attachment={''}
                title={item.title}
                key={`${protocolDetail.id}${item.title}`}
              />))
              :
              <div className={styles.fileList}>
                <div className={styles.noFile}>暂无附件</div>
              </div>
          }
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={flowHistory} nowStep={nowStep} />
        </div>
      </div>
    );
  }
}
