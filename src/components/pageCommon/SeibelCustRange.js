/**
 * @file seibelCustRange.js
 *  seibel客户范围筛选组件
 * @author hongguangqing
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { constants } from '../../config';
import { event } from '../../helper';
import styles from './seibelCustRange.less';

function transformCustRangeData(list, parent = '') {
  return list.map((item) => {
    const obj = {
      label: item.name,
      value: parent
        ?
        `${item.level}-${item.id}-${parent}-${item.name}`
        :
        `${item.level}-${item.id}-${item.name}`,
      key: item.id,
    };
    if (item.children && item.children.length) {
      obj.children = transformCustRangeData(item.children, item.name);
    }
    return obj;
  });
}

let custRangeNameDedault = '';

function walk(orgArr, func, parent) {
  func(orgArr, parent);
  if (Array.isArray(orgArr)) {
    const childrenLen = orgArr.length;
    let i = 0;
    while (i < childrenLen) {
      const children = orgArr[i].children;
      walk(children, func, orgArr[i].label);
      i++;
    }
  }
}

function findOrgNameByOrgId(orgId) {
  return (orgArr, parent) => {
    if (Array.isArray(orgArr)) {
      for (let i = 0; i < orgArr.length; i++) {
        if (orgArr[i].key === orgId) {
          custRangeNameDedault = parent !== '' ?
          `${parent}/${orgArr[i].label}`
          :
          `${orgArr[i].label}`;
        }
      }
    }
  };
}

export default class CustRange extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func,
    updateQueryState: PropTypes.func,
    custRange: PropTypes.array.isRequired,
    orgId: PropTypes.string,
  }

  static defaultProps = {
    orgId: '',
    collectData: () => {},
    updateQueryState: () => {},
  }

  constructor(props) {
    super(props);
    const { custRange } = this.props;
    let initValue = {};
    let formatCustRange = null;
    if (!_.isEmpty(custRange) && this.props.orgId) {
      formatCustRange = transformCustRangeData(custRange);
      walk(formatCustRange, findOrgNameByOrgId(this.props.orgId), '');
      initValue = {
        label: custRangeNameDedault,
        value: this.props.orgId,
      };
    } else {
      formatCustRange = [];
      initValue = {
        label: '全部',
        value: 'all',
      };
    }

    this.state = {
      formatCustRange,
      value: initValue,
      open: false,
    };
  }

  componentDidMount() {
    const app = document.querySelector(constants.container);
    app.addEventListener('mousewheel', this.handleMousewheel, false);
    app.addEventListener('DOMMouseScroll', this.handleMousewheel, false);
  }

  componentWillReceiveProps(nextProps) {
    const { custRange, orgId } = nextProps;
    const { orgId: preOrgId } = this.props;
    if (orgId !== preOrgId || orgId) {
      const formatCustRange = transformCustRangeData(custRange);
      walk(formatCustRange, findOrgNameByOrgId(orgId), '');
      const initValue = {
        label: custRangeNameDedault,
        value: orgId,
      };
      // 切换报表了，恢复默认值
      this.setState({
        value: initValue,
        open: false,
      });
    }
  }

  @autobind
  onChange(value) {
    if (!value) {
      return;
    }
    const { updateQueryState, custRange, collectData } = this.props;
    const tmpArr = value.value.split('-');
    const custRangeLevel = tmpArr[0];
    const orgId = tmpArr[1];
    const custRangeName = tmpArr.slice(2).join('/');
    const changedValue = {
      label: custRangeName,
      value: custRangeName
                ?
                `${custRangeLevel}-${orgId}-${custRangeName}`
                : custRange[0].id,
    };
    this.setState({
      value: changedValue,
    });
    collectData({
      text: custRangeName,
    });
    updateQueryState({
      orgId,
      custRangeLevel,
      level: custRangeLevel,
      scope: Number(custRangeLevel) + 1,
    });
  }

  @autobind
  handleMousewheel() {
    const dropDown = document.querySelector('.ant-select-dropdown');
    if (!dropDown) {
      return;
    }
    this.addDropDownMouseWheel();
    event.triggerMouseDown(document.querySelector(constants.container));
  }

  @autobind
  handleDropDownMousewheel(e = window.event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  @autobind
  addDropDownMouseWheel() {
    const elem = document.querySelector('.ant-select-tree-dropdown');
    if (elem) {
      elem.addEventListener('wheel', this.handleDropDownMousewheel, false);
      elem.addEventListener('mousewheel', this.handleDropDownMousewheel, false);
      elem.addEventListener('DOMMouseScroll', this.handleDropDownMousewheel, false);
    }
  }

  render() {
    const { custRange } = this.props;
    const { value } = this.state;
    const formatCustRange = transformCustRangeData(custRange);
    if (_.isEmpty(value)) {
      return null;
    }
    return (
      <TreeSelect
        notFoundContent="没有结果"
        className={styles.custRang}
        value={value}
        treeData={formatCustRange}
        onChange={this.onChange}
        dropdownStyle={{ maxHeight: 400, minWidth: 230, overflow: 'auto' }}
        treeNodeFilterProp={'title'}
        showSearch
        dropdownMatchSelectWidth
        labelInValue
        getPopupContainer={() => document.querySelector(constants.container)}
      />
    );
  }
}
