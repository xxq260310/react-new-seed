/**
 * @file components/commissionAdjustment/ProductsDropBox.js
 *  新建批量佣金调整目标产品下拉框
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import _ from 'lodash';
import styles from './productsDropBox1.less';
import logable from '../../decorators/logable';

const Option = AutoComplete.Option;

export default class ProductsDropdownBox extends PureComponent {

  static propTypes = {
    productList: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    productList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      iconType: 'search',
      value: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { productList: prevList } = this.props;
    const { productList: nextList } = nextProps;
    if (!_.isEqual(prevList, nextList)) {
      // 佣金率改变后目标产品选中值置空
      this.setState({
        value: '',
        iconType: 'search',
      });
      // 此时需将外层目标产品值置空
      this.selectProduct('');
    }
  }

  // 根据用户输入过滤目标产品
  @autobind
  handleSearchFilterOptions(inputValue, option) {
    const optionArray = option.props.children;
    return !!_.find(optionArray, item => item.props.children.indexOf(inputValue) !== -1);
  }

  // 获取到value值后隐藏icon
  @autobind
  changeInputbox(value) {
    if (value) {
      this.setState({
        iconType: 'close',
        value,
      });
    } else {
      this.setState({
        value: '',
        iconType: 'search',
      });
    }
  }

  @autobind
  selectProduct(value) {
    this.props.onSelect(value);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '清除输入内容' } })
  handleClearInput() {
    this.setState({
      value: '',
      iconType: 'search',
    }, () => {
      // 此时需将外层目标产品值置空
      this.selectProduct('');
    });
  }

  @autobind
  clearValue() {
    if (this.state.iconType === 'close') {
      this.handleClearInput();
    }
  }
  render() {
    const { iconType, value } = this.state;
    const { productList } = this.props;
    const newList = productList.map(pro => ({ key: pro.id, ...pro }));
    const options = newList.map(opt => (
      <Option
        key={opt.id}
        value={opt.prodCode}
        text={`${opt.prodCommision}‰ ${opt.prodName} ${opt.prodCode}`}
      >
        <span className={styles.prodcom}>{`${opt.prodCommision}‰`}</span>
        <span className={styles.prodname}>{opt.prodName}</span>
        <span className={styles.prodcode}>{opt.prodCode}</span>
      </Option>
    ));
    return (
      <div className={styles.dropdownbox}>
        <AutoComplete
          placeholder="产品名称/产品代码"
          className={styles.searchbox}
          dropdownClassName={styles.searchdropdown}
          dropdownStyle={{ width: 343 }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width: '100%' }}
          dataSource={options}
          onChange={this.changeInputbox}
          onSelect={this.selectProduct}
          filterOption={this.handleSearchFilterOptions}
          value={value}
          optionLabelProp="text"
        >
          <Input
            suffix={
              <Icon
                type={iconType}
                onClick={this.clearValue}
                className={styles.searchicon}
              />
            }
          />
        </AutoComplete>
      </div>
    );
  }
}

