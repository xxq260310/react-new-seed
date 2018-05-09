/*
 * @Author: zhuyanwen
 * @Date: 2017-10-09 13:25:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-11 15:00:20
 * @description: 客户分组功能
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import { Tabs, Input, Row, Col, message } from 'antd';

import Button from '../../components/common/Button';
import CustomerGrouplist from '../../components/customerPool/group/CustomerGrouplist';
import AddNewGroup from '../../components/customerPool/group/AddNewGroup';
import AddCusSuccess from '../../components/customerPool/group/AddCusSuccess';
import { removeTab, linkTo } from '../../utils';
import { emp, url } from '../../helper';
import { checkSpecialCharacter } from '../../decorators/checkSpecialCharacter';
import withRouter from '../../decorators/withRouter';
import logable from '../../decorators/logable';

import styles from './customerGroup.less';

const CUR_PAGE = 1; // 默认当前页 0->1, 后端入参变化
const CUR_PAGESIZE = 10; // 默认页大小
const CUR_PAGE_COUNT = 10;
const TabPane = Tabs.TabPane;
const CUR_KEYWORD = null;
let onOff = false;

const mapStateToProps = state => ({
  cusgroupList: state.customerPool.cusgroupList,
  cusgroupPage: state.customerPool.cusgroupPage,
  cusGroupSaveResult: state.customerPool.cusGroupSaveResult,
  cusGroupSaveMessage: state.customerPool.cusGroupSaveMessage,
  resultgroupId: state.customerPool.resultgroupId,
  // 更新分组信息成功与否
  operateGroupResult: state.customerPool.operateGroupResult,
});

const mapDispatchToProps = {
  goBack: routerRedux.goBack,
  go: routerRedux.go,
  push: routerRedux.push,
  replace: routerRedux.replace,
  addCustomerToGroup: query => ({
    type: 'customerPool/addCustomerToGroup',
    payload: query || {},
  }),
  createCustGroup: query => ({
    type: 'customerPool/createCustGroup',
    payload: query || {},
  }),
  // 新增、编辑客户分组
  operateGroup: query => ({
    type: 'customerPool/operateGroup',
    payload: query || {},
  }),
  // 手动上传日志
  switchTab: query => ({
    type: 'customerGroup/switchTab',
    payload: query || {},
  }),
  handleRadio: query => ({
    type: 'customerGroup/handleRadio',
    payload: query || {},
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerGroup extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    cusgroupList: PropTypes.array.isRequired,
    createCustGroup: PropTypes.func.isRequired,
    cusgroupPage: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    addCustomerToGroup: PropTypes.func.isRequired,
    cusGroupSaveResult: PropTypes.string.isRequired,
    resultgroupId: PropTypes.string.isRequired,
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    // 操作分组结果
    operateGroupResult: PropTypes.string.isRequired,
    // 操作分组（编辑、删除）
    operateGroup: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    handleRadio: PropTypes.func.isRequired,
  }

  constructor(props) { // RCT_FSP_CUSTOMER_LIST
    super(props);
    /* 初始化classname,首次渲染显示分组tab,隐藏分组成功组件 */
    this.state = {
      showOperateGroupSuccess: false,
      cusgroupId: '',
      groupName: '',
      groupId: '',
      currentSelectRowKeys: [],
      fromState: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // 根据分组结果，重新渲染组件
    const { cusGroupSaveResult, resultgroupId } = nextProps;
    const { cusGroupSaveResult: prevResult } = this.props;
    if (prevResult !== cusGroupSaveResult && cusGroupSaveResult === 'success') {
      this.setState({
        showOperateGroupSuccess: cusGroupSaveResult === 'success',
        cusgroupId: resultgroupId,
      });
    }
  }

  @autobind
  @checkSpecialCharacter
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索分组名称' } })
  handleSearch(value) {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: CUR_PAGE,
        curPageSize: CUR_PAGESIZE,
        keyWord: value,
      },
    });
  }

  /**
   * 解析query
   */
  @autobind
  parseQuery() {
    const { location: { query: { ids, condition } } } = this.props;
    let custCondition = {};
    let custIdList = null;

    if (!_.isEmpty(ids)) {
      custIdList = decodeURIComponent(ids).split(',');
    } else {
      custCondition = JSON.parse(decodeURIComponent(condition));
    }

    return {
      custIdList,
      custCondition,
    };
  }

  /**
   * 重置成功提示
   */
  @autobind
  clearSuccessFlag() {
    this.setState({
      showOperateGroupSuccess: false,
    });
  }

  /*  添加到已有分组 */
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '保存' } })
  handleSubmit() {
    const { groupId } = this.state;
    /* groupId不为空，表示已经选中了分组 */
    if (groupId !== '') {
      /* 获取所选目标分组客户：ids表示选择客户，condition表示全选,将筛选条件传入后台。 */
      const { addCustomerToGroup } = this.props;
      const {
        custIdList,
        custCondition,
      } = this.parseQuery();

      // 添加分组
      addCustomerToGroup({
        groupId,
        custIdList,
        searchReq: _.isEmpty(custIdList) ? {
          ptyMngId: emp.getId(),
          orgId: emp.getOrgId(),
          ...custCondition,
        } : null,
      });
    } else if (!onOff) {
      message.error('请选择分组', 2, () => {
        onOff = false;
      });
      onOff = true;
    }
  }

  /* 添加到新建分组 */
  @autobind
  handleNewGroupSubmit(value) {
    const { groupName, groupDesc } = value;
    const { createCustGroup } = this.props;
    const {
      custIdList,
      custCondition,
    } = this.parseQuery();
    this.setState({
      groupName,
    });
    // 创建分组
    createCustGroup({
      groupName,
      groupDesc,
      custIdList,
      searchReq: _.isEmpty(custIdList) ? {
        ptyMngId: emp.getId(),
        orgId: emp.getOrgId(),
        ...custCondition,
      } : null,
    });
  }

  @autobind
  closeTab() {
    removeTab({
      id: 'RCT_FSP_CUSTOMER_LIST',
    });
  }

  // 点击取消按钮回到列表页
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    const {
      push,
      location: {
        query: { fr },
      },
    } = this.props;
    const { pathname, query } = url.parseUrl(decodeURIComponent(fr));
    linkTo({
      routerAction: push,
      pathname,
      query,
      name: '客户列表',
    });
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, query: { keyWord }, pathname }, replace } = this.props;

    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
        keyWord: keyWord || CUR_KEYWORD,
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
    const { location: { query, query: { keyWord }, pathname }, replace } = this.props;

    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
        keyWord: keyWord || CUR_KEYWORD,
      },
    });
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    this.setState({
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '添加到已有分组',
    },
  })
  handleSingleRowSelectionChange(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
    const { handleRadio } = this.props;
    const { groupId, groupName } = record;
    // 手动发送日志
    handleRadio({ groupId, groupName, selected });

    this.setState({
      currentSelect: record,
      currentSelectRowKeys: [groupId],
      groupId,
      groupName,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：添加到已有分组/添加到新建分组' } })
  handleTabClick(param) {
    const { switchTab } = this.props;
    // 发送日志
    switchTab({ param });
  }

  render() {
    const {
      push,
      cusgroupList,
      cusgroupPage,
      replace,
      location,
      location: { query: { count = '', curPageNum, curPageSize, isOperateSuccess } },
    } = this.props;

    const {
      groupName,
      showOperateGroupSuccess,
      currentSelectRowKeys,
      cusgroupId,
    } = this.state;

    const {
      totalRecordNum,
    } = cusgroupPage || {};

    const isShowSuccess = isOperateSuccess === 'Y';

    return (
      <div>
        {
          showOperateGroupSuccess || isShowSuccess ?
            <div>
              <AddCusSuccess
                closeTab={this.closeTab}
                groupName={groupName}
                groupId={cusgroupId}
                onDestroy={this.clearSuccessFlag}
                push={push}
                location={location}
                replace={replace}
              />
            </div> :
            <div className={styles.customerGroup}>
              <div className={styles.text}>添加分组</div>
              <hr />
              <Tabs
                defaultActiveKey="addhasGroup"
                type="card"
                onTabClick={this.handleTabClick}
              >
                <TabPane tab="添加到已有分组" key="addhasGroup">
                  <div className={styles.Grouplist}>
                    <Row type="flex" justify="start" align="middle">
                      <Col span={24}>
                        <div className={styles.searchBox}>
                          <Input.Search
                            className="search-input"
                            placeholder="请输入分组名称"
                            onSearch={this.handleSearch}
                            width={200}
                            enterButton
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="groupListRow">
                      <CustomerGrouplist
                        className="CustomerGrouplist"
                        data={cusgroupList}
                        pageData={{
                          totalRecordNum: totalRecordNum || CUR_PAGE_COUNT,
                          curPageNum: curPageNum || CUR_PAGE,
                          curPageSize: curPageSize || CUR_PAGESIZE,
                        }}
                        onPageChange={this.handlePageChange}
                        onSizeChange={this.handleShowSizeChange}
                        onRowSelectionChange={this.handleRowSelectionChange}
                        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
                        currentSelectRowKeys={currentSelectRowKeys}
                      />
                    </Row>
                    <Row className={styles.BtnContent}>
                      <Col span={12}>
                        <p className={styles.description}>已选目标客户<b>&nbsp;{count}&nbsp;</b>户</p>
                      </Col>
                      <Col span={12}>
                        <Button onClick={this.handleCancel}>取消</Button>
                        <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="添加到新建分组" key="addNewGroup">
                  <div className={styles.newGroupForm}>
                    <Row className={styles.groupForm}>
                      <AddNewGroup
                        goBack={this.handleCancel}
                        onSubmit={this.handleNewGroupSubmit}
                        count={count}
                      />
                      <Row className={styles.BtnContent} />
                    </Row>
                  </div>
                </TabPane>
              </Tabs>
            </div>
        }
      </div>
    );
  }
}
