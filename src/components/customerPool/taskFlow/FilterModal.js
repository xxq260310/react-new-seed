/**
 * @file components/customerPool/TaskSearchRow.js
 *  客户列表项中的快捷菜单
 * @author zhushengnan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { emp } from '../../../helper';
import Table from '../../common/commonTable';
import styles from './filterModal.less';
import FilterCustomers from './step1/FilterCustomers';
import { getCustomerListFilters } from '../../../helper/page/customerPool';
import logable from '../../../decorators/logable';

const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;
const renderColumnTitle = [{
  key: 'brok_id',
  value: '经纪客户号',
},
{
  key: 'name',
  value: '客户名称',
},
{
  key: 'empName',
  value: '服务经理',
},
{
  key: 'orgName',
  value: '所在营业部',
},
{
  key: 'lever_code',
  value: '客户等级',
},
{
  key: 'cust_type',
  value: '客户类型',
}];


export default class FilterModal extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    labelId: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    isAuthorize: PropTypes.bool.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    argsOfQueryCustomer: PropTypes.object.isRequired,
    currentFilterObject: PropTypes.object.isRequired,
    currentAllFilterState: PropTypes.object.isRequired,
    allFiltersCloseIconState: PropTypes.object.isRequired,
    filterNumObject: PropTypes.object.isRequired,
    onAccpeptFilter: PropTypes.func.isRequired,
    currentModalKey: PropTypes.string.isRequired,
    currentSelectLabelName: PropTypes.string.isRequired,
    changeModalVisible: PropTypes.func.isRequired,
    shouldrenderModal: PropTypes.bool.isRequired,
    curPageNum: PropTypes.number.isRequired,
    currentSource: PropTypes.string.isRequired,
  }

  static defaultProps = {
    orgId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: this.props.curPageNum,
      currentFilterObject: this.props.currentFilterObject,
      currentAllFilterState: this.props.currentAllFilterState,
      allFiltersCloseIconState: this.props.allFiltersCloseIconState,
      filterNumObject: this.props.filterNumObject,
      // 当前筛选条件
      argsOfQueryCustomer: this.props.argsOfQueryCustomer,
      custTableData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      shouldrenderModal,
      filterNumObject,
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      curPageNum,
      argsOfQueryCustomer,
    } = nextProps;

    if (shouldrenderModal !== this.props.shouldrenderModal) {
      this.setState({
        filterNumObject,
        currentFilterObject,
        currentAllFilterState,
        allFiltersCloseIconState,
        argsOfQueryCustomer,
        curPageNum,
      });
    }
  }


  @autobind
  onCheckFilterMoreButton(obj) {
    const { allFiltersCloseIconState } = this.state;
    const { labelId } = this.props;
    const newFilterStatusArray =
      allFiltersCloseIconState[labelId] ? [...allFiltersCloseIconState[labelId]] : [];
    const index = _.findIndex(newFilterStatusArray, o => o.name === obj.name);
    const filterStatusItem = {
      name: obj.name,
      status: obj.status,
    };
    if (index > -1) {
      newFilterStatusArray[index] = filterStatusItem;
    } else {
      newFilterStatusArray.push(filterStatusItem);
    }
    this.setState({
      allFiltersCloseIconState: {
        ...allFiltersCloseIconState,
        [labelId]: newFilterStatusArray,
      },
    });
  }

  // 瞄准镜关闭按钮状态切换并保存allFiltersCloseIconState
  @autobind
  onCloseIconClick(obj) {
    this.onCheckFilterMoreButton(obj);
  }

  @autobind
  setFilterTableData({ list, filterNumObject }) {
    this.setState({
      custTableData: list,
      filterNumObject,
    });
  }

  /**
* 查询标签下客户
* @param {*} labelId 标签Id
* @param {*} curPageNum 当前页
* @param {*} pageSize 当前页条目
*/
  @autobind
  queryPeopleOfLabel({ labelId, curPageNum = 1, pageSize = 10, filter = [] }) {
    const { isAuthorize, orgId, getLabelPeople } = this.props;
    const { argsOfQueryCustomer } = this.state;
    let payload = {
      curPageNum,
      pageSize,
      enterType: 'labelSearchCustPool',
      labels: [labelId],
    };
    if (!_.isEmpty(argsOfQueryCustomer[`${labelId}`])) {
      // 如果data里面存在payload，就恢复数据，不然就取默认数据
      // 查询客户列表时必传的参数
      const { labels: remberLabels } = argsOfQueryCustomer[`${labelId}`];
      payload = { ...payload, labels: remberLabels };
    }
    // 有权限传orgId，没有权限传ptyMngId
    if (isAuthorize) {
      payload.orgId = orgId;
    } else {
      payload.ptyMngId = emp.getId();
    }

    if (!_.isEmpty(filter)) {
      const { filters, labels } = getCustomerListFilters(filter, labelId);
      payload.filtersReq = filters;
      payload.labels = labels;
    }

    // 获取客户列表, true为全屏loading
    getLabelPeople(payload, true).then(() => {
      const { filterNumObject } = this.state;
      const { peopleOfLabelData } = this.props;
      // 是否展示筛查客户的modal
      const { custList = [] } = peopleOfLabelData || {};
      const list = _.map(custList, item => ({
        ...item,
        brok_id: item.brokId,
        brok_org_id: item.brokOrgId,
        contact_flag: item.contactFlag,
        lever_code: item.levelName,
        cust_type: item.custType === 'N' ? '高净值' : '零售',
      }));
      let finalFilterNumObject = filterNumObject;
      // 只有点击了筛查客户，才需要替换filterNumObject
      if (!_.isEmpty(labelId)) {
        finalFilterNumObject = {
          [labelId]: _.isEmpty(peopleOfLabelData) ? 0 : peopleOfLabelData.totalCount,
        };
      }
      this.setState({
        custTableData: list,
        filterNumObject: {
          ...filterNumObject,
          ...finalFilterNumObject,
        },
      });
    });

    this.setState({
      argsOfQueryCustomer: {
        ...argsOfQueryCustomer,
        [labelId]: {
          ...payload,
        },
      },
    });
  }


  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleAccept() {
    const { onCancel, onAccpeptFilter } = this.props;
    onAccpeptFilter({
      ...this.state,
    });
    this.props.changeModalVisible({
      modalVisible: false,
    });
    onCancel();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    const { onCancel } = this.props;
    this.props.changeModalVisible({
      modalVisible: false,
    });
    onCancel();
  }

  // 表格信息
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { currentFilterObject } = this.state;
    const { labelId } = this.props;
    this.queryPeopleOfLabel({
      labelId,
      curPageNum: currentPageNum,
      pageSize: changedPageSize,
      filter: currentFilterObject[labelId] || [],
    });

    this.setState({
      curPageNum: currentPageNum,
    });
  }

  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { currentFilterObject } = this.state;
    const { labelId } = this.props;
    this.queryPeopleOfLabel({
      labelId,
      curPageNum: nextPage,
      pageSize: currentPageSize,
      filter: currentFilterObject[labelId] || [],
    });

    this.setState({
      curPageNum: nextPage,
    });
  }

  /**
   * 筛查客户弹窗中的 筛选项 变化值,
   * 该对象包含该筛选条件对应的名称name，代码key，选中字段名value
   */
  @autobind
  handleFilterChange(obj) {
    const { currentFilterObject, currentAllFilterState } = this.state;
    const { labelId } = this.props;
    const newFilterArray = currentFilterObject[labelId] ? [...currentFilterObject[labelId]] : [];
    const newFilterAllArray =
      currentAllFilterState[labelId] ? [...currentAllFilterState[labelId]] : [];
    const index = _.findIndex(newFilterArray, o => o.split('.')[0] === obj.name);
    const filterItem = `${obj.name}.${obj.key}`;
    const filterAllItem = {
      name: obj.name,
      filterLabel: obj.filterLabel,
      valueArray: obj.valueArray,
    };
    if (index > -1) {
      newFilterArray[index] = filterItem;
      newFilterAllArray[index] = filterAllItem;
    } else {
      newFilterArray.push(filterItem);
      newFilterAllArray.push(filterAllItem);
    }
    this.setState({
      currentFilterObject: {
        ...currentFilterObject,
        [labelId]: newFilterArray,
      },
      currentAllFilterState: {
        ...currentAllFilterState,
        [labelId]: newFilterAllArray,
      },
    }, () => {
      this.queryPeopleOfLabel({
        labelId,
        curPageNum: INITIAL_PAGE_NUM,
        pageSize: INITIAL_PAGE_SIZE,
        filter: newFilterArray,
      });
    });
  }

  @autobind
  renderBottomButton() {
    return (<div>
      <Button
        className={styles.modalButton}
        key="cancle"
        size="large"
        onClick={this.handleCancel}
      >取消</Button>
      <Button
        className={styles.modalButton}
        key="confirm"
        size="large"
        type="primary"
        onClick={this.handleAccept}
      >确定</Button>
    </div>);
  }

  render() {
    const {
      curPageNum = INITIAL_PAGE_NUM,
      custTableData,
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      filterNumObject,
    } = this.state;

    const {
      dict,
      sightingTelescopeFilters,
      currentModalKey,
      currentSelectLabelName,
      modalVisible,
      labelId,
      currentSource,
    } = this.props;

    const currentItems = currentFilterObject[labelId] || [];
    const currentAllItems = currentAllFilterState[labelId] || [];
    const filtersCloseIconState = allFiltersCloseIconState[labelId] || [];
    const totalRecordNum = filterNumObject[labelId] || 0;

    return (
      <Modal
        visible={modalVisible}
        title={currentSelectLabelName || ''}
        maskClosable={false}
        // 关闭弹框时，销毁子元素，不然数据会复用,antd升级这个api才会有，所以先用key代替这个api
        destroyOnClose
        key={currentModalKey}
        onCancel={this.handleCancel}
        width={1090}
        footer={this.renderBottomButton()}
        wrapClassName={styles.labelCustModalContainer}
      >
        <FilterCustomers
          dict={dict}
          currentItems={currentItems}
          currentAllItems={currentAllItems}
          filtersCloseIconState={filtersCloseIconState}
          onFilterChange={this.handleFilterChange}
          onCloseIconClick={this.onCloseIconClick}
          onCheckMoreButton={this.onCheckFilterMoreButton}
          source={currentSource}
          sightingTelescopeFilters={sightingTelescopeFilters}
        />
        {
          _.isEmpty(custTableData) ?
            <div className={styles.emptyContent}>
              <span>
                <Icon className={styles.emptyIcon} type="frown-o" />
                暂无数据
                </span>
            </div> :
            <Table
              pageData={{
                curPageNum,
                curPageSize: INITIAL_PAGE_SIZE,
                totalRecordNum,
              }}
              tableClass={
                classnames({
                  [styles.labelCustTable]: true,
                })
              }
              isFixedTitle={false}
              onSizeChange={this.handleShowSizeChange}
              onPageChange={this.handlePageChange}
              listData={custTableData}
              titleColumn={renderColumnTitle}
              isFirstColumnLink={false}
              columnWidth={100}
            />
        }
      </Modal>
    );
  }
}
