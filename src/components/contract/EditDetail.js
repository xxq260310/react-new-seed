/*
 * @Description: 合作合约详情新建与编辑页面
 * @Author: LiuJianShu
 * @Date: 2017-09-28 14:54:18
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-29 21:41:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../common/infoForm';
import Select from '../common/Select';
import AutoComplete from '../common/similarAutoComplete';
import DatePicker from '../common/datePicker';
import ApproveList from '../common/approveList';
import styles from './editDetail.less';
import CommonUpload from '../common/biz/CommonUpload';
import CommonTable from '../common/biz/CommonTable';
import { seibelConfig } from '../../config';
import logable from '../../decorators/logable';

const { TextArea } = Input;
// 操作类型列表
const { contract: { operationList, subType, titleList } } = seibelConfig;
// 订购的值
const subscribeValue = operationList[0].value;
// 退订的类型
// const unsubscribe = operationList[1].value;
// 子类型列表
const childTypeList = _.filter(subType, v => v.label !== '全部');
// 时间选择组件样式
const datePickerBoxStyle = {
  width: 220,
  height: 32,
};
export default class EditDetail extends PureComponent {
  static propTypes = {
    // 弹窗类型
    modalType: PropTypes.string.isRequired,
    // 右侧详情基本信息
    baseInfo: PropTypes.object,
    // 附件列表
    attachmentList: PropTypes.array,
    // 上传成功回调
    uploadAttachment: PropTypes.func,
    // 可申请客户列表
    canApplyCustList: PropTypes.array.isRequired,
    // 获取可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    // 合约编号列表
    contractNumList: PropTypes.array,
    // 获取合约编号列表
    getContractNumList: PropTypes.func,
    // 传出 modal 里的数据
    saveModalData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    baseInfo: {},
    attachmentList: [],
    contractNumList: [],
    getContractNumList: () => {},
    uploadAttachment: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      childType: '',
      // 操作类型默认值
      operation: '1',
      // 弹窗类型
      modalType: props.modalType || 'add',
      // 合约开始日期
      contractStartDate: '',
      contractValidDate: '',
      contractEndDate: '',
      remark: '',
      contractNum: '',
      cust: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { modalType: preModalType } = this.props;
    const { modalType: nextModalType } = nextProps;
    if (!_.isEqual(preModalType, nextModalType)) {
      this.setState({
        modalType: nextModalType,
      });
    }
  }

  // 表格删除事件
  @autobind
  deleteTableData(record, index) {
    this.setState({
      radio: index,
    });
  }
  // 更新数据到父组件
  // @autobind
  // handleChangeBaseInfo(data) {
  //   const { formData } = this.state;
  //   this.setState({
  //     ...this.state,
  //     formData: Object.assign(formData, data),
  //   }, () => {
  //     this.props.onChangeForm(this.state.formData);
  //   });
  // }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    this.setState({
      ...this.state,
      [key]: value,
    }, () => this.props.saveModalData(this.state));
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '操作类型',
      value: '$args[1]',
    },
  })
  handleSelectOpereateType(key, value) {
    this.handleSelectChange(key, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[1]',
    },
  })
  handleSelectSubtype(key, value) {
    this.handleSelectChange(key, value);
  }
  // 选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0]',
    },
  })
  handleSelectCust(value) {
    this.setState({
      ...this.state,
      cust: value,
    }, () => this.props.saveModalData(this.state));

    // () => {
    //   this.props.onChange(this.state);
    //   const { operation, childType, client } = this.state;
    //   // 当前操作类型为“退订”并且子类型变化的时候触发合作合约编号查询
    //   if (operation === unsubscribe) {
    //     this.props.onSearchContractNum({ childType, client });
    //   }
    // }
  }

  @autobind
  handleSearchCust(value) {
    this.props.getCanApplyCustList(value);
  }

  // 选择合约编号
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '合约编号',
      value: '$args[0]',
    },
  })
  handleSelectContractNum(value) {
    this.setState({
      ...this.state,
      contractNum: value,
    }, () => this.props.saveModalData(this.state));
    // 退订选择合约编号后搜索该合约详情
    // this.props.onSearchContractDetail(value);
  }

  handleSearchContractNum(value) {
    this.props.getContractNumList(value);
  }

  // 通用 Date组件更新方法
  @autobind
  handleChangeDate(obj) {
    this.setState({
      ...this.state,
      [obj.name]: obj.value,
    }, () => this.props.saveModalData(this.state));
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '合约开始期',
      value: '$args[0]',
    },
  })
  handleChangeStartTime(obj) {
    this.handleChangeDate(obj);
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '合约有效期',
      value: '$args[0]',
    },
  })
  handleChangeValidityTime(obj) {
    this.handleChangeDate(obj);
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '合约终止日期',
      value: '$args[0]',
    },
  })
  handleChangeEndTime(obj) {
    this.handleChangeDate(obj);
  }

  // 修改备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      ...this.state,
      remark: e.target.value,
    }, () => this.props.saveModalData(this.state));
  }

  render() {
    const {
      baseInfo,
      attachmentList,
      uploadAttachment,
      canApplyCustList,
      contractNumList,
    } = this.props;
    const {
      operation,
      modalType,
      contractStartDate,
      contractValidDate,
      contractEndDate,
      remark,
    } = this.state;
    const uploadProps = {
      attachmentList,
      edit: true,
      uploadAttachment,
      attachment: baseInfo.attachment || '',
    };

    // 编号 html
    const numberHtml = (
      <div className={styles.dcHeader}>
        <span className={styles.dcHaderNumb}>编号</span>
      </div>
    );
    // 操作类型 html
    const operationHtml = (
      <InfoForm label="操作类型" required>
        <Select
          name="operation"
          data={operationList}
          value={operation}
          onChange={this.handleSelectOpereateType}
        />
      </InfoForm>
    );
    // 子类型 html
    const subTypeHtml = (
      <InfoForm label="子类型" required>
        <Select
          name="childType"
          data={childTypeList}
          value={this.state.childType}
          onChange={this.handleSelectSubtype}
        />
      </InfoForm>
    );
    // 可申请客户列表 html
    const canApplyCustHtml = (
      <InfoForm label="客户" required>
        <AutoComplete
          placeholder="经纪客户号/客户名称"
          showObjKey="custName"
          objId="cusId"
          searchList={canApplyCustList}
          onSelect={this.handleSelectCust}
          onSearch={this.handleSearchCust}
          isImmediatelySearch
        />
      </InfoForm>
    );
    // 合约开始日期 html
    const startDateHtml = (
      <InfoForm label="合约开始日期" required>
        <DatePicker
          name="contractStartDate"
          onChange={this.handleChangeStartTime}
          value={
            contractStartDate ?
            moment(contractStartDate, 'YYYY-MM-DD')
            :
            ''
          }
          boxStyle={datePickerBoxStyle}
        />
      </InfoForm>
    );
    // 合约有效日期 html
    const validDateHtml = (
      <InfoForm label="合约有效期" required>
        <DatePicker
          name="contractValidDate"
          onChange={this.handleChangeValidityTime}
          value={
            contractValidDate ?
            moment(contractValidDate, 'YYYY-MM-DD')
            :
            ''
          }
          boxStyle={datePickerBoxStyle}
        />
      </InfoForm>
    );
    // 合约终止日期 html
    const endDateHtml = (
      <InfoForm label="合约终止日期" required>
        <DatePicker
          name="contractEndDate"
          onChange={this.handleChangeEndTime}
          value={
            contractEndDate ?
            moment(contractEndDate, 'YYYY-MM-DD')
            :
            ''
          }
          boxStyle={datePickerBoxStyle}
        />
      </InfoForm>
    );
    // 合约编号 html
    const contractNumHtml = (
      <InfoForm label="合约编号" required>
        <AutoComplete
          placeholder="合约编号"
          showObjKey="contractName"
          objId="id"
          searchList={contractNumList}
          onSelect={this.handleSelectContractNum}
          onSearch={this.handleSearchContractNum}
          isImmediatelySearch
        />
      </InfoForm>
    );
    // 备注 html
    const descriptionHtml = (
      <InfoForm label="备注" required>
        <TextArea
          value={remark}
          onChange={this.handleChangeRemark}
        />
      </InfoForm>
    );
    // 拟稿人 html
    const draftHtml = (
      <div className={styles.detailWrapper}>
        <InfoTitle head="拟稿信息" />
        <InfoItem label="拟稿人" value={`${baseInfo.createdName} ${baseInfo.createdBy}`} />
        <InfoItem label="提请时间" value="2017/08/31(mock)" />
        <InfoItem label="状态" value={baseInfo.status} />
      </div>
    );
    // 合约条款 html
    // 表格中需要的操作
    // const tableOperation = {
    //   column: {
    //     key: 'delete', // 'check'\'delete'\'view'
    //     title: '',
    //   },
    //   operate: this.deleteTableData,
    // };
    const termsHtml = (
      <div className={styles.detailWrapper}>
        <InfoTitle head="合约条款" />
        <CommonTable
          data={baseInfo.terms || []}
          titleList={titleList}
        />
      </div>
    );
    // 附件信息 html
    const attachmentHtml = (
      <div className={styles.detailWrapper}>
        <InfoTitle head="附件信息" />
        <CommonUpload {...uploadProps} />
      </div>
    );
    // 审批记录修改 html
    const approveEditHtml = (
      <div className={styles.detailWrapper}>
        <InfoTitle head="审批" />
        <InfoForm label="审批意见" required>
          <TextArea
            value={this.state.remark}
            onChange={this.handleChangeRemark}
          />
        </InfoForm>
      </div>
    );
    // 审批记录 html
    const approveHtml = (
      <div className={styles.detailWrapper}>
        <InfoTitle head="审批记录" />
        <ApproveList />
      </div>
    );
    const addSubscribe = () => {
      let htmlArray = [];
      // 订购的 html
      if (operation === subscribeValue) {
        htmlArray = [
          subTypeHtml,
          canApplyCustHtml,
          startDateHtml,
          validDateHtml,
          descriptionHtml,
        ];
      } else {
        // 退订的 html
        htmlArray = [
          subTypeHtml,
          canApplyCustHtml,
          contractNumHtml,
          startDateHtml,
          validDateHtml,
          descriptionHtml,
        ];
      }
      return htmlArray;
    };

    return (
      <div className={styles.detailComponent}>
        {
          modalType === 'add' ?
            null
          :
            numberHtml
        }
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          {/* 操作类型 */}
          { operationHtml }
          {
            modalType === 'add' ?
            addSubscribe()
            :
            [
              subTypeHtml,
              canApplyCustHtml,
              startDateHtml,
              validDateHtml,
              endDateHtml,
              descriptionHtml,
            ]
          }
        </div>
        {
          modalType === 'add' ?
          [
            termsHtml,
            attachmentHtml,
          ]
          :
          [
            draftHtml,
            termsHtml,
            attachmentHtml,
            approveEditHtml,
            approveHtml,
          ]
        }
      </div>
    );
  }
}
