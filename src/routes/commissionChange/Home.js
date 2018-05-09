/**
 * @file routes/commissionChange/Home.js
 * @description 佣金调整、资讯订阅、资讯退订驳回再修改页面
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
// import _ from 'lodash';

import SubscribDeatilChange from '../../components/commissionChange/SubscribDeatilChange';
import UnSubscribDeatilChange from '../../components/commissionChange/UnSubscribDeatilChange';
import SingleDetailChange from '../../components/commissionChange/SingleDetailChange';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { env, dom } from '../../helper';
import styles from './home.less';

const effects = {
  // 咨讯订阅驳回待修改的详情
  subDetail: 'commissionChange/getSubscribeDetailToChange',
  // 修改页面产品与客户的三匹配信息
  threeMatchInfo: 'commissionChange/queryThreeMatchInfo',
  // 修改页面获取审批人员列表
  approver: 'commissionChange/getAprovalUserList',
  // 修改页面咨讯订阅提交
  subSubscribe: 'commissionChange/submitConsultSubscribe',
  // 查询驳回后单佣金调整的详情
  singleDetail: 'commissionChange/getSingleDetailToChange',
  // 获取驳回后单佣金调整的目标股基佣金率码值表
  gjRate: 'commissionChange/getSingleGJCommissionRate',
  // 获取驳回后单佣金调整的可选产品列表
  singleProductList: 'commissionChange/getSingleComProductList',
  // 获取驳回后单佣金调整的原始其他佣金率选项
  otherRate: 'commissionChange/getSingleOtherCommissionOptions',
  // 获取驳回后单佣金调整的客户信息
  singleCustomer: 'commissionChange/getSingleCustList',
  // 驳回后页面的按钮
  btns: 'commissionChange/queryApprovalBtns',
  // 单佣金提交
  singleSubmit: 'commissionChange/submitSingleCommission',
  // 更新流程
  updateFlow: 'commissionChange/updateFlowStatus',
  // 咨讯退订驳回待修改详情
  unSubDetail: 'commissionChange/getUnSubscribeDetailToChange',
  // 咨讯退订提交
  unSubComit: 'commissionChange/submitConsultUnSubscribe',
  clearReduxState: 'commissionChange/clearReduxState',
};

const mapStateToProps = state => ({
  // empInfo:
  empInfo: state.app.empInfo,
  subDetail: state.commissionChange.subscribeDetailToChange,
  threeMatchInfo: state.commissionChange.threeMatchInfo,
  // 咨讯订阅提交后返回的id
  consultSubId: state.commissionChange.consultSubId,
  // 审批人员列表
  approvalUserList: state.commissionChange.approvalUserList,
  // 驳回后修改的单佣金
  singleDetail: state.commissionChange.singleDetailToChange,
  // 驳回后修改的目标股基佣金率码值列表
  singleGJ: state.commissionChange.singleGJCommission,
  // 驳回后修改的单佣金调整的可选佣金产品列表(里面包含了已经选中的)
  singleComProductList: state.commissionChange.singleComProductList,
  // 驳回后修改的单佣金调整的其他佣金率选项
  singleOtherRate: state.commissionChange.singleOtherCommissionOptions,
  // 驳回后修改的单佣金调整的客户信息
  singleCustomer: state.commissionChange.singleCustomerList,
  // 获取驳回后单佣金调整详情数据的Loading
  singleDetailLoading: state.loading.effects[effects.singleDetail],
  // 驳回后修改页面的按钮列表
  approvalBtns: state.commissionChange.approvalBtns,
  // 驳回后修改提交成功提示
  singleSubmit: state.commissionChange.singleSubmit,
  // 咨讯退订详情
  unSubDetail: state.commissionChange.unsubscribeDetailToChange,
  // 咨讯退订提交后返回的id
  consultUnSubId: state.commissionChange.consultUnsubId,
});

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});


const mapDispatchToProps = {
  // 获取咨讯订阅详情Detail
  getSubscribeDetail: getDataFunction(true, effects.subDetail),
  // 查询审批人员列表
  getAprovalUserList: getDataFunction(false, effects.approver),
  // 三匹配
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 咨讯订阅提交
  submitSub: getDataFunction(true, effects.subSubscribe),
  // 获取驳回后修改的单佣金调整详情
  querySingleDetail: getDataFunction(false, effects.singleDetail),
  // 获取驳回后修改的单佣金调整中的目标股基佣金率码值列表
  querySingleGj: getDataFunction(false, effects.gjRate),
  // 获取驳回后修改的单佣金调整中的可选佣金产品列表
  querySingleProductList: getDataFunction(false, effects.singleProductList),
  // 获取驳回后修改的单佣金调整的原始其他佣金率选项
  queryOtherRate: getDataFunction(false, effects.otherRate),
  // 获取驳回后的单佣金调整的客户信息
  querySingleCustomer: getDataFunction(false, effects.singleCustomer),
  // 获取驳回后的按钮列表
  queryApprovalBtns: getDataFunction(false, effects.btns),
  // 提交单佣金
  updateSingle: getDataFunction(true, effects.singleSubmit),
  // 更新流程
  updateFlow: getDataFunction(true, effects.updateFlow),
  getUnSubscribeDetail: getDataFunction(true, effects.unSubDetail),
  // 咨讯退订驳回后修改页面提交
  submitUnSub: getDataFunction(true, effects.unSubComit),
  clearReduxState: getDataFunction(false, effects.clearReduxState),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectionAndAmendment extends PureComponent {
  static propTypes = {
    // 公共
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    // 咨讯订阅修改相关
    subDetail: PropTypes.object.isRequired,
    consultSubId: PropTypes.string.isRequired,
    getSubscribeDetail: PropTypes.func.isRequired,
    submitSub: PropTypes.func.isRequired,
    // 驳回后修改单佣金调整相关
    singleDetailLoading: PropTypes.bool,
    singleDetail: PropTypes.object.isRequired,
    querySingleDetail: PropTypes.func.isRequired,
    querySingleGj: PropTypes.func.isRequired,
    // 目标股基佣金率码值列表
    singleGJ: PropTypes.array.isRequired,
    // 驳回后修改的单佣金调整中可选的佣金产品列表
    singleComProductList: PropTypes.array.isRequired,
    querySingleProductList: PropTypes.func.isRequired,
    // 驳回后的单佣金调整的其他佣金率选项
    queryOtherRate: PropTypes.func.isRequired,
    singleOtherRate: PropTypes.array.isRequired,
    // 驳回后的单佣金调整的客户信息
    singleCustomer: PropTypes.object.isRequired,
    querySingleCustomer: PropTypes.func.isRequired,
    // 驳回后页面按钮
    queryApprovalBtns: PropTypes.func.isRequired,
    approvalBtns: PropTypes.array.isRequired,
    // 单佣金调整提交后的结果
    singleSubmit: PropTypes.string.isRequired,
    updateSingle: PropTypes.func.isRequired,
    updateFlow: PropTypes.func.isRequired,
    // 驳回后修改咨讯退订相关
    unSubDetail: PropTypes.object.isRequired,
    consultUnSubId: PropTypes.string.isRequired,
    getUnSubscribeDetail: PropTypes.func.isRequired,
    submitUnSub: PropTypes.func.isRequired,
    clearReduxState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    singleDetailLoading: false,
  }

  componentDidMount() {
    this.setHomeHeight();
  }

  @autobind
  setHomeHeight() {
    // 判断是否在fsp系统
    let height = dom.getCssStyle(document.documentElement, 'height');
    if (env.isInFsp()) {
      height = `${Number.parseInt(height, 10) - 55}px`;
    }
    this.changeHome.style.height = height;
  }

  @autobind
  changeHomeRef(input) {
    this.changeHome = input;
  }

  // 判断当前是哪个驳回修改页面
  @autobind
  judgeSubtypeNow() {
    const { location: { query: { type, flowId } } } = this.props;
    if (type === 'SINGLE') {
      // 单佣金
      const {
        singleDetailLoading,
        singleDetail,
        singleGJ,
        singleComProductList,
        querySingleDetail,
        querySingleGj,
        querySingleProductList,
        threeMatchInfo,
        queryThreeMatchInfo,
        queryOtherRate,
        singleOtherRate,
        queryApprovalBtns,
        approvalBtns,
        singleSubmit,
        updateSingle,
        updateFlow,
        clearReduxState,
      } = this.props;
      return (
        <SingleDetailChange
          flowCode={flowId}
          detail={singleDetail}
          detailLoading={singleDetailLoading}
          singleGJ={singleGJ}
          optionalList={singleComProductList}
          threeMatchInfo={threeMatchInfo}
          otherRate={singleOtherRate}
          onQueryDetail={querySingleDetail}
          onQueryGJ={querySingleGj}
          onQueryProductList={querySingleProductList}
          onQuery3Match={queryThreeMatchInfo}
          onQueryOtherRate={queryOtherRate}
          onQueryBtns={queryApprovalBtns}
          approvalBtns={approvalBtns}
          submitResult={singleSubmit}
          onSubmit={updateSingle}
          onUpdateFlow={updateFlow}
          clearReduxState={clearReduxState}
        />
      );
    } else if (type === 'SUBSCRIBE') {
      // 咨讯订阅
      const {
        location,
        empInfo,
        subDetail,
        threeMatchInfo,
        getSubscribeDetail,
        consultSubId,
        queryThreeMatchInfo,
        submitSub,
        approvalBtns,
        queryApprovalBtns,
        updateFlow,
      } = this.props;
      return (
        <SubscribDeatilChange
          location={location}
          empInfo={empInfo}
          subscribeDetailToChange={subDetail}
          getSubscribeDetailToChange={getSubscribeDetail}
          threeMatchInfo={threeMatchInfo}
          queryThreeMatchInfo={queryThreeMatchInfo}
          consultSubId={consultSubId}
          approvalBtns={approvalBtns}
          submitSub={submitSub}
          onQueryBtns={queryApprovalBtns}
          onUpdateFlow={updateFlow}
        />
      );
    } else if (type === 'UNSUBSCRIBE') {
      // 咨讯退订
      const {
        location,
        empInfo,
        unSubDetail,
        consultUnSubId,
        getUnSubscribeDetail,
        submitUnSub,
        approvalBtns,
        queryApprovalBtns,
        updateFlow,
      } = this.props;
      return (
        <UnSubscribDeatilChange
          location={location}
          empInfo={empInfo}
          unSubDetailToChange={unSubDetail}
          getUnSubDetailToChange={getUnSubscribeDetail}
          consultUnSubId={consultUnSubId}
          approvalBtns={approvalBtns}
          submitUnSub={submitUnSub}
          onQueryBtns={queryApprovalBtns}
          onUpdateFlow={updateFlow}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className={styles.rejectAmend} ref={this.changeHomeRef}>
        {
          this.judgeSubtypeNow()
        }
      </div>
    );
  }
}
