/**
 * @file components/customerPool/Reorder.js
 *  客户池-客户列表排序
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import logable from '../../../decorators/logable';

import styles from './reorder.less';

// 激活的样式class
const ACTIVE = 'active';

// 升序降序的方向值
const DESC = 'desc';
const ASC = 'asc';

// 排序的字段
const OPENDT = 'OpenDt';
const FEE = 'Fee';
const ASET = 'Aset';

// 排序的字段配置，方便后面修改
const openTimeAsc = { sortType: OPENDT, sortDirection: ASC };
const openTimeDesc = { sortType: OPENDT, sortDirection: DESC };
const commissionAsc = { sortType: FEE, sortDirection: ASC };
const commissionDesc = { sortType: FEE, sortDirection: DESC };
const totalAssetsAsc = { sortType: ASET, sortDirection: ASC };
const totalAssetsDesc = { sortType: ASET, sortDirection: DESC };

export default class Order extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
  }

  // 判断点击的按钮，是否添加 class = active
  @autobind
  getIconCls(obj) {
    return _.isEqual(this.props.value, obj) ? ACTIVE : '';
  }

  // 设置li的class
  @autobind
  getItemCls(value) {
    const { value: { sortType } } = this.props;
    return sortType === value ? ACTIVE : '';
  }

  // 处理点击排序按钮
  @autobind
  toggleOrder(st) {
    const { onChange, value: { sortType, sortDirection } } = this.props;
    let sd = DESC;
    if (sortType === st) {
      sd = sortDirection === DESC ? ASC : DESC;
    }
    onChange({
      sortType: st,
      sortDirection: sd,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '总资产' } })
  handleAssetClick(st) {
    this.toggleOrder(st);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '开户时间' } })
  handleOpenTiemClick(st) {
    this.toggleOrder(st);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '佣金率' } })
  handleRateClick(st) {
    this.toggleOrder(st);
  }

  render() {
    return (
      <ul className={styles.reorder}>
        <li
          className={this.getItemCls(ASET)}
          onClick={() => this.handleAssetClick(ASET)}
        >
          总资产
          <div className={styles.btn}>
            <Icon
              type="xiangshang"
              className={this.getIconCls(totalAssetsAsc)}
            />
            <Icon
              type="xiangxia"
              className={this.getIconCls(totalAssetsDesc)}
            />
          </div>
        </li>
        <li
          className={this.getItemCls(OPENDT)}
          onClick={() => this.handleOpenTiemClick(OPENDT)}
        >
          开户时间
          <div className={styles.btn}>
            <Icon
              type="xiangshang"
              className={this.getIconCls(openTimeAsc)}
            />
            <Icon
              type="xiangxia"
              className={this.getIconCls(openTimeDesc)}
            />
          </div>
        </li>
        <li
          className={this.getItemCls(FEE)}
          onClick={() => this.handleRateClick(FEE)}
        >
          佣金率
          <div className={styles.btn}>
            <Icon
              type="xiangshang"
              className={this.getIconCls(commissionAsc)}
            />
            <Icon
              type="xiangxia"
              className={this.getIconCls(commissionDesc)}
            />
          </div>
        </li>
      </ul>
    );
  }
}
