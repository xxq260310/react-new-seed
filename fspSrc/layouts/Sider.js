/**
 * @file layouts/Sider.js
 *  侧栏
 * @author zhufeiyang
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch } from 'antd';

import Menus from './Menu';
import styles from './main.less';

function Sider({
  siderFold,
  location,
  navOpenKeys,
  changeOpenKeys,
  changeTheme,
  darkTheme,
}) {
  const menusProps = {
    siderFold,
    location,
    navOpenKeys,
    changeOpenKeys,
    darkTheme,
  };
  return (
    <div>
      <Menus {...menusProps} />
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />切换主题</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="黑" unCheckedChildren="白" />
      </div> : ''}
    </div>
  );
}

Sider.propTypes = {
  siderFold: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  navOpenKeys: PropTypes.array.isRequired,
  changeOpenKeys: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
  darkTheme: PropTypes.bool.isRequired,
};

export default Sider;
