/**
 * @Author: sunweibin
 * @Date: 2017-11-04 13:37:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-21 10:49:07
 * @description 单佣金申请内容区域
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Icon } from 'antd';
import _ from 'lodash';

import ChoiceApproverBoard from './ChoiceApproverBoard';
import confirm from '../common/Confirm';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import AutoComplete from '../common/AutoComplete';
import CommissionLine from './CommissionLine';
import CommonUpload from '../common/biz/CommonUpload';
import Transfer from '../common/biz/TableTransfer';
import ThreeMatchTip from './ThreeMatchTip';
import OtherCommissionSelectList from './OtherCommissionSelectList';
import { seibelConfig } from '../../config';
import {
  pagination,
  singleColumns,
} from './commissionTransferHelper/transferPropsHelper';
import createCommon from './commissionCreateCommon/common';
import styles from './createNewApprovalBoard.less';
import logable, { logPV } from '../../decorators/logable';

const { comsubs: commadj } = seibelConfig;

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});

// redux effects方法
const effects = {
  gj: 'commission/getSingleGJCommissionRate',
  productList: 'commission/getSingleComProductList',
  match: 'commission/queryThreeMatchInfo',
  approver: 'commission/getAprovalUserList',
  clearRedux: 'commission/clearReduxState',
  custCurrentCommission: 'commission/queryCustCurrentCommission',
};

// redux store
const mapStateToProps = state => ({
  // 目标股基佣金率码值列表
  gjList: state.commission.singleGJCommission,
  // 佣金产品列表
  productList: state.commission.singleComProductList,
  // 三匹配信息
  matchInfo: state.commission.threeMatchInfo,
  // 审批人员列表
  approverList: state.commission.approvalUserList,
  // 客户当前估计佣金率
  custCurrentCommission: state.commission.custCurrentCommission,
});

// redux dispatch
const mapDispatchToProps = {
  // 根据用户输入获取目标估计佣金率码值列表
  queryGj: getDataFunction(false, effects.gj),
  // 获取产品列表
  queryProductList: getDataFunction(false, effects.productList),
  // 查询三匹配信息
  query3Match: getDataFunction(false, effects.match),
  // 获取审批人员列表
  queryApprovalList: getDataFunction(false, effects.approver),
  // 清除Redux
  clearRedux: getDataFunction(false, effects.clearRedux),
  // 客户当前股基佣金率
  queryCustCurrentCommission: getDataFunction(false, effects.custCurrentCommission),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class SingleCreateBoard extends PureComponent {
  static propTypes = {
    // 登录人信息
    empInfo: PropTypes.object,
    // 客户
    customer: PropTypes.object,
    // 其他佣金费率选项
    otherRations: PropTypes.array,
    // 获取产品列表
    queryProductList: PropTypes.func.isRequired,
    // 佣金产品列表
    productList: PropTypes.array.isRequired,
    // 查询3匹配信息
    query3Match: PropTypes.func.isRequired,
    matchInfo: PropTypes.object.isRequired,
    // 目标股基佣金率码值列表
    gjList: PropTypes.array.isRequired,
    // 获取目标股基佣金率码值
    queryGj: PropTypes.func.isRequired,
    // 审批人列表
    approverList: PropTypes.array.isRequired,
    queryApprovalList: PropTypes.func.isRequired,
    clearRedux: PropTypes.func.isRequired,
    // 当前股基佣金率
    custCurrentCommission: PropTypes.object.isRequired,
    queryCustCurrentCommission: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customer: {},
    empInfo: {},
    otherRations: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 佣金调整的目标股基佣金率
      newCommission: '',
      // 用户选择的产品以及子产品
      userProductList: [],
      // 三匹配信息
      singleProductMatchInfo: [],
      // 目标股基佣金率与用户所选的产品列表佣金率总和的差值
      dValue: 0,
      // 附件信息id
      attachment: '',
      // 重置其他佣金费率
      otherComReset: new Date().getTime(),
      // 选择审批人的弹出层显示或隐藏
      choiceApprover: false,
      // 审批人
      approverName: '',
      approverId: '',
      // 当前股基佣金率
      newCurrentCommission: '--',
    };
  }

  componentDidMount() {
    // 进入页面查一把子类型的审批人列表
    const { empInfo: { empNum } } = this.props;
    const btnId = createCommon.getApprovalBtnID(commadj.single);
    this.props.queryApprovalList({
      loginUser: empNum,
      btnId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { customer } = nextProps;
    const { queryCustCurrentCommission } = this.props;
    if (customer !== this.props.customer && !_.isEmpty(customer)) {
      queryCustCurrentCommission({
        brokerNumber: customer.custEcom,
      }).then(() => {
        const { custCurrentCommission } = this.props;
        this.setState({
          newCurrentCommission: _.isEmpty(custCurrentCommission) ||
            _.isNull(custCurrentCommission.currentCommission) ? '--' : custCurrentCommission.currentCommission,
        });
      });
    }
  }

  // 获取用户选择的数据
  @autobind
  getData() {
    return this.state;
  }

  @autobind
  cleanRedux() {
    this.props.clearRedux({
      clearList: [
        { name: 'singleGJCommission' },
        { name: 'singleComProductList' },
        { name: 'matchInfo', value: {} },
      ],
    });
  }

  @autobind
  resetData() {
    this.cleanRedux();
    this.uploadComponent.resetUpload();
    this.setState({
      approverName: '',
      approverId: '',
      attachment: '',
      dValue: 0,
      newCommission: '',
      userProductList: [],
      singleProductMatchInfo: [],
      otherComReset: new Date().getTime(),
      newCurrentCommission: '--',
    });
  }

  // 客户输入目标股基佣金率调用方法
  @autobind
  changeTargetGJCommission(v) {
    // 单佣金 , 如果没有选择客户，提示用户选择客户
    const { customer, queryGj } = this.props;
    if (_.isEmpty(customer)) {
      confirm({
        content: '请先选择需要申请的客户',
      });
    } else {
      queryGj({
        custId: customer.id,
        commision: v,
      });
    }
  }

  // 切换目标产品股基佣金率
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '目标股基佣金率',
      value: '$args[0].codeValue',
    },
  })
  selectTargetGJCommission(v) {
    this.setState({
      newCommission: v.codeValue,
    });
    const { id } = this.props.customer; // 取出客户的row_id
    this.props.queryProductList({
      custRowId: id,
      commRate: v.codeValue,
    });
  }

  @autobind
  mergeSingleMatchInfo() {
    const { matchInfo: info } = this.props;
    const {
      riskRankMhrt,
      investProdMhrt,
      investTypeMhrt,
      productCode,
      isMatch,
    } = info;
    const matchInfo = {
      productCode,
      riskMatch: riskRankMhrt,
      prodMatch: investProdMhrt,
      termMatch: investTypeMhrt,
      isMatch,
    };
    const { singleProductMatchInfo } = this.state;
    const exsit = _.find(singleProductMatchInfo, o => o.productCode === productCode);
    if (!exsit) {
      this.setState({
        singleProductMatchInfo: [matchInfo, ...singleProductMatchInfo],
      });
    }
  }

  // 单佣金调整穿梭变化的时候处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '单佣金调整产品穿梭',
    },
  })
  handleParentProductAction(flag, item, array, dValue) {
    this.setState({
      userProductList: array,
      dValue,
    });
    if (flag === 'add') {
      // 如果是左侧列表添加到右侧列表,则需要查询三匹配信息
      const { prodCode } = item;
      const { customer } = this.props;
      this.props.query3Match({
        custRowId: customer.id,
        custType: customer.custType,
        prdCode: prodCode,
      }).then(this.mergeSingleMatchInfo);
    }
  }

  // 单佣金调整选择子产品的时候的处理程序
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '单佣金调整通过check框选择子产品',
    },
  })
  handleChildProductCheck(item, array) {
    this.setState({
      userProductList: array,
    });
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
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

  // 选择其他佣金比率
  @autobind
  changeOtherCommission(name, value) {
    this.setState({
      [name]: value,
    });
  }

  // CommonUpload组件实例
  @autobind
  uploadRef(input) {
    if (!input) return;
    this.uploadComponent = input.getWrappedInstance();
  }

  render() {
    const {
      customer,
      gjList,
      otherRations,
      approverList,
      productList,
    } = this.props;
    const {
      newCommission,
      otherComReset,
      approverName,
      approverId,
      choiceApprover,
      singleProductMatchInfo,
      userProductList,
      newCurrentCommission,
    } = this.state;

    const newApproverList = approverList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });

    // 给佣金率Column加一个render属性
    const treatedColumns = singleColumns.map((column, index) => {
      if (index === 2) {
        // 佣金率所在Column
        // const { title } = column;
        return {
          ...column,
        };
      }
      return column;
    });

    // 单佣金调整中的产品选择配置
    const singleTransferProps = {
      firstTitle: '可选佣金产品',
      secondTitle: '已选产品',
      firstData: productList,
      secondData: [],
      firstColumns: treatedColumns,
      secondColumns: treatedColumns,
      transferChange: this.handleParentProductAction,
      checkChange: this.handleChildProductCheck,
      rowKey: 'id',
      defaultCheckKey: 'xDefaultOpenFlag',
      placeholder: '产品代码/产品名称',
      pagination,
      aboutRate: [newCommission, 'prodRate'],
      supportSearchKey: [['prodCode'], ['prodName']],
      totalData: productList,
    };

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList: [],
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment: '',
      needDefaultText: false,
      ref: this.uploadRef,
    };

    const newCurrentCom = _.isEmpty(customer) ? '--' : `${newCurrentCommission}‰`;

    return (
      <div className={styles.contentBox}>
        {/* 佣金产品 */}
        <div className={styles.approvalBlock}>
          <InfoTitle head="佣金产品选择" />
          <ul className={styles.commissionUlBox}>
            <li className={styles.leftCurrentCom}>
              <InfoItem label="当前股基佣金率" value={newCurrentCom} width="110px" valueColor="#9b9b9b" />
            </li>
            <li className={styles.rightTargetCom}>
              <CommissionLine label="目标股基佣金率" labelWidth="110px" needInputBox={false} extra={createCommon.permil}>
                <AutoComplete
                  initValue={newCommission}
                  dataSource={gjList}
                  onChangeValue={this.changeTargetGJCommission}
                  onSelectValue={this.selectTargetGJCommission}
                  width="100px"
                />
              </CommissionLine>
            </li>
          </ul>
          <Transfer {...singleTransferProps} />
          <ThreeMatchTip info={singleProductMatchInfo} userList={userProductList} />
        </div>
        {/* 其他佣金费率 */}
        <div className={styles.approvalBlock}>
          <InfoTitle head="其他佣金费率" />
          {
            _.isEmpty(customer) ? null :
            (
              <OtherCommissionSelectList
                showTip
                reset={otherComReset}
                otherRatios={otherRations}
                onChange={this.changeOtherCommission}
                custOpenRzrq={customer.openRzrq}
                subType={commadj.single}
              />
            )
          }
        </div>
        {/* 附件信息 */}
        <div className={styles.approvalBlock}>
          <InfoTitle head="附件信息" />
          <CommonUpload {...uploadProps} />
        </div>
        {/* 审批人 */}
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
