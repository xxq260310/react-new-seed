/**
 * @file components/common/autoComplete/index.js
 *  带搜索icon的select
 *  根据客户input中输入的值将所选中的对象传给添加按钮进行进一步处理
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { AutoComplete } from 'antd';
import _ from 'lodash';

import confirm from '../Confirm';
import styles from './index.less';
import logable from '../../../decorators/logable';

const Option = AutoComplete.Option;

export default class autoComplete extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    width: PropTypes.string,
    defaultInput: PropTypes.string,
    initValue: PropTypes.string,
  }

  static defaultProps = {
    width: '300px',
    defaultInput: '',
    initValue: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.initValue,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { initValue: prevValue } = this.props;
    const { initValue: nextValue } = nextProps;
    if (!_.isEqual(prevValue, nextValue)) {
      this.setState({
        inputValue: nextValue,
      });
    }
  }
  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  setSelectValue(value, option) {
    const selectItem = this.props.dataSource[option.props.index];
    this.props.onSelectValue(selectItem);
  }

  inputTimeout = 0;

  @autobind
  @logable({ type: 'Click', payload: { name: '清除输入框内容' } })
  clearInput() {
    this.setState({
      inputValue: '',
    });
  }

  @autobind
  handleSearch(value) {
    this.setState({
      inputValue: value,
    });
    if (this.inputTimeout !== 0) {
      clearTimeout(this.inputTimeout);
    }
    this.inputTimeout = setTimeout(() => this.validateInput(value), 500);
  }

  @autobind
  validateInput(value) {
    this.inputTimeout = 0;
    if (isNaN(value)) {
      confirm({
        shortCut: 'wrongInput',
        onOk: this.clearInput,
        onCancel: this.clearInput,
      });
    } else {
      this.props.onChangeValue(value);
    }
  }


  render() {
    const { dataSource, width, defaultInput } = this.props;
    const { inputValue } = this.state;
    const newDataSource = dataSource.map(item => ({ key: item.id, ...item }));
    const options = newDataSource.map((opt, index) => (
      <Option key={opt.id} value={opt.codeValue} text={opt.codeValue} index={index}>
        <span className={styles.prodValue}>{opt.codeValue}</span>
      </Option>
    ));
    return (
      <div className={styles.selectSearchBox}>
        <AutoComplete
          className={styles.searchBox}
          dropdownClassName={styles.searchDropDown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          placeholder={defaultInput}
          style={{ width }}
          dataSource={options}
          optionLabelProp="text"
          value={inputValue}
          onSelect={this.setSelectValue}
          onSearch={this.handleSearch}
        />
      </div>
    );
  }
}
