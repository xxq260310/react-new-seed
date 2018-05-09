/**
 * @file components/layout/TabMenu.js
 * 生成Tab导航菜单
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import { Menu, Dropdown, Icon } from 'antd';
import styles from './tabMenu.less';

function isInMoremenu(moreMenu, activeKey) {
  return !!_.find(moreMenu.children, item => item.id === activeKey);
}

export default class TabMenu extends PureComponent {
  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    mainArray: PropTypes.array.isRequired,
    moreMenuObject: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
  }

  getMenus(array, isMoreMenu) {
    const { path, activeKey } = this.props;

    return array.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={item.name}
            className={classnames({
              [styles.activeItem]: item.path ? path.indexOf(item.path) !== -1 : false,
              [styles.subMenuItem]: isMoreMenu,
              [styles.subMenuLink]: !isMoreMenu,
            })}
          >
            {this.getMenus(item.children, isMoreMenu)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.id}
          className={classnames({
            [styles.subItem]: true,
            [styles.activeItem]: item.path === path,
          })}
        >
          {
            isMoreMenu ?
              <div className={styles.moreMenuItem}>
                <div className={styles.link} title={`${item.name}`} onClick={() => this.change(item.id, activeKey)}>{item.name}</div>
                {
                  <div id={item.path === path ? 'activeTabPane' : null} className={styles.close} onClick={() => this.remove(item.id)}>
                    <Icon type="close" />
                  </div>
                }
              </div> :
              <div
                title={item.name}
                className={styles.linkItem}
                onClick={() => this.handleLinkClick(item)}
              >
                {item.name}
              </div>
          }
        </Menu.Item>
      );
    });
  }

  @autobind
  handleLinkClick(menuItem) {
    const { push, path } = this.props;
    if (menuItem.action === 'loadExternSystemPage') {
      window.open(menuItem.url, '_blank');
    } else if (menuItem.path !== path) {
      push({
        pathname: menuItem.path,
        query: menuItem.query,
      });
    }
  }

  @autobind
  remove(key) {
    const { onRemove } = this.props;
    onRemove(key);
  }

  @autobind
  change(key, activeKey) {
    const { onChange } = this.props;
    if (key !== activeKey) {
      onChange(key);
    }
  }

  @autobind
  renderDropdownMenu(menu, isMoreMenu = false) {
    const { activeKey } = this.props;
    const isActiveLink = isMoreMenu ? isInMoremenu(menu, activeKey) : (menu.id === activeKey);
    const placement = isMoreMenu ? 'bottomRight' : 'bottomLeft';
    const menus = (
      <Menu>
        {
          this.getMenus(menu.children, isMoreMenu)
        }
      </Menu>
    );
    return (
      <div
        key={menu.id}
        className={classnames({
          [styles.menuItem]: true,
          [styles.widerItem]: true,
          [styles.activeLink]: isActiveLink,
          [styles.moreButton]: isMoreMenu,
        })}
      >
        {/*
          <Dropdown.Button onClick={this.change} overlay={menus} trigger={['click']}>
              <div classnames={styles.text}>{menu.name}</div>
          </Dropdown.Button>
        */}
        <Dropdown placement={placement} overlay={menus} trigger={['hover']}>
          <div
            tabIndex="0"
            className={styles.text}
          >
            <div className={styles.link} title={`${menu.name}`}>{menu.name}</div>
            <i className="anticon anticon-change" />
          </div>
        </Dropdown>
      </div>
    );
  }

  @autobind
  renderLinkMenu(menu, closeable = false) {
    const { activeKey } = this.props;
    return (
      <div
        key={menu.id}
        className={classnames({
          [styles.menuItem]: true,
          [styles.widerItem]: closeable,
          [styles.activeLink]: menu.id === activeKey,
        })}
      >
        <div className={styles.text}>
          <div className={styles.link} title={`${menu.name}`} onClick={() => this.change(menu.id, activeKey)}>{menu.name}</div>
          {
            closeable ?
              <div id={menu.id === activeKey ? 'activeTabPane' : null} className={styles.close} onClick={() => this.remove(menu.id)}>
                <Icon type="close" />
              </div> : null
          }
        </div>
      </div>
    );
  }

  render() {
    const { mainArray, moreMenuObject } = this.props;
    return (
      <div id="tabMenu" className={styles.tabMenu}>
        {
          mainArray.map((menu, index) => {
            if (menu.children) {
              return this.renderDropdownMenu(menu, false, index);
            } else if (menu.pid === 'ROOT') {
              return this.renderLinkMenu(menu, false);
            }
            return this.renderLinkMenu(menu, true);
          })
        }
        {
          moreMenuObject.children.length === 0 ?
            null : this.renderDropdownMenu(moreMenuObject, true)
        }
      </div>
    );
  }
}
