/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Select from '../Select';
import CustRange from '../../pageCommon/SeibelCustRange';
import DropDownSelect from '../dropdownSelect';
import Button from '../Button';
import Icon from '../Icon';
import styles from '../../style/jiraLayout.less';
import contractHelper from '../../../helper/page/contract';
import { dom, permission } from '../../../helper';
import { fspContainer, seibelConfig } from '../../../config';
import logable from '../../../decorators/logable';

const {
  contract: { pageType: contractPageType },
  channelsTypeProtocol: { pageType: channelsPageType },
  filialeCustTransfer: { pageType: filialeCustTransfer },
} = seibelConfig;

// 头部筛选filterBox的高度
const FILTERBOX_HEIGHT = 32;

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 页面
    page: PropTypes.string,
    // 子类型
    subtypeOptions: PropTypes.array,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 操作类型
    needOperate: PropTypes.bool,
    // 是否需要子类型
    needSubType: PropTypes.bool,
    operateOptions: PropTypes.array,
    // 新建权限
    empInfo: PropTypes.object,
    // 页面类型
    pageType: PropTypes.string.isRequired,
    // 部门列表
    custRange: PropTypes.array.isRequired,
    // 获取部门列表
    getCustRange: PropTypes.func.isRequired,
    // 拟稿人列表
    drafterList: PropTypes.array.isRequired,
    // 获取拟稿人列表
    getDrafterList: PropTypes.func.isRequired,
    // 已申请服务经理
    ptyMngList: PropTypes.array.isRequired,
    // 获取已申请的服务经理
    getPtyMngList: PropTypes.func.isRequired,
    // 审批人列表
    approvePersonList: PropTypes.array.isRequired,
    // 获取审批人列表
    getApprovePersonList: PropTypes.func.isRequired,
    // 客户列表
    customerList: PropTypes.array.isRequired,
    // 获取客户列表
    getCustomerList: PropTypes.func.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
    // 该项目是针对客户还是针对服务经理的，为false代表针对服务经理的，默认为true针对客户的
    isUseOfCustomer: PropTypes.bool,
    // 判断登录人当前切换的职位所在部门为分公司层级
    checkUserIsFiliale: PropTypes.func,
  }

  static defaultProps = {
    page: '',
    needOperate: false,
    needSubType: true,
    operateOptions: [],
    empInfo: {},
    subtypeOptions: [],
    filterCallback: _.noop,
    isUseOfCustomer: true,
    checkUserIsFiliale: _.noop,
  }

  constructor(props) {
    super(props);
    this.state = {
      showMore: true,
    };
  }

  componentWillMount() {
    this.props.getCustRange({
      type: this.props.pageType,
    });
  }

  componentDidUpdate() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.onWindowResize, false);
      sidebarShowBtn.addEventListener('click', this.onWindowResize, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.onWindowResize, false);
      sidebarShowBtn.removeEventListener('click', this.onWindowResize, false);
    }
  }

  @autobind
  onWindowResize() {
    const filterBoxHeight = this.filterBox.getBoundingClientRect().height;
    if (filterBoxHeight <= FILTERBOX_HEIGHT) {
      dom.removeClass(this.filterMore, 'filterMoreIcon');
      dom.addClass(this.filterMore, 'filterNoneIcon');
    } else {
      dom.removeClass(this.filterMore, 'filterNoneIcon');
      dom.addClass(this.filterMore, 'filterMoreIcon');
    }
  }

  @autobind
  pageCommonHeaderRef(input) {
    this.pageCommonHeader = input;
  }

  @autobind
  filterBoxRef(input) {
    this.filterBox = input;
  }

  @autobind
  filterMoreRef(input) {
    this.filterMore = input;
  }

  @autobind
  handleMoreChange() {
    this.setState({
      showMore: !this.state.showMore,
    });
    if (this.state.showMore) {
      dom.addClass(this.pageCommonHeader, 'HeaderOverflow');
    } else {
      dom.removeClass(this.pageCommonHeader, 'HeaderOverflow');
    }
    this.onWindowResize();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '更多' } })
  handleMore() {
    this.handleMoreChange();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '收起' } })
  handleShrik() {
    this.handleMoreChange();
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].custName',
    },
  })
  selectCustItem(item) {
    const { filterCallback } = this.props;
    filterCallback({
      custNumber: item.custNumber,
    });
  }

  // 选中拟稿人/审批人下拉对象中对应的某个对象
  @autobind
  selectItem(name, item) {
    const { filterCallback } = this.props;
    filterCallback({
      [name]: item.ptyMngId,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务经理',
      value: '$args[1].ptyMngName',
    },
  })
  handleManagerSelect(name, item) {
    this.selectItem(name, item);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '拟稿人',
      value: '$args[1].ptyMngName',
    },
  })
  handleDrafterSelect(name, item) {
    this.selectItem(name, item);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '审批人',
      value: '$args[1].ptyMngName',
    },
  })
  handleApproverSelect(name, item) {
    this.selectItem(name, item);
  }

  // 选中部门下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '部门',
      value: '$args[0].orgId',
    },
  })
  selectCustRange(obj) {
    const { filterCallback } = this.props;
    filterCallback({
      orgId: obj.orgId,
    });
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { filterCallback } = this.props;
    filterCallback({
      [key]: v,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '操作类型',
      value: '$args[1]',
    },
  })
  handleOperateTypeChange(key, v) {
    this.handleSelectChange(key, v);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[1]',
    },
  })
  handleSubtypeChange(key, v) {
    this.handleSelectChange(key, v);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleStatusChange(key, v) {
    this.handleSelectChange(key, v);
  }

  @autobind
  handleCreate() {
    this.props.creatSeibelModal();
  }

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  toSearch(method, value) {
    method({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字查询客户' } })
  handleCustSearch(value) {
    this.props.getCustomerList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字查询服务经理' } })
  handleManagerSearch(value) {
    this.props.getPtyMngList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字查询拟稿人' } })
  handleDrafterSearch(value) {
    this.props.getDrafterList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字查询审批人' } })
  handleApproverSearch(value) {
    this.props.getApprovePersonList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  render() {
    const {
      subtypeOptions,
      stateOptions,
      drafterList,
      approvePersonList,
      customerList,
      custRange,
      replace,
      page,
      pageType,
      operateOptions,
      needOperate,
      needSubType,
      empInfo,
      isUseOfCustomer,
      ptyMngList,
      checkUserIsFiliale,
      location: {
        query: {
          custNumber,
          drafterId,
          approvalId,
          ptyMngId,
          orgId,
          subType,
          status,
          business2,
        },
      },
    } = this.props;

    const ptyMngAll = { ptyMngName: '全部', ptyMngId: '' };
    // 客户增加全部
    const customerAllList = !_.isEmpty(customerList) ?
      [{ custName: '全部', custNumber: '' }, ...customerList] : customerList;
    // 客户回填
    const curCustInfo = _.find(customerList, o => o.custNumber === custNumber);
    let curCust = '全部';
    if (curCustInfo && curCustInfo.custNumber) {
      curCust = `${curCustInfo.custName}(${curCustInfo.custNumber})`;
    }

    // 增加已申请服务经理的全部
    const ptyMngAllList = !_.isEmpty(ptyMngList) ?
      [ptyMngAll, ...ptyMngList] : ptyMngList;
    // 已申请服务经理的回填
    const curPtyMngInfo = _.find(ptyMngList, o => o.ptyMngId === ptyMngId);
    let curPtyMng = '全部';
    if (curPtyMngInfo && curPtyMngInfo.ptyMngId) {
      curPtyMng = `${curPtyMngInfo.ptyMngName}(${curPtyMngInfo.ptyMngId})`;
    }

    // 拟稿人增加全部
    const drafterAllList = !_.isEmpty(drafterList) ?
      [ptyMngAll, ...drafterList] : drafterList;
    // 拟稿人回填
    const curDrafterInfo = _.find(drafterList, o => o.ptyMngId === drafterId);
    let curDrafter = '全部';
    if (curDrafterInfo && curDrafterInfo.ptyMngId) {
      curDrafter = `${curDrafterInfo.ptyMngName}(${curDrafterInfo.ptyMngId})`;
    }

    // 审批人增加全部
    const approvePersonAllList = !_.isEmpty(approvePersonList) ?
      [ptyMngAll, ...approvePersonList] : approvePersonList;
    // 审批人回填
    const curApprovePersonInfo = _.find(approvePersonList, o => o.ptyMngId === approvalId);
    let curApprovePerson = '全部';
    if (curApprovePersonInfo && curApprovePersonInfo.ptyMngId) {
      curApprovePerson = `${curApprovePersonInfo.ptyMngName}(${curApprovePersonInfo.ptyMngId})`;
    }


    // 新建按钮权限
    let hasCreatePermission = true;
    // 如果是合作合约页面
    if (pageType === contractPageType) {
      hasCreatePermission = contractHelper.hasPermission(empInfo);
    } else if (pageType === channelsPageType) {
      // 如果是通道类协议页面
      hasCreatePermission = permission.hasPermissionOfProtocolCreate(empInfo);
    } else if (pageType === filialeCustTransfer) {
      // 如果分公司客户人工划转,是分公司并且是HTSC 客户分配岗
      hasCreatePermission = permission.hasFilialeCustTransferCreate(empInfo) &&
        checkUserIsFiliale();
    }
    return (
      <div className={styles.pageCommonHeader} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>
          {
            isUseOfCustomer ?
              <div className={styles.filterFl}>
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={curCust}
                    placeholder="经纪客户号/客户名称"
                    searchList={customerAllList}
                    showObjKey="custName"
                    objId="custNumber"
                    emitSelectItem={this.selectCustItem}
                    emitToSearch={this.handleCustSearch}
                    name={`${page}-custName`}
                  />
                </div>
              </div>
            :
              <div className={styles.filterFl}>
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={curPtyMng}
                    placeholder="服务经理工号/名称"
                    searchList={ptyMngAllList}
                    showObjKey="ptyMngName"
                    objId="ptyMngId"
                    emitSelectItem={item => this.handleManagerSelect('ptyMngId', item)}
                    emitToSearch={this.handleManagerSearch}
                    name={`${page}-ptyMngName`}
                  />
                </div>
              </div>
          }
          {
            needOperate ?
              <div className={styles.filterFl}>
                操作类型:
                <Select
                  name="business2"
                  value={business2}
                  data={operateOptions}
                  onChange={this.handleOperateTypeChange}
                />
              </div>
            : null
          }
          {
            needSubType ?
              <div className={styles.filterFl}>
                子类型:
                <Select
                  name="subType"
                  value={subType}
                  data={subtypeOptions}
                  onChange={this.handleSubtypeChange}
                />
              </div>
            : null
          }
          <div className={styles.filterFl}>
            状态:
            <Select
              name="status"
              value={status}
              data={stateOptions}
              onChange={this.handleStatusChange}
            />
          </div>

          <div className={styles.filterFl}>
            拟稿人:
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value={curDrafter}
                placeholder="工号/名称"
                searchList={drafterAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={item => this.handleDrafterSelect('drafterId', item)}
                emitToSearch={this.handleDrafterSearch}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>

          <div className={styles.filterFl}>
            部门:
            <CustRange
              style={{ width: '20%' }}
              custRange={custRange}
              location={location}
              replace={replace}
              updateQueryState={this.selectCustRange}
              orgId={orgId}
            />
          </div>

          <div className={styles.filterFl}>
            审批人:
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value={curApprovePerson}
                placeholder="工号/名称"
                searchList={approvePersonAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={item => this.handleApproverSelect('approvalId', item)}
                emitToSearch={this.handleApproverSearch}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>
          {
            this.state.showMore ?
              <div
                className={styles.filterMore}
                onClick={this.handleMore}
                ref={this.filterMoreRef}
              >
                <span>更多</span>
                <Icon type="xiangxia" />
              </div>
              :
              <div
                className={styles.filterMore}
                onClick={this.handleShrik}
                ref={this.filterMoreRef}
              >
                <span>收起</span>
                <Icon type="xiangshang" />
              </div>
          }
        </div>
        {
          hasCreatePermission ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={() => { this.handleCreate(); }}
            >
              新建
            </Button>
            :
            null
        }
      </div>
    );
  }
}
