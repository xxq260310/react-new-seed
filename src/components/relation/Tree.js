/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <Tree
 *  treeData={object}
 *  onSelect={func}
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Menu } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './tree.less';
import logable from '../../decorators/logable';

// detailTable 组件的表格类型
const CENTER_TABLE = '3';
const TEAM_TABLE = '4';
const SubMenu = Menu.SubMenu;
export default class Tree extends Component {
  static propTypes = {
    treeData: PropTypes.object,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    treeData: {},
    onSelect: () => {},
    selectKey: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      defultKey: '',
      selectKey: '',
      openKeys: [],
      menuKeys: [],
      isCenterTree: false, // 标识：权限是 财富中心 级别的
    };
  }

  componentWillReceiveProps(nextProps) {
    const { treeData, onSelect } = nextProps;
    if (this.props.treeData === treeData) {
      return;
    }
    // 更新数据
    const { selectKey, defultKey } = this.state;
    if (!_.isEmpty(treeData)) {
      // orgId 作为唯一标识符
      const {
        returnPostnTree,
        currentPostn: { orgId, postnTypeCD = CENTER_TABLE },
      } = treeData;
      const isCenterTree = postnTypeCD === CENTER_TABLE;
      const menuKeys = _.map(
        returnPostnTree,
        item => (isCenterTree ? item.postnId : item.orgId),
      );
      if (_.isEmpty(selectKey) && _.isEmpty(defultKey)) {
        this.setState(
          { menuKeys, selectKey: orgId, defultKey: orgId, isCenterTree },
          () => { onSelect(this.getItem(orgId)); },
        );
      } else {
        this.setState({ menuKeys });
      }
    }
  }

  getHeadLine(obj) {
    const { orgName = '', orgId } = obj || {};
    if (!_.isEmpty(orgName)) {
      return { title: orgName, logo: orgName.substr(0, 1), orgId };
    }
    return { orgId };
  }

  @autobind
  getItem(key) {
    const { treeData } = this.props;
    const { currentPostn, currentPostn: { orgId }, returnPostnTree } = treeData;
    if (key === orgId) {
      return currentPostn;
    }
    const keys = _.split(key, '/');
    const list = { ...(_.omit(treeData, 'returnPostnTree')), children: returnPostnTree };
    const select = this.getBranchItem(list, keys);
    return select;
  }

  @autobind
  getBranchItem(list, keys) {
    const branchItem = _.find(list.children, (item) => {
      const { postnTypeCD = '' } = item;
      if (postnTypeCD === TEAM_TABLE) {
        return item.postnId === keys[0];
      }
      return item.orgId === keys[0];
    });
    if (keys.length === 1) {
      return branchItem;
    }
    return this.getBranchItem(branchItem, keys.slice(1));
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '点击分公司树菜单' } })
  handleSubmenuClick(submenu) {
    const { key } = submenu;
    const { selectKey } = this.state;
    // 去重
    if (selectKey !== key) {
      this.setState(
        { selectKey: key },
        () => { this.props.onSelect(this.getItem(key)); },
      );
    }
  }

  @autobind
  handleOpenClick(openKeys) {
    const { menuKeys, selectKey } = this.state;
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (menuKeys.indexOf(latestOpenKey) === -1) {
      // 点击菜单
      if (_.isEmpty(openKeys)) {
        const keys = _.split(selectKey, '/');
        const curKey = _.head(keys);
        this.setState(
          { openKeys, selectKey: curKey },
          () => {
            // 去重
            if (keys.length > 1) {
              this.props.onSelect(this.getItem(curKey));
            }
          },
        );
      }
    } else {
      this.setState(
        { openKeys: latestOpenKey ? [latestOpenKey] : [], selectKey: latestOpenKey },
        () => {
          // 去重
          if (selectKey !== latestOpenKey) {
            this.props.onSelect(this.getItem(latestOpenKey));
          }
        },
      );
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '点击分公司' } })
  handleLogoClick(logoKey) {
    const { selectKey } = this.state;
    // 去重
    if (logoKey !== selectKey) {
      this.setState(
        { openKeys: [], selectKey: logoKey },
        () => { this.props.onSelect(this.getItem(logoKey)); },
      );
    }
  }

  @autobind
  renderHeader(obj) {
    const { title = '--', logo = '--', orgId = '' } = this.getHeadLine(obj);
    return (
      <div className={styles.header}>
        <div className={styles.logoBg}>
          <div className={styles.logo} onClick={() => { this.handleLogoClick(orgId); }}>{logo}</div>
        </div>
        <div className={styles.title}>{title}</div>
      </div>
    );
  }

  renderTreeTitle(titleClass, item, isSelectMenu, isSelectSubmenu, isCenterTree) {
    const { orgName, postnDesc } = item;
    const title = isCenterTree ? postnDesc : orgName;
    return (
      <div
        className={classnames(
          styles.menu,
          {
            [styles.selectMenu]: isSelectMenu,
            [styles.selectChild]: isSelectSubmenu,
          },
        )}
      >
        <div className={styles.cycle}>{isCenterTree ? '团' : '财'}</div>
        <div className={titleClass}>{title}</div>
      </div>
    );
  }

  @autobind
  renderTree(paramData) {
    if (_.isEmpty(paramData)) {
      return null;
    }
    const { selectKey, openKeys, isCenterTree } = this.state;
    const keys = _.split(selectKey, '/');
    const isSelectSubmenu = (!_.isEmpty(keys) && keys.length > 1);
    const menuKey = _.head(keys);
    const screenHeight = document.documentElement.clientHeight;
    return (
      <Menu
        onClick={this.handleSubmenuClick}
        onOpenChange={this.handleOpenClick}
        openKeys={openKeys}
        style={{ width: '100%', height: `${(screenHeight - 208)}px` }}
        mode="inline"
      >
        {_.map(
          paramData,
          center => (
            <SubMenu
              key={isCenterTree ? center.postnId : center.orgId}
              title={this.renderTreeTitle(
                styles.centerName,
                center,
                (center.orgId === selectKey),
                (isSelectSubmenu && center.orgId === menuKey),
                isCenterTree,
              )}
            >
              {_.map(
                center.children,
                team => (
                  <Menu.Item
                    key={`${center.orgId}/${team.postnId}`}
                    className={classnames(
                      styles.submenu,
                      { [styles.selectSubmenu]: (`${center.orgId}/${team.postnId}` === selectKey) },
                    )}
                  >{team.postnDesc}</Menu.Item>
                ),
              )}
            </SubMenu>
          ),
        )}
      </Menu>
    );
  }

  render() {
    const { treeData: { currentPostn = {}, returnPostnTree = [] } } = this.props;
    const { postnTypeCD = CENTER_TABLE } = currentPostn || {};
    const isCenter = postnTypeCD === CENTER_TABLE;
    const screenHeight = document.documentElement.clientHeight;
    const style = { height: `${(screenHeight - 109)}px` };
    const menuContainerStyle = {
      width: '100%',
      height: `${(screenHeight - 208)}px`,
      overflow: 'auto',
    };
    return (
      <div
        className={classnames(styles.treeContainer, { [styles.centerTreeContainer]: isCenter })}
        style={style}
      >
        {this.renderHeader(currentPostn)}
        <div style={menuContainerStyle}>{this.renderTree(returnPostnTree)}</div>
      </div>
    );
  }
}
