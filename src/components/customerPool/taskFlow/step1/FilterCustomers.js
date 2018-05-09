/**
 * @file components/customerPool/taskFlow/FilterCustomers.js
 *  瞄准镜筛查客户弹窗-客户筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { isSightingScope } from '../../helper';
import SingleFilter from '../../common/NewSingleFilter';
import MultiFilter from '../../common/NewMutiFilter';
import FilterMoreButton from '../../common/FilterMoreButton';
import styles from './filterCustomers.less';
import logable from '../../../../decorators/logable';

// 数据转化
// [{itemCode: '1', itemDesc: 'fg'}] => [{key: '1', value: 'fg'}]
const transformData = list => _.map(list, item => _.mapKeys(item, (value, key) => {
  if (key === 'itemCode') {
    return 'key';
  }
  if (key === 'itemDesc') {
    return 'value';
  }
  return key;
}));


export default class Filter extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onCloseIconClick: PropTypes.func.isRequired,
    onCheckMoreButton: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    source: PropTypes.string,
    currentItems: PropTypes.array.isRequired,
    currentAllItems: PropTypes.array.isRequired,
    filtersCloseIconState: PropTypes.array.isRequired,
  }

  static defaultProps = {
    source: '',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '取消选中',
      value: '$args[0].name',
    },
  })
  handleCloseIconClick(obj) {
    this.props.onCloseIconClick(obj);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选中',
      value: '$args[0].name',
    },
  })
  handleCheckMoreButton(obj) {
    this.props.onCheckMoreButton(obj);
  }

  // 瞄准镜筛选
  @autobind
  renderSightingTelescopeFilter() {
    const {
      sightingTelescopeFilters,
      onFilterChange,
      onCloseIconClick,
      source,
      currentItems,
      filtersCloseIconState,
    } = this.props;

    if (!isSightingScope(source) ||
      _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
      return null;
    }
    return _.map(sightingTelescopeFilters.filterList, (obj) => {
      const target = _.find(currentItems, (item) => {
        const [name] = item.split('.');
        return name === obj.filterCode;
      });
      const backfillValue = (target || '').split('.')[1] || '';

      const statusItem = _.find(filtersCloseIconState, item => item.name === obj.filterCode);
      let status = statusItem && statusItem.status;
      if (status === undefined) {
        status = true;
      }
      const cls = classnames({
        [styles.filter]: true,
        [styles.hidden]: status,
      });

      // 筛选出来对应筛选条件的hideCloseIcon状态
      return (
        <div className={cls} key={obj.filterCode}>
          <SingleFilter
            key={obj.filterCode}
            value={backfillValue}
            filterLabel={obj.filterDesc}
            filter={obj.filterCode}
            filterField={transformData(obj.items)}
            onChange={onFilterChange}
            hideCloseIcon={false}
            status={status}
            onCloseIconClick={onCloseIconClick}
          />
        </div>
      );
    });
  }

  @autobind
  renderMoreFilterSelect() {
    const {
      sightingTelescopeFilters,
      onFilterChange,
      source,
      filtersCloseIconState,
    } = this.props;

    if (!isSightingScope(source) ||
      _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
      return null;
    }

    return (
      <div className={styles.filter}>
        <FilterMoreButton
          valueArray={filtersCloseIconState}
          labelArray={sightingTelescopeFilters.filterList}
          onChange={onFilterChange}
          onCloseIconClick={this.handleCloseIconClick}
          onCheckMoreButton={this.handleCheckMoreButton}
        />
      </div>
    );
  }

  render() {
    const { dict, onFilterChange, currentItems, currentAllItems } = this.props;
    const currentValue = _.reduce(currentItems, (result, value) => {
      const [name, code] = value.split('.');
      result[name] = code; // eslint-disable-line
      return result;
    }, {});

    const valueObjForCustBusinessType =
      _.filter(currentAllItems, obj => obj.name === 'Rights')[0];
    const valueObjForUnrightBusinessType =
      _.filter(currentAllItems, obj => obj.name === 'Unrights')[0];

    const valueForCustBusinessType =
      valueObjForCustBusinessType && valueObjForCustBusinessType.valueArray;
    const valueForUnrightBusinessType =
      valueObjForUnrightBusinessType && valueObjForUnrightBusinessType.valueArray;


    return (
      <div className={styles.mainFilter}>
        <div className={styles.filterSection}>
          <div className={styles.filter}>
            <SingleFilter
              value={currentValue.CustomType || ''}
              filterLabel="客户性质"
              filter="CustomType"
              filterField={dict.custNature}
              onChange={onFilterChange}
            />
          </div>
          <div className={styles.filter}>
            <SingleFilter
              value={currentValue.CustClass || ''}
              filterLabel="客户类型"
              filter="CustClass"
              filterField={dict.custType}
              onChange={onFilterChange}
            />
          </div>
          <div className={styles.filter}>
            <SingleFilter
              value={currentValue.RiskLvl || ''}
              filterLabel="风险等级"
              filter="RiskLvl"
              filterField={dict.custRiskBearing}
              onChange={onFilterChange}
            />
          </div>
          <div className={styles.filter}>
            <MultiFilter
              value={currentValue.Rights || ''}
              valueArray={valueForCustBusinessType}
              filterLabel="已开通业务"
              filter="Rights"
              filterField={dict.custBusinessType}
              onChange={onFilterChange}
            />
          </div>
          <div className={styles.filter}>
            <MultiFilter
              value={currentValue.Unrights || ''}
              valueArray={valueForUnrightBusinessType}
              filterLabel="可开通业务"
              filter="Unrights"
              filterField={dict.custUnrightBusinessType}
              onChange={onFilterChange}
            />
          </div>
          {this.renderMoreFilterSelect()}
        </div>
        <div className={styles.filterSectionMore}>
          {this.renderSightingTelescopeFilter()}
        </div>
      </div>
    );
  }
}
