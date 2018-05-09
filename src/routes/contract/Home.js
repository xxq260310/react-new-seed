/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2018-04-11 19:51:41
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import _ from 'lodash';

import contractHelper from '../../helper/page/contract';
import seibelHelper from '../../helper/page/seibel';
import { emp } from '../../helper';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/contract/Detail';
import ContractList from '../../components/common/appList';
import AppItem from '../../components/common/appList/AppItem';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/contract/EditForm';
import AddForm from '../../components/contract/AddForm';
import BottonGroup from '../../components/permission/BottonGroup';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import styles from './home.less';
import logable, { logPV } from '../../decorators/logable';

const confirm = Modal.confirm;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 退订的类型
const unsubscribe = '2';
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const { contract, contract: { pageType, subType, operationList, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
  // 列表请求状态
  // 获取列表数据进程
  seibleListLoading: state.loading.effects['app/getSeibleList'],
  // 查询客户
  customerList: state.app.customerList,
  // 查询右侧详情
  baseInfo: state.contract.baseInfo,
  baseInfoLoading: state.loading.effects['contract/getBaseInfo'],
  // 退订时查询详情
  unsubscribeBaseInfo: state.contract.unsubscribeBaseInfo,
  // 附件列表
  attachmentList: state.contract.attachmentList,
  // 新建/修改 客户列表
  canApplyCustList: state.app.canApplyCustList,
  // 合作合约编号列表
  contractNumList: state.contract.contractNumList,
  // 审批记录
  flowHistory: state.contract.flowHistory,
  // 新增合约条款-条款名称
  clauseNameList: state.contract.clauseNameList,
  // 新增合约条款-合作部门
  cooperDeparment: state.contract.cooperDeparment,
  // 列表请求状态  // 获取列表数据进程
  saveContractDataLoading: state.loading.effects['contract/saveContractData'],
  // 审批人
  flowStepInfo: state.contract.flowStepInfo,
  // 新建时的审批人
  addFlowStepInfo: state.contract.addFlowStepInfo,
  doApprove: state.contract.doApprove,
  // 审批进程
  postDoApproveLoading: state.loading.effects['contract/postDoApprove'],
  unsubFlowStepInfo: state.contract.unsubFlowStepInfo,
  // 登陆人信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getBaseInfo: fetchDataFunction(true, 'contract/getBaseInfo'),
  // 重置退订合约详情数据
  resetUnsubscribeDetail: fetchDataFunction(true, 'contract/resetUnsubscribeDetail'),
  // 获取附件列表
  getAttachmentList: fetchDataFunction(true, 'contract/getAttachmentList'),
  // 获取可申请客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 保存合作合约
  saveContractData: fetchDataFunction(true, 'contract/saveContractData'),
  // 合作合约退订
  contractUnSubscribe: fetchDataFunction(true, 'contract/contractUnSubscribe'),
  // 查询合作合约编号
  getContractNumList: fetchDataFunction(false, 'contract/getContractNumList'),
  // 查询条款名称列表
  getClauseNameList: fetchDataFunction(false, 'contract/getClauseNameList'),
  // 查询合作部门
  getCooperDeparmentList: fetchDataFunction(false, 'contract/getCooperDeparmentList'),
  // 获取审批人
  getFlowStepInfo: fetchDataFunction(true, 'contract/getFlowStepInfo'),
  // 审批接口
  postDoApprove: fetchDataFunction(true, 'contract/postDoApprove'),
  // 清除部门数据
  clearDepartmentData: fetchDataFunction(false, 'contract/clearDepartmentData'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Contract extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 查询左侧列表
    getSeibleList: PropTypes.func.isRequired,
    seibleList: PropTypes.object.isRequired,
    seibleListLoading: PropTypes.bool,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 查询可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object.isRequired,
    baseInfoLoading: PropTypes.bool,
    resetUnsubscribeDetail: PropTypes.func.isRequired,
    // 退订
    unsubscribeBaseInfo: PropTypes.object.isRequired,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 保存合作合约
    saveContractData: PropTypes.func.isRequired,
    // 保存合作合约请求状态
    saveContractDataLoading: PropTypes.bool,
    // 合作合约退订
    contractUnSubscribe: PropTypes.func.isRequired,
    // 查询合作合约编号
    getContractNumList: PropTypes.func.isRequired,
    contractNumList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 查询条款名称列表
    getClauseNameList: PropTypes.func.isRequired,
    clauseNameList: PropTypes.array.isRequired,
    // 查询合作部门
    getCooperDeparmentList: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
    clearDepartmentData: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    getFlowStepInfo: PropTypes.func.isRequired,
    // 新建时的审批人
    addFlowStepInfo: PropTypes.object,
    unsubFlowStepInfo: PropTypes.object,
    // 审批接口
    postDoApprove: PropTypes.func.isRequired,
    doApprove: PropTypes.object,
    postDoApproveLoading: PropTypes.bool,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    contractDetail: EMPTY_OBJECT,
    saveContractDataLoading: false,
    baseInfoLoading: false,
    postDoApproveLoading: false,
    flowStepInfo: EMPTY_OBJECT,
    addFlowStepInfo: EMPTY_OBJECT,
    unsubFlowStepInfo: EMPTY_OBJECT,
    doApprove: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮的列表项下标索引
      activeRowIndex: 0,
      isEmpty: true,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      createApprovalBoard: false,
      // 合作合约表单数据
      contractFormData: EMPTY_OBJECT,
      // 新建合作合约弹窗状态
      addFormModal: false,
      // 修改合作合约弹窗状态
      editFormModal: false,
      addFlowStepInfo: EMPTY_OBJECT,
      unsubFlowStepInfo: EMPTY_OBJECT,
      addOrEditSelfBtnGroup: '',
      // 是否有修改的权限
      hasEditPermission: false,
      // 审批人弹窗是否可见
      approverModal: false,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
      // 弹窗底部按钮数据
      footerBtnData: EMPTY_OBJECT,
      // 所选择的审批人
      selectApproveData: EMPTY_OBJECT,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
      // 临时审批人数据
      tempApproveData: EMPTY_OBJECT,
    };
  }

  componentWillMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
      getClauseNameList,
    } = this.props;
    this.queryAppList(query, pageNum, pageSize);
    getClauseNameList({});
  }

  componentWillReceiveProps(nextProps) {
    const {
      baseInfoLoading: preBIL,
      unsubFlowStepInfo: preUFSI,
      postDoApproveLoading: prePDA,
    } = this.props;
    const {
      baseInfo: nextBI,
      baseInfoLoading: nextBIL,
      addFlowStepInfo: nextAFSI,
      unsubFlowStepInfo: nextUFSI,
      postDoApproveLoading: nextPDA,
      empInfo,
    } = nextProps;

    if ((preBIL && !nextBIL)) {
      let hasEditPermission = false;
      hasEditPermission = contractHelper.hasPermission(empInfo);
      // 如果当前登陆人与详情里的审批人相等，并且状态是驳回时显示编辑按钮
      if (emp.getId() === nextBI.approver && nextBI.status === '04' && hasEditPermission) {
        hasEditPermission = true;
      } else {
        hasEditPermission = false;
      }
      // 新需求，将详情内的 修改 按钮拿掉，将修改触发的弹框变成了新的form界面（同文件夹内）。
      // 应要求，不需要拿掉修改按钮触发的弹框逻辑
      // hasEditPermission 控制详情内 修改 按钮是否显示
      this.setState({
        hasEditPermission: false,
      });
    }

    // 获取到新建订购时的按钮
    if (!_.isEmpty(nextAFSI)) {
      // 获取到 flowStepInfo
      this.setState({
        addFlowStepInfo: nextAFSI,
        addOrEditSelfBtnGroup: <BottonGroup
          list={nextAFSI}
          onEmitEvent={this.footerBtnHandle}
        />,
      });
    }
    // 获取到新建退订时的按钮
    if (!_.isEqual(preUFSI, nextUFSI)) {
      this.setState({
        unsubFlowStepInfo: nextUFSI,
        addOrEditSelfBtnGroup: <BottonGroup
          list={nextUFSI}
          onEmitEvent={this.footerBtnHandle}
        />,
      });
    }
    // postDoApprove 方法结束后，关闭所有弹窗，清空审批信息
    if (prePDA && !nextPDA) {
      this.setState({
        tempApproveData: EMPTY_OBJECT,
      });
      this.closeModal('approverModal');
      this.closeModal('addFormModal');
      this.closeModal('editFormModal');
    }
  }

  @autobind
  onOk(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  // 上传成功后回调
  @autobind
  onUploadComplete(formData) {
    this.setState({
      ...this.state,
      contractFormData: formData,
    });
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      replace,
      seibleList: list,
      getBaseInfo,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = list.page;
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
      } else {
        // 不存在currentId
        replace({
          pathname,
          query: {
            ...query,
            currentId: item.id,
            pageNum,
            pageSize,
          },
        });
        itemIndex = 0;
      }
      this.setState({
        activeRowIndex: itemIndex,
        addFormModal: false,
        editFormModal: false,
      });
      getBaseInfo({
        id: item.id,
      });
    }
  }

  // 根据传入的条款列表和Key返回分类后的二维数组
  @autobind
  getTwoDimensionClauseList(list, key) {
    const uniqedArr = _.uniqBy(list, key);
    const tmpArr1 = [];
    uniqedArr.forEach((v) => {
      const paraName = v[key];
      let tmpArr2 = [];
      list.forEach((sv) => {
        if (paraName === sv[key]) {
          tmpArr2.push(sv);
        }
      });
      tmpArr1.push(tmpArr2);
      tmpArr2 = [];
    });
    return tmpArr1;
  }

  @autobind
  queryAppList(query, pageNum = 1, pageSize = 20) {
    const { getSeibleList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getSeibleList({ ...params, type: pageType }).then(this.getRightDetail);
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // 根据子类型和客户查询合约编号
  @autobind
  handleSearchContractNum(data) {
    this.props.getContractNumList({ subType: data.subType, Type: '3', custId: data.client.cusId });
  }

  // 查询客户
  @autobind
  handleSearchCutList(value) {
    const { getCanApplyCustList } = this.props;
    getCanApplyCustList({
      keyword: value,
      // 合作合约查询可申请客户增加'type, subtype'字段写死在前端
      type: '03',
      subtype: '0301',
    });
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    this.props.getBaseInfo({
      type: 'unsubscribeDetail',
      id: '',
      flowId: data.flowId,
      operate: '2',
    });
  }

  // 接收AddForm数据
  @autobind
  handleChangeContractForm(formData) {
    this.setState({
      ...this.state,
      contractFormData: {
        ...this.state.contractFormData,
        ...formData,
      },
    });
  }

  // 根据关键词查询合作部门
  @autobind
  handleSearchCooperDeparment(keyword) {
    if (keyword) {
      this.props.getCooperDeparmentList({ name: keyword });
    }
  }

  // 判断合约有效期是否大于当前日期+5天
  @autobind
  isBiggerThanTodayAddFive(vailDt) {
    const vailDateHs = new Date(vailDt).getTime();
    const date = new Date();
    return vailDateHs > (date.getTime() + (86400000 * 5));
  }

  // 判断合约有效期是否大于开始日期
  @autobind
  isBiggerThanStartDate(contractFormData) {
    const startDate = new Date(contractFormData.startDt).getTime();
    const vailDate = new Date(contractFormData.vailDt).getTime();
    return startDate > vailDate;
  }

  // 检查每个每个部门只能选一种合约条款
  @autobind
  checkClauseIsUniqueness(list) {
    const tmpArr = this.getTwoDimensionClauseList(list, 'termsName');
    const tmpObj = {};
    let clauseStatus = true;
    tmpArr.forEach((v) => {
      v.forEach((sv) => {
        if (v.length > 1) {
          // paraName 为 条款字段
          if (tmpObj[sv.divIntegrationId]) {
            clauseStatus = false;
          } else {
            tmpObj[sv.divIntegrationId] = 1;
          }
        }
      });
    });
    return clauseStatus;
  }

  // 检查合约条款值是否合法
  @autobind
  checkClauseIsLegal(list) {
    const tmpArr = this.getTwoDimensionClauseList(list, 'paraName');
    let clauseStatus = true;
    for (let i = 0; i < tmpArr.length; i++) {
      if (tmpArr[i][0].paraDisplayName.indexOf('比例') > -1) {
        let result = 0;
        tmpArr[i].forEach((v) => {
          result += Number(v.paraVal);
        });
        if (+result !== 1) {
          clauseStatus = false;
          break;
        }
      }
    }
    return clauseStatus;
  }

  // 查询客户
  @autobind
  toSearchCust(value) {
    const { getCustomerList } = this.props;
    getCustomerList({
      keyword: value,
      type: pageType,
    });
  }

  // 头部新建按钮点击事件处理程序
  @autobind
  @logPV({ pathname: '/modal/createProtocol', title: '新建合作合约' })
  handleCreateBtnClick() {
    const { getFlowStepInfo, resetUnsubscribeDetail } = this.props;
    getFlowStepInfo({
      operate: 1,
      flowId: '',
    });
    this.showModal('addFormModal');
    // 每次打开弹窗的时候重置退订详情数据
    resetUnsubscribeDetail();
  }

  // 显示修改合作合约弹框
  @autobind
  handleShowEditForm() {
    this.setState({
      ...this.state,
      contractFormData: this.props.baseInfo,
    }, () => {
      this.showModal('editFormModal');
    });
  }

  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    // 可能需要清空 contractFormData--TODO
    this.setState({
      [modalKey]: false,
      contractFormData: modalKey === 'approverModal' ?
        this.state.contractFormData
      :
        EMPTY_OBJECT,
    }, () => {
      if (modalKey === 'addFormModal' && this.AddFormComponent) {
        this.AddFormComponent.handleReset();
      }
    });
  }

  // 弹窗底部按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].btnName' } })
  footerBtnHandle(btnItem) {
    const { unsubscribeBaseInfo } = this.props;
    const { editFormModal, contractFormData } = this.state;
    let payload = EMPTY_OBJECT;
    // 操作类型
    const operationType = contractFormData.workflowname;
    // 新建窗口时
    if (!editFormModal) {
      // 操作类型是退订时
      if (operationType === unsubscribe) {
        if (!contractFormData.subType) {
          message.error('请选择子类型');
          return;
        }
        if (!contractFormData.custName) {
          message.error('请选择客户');
          return;
        }
        if (!contractFormData.contractNum.flowId) {
          message.error('请选择合约编号');
          return;
        }
        payload = {
          ...unsubscribeBaseInfo,
          tduuid: contractFormData.tduuid || '',
          tdDescription: contractFormData.tdDescription || '',
        };
        // 数据判断完毕，请求接口
      } else {
        // 操作类型是订购时
        if (!contractFormData.subType) {
          message.error('请选择子类型');
          return;
        }
        if (!contractFormData.custName) {
          message.error('请选择客户');
          return;
        }
        if (!contractFormData.startDt) {
          message.error('请选择合约开始日期');
          return;
        }
        if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
          message.error('合约开始日期不能大于合约有效期');
          return;
        }
        if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
          message.error('合约有效期必须大于当前日期加5天');
          return;
        }
        if (!contractFormData.terms.length) {
          message.error('请添加合约条款');
          return;
        }
        if (!this.checkClauseIsLegal(contractFormData.terms)) {
          message.error('合约条款中比例明细参数的值加起来必须要等于1');
          return;
        }
        if (!this.checkClauseIsUniqueness(contractFormData.terms)) {
          message.error('合约条款中每个部门不能有相同的合约条款！');
          return;
        }
        payload = contractFormData;
        // 数据判断完毕，请求接口
      }
    } else {
      // 编辑窗口
      if (!contractFormData.startDt) {
        message.error('请选择合约开始日期');
        return;
      }
      if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
        message.error('合约开始日期不能大于合约有效期');
        return;
      }
      if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
        message.error('合约有效期必须大于当前日期加5天');
        return;
      }
      if (!contractFormData.terms.length) {
        message.error('请添加合约条款');
        return;
      }
      if (!this.checkClauseIsLegal(contractFormData.terms)) {
        message.error('合约条款中比例明细参数的值加起来必须要等于1');
        return;
      }
      if (!this.checkClauseIsUniqueness(contractFormData.terms)) {
        message.error('合约条款中每个部门不能有相同的合约条款！');
        return;
      }
      payload = contractFormData;
      // 数据判断完毕，请求接口
    }
    let tempApproveData = EMPTY_OBJECT;
    // 判断弹窗类型，生成不同数据--新建
    if (!editFormModal) {
      // 操作类型是退订时
      if (operationType === unsubscribe) {
        tempApproveData = {
          type: 'unsubscribe',
          flowId: contractFormData.contractNum.flowId,
          approverIdea: contractFormData.appraval || '',
          operate: '2',
        };
      } else {
        // 订购
        tempApproveData = {
          type: 'add',
          flowId: '',
          approverIdea: contractFormData.appraval || '',
          operate: '1',
        };
      }
    } else {
      // 编辑
      tempApproveData = {
        type: 'edit',
        flowId: contractFormData.flowid,
        approverIdea: contractFormData.appraval || '',
        operate: btnItem.operate || '',
      };
    }
    // item 不为空，并且 approverNum 不等于 'none'，
    // 需要选择审批人
    if (!_.isEmpty(btnItem) && btnItem.approverNum !== 'none') {
      const listData = btnItem.flowAuditors;
      const newApproverList = listData.map((item, index) => {
        const key = `${new Date().getTime()}-${index}`;
        return {
          empNo: item.login || '',
          empName: item.empName || '无',
          belowDept: item.occupation || '无',
          key,
        };
      });
      this.setState({
        flowAuditors: newApproverList,
        footerBtnData: btnItem,
        payload,
        tempApproveData,
      }, this.showModal('approverModal'));
    } else {
      // 不需要审批人
      // 设置审批人信息
      const selectApproveData = {
        approverName: btnItem.flowAuditors[0].empName,
        approverId: btnItem.flowAuditors[0].login,
      };
      // 设置按钮信息
      const footerBtnData = btnItem;
      const sendPayload = {
        payload,
        approveData: {
          ...tempApproveData,
          groupName: btnItem.nextGroupName,
          auditors: btnItem.flowAuditors[0].login,
        },
        selectApproveData,
        footerBtnData,
      };
      // 按钮是终止时，弹出确认框，确定之后调用接口
      if (btnItem.btnName === '终止') {
        const that = this;
        confirm({
          okText: '确定',
          cancelText: '取消',
          title: '确认要终止此任务吗?',
          content: '确认后，操作将不可取消。',
          onOk() {
            that.sendRequest(sendPayload);
          },
        });
      } else {
        this.sendRequest(sendPayload);
      }
    }
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    const { payload, footerBtnData, tempApproveData } = this.state;
    const selectApproveData = {
      approverName: approver.empName,
      approverId: approver.empNo,
    };
    const sendPayload = {
      payload,
      approveData: {
        ...tempApproveData,
        groupName: footerBtnData.nextGroupName,
        auditors: approver.empNo,
      },
      footerBtnData,
      selectApproveData,
    };
    this.sendRequest(sendPayload);
  }

  // 最终发出接口请求
  @autobind
  sendRequest(sendPayload) {
    const {
      saveContractData,
      location: { query },
    } = this.props;
    const payload = {
      ...sendPayload,
      currentQuery: query,
    };
    saveContractData(payload).then(
      () => {
        this.closeModal('addFormModal');
        this.queryAppList(query, query.pageNum, query.pageSize);
      },
    );
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...obj,
      },
    });
    // 2.调用queryApplicationList接口
    this.queryAppList({ ...query, ...obj }, 1, query.pageSize);
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '合作合约左侧列表项',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    const { id } = record;
    const {
      replace,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (currentId === String(id)) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    this.props.getBaseInfo({ id });
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
        pageSize: currentPageSize,
      },
    });
    this.queryAppList(query, nextPage, currentPageSize);
  }

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
    this.queryAppList(query, 1, changedPageSize);
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <AppItem
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="contract"
        type="kehu1"
        pageData={contract}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      customerList,
      baseInfo,
      attachmentList,
      flowHistory,
      canApplyCustList,
      contractNumList,
      flowStepInfo,
      addFlowStepInfo,
      getFlowStepInfo,
      empInfo,
      resetUnsubscribeDetail,
      clearDepartmentData,
    } = this.props;
    const {
      addFormModal,
      editFormModal,
      approverModal,
      addOrEditSelfBtnGroup,
      hasEditPermission,
      flowAuditors,
    } = this.state;
    const isEmpty = _.isEmpty(seibleList.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="contractPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        operateOptions={operationList}
        needOperate
        empInfo={empInfo}
        filterCallback={this.handleHeaderFilter}
      />
    );
    // 生成页码器，此页码器配置项与Antd的一致
    const { resultData = [], page = {} } = seibleList;
    const { location: { query: { pageNum = 1, pageSize = 20 } } } = this.props;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    const leftPanel = (
      <ContractList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );
    const rightPanel = (
      <Detail
        baseInfo={baseInfo}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
        hasEditPermission={hasEditPermission}
        showEditModal={this.handleShowEditForm}
      />
    );
    // 新建表单props
    const addFormProps = {
      // 合约编号
      onSearchContractNum: this.handleSearchContractNum,
      contractNumList,
      // 可申请客户列表
      onSearchCutList: this.handleSearchCutList,
      custList: canApplyCustList,
      // 基本信息
      onSearchContractDetail: this.handleSearchContractDetail,
      contractDetail: this.props.unsubscribeBaseInfo,
      // 表单变化
      onChangeForm: this.handleChangeContractForm,
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
      // 审批人
      flowStepInfo: addFlowStepInfo,
      // 获取审批人
      getFlowStepInfo,
      // 清空退订合作合约详情
      resetUnsubscribeDetail,
      // 清除合作部门
      clearDepartmentData,
    };
    const addFormModalProps = {
      modalKey: 'addFormModal',
      title: '新建合约申请',
      closeModal: this.closeModal,
      visible: addFormModal,
      size: 'large',
      // 底部按钮
      selfBtnGroup: addOrEditSelfBtnGroup,
    };
    // 修改表单props
    const contractDetail = {
      baseInfo,
      attachmentList,
      flowHistory,
    };
    const editFormProps = {
      custList: customerList,
      contractDetail,
      onSearchCutList: this.toSearchCust,
      onChangeForm: this.handleChangeContractForm,
      uploadAttachment: this.onUploadComplete,
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
      // 审批人相关信息
      flowStepInfo,
      // 清除合作部门
      clearDepartmentData,
    };
    const selfBtnGroup = (<BottonGroup
      list={flowStepInfo}
      onEmitEvent={this.footerBtnHandle}
    />);
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '修改合约申请',
      closeModal: this.closeModal,
      visible: editFormModal,
      size: 'large',
      selfBtnGroup,
    };
    return (
      <div className={styles.premissionbox} >
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="contractList"
        />
        {
          addFormModal ?
            <CommonModal {...addFormModalProps} >
              <AddForm
                {...addFormProps}
                ref={(AddFormComponent) => { this.AddFormComponent = AddFormComponent; }}
              />
            </CommonModal>
          :
            null
        }
        {
          editFormModal ?
            <CommonModal {...editFormModalProps}>
              <EditForm {...editFormProps} />
            </CommonModal>
          :
            null
        }
        {
          approverModal ?
            <ChoiceApproverBoard
              visible={approverModal}
              approverList={flowAuditors}
              onClose={() => this.closeModal('approverModal')}
              onOk={this.handleApproverModalOK}
            />
          :
            null
        }
      </div>
    );
  }
}
