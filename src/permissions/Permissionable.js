/**
 * @file permissions/index.js
 *  给组件添加相应权限
 * @author maoquan(maoquan@htsc.com)
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'dva';

const getCheckList = (options) => {
  if (_.isArray(options)) {
    return [...options];
  } else if (_.isObject(options)) {
    return options.checkList;
  } else if (_.isString(options)) {
    return [options];
  }
  return [];
};

const mapStateToProps = state => ({
  permissions: _.map(state.app.empInfo.empRespList, item => item.respId),
});

export default options => (ComposedComponent) => {
  const enableList = getCheckList(options);

  @connect(mapStateToProps)
  class PermissionableComponent extends PureComponent {
    static propTypes = {
      permissions: PropTypes.array.isRequired,
    };

    render() {
      const { permissions, ...others } = this.props;
      if (_.intersection(enableList, permissions)) {
        return <ComposedComponent {...others} />;
      }
      return null;
    }
  }

  return PermissionableComponent;
};
