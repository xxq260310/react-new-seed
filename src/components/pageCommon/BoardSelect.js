/**
 * @fileOverview pageCommon/BoardSelect.js
 * @author sunweibin
 * @description 看板切换Select
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';

import { constants, BoardBasic, optionsMap } from '../../config';
import { dom, event } from '../../helper';
import { canCustomBoard } from '../../permissions';
import styles from './BoardSelect.less';
import logable from '../../decorators/logable';

const defaultBoardId = constants.boardId;
const sliceLength = BoardBasic.regular.length;
const visibleBoardType = optionsMap.visibleBoardType;

export default class BoardSelect extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    visibleBoards: PropTypes.array.isRequired,
    newVisibleBoards: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const { visibleBoards, location: { query: { boardId }, pathname } } = this.props;
    const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || defaultBoardId;
    let boardName = visibleBoardType.manage.name;
    if (pathname !== '/boardManage') {
      boardName = this.findBoardBy(bId, visibleBoards).name;
    }
    this.state = {
      dropdownVisible: false,
      addScrollBar: false,
      boardName,
      hasRegisterWheel: false,
      showMenu: false,
      showSubMenu: false,
    };
  }

  componentDidMount() {
    this.registerScrollEvent();
  }

  componentWillReceiveProps(nextProps) {
    const { visibleBoards, location: { query: { boardId } } } = nextProps;
    const { visibleBoards: preVB, location: { query: { boardId: preId } } } = this.props;
    if (!_.isEqual(visibleBoards, preVB) || !_.isEqual(boardId, preId)) {
      const bId = boardId
        || (visibleBoards.length && String(visibleBoards[0].id))
        || defaultBoardId;
      const boardName = this.findBoardBy(bId, visibleBoards).name;
      this.setState({
        boardName,
      });
    }
  }

  componentWillUnmount() {
    const menuUl = this.menuUl;
    const subMenuUl = this.subMenuUl;
    event.removeWheelEvent(menuUl, this.stopSpread);
    event.removeWheelEvent(subMenuUl, this.stopSpread);
  }

  @autobind
  setFixedBottomRef(node) {
    this.fixedBottom = node;
  }
  @autobind
  setMenuUlRef(node) {
    this.menuUl = node;
  }
  @autobind
  setSubMenuUl(node) {
    this.subMenuUl = node;
  }
  @autobind
  setMenuTitleRef(node) {
    this.menuTitle = node;
  }

  @autobind
  stopSpread(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  @autobind
  registerScrollEvent() {
    const { showMenu, showSubMenu } = this.state;
    const menuUl = this.menuUl;
    const subMenuUl = this.subMenuUl;
    if (showMenu) {
      event.addWheelEvent(menuUl, this.stopSpread);
    } else {
      event.removeWheelEvent(menuUl, this.stopSpread);
    }
    if (showSubMenu) {
      event.addWheelEvent(subMenuUl, this.stopSpread);
    } else {
      event.removeWheelEvent(subMenuUl, this.stopSpread);
    }
  }

  @autobind
  findBoardBy(id, vr) {
    const newId = Number.parseInt(id, 10);
    let board = _.find(vr, { id: newId });
    const { location: { pathname } } = this.props;
    if (pathname === '/boardManage') {
      board = {
        name: visibleBoardType.manage.name,
      };
    }
    return board || vr[0];
  }

  // 鼠标进入
  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标进入' } })
  mouseEnter() {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 显示菜单
    this.setState({
      showMenu: true,
      showSubMenu: false,
    }, () => {
      this.registerScrollEvent();
      const height = parseInt(dom.getCssStyle(this.menuUl, 'height'), 10);
      const titleHeight = parseInt(dom.getCssStyle(this.menuTitle, 'height'), 10);
      const addScrollBar = this.menuUl.scrollHeight > height;
      this.setState({
        addScrollBar,
      });
      this.fixedBottom.style.top = `${height + titleHeight}px`;
      this.subMenuUl.style.top = `${height + titleHeight}px`;
    });
  }

  // 鼠标离开
  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标离开' } })
  mouseLeave() {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 隐藏菜单
    this.timer = setTimeout(() => {
      this.setState({
        showMenu: false,
        showSubMenu: false,
      }, this.registerScrollEvent);
    }, 500);
  }

  // 二级菜单鼠标进入
  @autobind
  subMouseEnter() {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 显示二级菜单
    this.setState({
      showMenu: true,
      showSubMenu: true,
    }, this.registerScrollEvent);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '自定义看板鼠标进入' } })
  handleMouseEnter() {
    this.subMouseEnter();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '二级菜单鼠标进入' } })
  subMenuMouseEnter() {
    this.subMouseEnter();
  }

  // 二级菜单鼠标移出
  @autobind
  @logable({ type: 'Click', payload: { name: '自定义看板鼠标移出' } })
  subMouseLeave() {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 隐藏二级菜单
    this.timer = setTimeout(() => {
      this.setState({
        showSubMenu: false,
      }, this.registerScrollEvent);
    }, 500);
  }

  // 普通看板菜单点击事件
  @autobind
  @logable({ type: 'Click', payload: { name: '普通看板菜单点击事件' } })
  handleOrdinaryBoardMenuClick(e) {
    this.menuClick(e);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '历史看板菜单点击事件' } })
  handleHistoryBoardMenuClick(e) {
    this.menuClick(e);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '可见看板数组最后一个对象中的普通看板菜单点击事件' } })
  handleVisibleOrdinaryBoardMenuClick(e) {
    this.menuClick(e);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '自定义看板菜单点击事件' } })
  handleCustomerBorderMenuClick(e) {
    this.menuClick(e);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '可见看板数组最后一个对象中的历史看板菜单点击事件' } })
  handleVisibleHistoryBoardMenuClick(e) {
    this.menuClick(e);
  }

  // 菜单点击事件
  @autobind
  menuClick(e) {
    const target = e.target;
    const { push, collectData, visibleBoards } = this.props;
    let key;
    let type;
    let boardType;
    if (target.dataset) {
      const dataSet = target.dataset;
      key = dataSet.key;
      type = dataSet.type;
      boardType = dataSet.boardType;
    } else {
      key = target.getAttribute('data-key');
      type = target.getAttribute('data-type');
      boardType = target.getAttribute('data-board-type');
    }
    let boardname;
    switch (type) {
      case visibleBoardType.manage.key:
        collectData({
          text: '看板管理',
        });
        push('/boardManage');
        break;
      case visibleBoardType.ordinary.key:
        boardname = _.find(visibleBoards, { id: Number(key) }).name;
        collectData({
          text: boardname,
        });
        push(`/report?boardId=${key}`);
        break;
      case visibleBoardType.history.key:
        boardname = _.find(visibleBoards, { id: Number(key) }).name;
        collectData({
          text: boardname,
        });
        push(`/history?boardId=${key}&boardType=${boardType}`);
        break;
      default:
        break;
    }
    this.setState({
      showMenu: false,
      showSubMenu: false,
    });
  }

  render() {
    // 新的可见看板数组
    const { newVisibleBoards } = this.props;
    const { boardName, showMenu, showSubMenu, addScrollBar } = this.state;
    // 根据 showMenu 来判断是否显示
    const showOrNot = showMenu ? 'block' : 'none';
    // 静态的看板数组
    const staticBorads = _.slice(newVisibleBoards, [0], [sliceLength]);
    // 普通看板的静态数组
    const ordinaryStaticBoards = _.slice(staticBorads, 0, 2);
    // 历史看板的静态数组
    const historyStaticBoards = _.slice(staticBorads, 2, 4);
    // 可见看板数组中最后一个对象
    const lastVisibleBoards = newVisibleBoards[newVisibleBoards.length - 1];
    // 获取一级菜单滚动的长度
    // 普通看板的静态数组生成 html
    const ordinaryHtml = (
      ordinaryStaticBoards.map(item => (
        <li
          onClick={this.handleOrdinaryBoardMenuClick}
          data-key={item.id}
          data-type={visibleBoardType.ordinary.key}
          title={item.name}
          key={item.id}
        >
          {item.name}
        </li>
      ))
    );
    // 历史看板的静态数组生成 html
    const historyHtml = (
      historyStaticBoards.map(item => (
        <li
          onClick={this.handleHistoryBoardMenuClick}
          data-key={item.id}
          data-type={visibleBoardType.history.key}
          data-board-type={item.boardType}
          title={item.name}
          key={item.id}
        >
          {item.name}
        </li>
      ))
    );
    // 可见看板数组最后一个对象中的普通看板数组生成 html
    const lastVisibleBoardsOrdinaryHtml = (
      lastVisibleBoards.ordinary.map(item => (
        <li
          onClick={this.handleVisibleOrdinaryBoardMenuClick}
          data-key={item.id}
          data-type={visibleBoardType.ordinary.key}
          title={item.name}
          key={item.id}
        >
          {item.name}
        </li>
      ))
    );
    // 可见看板数组最后一个对象中的历史看板数组生成 html
    const lastVisibleBoardsHistoryHtml = (
      lastVisibleBoards.history.map(item => (
        <li
          onClick={this.handleVisibleHistoryBoardMenuClick}
          data-key={String(item.id)}
          data-type={visibleBoardType.history.key}
          data-board-type={item.boardType}
          key={item.id}
        >
          {item.name}
        </li>
      ))
    );
    const addScrollBarClassName = classnames({
      [styles.menuDiv]: true,
      [styles.addScrollBar]: addScrollBar,
    });
    return (
      <div
        className={addScrollBarClassName}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        {/* 看板列表名字 */}
        <h3
          className={styles.menuH3}
          ref={this.setMenuTitleRef}
        >
          {boardName}<Icon type={showMenu ? 'up' : 'down'} />
        </h3>
        {/* 看板整体列表 */}
        <ul
          className={styles.menuUl}
          style={{ display: showOrNot }}
          ref={this.setMenuUlRef}
        >
          {ordinaryHtml}
          {historyHtml}
          {lastVisibleBoardsOrdinaryHtml}
        </ul>
        {/* 底部固定的选项容器 */}
        <div
          className={styles.fixedBottom}
          style={{ display: showOrNot }}
          ref={this.setFixedBottomRef}
        >
          <ul>
            <li
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.subMouseLeave}
            >
              自定义看板<Icon type="right" />
            </li>
            {
              canCustomBoard() ?
                <li
                  onClick={this.handleCustomerBorderMenuClick}
                  data-key="0"
                  data-type={visibleBoardType.manage.key}
                >
                  {visibleBoardType.manage.name}
                </li>
              :
                null
            }
          </ul>
        </div>
        {/* 二级菜单列表 */}
        <ul
          className={styles.subMenuUl}
          style={{ display: showSubMenu ? 'block' : 'none' }}
          onMouseEnter={this.subMenuMouseEnter}
          ref={this.setSubMenuUl}
        >
          {lastVisibleBoardsHistoryHtml}
        </ul>
      </div>
    );
  }
}
