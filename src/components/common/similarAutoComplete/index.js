/*
 * @Author: zhangjunli
 * @file SimilarAutoComplete.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import style from './style.less';

const Option = AutoComplete.Option;
let currentSelect = null; // 当前选中的对象
 // 下拉搜索组件样式
const defaultStyle = {
  width: '220px',
  height: '32px',
};
export default class SimilarAutoComplete extends PureComponent {
  static propTypes = {
    // 组件名称，用于设置下拉选项id使用
    name: PropTypes.string,
    // 查询框中的placeholder
    placeholder: PropTypes.string,
    // 查询得到的数据里表
    searchList: PropTypes.array,
    // 列表展示的数据 多对应的Object中的key
    showObjKey: PropTypes.string.isRequired,
    // 数据中的key 作为react中辅助标识key
    objId: PropTypes.string,
    // 选中对象 并触发选中方法 向父组件传递一个obj（必填）
    onSelect: PropTypes.func.isRequired,
    // 在这里去触发查询搜索信息的方法并向父组件传递了string（必填）
    onSearch: PropTypes.func.isRequired,
    // 输入框输入内容变化事件
    onChange: PropTypes.func,
    // 样式主题
    theme: PropTypes.string,
    // 是否可操作
    disable: PropTypes.bool,
    // 默认搜索框值
    defaultSearchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 定制下拉选项框(用AutoComplete.Option来实现，一定要有value属性值)
    renderOption: PropTypes.func,
    // 是否即时搜索（默认为true，用于模糊匹配；精准匹配时，置为false），
    isImmediatelySearch: PropTypes.bool,
    // 样式
    display: PropTypes.string,
    // 控件宽度
    width: PropTypes.number,
  }

  static defaultProps = {
    name: 'customerDrop',
    placeholder: '',
    searchList: [],
    objId: '',
    theme: 'theme1',
    disable: false,
    defaultSearchValue: '',
    width: 0,
    renderOption: null,
    isImmediatelySearch: false,
    display: 'inline-block',
    onChange: _.noop,
  }

  constructor(props) {
    super(props);
    const { defaultSearchValue } = props;
    const isEmptyValue = _.isEmpty(_.trim(defaultSearchValue));
    this.state = {
      // 搜索框的类型
      typeStyle: isEmptyValue ? 'search' : 'clear',
      // 选中的值
      value: defaultSearchValue, // 输入框中的值
      showError: '', // 显示的报错信息
    };
  }

  getSearchListDom(dataList) {
    const { showObjKey, objId, renderOption } = this.props;
    const result = _.map(dataList, (item, index, array) => {
      if (item.isHidden) {
        return null;
      }
      const optionValue = item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`;
      if (renderOption) {
        return renderOption(item, index, array);
      }
      // 默认的option样式
      return (
        <Option
          key={item[showObjKey]}
          className={style.ddsDrapMenuConItem}
          value={optionValue}
          title={optionValue}
        >
          {optionValue}
        </Option>
      );
    });
    return result;
  }

  @autobind
  handleInputValue(value) {
    if (!_.isEmpty(currentSelect)) {
      // 下拉框中值选中时，会触发onchange方法, 即handleInputValue方法，故在此处重置选中项为null
      currentSelect = null;
    } else {
      this.props.onChange(value);
    }
  }

  // 根据用户选中的option的value值获取对应的数组值
  // 第一个参数是 AutoComplete 组件的optionLabelProp指定的key对应的值
  // 第二个参数是当前选中元素的的Dom项（可以打印出来看下）
  @autobind
  handleSelectedValue(value, item) {
    if (value) {
      const { onSelect, searchList, showObjKey } = this.props;
      const selectedKey = item.key;
      // 当前的选中值
      currentSelect = _.find(searchList, listItem => listItem[showObjKey] === selectedKey);
      onSelect({
        ...currentSelect,
      });

      // 更新state中的值
      this.setState({
        value,
        typeStyle: 'clear',
      });
    }
  }

  // 即时搜索
  @autobind
  handleImmediatelySearch(searchValue) {
    const { onSelect, isImmediatelySearch } = this.props;
    const { typeStyle } = this.state;
    let value = searchValue;
    if (typeStyle === 'clear') {
      value = '';
      onSelect({});
      this.setState({
        value,
        typeStyle: 'search',
      });
    } else {
      // 记录要搜索的字段，并设置当前的状态为搜索状态
      this.setState({
        value,
      });
    }
    // 有的搜索不支持 keyword 为空字符串，比如 售前适当性查询，会弹warn框提醒用具输入
    // 即时搜索关闭 输入框清空 时，对 空字符串的 搜索
    if (isImmediatelySearch && value !== '') {
      // 发起搜索
      const { onSearch } = this.props;
      onSearch(value);
    }
  }

  // 触发查询搜索信息的方法
  @autobind
  handleSearch() {
    const { typeStyle, value } = this.state;
    if (typeStyle === 'search') {
      // 发起搜索
      this.props.onSearch(value);
    } else if (typeStyle === 'clear') {
      // 清空输入框，并设置为搜索状态
      this.setState(
        {
          value: '',
          typeStyle: 'search',
        },
        () => {
          // 手动清空选中值，传递到组件外
          this.props.onSelect({});
        },
      );
    }
  }

  // 目前发现，清空输入框有两种行为：1，直接修改组件的属性value；2，通过调用clearValue方法
  // 直接修改组件的属性value，存在隐患，search事件的触发，有赖于搜索框的图标（放大镜是搜索，x图标是清除）
  // 清空输入框的数据，并设置为搜索状态
  // 组件外部使用，场景是，部分使用该组件时，需要对选中的值做验证（组件外部验证），验证不通过，需要清空
  @autobind
  clearValue() {
    this.setState({
      value: '',
      typeStyle: 'search',
    });
  }

  @autobind
  showErrorMsg(msg) {
    this.setState({
      showError: msg,
    });
  }

  @autobind
  hiddenErrorMsg() {
    this.setState({
      showError: '',
    });
  }

  // 检查数据源是否为空
  @autobind
  checkListIsEmpty() {
    const { searchList } = this.props;
    const hiddenSearchList = searchList.filter(item => item.isHidden);
    return _.isEmpty(searchList)
      || (hiddenSearchList.length === searchList.length);
  }

  // 渲染 disable 状态下的标签显示
  @autobind
  renderDisableContent() {
    const { disable, defaultSearchValue, theme, width } = this.props;
    const ddsShowBoxClass = classnames([style.ddsShowBox]);
    const ddsShowBoxClass2 = classnames([
      style.ddsShowBox2,
      { [style.disable]: disable },
    ]);
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });
    const domWidth = width > 0 ? { width: `${width}px` } : {};
    const boxStyle = { ...defaultStyle, ...domWidth };
    return (
      <div className={drapDownSelectCls}>
        <div
          className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
          style={boxStyle}
        >
          {defaultSearchValue}
        </div>
      </div>
    );
  }

  renderAutoComplete() {
    const { placeholder, width, searchList, ...otherPorps } = this.props;
    const { typeStyle, value, showError } = this.state;
    const empty = [(
      <Option
        key={'empty'}
        disabled
        className={style.ddsDrapMenuConItem}
      >
        <span className={style.notFound}>没有发现与之匹配的结果</span>
      </Option>
    )];
    const options = this.checkListIsEmpty() ? empty : this.getSearchListDom(searchList);
    const inputValue = _.isString(value) ? value : `${value}`;
    const iconType = typeStyle === 'search' ? 'search' : 'close';
    const domWidth = width > 0 ? { width: `${width}px` } : {};
    const autoStyle = { ...defaultStyle, ...domWidth };
    const completeClassName = classnames(
      { [style.error]: !_.isEmpty(showError) },
    );
    return (
      <AutoComplete
        {...otherPorps}
        className={completeClassName}
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        size="large"
        style={autoStyle}
        dataSource={options}
        optionLabelProp="value"
        value={inputValue}
        // 选中下拉列表框中的某项，会触发onChange方法，不触发onSearch方法
        onChange={this.handleInputValue}
        onSelect={this.handleSelectedValue}
        // 当输入框变化时，AutoComplete 组件会先调用 onSearch 方法，在调用 onChange 方法
        // 添加 onSearch 属性，可实现即时搜索
        onSearch={this.handleImmediatelySearch}
      >
        <Input
          suffix={
            <Icon
              type={iconType}
              onClick={this.handleSearch}
              className={style.searchIcon}
            />
          }
          onPressEnter={this.handleSearch}
        />
      </AutoComplete>
    );
  }

  render() {
    const { theme, disable, width, display } = this.props;
    const { showError } = this.state;
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });
    const domWidth = width > 0 ? { width: `${width}px` } : {};
    const autoStyle = { ...defaultStyle, ...domWidth, display };

    if (disable) {
      return this.renderDisableContent();
    }
    return (
      <div className={drapDownSelectCls} style={autoStyle}>
        {this.renderAutoComplete()}
        <div className={style.showError} title={showError}>{showError}</div>
      </div>
    );
  }
}
