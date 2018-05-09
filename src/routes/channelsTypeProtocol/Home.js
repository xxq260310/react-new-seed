/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-11 19:36:22
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import _ from 'lodash';

import seibelHelper from '../../helper/page/seibel';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/channelsTypeProtocol/Detail';
import ArbitRageDetail from '../../components/channelsTypeProtocol/ArbitrageDetail';
import ChannelsTypeProtocolList from '../../components/common/appList';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import BottonGroup from '../../components/permission/BottonGroup';
import AppItem from '../../components/common/appList/AppItem';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import config from './config';
import { isInvolvePermission } from '../../components/channelsTypeProtocol/auth';
import styles from './home.less';
import logable, { logPV } from '../../decorators/logable';

const confirm = Modal.confirm;

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
// subType = '0501' 高速通道
const heightSpeed = '0501';
const {
  channelsTypeProtocol,
  channelsTypeProtocol: { pageType, subType, status, operationList },
} = seibelConfig;
const { subscribeArray, unSubscribeArray, tenHQ, tipsMap, protocolSubs, protocolSubTypes } = config;
const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});
const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
  // 列表请求状态
  seibleListLoading: state.loading.effects['app/getSeibleList'],
  // 查询客户
  canApplyCustList: state.app.canApplyCustList,
  // 查询右侧详情
  protocolDetail: state.channelsTypeProtocol.protocolDetail,
  protocolDetailLoading: state.loading.effects['channelsTypeProtocol/getProtocolDetail'],
  // 附件
  attachmentList: state.channelsTypeProtocol.attachmentList,
  // 审批记录
  flowHistory: state.channelsTypeProtocol.flowHistory,
  // 登陆人信息
  empInfo: state.app.empInfo,
  // 操作类型列表
  operationTypeList: state.channelsTypeProtocol.operationList,
  // 子类型列表
  subTypeList: state.channelsTypeProtocol.subTypeList,
  // 模板列表
  templateList: state.channelsTypeProtocol.templateList,
  // 业务类型列表
  businessTypeList: state.channelsTypeProtocol.businessTypeList,
  // 开通权限列表
  openPermissionList: state.channelsTypeProtocol.openPermissionList,
  // 模板对应协议条款列表
  protocolClauseList: state.channelsTypeProtocol.protocolClauseList,
  // 协议产品列表
  protocolProductList: state.channelsTypeProtocol.protocolProductList,
  underCustList: state.channelsTypeProtocol.underCustList,
  // 审批人
  flowStepInfo: state.channelsTypeProtocol.flowStepInfo,
  // 保存成功后返回itemId,提交审批流程所需
  itemId: state.channelsTypeProtocol.itemId,
  // 协议 ID 列表
  protocolList: state.channelsTypeProtocol.protocolList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList', true),
  // 获取客户列表
  getCanApplyCustList: fetchDataFunction(true, 'app/getCanApplyCustList', true),
  // 获取右侧详情
  getProtocolDetail: fetchDataFunction(true, 'channelsTypeProtocol/getProtocolDetail', true),
  // 查询操作类型/子类型/模板列表
  queryTypeVaules: fetchDataFunction(true, 'channelsTypeProtocol/queryTypeVaules', true),
  // 根据所选模板id查询模板对应协议条款
  queryChannelProtocolItem: fetchDataFunction(true, 'channelsTypeProtocol/queryChannelProtocolItem', true),
  // 查询协议产品列表
  queryChannelProtocolProduct: fetchDataFunction(true, 'channelsTypeProtocol/queryChannelProtocolProduct', true),
  // 保存详情
  saveProtocolData: fetchDataFunction(true, 'channelsTypeProtocol/saveProtocolData', true),
  // 查询客户
  queryCust: fetchDataFunction(true, 'channelsTypeProtocol/queryCust', true),
  // 清除协议产品列表
  clearPropsData: fetchDataFunction(false, 'channelsTypeProtocol/clearPropsData'),
  // 获取审批人
  getFlowStepInfo: fetchDataFunction(true, 'channelsTypeProtocol/getFlowStepInfo', true),
  // 提交审批流程
  doApprove: fetchDataFunction(true, 'channelsTypeProtocol/doApprove', true),
  // 验证客户
  getCustValidate: fetchDataFunction(true, 'channelsTypeProtocol/getCustValidate', true),
  // 查询协议 ID 列表
  queryProtocolList: fetchDataFunction(true, 'channelsTypeProtocol/queryProtocolList', true),
  // 清除详情数据
  clearDetailData: fetchDataFunction(true, 'channelsTypeProtocol/clearDetailData'),
  // 筛选协议模板
  filterTemplate: fetchDataFunction(false, 'channelsTypeProtocol/filterTemplate'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class ChannelsTypeProtocol extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 查询左侧列表
    getSeibleList: PropTypes.func.isRequired,
    seibleList: PropTypes.object.isRequired,
    seibleListLoading: PropTypes.bool,
    // 查询可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getProtocolDetail: PropTypes.func.isRequired,
    protocolDetail: PropTypes.object.isRequired,
    // 附件
    attachmentList: PropTypes.array,
    // 审批记录
    flowHistory: PropTypes.array,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
    // 查询操作类型/子类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationTypeList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    templateList: PropTypes.array.isRequired,
    businessTypeList: PropTypes.array.isRequired,
    openPermissionList: PropTypes.array.isRequired,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    protocolClauseList: PropTypes.array.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    protocolProductList: PropTypes.array.isRequired,
    // 保存详情
    saveProtocolData: PropTypes.func.isRequired,
    // 保存成功后返回itemId,提交审批流程所需
    itemId: PropTypes.string.isRequired,
    // 下挂客户接口
    queryCust: PropTypes.func.isRequired,
    // 下挂客户列表
    underCustList: PropTypes.array,
    // 清除props数据
    clearPropsData: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    getFlowStepInfo: PropTypes.func.isRequired,
    // 提交审批流程
    doApprove: PropTypes.func.isRequired,
    // 验证客户
    getCustValidate: PropTypes.func.isRequired,
    // 协议 ID 列表接口
    queryProtocolList: PropTypes.func.isRequired,
    // 协议 ID 列表
    protocolList: PropTypes.array,
    // 清除详情数据
    clearDetailData: PropTypes.func.isRequired,
    // 筛选协议模板
    filterTemplate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    underCustList: EMPTY_LIST,
    flowStepInfo: EMPTY_OBJECT,
    protocolList: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 新建编辑弹窗状态
      editFormModal: false,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
      // 选择审批人弹窗状态
      approverModal: false,
      // 需要提交的数据
      protocolData: EMPTY_OBJECT,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
      activeRowIndex: 0,
      currentView: '',
    };
  }

  componentDidMount() {
    const {
      location: {
        query,
      query: {
          pageNum,
        pageSize,
        },
      },
    } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      getProtocolDetail,
      seibleList: list,
      location: { query: { currentId } },
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      // console.log('subType--->', subType);
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      const { subType: st } = item;
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
        this.setState({ activeRowIndex: itemIndex });
        getProtocolDetail({
          needAttachment: true,
          needFlowHistory: true,
          data: {
            id: currentId,
            subType: st,
          },
        });
      } else {
        // 不存在currentId
        itemIndex = 0;
        getProtocolDetail({
          needAttachment: true,
          needFlowHistory: true,
          data: {
            id: item.id,
            subType: st,
          },
        });
      }
      this.setState({
        activeRowIndex: itemIndex,
        currentView: st,
      });
    }
  }

  @autobind
  queryAppList(query, pageNum = 1, pageSize = 20) {
    const { getSeibleList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getSeibleList({ ...params, type: pageType }).then(this.getRightDetail);
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

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '通道类型协议左侧列表项',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    const { id, subType: st } = record;
    const {
      replace,
      location: { pathname, query, query: { currentId } },
      getProtocolDetail,
    } = this.props;
    if (currentId === String(id)) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    // 更新
    this.setState({
      currentView: st,
      activeRowIndex: index,
    });
    getProtocolDetail({
      needAttachment: true,
      needFlowHistory: true,
      data: {
        id,
        subType: st,
      },
    });
  }

  // 查询客户
  @autobind
  handleSearchCutList(param) {
    const { getCanApplyCustList } = this.props;
    getCanApplyCustList(param);
  }

  // 头部新建按钮点击事件处理程序
  @autobind
  @logPV({ pathname: '/modal/createProtocol', title: '新建通道协议' })
  handleCreateBtnClick() {
    this.showModal('editFormModal');
  }

  // 判断当前是否套利软件
  @autobind
  isArbirageSoftware(st) {
    return protocolSubTypes.arbitrageSoft === st;
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
    this.setState({
      [modalKey]: false,
    });
  }

  // 检查保存数据是否合法
  @autobind
  checkFormDataIsLegal(formData) {
    // 如果操作类型是退订并且协议模版是十档行情，不进行验证
    if (formData.templateId === tenHQ &&
      _.includes(unSubscribeArray, formData.operationType)) {
      return true;
    }
    if (!formData.subType) {
      message.error('请选择子类型');
      return false;
    }
    if (!formData.operationType) {
      message.error('请选择操作类型');
      return false;
    }
    if (!formData.custId) {
      message.error('请选择客户');
      return false;
    }
    if (!formData.templateId) {
      message.error('请选择协议模板');
      return false;
    }
    if (this.isArbirageSoftware(formData.subType)) {
      // 针对套利软件的特有数据进行校验
      if (!formData.softBusinessType) {
        message.error('请选择业务类型');
        return false;
      }
      // 如果涉及权限，还得判断是否有开通权限
      if (isInvolvePermission(formData.softBusinessType)) {
        if (_.isEmpty(formData.softPermission)) {
          message.error('请选择开通权限');
          return false;
        }
      }
    } else {
      // 这两个校验是针对非套利软件子类型的数据
      if (!formData.item.length) {
        message.error('请选择协议产品');
        return false;
      }
      if (!_.includes(subscribeArray, formData.operationType)) {
        if (!formData.agreementNum) {
          message.error('请选择协议编号');
          return false;
        }
      }
    }
    if (formData.content && formData.content.length > 120) {
      message.error('备注字段长度不能超过120');
      return false;
    }
    return true;
  }

  // 点击提交按钮弹提示框
  @autobind
  showconFirm(formData, btnItem) {
    if (
      (_.includes(unSubscribeArray, formData.operationType)
      || _.includes(subscribeArray, formData.operationType))
      && !this.isArbirageSoftware(formData.subType)
    ) {
      confirm({
        okText: '确定',
        cancelText: '取消',
        title: '提示',
        content: tipsMap[formData.operationType],
        onOk: () => {
          this.setState({
            ...this.state,
            approverModal: true,
            flowAuditors: btnItem.flowAuditors,
            protocolData: formData,
          });
        },
        onCancel: () => {
          console.log('Cancel');
        },
      });
    } else {
      this.setState({
        ...this.state,
        approverModal: true,
        flowAuditors: btnItem.flowAuditors,
        protocolData: formData,
      });
    }
  }

  // 审批人弹窗点击确定
  @autobind
  handleApproverModalOK(auth) {
    const { saveProtocolData, doApprove } = this.props;
    const { location: { query } } = this.props;
    const { protocolData } = this.state;
    saveProtocolData(protocolData).then(
      () => {
        const operate = config.doApproveOperate[protocolData.subType];
        doApprove({
          formData: {
            itemId: this.props.itemId,
            flowId: '',
            auditors: auth.empNo,
            groupName: auth.groupName,
            operate,
            approverIdea: '',
          },
        }).then(() => {
          this.closeModal('editFormModal');
          this.closeModal('approverModal');
          this.queryAppList(query, query.pageNum, query.pageSize);
        });
      },
    );
  }

  // 根据当前子类型相应不同的详情组件
  @autobind
  getProtocolDetailComponent(st) {
    const {
      protocolDetail,
      attachmentList,
      flowHistory,
    } = this.props;
    const { currentView } = this.state;
    if (st === protocolSubs.arbitrage) {
      return (
        <ArbitRageDetail
          protocolDetail={protocolDetail}
          attachmentList={attachmentList}
          flowHistory={flowHistory}
        />
      );
    }
    // 其他情况返回通用的详情组件，高速通道、紫金快车道
    return (
      <Detail
        protocolDetail={protocolDetail}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
        currentView={currentView}
      />
    );
  }
  // 弹窗底部按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].btnName' } })
  footerBtnHandle(btnItem) {
    const formData = this.EditFormComponent.getData();
    // 对formData校验
    if (this.checkFormDataIsLegal(formData)) {
      const { attachment } = formData;
      const newAttachment = [];
      for (let i = 0; i < attachment.length; i++) {
        const item = attachment[i];
        if (item.length <= 0 && item.required) {
          message.error(`${item.title}附件为必传项`);
          return;
        }
        newAttachment.push({
          uuid: item.uuid,
          attachmentType: item.title,
          attachmentComments: '',
        });
      }
      _.remove(newAttachment, o => _.isEmpty(o.uuid));
      const payload = {
        ...formData,
        attachment: newAttachment,
      };
      // 弹出提示窗
      this.showconFirm(payload, btnItem);
    }
  }
  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    // 判断不同的视图，icon图标不一致
    const { subType: viewType } = record;
    const typeIcon = viewType === heightSpeed ? 'yongjin' : 'kehu1';
    return (
      <AppItem
        key={record.id}
        data={record}
        onClick={this.handleListRowClick}
        index={index}
        pageName="channelsTypeProtocol"
        type={typeIcon}
        pageData={channelsTypeProtocol}
        active={index === activeRowIndex}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      attachmentList,
      // flowHistory,
      empInfo,
      getCanApplyCustList, // 查询可申请客户列表
      canApplyCustList, // 可申请客户列表
      queryTypeVaules, // 查询操作类型/子类型/模板列表
      operationTypeList, // 操作类型列表
      subTypeList, // 子类型列表
      templateList, // 模板列表
      businessTypeList, // 业务类型
      openPermissionList, // 开通权限列表
      protocolDetail, // 协议详情
      queryChannelProtocolItem, // 根据所选模板id查询模板对应协议条款
      protocolClauseList, // 所选模板对应协议条款列表
      queryChannelProtocolProduct, // 查询协议产品列表
      protocolProductList, // 协议产品列表
      saveProtocolData,  // 保存详情
      underCustList,  // 下挂客户列表
      queryCust,  // 请求下挂客户接口
      clearPropsData, // 清除props数据
      flowStepInfo, // 审批人列表
      getCustValidate,  // 验证客户接口
      location: { query: { pageNum = 1, pageSize = 20 } },
      seibleList: { page = {} },
      queryProtocolList,  // 查询协议 ID 列表
      protocolList,  // 协议 ID 列表
      getProtocolDetail,  // 查询协议详情
      getFlowStepInfo,  // 查询审批人
      clearDetailData,  // 清除详情数据
      filterTemplate, // 筛选协议模板
    } = this.props;
    const {
      editFormModal,
      approverModal,
      flowAuditors,
      currentView,
    } = this.state;
    const isEmpty = _.isEmpty(seibleList.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="channelsTypeProtocolPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        operateOptions={operationList}
        empInfo={empInfo}
        needOperate
        filterCallback={this.handleHeaderFilter}
      />
    );
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };
    const leftPanel = (
      <ChannelsTypeProtocolList
        list={seibleList.resultData || []}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );
    const rightPanel = this.getProtocolDetailComponent(currentView);
    const selfBtnGroup = (<BottonGroup
      list={flowStepInfo}
      onEmitEvent={this.footerBtnHandle}
    />);
    // editForm 需要的 props
    const editFormProps = {
      location,
      // 客户列表
      canApplyCustList,
      // 查询客户
      onSearchCutList: getCanApplyCustList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 操作类型列表
      operationTypeList,
      // 子类型列表
      subTypeList,
      // 协议模板列表
      templateList,
      // 业务类型列表
      businessTypeList,
      // 开通权限列表
      openPermissionList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
      // 协议详情 - 编辑时传入
      protocolDetail,
      // 查询协议详情
      getProtocolDetail,
      // 查询协议产品列表
      queryChannelProtocolProduct,
      // 协议产品列表
      protocolProductList,
      // 保存详情
      saveProtocolData,
      // 下挂客户
      underCustList,
      // 下挂客户接口
      onQueryCust: queryCust,
      // 清除props数据
      clearPropsData,
      // 验证客户
      getCustValidate,
      // 查询协议 ID 列表
      queryProtocolList,
      // 协议 ID 列表
      protocolList,
      // 附件列表
      attachmentList,
      getFlowStepInfo,
      clearDetailData,
      filterTemplate,
    };
    // editFormModal 需要的 props
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '新建协议管理',
      closeModal: this.closeModal,
      visible: editFormModal,
      size: 'large',
      selfBtnGroup,
      // 子元素
      children: <EditForm
        {...editFormProps}
        ref={(ref) => { this.EditFormComponent = ref; }}
      />,
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
          editFormModal ?
            <CommonModal {...editFormModalProps} />
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
