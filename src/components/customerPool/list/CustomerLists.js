/**
 * @file components/customerPool/list/CustomerLists.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Checkbox, message } from 'antd';
import SaleDepartmentFilter from './SaleDepartmentFilter';
import ServiceManagerFilter from './ServiceManagerFilter';
import CustomerRow from './CustomerRow';
import CreateContactModal from './CreateContactModal';
import Reorder from './Reorder';
import BottomFixedBox from './BottomFixedBox';
import { openInTab } from '../../../utils';
import { url as urlHelper, emp } from '../../../helper';
import NoData from '../common/NoData';
import Pagination from '../../common/Pagination';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import { ENTERLIST1, ENTERLIST2, MAIN_MAGEGER_ID, ALL_DEPARTMENT_ID } from '../../../routes/customerPool/config';
import logable from '../../../decorators/logable';
import styles from './customerLists.less';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
let modalKeyCount = 0;
// 服务营业中的'所有'选项
const allSaleDepartment = { id: ALL_DEPARTMENT_ID, name: '所有' };

/*
 * 格式化钱款数据和单位
 * 入参： 190000000 转化成 { value: '1.90', unit: '亿元' }
 */
const formatAsset = (num) => {
  // 数字常量
  const WAN = 1e4;
  const YI = 1e8;
  const WANYI = 1e12;

  // 单位常量
  const UNIT_DEFAULT = '元';
  const UNIT_WAN = '万元';
  const UNIT_YI = '亿元';
  const UNIT_WANYI = '万亿元';

  const newNum = Number(num);
  const absNum = Math.abs(newNum);

  if (absNum >= WANYI) {
    return {
      value: Number((newNum / WANYI).toFixed(2)),
      unit: UNIT_WANYI,
    };
  }
  if (absNum >= YI) {
    return {
      value: Number((newNum / YI).toFixed(2)),
      unit: UNIT_YI,
    };
  }
  if (absNum >= WAN) {
    return {
      value: Number((newNum / WAN).toFixed(2)),
      unit: UNIT_WAN,
    };
  }
  return { value: Number(newNum.toFixed(2)), unit: UNIT_DEFAULT };
};

@RestoreScrollTop
export default class CustomerLists extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    curPageNum: PropTypes.string,
    pageSize: PropTypes.string,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    q: PropTypes.string,
    monthlyProfits: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    entertype: PropTypes.string.isRequired,
    condition: PropTypes.object.isRequired,
    getCustContact: PropTypes.func.isRequired,
    getCustEmail: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    custContactData: PropTypes.object.isRequired,
    custEmail: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    reorderValue: PropTypes.object.isRequired,
    onReorderChange: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func,
    custRange: PropTypes.object.isRequired,
    expandAll: PropTypes.bool,
    orgId: PropTypes.string,
    searchServerPersonList: PropTypes.array.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    onRequestLoading: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    handleAddServiceRecord: PropTypes.func.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    custServedByPostnResult: PropTypes.bool.isRequired,
    hasTkMampPermission: PropTypes.bool.isRequired,
    hasIndexViewPermission: PropTypes.bool.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
    custIncomeReqState: false,
    filesList: [],
    expandAll: false,
    orgId: null,
    collectCustRange: () => { },
  }

  static contextTypes = {
    getSearchServerPersonList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentCustId: '',
      isShowContactModal: false,
      modalKey: `modalKeyCount${modalKeyCount}`,
      emailCustId: '',
    };
    this.checkMainServiceManager(props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      custContactData: prevCustContactData = EMPTY_OBJECT,
      serviceRecordData: prevServiceRecordData = EMPTY_ARRAY,
      custEmail,
      location: {
        query: {
          ptyMngId: prePtyMngId,
        },
      },
     } = this.props;
    const {
      custContactData: nextCustContactData = EMPTY_OBJECT,
      serviceRecordData: nextServiceRecordData = EMPTY_ARRAY,
      custEmail: nextCustEmail,
      location: {
        query: {
          ptyMngId,
        },
      },
     } = nextProps;
    const { currentCustId, isShowContactModal } = this.state;
    const prevContact = prevCustContactData[currentCustId] || EMPTY_OBJECT;
    const nextContact = nextCustContactData[currentCustId] || EMPTY_OBJECT;
    const prevRecord = prevServiceRecordData[currentCustId] || EMPTY_OBJECT;
    const nextRecord = nextServiceRecordData[currentCustId] || EMPTY_OBJECT;
    if ((prevContact !== nextContact || prevRecord !== nextRecord)) {
      if (!isShowContactModal) {
        this.setState({
          isShowContactModal: true,
          modalKey: `modalKeyCount${modalKeyCount++}`,
        });
      }
    }
    if (custEmail !== nextCustEmail) {
      this.getEmail(nextCustEmail[currentCustId]);
    }
    if (prePtyMngId !== ptyMngId) {
      this.checkMainServiceManager(nextProps);
    }
  }

  // 判断已有信息邮箱是否存在
  @autobind
  getEmail(address) {
    let finded = 0;// 邮件联系
    if (!_.isEmpty(address.orgCustomerContactInfoList)) {
      const index = _.findLastIndex(address.orgCustomerContactInfoList,
        val => val.mainFlag);
      finded = _.findLastIndex(address.orgCustomerContactInfoList[index].emailAddresses,
        val => val.mainFlag);
    } else if (!_.isEmpty(address.perCustomerContactInfo)) {
      finded = _.findLastIndex(address.perCustomerContactInfo.emailAddresses,
        val => val.mainFlag);
    } else {
      finded = -1;
    }
    if (finded === -1) {
      message.error('暂无客户邮箱，请与客户沟通尽快完善信息');
    }
  }

  /**
   * 判断当前登录用户是否为主服务经理
   */
  @autobind
  checkMainServiceManager(props) {
    const { location: { query: { ptyMngId } } } = props;
    const isMyCustomer = ptyMngId ? ptyMngId === emp.getId() : this.orgIdIsMsm();
    // 是否主服务经理
    this.mainServiceManager = !!(isMyCustomer) || !this.hasPermission();
  }

  // 没有 任务管理权限从首页搜索、热词、联想和潜在业务 或 绩效指标的客户范围为 我的客户 下钻到列表
  @autobind
  orgIdIsMsm() {
    const { location: { query: { orgId = '' } } } = this.props;
    return orgId === MAIN_MAGEGER_ID;
  }

  /**
   * 单选列表中的数据
   * 数据： url中：selectedIds=id1.name1,id2.name2,id3.name3
   * 逻辑：
   * url中没有selectedIds时，选中id=id1， selectedIds=id1.name1
   * url中selectedIds=id1.name1,id2.name2，并且选中id=id1，过滤id1.name1 => selectedIds=id1.name1
   * url中selectedIds=id1.name1，并且选中id=id2时  => selectedIds=id1.name1,id2.name2
  */
  @autobind
  handleSingleSelect(id, name) {
    const {
      replace,
      location: {
        query,
        pathname,
      },
    } = this.props;
    const { selectedIds } = query;
    const cur = `${id}.${name}`;
    let tmpStr = '';
    if (!selectedIds) {
      tmpStr = cur;
    } else {
      const selectedIdsArr = selectedIds.split(',');
      tmpStr = _.includes(selectedIdsArr, cur) ?
        selectedIdsArr.filter(v => v !== cur).join(',') :
        [...selectedIdsArr, cur].join(',');
    }
    replace({
      pathname,
      query: {
        ...query,
        selectedIds: tmpStr,
        selectAll: false,
      },
    });
  }

  // 点击全选，获取按钮的状态赋值url中的selectAll,并且将selectedIds置空
  @autobind
  @logable({ type: 'Click', payload: { name: '全选' } })
  selectAll(e) {
    const status = e.target.checked;
    const {
      replace,
      location: { query, pathname },
      handleCheck,
    } = this.props;
    // 手动发送日志
    handleCheck({ param: 'check_all' });

    replace({
      pathname,
      query: {
        ...query,
        selectedIds: '',
        selectAll: status,
      },
    });
  }

  @autobind
  showCreateContact({ custName, custId, custType }) {
    const {
      getCustContact,
      getServiceRecord,
      custContactData,
      onRequestLoading,
    } = this.props;
    this.setState({
      custName,
      currentCustId: custId,
      custType,
    }, () => {
      if (_.isEmpty(custContactData[custId])) {
        getCustContact({
          custId,
        });
      } else {
        this.setState({
          isShowContactModal: true,
          modalKey: `modalKeyCount${modalKeyCount++}`,
        });
      }
      // 请求服务记录不需要作缓存
      getServiceRecord({
        custId,
      });
      onRequestLoading();
    });
  }

  @autobind
  handleSendEmail(item) {
    const { getCustEmail } = this.props;
    const { custId } = item;
    getCustEmail({
      custId,
    });
    this.setState({
      currentCustId: custId,
      emailCustId: custId,
    });
  }

  /**
 * 回调，关闭modal打开state
 */
  @autobind
  resetModalState() {
    this.setState({
      isShowContactModal: false,
    });
  }

  // 选服务经理
  @autobind
  dropdownSelectedItem(item) {
    const {
      location: {
        query,
      pathname,
      },
      replace,
      handleSelect,
    } = this.props;

    const ptyMng = `${item.ptyMngName}_${item.ptyMngId}`;
    // 手动上传日志
    handleSelect({ param: ptyMng });

    replace({
      pathname,
      query: {
        ...query,
        ptyMngId: item.ptyMngId,
        ptyMngName: encodeURIComponent(item.ptyMngName),
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  @autobind
  dropdownToSearchInfo(value) {
    const { handleSearch } = this.props;
    handleSearch({ param: `keyword_${value}` });
    // 下拉菜单搜错查询关键字
    this.context.getSearchServerPersonList(value);
  }

  // 服务营业部
  @autobind
  changeSaleDepartment(state) {
    const {
      replace,
      location: { query, pathname },
      handleSelect,
    } = this.props;
    const { orgId } = state;
    const obj = {};
    if (orgId) {
      obj.departmentOrgId = orgId;
    }
    // 手动上传日志
    handleSelect({ param: obj.orgId });

    replace({
      pathname,
      query: {
        ...query,
        ...obj,
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  // 跳转到分组页面或新建任务页面
  @autobind
  goGroupOrTask({ id, title, url, obj, shouldStay, editPane }) {
    const { push } = this.props;
    const newurl = `${url}?${urlHelper.stringify(obj)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id,
      title,
    };
    openInTab({
      routerAction: push,
      url: newurl,
      param,
      pathname: url,
      query: obj,
      shouldStay,
      editPane,
    });
  }

  // 判断从首页不同入口处进入列表页有没有相应的权限
  @autobind
  hasPermission() {
    const {
      hasTkMampPermission,
      hasIndexViewPermission,
      location: { query: { source } },
    } = this.props;
    return (_.includes(ENTERLIST1, source) && hasTkMampPermission) ||
      (_.includes(ENTERLIST2, source) && hasIndexViewPermission);
  }

  /**
   * 根据不同的权限入口选择不同的服务营业部的下拉列表数据
   */
  @autobind
  switchCustRange() {
    const {
      custRange = {},
      location: { query: { source } },
    } = this.props;
    const { taskManagerResp = EMPTY_ARRAY, firstPageResp = EMPTY_ARRAY } = custRange;
    if (_.includes(ENTERLIST1, source)) {
      // 从首页的潜在业务点击进入的列表页
      if (this.orgIdIsMsm()) {
        return [allSaleDepartment, ...taskManagerResp];
      }
      return taskManagerResp;
    }
    if (_.includes(ENTERLIST2, source)) {
      // 有首页指标查询权限 且 首页绩效指标客户范围选中的是 我的客户
      if (this.orgIdIsMsm()) {
        return [allSaleDepartment, ...firstPageResp];
      }
      return firstPageResp;
    }
    return EMPTY_ARRAY;
  }

  render() {
    const {
      isShowContactModal,
      currentCustId,
      emailCustId,
      custType,
      modalKey,
      custName,
    } = this.state;

    const {
      q,
      page,
      custList,
      curPageNum,
      pageSize,
      onSizeChange,
      onPageChange,
      getCustIncome,
      monthlyProfits,
      location,
      custEmail,
      custContactData,
      serviceRecordData,
      dict,
      custIncomeReqState,
      toggleServiceRecordModal,
      onReorderChange,
      reorderValue,
      orgId,
      collectCustRange,
      expandAll,
      isLoadingEnd,
      searchServerPersonList,
      empInfo,
      handleCheck,
      handleCloseClick,
      handleAddServiceRecord,
      handleCollapseClick,
      getCeFileList,
      filesList,
      condition,
      push,
      entertype,
      clearCreateTaskData,
      queryCustUuid,
      custServedByPostnResult,
      hasTkMampPermission,
      sendCustsServedByPostnResult,
      isSendCustsServedByPostn,
    } = this.props;
    // console.log('1---', this.props)
    // 服务记录执行方式字典
    const { executeTypes = EMPTY_ARRAY, serveWay = EMPTY_ARRAY } = dict;
    const finalContactData = custContactData[currentCustId] || EMPTY_OBJECT;
    const finalEmailData = custEmail[emailCustId] || EMPTY_OBJECT;
    const finalServiceRecordData = serviceRecordData[currentCustId] || EMPTY_ARRAY;
    const {
      selectedIds = '',
      selectAll,
      ptyMngId,
      ptyMngName,
      departmentOrgId,
    } = location.query;
    const hasPermission = this.hasPermission();
    const orgIdIsMsm = this.orgIdIsMsm();
    // current: 默认第一页
    // pageSize: 默认每页大小20
    // curTotal: 当前列表数据总数
    let current = 1;
    let pagesize = 20;
    let curTotal = 0;
    if (curPageNum) {
      current = Number(curPageNum);
    } else {
      current = Number(page.pageNo);
    }
    if (pageSize) {
      pagesize = Number(pageSize);
    } else {
      pagesize = Number(page.pageSize);
    }
    if (page.total) {
      curTotal = Number(page.total);
    }
    const selectIdsArr = selectedIds ?
      selectedIds.split(',') : EMPTY_ARRAY;
    const isAllSelectBool = !((!selectAll || selectAll === 'false'));
    // 是否显示底部的发起任务和分组，全选或者有选中数据时才显示
    const BottomFixedBoxVisible = (!_.isEmpty(selectIdsArr) || isAllSelectBool);
    // 已选中的条数：选择全选显示所有数据量，非全选显示选中的条数
    const selectCount = isAllSelectBool ? page.total : selectIdsArr.length;
    // 默认服务经理
    let serviceManagerDefaultValue = `${empInfo.empName}（${empInfo.empNum}）`;
    // ‘HTSC 首页指标查询’ 权限, 任务管理权限
    if (hasPermission) {
      if (ptyMngId) {
        serviceManagerDefaultValue = `${decodeURIComponent(ptyMngName)}（${ptyMngId}）`;
      } else {
        serviceManagerDefaultValue = '所有人';
      }
    }
    if (orgId && orgIdIsMsm) {
      serviceManagerDefaultValue = `${empInfo.empName}（${empInfo.empNum}）`;
    }
    // 当前所处的orgId,默认所有
    let curOrgId = allSaleDepartment.id;
    // 根据url中的orgId赋值，没有时判断权限，有权限取岗位对应的orgId,无权限取‘all’
    if (departmentOrgId) {
      curOrgId = departmentOrgId;
    } else if (orgId) {
      // url中orgId=msm 时,服务营业部选中所有
      curOrgId = orgIdIsMsm ? allSaleDepartment.id : orgId;
    } else if (!this.mainServiceManager) {
      curOrgId = emp.getOrgId();
    }
    const paginationOption = {
      current,
      total: curTotal,
      pageSize: pagesize,
      onChange: onPageChange,
      onShowSizeChange: onSizeChange,
      isHideLastButton: true,
    };
    return (
      <div className="list-box">
        <div className={styles.listHeader}>
          <div className="selectAll">
            <Checkbox
              checked={isAllSelectBool}
              onChange={this.selectAll}
              disabled={_.isEmpty(custList)}
            >
              全选
            </Checkbox>
            {_.isEmpty(custList) ? null : <span className="hint">自动选择所有符合条件的客户</span>}
          </div>
          <div className={styles.reorder}>
            <Reorder
              value={reorderValue}
              onChange={onReorderChange}
            />
          </div>
          <div className={styles.reorder}>
            <div className={styles.selectBox}>
              <SaleDepartmentFilter
                orgId={curOrgId}
                custRange={this.switchCustRange()}
                updateQueryState={this.changeSaleDepartment}
                collectData={collectCustRange}
                expandAll={expandAll}
              />
            </div>
            <div className={styles.selectBox}>
              <ServiceManagerFilter
                disable={orgIdIsMsm}
                searchServerPersonList={searchServerPersonList}
                serviceManagerDefaultValue={serviceManagerDefaultValue}
                dropdownSelectedItem={this.dropdownSelectedItem}
                dropdownToSearchInfo={this.dropdownToSearchInfo}
              />
            </div>
          </div>
        </div>
        {
          !_.isEmpty(custList) ?
            <div className="list-wrapper">
              {
                custList.map(
                  item => <CustomerRow
                    empInfo={empInfo}
                    handleCheck={handleCheck}
                    dict={dict}
                    location={location}
                    getCustIncome={getCustIncome}
                    monthlyProfits={monthlyProfits}
                    listItem={item}
                    q={q}
                    isAllSelect={isAllSelectBool}
                    selectedIds={selectIdsArr}
                    onChange={this.handleSingleSelect}
                    onSendEmail={this.handleSendEmail}
                    createContact={this.showCreateContact}
                    key={`${item.empId}-${item.custId}-${item.idNum}-${item.telephone}-${item.asset}`}
                    custEmail={finalEmailData}
                    emailCustId={emailCustId}
                    custIncomeReqState={custIncomeReqState}
                    toggleServiceRecordModal={toggleServiceRecordModal}
                    formatAsset={formatAsset}
                    queryCustUuid={queryCustUuid}
                    condition={condition}
                    entertype={entertype}
                    goGroupOrTask={this.goGroupOrTask}
                    push={push}
                    custServedByPostnResult={custServedByPostnResult}
                  />,
                )
              }
            </div>
            : <NoData />
        }
        <div
          className="list-pagination"
        >
          <Pagination
            {...paginationOption}
          />
          {
            /*  <Checkbox
               checked={isAllSelectBool}
               onChange={this.selectAll}
               className={styles.selectAllTwo}
               disabled={_.isEmpty(custList)}
             >
               全选
           </Checkbox> */
          }
        </div>
        {
          BottomFixedBoxVisible ?
            <BottomFixedBox
              selectCount={selectCount}
              mainServiceManager={this.mainServiceManager}
              page={page}
              condition={condition}
              location={location}
              push={push}
              custList={custList}
              entertype={entertype}
              clearCreateTaskData={clearCreateTaskData}
              onClick={this.goGroupOrTask}
              hasTkMampPermission={hasTkMampPermission}
              sendCustsServedByPostnResult={sendCustsServedByPostnResult}
              isSendCustsServedByPostn={isSendCustsServedByPostn}
            /> : null
        }
        {
          (isShowContactModal && isLoadingEnd) ?
            <CreateContactModal
              handleCollapseClick={handleCollapseClick}
              handleAddServiceRecord={handleAddServiceRecord}
              handleCloseClick={handleCloseClick}
              key={modalKey}
              visible={isShowContactModal}
              custContactData={finalContactData}
              serviceRecordData={finalServiceRecordData}
              custType={custType}
              createServiceRecord={toggleServiceRecordModal} /* 创建服务记录 */
              onClose={this.resetModalState}
              currentCustId={currentCustId}
              currentCustName={custName}
              executeTypes={executeTypes}
              serveWay={serveWay}
              getCeFileList={getCeFileList}
              filesList={filesList}
            /> : null
        }
      </div>
    );
  }
}
