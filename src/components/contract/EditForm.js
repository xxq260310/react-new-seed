/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 13:35:31
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import ApproveList from '../common/approveList';
import Approval from '../permission/Approval';
import Button from '../common/Button';
import AddClause from './AddClause';

import { seibelConfig } from '../../config';
import { time } from '../../helper';
import styles from './editForm.less';
import logable, { logPV } from '../../decorators/logable';

// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
const EMPTY_PARAM = '暂无';
const BOOL_TRUE = true;
// 退订
const { contract: { unsubscribe } } = seibelConfig;
// 合约条款的表头、状态
const { contract: { titleList } } = seibelConfig;
export default class EditForm extends PureComponent {
  static propTypes = {
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 查询客户列表
    onSearchCutList: PropTypes.func.isRequired,
    onChangeForm: PropTypes.func.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
    // 条款名称列表
    clauseNameList: PropTypes.array.isRequired,
    // 合作部门列表
    searchCooperDeparment: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
    // 上传成功后的回调
    uploadAttachment: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    // 清除部门数据
    clearDepartmentData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    flowStepInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        ...props.contractDetail.baseInfo,
        formType: 'edit',
        terms: props.contractDetail.baseInfo.terms,
      },
      // 是否显示添加合约条款组件
      addClauseModal: false,
      // 审批意见
      appraval: '',
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

  // 处理接口返回的拟稿提请时间
  @autobind
  getCreatedDate(date) {
    if (date) {
      // return `${dateFormat(date.split(' ')[0])} ${date.split(' ')[1]}`;
      return time.format(date, 'YYYY-MM-DD HH:mm:ss');
    }
    return EMPTY_PARAM;
  }

  // 审批意见
  @autobind
  handleChangeAppraval(type, value) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        [type]: value,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  // 向父组件更新数据
  @autobind
  handleChangeBaseInfo(data) {
    const { formData } = this.state;
    this.setState({
      ...this.state,
      formData: Object.assign(formData, data),
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  // 上传文件成功
  @autobind
  handleUploadSuccess(attachment) {
    const { formData } = this.state;
    // applyType 值 1是订购。2是退订
    // 根据idKey，来区分是订购的，还是退订的附件
    const idKey = formData.applyType === '2' ? 'tduuid' : 'uuid';
    this.setState({
      ...this.state,
      formData: {
        ...formData,
        [idKey]: attachment,
      },
    }, () => {
      this.props.uploadAttachment(this.state.formData);
    });
  }

  // 合约条款弹窗提交事件
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
  // 打开弹窗
  @autobind
  @logPV({ pathname: '/modal/addClauseModal', title: '合约条款弹窗' })
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

  render() {
    const {
      contractDetail,
      clauseNameList,
      cooperDeparment,
      searchCooperDeparment,
      contractDetail: { baseInfo, attachmentList },
      clearDepartmentData,
    } = this.props;
    const {
      formData,
      addClauseModal,
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
    const draftInfo = {
      name: `${baseInfo.applyDiv || EMPTY_PARAM} ${baseInfo.applyName || EMPTY_PARAM}`,
      date: this.getCreatedDate(baseInfo.applyTime),
      status: baseInfo.status,
    };
    // 是否是退订
    const isSubscribe = baseInfo.applyType === unsubscribe;
    // 表格中需要的操作
    const operation = isSubscribe ? null : {
      column: {
        // beizhu = edit , shanchu = delete
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
    };
    return (
      <div className={styles.editComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{baseInfo.applyId}</span>
        </div>
        <BaseInfoEdit
          contractName="合约名称"
          contractDetail={contractDetail}
          onChange={this.handleChangeBaseInfo}
        />
        { /* 拟稿人信息 */ }
        <DraftInfo data={draftInfo} />
        <div className={styles.editWrapper}>
          <InfoTitle
            head="合约条款"
            isRequired
          />
          {
            isSubscribe ?
              null
            :
              <Button {...buttonProps}>新建</Button>
          }
          <CommonTable
            data={formData.terms}
            titleList={titleList}
            operation={operation}
          />
        </div>
        <UploadFile
          edit={BOOL_TRUE}
          fileList={attachmentList}
          attachment={isSubscribe ? baseInfo.tduuid : baseInfo.uuid}
          uploadAttachment={this.handleUploadSuccess}
        />
        <Approval
          type="appraval"
          head="审批"
          textValue={formData.appraval}
          onEmitEvent={this.handleChangeAppraval}
        />
        <div className={styles.editWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={contractDetail.flowHistory} />
        </div>
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
