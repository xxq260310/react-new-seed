/**
 * @Author: ouchangzhi
 * @Date: 2018-01-12 10:50:20
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-12 14:27:46
 * @description 头部导航栏次级菜单下拉菜单
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import CustomLink from './CustomLink';


function Overlay({ menus }) {
  const overlay = menus.map((menu) => {
    let menuItem = null;
    if (menu.children && menu.children.length) {
      menuItem = (
        <Menu.SubMenu key={menu.id} title={menu.name}>
          <Overlay menus={menu.children} />
        </Menu.SubMenu>
      );
    } else {
      menuItem = (
        <Menu.Item key={menu.id}>
          <CustomLink
            action={menu.action}
            name={menu.name}
            url={menu.url}
            path={menu.path}
          />
        </Menu.Item>
      );
    }
    return menuItem;
  });
  return <Menu>{overlay}</Menu>;
}

Overlay.propTypes = {
  menus: PropTypes.array.isRequired,
};

Overlay.defaultProps = {
  menus: [],
};

export default Overlay;
