/**
 * @Description: 权限申请的驳回修改页面
 * @Author: hongguangqing
 * @Date: 2017-12-07 17:41:58
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-14 20:14:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import EditForm from '../../components/permission/EditForm';
import Barable from '../../decorators/selfBar';
import { seibelConfig } from '../../config';
import style from './edit.less';


const { permission: { pageType } } = seibelConfig;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '033A44673244674BA29F17905F825F78';
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 详情接口
  detailMessage: state.permission.detailMessage,
  // 服务人员列表
  searchServerPersonList: state.permission.searchServerPersonList,
  // 获取btnlist
  bottonList: state.permission.bottonList,
});

const mapDispatchToProps = {
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
  // 搜索服务人员列表
  getSearchServerPersonList: fetchDataFunction(false, 'permission/getSearchServerPersonList'),
  // 获取btnlist
  getBottonList: fetchDataFunction(false, 'permission/getBottonList'),
  // 获取修改私密客户申请 的结果
  getModifyCustApplication: fetchDataFunction(false, 'permission/getModifyCustApplication'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class PermissionEdit extends PureComponent {
  static propTypes = {
    // location
    location: PropTypes.object.isRequired,
    // 详情列表
    detailMessage: PropTypes.object.isRequired,
    // 获取详情列表的方法
    getDetailMessage: PropTypes.func.isRequired,
    // 服务经理列表
    searchServerPersonList: PropTypes.array.isRequired,
    // 获取服务经理列表方法
    getSearchServerPersonList: PropTypes.func.isRequired,
    // 审批按钮列表
    bottonList: PropTypes.object.isRequired,
    // 请求审批按钮方法
    getBottonList: PropTypes.func.isRequired,
    // 修改页面的方法
    getModifyCustApplication: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  static childContextTypes = {
    getSearchServerPersonList: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      // 获取 查询服务人员列表
      getSearchServerPersonList: (data) => {
        this.props.getSearchServerPersonList({
          keyword: data,
          pageSize: 10,
          pageNum: 1,
        });
      },
    };
  }


  componentDidMount() {
    const { getDetailMessage, location: { query: { flowId } } } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    // 获取详情
    getDetailMessage({
      flowId: newFolwId,
      type: pageType,
    });
  }

  @autobind
  updateValue(name, value) {
    // 更新state
    if (name === 'customer') {
      this.setState({ customer: {
        custName: value.custName,
        custNumber: value.cusId,
      } });
    }
    this.setState({ [name]: value });
  }

  // 修改私密客户申请
  @autobind
  handleModifyPrivateApp(params) {
    const { location: { query } } = this.props;
    this.props.getModifyCustApplication(params).then(
      () => this.queryAppList(query, query.pageNum, query.pageSize),
    );
  }

  render() {
    const {
      detailMessage,
      searchServerPersonList,
      getBottonList,
      bottonList,
    } = this.props;
    if (_.isEmpty(detailMessage)) {
      return null;
    }
    return (
      <div className={style.editHome}>
        <EditForm
          {...detailMessage}
          location={location}
          onEmitClearModal={this.clearModal}
          searchServerPersonList={searchServerPersonList}
          getBottonList={getBottonList}
          bottonList={bottonList}
          getModifyCustApplication={this.handleModifyPrivateApp}
        />
      </div>
    );
  }
}
