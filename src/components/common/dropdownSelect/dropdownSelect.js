/**
 * @Author: sunweibin
 * @Date: 2018-03-30 15:46:03
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-09 15:50:48
 * @description 根据需求antd3.x版本下需要重写一个dropdownSelect
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import _ from 'lodash';
import { Popover, Input, Icon } from 'antd';

import { dom } from '../../../helper';
import styles from './dropdownSelect.less';

const Search = Input.Search;

export default class DropdownSelect extends PureComponent {
  static propTypes = {
    // 组件名称
    name: PropTypes.string,
    // 查询框中的placeholder
    placeholder: PropTypes.string,
    // 所选取的值
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 查询得到的数据里表
    searchList: PropTypes.array,
    // 列表展示的数据 多对应的Object中的key
    showObjKey: PropTypes.string.isRequired,
    // 数据中的key 作为react中辅助标识key
    objId: PropTypes.string,
    // 选中对象 并触发选中方法 向父组件传递一个obj（必填）
    emitSelectItem: PropTypes.func.isRequired,
    // 在这里去触发查询搜索信息的方法并向父组件传递了string（必填）
    emitToSearch: PropTypes.func.isRequired,
    // 用户自定义style
    boxStyle: PropTypes.object,
    // 样式主题
    theme: PropTypes.string,
    // 禁用
    disable: PropTypes.bool,
    // 默认搜索框值
    defaultSearchValue: PropTypes.string,
    // 下拉预置列表
    presetOptionList: PropTypes.array,
    // 弹出层的位置,默认下左
    placement: PropTypes.string,
  }

  static defaultProps = {
    name: 'newDropdownSelect',
    placeholder: '',
    value: '',
    searchList: [],
    objId: '',
    boxStyle: {},
    theme: 'theme1',
    disable: false,
    defaultSearchValue: '',
    presetOptionList: [],
    placement: 'bottomLeft',
  }

  constructor(props) {
    super(props);
    const {
      defaultSearchValue,
      presetOptionList,
      searchList,
    } = props;
    // 显示预置的列表项
    const optionList = _.isEmpty(defaultSearchValue) ? presetOptionList : searchList;
    this.state = {
      // 弹出层隐藏/显示
      visible: false,
      // 搜索框的值
      searchValue: defaultSearchValue,
      // 搜索结果
      optionList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value: nextValue, searchList: nextSearchList } = nextProps;
    const { value: preValue, searchList: preSearchList } = this.props;
    if (preValue !== nextValue) {
      this.setState({
        value: nextValue,
      });
    }
    if (preSearchList !== nextSearchList) {
      // 更新下拉选项框列表
      this.setState({
        optionList: nextSearchList,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { searchList: prevList, value: preValue } = this.props;
    const { searchList: nextList, value: nextValue } = nextProps;
    return prevList !== nextList || preValue !== nextValue || this.state !== nextState;
  }

  // 控制弹出层的隐藏和显示
  @autobind
  handlePopverVisibleChange(visible) {
    const { disable } = this.props;
    if (!disable) {
      // 隐藏需要将数据清空下
      this.setState({ visible, optionList: [], searchValue: '' });
    }
  }

  @autobind
  handleSearchChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  @autobind
  handleSearch(inputValue) {
    if (!_.isEmpty(inputValue)) {
      this.props.emitToSearch(inputValue);
    }
  }

  // 选择某个项
  @autobind
  handleSelect(e) {
    const index = dom.getAttribute(e.target, 'data-index');
    const { optionList } = this.state;
    // 需要将选中的传递出去
    this.props.emitSelectItem(optionList[index]);
    this.handlePopverVisibleChange(false);
  }

  @autobind
  rednderDropdownSelect() {
    const { optionList } = this.state;
    if (_.isEmpty(optionList)) {
      return this.renderEmptyList();
    }
    return this.renderSelectList();
  }

  @autobind
  renderDropdownSearch() {
    const { searchValue } = this.state;
    const { placeholder } = this.props;
    return (
      <Search
        value={searchValue}
        placeholder={placeholder}
        onSearch={this.handleSearch}
        onChange={this.handleSearchChange}
        enterButton
      />
    );
  }

  @autobind
  renderEmptyList() {
    return (
      <div className={styles.notFound}>没有发现与之匹配的结果</div>
    );
  }

  @autobind
  renderSelectOption(option, index) {
    const { showObjKey, objId, name } = this.props;
    const idx = !option[objId] ? `selectList-${index}` : `${name}-${option[objId]}`;
    const value = option[objId] ? `${option[showObjKey]}（${option[objId]}）` : `${option[showObjKey]}`;
    return (
      <div
        data-index={index}
        key={idx}
        className={styles.ddsDrapMenuConItem}
        title={value}
      >
        {value}
      </div>
    );
  }

  @autobind
  renderSelectList() {
    const { optionList } = this.state;
    return (
      <div onClick={this.handleSelect}>
        { _.map(optionList, this.renderSelectOption) }
      </div>
    );
  }

  render() {
    const { value, disable, placement } = this.props;
    const { visible } = this.state;
    const dropdownToggleCls = cx({
      [styles.dropdownToggle]: true,
      [styles.dropdownDisabled]: disable,
      [styles.dropdownActive]: visible,
    });

    const searchNode = this.renderDropdownSearch();

    const selectNodeList = this.rednderDropdownSelect();

    return (
      <Popover
        overlayClassName={styles.dropdownSelectWraper}
        trigger="click"
        title={searchNode}
        content={selectNodeList}
        visible={visible}
        onVisibleChange={this.handlePopverVisibleChange}
        placement={placement}
      >
        <div className={dropdownToggleCls}>
          <span className={styles.popoverTitle}>{value}</span>
          <span className={styles.popoverIcon}><Icon type="caret-down" /></span>
        </div>
      </Popover>
    );
  }

}
