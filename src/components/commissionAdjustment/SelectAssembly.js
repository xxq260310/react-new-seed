/**
 * @file components/common/Select/SelectAssembly.js
 *  带搜索icon的select和添加按钮
 *  当输入或者选中值后icon变化成关闭点击后清除input的value值
 * @author zhufeiyang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { AutoComplete } from 'antd';

import SimilarAutoComplete from '../common/similarAutoComplete';
import { seibelConfig } from '../../config';
import confirm from '../common/Confirm';

import styles from './selectAssembly.less';

const Option = AutoComplete.Option;
const { comsubs: commadj } = seibelConfig;

export default class SelectAssembly extends PureComponent {

  static propTypes = {
    name: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    onSearchValue: PropTypes.func.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    unfinishRoute: PropTypes.func, // 选择客户，弹出未完成订单，点击确认的跳转路由
    onValidateCust: PropTypes.func,
    width: PropTypes.number,
    subType: PropTypes.string,
    validResult: PropTypes.object,
    shouldeCheck: PropTypes.bool,
  }

  static defaultProps = {
    name: 'commissionSelect',
    width: 300,
    subType: '',
    validResult: {},
    shouldeCheck: true,
    onValidateCust: _.noop,
    unfinishRoute: () => {},
    dataSource: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      isUnfinish: false, // 标识 选中的客户，是否有未完成订单
      canSelected: false,
    };
  }

  @autobind
  clearCust() {
    this.setState({
      canSelected: false,
    });
    this.custSearch.clearValue();
  }

  @autobind
  custSearchRef(input) {
    this.custSearch = input;
  }

  @autobind
  handleOKAfterValidate(selectItem) {
    if (this.state.canSelected) {
      // 可以选中
      const { subType, onSelectValue, validResult: { openRzrq } } = this.props;
      if (subType === commadj.single) {
        onSelectValue({ ...selectItem, openRzrq });
      } else {
        onSelectValue(selectItem);
      }
    } else {
      const { unfinishRoute } = this.props;
      const { isUnfinish } = this.state;
      // 3.23新需求，选择的客户，有未完成订单，点击确定，跳转到360视图订单列表页面
      if (isUnfinish) {
        unfinishRoute(selectItem);
      }
      // 干掉客户
      this.clearCust();
    }
  }

  @autobind
  handleCancelAfterValidate() {
    this.clearCust();
  }

  // 校验不通过，弹框
  @autobind
  fail2Validate(obj) {
    const { shortCut, content, selectItem } = obj;
    confirm({
      shortCut,
      content,
      onOk: () => { this.handleOKAfterValidate(selectItem); },
      onCancel: this.handleCancelAfterValidate,
    });
    this.setState({
      canSelected: false,
    });
  }

  // 客户校验
  @autobind
  afterValidateSingleCust(selectItem) {
    if (_.isEmpty(this.props.validResult)) {
      confirm({ content: '客户校验失败' });
      return;
    }
    const {
      riskRt,
      investRt,
      investTerm,
      hasorder,
    } = this.props.validResult;
    const { subType } = this.props;
    this.setState({ isUnfinish: false });
    if (subType === commadj.single && hasorder === 'Y') {
      this.setState({ isUnfinish: true });
      // 目前只有单佣金需要对在途订单
      this.fail2Validate({ shortCut: 'unfinish', selectItem });
      return;
    }
    // 风险测评校验
    if (riskRt === 'N') {
      this.fail2Validate({ shortCut: 'custRisk' });
      return;
    }
    // 偏好品种校验
    if (investRt === 'Y') {
      this.fail2Validate({ shortCut: 'custInvestRt' });
      return;
    }
    // 投资期限校验
    if (investTerm === 'Y') {
      this.fail2Validate({ shortCut: 'custInvestTerm' });
      return;
    }
    this.setState({
      canSelected: true,
    });
    this.handleOKAfterValidate(selectItem);
  }

  // 选择某个客户
  @autobind
  handleSelectCust(cust) {
    if (!_.isEmpty(cust)) {
      // 选中值了
      const { shouldeCheck, onValidateCust } = this.props;
      const { id, custType } = cust;
      if (shouldeCheck) {
        onValidateCust({
          custRowId: id,
          custType,
        }).then(() => this.afterValidateSingleCust(cust));
      } else {
        this.props.onSelectValue(cust);
      }
    } else {
      // 此时有可能客户搜索组件会传递一个空对象
      // 将空值传递出去以便可以让父组件更新其他组件数据
      // 删除客户
      // 向父组件传递一个空对象
      this.props.onSelectValue(null);
    }
  }

  // 搜索客户列表
  @autobind
  handleSearchCustList(value) {
    this.props.onSearchValue(value);
  }

  @autobind
  renderOption(cust) {
    const { custName, custEcom, riskLevelLabel = '' } = cust;
    const text = `${custName}（${custEcom}） - ${riskLevelLabel}`;
    return (
      <Option key={custEcom} value={text} >
        <span className={styles.prodValue} title={text}>{text}</span>
      </Option>
    );
  }

  render() {
    const { width, name, dataSource } = this.props;
    return (
      <SimilarAutoComplete
        ref={this.custSearchRef}
        name={name}
        placeholder="经纪客户号/客户名称"
        searchList={dataSource}
        width={width}
        showObjKey="custEcom"
        objId="id"
        onSelect={this.handleSelectCust}
        onSearch={this.handleSearchCustList}
        renderOption={this.renderOption}
      />
    );
  }
}
