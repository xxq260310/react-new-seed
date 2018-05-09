import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import hoistStatics from 'hoist-non-react-statics';
import { Route } from 'dva/router';
import { parse, stringify } from 'query-string';
import warn from 'warning';
/**
 * A public higher-order component to access the imperative API
 */

// 设置两个备忘变量，性能优化
let rememberQuery = {};
let rememberSearch = '';

const withRouter = (Component) => {
  const C = (props) => {
    const { wrappedComponentRef, replace, push, ...remainingProps } = props;

    function hackReplace(...args) {
      if (typeof args[0] === 'string') {
        return replace(...args);
      }
      const params = {
        search: `?${stringify(args[0].query)}`,
        ...args[0],
      };
      return replace(params);
    }

    function hackPush(...args) {
      // TODO 针对相同的地址，不切换
      if (typeof args[0] === 'string') {
        return push(...args);
      }
      const params = {
        search: `?${stringify(args[0].query)}`,
        ...args[0],
      };
      return push(params);
    }

    function parseSearch(search) {
      if (search !== rememberSearch) {
        // 支持boolean类型解析
        rememberQuery = _.mapValues(parse(search), (value) => {
          if (value === 'true') {
            return true;
          } else if (value === 'false') {
            return false;
          }
          return value;
        });
        rememberSearch = search;
      }
      return rememberQuery;
    }

    return (
      <Route
        render={({ history, location, match }) => {
          const routeComponentProps = {
            history,
            match,
            location: {
              ...location,
              query: parseSearch(location.search),
            },
          };
          return (
            <Component
              {...remainingProps}
              replace={hackReplace}
              push={hackPush}
              {...routeComponentProps}
              ref={wrappedComponentRef}
            />
          );
        }}
      />
    );
  };

  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;
  C.propTypes = {
    wrappedComponentRef: PropTypes.func,
    replace: PropTypes.func,
    push: PropTypes.func,
  };
  C.defaultProps = {
    wrappedComponentRef: () => { },
    replace: () => warn(false, '请在mapDispatchToProps里面传递routerRedux.replace方法'),
    push: () => warn(false, '请在mapDispatchToProps里面传递routerRedux.push方法'),
  };

  return hoistStatics(C, Component);
};

export default withRouter;
