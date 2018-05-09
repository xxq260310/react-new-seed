/**
 * @file components/common/filter/SingleFilter.js
 *  单项筛选
 * @author wangjunjun
 *
 * filterLabel string类型 筛选的对象 eg: '客户类型'
 * filterField array类型 筛选项
 * filter string类型 onChange回调方法中返回的对象的name值
 * value string类型 回填到组件的值，也是onChange回调方法中返回的对象的value值
 * onChange function类型 组件的回调方法，获取已选中的值
 *             返回一个对象 { name: 'name', value: 'value' }
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import Icon from '../Icon';
import { dom } from '../../../helper';
import { fspContainer } from '../../../config';
import logable from '../../../decorators/logable';

import styles from './filter.less';

export default class SingleFilter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  static defaultProps = {
    filterField: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      moreBtnVisible: false,
      fold: true,
    };
    this.domNodeLineHeight = '0px';
  }

  componentDidMount() {
    this.addMoreBtn();
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.addMoreBtn);
      sidebarShowBtn.addEventListener('click', this.addMoreBtn);
    }
  }

  componentWillUnmount() {
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.addMoreBtn);
      sidebarShowBtn.removeEventListener('click', this.addMoreBtn);
    }
  }

  // 判断是否超过一行，超过则显示 ... , 点击 ... 展开所有
  @autobind
  addMoreBtn() {
    if (this.domNode) {
      const domNodeHeight = dom.getCssStyle(this.domNode, 'height');
      this.domNodeLineHeight = dom.getCssStyle(this.domNode, 'line-height');
      if (parseInt(domNodeHeight, 10) >= 2 * parseInt(this.domNodeLineHeight, 10)) {
        this.domNode.style.height = this.domNodeLineHeight;
        this.setState({
          moreBtnVisible: true,
        });
      } else {
        this.domNode.style.height = 'auto';
        this.setState({
          moreBtnVisible: false,
          fold: true,
        });
      }
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '单选filter为$args[0]' } })
  handleClick(value) {
    const { filter, onChange } = this.props;
    this.setState({
      key: value,
    }, () => {
      onChange({
        name: filter,
        value,
      });
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '展开/收起' } })
  handleMore() {
    const { fold } = this.state;
    this.domNode.style.height = fold ? 'auto' : this.domNodeLineHeight;
    this.setState({ fold: !fold });
  }

  render() {
    const { filterLabel, filterField, value } = this.props;
    const { moreBtnVisible, fold } = this.state;
    const foldClass = classnames({ up: !fold });
    return (
      <div className={styles.filter}>
        <span title={filterLabel}>{filterLabel}:</span>
        <ul
          className={fold ? 'single' : 'multi'}
          ref={r => this.domNode = r}
        >
          {
            filterField.map(item => (
              <li
                key={item.key}
                className={value === item.key ? 'current' : ''}
                onClick={() => this.handleClick(item.key)}
              >
                {item.value}
              </li>
            ))
          }
          {
            moreBtnVisible ?
              <li className={styles.moreBtn} onClick={this.handleMore}>
                { fold ? '展开' : '收起' }&nbsp;
                <Icon type="more-down-copy" className={foldClass} />
              </li> :
            null
          }
        </ul>
      </div>
    );
  }
}
