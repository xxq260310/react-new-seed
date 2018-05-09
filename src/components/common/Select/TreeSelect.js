/**
 * @Author: sunweibin
 * @Date: 2018-03-01 14:40:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-05 16:13:56
 * @description 封装antd的TreeSelect组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import cx from 'classnames';
import { autobind } from 'core-decorators';
import { TreeSelect } from 'antd';

import { constants } from '../../../config';
import style from './treeSelect.less';

export default class HtscTreeSelect extends PureComponent {
  static propTypes = {
    // 组件名称
    name: PropTypes.string,
    // 查询框中的placeholder
    placeholder: PropTypes.string,
    // TreeSelct的显示策略
    showCheckedStrategy: PropTypes.string,
    // 数据
    treeData: PropTypes.array,
    // 默认用户选取的值
    defaultValue: PropTypes.array,
    // 用户自定义style
    boxStyle: PropTypes.object,
    // 样式主题
    theme: PropTypes.string,
    // 是否可操作
    disable: PropTypes.bool,
    // 菜单渲染父节点
    getPopupContainer: PropTypes.func,
    // 向父组件中传递选中的值
    onSelect: PropTypes.func.isRequired,
    allowClear: PropTypes.bool,
    multiple: PropTypes.bool,
    treeDefaultExpandAll: PropTypes.bool,
    treeCheckStrictly: PropTypes.bool,
    treeCheckable: PropTypes.bool,
    showSearch: PropTypes.bool,
    dropdownStyle: PropTypes.object,
  }

  static defaultProps = {
    name: 'customerTreeSelect',
    placeholder: '',
    showCheckedStrategy: 'all',
    treeData: [],
    defaultValue: [],
    boxStyle: {},
    theme: 'theme1',
    disable: false,
    showSearch: false,
    getPopupContainer: () => document.querySelector(constants.container),
    onSelect: _.noop,
    allowClear: true,
    multiple: true,
    treeDefaultExpandAll: true,
    treeCheckStrictly: true,
    treeCheckable: true,
    dropdownStyle: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isSHowModal: false,
      value: props.defaultValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { defaultValue: prevValue } = this.props;
    const { defaultValue: nextValue } = nextProps;
    if (prevValue !== nextValue) {
      this.setState({
        value: nextValue,
      });
    }
  }

  @autobind
  clear() {
    this.setState({ value: [] });
  }

  @autobind
  getShowCheckedStrategy() {
    const { showCheckedStrategy } = this.props;
    let strategy = TreeSelect.SHOW_CHILD;
    switch (showCheckedStrategy) {
      case 'all':
        strategy = TreeSelect.SHOW_ALL;
        break;
      case 'parent':
        strategy = TreeSelect.SHOW_PARENT;
        break;
      default:
        strategy = TreeSelect.SHOW_CHILD;
        break;
    }
    return strategy;
  }

  @autobind
  onChange(value) {
    const { name, onSelect } = this.props;
    this.setState({ value });
    onSelect(name, value);
  }


  render() {
    const {
      disable,
      getPopupContainer,
      treeData,
      placeholder,
      boxStyle,
      dropdownStyle,
      allowClear,
      multiple,
      treeDefaultExpandAll,
      treeCheckStrictly,
      treeCheckable,
      showSearch,
    } = this.props;

    const tProps = {
      treeData,
      disable,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable,
      treeCheckStrictly,
      showSearch,
      showCheckedStrategy: this.getShowCheckedStrategy(),
      placeholder,
      getPopupContainer,
      style: boxStyle,
      dropdownStyle,
      allowClear,
      multiple,
      treeDefaultExpandAll,
      treeNodeFilterProp: 'label',
    };

    return (
      <div className={style.wraperHtscTreeSelect}>
        <TreeSelect {...tProps} />
      </div>
    );
  }
}
