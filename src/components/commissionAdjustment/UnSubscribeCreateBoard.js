/**
 * @Author: sunweibin
 * @Date: 2017-11-08 15:52:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-11 10:34:12
 * @description 资讯退订新建的内容组件
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
import CommissionLine from './CommissionLine';
import Transfer from '../common/biz/TableTransfer';
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
  clearReduxState: 'commission/clearReduxState',
  unSubscribelProList: 'commission/getUnSubscribelProList',
};

// redux store
const mapStateToProps = state => ({
  // 审批人员列表
  approvalUserList: state.commission.approvalUserList,
  // 新建资讯订阅可选产品列表
  unSubscribelProList: state.commission.unSubscribelProList,
});

// redux dispatch
const mapDispatchToProps = {
  // 清空redux保存的state
  clearReduxState: getDataFunction(false, effects.clearReduxState),
  // 查询审批人员列表
  getAprovalUserList: getDataFunction(false, effects.approver),
  // 获取新建资讯退订可选产品列表
  getUnSubscribelProList: getDataFunction(false, effects.unSubscribelProList),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class UnSubscribeCreateBoard extends PureComponent {
  static propTypes = {
    // 登录人信息
    empInfo: PropTypes.object,
    // 客户
    customer: PropTypes.object,
    // 新建资讯退订可选产品列表
    getUnSubscribelProList: PropTypes.func.isRequired,
    unSubscribelProList: PropTypes.array.isRequired,
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
      unSubProList: [],
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
    const { id } = this.props.customer;
    if (!_.isEmpty(id)) {
      this.props.getUnSubscribelProList({
        custRowId: id,
      });
    }
    const btnId = createCommon.getApprovalBtnID(commadj.unsubscribe);
    this.props.getAprovalUserList({
      loginUser: empNum,
      btnId,
    });
  }

  // 获取用户选择的数据
  @autobind
  getData() {
    const {
      unSubProList,
      approverId,
      attachment,
      canShowAppover,
    } = this.state;
    const newUnSubProList = createCommon.changeSubmitUnSubProList(unSubProList);
    return {
      newUnSubProList,
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
        { name: 'unSubscribelProList', value: [] },
      ],
    });
  }

  @autobind
  resetData() {
    this.clearRedux();
    this.uploadComponent.resetUpload();
    this.setState({
      unSubProList: [],
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
    });
  }

  @autobind
  changeUnSubscriProList(product) {
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

  // 重组资讯退订可选产品List
  @autobind
  createUnSubscribelProList(data) {
    const newUnSubscriProList = data.map((product) => {
      const newUnSubscribel = this.changeUnSubscriProList(product);
      const { children } = product;
      if (!_.isEmpty(children)) {
        newUnSubscribel.children = children.map((item) => {
          const { prodRowid } = item;
          return {
            key: prodRowid,

            ...item,
          };
        });
      }
      return newUnSubscribel;
    });
    return newUnSubscriProList;
  }

  // 资讯退订调整穿梭变化的时候处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '资讯退订产品',
    },
  })
  handleUnSubscribelTransferChange(flag, item, array) {
    this.setState({
      unSubProList: array,
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
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  // 资讯选择子产品的时候的处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '资讯退订通过check选择子产品',
    },
  })
  handleUnSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      unSubProList: array,
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
      unSubscribelProList,
    } = this.props;
    const {
      choiceApprover,
      approverName,
      approverId,
      canShowAppover,
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

    const newUnSubscribelProList = this.createUnSubscribelProList(unSubscribelProList);
    // 资讯退订中的服务产品退订配置
    const unsubScribetransferProps = {
      firstTitle: '可退订服务',
      secondTitle: '已选服务',
      firstData: newUnSubscribelProList,
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleUnSubscribelTransferChange,
      checkChange: this.handleUnSubscribelTransferSubProductCheck,
      rowKey: 'key',
      showSearch: false,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      disableCheckKey: 'canNotBeChoice',
      supportSearchKey: [['prodCode'], ['prodName']],
    };
    return (
      <div className={styles.contentBox}>
        <div className={styles.approvalBlock}>
          <InfoTitle head="服务产品退订" />
          <Transfer {...unsubScribetransferProps} />
        </div>
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
