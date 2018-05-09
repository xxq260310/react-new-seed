/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-21 13:39:44
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-14 20:08:37
 * 通用搜索组件，包含搜索历史记录，搜索热词联想，添加按钮
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon as AntdIcon, Button, Input, AutoComplete, message } from 'antd';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import logable from '../../../decorators/logable';
import styles from './index.less';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
let historySourceCount = 0;
let searchInputDOM;

export default class Search extends PureComponent {
  static propTypes = {
    // 请求联想关键词
    queryPossibleWords: PropTypes.func,
    // 请求历史搜索数据
    queryHistoryWdsList: PropTypes.func,
    // 联想出来的数据
    possibleWordsData: PropTypes.array,
    // 历史单词列表数据
    historySearchWordsList: PropTypes.array,
    // 清除搜索历史是否成功
    clearSuccess: PropTypes.bool,
    // 清除搜索历史请求
    clearHistorySearchList: PropTypes.func,
    // 搜索历史值
    searchHistoryVal: PropTypes.string,
    // 保存搜索的value
    saveSearchVal: PropTypes.func,
    // 是否需要大图标
    isNeedLgSearch: PropTypes.bool,
    // 搜索className
    searchWrapperClass: PropTypes.string,
    // 是否需要历史搜索功能
    isNeedRememberHistory: PropTypes.bool,
    // 搜索按钮功能
    onSearchClick: PropTypes.func,
    // 点击option某一项
    onOptionClick: PropTypes.func,
    // placeholder
    placeholder: PropTypes.string,
    // 搜索框style，宽度，高度等
    searchStyle: PropTypes.object,
    // 是否需要添加按钮
    isNeedAddBtn: PropTypes.bool,
    // 添加按钮事件
    addBtnCallback: PropTypes.func,
    // 是否需要搜索图标
    isNeedSearchIcon: PropTypes.bool,
  }

  static defaultProps = {
    queryPossibleWords: () => { },
    queryHistoryWdsList: () => { },
    clearHistorySearchList: () => { },
    saveSearchVal: () => { },
    clearSuccess: false,
    possibleWordsData: EMPTY_LIST,
    historySearchWordsList: EMPTY_LIST,
    searchHistoryVal: '',
    searchWrapperClass: '',
    isNeedRememberHistory: false,
    onSearchClick: () => { },
    onOptionClick: () => {
      console.log('option click');
    },
    placeholder: '',
    searchStyle: {},
    isNeedAddBtn: false,
    isNeedLgSearch: false,
    addBtnCallback: () => { },
    isNeedSearchIcon: true,
  }

  constructor(props) {
    super(props);
    this.isHaveAddEventOnInput = false;
    this.state = {
      // AutoComplete的数据源
      dataSource: EMPTY_LIST,
      // 历史搜索数据源
      historySource: [{
        title: '历史搜索',
        children: [{
          id: `history_${historySourceCount++}`,
          labelNameVal: '无',
          labelDesc: '',
        }],
      }],
    };
  }

  componentDidMount() {
    const {
      // 输入框历史搜索的值
      searchHistoryVal,
      // 点击过搜索框，产生的历史记录值列表
      historySearchWordsList,
      isNeedRememberHistory,
     } = this.props;

    if (isNeedRememberHistory) {
      this.handleCreateHistoryList(historySearchWordsList);
    }

    // 给search按钮添加回车事件
    searchInputDOM = ReactDOM.findDOMNode(document.querySelector('.ant-select-search .ant-input')); // eslint-disable-line
    if (searchInputDOM) {
      searchInputDOM.addEventListener('keydown', this.handleEnter, false);
    }
    // 初始化，根据输入框是否有值，联想数据
    this.handleSearch(searchHistoryVal);
  }

  componentWillReceiveProps(nextProps) {
    const {
      historySearchWordsList: preHistoryWdsList,
      clearSuccess: preClearSuccess,
      isNeedRememberHistory,
    } = this.props;

    const {
      possibleWordsData: nextPossibleWordsData = EMPTY_LIST,
      historySearchWordsList: nextHistoryWdsList,
      clearSuccess: nextClearSuccess,
    } = nextProps;
    const { inputVal } = this.state;

    this.setState({
      // 当输入框有值的时候
      // 将联想出来的热词塞入dataSource
      dataSource: inputVal ? this.searchResult(inputVal, nextPossibleWordsData) : [],
    });

    // 搜索历史不一样，则创建搜索历史list
    if (isNeedRememberHistory) {
      if (!_.isEqual(nextHistoryWdsList, preHistoryWdsList)) {
        this.handleCreateHistoryList(nextHistoryWdsList);
      }

      if (nextClearSuccess !== preClearSuccess) {
        if (!nextClearSuccess) {
          // 当清除不成功的时候，提示清除失败
          message.error('clear history search failure');
        }
      }
    }
  }

  componentWillUnmount() {
    if (searchInputDOM) {
      searchInputDOM.removeEventListener('keydown', this.handleEnter, false);
    }
  }

  // 选择option中的某一项，触发onSelect
  @autobind
  onSelect(item) {
    const { possibleWordsData } = this.props;
    const selectedItem = _.find(possibleWordsData, itemData =>
      itemData.id === item) || {};
    // 拿到的是item
    this.setState({
      inputVal: item,
      selectedItem,
    });
    this.handleSearch(item);
  }

  /**
   * 处理回车按键
   * @param {*} event 事件event
   */
  @autobind
  handleEnter(event) {
    const e = event || window.event;
    const { onSearchClick } = this.props;
    const { selectedItem } = this.state;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    // 回车键
    if (e && e.keyCode === 13) {
      // 阻止默认事件，譬如输入框在form中，回车会触发form submit
      e.preventDefault();
      const searchVal = e.target.value;
      if (_.isEmpty(_.trim(searchVal))) {
        message.info('搜索内容不能为空', 1);
        return false;
      }
      // 保存searchValue
      this.handleSaveSearchVal(searchVal);
      // 按了回车键
      onSearchClick({
        value: searchVal,
        selectedItem,
      });
    }
    return true;
  }

  // 历史搜索数据集合
  @autobind
  handleCreateHistoryList(historyWordsList) {
    if (!_.isEmpty(historyWordsList) && historyWordsList.length > 0) {
      const historyList = [];
      historyWordsList.forEach((item) => {
        if (!_.isEmpty(item)) {
          historyList.push({
            labelNameVal: item,
            id: `historyList${historySourceCount++}`,
            labelDesc: '',
          });
        }
      });
      this.setState({
        historySource: [{
          title: '历史搜索',
          children: historyList,
        }],
      });
    }
  }

  // 搜索结果
  /**
   * 搜索的结果，联想的热词结果
   * @param {*} query 当前输入的字符
   * @param {*} hotList 联想的list数据
   */
  searchResult(query, hotList) {
    return hotList.map((item, index) => ({
      // 展开返回结果中的item
      ...item,
      query,
      category: `${item.labelNameVal}${index}`,
      // 联想的内容
      content: item.labelNameVal,
      // 联想的内容描述
      desc: item.labelDesc,
      id: item.id,
    }));
  }

  // 初始化时，输入框有值，触发一次onSearch，然后联想出热词
  // 在搜索框中，输入一个值时，触发search，触发补全操作，请求后台产生联想关键词
  // 在搜索框中，将联想的字符塞入输入框时，再一次联想完整的关键词
  // 可以考虑加入节流函数
  @autobind
  handleSearch(value) {
    if (_.isEmpty(value)) {
      this.setState({
        inputVal: '',
        dataSource: [],
        selectedItem: {},
      });
      return;
    }
    this.setState({
      inputVal: value,
    });
    const { queryPossibleWords } = this.props;
    // 请求联想可能的数据
    queryPossibleWords({
      keyword: value,
    });
  }

  /**
   * 构造AutoComplete的option或optionGroup
   */
  createOption() {
    // dataSource, historySource, inputVal 发生变化，都会触发createOption
    const { isNeedRememberHistory } = this.props;
    const { dataSource, historySource, inputVal } = this.state;
    const newData = dataSource.map(this.renderOption);
    if (!_.isEmpty(inputVal)) {
      return newData;
    }
    if (isNeedRememberHistory) {
      // 构造历史搜索数据
      const history = this.renderGroup(historySource);
      // const options = newData.concat(history);
      return history;
    }
    return [];
  }

  /**
   * 搜索按钮事件
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '$state.inputVal关键字搜索' } })
  handleSearchBtn() {
    const { inputVal, selectedItem } = this.state;
    const { onSearchClick } = this.props;
    const searchVal = inputVal;
    if (_.isEmpty(_.trim(inputVal))) {
      message.info('搜索内容不能为空', 1);
      return false;
    }
    // 保存searchValue
    this.handleSaveSearchVal(searchVal);
    // 点击了搜索按钮
    onSearchClick({
      value: searchVal,
      selectedItem,
    });
    return true;
  }

  // 保存当前搜索的关键词到state中
  @autobind
  handleSaveSearchVal(saveVal) {
    const { saveSearchVal } = this.props;
    // 保存搜索关键词
    saveSearchVal({
      searchVal: saveVal,
    });
  }

  // 清除历史搜索
  @autobind
  handleClearHistory() {
    // 清楚历史搜索记录请求
    const { clearHistorySearchList } = this.props;
    clearHistorySearchList();

    // 恢复historySource
    this.setState({
      historySource: [{
        title: '历史搜索',
        children: [{
          id: `history_${historySourceCount++}`,
          labelNameVal: '无',
          labelDesc: '',
        }],
      }],
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加' } })
  handleAddClick() {
    // 当前输入或者联想到输入框里的value
    const { selectedItem } = this.state;
    const { addBtnCallback } = this.props;
    // 清空回调到输入框中的值
    this.setState({
      inputVal: '',
      dataSource: [],
    });
    addBtnCallback(selectedItem);
  }

  @autobind
  renderOption(item) {
    const { inputVal } = this.state;
    const { onOptionClick } = this.props;
    // 高亮显示搜索文本
    const newContent = item.content.replace(inputVal, `<em>${inputVal}</em>`);
    const newDesc = item.desc.replace(inputVal, `<em>${inputVal}</em>`);
    const isContentMatch = item.content.indexOf(inputVal) > -1;
    return (
      // 利用JSON序列化一下item，作为value，然后在onSelect时，再JSON.parse
      <Option key={item.id} text={isContentMatch ? item.id : item.desc}>
        <a
          onClick={onOptionClick}
          dangerouslySetInnerHTML={{ __html: newContent }} // eslint-disable-line
          rel="noopener noreferrer"
        />
        <span
          className="desc"
          dangerouslySetInnerHTML={{ __html: newDesc }} // eslint-disable-line
        />
      </Option>
    );
  }

  /**
   * 渲染历史搜索option Group
   * @param {*} historySource 数据源
   */
  renderGroup(historySource) {
    // 渲染历史搜索分组option
    const options = historySource.map(group => (
      <OptGroup
        key={group.title}
        label={this.renderTitle(group.title)}
      >
        {
          group.children.map(item => (
            item.labelNameVal === '无' ?
              <Option key={item.id} text={item.labelNameVal} disabled>
                {item.labelNameVal}
              </Option> :
              <Option key={item.id} text={item.labelNameVal} >
                <a
                  onClick={this.onGroupOptionClick}
                  rel="noopener noreferrer"
                >
                  {item.labelNameVal}
                </a>
              </Option>
          ))
        }
      </OptGroup>
    ));
    return options;
  }

  // 渲染下拉框的首部标题
  // 清楚历史搜索记录
  renderTitle(title) {
    const { historySource } = this.state;
    if (!_.isEmpty(historySource) && historySource[0].children[0].labelNameVal === '无') {
      return (
        <span>
          {title}
        </span>
      );
    }
    // 搜索历史不为空，出现清除历史记录按钮
    return (
      <span>
        {title}
        <a
          className={styles.delHistory_a}
          rel="noopener noreferrer"
          onClick={this.handleClearHistory}
        >
          <AntdIcon type="delete" />清除历史记录
        </a>
      </span>
    );
  }

  render() {
    const {
      searchHistoryVal,
      isNeedLgSearch,
      searchWrapperClass,
      placeholder,
      searchStyle,
      isNeedAddBtn,
      isNeedSearchIcon,
     } = this.props;

    // 构造下拉框数据源
    const dataSource = this.createOption();

    const searcIcon = isNeedSearchIcon ?
      <AntdIcon type="search" onClick={this.handleSearchBtn} /> : null;

    return (
      <div className={styles.searchBox}>
        <div className={styles.inner}>
          <div className={styles.inputBox}>
            <div className={searchWrapperClass}>
              <AutoComplete
                className={styles.autoCompleteWrapper}
                dropdownClassName={styles.autoCompleteDropdown}
                size="default"
                dataSource={dataSource}
                style={searchStyle}
                onSelect={this.onSelect}
                onSearch={_.debounce(this.handleSearch, 250)} // 防抖动，节流函数，保证不连续触发
                placeholder={placeholder}
                optionLabelProp="text"
                defaultValue={searchHistoryVal}
              /* getPopupContainer={() => document.getElementById('searchWrapper')} */
              >
                <Input
                  className={styles.inputSearch}
                  suffix={(
                    isNeedLgSearch ?
                      <Button
                        className={styles.searchBtn}
                        size="default"
                        type="primary"
                        onClick={this.handleSearchBtn}
                      >
                        {searcIcon}
                      </Button> :
                      searcIcon
                  )}
                />
              </AutoComplete>
              {
                isNeedAddBtn ?
                  <Button
                    className={styles.addBtnClass}
                    type="primary"
                    size="default"
                    onClick={this.handleAddClick}
                  >
                    添加
                  </Button> : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
