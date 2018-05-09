/**
 * @Author: sunweibin
 * @Date: 2017-11-08 14:01:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-11 10:33:12
 * @description 批量佣金调整新建独自的页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import _ from 'lodash';

import ChoiceApproverBoard from './ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import confirm from '../common/Confirm';
import AddCustomer from './AddCustomer';
import InfoTitle from '../common/InfoTitle';
import CommissionLine from './CommissionLine';
import AutoComplete from '../common/AutoComplete';
import ProductsDropBox from './ProductsDropBox';
import OtherCommissionSelectList from './OtherCommissionSelectList';
import createCommon from './commissionCreateCommon/common';
import logable, { logPV } from '../../decorators/logable';

import styles from './createNewApprovalBoard.less';
import { allCommissionParamName as otherComs } from '../../config/otherCommissionDictionary';

const { commission: { pageType }, comsubs: commadj } = seibelConfig;

// redux effects
const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});

// redux effects方法
const effects = {
  gj: 'commission/getGJCommissionRate',
  productList: 'commission/getProductList',
  approver: 'commission/getAprovalUserList',
  applyCustList: 'commission/getCanApplyCustList',
  validate: 'commission/validateCustInfo',
};

// redux store
const mapStateToProps = state => ({
  // 目标股基佣金率码值列表
  gjList: state.commission.gjCommission,
  productList: state.commission.productList,
  // 审批人员列表
  approverList: state.commission.approvalUserList,
  // 验证结果描述
  validateResult: state.commission.validateResult,
  // 验证过程
  validataLoading: state.commission.validataLoading,
  // 可申请的客户列表
  customerList: state.commission.canApplyCustList,
});

// redux dispatch
const mapDispatchToProps = {
  // 获取批量佣金目标股基佣金率
  queryGj: getDataFunction(false, effects.gj),
  // 查询目标产品的列表
  queryProductList: getDataFunction(false, effects.productList),
  // 获取审批人员列表
  queryApprovalList: getDataFunction(false, effects.approver),
  // 通过关键字，查询可选的可申请用户列表
  queryApplyCust: getDataFunction(false, effects.applyCustList),
  // 校验用户资格
  validateCust: getDataFunction(false, effects.validate),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class BatchCreatBoard extends PureComponent {

  static propTypes = {
    // 登录人信息
    empInfo: PropTypes.object,
    // 目标股基佣金率码值列表
    gjList: PropTypes.array.isRequired,
    // 获取目标股基佣金率码值
    queryGj: PropTypes.func.isRequired,
    // 批量佣金调整的目标产品列表
    productList: PropTypes.array.isRequired,
    queryProductList: PropTypes.func.isRequired,
    // 其他佣金费率
    otherRatios: PropTypes.array.isRequired,
    // 审批人列表
    approverList: PropTypes.array.isRequired,
    queryApprovalList: PropTypes.func.isRequired,
    // 添加客户验证
    validataLoading: PropTypes.bool.isRequired,
    validateResult: PropTypes.string.isRequired,
    validateCust: PropTypes.func.isRequired,
    // 批量添加查询的用户列表
    customerList: PropTypes.array.isRequired,
    // 查询可申请的客户列表
    queryApplyCust: PropTypes.func.isRequired,
  }

  static defaultProps = {
    empInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 重置其他佣金费率
      otherComReset: new Date().getTime(),
      // 审批人
      approverName: '',
      approverId: '',
      // 目标股基佣金率
      newCommission: '',
      // 选择审批人的弹出层显示或隐藏
      choiceApprover: false,
      // 添加的用户列表
      custLists: [],
      targetProduct: '',
    };
  }

  componentDidMount() {
    // 进入页面查一把子类型的审批人列表
    const { empInfo: { empNum, occDivnNum } } = this.props;
    const btnId = createCommon.getApprovalBtnID(commadj.batch);
    this.props.queryApprovalList({
      loginUser: empNum,
      btnId,
    });
    // 初始化进入批量佣金调整的时候，先查一把0.16的佣金产品
    this.props.queryProductList({
      prodCommision: 0.16,
      orgId: occDivnNum,
    });
  }

  // 是外部能够获取到本组件选择的一些值
  @autobind
  userSelectData() {
    const needPassKeys = ['approverId', 'custLists', 'newCommission', 'targetProduct'];
    // 挑选出用户选择的其他佣金率
    const otherCommissions = _.pick(this.state, otherComs);
    const passValues = _.pick(this.state, needPassKeys);
    return {
      ...passValues,
      ...otherCommissions,
    };
  }

  // 添加客户组件
  @autobind
  addCustomerRef(input) {
    this.addCustomer = input;
  }

  // 根据目标佣金率查询批量佣金调整产品
  @autobind
  queryBatchProductList(param) {
    const { empInfo: { occDivnNum } } = this.props;
    this.props.queryProductList({ ...param, orgId: occDivnNum });
  }

  // 清空用户选择的客户列表
  @autobind
  clearCustList() {
    this.addCustomer.clearCustList();
  }

  // 客户输入目标股基佣金率调用方法
  @autobind
  changeTargetGJCommission(v) {
    // codeValue 为空，接口报错
    if (!_.isEmpty(v)) {
      // 批量
      this.props.queryGj({
        codeValue: v,
      });
    }
  }

  // 切换目标产品股基佣金率
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '目标股基佣金率',
      value: '$args[0].codeDesc',
    },
  })
  selectTargetGJCommission(v) {
    this.setState({
      newCommission: v.codeValue,
    });
    this.queryBatchProductList({ prodCommision: v.codeValue });
  }

  // 切换选择某个产品
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '目标产品',
      value: '$args[0]',
    },
  })
  handleSelectProduct(targetProduct) {
    this.setState({
      targetProduct,
    });
    if (!_.isEmpty(this.state.custLists)) {
      confirm({
        shortCut: 'changeproduct',
        onOk: this.clearCustList,
      });
    }
  }

  // 选择其他佣金比率
  @autobind
  changeOtherCommission(name, value) {
    this.setState({
      [name]: value,
    });
  }

  // 根据用户输入查询客户列表(批量佣金)
  @autobind
  handleCustomerListSearch(keyword) {
    this.props.queryApplyCust({
      keyword,
      type: pageType,
      subType: commadj.batch,
    });
  }

  // 将用户选择添加的客户列表返回到弹出层，以便提交试用（批量佣金）
  @autobind
  saveSelectedCustomerList(list) {
    this.setState({
      custLists: list,
    });
  }

  // 验证用户资格
  @autobind
  handleCustomerValidate(customer) {
    const { newCommission, targetProduct } = this.state;
    const { cusId, custType } = customer;
    if (_.isEmpty(targetProduct)) {
      message.error('请选择目标产品');
      return;
    }
    this.props.validateCust({
      businessType: 'BatchProcess',
      custId: cusId,
      custType,
      newCommission,
      prodCode: targetProduct,
      ignoreCatch: true,
    });
  }

  // 关闭审批人员选择弹出窗
  @autobind
  closeChoiceApproverModal() {
    this.setState({
      choiceApprover: false,
    });
  }

  // 打开选择审批人弹窗
  @autobind
  @logPV({ pathname: '/modal/choiceApproval', title: '选择审批人' })
  openApproverBoard() {
    this.setState({
      choiceApprover: true,
    });
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  render() {
    const {
      gjList,
      productList,
      otherRatios,
      approverList,
      validataLoading,
      validateResult,
      customerList,
    } = this.props;

    const {
      otherComReset,
      approverName,
      approverId,
      choiceApprover,
    } = this.state;

    const newApproverList = approverList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });

    return (
      <div className={styles.contentBox}>
        <div className={styles.approvalBlock}>
          <InfoTitle head="佣金产品选择" />
          <CommissionLine label="目标股基佣金率" labelWidth="135px" needInputBox={false} extra={createCommon.permil}>
            <AutoComplete
              dataSource={gjList}
              onChangeValue={this.changeTargetGJCommission}
              onSelectValue={this.selectTargetGJCommission}
              width="100px"
            />
          </CommissionLine>
          <CommissionLine label="目标产品" labelWidth="135px" needInputBox={false}>
            <ProductsDropBox
              productList={productList}
              onSelect={this.handleSelectProduct}
            />
          </CommissionLine>
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="其他佣金费率" />
          <OtherCommissionSelectList
            showTip={false}
            reset={otherComReset}
            otherRatios={otherRatios}
            onChange={this.changeOtherCommission}
            subType={commadj.batch}
          />
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="客户" />
          <AddCustomer
            onSearch={this.handleCustomerListSearch}
            passList2Home={this.saveSelectedCustomerList}
            onValidate={this.handleCustomerValidate}
            validateResult={validateResult}
            validataLoading={validataLoading}
            searchList={customerList}
            ref={this.addCustomerRef}
          />
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="审批人" />
          <CommissionLine label="选择审批人" labelWidth="110px">
            <div className={styles.checkApprover} onClick={this.openApproverBoard}>
              {approverName === '' ? '' : `${approverName}(${approverId})`}
              <div className={styles.searchIcon}>
                <Icon type="search" />
              </div>
            </div>
          </CommissionLine>
        </div>
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}
