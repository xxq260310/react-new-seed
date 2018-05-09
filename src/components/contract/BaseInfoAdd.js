/*
* @Description: 合作合约新建 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-21 15:27:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 13:30:40
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { Input } from 'antd';
import moment from 'moment';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../common/infoForm';
import AutoComplete from '../common/similarAutoComplete';
import DatePicker from '../common/datePicker';
import { seibelConfig } from '../../config';
import { time } from '../../helper';
import styles from './baseInfoAdd.less';
import logable from '../../decorators/logable';

const { TextArea } = Input;

// 操作类型列表,退订的类型
const { contract: { operationList, unsubscribe } } = seibelConfig;
// 子类型列表
const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
// 时间选择组件样式
const datePickerBoxStyle = {
  width: 220,
  height: 32,
};
const EMPTY_OBJECT = {};
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    // 查询客户
    onSearchClient: PropTypes.func.isRequired,
    // 查询合约编号
    onSearchContractNum: PropTypes.func.isRequired,
    // 查询合约详情
    onSearchContractDetail: PropTypes.func.isRequired,
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
    // 合约编号列表
    contractNumList: PropTypes.array.isRequired,
    // 更改操作类型时重置表单数据
    onReset: PropTypes.func.isRequired,
    getFlowStepInfo: PropTypes.func.isRequired,
    // 清除退订时所查询合约详情
    resetUnsubscribeDetail: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      operation: '1',
      contractNum: {
        id: '',
      },
      subType: '',
      client: EMPTY_OBJECT,
      contractStarDate: '',
      contractPalidity: '',
      remark: '',
      tdDescription: '',
    };
  }

  // 更改操作类型时重置表单数据
  @autobind
  resetState() {
    this.setState({
      contractNum: {
        value: '',
      },
      subType: '',
      client: EMPTY_OBJECT,
      contractStarDate: '',
      contractPalidity: '',
      remark: '',
    }, () => {
      this.transferDataToHome();
      if (this.selectCustComponent) {
        this.selectCustComponent.clearValue();
      }
      if (this.selectContractComponent) {
        this.selectContractComponent.clearValue();
      }
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
  handleSelectOperationType(key, value) {
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

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    const { oldOperation } = this.state.operation;
    this.setState({
      ...this.state,
      [key]: value,
    }, () => {
      this.transferDataToHome();
      const { operation } = this.state;
      // 当前操作类型为“退订”并且子类型变化的时候触发合作合约编号查询
      if (operation === unsubscribe && key === 'subType') {
        this.setState({
          ...this.state,
          contractNum: {
            id: '',
          },
        }, () => {
          this.changeSubTypeOrClient();
        });
      }
      // 操作类型发生变化时重置所有填入的数据
      if (key === 'operation' && value !== oldOperation) {
        this.resetState();
        this.props.onReset();
      }
    });
  }

  // 选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].custName',
    },
  })
  handleSelectClient(value) {
    this.setState({
      ...this.state,
      client: value,
    }, () => {
      this.handleSearchClient();
      this.transferDataToHome();
      const { operation } = this.state;
      // 当前操作类型为“退订”并且子类型变化的时候触发合作合约编号查询
      if (operation === unsubscribe) {
        this.setState({
          ...this.state,
          contractNum: {
            id: '',
          },
        }, () => {
          this.changeSubTypeOrClient();
        });
      }
    });
  }

  // 子类型或客户发生变化时的操作
  @autobind
  changeSubTypeOrClient() {
    const { subType, client } = this.state;
    this.selectContractComponent.clearValue();
    this.props.resetUnsubscribeDetail();
    // 当前选中的客户不为空时，执行 合作合约编号查询
    if (!_.isEmpty(client)) {
      this.props.onSearchContractNum({ subType, client });
    }
    this.transferDataToHome();
  }

  // 根据关键字查询客户
  @autobind
  handleSearchClient(v = '') {
    this.props.onSearchClient(v);
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
    }, () => {
      this.transferDataToHome();
      // 当前选中的值不为空时，才请求数据
      if (!_.isEmpty(value)) {
        // 退订选择合约编号后搜索该合约详情
        this.props.onSearchContractDetail(value);
      }
    });
  }

  // 根据填入关键词筛选合约编号
  @autobind
  handleSearchContractNum(value) {
    console.log('筛选合约编号', value);
  }

  // 通用 Date组件更新方法
  @autobind
  handleChangeDate(obj) {
    this.setState({
      ...this.state,
      [obj.name]: obj.value,
    }, this.transferDataToHome);
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '合约开始日期',
      value: '$args[0].value',
    },
  })
  handleSeletStartTime(obj) {
    this.handleChangeDate(obj);
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '合约有效期',
      value: '$args[0].value',
    },
  })
  handleSelectValidityTime(obj) {
    this.handleChangeDate(obj);
  }

  // 修改备注
  @autobind
  handleChangeRemark(e) {
    const { operation } = this.state;
    const desc = operation !== unsubscribe ? 'remark' : 'tdDescription';
    this.setState({
      ...this.state,
      [desc]: e.target.value,
    }, this.transferDataToHome);
  }

  // 向外传递数据
  @autobind
  transferDataToHome() {
    const data = this.state;
    const obj = {
      // 操作类型--必填
      workflowname: data.operation,
      // 子类型--必填
      subType: data.subType,
      // 客户名称--必填
      custName: data.client.custName,
      // 客户 ID--必填
      custId: data.client.cusId,
      // 客户类型--必填
      custType: data.client.custType,
      // 经济客户号
      econNum: data.client.brokerNumber,
      // 合约开始日期--订购状态下必填，退订不可编辑
      startDt: data.contractStarDate,
      // 合约有效期
      vailDt: data.contractPalidity,
      // 备注
      description: data.remark,
      // 退订备注
      tdDescription: data.tdDescription,
    };
    if (data.operation === unsubscribe) {
      obj.contractNum = data.contractNum;
    } else {
      obj.contractNum = null;
    }
    this.props.onChange(obj);
  }

  render() {
    const { custList, contractDetail, contractNumList } = this.props;
    const { operation, tdDescription, remark, client } = this.state;
    const { custName = '', brokerNumber = '' } = client || {};
    const contractNumComponent = operation === unsubscribe ?
      (<InfoForm label="合约编号" required>
        <AutoComplete
          placeholder="合约编号"
          showObjKey="id"
          defaultSearchValue={this.state.contractNum.id || ''}
          searchList={contractNumList}
          onSelect={this.handleSelectContractNum}
          onSearch={this.handleSearchContractNum}
          ref={selectContractComponent => this.selectContractComponent = selectContractComponent}
        />
      </InfoForm>)
      :
      null;
    const contractStarDateComponent = operation !== unsubscribe ?
      (<InfoForm label="合约开始日期" required>
        <DatePicker
          name="contractStarDate"
          value={
                this.state.contractStarDate ?
                moment(this.state.contractStarDate, 'YYYY-MM-DD')
                :
                ''
              }
          onChange={this.handleSeletStartTime}
          boxStyle={datePickerBoxStyle}
        />
      </InfoForm>)
      :
      <InfoItem label="合约开始日期" value={time.format(contractDetail.startDt) || ''} />;
    const contractPalidityComponent = operation !== unsubscribe ?
      (<InfoForm label="合约有效期">
        <DatePicker
          name="contractPalidity"
          value={
              this.state.contractPalidity ?
              moment(this.state.contractPalidity, 'YYYY-MM-DD')
              :
              ''
            }
          onChange={this.handleSelectValidityTime}
          boxStyle={datePickerBoxStyle}
        />
      </InfoForm>)
      :
      <InfoItem label="合约有效期" value={time.format(contractDetail.vailDt) || ''} />;
    const desc = operation !== unsubscribe ? remark : tdDescription;
    const remarkComponent = (<InfoForm label="备注">
      <TextArea
        value={desc}
        onChange={this.handleChangeRemark}
      />
    </InfoForm>);
    const operateType = _.filter(operationList, v => v.label !== '全部');
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <InfoForm label="操作类型" required>
          <Select
            name="operation"
            data={operateType}
            value={this.state.operation}
            onChange={this.handleSelectOperationType}
          />
        </InfoForm>
        <InfoForm label="子类型" required>
          <Select
            name="subType"
            data={childTypeList}
            value={this.state.subType}
            onChange={this.handleSelectSubtype}
          />
        </InfoForm>
        <InfoForm label="客户" required>
          <AutoComplete
            placeholder="经纪客户号/客户名称"
            showObjKey="custName"
            objId="brokerNumber"
            defaultSearchValue={`${custName} ${brokerNumber}`}
            searchList={custList}
            onSelect={this.handleSelectClient}
            onSearch={this.handleSearchClient}
            ref={selectCustComponent => this.selectCustComponent = selectCustComponent}
          />
        </InfoForm>
        {contractNumComponent}
        {contractStarDateComponent}
        {contractPalidityComponent}
        {remarkComponent}
      </div>
    );
  }
}
