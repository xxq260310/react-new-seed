/**
 * @description 佣金调整首页
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { routerRedux } from 'dva/router';

import confirm from '../../components/common/Confirm';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import Detail from '../../components/commissionAdjustment/Detail';
import SingleDetail from '../../components/commissionAdjustment/SingleDetail';
import AdvisoryDetail from '../../components/commissionAdjustment/AdvisoryDetail';
import ApprovalRecordBoard from '../../components/commissionAdjustment/ApprovalRecordBoard';
import CreateNewApprovalBoard from '../../components/commissionAdjustment/CreateNewApprovalBoard';
import CommissionHeader from '../../components/common/biz/ConnectedSeibelHeader';
import CommissionList from '../../components/common/appList';
import AppItem from '../../components/common/appList/AppItem';
import seibelHelper from '../../helper/page/seibel';
import { emp, permission } from '../../helper';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import './home.less';
import logable, { logPV } from '../../decorators/logable';

const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const { comsubs, commission, commission: { pageType, subType, status } } = seibelConfig;

const effects = {
  list: 'app/getSeibleList',
  detail: 'commission/getCommissionDetail',
  singleDetail: 'commission/getSingleDetail',
  subscribeDetail: 'commission/getSubscribeDetail',
  unsubDetail: 'commission/getUnSubscribeDetail',
  record: 'commission/getApprovalRecords',
  productList: 'commission/getProductList',
  applyCustList: 'commission/getCanApplyCustList',
  approver: 'commission/getAprovalUserList',
  validate: 'commission/validateCustInfo',
  submitBatch: 'commission/submitBatchCommission',
  submitSingle: 'commission/submitSingleCommission',
  batchgj: 'commission/getGJCommissionRate',
  singlegj: 'commission/getSingleGJCommissionRate',
  singleCustList: 'commission/getSingleCustList',
  subscribeCustList: 'commission/getSubscribelCustList',
  singleComOptions: 'commission/getSingleOtherCommissionOptions',
  singleProList: 'commission/getSingleComProductList',
  threeMatchInfo: 'commission/queryThreeMatchInfo',
  subscribelProList: 'commission/getSubscribelProList',
  unSubscribelProList: 'commission/getUnSubscribelProList',
  subSubscribe: 'commission/submitConsultSubscribe',
  unSubSubscribe: 'commission/submitConsultUnSubscribe',
  clearReduxState: 'commission/clearReduxState',
  singleCustValidate: 'commission/validateCustomerInSingle',
  onCheckSubsciCust: 'commission/validateCustomerInSub',
  custDetailInfo: 'commission/getCustDetailInfo',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // empInfo:
  empInfo: state.app.empInfo,
  // 左侧里诶包
  list: state.app.seibleList,
  // 获取列表数据进程
  listProcess: state.loading.effects[effects.list],
  // 可申请的客户列表
  canApplyCustList: state.commission.canApplyCustList,
  // 目标产品列表
  productList: state.commission.productList,
  // 审批人员列表
  approvalUserList: state.commission.approvalUserList,
  // 验证过程
  validataLoading: state.commission.validataLoading,
  // 验证结果描述
  validateResult: state.commission.validateResult,
  // 右侧批量佣金详情
  detail: state.commission.detail,
  // 右侧单佣金调整详情
  singleDetail: state.commission.singleDetail,
  // 右侧咨询订阅详情
  subscribeDetail: state.commission.subscribeDetail,
  // 右侧资讯退订详情
  unsubscribeDetail: state.commission.unsubscribeDetail,
  // 审批历史记录
  approvalRecord: state.commission.approvalRecord,
  // 查询审批记录进程
  recordLoading: state.commission.recordLoading,
  // 批量佣金调整申请提交后，返回的批量处理号
  batchnum: state.commission.batchnum,
  // 提交批量佣金申请调整的进程
  batchSubmitProcess: state.loading.effects[effects.submitBatch],
  // 提交资讯订阅申请调整的进程
  subsciSubmitProcess: state.loading.effects[effects.subSubscribe],
  // 提交资讯退订申请调整的进程
  unSubsciSubmitProcess: state.loading.effects[effects.unSubSubscribe],
  // 目标股基佣金率码值列表
  gjCommissionList: state.commission.gjCommission,
  // 单佣金调整佣金率码值列表
  singleGJCommission: state.commission.singleGJCommission,
  // 单佣金调整的其他佣金费率码值
  singleOtherRatio: state.commission.singleOtherCommissionOptions,
  // 单佣金调整页面客户查询列表
  singleCustomerList: state.commission.singleCustomerList,
  // 咨询订阅、咨询退订客户查询列表
  subscribeCustomerList: state.commission.subscribeCustomerList,
  // 单佣金调整可选产品列表
  singleComProductList: state.commission.singleComProductList,
  // 客户与产品的三匹配信息
  threeMatchInfo: state.commission.threeMatchInfo,
  // 新建资讯订阅可选产品列表
  subscribelProList: state.commission.subscribelProList,
  // 新建资讯订阅可选产品列表
  unSubscribelProList: state.commission.unSubscribelProList,
  // 单佣金调整申请结果
  singleSubmit: state.commission.singleSubmit,
  // 咨询订阅提交后返回的id
  consultSubId: state.commission.consultSubId,
  // 咨询退订提交后返回的id
  consultUnsubId: state.commission.consultUnsubId,
  // 单佣金调整客户检验返回数据
  singleCVR: state.commission.singleCustValidate,
  // 资讯订阅客户校验
  sciCheckCustomer: state.commission.sciCheckCustomer,
  custDetailInfo: state.commission.custDetailInfo,
});

const getDataFunction = (loading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading,
  forceFull,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  push: routerRedux.push,
  // 获取批量佣金调整List
  getCommissionList: getDataFunction(true, effects.list),
  // 获取批量佣金调整Detail
  getBatchCommissionDetail: getDataFunction(true, effects.detail),
  // 获取单佣金调整Detail
  getSingleDetail: getDataFunction(true, effects.singleDetail),
  // 获取咨询订阅详情Detail
  getSubscribeDetail: getDataFunction(true, effects.subscribeDetail),
  // 获取资讯退订详情Detail
  getUnSubscribeDetail: getDataFunction(true, effects.unsubDetail),
  // 获取用户审批记录
  getApprovalRecords: getDataFunction(false, effects.record),
  // 查询目标产品列表
  getProductList: getDataFunction(false, effects.productList),
  // 查询审批人员列表
  getAprovalUserList: getDataFunction(false, effects.approver),
  // 校验用户资格
  validateCustInfo: getDataFunction(false, effects.validate),
  // 通过关键字，查询可选的可申请用户列表
  getCanApplyCustList: getDataFunction(false, effects.applyCustList),
  // 提交批量佣金调整申请
  submitBatch: getDataFunction(false, effects.submitBatch),
  // 提交单佣金调整申请
  submitSingle: getDataFunction(false, effects.submitSingle),
  // 获取批量佣金目标股基佣金率
  getGJCommissionRate: getDataFunction(false, effects.batchgj),
  // 获取单佣金目标股基佣金率
  getSingleGJ: getDataFunction(false, effects.singlegj),
  // 获取单佣金调整中的其他佣金费率选项
  getSingleOtherRates: getDataFunction(false, effects.singleComOptions),
  // 查询单佣金调整页面客户列表
  getSingleCustList: getDataFunction(false, effects.singleCustList),
  // 资讯订阅、资讯退订客户列表
  getSubscribelCustList: getDataFunction(false, effects.subscribeCustList),
  // 获取单佣金调整中的可选产品列表
  getSingleProductList: getDataFunction(false, effects.singleProList),
  // 查询产品与客户的三匹配信息
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 获取新建资讯订阅可选产品列表
  getSubscribelProList: getDataFunction(false, effects.subscribelProList),
  // 获取新建资讯退订可选产品列表
  getUnSubscribelProList: getDataFunction(false, effects.unSubscribelProList),
  // 咨询订阅提交
  submitSub: getDataFunction(false, effects.subSubscribe),
  // 咨询退订提交
  submitUnSub: getDataFunction(false, effects.unSubSubscribe),
  // 清空redux保存的state
  clearReduxState: getDataFunction(false, effects.clearReduxState),
  // 单佣金调整客户校验
  singleCustValidate: getDataFunction(false, effects.singleCustValidate),
  // 资讯订阅调整客户校验
  onCheckSubsciCust: getDataFunction(false, effects.onCheckSubsciCust),
  // 获取客户详细信息
  getCustDetailInfo: getDataFunction(false, effects.custDetailInfo),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CommissionHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    validateCustInfo: PropTypes.func.isRequired,
    getCanApplyCustList: PropTypes.func.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    getCommissionList: PropTypes.func.isRequired,
    getBatchCommissionDetail: PropTypes.func.isRequired,
    getSubscribeDetail: PropTypes.func.isRequired,
    getUnSubscribeDetail: PropTypes.func.isRequired,
    getSingleDetail: PropTypes.func.isRequired,
    getApprovalRecords: PropTypes.func.isRequired,
    getSingleCustList: PropTypes.func.isRequired,
    getSubscribelCustList: PropTypes.func.isRequired,
    getProductList: PropTypes.func.isRequired,
    productList: PropTypes.array.isRequired,
    list: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    singleDetail: PropTypes.object.isRequired,
    subscribeDetail: PropTypes.object.isRequired,
    unsubscribeDetail: PropTypes.object.isRequired,
    approvalRecord: PropTypes.object.isRequired,
    recordLoading: PropTypes.bool.isRequired,
    listProcess: PropTypes.bool,
    batchSubmitProcess: PropTypes.bool,
    validataLoading: PropTypes.bool.isRequired,
    validateResult: PropTypes.string.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    batchnum: PropTypes.string.isRequired,
    submitBatch: PropTypes.func.isRequired,
    getGJCommissionRate: PropTypes.func.isRequired,
    gjCommissionList: PropTypes.array.isRequired,
    getSingleOtherRates: PropTypes.func.isRequired,
    singleOtherRatio: PropTypes.array.isRequired,
    getSingleProductList: PropTypes.func.isRequired,
    singleComProductList: PropTypes.array.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    singleCustomerList: PropTypes.array.isRequired,
    subscribeCustomerList: PropTypes.array.isRequired,
    getSubscribelProList: PropTypes.func.isRequired,
    getUnSubscribelProList: PropTypes.func.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    unSubscribelProList: PropTypes.array.isRequired,
    singleGJCommission: PropTypes.array.isRequired,
    getSingleGJ: PropTypes.func.isRequired,
    submitSingle: PropTypes.func.isRequired,
    singleSubmit: PropTypes.string.isRequired,
    submitSub: PropTypes.func.isRequired,
    consultSubId: PropTypes.string.isRequired,
    submitUnSub: PropTypes.func.isRequired,
    consultUnsubId: PropTypes.string.isRequired,
    clearReduxState: PropTypes.func.isRequired,
    singleCustValidate: PropTypes.func.isRequired,
    singleCVR: PropTypes.object.isRequired,
    subsciSubmitProcess: PropTypes.bool,
    unSubsciSubmitProcess: PropTypes.bool,
    onCheckSubsciCust: PropTypes.func.isRequired,
    sciCheckCustomer: PropTypes.object.isRequired,
    getCustDetailInfo: PropTypes.func.isRequired,
    custDetailInfo: PropTypes.object,
  }

  static defaultProps = {
    listProcess: false,
    batchSubmitProcess: false,
    subsciSubmitProcess: false,
    unSubsciSubmitProcess: false,
    custDetailInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSubtype: '',
      isEmpty: true,
      approvalBoard: false,
      createApprovalBoard: false,
      activeRowIndex: 0,
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
      replace,
      list,
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
      const { subType: st } = item;
      this.setState({
        currentSubtype: st,
        activeRowIndex: itemIndex,
      });
      this.getDetail4Subtye(item);
    }
  }

  // 查询佣金调整4个子类型的详情信息
  getDetail4Subtye(record) {
    const { subType: st, business1 } = record;
    const {
      getBatchCommissionDetail,
      getSubscribeDetail,
      getUnSubscribeDetail,
      getSingleDetail,
    } = this.props;
    const loginuser = emp.getId();
    switch (st) {
      case comsubs.batch:
        getBatchCommissionDetail({ batchNum: business1 });
        break;
      case comsubs.single:
        getSingleDetail({ orderId: business1, loginuser });
        break;
      case comsubs.subscribe:
        getSubscribeDetail({ orderId: business1, loginuser });
        break;
      case comsubs.unsubscribe:
        getUnSubscribeDetail({ orderId: business1, loginuser });
        break;
      default:
        break;
    }
  }

  // 点击查看的时候，弹出框需要的所点击的用户信息
  @autobind
  getApprovalBoardCustInfo(info) {
    const loginuser = emp.getId();
    this.props.getApprovalRecords({ ...info, loginuser }).then(this.openApprovalBoard);
  }

  /**
   * 根据子类型获取不同的Detail组件
   * @param  {string} st 子类型
   */
  @autobind
  getDetailComponentBySubType(st) {
    const {
      detail,
      location,
      subscribeDetail,
      unsubscribeDetail,
      singleDetail,
    } = this.props;
    let detailComponent = null;
    switch (st) {
      case comsubs.batch:
        detailComponent = (
          <Detail
            data={detail}
            location={location}
            checkApproval={this.getApprovalBoardCustInfo}
          />
        );
        break;
      case comsubs.single:
        detailComponent = (
          <SingleDetail
            data={singleDetail}
            location={location}
          />
        );
        break;
      case comsubs.subscribe:
        detailComponent = (
          <AdvisoryDetail
            name="资讯订阅"
            data={subscribeDetail}
            location={location}
          />
        );
        break;
      case comsubs.unsubscribe:
        detailComponent = (
          <AdvisoryDetail
            name="资讯退订"
            data={unsubscribeDetail}
            location={location}
          />
        );
        break;
      default:
        break;
    }
    return detailComponent;
  }

  @autobind
  queryAppList(query, pageNum = 1, pageSize = 20) {
    const { getCommissionList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getCommissionList({ ...params, type: pageType }).then(this.getRightDetail);
  }

  // 创建新的成功后，刷新页面列表
  @autobind
  refreshListAfterCreateSuccess() {
    const { location: { query } } = this.props;
    this.queryAppList(query);
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '佣金调整左侧列表项',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    const { id, subType: st } = record;
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
    this.setState({ currentSubtype: st, activeRowIndex: index });
    this.getDetail4Subtye(record);
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

  // 判断该登录人四个子类型是否有权限申请
  @autobind
  hasCreatApplyAuthority() {
    const {
      empInfo: { empPostnList },
    } = this.props;
    const {
      hasCommissionBatchAuthority: batchAuth,
      hasCommissionSingleAuthority: singleAuth,
      hasCommissionADSubscribeAuthority: subAuth,
      hasCommissionADUnSubscribeAuthority: unSubAuth,
    } = permission;
    return batchAuth() || singleAuth(empPostnList) || subAuth() || unSubAuth();
  }

  // 头部新建按钮点击事件处理程序
  @autobind
  @logPV({ pathname: '/modal/createProtocol', title: '新建佣金调整' })
  handleCreateBtnClick() {
    // TODO 此处需要新增一个判断，如果用户所有申请的权限都没有则提示不能点击新建
    if (this.hasCreatApplyAuthority()) {
      this.openCreateApprovalBoard();
    } else {
      confirm({
        content: '您目前无创建新服务申请的权限',
      });
    }
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

  // 打开审批记录弹出窗
  @autobind
  openApprovalBoard() {
    this.setState({
      approvalBoard: true,
    });
  }

  // 打开新建申请的弹出框
  @autobind
  openCreateApprovalBoard() {
    this.setState({
      createApprovalBoard: true,
    });
  }

  // 关闭审批记录弹出窗
  @autobind
  closeApprovalBoard() {
    this.setState({
      approvalBoard: false,
    });
  }

  // 关闭新建申请弹出层
  @autobind
  closeNewApprovalBoard() {
    this.setState({
      createApprovalBoard: false,
    });
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
        pageName="commission"
        type="yongjin"
        pageData={commission}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      list,
      approvalRecord,
      getSingleCustList,
      getSubscribelCustList,
      submitBatch,
      submitSub,
      submitUnSub,
      dict: { otherRatio },
      empInfo: { empInfo, empPostnList },
      getSingleOtherRates,
      singleOtherRatio,
      threeMatchInfo,
      queryThreeMatchInfo,
      singleCustomerList,
      subscribeCustomerList,
      getSubscribelProList,
      subscribelProList,
      getUnSubscribelProList,
      unSubscribelProList,
      submitSingle,
      singleSubmit,
      clearReduxState,
      singleCustValidate,
      singleCVR,
      onCheckSubsciCust,
      sciCheckCustomer,
      push,
      getCustDetailInfo,
      custDetailInfo,
    } = this.props;
    const isEmpty = _.isEmpty(list.resultData);
    // 此处需要提供一个方法给返回的接口查询设置是否查询到数据
    const { approvalBoard, createApprovalBoard, currentSubtype } = this.state;
    const topPanel = (
      <CommissionHeader
        location={location}
        replace={replace}
        page="commission"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        filterCallback={this.handleHeaderFilter}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 20 } } } = this.props;
    const { resultData = [], page = {} } = list;

    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    const leftPanel = (
      <CommissionList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );
    // TODO 此处需要根据不同的子类型使用不同的Detail组件
    const rightPanel = this.getDetailComponentBySubType(currentSubtype);

    return (
      <div className="feedbackbox">
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="feedbackList"
        />
        <ApprovalRecordBoard
          modalKey="approvalBoard"
          record={approvalRecord}
          visible={approvalBoard}
          onClose={this.closeApprovalBoard}
        />
        {
          !createApprovalBoard ? null
            : (
              <CreateNewApprovalBoard
                empInfo={empInfo}
                empPostnList={empPostnList}
                modalKey="createApprovalBoard"
                visible={createApprovalBoard}
                onClose={this.closeNewApprovalBoard}
                otherRatios={otherRatio}
                onBatchSubmit={submitBatch}
                getSingleOtherRates={getSingleOtherRates}
                singleOtherRatio={singleOtherRatio}
                threeMatchInfo={threeMatchInfo}
                queryThreeMatchInfo={queryThreeMatchInfo}
                querySingleCustList={getSingleCustList}
                querySubscribelCustList={getSubscribelCustList}
                singleCustList={singleCustomerList}
                subscribeCustList={subscribeCustomerList}
                getSubscribelProList={getSubscribelProList}
                subscribelProList={subscribelProList}
                getUnSubscribelProList={getUnSubscribelProList}
                unSubscribelProList={unSubscribelProList}
                onSubmitSingle={submitSingle}
                singleSubmit={singleSubmit}
                submitSub={submitSub}
                submitUnSub={submitUnSub}
                clearReduxState={clearReduxState}
                onValidateSingleCust={singleCustValidate}
                singleCustVResult={singleCVR}
                onCheckSubsciCust={onCheckSubsciCust}
                sciCheckCustomer={sciCheckCustomer}
                push={push}
                getCustDetailInfo={getCustDetailInfo}
                custDetailInfo={custDetailInfo}
                onRefreshList={this.refreshListAfterCreateSuccess}
              />
            )
        }
      </div>
    );
  }
}
