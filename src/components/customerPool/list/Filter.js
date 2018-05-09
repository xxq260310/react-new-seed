/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import { SingleFilter, MultiFilter } from '../../common/filter';

// 从搜索、联想词、标签、已开通业务过来的
const SEARCH_TAG_FILTER = [
  'search', 'tag', 'association', 'business', 'custIndicator',
  'numOfCustOpened', 'sightingTelescope',
];

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
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
  }

  // 瞄准镜筛选
  @autobind
  renderSightingTelescopeFilter() {
    const {
      location: { query: { source, filters } },
      sightingTelescopeFilters,
      onFilterChange,
    } = this.props;
    if (source !== 'sightingTelescope' ||
      _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
      return null;
    }
    const filtersArray = filters ? filters.split('|') : [];
    return _.map(sightingTelescopeFilters.filterList, (obj) => {
      const target = _.find(filtersArray, (item) => {
        const [name] = item.split('.');
        return name === obj.filterCode;
      });
      const backfillValue = (target || '').split('.')[1] || '';
      return (<SingleFilter
        key={obj.filterCode}
        value={backfillValue}
        filterLabel={obj.filterDesc}
        filter={obj.filterCode}
        filterField={transformData(obj.items)}
        onChange={onFilterChange}
      />);
    });
  }

  render() {
    const { dict, location, onFilterChange } = this.props;
    const {
      source,
      filters = '',
    } = location.query;
    const filtersArray = filters ? filters.split('|') : [];
    const currentValue = _.reduce(filtersArray, (result, value) => {
      const [name, code] = value.split('.');
      result[name] = code; // eslint-disable-line
      return result;
    }, {});
    return (
      <div className="filter">
        {this.renderSightingTelescopeFilter()}
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={currentValue.CustomType || ''}
              filterLabel="客户性质"
              filter="CustomType"
              filterField={dict.custNature}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={currentValue.CustClass || ''}
              filterLabel="客户类型"
              filter="CustClass"
              filterField={dict.custType}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={currentValue.RiskLvl || ''}
              filterLabel="风险等级"
              filter="RiskLvl"
              filterField={dict.custRiskBearing}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <MultiFilter
              value={currentValue.Rights || ''}
              filterLabel="已开通业务"
              filter="Rights"
              filterField={dict.custBusinessType}
              onChange={onFilterChange}
            /> : null
        }
        {
          _.includes(['numOfCustOpened', 'business', 'sightingTelescope'], source) ?
            <MultiFilter
              value={currentValue.Unrights || ''}
              filterLabel="可开通业务"
              filter="Unrights"
              filterField={dict.custUnrightBusinessType}
              onChange={onFilterChange}
            /> : null
        }
      </div>
    );
  }
}
