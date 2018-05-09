/**
 * @Author: sunweibin
 * @Date: 2017-11-08 15:51:25
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-21 10:26:43
 * @description 资讯订阅新建的内容组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Icon } from 'antd';
import _ from 'lodash';

import ChoiceApproverBoard from './ChoiceApproverBoard';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import Transfer from '../common/biz/TableTransfer';
import CommissionLine from './CommissionLine';
import ThreeMatchTip from './ThreeMatchTip';
import { seibelConfig } from '../../config';
import {
  pagination,
  subScribeProColumns,
} from './commissionTransferHelper/transferPropsHelper';
import createCommon from './commissionCreateCommon/common';
import logable, { logPV } from '../../decorators/logable';

import styles from './createNewApprovalBoard.less';

const { comsubs: commadj } = seibelConfig;

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});

// redux effects方法
const effects = {
  approver: 'commission/getAprovalUserList',
  threeMatchInfo: 'commission/queryThreeMatchInfo',
  clearReduxState: 'commission/clearReduxState',
};

// redux store
const mapStateToProps = state => ({
  // 客户与产品的三匹配信息
  threeMatchInfo: state.commission.threeMatchInfo,
  // 审批人员列表
  approvalUserList: state.commission.approvalUserList,
});

// redux dispatch
const mapDispatchToProps = {
  // 查询产品与客户的三匹配信息
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 清空redux保存的state
  clearReduxState: getDataFunction(false, effects.clearReduxState),
  // 查询审批人员列表
  getAprovalUserList: getDataFunction(false, effects.approver),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class SubscribeCreateBoard extends PureComponent {
  static propTypes = {
    // 登录人信息
    empInfo: PropTypes.object,
    // 客户
    customer: PropTypes.object,
    // 新建资讯订阅可选产品列表
    subscribelProList: PropTypes.array.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 审批人列表
    approvalUserList: PropTypes.array.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    clearReduxState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customer: {},
    empInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 客户选择的产品列表
      subProList: [],
      // 三匹配信息
      subscribelProductMatchInfo: [],
      // 选择审批人的弹出层显示或隐藏
      choiceApprover: false,
      // 审批人
      approverName: '',
      approverId: '',
      // 附件编号
      attachment: '',
      canShowAppover: false,
    };
  }

  componentDidMount() {
    // 进入页面查一把子类型的审批人列表
    const { empInfo: { empNum } } = this.props;
    const btnId = createCommon.getApprovalBtnID(commadj.subscribe);
    this.props.getAprovalUserList({
      loginUser: empNum,
      btnId,
    });
  }
  // 获取用户选择的数据
  @autobind
  getData() {
    const {
      subProList,
      subscribelProductMatchInfo,
      approverId,
      attachment,
      canShowAppover,
    } = this.state;
    const newSubProList = createCommon.changeSubmitSubProList(
      subProList,
      subscribelProductMatchInfo,
    );
    return {
      newSubProList,
      approverId,
      attachment,
      canShowAppover,
    };
  }

  @autobind
  clearRedux() {
    // 清空redux的state
    this.props.clearReduxState({
      clearList: [
        { name: 'threeMatchInfo', value: {} },
        { name: 'subscribelProList', value: [] },
      ],
    });
  }

  @autobind
  resetData() {
    this.clearRedux();
    this.uploadComponent.resetUpload();
    this.setState({
      subProList: [],
      subscribelProductMatchInfo: [],
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
    });
  }

  // 咨讯订阅选择产品时进行三匹配
  @autobind
  merge3MatchSubInfo() {
    const { threeMatchInfo: info } = this.props;
    const { riskRankMhrt, investProdMhrt, investTypeMhrt, productCode } = info;
    const matchInfo = {
      productCode,
      riskMatch: riskRankMhrt,
      prodMatch: investProdMhrt,
      termMatch: investTypeMhrt,
    };
    const { subscribelProductMatchInfo } = this.state;
    const exsit = _.findIndex(subscribelProductMatchInfo, o => o.productCode === productCode) > -1;
    if (!exsit) {
      this.setState({
        subscribelProductMatchInfo: [matchInfo, ...subscribelProductMatchInfo],
      });
    }
  }


  @autobind
  changeSubscriProList(product) {
    const { prodRowId, prodId, prodName } = product;
    return {
      key: prodRowId,
      // 产品代码
      prodCode: prodId,
      // 产品名称
      prodName,
      ...product,
    };
  }

  // 重组资讯订阅可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const newSubscribel = this.changeSubscriProList(product);
      const { children } = product;
      if (!_.isEmpty(children)) {
        newSubscribel.children = children.map((item) => {
          const { prodRowid } = item;
          return {
            key: prodRowid,
            xDefaultOpenFlag: 'Y',
            canNotBeChoice: 'Y',
            ...item,
          };
        });
      }
      return newSubscribel;
    });
    return newSubscriProList;
  }

  // 资讯订阅调整穿梭变化的时候处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '资讯订阅产品',
    },
  })
  handleSubscribelTransferChange(flag, item, array) {
    this.setState({
      subProList: array,
    });
    const appList = array.map(pro => pro.approvalFlg);
    const approvFlag = _.includes(appList, 'Y');
    if (approvFlag) {
      this.setState({
        canShowAppover: true,
      });
    } else {
      this.setState({
        canShowAppover: false,
        approverId: '',
        approverName: '',
      });
    }
    if (flag === 'add') {
      // 如果是左侧列表添加到右侧列表,则需要查询三匹配信息
      const { prodCode } = item;
      const { id, custType } = this.props.customer;
      this.props.queryThreeMatchInfo({
        custRowId: id,
        custType,
        prdCode: prodCode,
      }).then(this.merge3MatchSubInfo);
    }
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  // 资讯订阅选择子产品的时候的处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '资讯订阅通过check选择子产品',
    },
  })
  handleSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      subProList: array,
    });
  }

  // 打开选择审批人弹窗
  @autobind
  @logPV({ pathname: '/modal/choiceApproval', title: '选择审批人' })
  openApproverBoard() {
    this.setState({
      choiceApprover: true,
    });
  }

  // 关闭审批人员选择弹出窗
  @autobind
  closeChoiceApproverModal() {
    this.setState({
      choiceApprover: false,
    });
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  // CommonUpload组件实例
  @autobind
  uploadRef(input) {
    if (!input) return;
    this.uploadComponent = input.getWrappedInstance();
  }

  render() {
    const {
      approvalUserList,
      subscribelProList,
    } = this.props;

    const {
      choiceApprover,
      approverName,
      approverId,
      canShowAppover,
      subscribelProductMatchInfo,
      subProList,
    } = this.state;

    const newApproverList = approvalUserList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList: [],
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment: '',
      needDefaultText: false,
      ref: this.uploadRef,
    };

    const newSubscribelProList = this.createSubscribelProList(subscribelProList);
    // 资讯订阅中的产品选择配置
    const subScribetransferProps = {
      firstTitle: '可选服务',
      secondTitle: '已选服务',
      firstData: newSubscribelProList,
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleSubscribelTransferChange,
      checkChange: this.handleSubscribelTransferSubProductCheck,
      rowKey: 'key',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      supportSearchKey: [['prodCode'], ['prodName']],
    };
    return (
      <div className={styles.contentBox}>
        <div className={styles.approvalBlock}>
          <InfoTitle head="资讯产品选择" />
          <Transfer {...subScribetransferProps} />
        </div>
        <ThreeMatchTip info={subscribelProductMatchInfo} userList={subProList} />
        <div className={styles.approvalBlock}>
          <InfoTitle head="附件信息" />
          <CommonUpload {...uploadProps} />
        </div>
        {
          // 资讯订阅选择审批人
          canShowAppover ?
          (
            <div className={styles.approvalBlock}>
              <InfoTitle head="审批人" />
              <CommissionLine label="选择审批人" labelWidth="110px">
                <div className={styles.checkApprover} onClick={this.openApproverBoard}>
                  {approverName === '' ? '' : `${approverName}(${approverId})`}
                  <div className={styles.searchIcon}>
                    <Icon type="search" />
                  </div>
                </div>
              </CommissionLine>
            </div>
          ) : null
        }
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}
