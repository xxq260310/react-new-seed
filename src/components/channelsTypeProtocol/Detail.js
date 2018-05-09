/**
 * @Description: 通道类型协议详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-02-07 16:27:35
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
import CommonTable from '../common/biz/CommonTable';
import { seibelConfig } from '../../config';
import { time } from '../../helper';
import config from '../../routes/channelsTypeProtocol/config';

const {
  underCustTitleList,  // 下挂客户表头集合
  protocolClauseTitleList,  // 协议条款表头集合
  protocolProductTitleList,  // 协议产品表头集合
} = seibelConfig.channelsTypeProtocol;

const SUBTYPE = {
  // 高速通道
  heightSpeed: '0501',
  // 紫金通道
  violetGold: '0502',
};

const EMPTY_PARAM = '暂无';
// const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// bool MAP数据
const mapBoolData = {
  Y: '是',
  N: '否',
};
// 合约条款的表头、状态对应值
const { contract: { status } } = seibelConfig;
export default class Detail extends PureComponent {
  static propTypes = {
    protocolDetail: PropTypes.object.isRequired,
    flowHistory: PropTypes.array.isRequired,
    attachmentList: PropTypes.array,
    // showEditModal: PropTypes.func,
    // hasEditPermission: PropTypes.bool,
    currentView: PropTypes.string,
  }

  static defaultProps = {
    attachmentList: EMPTY_ARRAY,
    flowHistory: EMPTY_ARRAY,
    uploadAttachment: () => { },
    // showEditModal: () => {},
    // hasEditPermission: false,
    currentView: '',
  }

  @autobind
  changeEdit() {
    this.setState({
      edit: true,
    });
  }

  render() {
    const {
      protocolDetail,
      flowHistory,
      attachmentList,
      // showEditModal,
      // hasEditPermission,
      // 传入视图不同，判断是否显示申请单编号
      currentView,
    } = this.props;
    const custName = `${(protocolDetail.contactName || protocolDetail.accountName) || EMPTY_PARAM} ${protocolDetail.econNum || EMPTY_PARAM}`;
    const approverName = protocolDetail.approver ? `${protocolDetail.approverName} (${protocolDetail.approver})` : EMPTY_PARAM;
    const nowStep = {
      // 当前步骤
      stepName: protocolDetail.workflowNode || EMPTY_PARAM,
      // 当前审批人
      handleName: approverName,
    };
    const scroll = {
      x: true,
    };
    let isTenLevel = true;
    // 判断是否是紫金快车道 并且是 协议订购
    if (currentView === SUBTYPE.violetGold &&
        _.includes(config.subscribeArray, protocolDetail.operationType)) {
      // 判断是否是十档行情
      isTenLevel = (protocolDetail.templateId || '').indexOf('十档') > -1;
    }

    // 判断是否显示下挂客户
    const showUnderCust = protocolDetail.multiUsedFlag === 'Y';
    // 判断是否显示协议编号
    // const isShowProtocolNum = !(protocolDetail.operationType === '协议订购');
    let statusLabel = '';
    if (protocolDetail.status) {
      statusLabel = status[Number(protocolDetail.status)].label;
    } else {
      statusLabel = '';
    }
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{protocolDetail.appId}</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="操作类型" value={protocolDetail.operationTypeText || EMPTY_PARAM} />
          <InfoItem label="子类型" value={protocolDetail.subType || EMPTY_PARAM} />
          <InfoItem
            label="客户"
            value={custName}
          />
          {
            currentView === SUBTYPE.heightSpeed ?
              <InfoItem label="申请单编号" value={protocolDetail.appId} />
              : null
          }
          {
            protocolDetail.agreementNum ?
              <InfoItem label="协议编号" value={protocolDetail.agreementNum} />
              :
              null
          }
          <InfoItem label="协议模板" value={protocolDetail.templateId} />
          {
            isTenLevel ?
              null
              :
              <div>
                <InfoItem label="是否多账户使用" value={mapBoolData[protocolDetail.multiUsedFlag]} />
                <InfoItem label="是否订购十档行情" value={mapBoolData[protocolDetail.levelTenFlag]} />
              </div>
          }
          <InfoItem label="协议开始日期" value={time.format(protocolDetail.startDt) || EMPTY_PARAM} />
          <InfoItem label="协议有效期" value={time.format(protocolDetail.vailDt) || EMPTY_PARAM} />
          <InfoItem label="备注" value={protocolDetail.content || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value={`${protocolDetail.divisionName || EMPTY_PARAM} ${protocolDetail.createdName || EMPTY_PARAM}`} />
          <InfoItem label="提请时间" value={protocolDetail.createdDt} />
          <InfoItem label="状态" value={statusLabel || EMPTY_PARAM} />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="协议产品" />
          <CommonTable
            data={protocolDetail.item || []}
            titleList={protocolProductTitleList}
            scroll={scroll}
          />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="协议条款" />
          <CommonTable
            data={protocolDetail.term || EMPTY_ARRAY}
            titleList={protocolClauseTitleList}
          />
        </div>
        {
          showUnderCust ?
            <div className={styles.detailWrapper}>
              <InfoTitle head="下挂客户" />
              <CommonTable
                data={protocolDetail.cust}
                titleList={underCustTitleList}
              />
            </div>
            :
            null
        }
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
