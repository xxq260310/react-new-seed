/**
 * @Author: hongguangqing
 * @Description: 服务经理主职位设置修改页面
 * @Date: 2018-02-28 14:43:26
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-14 20:14:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import withRouter from '../../decorators/withRouter';
import EditForm from '../../components/mainPosition/EditForm';
import Barable from '../../decorators/selfBar';
import { seibelConfig } from '../../config';

const { filialeCustTransfer: { pageType } } = seibelConfig;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '277F04385B7BFE45ABFD49D0EF615A63';
const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 右侧详情数据
  detailInfo: state.mainPosition.detailInfo,
  // 获取按钮列表和下一步审批人
  buttonList: state.mainPosition.buttonList,
  // 新建（修改）接口返回的业务主键的值
  itemId: state.mainPosition.itemId,
});

const mapDispatchToProps = {
  // 获取右侧详情信息
  getDetailInfo: fetchDataFunction(true, 'mainPosition/getDetailInfo', true),
  // 提交保存
  updateApplication: fetchDataFunction(true, 'mainPosition/updateApplication', true),
  // 走流程接口
  doApprove: fetchDataFunction(true, 'mainPosition/doApprove', true),
  // 获取按钮列表和下一步审批人
  getButtonList: fetchDataFunction(true, 'mainPosition/getButtonList', true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class FilialeCustTransferEdit extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 新建修改接口
    updateApplication: PropTypes.func.isRequired,
    // 新建（修改）接口返回的业务主键的值
    itemId: PropTypes.string.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 审批按钮列表
    buttonList: PropTypes.object.isRequired,
    // 请求审批按钮方法
    getButtonList: PropTypes.func.isRequired,
  }


  componentDidMount() {
    const { getDetailInfo, location: { query: { flowId } } } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    // 获取详情
    getDetailInfo({
      flowId: newFolwId,
      type: pageType,
    });
  }


  render() {
    const {
      getDetailInfo,
      detailInfo,
      // 提交保存
      updateApplication,
      // 走流程
      doApprove,
      getButtonList,
      buttonList,
      itemId,
    } = this.props;
    if (_.isEmpty(detailInfo)) {
      return null;
    }
    return (
      <EditForm
        getDetailInfo={getDetailInfo}
        data={detailInfo}
        updateApplication={updateApplication}
        itemId={itemId}
        doApprove={doApprove}
        getButtonList={getButtonList}
        buttonList={buttonList}
        queryAppList={this.queryAppList}
      />
    );
  }
}
