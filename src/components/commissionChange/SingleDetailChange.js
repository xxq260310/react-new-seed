/**
 * @Author: sunweibin
 * @Date: 2017-11-01 18:37:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-22 17:54:20
 * @description 单佣金调整驳回后修改页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, message } from 'antd';
import _ from 'lodash';

import confirm from '../common/Confirm';
import DisabledSelect from './DisabledSelect';
import RejectButtons from './RejectButtons';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonUpload from '../common/biz/CommonUpload';
import AutoComplete from '../common/AutoComplete';
import CommissionLine from '../commissionAdjustment/CommissionLine';
import Transfer from '../common/biz/TableTransfer';
import ThreeMatchTip from '../commissionAdjustment/ThreeMatchTip';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import OtherCommissionSelectList from '../commissionAdjustment/OtherCommissionSelectList';
import { seibelConfig } from '../../config';
import {
  pagination,
  singleColumns,
} from '../commissionAdjustment/commissionTransferHelper/transferPropsHelper';
import { allCommissionParamName as otherComs } from '../../config/otherCommissionDictionary';
import logable, { logPV } from '../../decorators/logable';

import styles from './change.less';

const { TextArea } = Input;
const { comsubs: commadj } = seibelConfig;

export default class SingleDetailChange extends PureComponent {
  static propTypes = {
    flowCode: PropTypes.string.isRequired,
    detailLoading: PropTypes.bool.isRequired,
    detail: PropTypes.object.isRequired,
    singleGJ: PropTypes.array.isRequired,
    optionalList: PropTypes.array.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    otherRate: PropTypes.array.isRequired,
    onQueryDetail: PropTypes.func.isRequired,
    onQueryGJ: PropTypes.func.isRequired,
    onQueryProductList: PropTypes.func.isRequired,
    onQuery3Match: PropTypes.func.isRequired,
    onQueryOtherRate: PropTypes.func.isRequired,
    onQueryBtns: PropTypes.func.isRequired,
    approvalBtns: PropTypes.array.isRequired,
    submitResult: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUpdateFlow: PropTypes.func.isRequired,
    clearReduxState: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    // TODO state里面的初始值，使用detail里面的字段值
    this.state = {
      btnDisabled: false,
      remark: '',
      newCommission: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
      otherComReset: new Date().getTime(), // 用来判断是否重置
      userBaseCommission: {}, // 用户选择的其他佣金费率;
      singleProductMatchInfo: [], // 单佣金调整选择的产品的三匹配信息
      singleProductList: [], // 单佣金调整选择的产品列表
      singleDValue: 0, // 产品差值
    };
  }

  componentDidMount() {
    const { flowCode } = this.props;
    this.props.onQueryDetail({
      flowCode,
    });
    // 获取当前驳回后修改的审批按钮
    this.props.onQueryBtns({
      flowId: flowCode,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { detailLoading: prevDL } = this.props;
    const { detailLoading: nextDL } = nextProps;
    if (prevDL && !nextDL) {
      const { detail: { base } } = nextProps;
      // 表示初始化将detail的数据获取完毕
      const {
        newCommission,
        comments,
        attachmentNum,
        item,
      } = base;
      // 过滤掉action为删除的
      const filterList = _.filter(item, product => product.action !== '删除');
      const userBaseCommission = this.pickUserOtherCommission();
      // 初始化将父产品的三匹配信息提取出来并保存
      const initMatchs = filterList.map((p) => {
        const { riskRankMhrt, investProdMhrt, investTypeMhrt, prodCode, isMatch } = p;
        const matchInfo = {
          productCode: prodCode,
          riskMatch: riskRankMhrt,
          prodMatch: investProdMhrt,
          termMatch: investTypeMhrt,
          isMatch,
        };
        return matchInfo;
      });
      this.setState({
        newCommission,
        remark: comments,
        attachment: attachmentNum,
        singleProductList: filterList,
        singleProductMatchInfo: _.cloneDeep(initMatchs),
        ...userBaseCommission,
      });
    }
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 客户修改的目标估计佣金率来查询码值列表
  @autobind
  changeTargetGJCommission(v) {
    const { customer } = this.props.detail;
    this.props.onQueryGJ({
      custId: customer.id,
      commision: v,
    });
  }

  // 切换目标产品股基佣金率
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '目标股基佣金率',
      value: '$args[0].codeValue',
    },
  })
  selectTargetGJCommission(v) {
    this.setState({
      newCommission: v.codeValue,
    });
    const { customer: { id } } = this.props.detail; // 取出客户的row_id
    this.props.onQueryProductList({
      custRowId: id,
      commRate: v.codeValue,
    });
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
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

  // 选择审批人弹出层按确认键
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  @autobind
  mergeChildrenProduct(original, merged) {
    const productCodeList = merged.map(o => o.prodCode);
    return original.map((child) => {
      // 判断child在不在productCodeList中
      // TODO 此处需要进行一个判断就是有些子产品是默认选中的，用户可以取消勾选
      const { prodCode, xDefaultOpenFlag } = child;
      if (_.includes(productCodeList, prodCode)) {
        return {
          ...child,
          xDefaultOpenFlag: 'Y',
        };
      }
      if (xDefaultOpenFlag === 'Y') {
        // 表示该子产品默认勾选,此时代表该子产品已经被用户取消勾选了
        return {
          ...child,
          xDefaultOpenFlag: 'N',
        };
      }
      return child;
    });
  }

  // 将原始数据与用户选择的数据进行合并
  @autobind
  mergeOrigianl2User(original, user) {
    // original和user为含有相同父产品的产品数组
    // 合并的目的在于将original中的相关子产品的xDefaultOpenFlag设为true
    return original.map((product) => {
      const { children, ...resetInfo } = product;
      const newProduct = resetInfo;
      if (!_.isEmpty(children)) {
        // 存在子产品列表
        // 找到user中的相关产品
        const userRelativeProd = _.find(user, p => p.prodCode === product.prodCode);
        // 判断有无子产品
        const userChildren = (userRelativeProd && userRelativeProd.subItem) || [];
        newProduct.children = this.mergeChildrenProduct(children, userChildren);
      }
      return newProduct;
    });
  }

  // 根据可选产品列表和用户选择的列表进行比对
  // 生成Transfer左右两侧需要的数组
  @autobind
  makeTransferNeedData(list, selectedList) {
    // 用户选择的产品列表信息,此处需要先删除里面action为删除的产品,该种产品不显示到左侧列表中去
    const userProList = _.filter(selectedList, product => product.action !== '删除');
    const userProdCodeList = userProList.map(p => p.prodCode);
    // 将原始数据中的数据根据用户选择的数据的父产品进行比对，选出用户添加的原始数据，以及没有选择的数据
    // 用户选择的原始数据
    const userSelectOriginalList = _.filter(list,
      product => _.includes(userProdCodeList, product.prodCode));
    // 左侧列表
    const userOptionalList = _.filter(list,
      product => !_.includes(userProdCodeList, product.prodCode));
    // 将用户选择的原始数据和用户选择的数据进行比对，生成右侧列表项
    const rightList = this.mergeOrigianl2User(userSelectOriginalList, userProList);
    return {
      first: userOptionalList,
      second: rightList,
    };
  }

  // 挑选出用户选择的其他佣金费率的值
  @autobind
  pickUserOtherCommission() {
    const { detail: { base } } = this.props;
    return _.pick(base, otherComs);
  }

  @autobind
  clearRedux() {
    // 清空redux的state
    this.props.clearReduxState({
      clearList: [
        { name: 'singleOtherCommissionOptions' },
        { name: 'singleComProductList' },
        { name: 'threeMatchInfo', value: {} },
        { name: 'singleDetailToChange', value: {} },
        { name: 'singleGJCommission' },
        { name: 'approvalBtns' },
        { name: 'approvalUserList' },
        { name: 'singleSubmit', value: '' },
      ],
    });
  }

  // 关闭弹出框后，清空页面数据
  @autobind
  clearApprovalBoard() {
    this.setState({
      remark: '',
      approverName: '',
      approverId: '',
      otherComReset: new Date().getTime(),
      customer: {},
      attachment: '',
      singleProductList: [],
      singleDValue: 0,
      singleProductMatchInfo: [],
      newCommission: '',
    });
    this.clearRedux();
  }

  // 提交前检查各项输入的值是否符合要求
  @autobind
  submitCheck() {
    let result = true;
    const { singleDValue, approverId } = this.state;
    if (singleDValue !== 0) {
      result = false;
      confirm({
        content: '请确保所选产品佣金率与目标股基佣金率一致',
      });
    }
    if (_.isEmpty(approverId)) {
      message.error('审批人员不能为空');
      result = false;
    }
    return result;
  }

  // 修改单佣金父产品参数
  @autobind
  updateParamsProduct(product, matchInfos) {
    const { prodCode, prodName, prodRate } = product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
    const { productCode, ...resetMatchInfo } = matchInfo;
    return {
      prodCode,
      aliasName: prodName,
      prodCommission: prodRate,
      ...resetMatchInfo,
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
      // 此处有aliasName为:没经过穿梭框处理前的详情数据
      // 此处没有aliasName,经过穿梭框处理过的数据，
      const { aliasName } = item;
      if (_.isEmpty(aliasName)) {
        const { children } = item;
        const product = this.updateParamsProduct(item, matchInfos);
        if (!_.isEmpty(children)) {
          product.subProductVO = children.map(this.updateParamChildProduct);
        }
        return product;
      }
      // 表示初始化的数据
      const { subItem } = item;
      const needPickKey = ['prodMatch', 'isMatch', 'riskMatch', 'termMatch', 'aliasName', 'prodCode', 'prodCommission'];
      const anotherProduct = _.pick(item, needPickKey);
      if (!_.isEmpty(subItem)) {
        anotherProduct.subProductVO = _.cloneDeep(subItem);
      }
      return anotherProduct;
    });
  }

  @autobind
  afterLauncher() {
    this.setState({
      btnDisabled: true,
    });
  }

  // 发起流程
  @autobind
  launchFlow(flowBtn, idea) {
    const { base: { flowCode } } = this.props.detail;
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
    this.props.onUpdateFlow(commParam).then(this.afterLauncher);
  }

  // 单佣金调整提交
  @autobind
  singleSubmit(flowBtn) {
    if (!this.submitCheck()) return;
    const {
      remark,
      newCommission,
      approverId,
      attachment,
      singleProductList,
      singleProductMatchInfo,
    } = this.state;
    const otherCommissions = _.pick(this.state, otherComs);
    const productList = this.pickSingleProductList(singleProductList, singleProductMatchInfo);
    const { customer, base: { orderId } } = this.props.detail;
    const params = {
      orderId,
      custRowId: customer.id,
      custType: customer.custType,
      newComm: newCommission,
      comments: remark,
      attachmentNum: attachment,
      aprovaluser: approverId,
      productInfo: productList,
      ...otherCommissions,
    };
    this.props.onSubmit(params).then(() => this.launchFlow(flowBtn, '重新申请'));
  }

  // 点击页面的按钮事件处理
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$args[0].btnName' } })
  handleRejctBtnClick(btn) {
    const { operate } = btn;
    if (operate === 'commit' || operate === 'trueOver') {
      // 提交按钮
      this.singleSubmit(btn);
    }
    if (operate === 'falseOver') {
      // 终止按钮
      this.launchFlow(btn, '终止申请');
    }
  }

  @autobind
  merge3MatchInfo(info) {
    const { riskRankMhrt, investProdMhrt, investTypeMhrt, productCode, isMatch } = info;
    const matchInfo = {
      productCode,
      riskMatch: riskRankMhrt,
      prodMatch: investProdMhrt,
      termMatch: investTypeMhrt,
      isMatch,
    };
    const { singleProductMatchInfo } = this.state;
    const exsit = _.findIndex(singleProductMatchInfo, o => o.productCode === productCode) > -1;
    if (!exsit) {
      this.setState({
        singleProductMatchInfo: [matchInfo, ...singleProductMatchInfo],
      });
    }
  }

  // 单佣金调整穿梭变化的时候处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '单佣金产品',
    },
  })
  handleSingleTransferChange(flag, item, array, dValue) {
    this.setState({
      singleProductList: array,
      singleDValue: dValue,
    });
    if (flag === 'add') {
      // 如果是左侧列表添加到右侧列表,则需要查询三匹配信息
      const { prodCode } = item;
      const { customer } = this.props.detail;
      this.props.onQuery3Match({
        custRowId: customer.id,
        custType: customer.custType,
        prdCode: prodCode,
      }).then(() => this.merge3MatchInfo(this.props.threeMatchInfo));
    }
  }

  // 单佣金调整选择子产品的时候的处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '单佣金通过check选择子产品',
    },
  })
  handleSingleTransferSubProductCheck(item, array) {
    this.setState({
      singleProductList: array,
    });
  }

  // 选择其他佣金比率
  @autobind
  changeOtherCommission(name, value) {
    this.setState({
      [name]: value,
    });
  }

  // 将提交按钮中的审批人列表提取出来
  @autobind
  pickApprovalUserListInFlowBtns() {
    const { approvalBtns } = this.props;
    // 为了防止接口传递的数据不存在做容错处理
    const commitBtn = _.filter(approvalBtns, btn => _.includes(['commit', 'trueOver'], btn.operate))[0];
    const list = (commitBtn && commitBtn.flowAuditors) || [];
    // 转化list的格式
    return list.map((item) => {
      const { empName, login, occupation } = item;
      return {
        empNo: login,
        belowDept: occupation,
        empName,
      };
    });
  }

  render() {
    const { detail, approvalBtns } = this.props;
    if (_.isEmpty(detail.base) || _.isEmpty(approvalBtns)) {
      return null;
    }
    const { customer, attachmentList } = detail;
    const { item, attachmentNum } = detail.base;
    const {
      newCommission,
      remark,
      choiceApprover,
      approverName,
      approverId,
      otherComReset,
      btnDisabled,
      singleProductList,
      singleProductMatchInfo,
    } = this.state;
    const {
      singleGJ,
      optionalList,
      otherRate,
    } = this.props;
    // 将提交按钮中的审批人列表提取出来
    const approvalList = this.pickApprovalUserListInFlowBtns();
    // 1. 针对用户选择的单佣金调整的申请中添加的item产品列表
    const transferData = this.makeTransferNeedData(optionalList, item);
    // 单佣金调整中的产品选择配置
    const singleTransferProps = {
      firstTitle: '可选佣金产品',
      secondTitle: '已选产品',
      firstData: transferData.first,
      secondData: transferData.second,
      firstColumns: singleColumns,
      secondColumns: singleColumns,
      transferChange: this.handleSingleTransferChange,
      checkChange: this.handleSingleTransferSubProductCheck,
      rowKey: 'id',
      defaultCheckKey: 'xDefaultOpenFlag',
      placeholder: '产品代码/产品名称',
      pagination,
      aboutRate: [newCommission, 'prodRate'],
      supportSearchKey: [['prodCode'], ['prodName']],
      totalData: optionalList,
    };

    // 用户选择的其他佣金率的值
    const userBaseCommission = this.pickUserOtherCommission();

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
    // 客户当前股基佣金率
    const newCurrentCom = _.isNull(customer.currentCommission) ? '--' : customer.currentCommission;

    return (
      <div className={styles.rejectContainer}>
        <div className={styles.newApprovalBox}>
          <div className={styles.approvalBlock}>
            <InfoTitle head="基本信息" />
            <CommissionLine label="子类型" labelWidth="90px" required>
              <DisabledSelect text="佣金调整" />
            </CommissionLine>
            <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
              <DisabledSelect text={`${customer.custName}(${customer.custEcom})-${customer.riskLevelLabel}`} />
            </CommissionLine>
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
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="佣金产品选择" />
            <ul className={styles.commissionUlBox}>
              <li className={styles.leftCurrentCom}>
                <InfoItem label="当前股基佣金率" value={newCurrentCom} width="110px" valueColor="#9b9b9b" />
              </li>
              <li className={styles.rightTargetCom}>
                <CommissionLine
                  label="目标股基佣金率"
                  labelWidth="110px"
                  needInputBox={false}
                  extra={
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#9b9b9b',
                        lineHeight: '26px',
                        paddingLeft: '4px',
                      }}
                    >
                      ‰
                    </span>
                  }
                >
                  <AutoComplete
                    initValue={newCommission}
                    dataSource={singleGJ}
                    onChangeValue={this.changeTargetGJCommission}
                    onSelectValue={this.selectTargetGJCommission}
                    width="100px"
                  />
                </CommissionLine>
              </li>
            </ul>
            <Transfer {...singleTransferProps} />
            <ThreeMatchTip info={singleProductMatchInfo} userList={singleProductList} />
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="其他佣金费率" />
            <OtherCommissionSelectList
              showTip
              reset={otherComReset}
              otherRatios={otherRate}
              onChange={this.changeOtherCommission}
              custOpenRzrq={customer.openRzrq}
              subType={commadj.single}
              baseCommission={userBaseCommission}
            />
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="附件信息" />
            <CommonUpload {...uploadProps} />
          </div>
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
        </div>
        <RejectButtons
          disabled={btnDisabled}
          btnList={approvalBtns}
          onClick={this.handleRejctBtnClick}
        />
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={approvalList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}
