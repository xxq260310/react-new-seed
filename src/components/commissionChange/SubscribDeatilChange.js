/**
 * @file components/commissionChange/SubscribDeatilChange.js
 * @description 资讯订阅驳回再修改页面
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
import ThreeMatchTip from '../../components/commissionAdjustment/ThreeMatchTip';
import {
  pagination,
  subScribeProColumns,
} from '../../components/commissionAdjustment/commissionTransferHelper/transferPropsHelper';
import logable, { logPV } from '../../decorators/logable';

import styles from './change.less';

const { TextArea } = Input;

export default class SubscribeDetailToChange extends PureComponent {
  static propTypes = {
    empInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    // 订阅详情
    getSubscribeDetailToChange: PropTypes.func.isRequired,
    subscribeDetailToChange: PropTypes.object.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 新建资讯订阅提交接口
    submitSub: PropTypes.func.isRequired,
    // 修改资讯订阅提交后返回值
    consultSubId: PropTypes.string.isRequired,
    // 根据接口返回的操作按钮
    approvalBtns: PropTypes.array.isRequired,
    onQueryBtns: PropTypes.func.isRequired,
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
      custLists: [],
      attachment: '',
      subProSubList: [], // 资讯订阅产品列表
      subscribelProductMatchInfo: [], // 资讯订阅的产品的三匹配信息
      canShowAppover: false, // 新建资讯订阅和退订时是否需要选择审批人
      btnDisabled: false,
      buttonList: [],
    };
  }

  componentDidMount() {
    const { location: { query: { flowId } } } = this.props;
    this.props.getSubscribeDetailToChange({ flowId });
    // 获取当前驳回后修改的审批按钮
    this.props.onQueryBtns({
      flowId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { subscribeDetailToChange: preDetail } = this.props;
    const { subscribeDetailToChange: nextDetail } = nextProps;
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
      const initMatchs = item.map((p) => {
        const { riskMatch, prodMatch, termMatch, prodCode, approvalFlg } = p;
        const matchInfo = {
          productCode: prodCode,
          riskMatch,
          prodMatch,
          termMatch,
          approvalFlg,
        };
        return matchInfo;
      });
      this.setState({
        remark: comments,
        attachment: attachmentNum,
        subProSubList: item,
        subscribelProductMatchInfo: _.cloneDeep(initMatchs),
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
  afterLauncher() {
    message.success('提交成功');
    this.setState({
      btnDisabled: true,
    });
  }

  // 发起流程
  @autobind
  launchFlow(flowBtn, idea) {
    const { base: { flowCode } } = this.props.subscribeDetailToChange;
    const { nextGroupName, operate, flowAuditors } = flowBtn;
    const { approverId } = this.state;
    // 根据按钮不同传递不同参数
    const commParam = {
      flowId: flowCode,
      groupName: nextGroupName,
      approverIdea: idea,
      operate,
    };
    if (operate === 'commit' || operate === 'trueOver') {
      commParam.auditors = approverId;
    } else {
      commParam.auditors = flowAuditors[0].login;
    }
    this.props.onUpdateFlow(commParam).then(this.afterLauncher, () => message.success('流程发起失败'));
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
      custLists: [],
      customer: {},
      attachment: '',
      subProSubList: [], // 资讯订阅产品列表
      subscribelProductMatchInfo: [], // 资讯订阅的产品的三匹配信息
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
      subProSubList: array,
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
    if (flag === 'add') {
      // 如果是左侧列表添加到右侧列表,则需要查询三匹配信息
      const { prodCode } = item;
      const {
        subscribeDetailToChange: {
          subscribeCustList,
        },
      } = this.props;
      const { id, custType } = subscribeCustList;
      this.props.queryThreeMatchInfo({
        custRowId: id,
        custType,
        prdCode: prodCode,
      }).then(this.merge3MatchSubInfo);
    }
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
      subProSubList: array,
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

  // 重组资讯订阅可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const newSubscribel = this.changeSubscriProList(product);
      return newSubscribel;
    });
    return newSubscriProList;
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


  // 重组资讯订阅已选产品List
  @autobind
  choiceSubProList(selectedList, preProList) {
    const userProList = _.filter(selectedList, product => product.action !== '删除');
    const userProdCodeList = userProList.map(p => p.prodCode);
    const userSelectOriginalList = _.filter(preProList,
      product => _.includes(userProdCodeList, product.prodCode));
    const rightList = this.mergeOrigianl2User(userSelectOriginalList, userProList);
    return rightList;
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

  // 选中的资讯订阅父产品数据结构改为提交所需
  @autobind
  changeSubmitscriProList(product, matchInfos) {
    const {
      prodCode,
      prodName,
      approvalFlg,
    } = product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
    return {
      prodCode,
      aliasName: prodName,
      approvalFlg,
      ...matchInfo,
    };
  }

  // 选中的资讯订阅、退订子产品数据结构改为提交所需
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

  // 将选中的资讯订阅产品数据结构改为提交所需
  @autobind
  changeSubmitSubProList(list, matchInfos) {
    const newSubmitSubscriProList = list.map((product) => {
      // 此处有aliasName为:没经过穿梭框处理前的详情数据
      // 此处没有aliasName,经过穿梭框处理过的数据，
      const { aliasName } = product;
      if (_.isEmpty(aliasName)) {
        const { children } = product;
        const productList = this.changeSubmitscriProList(product, matchInfos);
        if (!_.isEmpty(children)) {
          productList.subItem = children.map(this.changeSubmitSubscriProChildren);
        }
        return productList;
      }
      // 表示初始化的数据
      const { subItem } = product;
      const needPickKey = ['riskMatch', 'prodMatch', 'termMatch', 'aliasName', 'prodCode', 'aliasName', 'agrType'];
      const anotherProduct = _.pick(product, needPickKey);
      anotherProduct.approvalFlg = product.approveFlag;
      if (!_.isEmpty(subItem)) {
        anotherProduct.subItem = _.cloneDeep(subItem);
      }
      return anotherProduct;
    });
    return newSubmitSubscriProList;
  }

// 提交前检查各项输入的值是否符合要求
  @autobind
  submitCheck() {
    const { approverId, canShowAppover, subProSubList } = this.state;
    let result = true;
    if (_.isEmpty(approverId) && canShowAppover) {
      message.error('审批人员不能为空');
      result = false;
    }
    if (_.isEmpty(subProSubList)) {
      message.error('资讯产品列表不能为空');
      return false;
    }
    return result;
  }

  // 资讯订阅提交修改
  @autobind
  handleSubmit(flowBtn) {
    if (!this.submitCheck()) return;
    const { empNum } = this.props.empInfo;
    const {
      subscribeDetailToChange: {
        base,
        subscribeCustList,
      },
    } = this.props;
    const { workFlowNumber, orderId } = base;
    const {
      remark,
      subProSubList,
      subscribelProductMatchInfo,
      approverId, // 审批人工号
      attachment, // 附件编号
    } = this.state;
    const newSubProList = this.changeSubmitSubProList(
      subProSubList,
      subscribelProductMatchInfo,
    );
    const params = {
      type: subscribeCustList.custType,
      aprovaluser: approverId,
      custNum: subscribeCustList.custEcom,
      custId: subscribeCustList.id,
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
      this.props.submitSub(params).then(() => this.launchFlow(flowBtn, '重新申请'),
        () => message.success('修改失败'));
      // this.props.submitSub(params).then(() => message.success('提交成功'));
    }
    if (operate === 'trueOver') {
      // 提交
      this.props.submitSub(params).then(this.afterLauncher, () => message.success('修改失败'));
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
      subscribeDetailToChange: {
        base,
        attachmentList,
        subscribeCustList,
        subProList,
        approvList,
      },
    } = this.props;
    if (_.isEmpty(base)) return null;
    if (_.isEmpty(subscribeCustList)) return null;
    const { riskLevelLabel } = subscribeCustList;
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
    const newSubscriProList = this.createSubscribelProList(subProList);
    const choiceSubscribelProList = this.choiceSubProList(choiceProList, newSubscriProList);
    const newSubscribelProList = this.filterProList(choiceSubscribelProList, newSubscriProList);
    const {
      choiceApprover,
      approverName,
      approverId,
      remark,
      btnDisabled,
      canShowAppover,
      buttonList,
      subProSubList,
      subscribelProductMatchInfo,
    } = this.state;

    // 资讯订阅中的产品选择配置
    const subScribetransferProps = {
      firstTitle: '可选服务',
      secondTitle: '已选服务',
      firstData: newSubscribelProList,
      secondData: choiceSubscribelProList,
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
              <DisabledSelect text="资讯订阅" />
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
            <Transfer {...subScribetransferProps} />
          </div>
          <ThreeMatchTip info={subscribelProductMatchInfo} userList={subProSubList} />
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
