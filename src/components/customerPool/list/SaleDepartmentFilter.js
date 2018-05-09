/**
 * @file components/customerPool/list/SaleDepartmentFilter.js
 *  客户列表项中按营业部筛选
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import CustRange from '../common/CustRange';
import logable from '../../../decorators/logable';
import styles from './saleDepartmentFilter.less';

const custRangeStyle = { width: 'auto', maxWidth: 150 };

export default class SaleDepartmentFilter extends PureComponent {

  static propTypes = {
    collectCustRange: PropTypes.func,
    updateQueryState: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    expandAll: PropTypes.bool,
    orgId: PropTypes.string,
  }

  static defaultProps = {
    expandAll: false,
    orgId: null,
    collectCustRange: () => { },
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务营业部：',
      value: '$args[0].orgId',
    },
  })
  handleCustRange(obj) {
    this.props.updateQueryState(obj);
  }

  render() {
    const {
      orgId,
      custRange,
      collectCustRange,
      expandAll,
    } = this.props;
    if (custRange && custRange.length <= 0) {
      return null;
    }
    console.log('SaleDepartmentFilter>>>', this.props);
    return (
      <div>
        <span className={styles.selectLabel}>服务营业部：</span>
        <CustRange
          selectBoxStyle={custRangeStyle}
          defaultFirst
          orgId={orgId}
          custRange={custRange}
          updateQueryState={this.handleCustRange}
          collectData={collectCustRange}
          expandAll={expandAll}
        />
      </div>
    );
  }
}
