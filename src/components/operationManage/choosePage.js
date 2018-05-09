/**
 * @file /src/components/operationManage/ChoosePage.js
 * @description 切换运维管理下的页面
 * @author Wangjunjun
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';
import _ from 'lodash';

import styles from './choosePage.less';

// 运维管理中的页面路由配置
// key值对应url中的pathname
const ITOM_ROUTE = {
  // recommendationTags: '推荐标签',
  customerFeedback: '客户反馈',
  taskFeedback: '任务反馈',
};

export default (ComposedComponent) => {
  const choosePage = (props) => {
    const { location: { pathname } } = props;

    const handleClick = ({ key }) => {
      props.push({
        pathname: `/${key}`,
      });
    };

    const menu = (
      <Menu onClick={handleClick}>
        {
          _.map(_.toPairs(ITOM_ROUTE), ([key, value]) => <Menu.Item key={key}>{value}</Menu.Item>)
        }
      </Menu>
    );

    return (
      <div className={`content-inner ${styles.whiteBgColor}`}>
        <div className={styles.choosePage}>
          <Dropdown overlay={menu} trigger={['click']}>
            <span className={`ant-dropdown-link ${styles.clickable}`}>
              {ITOM_ROUTE[pathname.slice(1)]} <Icon type="down" />
            </span>
          </Dropdown>
        </div>
        <ComposedComponent {...props} />
      </div>
    );
  };

  choosePage.propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  };

  return choosePage;
};
