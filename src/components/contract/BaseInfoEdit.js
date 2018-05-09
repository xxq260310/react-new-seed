/*
* @Description: 合作合约修改 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-20 13:47:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 17:21:15
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
import DatePicker from '../common/datePicker';
import { seibelConfig } from '../../config';
import { time } from '../../helper';
import logable from '../../decorators/logable';

import styles from './baseInfoEdit.less';

// 操作类型列表
const { contract: { operationList } } = seibelConfig;
const { TextArea } = Input;
const EMPTY_PARAM = '暂无';
// 子类型列表
const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
// 退订
const { contract: { unsubscribe } } = seibelConfig;
// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
// 时间选择组件样式
const datePickerBoxStyle = {
  width: 220,
  height: 32,
};
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    const { contractDetail: { baseInfo } } = props;
    // econNum
    this.state = {
      childType: _.filter(childTypeList, v => v.value === '0301')[0].label,
      contractStarDate: time.format(baseInfo.startDt),
      contractPalidity: time.format(baseInfo.vailDt),
      remark: baseInfo.description,
      tdDescription: baseInfo.tdDescription,
      id: '',
      oldData: {
        ...baseInfo,
      },
    };
  }

  // 根据code返回操作类型name
  @autobind
  getOperationType(type) {
    if (type) {
      return _.filter(operationList, v => v.value === type)[0].label;
    }
    return EMPTY_PARAM;
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    this.setState({
      ...this.state,
      [key]: value,
    }, this.transferDataToHome);
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
  handleSelectStartTime(obj) {
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

  // 更改备注
  @autobind
  handleChangeRemark(e) {
    const {
      contractDetail: { baseInfo },
    } = this.props;
    // 是否是退订
    const isSubscribe = baseInfo.applyType === unsubscribe;
    const desc = isSubscribe ? 'tdDescription' : 'remark';
    this.setState({
      ...this.state,
      [desc]: e.target.value,
    }, this.transferDataToHome);
  }

  // 向外传递数据
  @autobind
  transferDataToHome() {
    const data = this.state;
    const oldData = data.oldData;
    const obj = {
      // 操作类型--必填
      workflowname: data.operation || oldData.workflowname,
      // 子类型--必填
      subType: data.subType || oldData.subType,
      // 客户名称--必填
      custName: oldData.custName,
      // 客户 ID--必填
      custId: oldData.custId,
      // 客户类型--必填
      custType: oldData.custType,
      // 合约开始日期--订购状态下必填，退订不可编辑
      startDt: data.contractStarDate,
      // 合约有效期
      vailDt: data.contractPalidity,
      // 备注
      description: data.remark || oldData.description,
      tdDescription: data.tdDescription || oldData.tdDescription,
    };
    this.props.onChange(obj);
  }

  render() {
    const {
      contractDetail: { baseInfo },
    } = this.props;
    const {
      oldData,
      contractStarDate,
      contractPalidity,
      remark,
      tdDescription,
    } = this.state;
    // 是否是退订
    const isSubscribe = baseInfo.applyType === unsubscribe;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <InfoItem label="操作类型" value={this.getOperationType(baseInfo.applyType)} />
        <InfoItem label="子类型" value={this.state.childType} />
        <InfoItem label="客户" value={`${oldData.custName} ${oldData.econNum}`} />
        {
          isSubscribe ?
            <InfoItem label="合约开始日期" value={contractStarDate} />
          :
            <InfoForm label="合约开始日期" required>
              <DatePicker
                name="contractStarDate"
                value={moment(contractStarDate, 'YYYY-MM-DD')}
                onChange={this.handleSelectStartTime}
                boxStyle={datePickerBoxStyle}
              />
            </InfoForm>
        }
        {
          isSubscribe ?
            <InfoItem label="合约有效期" value={contractPalidity} />
          :
            <InfoForm label="合约有效期">
              <DatePicker
                name="contractPalidity"
                value={moment(contractPalidity, 'YYYY-MM-DD')}
                onChange={this.handleSelectValidityTime}
                boxStyle={datePickerBoxStyle}
              />
            </InfoForm>
        }
        {
          isSubscribe ?
            <InfoForm label="合约编号">
              <Select
                name="contractNum"
                data={[
                  {
                    show: true,
                    label: baseInfo.contractNum,
                    value: baseInfo.contractNum,
                  },
                ]}
                value={baseInfo.contractNum}
              />
            </InfoForm>
          :
            null
        }
        <InfoForm label="备注">
          <TextArea
            value={isSubscribe ? tdDescription : remark}
            onChange={this.handleChangeRemark}
          />
        </InfoForm>
      </div>
    );
  }

}
