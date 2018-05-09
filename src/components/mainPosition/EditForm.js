/**
 * @Author: hongguangqing
 * @Description: 服务经理主职位设置修改页面
 * @Date: 2018-02-28 14:44:53
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-03-05 17:00:58
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import InfoItem from '../common/infoItem';
import InfoTitle from '../common/InfoTitle';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import CommonTable from '../../components/common/biz/CommonTable';
import ApprovalRecord from '../permission/ApprovalRecord';
import config from './config';
import styles from './editForm.less';
import logable from '../../decorators/logable';

// 表头
const { mainPosition: { titleList, approvalColumns } } = config;
const REJECT_STATUS_CODE = '04'; // 驳回状态code
const COMMITOPERATE = 'commit'; // 提交的operate值

export default class CreateFilialeCustTransfer extends PureComponent {
  static propTypes = {
    // 详情列表
    data: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 新建（修改）接口
    updateApplication: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { buttonList, data } = props;
    const checkedRadio = _.findIndex(data.empPostns, ['primary', true]);
    this.state = {
      // 审批人弹窗
      nextApproverModal: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 客户选中的职位
      checkedRadio,
      // 默认选中的职位
      defaultChecked: checkedRadio,
      // 选中的职位的信息
      checkedEmployee: {},
      // 若disabled为true则说明用户没有选择新的主职位此时不给提交
      disabled: true,
      // 按钮组信息
      buttonListData: buttonList,
    };
  }


  componentWillMount() {
    const {
      flowId,
      statusCode,
    } = this.props.data;
    if (statusCode === REJECT_STATUS_CODE) {
      // 获取下一步骤按钮列表
      this.props.getButtonList({ flowId });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { buttonList } = nextProps;
    if (buttonList !== this.props.buttonList) {
      this.setState({ buttonListData: buttonList });
    }
  }

  // 选择某个职位
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '服务经理主职位设置',
    },
  })
  checkTableData(record, index) {
    const { defaultChecked } = this.state;
    const disabled = defaultChecked === index;
    this.setState({
      checkedRadio: index,
      checkedEmployee: record,
      disabled,
    });
  }

  // 提交
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].btnName' } })
  handleSubmit(item) {
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: !_.isEmpty(item.flowAuditors) ? item.flowAuditors[0].login : '',
      nextApproverList: item.flowAuditors,
    }, () => {
      // approverNum为none代表没有审批人，则不需要弹审批弹框直接走接口
      // 终止按钮的approverNum为none，提交按钮的approverNum不为none
      if (item.approverNum !== 'none') {
        this.setState({
          nextApproverModal: true,
        });
      } else {
        this.sendDoApproveRequest();
      }
    });
  }

  // 发送修改请求,先走修改接口，再走走流程接口
  @autobind
  sendModifyRequest(value) {
    const { updateApplication, data } = this.props;
    const { checkedEmployee } = this.state;
    if (_.isEmpty(value)) {
      message.error('请选择审批人');
      return;
    }
    this.setState({
      nextApproverModal: false,
    });
    const mainPtyMngInfo = _.find(data.empPostns, o => o.primary === true);
    updateApplication({
      targetEmpId: data.ptyMngId,
      postnId: !_.isEmpty(checkedEmployee) ? checkedEmployee.positionId : mainPtyMngInfo.positionId,
      appId: data.appId,
    }).then(() => {
      this.sendDoApproveRequest(value);
    });
  }

  // 发送请求，先走新建（修改）接口，再走走流程接口
  @autobind
  sendDoApproveRequest(value) {
    const {
      doApprove,
      getDetailInfo,
    } = this.props;
    const { flowId, appId } = this.props.data;
    const { groupName, auditors, operate } = this.state;
    doApprove({
      itemId: appId,
      flowId,
      wobNum: flowId,
      // 下一组ID
      groupName,
      auditors: !_.isEmpty(value) ? value.login : auditors,
      operate,
    }).then(() => {
      if (operate === COMMITOPERATE) {
        message.success('该服务经理主职位修改成功');
      } else {
        message.success('该服务经理主职位设置已被终止');
      }
      this.setState({
        buttonListData: [],
      }, () => {
        getDetailInfo({ flowId });
      });
    });
  }

  render() {
    const {
      checkedRadio,
      nextApproverModal,
      nextApproverList,
    } = this.state;
    const {
      id,
      ptyMngName,
      ptyMngId,
      empPostns,
      workflowHistoryBeans,
      currentApproval,
      orgName,
      empName,
      empId,
      createTime,
      status,
    } = this.props.data;
    const { buttonListData } = this.state;
    // 服务经理
    const empInfo = `${ptyMngName} (${ptyMngId})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    const operation = {
      column: {
        key: 'radio',
        title: '设为主要',
        align: 'right',
        radio: checkedRadio,
      },
      operate: this.checkTableData,
    };
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendModifyRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    return (
      <div className={styles.editFormBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <div className={styles.propertyList}>
                  <div className={styles.item}>
                    <InfoItem label="服务经理" value={empInfo} width="160px" />
                  </div>
                </div>
                <CommonTable
                  data={empPostns}
                  titleList={titleList}
                  operation={operation}
                />
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="提请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                statusType="modify"
              />
            </div>
            <div id="button_module" className={styles.buttonModule}>
              <BottonGroup
                list={buttonListData}
                onEmitEvent={this.handleSubmit}
              />
            </div>
            <TableDialog {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}
