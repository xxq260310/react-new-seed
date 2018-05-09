/**
 * @Author: hongguangqing
 * @Description: 服务经理主职位设置Home页面
 * @Date: 2018-01-29 13:25:30
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-02-28 14:57:20
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Modal } from 'antd';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import MainPositionList from '../../components/common/appList';
import CreateMainPostion from '../../components/mainPosition/CreateMainPostion';
import ViewListRow from '../../components/mainPosition/ViewListRow';
import Detail from '../../components/mainPosition/Detail';
import { closeRctTab } from '../../utils';
import { emp } from '../../helper';
import config from '../../components/mainPosition/config';
import seibelHelper from '../../helper/page/seibel';
import logable, { logPV } from '../../decorators/logable';

const { mainPosition, mainPosition: { pageType, status } } = config;
const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.mainPosition.detailInfo,
  // 组织机构树
  custRangeList: state.customerPool.custRange,
  // 员工列表
  employeeList: state.mainPosition.employeeList,
  // 员工对应的职位列表
  positionList: state.mainPosition.positionList,
  // 获取按钮列表和下一步审批人
  buttonList: state.mainPosition.buttonList,
  // 新建（修改）接口返回的业务主键的值
  itemId: state.mainPosition.itemId,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: fetchDataFunction(true, 'app/getSeibleList', true),
  // 获取右侧详情信息
  getDetailInfo: fetchDataFunction(true, 'mainPosition/getDetailInfo', true),
  // 搜索员工列表
  searchEmployee: fetchDataFunction(true, 'mainPosition/searchEmployee', true),
  // 搜索员工职位列表
  searchPosition: fetchDataFunction(true, 'mainPosition/searchPosition', true),
  // 清除 员工列表、员工职位列表
  clearProps: fetchDataFunction(true, 'mainPosition/clearProps', true),
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
export default class MainPosition extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 搜索员工
    searchEmployee: PropTypes.func.isRequired,
    employeeList: PropTypes.array.isRequired,
    // 搜索员工对应的职位
    searchPosition: PropTypes.func.isRequired,
    positionList: PropTypes.array.isRequired,
    // 清除 员工列表、员工职位列表
    clearProps: PropTypes.func.isRequired,
    // 组织机构树
    custRangeList: PropTypes.array.isRequired,
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

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.checkUserIsFiliale();
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      isShowCreateModal: false,
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

  componentWillReceiveProps({ custRangeList }) {
    const oldCustRangeList = this.props.custRangeList;
    if (!_.isEmpty(custRangeList) && oldCustRangeList !== custRangeList) {
      this.checkUserIsFiliale();
    }
  }

  // 获取右侧详情
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
      this.props.getDetailInfo({ flowId: item.flowId });
    }
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getList({ ...params, type: pageType }).then(this.getRightDetail);
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

  // 判断当前登录用户部门是否是分公司
  @autobind
  checkUserIsFiliale() {
    const { custRangeList } = this.props;
    if (!_.isEmpty(custRangeList)) {
      if (!emp.isFiliale(custRangeList, emp.getOrgId())) {
        Modal.warning({
          title: '提示',
          content: '您不是分公司人员，无权操作！',
          onOk: () => {
            this.handleCloseTabPage();
          },
        });
      }
    }
  }

  // 取消
  @autobind
  handleCloseTabPage() {
    closeRctTab({
      id: 'FSP_MAIN_POSTN_MANAGE',
    });
  }

  @autobind
  clearModal(name) {
    // 清除模态框组件
    this.setState({ [name]: false });
  }

  // 打开新建申请的弹出框
  @autobind
  @logPV({ pathname: '/modal/createProtocol', title: '新建服务经理主职位设置' })
  openCreateModalBoard() {
    this.setState({
      isShowCreateModal: true,
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

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '服务经理主职位设置左侧列表',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    const { id, flowId } = record;
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
    this.props.getDetailInfo({ flowId });
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="mainPosition"
        type="kehu1"
        pageData={mainPosition}
      />
    );
  }

  render() {
    const {
      replace,
      location,
      list,
      detailInfo,
      searchEmployee,
      searchPosition,
      clearProps,
      employeeList,
      positionList,
      // 组织机构树
      custRangeList,
      getButtonList,
      buttonList,
      updateApplication,
      itemId,
      doApprove,
    } = this.props;
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="mainPositionPage"
        pageType={pageType}
        needSubType={false}
        stateOptions={status}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        isUseOfCustomer={false}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    const leftPanel = (
      <MainPositionList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail
        data={detailInfo}
      />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="MainPositionList"
        />
        {
          !isShowCreateModal ? null
          : (
            <CreateMainPostion
              location={location}
              updateApplication={updateApplication}
              itemId={itemId}
              doApprove={doApprove}
              searchEmployee={searchEmployee}
              searchPosition={searchPosition}
              clearProps={clearProps}
              employeeList={employeeList}
              positionList={positionList}
              custRangeList={custRangeList}
              getButtonList={getButtonList}
              buttonList={buttonList}
              queryAppList={this.queryAppList}
              onEmitClearModal={this.clearModal}
            />
          )
        }
      </div>
    );
  }
}
