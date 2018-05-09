/**
 * @file components/commissionAdjustment/OtherCommissionSelectList.js
 * @description 其他佣金率Select选择列表
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import cx from 'classnames';
import { Icon } from 'antd';

import dictMap, { disabledMap } from '../../config/otherCommissionDictionary';
import OtherCommissionSelect from './OtherCommissionSelect';
import { seibelConfig } from '../../config';

import styles from './otherCommissionSelectList.less';

const { comsubs: commadj } = seibelConfig;

export default class OtherCommissionSelectList extends PureComponent {
  static propTypes = {
    showTip: PropTypes.bool.isRequired,
    reset: PropTypes.number.isRequired,
    otherRatios: PropTypes.array,
    onChange: PropTypes.func,
    subType: PropTypes.string.isRequired,
    custOpenRzrq: PropTypes.string,
    baseCommission: PropTypes.object,
  };

  static defaultProps = {
    otherRatios: [],
    onChange: () => {},
    custOpenRzrq: 'Y',
    baseCommission: {},
  };

  @autobind
  getWrapRef() {
    return this.wrap;
  }

  @autobind
  wrapRef(input) {
    this.wrap = input;
  }

  @autobind
  makeSelect(item) {
    const { onChange, reset, subType, custOpenRzrq, baseCommission } = this.props;
    // 单佣金调整需要针对两融开关进行下拉框disabled
    let disabled = false;
    const { code, options } = item;
    const { brief, paramName } = dictMap[code];
    if (subType === commadj.single
      && custOpenRzrq === 'N'
      && _.includes(disabledMap, paramName)) {
      disabled = true;
    }
    const newOptions = options.map(option => ({
      label: option.codeDesc,
      value: option.codeValue,
      show: true,
    }));
    if (!_.isEmpty(baseCommission)) {
      return (
        <OtherCommissionSelect
          initValue={baseCommission[paramName] || ''}
          disabled={disabled}
          reset={reset}
          key={code}
          label={brief}
          name={paramName}
          options={newOptions}
          onChange={onChange}
          getPopupContainer={this.getWrapRef}
        />
      );
    }
    return (
      <OtherCommissionSelect
        disabled={disabled}
        reset={reset}
        key={code}
        label={brief}
        name={paramName}
        options={newOptions}
        onChange={onChange}
        getPopupContainer={this.getWrapRef}
      />
    );
  }

  render() {
    const { otherRatios, showTip } = this.props;
    const compactRatios = _.compact(otherRatios);
    const orderRatios = _.sortBy(compactRatios, o => dictMap[o.code].order);
    const oddCommissionArray = _.filter(orderRatios, (v, index) => index % 2 === 1);
    const evenCommissionArray = _.filter(orderRatios, (v, index) => index % 2 === 0);
    const tipCls = cx({
      [styles.blockTip]: true,
      [styles.hide]: showTip,
    });
    return (
      <div className={styles.otherComsBoxWrap} ref={this.wrapRef}>
        <div className={styles.otherComsBox}>
          {
            evenCommissionArray.map(this.makeSelect)
          }
        </div>
        <div className={styles.otherComsBox}>
          {
            oddCommissionArray.map(this.makeSelect)
          }
        </div>
        <div className={tipCls}>
          <Icon type="exclamation-circle" />本功能不提供特殊资产校验的费率设置，如需调整请通过单客户佣金调整功能
        </div>
      </div>
    );
  }
}
