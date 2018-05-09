import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import style from './baseinfomodify.less';
import InfoTitle from '../common/InfoTitle';
import TextareaComponent from '../common/textareacomponent';
import AutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import { seibelConfig } from '../../config';
import logable from '../../decorators/logable';

const { permission: { subType, pageType } } = seibelConfig;

export default class BaseInfoModify extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    customer: PropTypes.string.isRequired,
    remark: PropTypes.string.isRequired,
    subTypeList: PropTypes.array.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  static contextTypes = {
    getCanApplyCustList: PropTypes.func.isRequired,
    getSubTypeList: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      subTypeTxt: '',
      subTypeList: [],
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.subTypeList !== this.props.subTypeList && newProps.subTypeList.length > 0) {
      /* eslint-disable */ 
      const result = newProps.subTypeList.map((value) => {
        let obj;
        for (const item of subType) {
          if (item.value === value) {
            return obj = item;
          }
        }
        return obj;
      });
      /* eslint-enable */
      this.setState({ subTypeList: result });
    }
  }

  @autobind
  changeRemarks(value) {
    // 更改备注信息
    this.props.onEmitEvent('remark', value);
  }

  @autobind
  searchChildTypeList(value) {
    // 按 关键字 查询 子类型 列表
    this.context.getChildTypeList(value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].custName',
    },
  })
  selectCustomer(item) {
    // 选中客户
    this.props.onEmitEvent('customer', item);
    if (!_.isEmpty(this.state.subTypeTxt)) {
      this.setState({
        subTypeTxt: '',
      }, () => {
        this.props.onEmitEvent('subType', this.state.subTypeTxt);
      });
    }
    // 当前选中的客户不为空时，才发起接口申请
    if (!_.isEmpty(item)) {
      this.context.getSubTypeList({
        customerId: item.brokerNumber,
        customerType: item.custType,
        type: pageType,
      });
    }
  }

  @autobind
  searchCanApplyCustList(value) {
    // 按照 关键字 查询 客户 列表
    this.context.getCanApplyCustList(value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[0]',
    },
  })
  updateSubTypeValue(name, value) {
    const result = subType.filter(item => (item.value === value))[0].label;
    this.setState({ subTypeTxt: result });
    this.props.onEmitEvent(name, value);
  }

  render() {
    return (
      <div className={style.baseInfo}>
        <p>{this.context.str}</p>
        <InfoTitle head={this.props.head} />
        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>客户：
          </span>
          <div className={style.inputComponentContent}>
            <AutoComplete
              placeholder="经纪客户号/客户名称"
              searchList={this.props.canApplyCustList}
              showObjKey="custName"
              objId="cusId"
              isImmediatelySearch
              width={200}
              onSelect={this.selectCustomer}
              onSearch={this.searchCanApplyCustList}
            />
          </div>
        </div>
        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>子类型：
          </span>
          <div className={style.inputComponentContent}>
            <div className={style.boxBorder}>
              <Select
                data={this.state.subTypeList}
                name="subType"
                onChange={this.updateSubTypeValue}
                value={this.state.subTypeTxt}
              />
            </div>
          </div>
        </div>
        <TextareaComponent
          title="备注"
          value={this.props.remark}
          onEmitEvent={this.changeRemarks}
          placeholder="请输入您的备注信息"
        />
      </div>
    );
  }
}
