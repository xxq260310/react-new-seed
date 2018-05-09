/**
 * @file components/commissionAdjustment/CreateNewApprovalBoard.js
 * @description 新建佣金调整、批量佣金调整、资讯订阅、资讯退订弹出框
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, message } from 'antd';
import _ from 'lodash';

import { openFspTab, closeRctTab } from '../../utils';
import confirm from '../common/Confirm';
import CommonModal from '../common/biz/CommonModal';
import InfoTitle from '../common/InfoTitle';
import Select from '../common/Select';
import CommissionLine from './CommissionLine';
import SelectAssembly from './SelectAssembly';
import { seibelConfig } from '../../config';
import { permission } from '../../helper';
import { allCommissionParamName as otherComs } from '../../config/otherCommissionDictionary';
import BatchCreateBoard from './BatchCreatBoard';
import SingleCreatBoard from './SingleCreatBoard';
import SubscribeCreateBoard from './SubscribeCreateBoard';
import UnSubscribeCreateBoard from './UnSubscribeCreateBoard';
import styles from './createNewApprovalBoard.less';
import logable from '../../decorators/logable';

const { TextArea } = Input;
const { commission: { subType }, comsubs: commadj } = seibelConfig;
// 给subType去除全部的选项
const newSubTypes = _.filter(subType, item => !!item.value);
// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';

export default class CreateNewApprovalBoard extends PureComponent {
  static propTypes = {
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onBatchSubmit: PropTypes.func.isRequired,
    otherRatios: PropTypes.array,
    empInfo: PropTypes.object.isRequired,
    empPostnList: PropTypes.array.isRequired,
    getSingleOtherRates: PropTypes.func.isRequired,
    singleOtherRatio: PropTypes.array.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 单佣金调整客户列表
    querySingleCustList: PropTypes.func.isRequired,
    singleCustList: PropTypes.array.isRequired,
    // 资讯订阅、资讯退订客户列表
    querySubscribelCustList: PropTypes.func.isRequired,
    subscribeCustList: PropTypes.array.isRequired,
    // 新建资讯订阅可选产品列表
    getSubscribelProList: PropTypes.func.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    // 新建资讯退订可选产品列表
    getUnSubscribelProList: PropTypes.func.isRequired,
    unSubscribelProList: PropTypes.array.isRequired,
    // 单佣金调整提交
    onSubmitSingle: PropTypes.func.isRequired,
    singleSubmit: PropTypes.string.isRequired,
    // 新建资讯订阅提交接口
    submitSub: PropTypes.func.isRequired,
    // 新建资讯退订提交接口
    submitUnSub: PropTypes.func.isRequired,
    // 清空redux的state
    clearReduxState: PropTypes.func.isRequired,
    // 单佣金调整客户校验
    onValidateSingleCust: PropTypes.func.isRequired,
    singleCustVResult: PropTypes.object.isRequired,
    // 资讯订阅调整客户校验
    onCheckSubsciCust: PropTypes.func.isRequired,
    sciCheckCustomer: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    getCustDetailInfo: PropTypes.func.isRequired,
    custDetailInfo: PropTypes.object,
    // 刷新列表
    onRefreshList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
    onClose: () => {},
    otherRatios: [],
    consultSubId: '',
    consultUnsubId: '',
    custDetailInfo: {},
  }

  constructor(props) {
    super(props);
    const approvalType = this.authorityEmp();
    this.state = {
      approvalType,
      initType: approvalType,
      remark: '',
      targetProduct: '',
      choiceApprover: false,
      newCommission: '0.16',
      approverName: '',
      approverId: '',
      custLists: [],
      otherComReset: new Date().getTime(), // 用来判断是否重置
      customer: {}, // 单佣金、资讯退订、资讯订阅选择的客户
      attachment: '',
      singleProductList: [], // 单佣金调整选择的产品列表
      singleProductMatchInfo: [], // 单佣金调整选择的产品的三匹配信息
      subProList: [], // 资讯订阅产品列表
      subscribelProductMatchInfo: [], // 资讯订阅的产品的三匹配信息
      unSubProList: [], // 资讯退订产品列表
      singleDValue: 0, // 单佣金调整产品选择后的差值
      openRzrq: true, // 两融开关
      canShowAppover: false, // 新建资讯订阅和退订时是否需要选择审批人
      modalLoading: false, // 点击提交后，弹出层区域的Loading
    };
  }

  // 判断当前是否某个子类型
  @autobind
  judgeSubtypeNow(assert) {
    const { approvalType } = this.state;
    if (Array.isArray(assert)) {
      return _.includes(assert, approvalType);
    }
    return approvalType === assert;
  }

  @autobind
  clearRedux() {
    // 清空redux的state
    this.props.clearReduxState({
      clearList: [
        { name: 'singleOtherCommissionOptions' },
        { name: 'singleCustomerList' },
        { name: 'singleComProductList' },
        { name: 'threeMatchInfo', value: {} },
        { name: 'singleGJCommission' },
        { name: 'subscribelProList' },
        { name: 'unSubscribelProList' },
        { name: 'subscribeCustomerList' },
      ],
    });
  }

  // 关闭弹出框后，清空页面数据
  @autobind
  clearApprovalBoard() {
    if (this.addCustomer) this.addCustomer.clearCustList();
    const { initType } = this.state;
    this.setState({
      approvalType: initType,
      remark: '',
      targetProduct: '',
      choiceApprover: false,
      newCommission: '0.16',
      approverName: '',
      approverId: '',
      custLists: [],
      otherComReset: new Date().getTime(),
      customer: {},
      attachment: '',
      singleProductList: [],
      singleDValue: 0,
      singleProductMatchInfo: [],
      subProList: [],
      subscribelProductMatchInfo: [],
      unSubProList: [],
      openRzrq: true,
      canShowAppover: false,
    });
    this.clearRedux();
  }

  // 关闭弹窗
  @autobind
  closeModal() {
    // 此处需要弹出确认框
    confirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    const { modalKey, onClose } = this.props;
    this.clearApprovalBoard();
    onClose(modalKey);
  }

  // 修改单佣金父产品参数
  @autobind
  updateParamsProduct(product, matchInfos) {
    const { prodCode, prodName, prodRate } = product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
    return {
      prodCode,
      aliasName: prodName,
      prodCommission: prodRate,
      ...matchInfo,
    };
  }

  // 修改单佣金子产品参数
  @autobind
  updateParamChildProduct(product) {
    const { prodCode, prodName } = product;
    return {
      prodCode,
      aliasName: prodName,
    };
  }

  // 将选择的产品进行筛选，并合并入3匹配信息
  @autobind
  pickSingleProductList(list, matchInfos) {
    return list.map((item) => {
      const { children } = item;
      const product = this.updateParamsProduct(item, matchInfos);
      if (!_.isEmpty(children)) {
        product.subProductVO = children.map(this.updateParamChildProduct);
      }
      return product;
    });
  }

  // 咨讯订阅提交产品改造
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

  // 提交前检查各项输入的值是否符合要求
  @autobind
  submitCheck() {
    let result = true;
    if (this.judgeSubtypeNow(commadj.batch)) {
      const {
        targetProduct,
        approverId,
        custLists,
      } = this.batchBoard.userSelectData();
       // 判断什么时候能够提交
      if (_.isEmpty(targetProduct)) {
        message.error('请选择目标产品');
        result = false;
      }
      if (_.isEmpty(custLists)) {
        message.error('请添加客户');
        result = false;
      }
      if (_.isEmpty(approverId)) {
        message.error('审批人员不能为空');
        result = false;
      }
    } else if (this.judgeSubtypeNow(commadj.single)) {
      const { dValue, approverId } = this.singleBoard.getData();
      if (dValue !== 0) {
        result = false;
        confirm({
          content: '请确保所选产品佣金率与目标股基佣金率一致',
        });
      }
      if (_.isEmpty(approverId)) {
        message.error('审批人员不能为空');
        result = false;
      }
    } else if (this.judgeSubtypeNow(commadj.subscribe)) {
      // 检查资讯订阅
      const {
        approverId,
        newSubProList,
        canShowAppover,
      } = this.subBoard.getData();
      if (_.isEmpty(approverId) && canShowAppover) {
        message.error('审批人员不能为空');
        result = false;
      }
      if (_.isEmpty(newSubProList)) {
        message.error('资讯订购产品不能为空');
        result = false;
      }
    } else if (this.judgeSubtypeNow(commadj.unsubscribe)) {
      // 检查资讯退订
      const {
        approverId, // 审批人工号
        canShowAppover,
        newUnSubProList,
      } = this.unSubBoard.getData();
      if (_.isEmpty(approverId) && canShowAppover) {
        message.error('审批人员不能为空');
        result = false;
      }
      if (_.isEmpty(newUnSubProList)) {
        message.error('资讯退订产品不能为空');
        result = false;
      }
    }
    return result;
  }

  // 隐藏/显示提交Loading
  @autobind
  submitLoadiing(modalLoading) {
    this.setState({
      modalLoading,
    });
  }

  // 批量佣金调整提交
  @autobind
  batchSubmit() {
    if (!this.submitCheck()) return;
    this.submitLoadiing(true);
    const {
      newCommission,
      targetProduct,
      approverId,
      custLists,
      ...otherCommissions
    } = this.batchBoard.userSelectData();
    const { remark } = this.state;
    // 挑选出用户选择的其他佣金率
    // const otherCommissions = _.pick(this.state, otherComs);
    const { empInfo: { occDivnNum, empNum } } = this.props;
    const submitParams = {
      custLists,
      newCommsion: newCommission,
      prodInfo: { prdCode: targetProduct },
      aprovaluser: approverId,
      remark,
      loginUser: empNum,
      orgId: occDivnNum,
      ...otherCommissions,
    };
    // 提交
    this.props.onBatchSubmit(submitParams).then(
      () => {
        message.success('批量佣金调整提交成功');
        this.submitLoadiing(false);
        this.clearApprovalBoard();
        const { modalKey, onClose, onRefreshList } = this.props;
        onClose(modalKey);
        onRefreshList();
      },
      () => {
        message.error('批量佣金调整提交失败');
        this.submitLoadiing(false);
      },
    );
  }

  // 单佣金调整提交
  @autobind
  singleSubmit() {
    if (!this.submitCheck()) return;
    // 单佣金调整需要的key
    this.submitLoadiing(true);
    const {
      userProductList,
      singleProductMatchInfo,
      newCommission,
      approverId,
      attachment,
    } = this.singleBoard.getData();
    const {
      remark,
      customer,
    } = this.state;
    const otherCommissions = _.pick(this.singleBoard.getData(), otherComs);
    const productList = this.pickSingleProductList(userProductList, singleProductMatchInfo);
    const params = {
      custRowId: customer.id,
      custType: customer.custType,
      newComm: newCommission,
      comments: remark,
      attachmentNum: attachment,
      aprovaluser: approverId,
      productInfo: productList,
      ...otherCommissions,
    };
    this.props.onSubmitSingle(params).then(() => {
      message.success('单佣金调整提交成功');
      const { modalKey, onClose, onRefreshList } = this.props;
      this.submitLoadiing(false);
      this.clearApprovalBoard();
      onClose(modalKey);
      onRefreshList();
    }, () => {
      message.error('单佣金调整提交失败');
      this.submitLoadiing(false);
    });
  }

  // 资讯订阅提交
  @autobind
  advisorySub() {
    if (!this.submitCheck()) return;
    this.submitLoadiing(true);
    const { rowId } = this.props.empInfo;
    const {
      newSubProList,
      approverId,
      attachment,
    } = this.subBoard.getData();
    const {
      customer,
      remark,
    } = this.state;
    const params = {
      type: customer.custType,
      aprovaluser: approverId,
      custNum: customer.custEcom,
      custId: customer.id,
      createdBy: rowId,
      comments: remark,
      attachmentNum: attachment,
      item: newSubProList,
    };
    this.props.submitSub(params).then(() => {
      message.success('资讯订阅提交成功');
      const { modalKey, onClose, onRefreshList } = this.props;
      this.submitLoadiing(false);
      this.clearApprovalBoard();
      onClose(modalKey);
      onRefreshList();
    }, () => {
      message.error('资讯订阅提交失败');
      this.submitLoadiing(false);
    });
  }

  // 资讯退订提交
  @autobind
  advisoryUnSub() {
    if (!this.submitCheck()) return;
    this.submitLoadiing(true);
    const { rowId } = this.props.empInfo;
    const {
      newUnSubProList,
      approverId, // 审批人工号
      attachment, // 附件编号
    } = this.unSubBoard.getData();
    const {
      customer,
      remark,
    } = this.state;
    const unParams = {
      type: customer.custType,
      aprovaluser: approverId,
      custNum: customer.custEcom,
      custId: customer.id,
      createdBy: rowId,
      comments: remark,
      attachmentNum: attachment,
      item: newUnSubProList,
    };
    this.props.submitUnSub(unParams).then(() => {
      message.success('资讯退订提交成功');
      const { modalKey, onClose, onRefreshList } = this.props;
      this.submitLoadiing(false);
      this.clearApprovalBoard();
      onClose(modalKey);
      onRefreshList();
    }, () => {
      message.error('资讯退订提交失败');
      this.submitLoadiing(false);
    });
  }

  // 提交
  @autobind
  handleSubmitApprovals() {
    const judge = this.judgeSubtypeNow;
    if (judge(commadj.batch)) {
      this.batchSubmit();
    } else if (judge(commadj.single)) {
      this.singleSubmit();
    } else if (judge(commadj.subscribe)) {
      this.advisorySub();
    } else if (judge(commadj.unsubscribe)) {
      this.advisoryUnSub();
    }
  }

  // 选择申请子类型
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[1]',
    },
  })
  choiceApprovalSubType(name, key) {
    if (key === '') return;
    this.setState({
      approvalType: key,
      remark: '',
      customer: {},
    });
    this.clearRedux();
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 清除单佣金调整的数据
  @autobind
  clearSingleSelect() {
    this.singleBoard.resetData();
    this.setState({
      remark: '',
    });
  }

  // 清除咨询订阅的数据
  @autobind
  clearSubBoardSelect() {
    this.subBoard.resetData();
    this.setState({
      remark: '',
    });
  }

  // 清除咨询退订的数据
  @autobind
  clearUnSubBoardSelect() {
    this.unSubBoard.resetData();
    this.setState({
      remark: '',
    });
  }

  // 根据用户输入查询单佣金客户列表
  @autobind
  handleChangeSingleAssembly(keywords) {
    if (_.isEmpty(keywords)) {
      confirm({
        content: '请输入经纪客户号/客户名称',
      });
    } else {
      const { postnId, occDivnNum } = this.props.empInfo;
      this.props.querySingleCustList({
        keywords,
        postionId: postnId,
        deptCode: occDivnNum,
      });
    }
  }

  // 根据用户输入查询资讯订阅、资讯退订客户列表
  @autobind
  handleChangeSubscribeAssembly(keyword) {
    if (_.isEmpty(keyword)) {
      confirm({
        content: '请输入经纪客户号/客户名称',
      });
    } else {
      const { postnId, occDivnNum } = this.props.empInfo;
      this.props.querySubscribelCustList({
        keyword,
        postnId,
        deptId: occDivnNum,
      });
    }
  }

  // 查询资讯订阅调整产品
  @autobind
  querySubscribelProList(param) {
    this.props.getSubscribelProList(param);
  }
  // 查询资讯退订调整产品
  @autobind
  queryUnSubscribelProList(param) {
    this.props.getUnSubscribelProList(param);
  }

  // 单佣金、咨询订阅、退订基本信息选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].custName',
    },
  })
  handleSelectAssembly(customer) {
    this.setState({
      customer,
    });
    if (!_.isEmpty(customer)) {
      this.queryAfterSelectAssembly(customer);
    } else {
      this.clearBoardWhetherEmptyCustome();
    }
  }

  // 客户不为空时，各个子类型新建页面做对应处理
  @autobind
  queryAfterSelectAssembly(customer) {
    const typeNow = this.judgeSubtypeNow;
    const { id, custType } = customer;
    if (typeNow(commadj.subscribe)) {
      this.querySubscribelProList({
        custId: id,
        custType,
      });
    } else if (typeNow(commadj.unsubscribe)) {
      this.queryUnSubscribelProList({
        custRowId: id,
      });
    } else if (typeNow(commadj.single)) {
      this.props.getSingleOtherRates({
        custRowId: id,
      });
    }
  }

  // 客户为空时，各个子类型新建页面清空数据
  @autobind
  clearBoardWhetherEmptyCustome() {
    const typeNow = this.judgeSubtypeNow;
    if (typeNow(commadj.subscribe)) {
      this.clearSubBoardSelect();
    } else if (typeNow(commadj.unsubscribe)) {
      this.clearUnSubBoardSelect();
    } else if (typeNow(commadj.single)) {
      this.clearSingleSelect();
    }
  }

  // 根据职责权限进行子类型选项
  @autobind
  authorityOptions(subTypes) {
    return subTypes.map((item) => {
      const newItem = {};
      const { value } = item;
      if (value === commadj.batch) {
        newItem.show = permission.hasCommissionBatchAuthority();
      } else if (value === commadj.single) {
        const { empPostnList } = this.props;
        newItem.show = permission.hasCommissionSingleAuthority(empPostnList);
      } else if (value === commadj.subscribe) {
        newItem.show = permission.hasCommissionADSubscribeAuthority();
      } else if (value === commadj.unsubscribe) {
        newItem.show = permission.hasCommissionADUnSubscribeAuthority();
      }
      return {
        ...item,
        ...newItem,
      };
    });
  }

  // 判断当前登录人子类型权限,来决定初始化的时候展示的是哪一个子类型
  @autobind
  authorityEmp() {
    // 1. 首先判断当前登录人是否有单佣金调整的权限
    const { empPostnList } = this.props;
    const singlePermission = permission.hasCommissionSingleAuthority(empPostnList);
    const batchPermission = permission.hasCommissionBatchAuthority();
    const subscribePermission = permission.hasCommissionADSubscribeAuthority();
    const unsubscribePermission = permission.hasCommissionADUnSubscribeAuthority();
    if (singlePermission) return commadj.single;
    if (batchPermission) return commadj.batch;
    if (subscribePermission) return commadj.subscribe;
    if (unsubscribePermission) return commadj.unsubscribe;
    return commadj.noSelected;
  }

  // 批量内容组件
  // 由于组件被connect包装过所以需要使用getWrappedInstance获取真实的组件
  @autobind
  batchCreateBoardRef(input) {
    if (!input) return;
    this.batchBoard = input.getWrappedInstance();
  }

  // 单佣金内容组件
  // 由于组件被connect包装过所以需要使用getWrappedInstance获取真实的组件
  @autobind
  singleCreateBoardRef(input) {
    if (!input) return;
    this.singleBoard = input.getWrappedInstance();
  }

  // 咨讯订阅内容组件
  // 由于组件被connect包装过所以需要使用getWrappedInstance获取真实的组件
  @autobind
  subscriCreateBoardRef(input) {
    if (!input) return;
    this.subBoard = input.getWrappedInstance();
  }

  // 咨讯退订内容组件
  // 由于组件被connect包装过所以需要使用getWrappedInstance获取真实的组件
  @autobind
  unSubscriCreateBoardRef(input) {
    if (!input) return;
    this.unSubBoard = input.getWrappedInstance();
  }

  // 360订单流程 路由
  @autobind
  orderFlowRoute(cust) {
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-产品订单',
      // 能够跳转到FSP 客户360视图界面中的指定的局部tab项
      activeSubTab: ['产品订单', '订单流水'],
      // 必须要写上，否则，在360视图存在的情况下，再跳转到360视图时，360视图不会刷新，且React界面如果有弹框存在，不会消失
      forceRefresh: true,
    };
    const { push, getCustDetailInfo } = this.props;
    const { custEcom } = cust;
    // 请求 ptyId， custId， rowId 跳转到360的必须参数
    getCustDetailInfo({ brokerNumber: custEcom }).then(
      () => {
        const { custDetailInfo } = this.props;
        const { custType, ptyId, custId, rowId } = custDetailInfo || {};
        // pOrO代表个人客户，机构客户
        const type = (!custType || custType === PER_CODE) ? PER_CODE : ORG_CODE;
        const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`;
        openFspTab({
          routerAction: push,
          pathname: '/customerCenter/customerDetail',
          url,
          param,
        });
        // 关闭当前tab
        closeRctTab({ id: 'FSP_BUSINESS_APPLYMENT_COMMISSION' });
      },
    );
  }

  render() {
    const {
      modalKey,
      visible,
      singleCustList,
      subscribeCustList,
      onValidateSingleCust,
      singleCustVResult,
      onCheckSubsciCust,
      sciCheckCustomer,
      empInfo,
      otherRatios,
      singleOtherRatio,
      subscribelProList,
    } = this.props;
    const {
      approvalType,
      remark,
      customer,
      modalLoading, // 弹出层点击提交按钮后的页面loading
    } = this.state;

    const wrapClassName = this.judgeSubtypeNow(commadj.noSelected) ? 'commissionModal' : '';
    const subTypesAfterAuthority = this.authorityOptions(newSubTypes);

    return (
      <div>
        <CommonModal
          title="新建"
          modalKey={modalKey}
          needBtn
          maskClosable={false}
          modalLoading={modalLoading}
          size="large"
          visible={visible}
          closeModal={this.closeModal}
          okText="提交"
          showCancelBtn={false}
          onOk={this.handleSubmitApprovals}
          wrapClassName={wrapClassName}
        >
          <div className={styles.newApprovalBox}>
            {/* 基本信息 */}
            <div className={styles.approvalBlock}>
              <InfoTitle head="基本信息" />
              <CommissionLine label="子类型" labelWidth="90px" required>
                <Select
                  name="approvalType"
                  data={subTypesAfterAuthority}
                  value={approvalType}
                  onChange={this.choiceApprovalSubType}
                  width="300px"
                />
              </CommissionLine>
              {
                !this.judgeSubtypeNow([commadj.single]) ? null
                : (
                  <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                    <SelectAssembly
                      dataSource={singleCustList}
                      onSearchValue={this.handleChangeSingleAssembly}
                      onSelectValue={this.handleSelectAssembly}
                      onValidateCust={onValidateSingleCust}
                      validResult={singleCustVResult}
                      subType={commadj.single}
                      unfinishRoute={this.orderFlowRoute}
                    />
                  </CommissionLine>
                )
              }
              {
                // 资讯订阅
                !this.judgeSubtypeNow([commadj.subscribe]) ? null
                : (
                  <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                    <SelectAssembly
                      dataSource={subscribeCustList}
                      onSearchValue={this.handleChangeSubscribeAssembly}
                      onSelectValue={this.handleSelectAssembly}
                      onValidateCust={onCheckSubsciCust}
                      validResult={sciCheckCustomer}
                      subType={commadj.subscribe}
                    />
                  </CommissionLine>
                )
              }
              {
                !this.judgeSubtypeNow([commadj.unsubscribe]) ? null
                : (
                  <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                    <SelectAssembly
                      dataSource={subscribeCustList}
                      onSearchValue={this.handleChangeSubscribeAssembly}
                      onSelectValue={this.handleSelectAssembly}
                      subType={commadj.unsubscribe}
                      shouldeCheck={false}
                    />
                  </CommissionLine>
                )
              }
              {
                this.judgeSubtypeNow(commadj.noSelected) ? null
                : (
                  <CommissionLine label="备注" labelWidth="90px">
                    <TextArea
                      placeholder="备注内容"
                      value={remark}
                      onChange={this.handleChangeRemark}
                      style={{
                        fontSize: '14px',
                      }}
                    />
                  </CommissionLine>
                )
              }
            </div>
            {/* 批量佣金调整 */}
            {
              !this.judgeSubtypeNow(commadj.batch) ? null
              : (
                <BatchCreateBoard
                  otherRatios={otherRatios}
                  empInfo={empInfo}
                  ref={this.batchCreateBoardRef}
                />
              )
            }
            {/* 单佣金调整 */}
            {
              !this.judgeSubtypeNow(commadj.single) ? null
              : (
                <SingleCreatBoard
                  otherRations={singleOtherRatio}
                  customer={customer}
                  empInfo={empInfo}
                  ref={this.singleCreateBoardRef}
                />
              )
            }
            {/* 资讯订阅 */}
            {
              !this.judgeSubtypeNow(commadj.subscribe) ? null
              : (
                <SubscribeCreateBoard
                  customer={customer}
                  empInfo={empInfo}
                  subscribelProList={subscribelProList}
                  ref={this.subscriCreateBoardRef}
                />
              )
            }
            {/* 资讯退订 */}
            {
              !this.judgeSubtypeNow(commadj.unsubscribe) ? null
              : (
                <UnSubscribeCreateBoard
                  customer={customer}
                  empInfo={empInfo}
                  ref={this.unSubscriCreateBoardRef}
                />
              )
            }
          </div>
        </CommonModal>
      </div>
    );
  }
}
