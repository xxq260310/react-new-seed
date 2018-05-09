/**
 * @Author: ouchangzhi
 * @Date: 2018-01-12 13:15:38
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-12 15:51:37
 * @description 头部导航单个菜单
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'antd';
import Overlay from './Overlay';
import CustomLink from './CustomLink';

import styles from './navItem.less';

function NavItem({ id, name, action, path, url, subMenu, isHaveSplitLine }) {
  const overlay = <Overlay menus={subMenu} />;
  return (
    <Dropdown overlay={overlay} key={id}>
      <div>
        <span className={styles.navItem}>
          <CustomLink action={action} path={path} url={url} name={name} />
          { subMenu && subMenu.length ? <Icon type="down" className={styles.icon} /> : null}
        </span>
        { isHaveSplitLine ? <span className={styles.splitLine} /> : null }
      </div>
    </Dropdown>
  );
}

NavItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  action: PropTypes.string,
  path: PropTypes.string,
  url: PropTypes.string,
  subMenu: PropTypes.array,
  isHaveSplitLine: PropTypes.bool,
};

NavItem.defaultProps = {
  action: '',
  path: '',
  url: '',
  subMenu: [],
  isHaveSplitLine: true,
};

export default NavItem;
