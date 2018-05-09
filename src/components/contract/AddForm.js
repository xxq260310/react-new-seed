/*
* @Description: 合作合约新建 页面
* @Author: XuWenKang
* @Date:   2017-09-21 15:17:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-24 20:46:08
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import BaseInfoAdd from './BaseInfoAdd';
// import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import CommonUpload from '../common/biz/CommonUpload';
import Button from '../common/Button';
import AddClause from './AddClause';
import logable, { logPV } from '../../decorators/logable';

import { seibelConfig } from '../../config';
import styles from './addForm.less';
// 订购的类型
const { contract: { subscribe } } = seibelConfig;
// 合约条款的表头
const { contract: { titleList } } = seibelConfig;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const BOOL_TRUE = true;

export default class AddForm extends PureComponent {
  static propTypes = {
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 查询客户列表
    onSearchCutList: PropTypes.func.isRequired,
    onChangeForm: PropTypes.func.isRequired,
    // 查询合约编号
    onSearchContractNum: PropTypes.func.isRequired,
    // 查询合约详情
    onSearchContractDetail: PropTypes.func.isRequired,
    // 合约编号列表
    contractNumList: PropTypes.array.isRequired,
    // 合约详情
    contractDetail: PropTypes.object,
    // 条款名称列表
    clauseNameList: PropTypes.array.isRequired,
    // 合作部门列表
    searchCooperDeparment: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
    approverList: PropTypes.array,
    // 审批人
    getFlowStepInfo: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    // 清除退订时所查询合约详情
    resetUnsubscribeDetail: PropTypes.func.isRequired,
    // 清除部门数据
    clearDepartmentData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    contractDetail: EMPTY_OBJECT,
    approverList: EMPTY_ARRAY,
    // 审批人
    flowStepInfo: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        formType: 'add',
        uuid: '',
        terms: [],
      },
      // 是否显示添加合约条款组件
      addClauseModal: false,
      // 操作类型
      operationType: subscribe,
      // 合约条款默认数据
      defaultData: {},
      // 是否是编辑
      editClause: false,
    };
  }

  componentDidMount() {
    const { onSearchCutList } = this.props;
    onSearchCutList();
  }

  // 更新数据到父组件
  @autobind
  handleChangeBaseInfo(data) {
    const { formData } = this.state;
    this.setState({
      ...this.state,
      operationType: data.workflowname,
      formData: Object.assign(formData, data),
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  // 根据关键词查询客户
  @autobind
  handleSearchClient(value) {
    const { onSearchCutList } = this.props;
    onSearchCutList(value);
  }

  // 查询合约编号列表
  @autobind
  handleSearchContractNum(data) {
    if (data.subType && data.client.cusId) {
      this.props.onSearchContractNum(data);
    }
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    this.props.onSearchContractDetail(data);
  }

  // 文件上传成功
  @autobind
  handleUploadSuccess(attachment) {
    const {
      operationType,
    } = this.state;
    let uuid = '';
    let tduuid = '';
    if (operationType === subscribe) {
      uuid = attachment;
    } else {
      tduuid = attachment;
    }
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        uuid,
        tduuid,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  // 添加合约条款
  @autobind
  handleAddClause(termData) {
    const { formData: { terms } } = this.state;
    const { edit, editIndex, termItem } = termData;
    const newTerms = terms;
    if (edit) {
      newTerms[editIndex] = termItem;
    } else {
      newTerms.push(termItem);
    }
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        terms: newTerms,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
      this.closeModal('addClauseModal');
    });
  }

  // 子组件更改操作类型/重新关闭打开弹窗 重置所有数据
  @autobind
  handleReset() {
    const formData = {
      formType: 'add',
      terms: [],
    };
    this.setState({
      ...this.state,
      formData,
    }, () => {
      if (this.BaseInfoAddComponent) {
        this.BaseInfoAddComponent.resetState();
      }
    });
  }

  // 打开弹窗
  @autobind
  @logPV({ pathname: '/modal/showProtocol', title: '打开合作合约条款弹框' })
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
      defaultData: {},
      editClause: false,
    });
  }

  // 表格编辑事件
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '合约条款编辑',
    },
  })
  editTableData(record, index) {
    // 更新数据，打开合约条款弹窗
    this.setState({
      editClause: true,
      defaultData: {
        data: record,
        index,
      },
    }, this.showModal('addClauseModal'));
  }
  // 表格删除事件
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '合约条款删除',
    },
  })
  deleteTableData(record, index) {
    const { formData: { terms } } = this.state;
    const testArr = _.cloneDeep(terms);
    const newTerms = _.remove(testArr, (n, i) => i !== index);
    this.setState({
      formData: {
        ...this.state.formData,
        terms: newTerms,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  render() {
    const {
      custList,
      contractDetail,
      contractNumList,
      clauseNameList,
      cooperDeparment,
      searchCooperDeparment,
      getFlowStepInfo,
      resetUnsubscribeDetail,
      clearDepartmentData,
    } = this.props;
    const {
      formData,
      addClauseModal,
      operationType,
      defaultData,
      editClause,
    } = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: () => this.showModal('addClauseModal'),
    };
    const termsData = (operationType === subscribe) ? formData.terms : contractDetail.terms || [];

    // 表格中需要的操作
    const operation = operationType === subscribe ? {
      column: {
        key: [
          {
            key: 'beizhu',
            operate: this.editTableData,
          },
          {
            key: 'shanchu',
            operate: this.deleteTableData,
          },
        ], // 'check'\'delete'\'view'
        title: '操作',
      },
    } : null;
    return (
      <div className={styles.editComponent}>
        <BaseInfoAdd
          contractName="合约名称"
          childType={{ list: EMPTY_ARRAY }}
          client={EMPTY_OBJECT}
          custList={custList}
          contractDetail={contractDetail}
          contractNumList={contractNumList}
          onChange={this.handleChangeBaseInfo}
          onSearchClient={this.handleSearchClient}
          onSearchContractNum={this.handleSearchContractNum}
          onSearchContractDetail={this.handleSearchContractDetail}
          onReset={this.handleReset}
          getFlowStepInfo={getFlowStepInfo}
          resetUnsubscribeDetail={resetUnsubscribeDetail}
          ref={(BaseInfoAddComponent) => { this.BaseInfoAddComponent = BaseInfoAddComponent; }}
        />
        <div className={styles.editWrapper}>
          <InfoTitle
            head="合约条款"
            isRequired
          />
          {
            operationType === subscribe ?
              <Button {...buttonProps}>新建</Button>
            :
            null
          }
          <CommonTable
            data={termsData}
            titleList={titleList}
            operation={operation}
          />
        </div>
        <InfoTitle head="附件" />
        <CommonUpload
          attachmentList={EMPTY_ARRAY}
          edit={BOOL_TRUE}
          uploadAttachment={this.handleUploadSuccess}
          attachment={''}
          needDefaultText={false}
        />
        <div className={styles.cutSpace} />
        {
          addClauseModal ?
            <AddClause
              isShow={addClauseModal}
              onConfirm={this.handleAddClause}
              onCloseModal={() => this.closeModal('addClauseModal')}
              edit={editClause}
              clauseNameList={clauseNameList}
              departmentList={cooperDeparment}
              searchDepartment={searchCooperDeparment}
              defaultData={defaultData}
              clearDepartmentData={clearDepartmentData}
            />
          :
            null
        }
      </div>
    );
  }
}
