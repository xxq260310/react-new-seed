/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 17:09:13
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-25 15:52:00
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupListSearch.less';
import logable from '../../../decorators/logable';

const Search = Input.Search;

export default class CustomerGroupListSearch extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
    isNeedBtn: PropTypes.bool,
    searchStyle: PropTypes.object,
    defaultValue: PropTypes.string,
    titleNode: PropTypes.node,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    onSearch: () => { },
    isNeedBtn: false,
    searchStyle: {},
    defaultValue: '',
    titleNode: null,
    placeholder: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      curSearchValue: props.defaultValue,
    };
  }

  @autobind
  handleSearch(value) {
    const { onSearch } = this.props;
    // 清空搜索值
    // this.setState({
    //   curSearchValue: '',
    // });
    onSearch(value);
  }

  @autobind
  handleInputChange(e) {
    this.setState({
      curSearchValue: e.target.value,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '分组管理搜索' } })
  handleSearchEnter() {
    const { onSearch } = this.props;
    const { curSearchValue } = this.state;
    // 清空搜索值
    // this.setState({
    //   curSearchValue: '',
    // });
    onSearch(curSearchValue);
  }

  render() {
    const { isNeedBtn, searchStyle, titleNode, placeholder } = this.props;
    const { curSearchValue } = this.state;

    return (
      <div className={styles.searchWrapper}>
        {
          titleNode
        }
        {
          isNeedBtn ?
            <Search
              placeholder={placeholder}
              value={curSearchValue}
              onChange={this.handleInputChange}
              onSearch={this.handleSearch}
              style={searchStyle}
              enterButton
            />
          :
            <Input
              placeholder={placeholder}
              value={curSearchValue}
              onChange={this.handleInputChange}
              style={searchStyle}
              onPressEnter={this.handleSearchEnter}
            />
        }
      </div>
    );
  }
}
