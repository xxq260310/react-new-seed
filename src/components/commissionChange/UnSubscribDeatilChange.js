/**
 * @file components/commissionChange/UnSubscribDeatilChange.js
 * @description 资讯退订驳回再修改页面
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, message } from 'antd';
import _ from 'lodash';

import RejectButtons from './RejectButtons';
import DisabledSelect from './DisabledSelect';
import CommonUpload from '../../components/common/biz/CommonUpload';
import Transfer from '../../components/common/biz/TableTransfer';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import InfoTitle from '../../components/common/InfoTitle';
import CommissionLine from '../../components/commissionAdjustment/CommissionLine';
import {
  pagination,
  subScribeProColumns,
} from '../../components/commissionAdjustment/commissionTransferHelper/transferPropsHelper';
import logable, { logPV } from '../../decorators/logable';

import styles from './change.less';

const { TextArea } = Input;

export default class UnSubscribeDetailToChange extends PureComponent {
  static propTypes = {
    empInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    // 退订详情
    getUnSubDetailToChange: PropTypes.func.isRequired,
    unSubDetailToChange: PropTypes.object.isRequired,
    // 新建资讯退订提交接口
    submitUnSub: PropTypes.func.isRequired,
    // 修改资讯退订提交后返回值
    consultUnSubId: PropTypes.string.isRequired,
    // 根据接口返回的操作按钮
    onQueryBtns: PropTypes.func.isRequired,
    approvalBtns: PropTypes.array.isRequired,
    // 更新流程
    onUpdateFlow: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      remark: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
      unSubProList: [], // 资讯退订产品列表
      canShowAppover: false, // 新建资讯订阅和退订时是否需要选择审批人
      btnDisabled: false,
      buttonList: [], // 审批按钮列表
    };
  }

  componentDidMount() {
    const { location: { query: { flowId } } } = this.props;
    this.props.getUnSubDetailToChange({ flowId }).then(() => {
      const { attachmentNum } = this.props.unSubDetailToChange.base;
      this.setState({
        attachment: attachmentNum,
      });
    });
    // 获取当前驳回后修改的审批按钮
    this.props.onQueryBtns({
      flowId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { unSubDetailToChange: preDetail } = this.props;
    const { unSubDetailToChange: nextDetail } = nextProps;
    if (nextDetail !== preDetail) {
      const { base } = nextDetail;
      const {
        item,
        comments,
        attachmentNum,
      } = base;
      const findObj = _.find(item, ['approveFlag', 'Y']);
      if (!_.isEmpty(findObj)) {
        this.setState({
          canShowAppover: true,
        });
      }
      this.setState({
        remark: comments,
        attachment: attachmentNum,
        unSubProList: item,
      });
    }
    const { approvalBtns: preBtnList } = this.props;
    const { approvalBtns: nextBtnList } = nextProps;
    if (!_.isEqual(preBtnList, nextBtnList)) {
      const { item: itemList } = nextDetail.base;
      const findObj2 = _.find(itemList, ['approveFlag', 'Y']);
      const approListBtns = _.filter(nextBtnList, o => String(o.operate) !== 'trueOver');
      const unApproListBtns = _.filter(nextBtnList, o => String(o.operate) !== 'commit');
      if (!_.isEmpty(findObj2)) {
        this.setState({
          buttonList: approListBtns,
        });
      } else {
        this.setState({
          buttonList: unApproListBtns,
        });
      }
    }
  }


  // 清空页面数据
  @autobind
  clearApprovalBoard() {
    if (this.digital) this.digital.reset();
    if (this.addCustomer) this.addCustomer.clearCustList();
    this.setState({
      remark: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
      unSubProList: [], // 资讯退订产品列表
    });
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  @autobind
  addCustomerRef(input) {
    this.addCustomer = input;
  }

  // 清空用户选择的客户列表
  @autobind
  clearCustList() {
    this.addCustomer.clearCustList();
  }

  // 选择其他佣金比率
  @autobind
  changeOtherCommission(name, value) {
    this.setState({
      [name]: value,
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

  // 资讯退订选择子产品的时候的处理程序
  @autobind
  handleSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      unSubProList: array,
    });
  }

  @autobind
  changeSubscriProList(product) {
    const { prodRowId, prodId, prodName, children } = product;
    const proList = {
      key: prodRowId,
      // 产品代码
      prodCode: prodId,
      // 产品名称
      prodName,
      // 传入的产品原始数据
      ...product,
    };
    if (!_.isEmpty(children)) {
      const newChildren = _.map(children, (item) => {
        const { prodRowid } = item;
        return {
          key: prodRowid,
          ...item,
        };
      });
      return { ...proList, children: newChildren };
    }
    return proList;
  }

  // 重组资讯退订可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const newSubscribel = this.changeSubscriProList(product);
      const { children } = product;
      if (!_.isEmpty(children)) {
        newSubscribel.children = children.map(item => ({
          xDefaultOpenFlag: 'Y',
          canNotBeChoice: 'Y',
          ...item,
        }));
      }
      return newSubscribel;
    });
    return newSubscriProList;
  }

  // 重组资讯退订已选产品List
  @autobind
  choiceSubProList(data) {
    const newChoiceProList = data.map((product) => {
      const { subItem } = product;
      const needPickKey = ['riskMatch', 'prodMatch', 'termMatch', 'prodCode', 'agrType'];
      const choiceUnsubPro = _.pick(product, needPickKey);
      choiceUnsubPro.key = product.prodCode;
      choiceUnsubPro.prodName = product.aliasName;
      choiceUnsubPro.approvalFlg = product.approveFlag;
      if (!_.isEmpty(subItem)) {
        choiceUnsubPro.children = subItem.map((item) => {
          const { prodCode: subItemCode } = item;
          return {
            key: subItemCode,
            xDefaultOpenFlag: 'Y',
            canNotBeChoice: 'Y',
            ...item,
          };
        });
      }
      return choiceUnsubPro;
    });
    return newChoiceProList;
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  // 将原本订单所选中的产品从可选中去除
  filterProList(choiceList, proList) {
    const productCodeList = choiceList.map(item => item.prodCode);
    return _.filter(proList, product => !_.includes(productCodeList, product.prodCode));
  }

  // 选中的资讯退订父产品数据结构改为提交所需
  @autobind
  changeSubmitscriProList(product) {
    const {
      prodCode,
      prodName,
      approvalFlg,
    } = product;
    return {
      prodCode,
      aliasName: prodName,
      approvalFlg,
    };
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
    const { approvalBtns } = this.props;
    const approListBtns = _.filter(approvalBtns, o => String(o.operate) !== 'trueOver');
    const unApproListBtns = _.filter(approvalBtns, o => String(o.operate) !== 'commit');
    const appList = array.map(pro => pro.approvalFlg);
    const approvFlag = _.includes(appList, 'Y');
    if (approvFlag) {
      this.setState({
        canShowAppover: true,
        buttonList: approListBtns,
      });
    } else {
      this.setState({
        canShowAppover: false,
        approverId: '',
        approverName: '',
        buttonList: unApproListBtns,
      });
    }
  }

  // 资讯订阅选择子产品的时候的处理程序
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

  // 选中的资讯退订、退订子产品数据结构改为提交所需
  @autobind
  changeSubmitSubscriProChildren(product) {
    const {
      prodCode,
      prodName,
    } = product;
    return {
      prodCode,
      aliasName: prodName,
    };
  }

  // 将选中的资讯退订产品数据结构改为提交所需
  @autobind
  changeSubmitSubProList(list) {
    const newSubmitSubscriProList = list.map((product) => {
      const { aliasName } = product;
      if (_.isEmpty(aliasName)) {
        const { children } = product;
        const newSubmitSubscribel = this.changeSubmitscriProList(product);
        if (!_.isEmpty(children)) {
          // 存在子产品
          newSubmitSubscribel.subItem = children.map(this.changeSubmitSubscriProChildren);
        }
        return newSubmitSubscribel;
      }
      // 表示初始化的数据
      const { subItem } = product;
      const needPickKey = ['riskMatch', 'prodMatch', 'termMatch', 'prodCode', 'aliasName', 'agrType'];
      const anotherProduct = _.pick(product, needPickKey);
      anotherProduct.approvalFlg = product.approveFlag;
      if (!_.isEmpty(subItem)) {
        anotherProduct.subProductVO = _.cloneDeep(subItem);
      }
      return anotherProduct;
    });
    return newSubmitSubscriProList;
  }

// 提交前检查各项输入的值是否符合要求
  @autobind
  submitCheck() {
    let result = true;
    const { approverId, canShowAppover, unSubProList } = this.state;
    if (_.isEmpty(approverId) && canShowAppover) {
      message.error('审批人员不能为空');
      result = false;
    }
    if (_.isEmpty(unSubProList)) {
      message.error('资讯退订的产品列表不能为空');
      result = false;
    }
    return result;
  }

  @autobind
  afterLauncher() {
    message.success('提交成功');
    this.setState({
      btnDisabled: true,
    });
  }

  // 发起流程
  @autobind
  launchFlow(flowBtn, idea) {
    const { base: { flowCode } } = this.props.unSubDetailToChange;
    const { nextGroupName, operate, flowAuditors } = flowBtn;
    const { approverId } = this.state;
    // 根据按钮不同传递不同参数
    const commParam = {
      flowId: flowCode,
      groupName: nextGroupName,
      approverIdea: idea,
      operate,
    };
    if (operate === 'commit') {
      commParam.auditors = approverId;
    } else {
      commParam.auditors = flowAuditors[0].login;
    }
    this.props.onUpdateFlow(commParam).then(this.afterLauncher, () => message.success('流程发起失败'));
  }

  // 资讯退订提交修改
  @autobind
  handleSubmit(flowBtn) {
    if (!this.submitCheck()) return;
    const { empNum } = this.props.empInfo;
    const {
      unSubDetailToChange: {
        base,
        unSubscribeCustList,
      },
    } = this.props;
    const { workFlowNumber, orderId } = base;
    const {
      remark,
      approverId, // 审批人工号
      attachment, // 附件编号
      unSubProList,
    } = this.state;
    const newSubProList = this.changeSubmitSubProList(unSubProList);
    const params = {
      type: unSubscribeCustList.custType,
      aprovaluser: approverId,
      custNum: unSubscribeCustList.custEcom,
      custId: unSubscribeCustList.id,
      createdBy: empNum,
      comments: remark,
      attachmentNum: attachment,
      flowId: workFlowNumber,
      orderId,
      item: newSubProList,
    };
    const { operate } = flowBtn;
    if (operate === 'commit') {
       // 提交
      this.props.submitUnSub(params).then(() => this.launchFlow(flowBtn, '重新申请'),
        () => message.success('修改失败'));
    }
    if (operate === 'trueOver') {
      // 提交
      this.props.submitUnSub(params).then(this.afterLauncher, () => message.success('修改失败'));
    }
  }

  // 点击页面的按钮事件处理
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$args[0].btnName' } })
  handleRejctBtnClick(btn) {
    const { operate } = btn;
    if (operate === 'commit' || operate === 'trueOver') {
      // 提交按钮
      this.handleSubmit(btn);
    }
    if (operate === 'falseOver') {
      // 终止按钮
      this.launchFlow(btn, '终止申请');
    }
  }


  render() {
    const {
      unSubDetailToChange: {
        base,
        unSubscribeCustList,
        unSubProList,
        attachmentList,
        approvList,
      },
    } = this.props;
    if (_.isEmpty(base)) return null;
    if (_.isEmpty(unSubscribeCustList)) return null;
    const { riskLevelLabel } = unSubscribeCustList;
    const {
      // 客户名称
      custName,
      // 经纪客户号
      custNum,
      // 备注
      comments,
      // 产品
      item: choiceProList,
      attachmentNum,
    } = base;
    const customer = `${custName}（${custNum}） - ${riskLevelLabel}`;
    const newApproverList = approvList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });
    const newUnSubscriProList = this.createSubscribelProList(unSubProList);
    const choiceUnSubProList = this.choiceSubProList(choiceProList);
    const newUnSubscribelProList = this.filterProList(choiceUnSubProList, newUnSubscriProList);
    const {
      choiceApprover,
      approverName,
      approverId,
      remark,
      btnDisabled,
      buttonList,
      canShowAppover,
    } = this.state;

    // 资讯退订中的产品选择配置
    const unsubScribetransferProps = {
      firstTitle: '可退订服务',
      secondTitle: '已选服务',
      firstData: newUnSubscribelProList,
      secondData: choiceUnSubProList,
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

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList,
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment: attachmentNum,
      needDefaultText: false,
    };

    return (
      <div className={styles.rejectContainer}>
        <div className={styles.newApprovalBox}>
          <div className={styles.approvalBlock}>
            <InfoTitle head="基本信息" />
            <CommissionLine label="子类型" labelWidth="90px" required>
              <DisabledSelect text="资讯退订" />
            </CommissionLine>
            <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
              <DisabledSelect text={customer} />
            </CommissionLine>
            <CommissionLine label="备注" labelWidth="90px">
              <TextArea
                placeholder={comments}
                value={remark}
                onChange={this.handleChangeRemark}
                style={{
                  fontSize: '14px',
                }}
              />
            </CommissionLine>
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="资讯产品选择" />
            <Transfer {...unsubScribetransferProps} />
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="附件信息" />
            <CommonUpload {...uploadProps} />
          </div>
          {
            !canShowAppover ? null :
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
            )
          }
        </div>
        <RejectButtons
          disabled={btnDisabled}
          btnList={buttonList}
          onClick={this.handleRejctBtnClick}
        />
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
