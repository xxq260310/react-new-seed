/**
 * @file layouts/Menu.js
 * 侧边栏菜单组件
 * @author zhufeiyang
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import _ from 'lodash';

import { menu } from '../../src/config';

// 暂时这么写着，这个Menu组件暂时用不到
function isExternal() {
  return false;
}

// 当前展开的菜单项
const getSelectedKeys = (location) => {
  const { pathname } = location;
  if (pathname === '/') {
    const defaultItems = _.filter(menu, item => !!item.default);
    if (!_.isEmpty(defaultItems)) {
      return defaultItems.map(item => `/${item.path}`);
    }
  }
  return [pathname];
};

const topMenus = menu.map(item => item.path);

function getMenus(menuArray, siderFold, parentPath = '/') {
  return menuArray.map((item) => {
    const linkTo = isExternal(item.path) ? item.path : parentPath + item.path;
    if (item.child) {
      return (
        <Menu.SubMenu
          key={linkTo}
          title={
            <span>
              {item.icon ? <Icon type={item.icon} /> : ''}
              {siderFold && topMenus.indexOf(item.path) >= 0 ? '' : item.name}
            </span>
          }
        >
          {getMenus(item.child, siderFold, `${linkTo}/`)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={linkTo}>
        {
          isExternal(item.path) ?
            <a onClick={() => window.open(linkTo, '_blank')}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              {siderFold && topMenus.indexOf(item.path) >= 0 ? '' : item.name}
            </a>
            :
            <Link to={linkTo}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              {siderFold && topMenus.indexOf(item.path) >= 0 ? '' : item.name}
            </Link>
        }
      </Menu.Item>
    );
  });
}

let prevPathname = 'example';

let renderSwitch = true;

const parseOpenKeys = (selectedKeys) => {
  const keys = selectedKeys[0].slice(1).split('/').slice(0, -1);
  let parentPath = '';
  return keys.map((item) => {
    parentPath = `${parentPath}/${item}`;
    return parentPath;
  });
};

const getOpenKeys = (location, navOpenKeys, selectedKeys) => {
  const { pathname } = location;
  if (pathname === prevPathname && renderSwitch) {
    return navOpenKeys;
  }
  prevPathname = pathname;
  renderSwitch = !renderSwitch;
  return _.some(navOpenKeys, item => item === `/${selectedKeys[0].split('/')[1]}`) ?
    navOpenKeys :
    navOpenKeys.concat(parseOpenKeys(selectedKeys));
};

function Menus({
  siderFold,
  location,
  handleClickNavMenu,
  navOpenKeys = [],
  changeOpenKeys,
  darkTheme,
}) {
  const menuItems = getMenus(menu, siderFold);

  const onOpenChange = (Keys) => {
    changeOpenKeys(Keys);
  };

  // 加入当前已选择的菜单，已选择菜单的父菜单需要展开
  const selectedKeys = getSelectedKeys(location);
  const openKeys = getOpenKeys(location, navOpenKeys, selectedKeys);
  const menuProps = !siderFold ? {
    onOpenChange,
    openKeys,
  } : {};

  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      onClick={handleClickNavMenu}
      selectedKeys={selectedKeys}
    >
      {menuItems}
    </Menu>
  );
}

Menus.propTypes = {
  siderFold: PropTypes.bool.isRequired,
  darkTheme: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array.isRequired,
  changeOpenKeys: PropTypes.func.isRequired,
};

Menus.defaultProps = {
  handleClickNavMenu: () => {},
};

export default Menus;
