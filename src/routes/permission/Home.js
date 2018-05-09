/**
 * @file premission/Home.js
 *  权限申请home页面
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import seibelHelper from '../../helper/page/seibel';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/permission/Detail';
import PermissionList from '../../components/common/appList';
import { seibelConfig } from '../../config';
import AppItem from '../../components/common/appList/AppItem';
import ModifyPrivateClient from '../../components/permission/ModifyPrivateClient';
import CreatePrivateClient from '../../components/permission/CreatePrivateClient_';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import styles from './home.less';
import logable, { logPV } from '../../decorators/logable';

const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const { permission, permission: { pageType, subType, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 右侧详情
  detailMessage: state.permission.detailMessage,
  // 左侧列表数据
  list: state.app.seibleList,
  // 服务人员列表
  searchServerPersonList: state.permission.searchServerPersonList,
  // 可申请客户
  canApplyCustList: state.app.canApplyCustList,
  // 查询已有服务任务列表
  hasServerPersonList: state.permission.hasServerPersonList,
  // 按照条件 查询下一审批人列表
  nextApproverList: state.permission.nextApproverList,
  // 获取btnlist
  bottonList: state.permission.bottonList,
  // 获取修改私密客户申请 的结果
  modifyCustApplication: state.permission.modifyCustApplication,
  // 监听 修改私密客户申请 过程
  addListenModify: state.loading.effects['permission/getModifyCustApplication'] || false,
  // 获取创建私密客户申请 的结果
  createCustApplication: state.permission.createCustApplication,
  // 监听 创建私密客户申请 过程
  addListenCreate: state.loading.effects['permission/getCreateCustApplication'] || false,
  // 列表loading
  seibelListLoading: state.loading.effects['app/getSeibleList'],
  //  获取子类型
  subTypeList: state.permission.subTypeList,
  // 员工基本信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
  // 获取左侧列表
  getPermissionList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取服务人员列表
  getServerPersonelList: fetchDataFunction(false, 'permission/getServerPersonelList'),
  // 搜索服务人员列表
  getSearchServerPersonList: fetchDataFunction(false, 'permission/getSearchServerPersonList'),
  // 获取可申请客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 查询已有服务任务列表
  getHasServerPersonList: fetchDataFunction(false, 'permission/getHasServerPersonList'),
  // 按照条件 查询下一审批人列表
  getNextApproverList: fetchDataFunction(false, 'permission/getNextApproverList'),
  // 获取btnlist
  getBottonList: fetchDataFunction(false, 'permission/getBottonList'),
  // 获取修改私密客户申请 的结果
  getModifyCustApplication: fetchDataFunction(false, 'permission/getModifyCustApplication'),
  // 获取创建私密客户申请 的结果
  getCreateCustApplication: fetchDataFunction(false, 'permission/getCreateCustApplication'),
  // 获取子类型
  getSubTypeList: fetchDataFunction(false, 'permission/getSubTypeList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    seibelListLoading: PropTypes.bool,
    getPermissionList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
    detailMessage: PropTypes.object,
    replace: PropTypes.func.isRequired,
    getCanApplyCustList: PropTypes.func.isRequired,
    searchServerPersonList: PropTypes.array.isRequired,
    getSearchServerPersonList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    hasServerPersonList: PropTypes.array.isRequired,
    getHasServerPersonList: PropTypes.func.isRequired,
    getNextApproverList: PropTypes.func.isRequired,
    nextApproverList: PropTypes.array.isRequired,
    bottonList: PropTypes.object.isRequired,
    getBottonList: PropTypes.func.isRequired,
    getModifyCustApplication: PropTypes.func.isRequired,
    modifyCustApplication: PropTypes.object.isRequired,
    addListenModify: PropTypes.bool.isRequired,
    getCreateCustApplication: PropTypes.func.isRequired,
    createCustApplication: PropTypes.object.isRequired,
    addListenCreate: PropTypes.bool.isRequired,
    getSubTypeList: PropTypes.func.isRequired,
    subTypeList: PropTypes.array.isRequired,
    empInfo: PropTypes.object,
  }

  static defaultProps = {
    detailMessage: {},
    empInfo: {},
    seibelListLoading: false,
  }

  static childContextTypes = {
    getCanApplyCustList: PropTypes.func.isRequired,
    getSearchServerPersonList: PropTypes.func.isRequired,
    getSubTypeList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      // 是否显示新建私密客户弹框
      isShowCreateModal: false,
      // 是否显示修改私密客户弹框
      isShowModifyModal: false,
      // 高亮项的下标索引
      activeRowIndex: 0,
    };
  }

  getChildContext() {
    return {
      getCanApplyCustList: (data) => {
        this.props.getCanApplyCustList({
          keyword: data,
          type: pageType,
        });
      },
      // 获取 查询服务人员列表
      getSearchServerPersonList: (data) => {
        this.props.getSearchServerPersonList({
          keyword: data,
          pageSize: 20,
          pageNum: 1,
        });
      },
      getSubTypeList: (data) => {
        this.props.getSubTypeList(data);
      },
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
      this.setState({
        activeRowIndex: itemIndex,
      });
      this.props.getDetailMessage({
        type: pageType,
        id: item.id,
      });
    }
  }

  @autobind
  queryAppList(query, pageNum = 1, pageSize = 20) {
    const { getPermissionList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getPermissionList({ ...params, type: pageType }).then(this.getRightDetail);
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

  @autobind
  clearModal(name) {
    // 清除模态框组件
    this.setState({ [name]: false });
  }

  // 头部新建页面
  @autobind
  @logPV({ pathname: '/modal/createProtocol', title: '新建权限申请' })
  creatPermossionModal() {
    // 打开模态框 发送获取服务人员列表请求
    this.setState({ isShowCreateModal: true });
  }

  @autobind
  showModifyModal() {
    this.setState(prevState => ({ isShowModifyModal: !prevState.isShowModifyModal }));
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '权限申请左侧列表项',
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
    this.props.getDetailMessage({
      id,
      type: pageType,
    });
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

  get detailComponent() {
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    const {
      canApplyCustList,
      searchServerPersonList,
      nextApproverList,
      getNextApproverList,
      getBottonList,
      bottonList,
      getModifyCustApplication,
      modifyCustApplication,
      addListenModify,
      subTypeList,
      location,
    } = this.props;
    return (
      <Detail
        {...this.props.detailMessage}
        location={location}
        canApplyCustList={canApplyCustList}
        searchServerPersonList={searchServerPersonList}
        nextApproverList={nextApproverList}
        getNextApproverList={getNextApproverList}
        getBottonList={getBottonList}
        bottonList={bottonList}
        getModifyCustApplication={getModifyCustApplication}
        modifyCustApplication={modifyCustApplication}
        addListenModify={addListenModify}
        subTypeList={subTypeList}
        onEmitEvent={this.showModifyModal}
        onEmitClearModal={this.clearModal}
      />
    );
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

  // 创建私密客户申请
  @autobind
  handleCreatePrivateApp(params) {
    const { location: { query } } = this.props;
    this.props.getCreateCustApplication(params).then(
      () => this.queryAppList(query, query.pageNum, query.pageSize),
    );
  }

  // 修改私密客户申请
  @autobind
  handleModifyPrivateApp(params) {
    const { location: { query } } = this.props;
    this.props.getModifyCustApplication(params).then(
      () => this.queryAppList(query, query.pageNum, query.pageSize),
    );
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
        pageName="permission"
        type="kehu1"
        pageData={permission}
      />
    );
  }

  render() {
    const {
      list,
      location,
      replace,
      canApplyCustList,
      searchServerPersonList,
      hasServerPersonList,
      getHasServerPersonList,
      nextApproverList,
      getNextApproverList,
      createCustApplication,
      addListenCreate,
      subTypeList,
      getBottonList,
      bottonList,
      modifyCustApplication,
      addListenModify,
      empInfo: {
        empInfo = EMPTY_OBJECT,
      },
    } = this.props;

    const isEmpty = _.isEmpty(list.resultData);
    const { isShowCreateModal, isShowModifyModal } = this.state;
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="premissionPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.creatPermossionModal}
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
      <PermissionList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={this.detailComponent}
          leftListClassName="premissionList"
        />
        {
          isShowCreateModal ?
            <CreatePrivateClient
              location={location}
              canApplyCustList={canApplyCustList}
              searchServerPersonList={searchServerPersonList}
              hasServerPersonList={hasServerPersonList}
              onEmitClearModal={this.clearModal}
              getHasServerPersonList={getHasServerPersonList}
              nextApproverList={nextApproverList}
              getNextApproverList={getNextApproverList}
              getCreateCustApplication={this.handleCreatePrivateApp}
              createCustApplication={createCustApplication}
              addListenCreate={addListenCreate}
              subTypeList={subTypeList}
              empInfo={empInfo}
            />
            :
            null
        }
        {
          isShowModifyModal ?
            <ModifyPrivateClient
              {...this.props.detailMessage}
              location={location}
              onEmitClearModal={this.clearModal}
              canApplyCustList={canApplyCustList}
              searchServerPersonList={searchServerPersonList}
              getBottonList={getBottonList}
              bottonList={bottonList}
              getModifyCustApplication={this.handleModifyPrivateApp}
              modifyCustApplication={modifyCustApplication}
              addListenModify={addListenModify}
              subTypeList={subTypeList}
            />
            : null
        }
      </div>
    );
  }
}
