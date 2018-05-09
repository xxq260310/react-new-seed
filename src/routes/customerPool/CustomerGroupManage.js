/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-22 19:02:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-09 15:12:05
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { message } from 'antd';
import _ from 'lodash';

import Button from '../../components/common/Button';
import Table from '../../components/common/commonTable';
import GroupModal from '../../components/customerPool/groupManage/CustomerGroupUpdateModal';
import CustomerGroupDetail from '../../components/customerPool/groupManage/CustomerGroupDetail';
import SimpleSearch from '../../components/customerPool/groupManage/CustomerGroupListSearch';
import { checkSpecialCharacter } from '../../decorators/checkSpecialCharacter';
import { openRctTab } from '../../utils';
import { url as urlHelper } from '../../helper';
import confirm from '../../components/common/Confirm';
import withRouter from '../../decorators/withRouter';
import styles from './customerGroupManage.less';
import tableStyles from '../../components/common/commonTable/index.less';
import logable, { logPV } from '../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  getCustList: 'customerPool/getGroupCustomerList',
  getHotPossibleWds: 'customerPool/getCustomerHotPossibleWds',
  operateGroup: 'customerPool/operateGroup',
  deleteGroup: 'customerPool/deleteGroup',
  deleteCustomerFromGroup: 'customerPool/deleteCustomerFromGroup',
  queryBatchCustList: 'customerPool/queryBatchCustList',
};

const fetchData = (type, loading, forceFull) => query => ({
  type,
  payload: query || EMPTY_OBJECT,
  loading,
  forceFull,
});

const mapStateToProps = state => ({
  // 客户分组列表
  customerGroupList: state.customerPool.customerGroupList,
  // 一个分组下的所有客户
  groupCustomerList: state.customerPool.groupCustomerList,
  // 联想的推荐热词列表
  customerHotPossibleWordsList: state.customerPool.customerHotPossibleWordsList,
  // 更新分组信息成功与否
  operateGroupResult: state.customerPool.operateGroupResult,
  // 字典信息
  dict: state.app.dict,
  // 删除分组结果
  deleteGroupResult: state.customerPool.deleteGroupResult,
  // 删除分组下客户结果
  deleteCustomerFromGroupResult: state.customerPool.deleteCustomerFromGroupResult,
  // 批量导入客户信息
  batchCustList: state.customerPool.batchCustList,
});

const mapDispatchToProps = {
  // 获取分组客户列表
  getGroupCustomerList: fetchData(effects.getCustList, false),
  // 获取热词列表
  getHotPossibleWds: fetchData(effects.getHotPossibleWds, false),
  // 新增、编辑客户分组
  operateGroup: fetchData(effects.operateGroup, true),
  // 删除分组
  deleteGroup: fetchData(effects.deleteGroup, true),
  // 删除分组下客户
  deleteCustomerFromGroup: fetchData(effects.deleteCustomerFromGroup, true),
  // 获取上传excel文件解析后的客户
  queryBatchCustList: fetchData(effects.queryBatchCustList, true, true),
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 清除数据
  clearCreateTaskData: query => ({
    type: 'customerPool/clearCreateTaskData',
    payload: query || {},
  }),
};

let modalKeyCount = 0;

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerGroupManage extends PureComponent {
  static propTypes = {
    customerGroupList: PropTypes.object,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getGroupCustomerList: PropTypes.func.isRequired,
    groupCustomerList: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    operateGroupResult: PropTypes.string.isRequired,
    operateGroup: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    deleteGroupResult: PropTypes.string.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    deleteCustomerFromGroupResult: PropTypes.object.isRequired,
    deleteCustomerFromGroup: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    // 批量导入客户信息
    queryBatchCustList: PropTypes.func.isRequired,
    batchCustList: PropTypes.object.isRequired,
  };

  static defaultProps = {
    customerGroupList: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 控制显示更新分组弹出层
      visible: false,
      modalKey: `groupModalKey${modalKeyCount}`,
      canEditDetail: true,
      // 分组名称
      name: '',
      // 分组描述
      description: '',
      modalTitle: '新建用户分组',
      groupId: '',
      record: {},
      keyWord: '',
    };
  }

  componentWillUnmount() {
    this.setState({
      visible: false, // 控制显示更新分组弹出层
    });
  }

  // 获取联想数据
  @autobind
  queryHotPossibleWds({ keyword }) {
    const { getHotPossibleWds } = this.props;
    getHotPossibleWds({
      keyword, // 搜索关键字（客户号或客户名字）
      pageNum: 1,
      pageSize: 10,
      // 后台需要传，不传报错，对前端没啥意义
      type: '06',
    });
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { keyWord } = this.state;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
        keyWord,
      },
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { keyWord } = this.state;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
        keyWord,
      },
    });
  }

  // 编辑客户分组
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '编辑客户分组',
    },
  })
  editCustomerGroup(record) {
    console.log('edit customer group list');
    const { groupId } = record;
    const { getGroupCustomerList } = this.props;
    this.showGroupDetailModal(record);
    this.setState({
      canEditDetail: true,
      modalTitle: '编辑用户分组',
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
      pageNum: 1,
      pageSize: 10,
    });
  }

  // 删除客户分组
  @autobind
  deleteCustomerGroup() {
    console.log('delete customer group list');
    const { record, keyWord } = this.state;
    const { groupId } = record;
    const { deleteGroup, location: { query: { curPageNum, curPageSize } } } = this.props;
    deleteGroup({
      request: {
        groupId,
      },
      keyWord,
      pageNum: curPageNum,
      pageSize: curPageSize,
    });
  }

  // 发起任务
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '发起任务',
    },
  })
  lanuchTask(record) {
    console.log('launch task');
    const { groupId, relatCust } = record;
    if (relatCust <= 0) {
      message.error('该分组下没有客户，不能发起任务');
      return;
    }
    // 发起任务之前，清除数据
    this.props.clearCreateTaskData('custGroupList');

    this.handleOpenTab({
      groupId,
      count: relatCust,
      enterType: 'custGroupList',
      source: 'custGroupList',
    }, '自建任务', 'RCT_FSP_CREATE_TASK_FROM_CUSTGROUP');
  }

  @autobind
  handleOpenTab(obj, titles, ids) {
    // const { groupId, count, enterType, source } = obj;
    console.log('XXXXX', obj, titles, ids);
    const { push } = this.props;
    const firstUrl = '/customerPool/createTaskFromCustGroup';
    // const condition = encodeURIComponent(JSON.stringify(obj));
    // const query = {
    //   condition,
    // };

    const url = `${firstUrl}?${urlHelper.stringify(obj)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: ids, // tab的id
      title: titles, // tab标题
    };
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: '/customerCenter/customerGroupManage/createTask',
      query: obj,
    });
  }

  @autobind
  handleGroupListSearch(value) {
    console.log('search', value);
  }

  @autobind
  handleConfirmOk() {
    this.deleteCustomerGroup();
  }

  @autobind
  handleConfirmCancel() {
    console.log('cancel');
  }

  @autobind
  handleConfirmTipCancel() {
    console.log('cancel');
  }

  @autobind
  handleConfirmTipOk() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleNewModelConfirmTipCancel() {
    console.log('cancel');
  }

  @autobind
  handleNewModelConfirmTipOk() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '删除客户分组',
    },
  })
  handleDeleteBtnClick(record) {
    // 当前删除行记录数据
    this.setState({ record });
    confirm({
      onOk: this.handleConfirmOk,
      onCancel: this.handleConfirmCancel,
    });
  }

  /**
   * 打开编辑或者新建分组详情记录modal
   * @param {*} record 当前记录
   */
  @autobind
  @logPV({ pathname: '/modal/createGroupDetailRecord', title: '编辑或者新建分组详情记录' })
  showGroupDetailModal(record = {}) {
    console.log('add customer group');
    const { groupName = '', xComments = '', groupId = '' } = record;
    this.setState({
      visible: true,
      modalKey: `groupModalKey${modalKeyCount++}`,
      canEditDetail: true,
      name: groupName,
      description: xComments,
      // 默认是新建用户分组
      modalTitle: '新建用户分组',
      groupId,
    });
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '客户分组管理',
    },
  })
  handleShowGroupDetail(record) {
    console.log('show add group detail modal');
    const { groupId } = record;
    const { getGroupCustomerList } = this.props;
    this.showGroupDetailModal(record);
    this.setState({
      canEditDetail: false,
      modalTitle: '查看用户分组',
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
      pageNum: 1,
      pageSize: 10,
    });
  }

  @autobind
  handleUpdateGroup() {
    console.log('show add group detail modal');
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCloseModal() {
    const { groupId, includeCustIdList } = this.detailRef.getData();
    if (groupId) {
      // 编辑模式下
      if (!_.isEmpty(includeCustIdList)) {
        // 存在custIdList,在取消的时候提示
        confirm({
          content: '客户已添加成功，如需取消添加的客户请在列表中删除',
          onOk: this.handleConfirmTipOk,
          onCancel: this.handleConfirmTipCancel,
        });
      } else {
        this.setState({
          visible: false,
        });
      }
    } else if (!_.isEmpty(includeCustIdList)) {
      confirm({
        content: '在新增模式下，添加客户需要提交才能生效，确认取消？',
        onOk: this.handleNewModelConfirmTipOk,
        onCancel: this.handleNewModelConfirmTipCancel,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  @autobind
  handleSubmitCloseModal() {
    this.setState({
      visible: false,
    });
  }

  /**
   * 根据搜索框输入值搜索分组
   * @param {*} value 搜索值
   */
  @autobind
  @checkSpecialCharacter
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索我的客户分组' } })
  handleSearchGroup(value) {
    console.log('search value', value);

    const {
      replace,
      location: { pathname, query, query: { curPageSize = 10 } },
    } = this.props;
    // 保存当前搜索值
    this.setState({
      keyWord: value,
    });
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize,
        keyWord: value,
      },
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubmit(e) {
    if (this.detailRef) {
      const { groupId, includeCustIdList } = this.detailRef.getData();

      e.persist();
      this.detailRef.getForm().validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          const { name = '', description } = values;
          this.submitFormContent(name, description, groupId, includeCustIdList);
        } else {
          message.error('请输入分组名称');
        }
      });
    }
  }

  @autobind
  @checkSpecialCharacter
  submitFormContent(name, description, groupId, includeCustIdList) {
    const { operateGroup, location: { query: { curPageNum, curPageSize } } } = this.props;
    const { keyWord } = this.state;
    const postBody = {
      request: {
        groupName: name,
        groupDesc: description,
        includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
        excludeCustIdList: null,
      },
      keyWord,
      pageNum: curPageNum,
      pageSize: curPageSize,
    };
    if (groupId) {
      // 编辑分组
      operateGroup(_.merge(postBody, {
        request: {
          groupId,
        },
      }));
    } else {
      // 新增分组
      operateGroup(postBody);
    }
    // 关闭弹窗
    this.handleSubmitCloseModal();
  }

  /**
   * 添加客户到已经存在的分组中
   * 调用接口
   * @param {*object} param0 添加分组对象
   */
  @autobind
  addCustomerToExistedGroup({ includeCustIdList, name, description }) {
    const { groupId, keyWord } = this.state;
    const { operateGroup } = this.props;
    operateGroup({
      request: {
        groupId,
        groupName: name,
        groupDesc: description,
        includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
        excludeCustIdList: null,
      },
      keyWord,
    });
  }

  @autobind
  customerGroupDetailRef(ref) {
    this.detailRef = ref;
  }

  @autobind
  deleteCustomerFromGroup(param) {
    const { deleteCustomerFromGroup,
      location: { query: { curPageNum, curPageSize } },
    } = this.props;
    const { keyWord } = this.state;
    deleteCustomerFromGroup({
      ...param,
      curPageNum,
      curPageSize,
      keyWord,
    });
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.groupId }));
    }

    return [];
  }

  renderActionSource() {
    return [{
      type: '编辑',
      handler: this.editCustomerGroup,
    },
    {
      type: '删除',
      handler: this.handleDeleteBtnClick,
    },
    {
      type: '发起任务',
      handler: this.lanuchTask,
    }];
  }

  renderColumnTitle() {
    // createLogin:"1-P9LJ",
    // createdTm:"2017-09-19 00:00:00",
    // groupId:"1-432KUCI",
    // groupName:"96",
    // relatCust:1,
    // xComments:null,
    return [{
      key: 'groupName',
      value: '分组名称',
    },
    {
      key: 'xComments',
      value: '描述',
    },
    {
      key: 'relatCust',
      value: '客户数',
    },
    {
      key: 'createdTm',
      value: '创建时间',
    },
    {
      key: 'action',
      value: '操作',
    }];
  }

  render() {
    const {
      customerGroupList = EMPTY_OBJECT,
      location: { query: { curPageNum = 1, curPageSize = 10 } },
      groupCustomerList = EMPTY_OBJECT,
      customerHotPossibleWordsList = EMPTY_LIST,
      getGroupCustomerList,
      operateGroup,
      operateGroupResult,
      dict,
      deleteCustomerFromGroupResult,
      location,
      replace,
      queryBatchCustList,
      batchCustList,
     } = this.props;

    const {
      visible,
      modalKey,
      canEditDetail,
      name,
      description,
      modalTitle,
      groupId,
    } = this.state;

    const {
      resultData = EMPTY_LIST,
      page = EMPTY_OBJECT,
    } = customerGroupList || EMPTY_OBJECT;

    const { totalRecordNum } = page;

    // 风险等级字典信息
    const { custRiskBearing } = dict;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 构造operation
    const actionSource = this.renderActionSource();

    const dataSource = this.addIdToDataSource(resultData);

    return (
      <div className={styles.groupPanelContainer}>
        <div className={styles.title}>我的客户分组</div>
        <div className={styles.operationRow}>
          <div className={styles.leftSection}>
            <SimpleSearch
              className={styles.groupSearch}
              onSearch={this.handleSearchGroup}
              placeholder={'分组名称'}
              titleNode={
                <span className={styles.name}>分组名称：</span>
              }
              searchStyle={{
                height: '30px',
                width: '250px',
              }}
            />
          </div>
          <div className={styles.rightSection}>
            <Button
              type="primary"
              className={styles.addBtn}
              onClick={this.showGroupDetailModal}
            >
              新增
            </Button>
          </div>
        </div>
        <div className={styles.groupTableContainer}>
          <Table
            pageData={{
              curPageNum,
              curPageSize,
              totalRecordNum,
            }}
            listData={dataSource}
            onSizeChange={this.handleShowSizeChange}
            onPageChange={this.handlePageChange}
            tableClass={
              classnames({
                [tableStyles.groupTable]: true,
              })
            }
            titleColumn={titleColumn}
            actionSource={actionSource}
            isFirstColumnLink
            firstColumnHandler={this.handleShowGroupDetail}
            columnWidth={['25%', '25%', '10%', '20%', '20%']}
          />
        </div>
        {
          visible ?
            <GroupModal
              wrapperClass={
                classnames({
                  [styles.groupModalContainer]: true,
                })
              }
              // 为了每次都能打开一个新的modal
              key={modalKey}
              visible={visible}
              title={modalTitle}
              okText={'提交'}
              cancelText={'取消'}
              okType={'primary'}
              onCancelHandler={this.handleCloseModal}
              footer={<div className={styles.operationBtnSection}>
                <Button
                  className={styles.cancel}
                  onClick={this.handleCloseModal}
                >
                  取消
                </Button>
                <Button
                  htmlType="submit"
                  className={styles.submit}
                  type="primary"
                  // 加入节流函数
                  onClick={_.debounce(this.handleSubmit, 250)}
                >
                  提交
                </Button>
              </div>}
              modalContent={
                <CustomerGroupDetail
                  wrappedComponentRef={this.customerGroupDetailRef}
                  deleteCustomerFromGroupResult={deleteCustomerFromGroupResult}
                  deleteCustomerFromGroup={this.deleteCustomerFromGroup}
                  custRiskBearing={custRiskBearing}
                  canEditDetail={canEditDetail}
                  customerHotPossibleWordsList={customerHotPossibleWordsList}
                  getHotPossibleWds={this.queryHotPossibleWds}
                  customerList={groupCustomerList}
                  getGroupCustomerList={getGroupCustomerList}
                  operateGroup={operateGroup}
                  operateGroupResult={operateGroupResult}
                  detailData={{
                    name,
                    description,
                    groupId,
                  }}
                  location={location}
                  replace={replace}
                  onAddCustomerToGroup={this.addCustomerToExistedGroup}
                  queryBatchCustList={queryBatchCustList}
                  batchCustList={batchCustList}
                />
              }
              onOkHandler={this.handleUpdateGroup}
            /> : null
        }
      </div>
    );
  }
}
