/*
 * @Author: shenxuxiang
 * @file dropdownSelect.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Dropdown } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import { constants } from '../../../config';
import style from './style.less';
import HackSearch from '../hackSearch';

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
    // 是否可操作
    disable: PropTypes.bool,
    // 默认搜索框值
    defaultSearchValue: PropTypes.string,
    // 菜单渲染父节点
    getPopupContainer: PropTypes.func,
    // 下拉预置列表
    presetOptionList: PropTypes.array,
  }

  static defaultProps = {
    name: 'customerDrop',
    placeholder: '',
    value: '',
    searchList: [],
    objId: '',
    boxStyle: {},
    theme: 'theme1',
    disable: false,
    defaultSearchValue: '',
    presetOptionList: [],
    getPopupContainer: () => document.querySelector(constants.container),
  }

  constructor(props) {
    super(props);
    const { searchList, presetOptionList, defaultSearchValue, value } = props;
    // 搜索框为空，显示预置下拉列表
    const isEmptySearchInput = _.isEmpty(defaultSearchValue);
    const optionList = isEmptySearchInput ? presetOptionList : searchList;
    this.state = {
      // 下拉选框是否展示
      isSHowModal: false,
      // 下拉框选项列表
      optionList,
      // 选中的值
      value,
      // 添加id标识
      id: new Date().getTime() + parseInt(Math.random() * 1000000, 10),
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.hideModal, false);
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

  @autobind
  onChange(searchValue) {
    if (_.isEmpty(searchValue)) {
      const { presetOptionList } = this.props;
      this.setState({
        // 当输入值为空时，显示预置下拉选项
        optionList: presetOptionList,
      });
    }
  }

  getSearchListDom(datList) {
    const { emitSelectItem, showObjKey, objId, name } = this.props;
    let searchValue = '';
    if (this.hackSearchComonent) {
      searchValue = this.hackSearchComonent.getValue();
    }
    const result = _.map(datList, (item, index) => {
      if (item.isHidden) {
        return null;
      }
      const value = item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`;
      const callBack = () => {
        // 多传一个默认输入值，有些场景下需要用到
        emitSelectItem({
          ...item,
          searchValue,
        });
        this.setState({
          isSHowModal: false,
          value,
        });
      };
      const idx = !item[objId] ? `selectList-${index}` : `${name}-${item[objId]}`;
      return (
        <li
          key={idx}
          className={style.ddsDrapMenuConItem}
          onClick={callBack}
          title={value}
        >
          {value}
        </li>
      );
    });
    return result;
  }

  @autobind
  clearValue() {
    this.setState({
      value: '',
    });
  }

  componentWillUnMount() {
    document.removeEventListener('click', this.hideModal, false);
  }

  @autobind
  showDrapDown() {
    this.setState({ isSHowModal: !this.state.isSHowModal });
  }

  @autobind
  toSearch(value) {
    // 在这里去触发查询搜索信息的方法
    this.props.emitToSearch(value);
  }

  @autobind
  hideModal(e) {
    // 隐藏下拉框
    const { isSHowModal } = this.state;
    if (+e.target.getAttribute('data-id') !== this.state.id && isSHowModal) {
      this.setState({ isSHowModal: false });
    }
  }

  @autobind
  clearSearchValue() {
    if (this.hackSearchComonent) {
      this.hackSearchComonent.clearValue();
    }
  }

  @autobind
  checkListIsEmpty() {
    const { searchList } = this.props;
    const { optionList } = this.state;
    const hiddenSearchList = searchList.filter(item => item.isHidden);
    return _.isEmpty(optionList)
      || (!_.isEmpty(searchList) && hiddenSearchList.length === searchList.length);
  }

  render() {
    const { theme, disable, getPopupContainer, defaultSearchValue } = this.props;
    const modalClass = classnames([style.ddsDrapMenu,
    { [style.hide]: !this.state.isSHowModal },
    ]);
    const ddsShowBoxClass = classnames([style.ddsShowBox,
    { [style.active]: this.state.isSHowModal },
    ]);
    const ddsShowBoxClass2 = classnames([
      style.ddsShowBox2,
      { [style.disable]: disable },
      { [style.active]: this.state.isSHowModal },
    ]);
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });
    const menu = (
      <div
        className={drapDownSelectCls}
        onClick={this.handleMenuClick}
      >
        <div className={modalClass}>
          <div
            className={style.ddsDrapMenuSearch}
            onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}
          >
            <HackSearch
              className={style.searhInput}
              placeholder={this.props.placeholder}
              onSearch={this.toSearch}
              defaultValue={defaultSearchValue}
              handleChange={this.onChange}
              ref={ref => this.hackSearchComonent = ref}
            />
          </div>
          {
            this.checkListIsEmpty() ? (
              <span className={style.notFound}>没有发现与之匹配的结果</span>
            ) : (
              <ul className={style.ddsDrapMenuCon}>
                {this.getSearchListDom(this.state.optionList)}
              </ul>
            )
          }
        </div>
      </div>
    );
    if (disable) {
      return (
        <div className={drapDownSelectCls}>
          <div
            className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
            data-id={this.state.id}
            style={this.props.boxStyle || {}}
          >
            {this.state.value}
          </div>
        </div>
      );
    }
    return (
      <Dropdown
        overlay={menu}
        trigger={['click']}
        visible={this.state.isSHowModal}
        getPopupContainer={getPopupContainer}
      >
        <div className={drapDownSelectCls}>
          <div
            onClick={this.showDrapDown}
            className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
            data-id={this.state.id}
            style={this.props.boxStyle || {}}
          >
            {this.state.value}
          </div>
        </div>
      </Dropdown>
    );
  }
}
