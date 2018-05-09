/*
 * @Author: LiuJianShu
 * @Date: 2017-07-01 16:06:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-08 14:26:07
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tree, Tooltip, message } from 'antd';
import _ from 'lodash';

import { fspContainer, optionsMap } from '../../config';
import MoveContainer from './MoveContainer';
import styles from './BoardSelectTree.less';
import logable from '../../decorators/logable';

const boardTypeMap = optionsMap.boardTypeMap;
const boardKeyName = optionsMap.boardKeyName;
const reactApp = fspContainer.reactApp;
const rcHieght = 400;

const TreeNode = Tree.TreeNode;
function getChildTree(key, name, arr) {
  let html;
  if (Array.isArray(arr)) {
    html = arr.map(item => (
      <TreeNode
        title={item.name}
        key={item.key}
        parentKey={key}
        parentName={name}
      />
    ));
  }
  return html;
}
// 根据数组组成 treeNode
function getTreeNode(arr, showThirdColumn) {
  const html = arr.map(item => (
    <TreeNode
      title={item.indicatorCategoryDto.categoryName}
      key={item.indicatorCategoryDto.categoryKey}
      unSelectable={1}
    >
      {
        item.detailIndicators.map(child => (
          <TreeNode
            title={child.name}
            key={child.key}
            className={(child.hasChildren && showThirdColumn) ? styles.arrow : ''}
            parentKey={item.indicatorCategoryDto.categoryKey}
          >
            {
              (showThirdColumn && child.hasChildren)
              && getChildTree(child.key, child.name, child.children)
            }
          </TreeNode>
        ))
      }
    </TreeNode>
  ));
  return html;
}

let testNode = null;
let belong = null;
function walk(orgArr, func) {
  func(orgArr);
  if (Array.isArray(orgArr)) {
    const childrenLen = orgArr.length;
    let i = 0;
    while (i < childrenLen) {
      const children = orgArr[i].children;
      walk(children, func);
      i++;
    }
  }
}
function findSelectNodeByKey(key, obj) {
  return (orgArr) => {
    if (Array.isArray(orgArr)) {
      for (let i = 0; i < orgArr.length; i++) {
        if (orgArr[i].key === key) {
          testNode = {
            ...orgArr[i],
            belongKey: obj.categoryKey,
          };
          belong = {
            key: obj.categoryKey,
            name: obj.categoryName,
          };
        }
      }
    }
  };
}

function findSelectNode(orgArr, key) {
  let node = null;
  for (let i = 0; i < orgArr.length; i++) {
    walk(orgArr[i].detailIndicators, findSelectNodeByKey(key, orgArr[i].indicatorCategoryDto));
    node = {
      node: testNode,
      belong,
    };
  }
  return node;
}

export default class BoardSelectTree extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    saveIndcator: PropTypes.func.isRequired,
    lengthLimit: PropTypes.bool,
  }
  static defaultProps = {
    lengthLimit: false,
  }
  constructor(props) {
    super(props);
    const { data: { type, boardType, checkTreeArr, checkedKeys } } = props;
    let showThirdColumn = false;
    let showTitle = false;
    // 如果看板是 经营业绩 类型 并且 指标是 总量指标 类型
    if (boardType === boardTypeMap.jyyj && type === boardKeyName.summury.key) {
      showThirdColumn = true;
    }
    if (boardType === boardTypeMap.lsdb_jyyj) {
      showThirdColumn = true;
    }
    if (boardType === boardTypeMap.jyyj && type === boardKeyName.detail.key) {
      showTitle = true;
    }
    // 是否是总量指标
    const isSummury = type === boardKeyName.summury.key;
    // 取出分类明细下的所有标题
    const allParentNodes = checkTreeArr.map(item => ({
      key: item.indicatorCategoryDto.categoryKey,
      name: item.indicatorCategoryDto.categoryName,
      children: [],
    }));
    // 默认展开项为指标树的第一项
    const expandedKeys = [checkTreeArr[0].indicatorCategoryDto.categoryKey];
    let selfCheckedNodes = [];
    if (checkedKeys.length) {
      if (!isSummury) {
        selfCheckedNodes = checkedKeys.map(item => ({
          ...findSelectNode(checkTreeArr, item).node,
          belongKey: findSelectNode(checkTreeArr, item).belong.key,
        }));
        allParentNodes.map((item) => {
          const newItem = item;
          selfCheckedNodes.forEach((child) => {
            if (newItem.key === child.belongKey) {
              newItem.children.push(child);
            }
          });
          return newItem;
        });
      } else {
        selfCheckedNodes = checkedKeys.map(item =>
        findSelectNode(checkTreeArr, item).node);
      }
    }
    this.state = {
      // checkTreeArr,               // 选择树的数组
      // expandedKeys,               // 展开的节点
      // autoExpandParent: true,     // 自动展开父节点
      // selectedKeys: [],           // selected 节点 key
      // selfCheckedNodes,           // 封装后组件用到的 checked 节点的信息
      // expandedChildren: [],       // 展开的子元素
      // checkedKeys,                // checked 的节点 key
      // type,                       // 选择树的类型，总量或者分类
      // isSummury,                  // 是否是总量指标
      // allParentNodes,             // 所有的二级节点信息
      // showThirdColumn,            // 是否显示第三列
      // showTitle,                  // 是否显示右边标题
      // checkedOrSelected: false,   // 选中或 选择时的状态
      // length: 0,                  // 已经选中的个数
      checkTreeArr,
      expandedKeys,
      autoExpandParent: true,
      selectedKeys: [],
      selfCheckedNodes,
      expandedChildren: [],
      checkedKeys,
      type,
      isSummury,
      allParentNodes,
      showThirdColumn,
      boardType,
      showTitle,
      checkedOrSelected: false,
      length: checkedKeys.length,
    };
  }

  componentDidMount() {
    this.registerScrollEvent();
    this.rcRegisterScrollEvent();
  }

  componentWillUnmount() {
    const rightChild = this.treeMainRightChild;
    const leftChild = this.treeMainLeftChild;
    leftChild.removeEventListener('wheel', this.stopSpread);
    leftChild.removeEventListener('mousewheel', this.stopSpread);
    leftChild.removeEventListener('DOMMouseScroll', this.stopSpread);
    rightChild.removeEventListener('wheel', this.stopSpread);
    rightChild.removeEventListener('mousewheel', this.stopSpread);
    rightChild.removeEventListener('DOMMouseScroll', this.stopSpread);
  }

  // 展开子选项的事件
  @autobind
  @logable({ type: 'Click', payload: { name: '指标树的展开/收起事件' } })
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  // 点击 checkbox 的事件
  @autobind
  @logable({ type: 'Click', payload: { name: '指标树的check事件' } })
  onCheck(checkedKeys, { checked, event, node: { props: { eventKey } } }) {
    const obj = {
      keyArr: checkedKeys,
      key: eventKey,
      active: checked,
      type: event,
    };
    this.checkOrSelect(obj);
  }

  // 点击选择的事件
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '指标树的选中事件',
      value: '$args[0]',
    },
  })
  onSelect(selectedKeys, { selected, event, node: { props, props: { eventKey } } }) {
    // 一级指标不可以点
    if (props.unSelectable && props.unSelectable) {
      return;
    }
    const obj = {
      keyArr: selectedKeys,
      key: eventKey,
      active: selected,
      type: event,
    };
    this.checkOrSelect(obj);
  }

  // 右边删除按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '删除指标$agrs[0]' } })
  onRemove(item) {
    const {
      checkTreeArr,
      isSummury,
      allParentNodes,
      checkedKeys,
      selfCheckedNodes,
    } = this.state;
    const nowSelectNodeBelong = findSelectNode(checkTreeArr, item.key).belong;
    const newCheckedKeys = _.remove(checkedKeys, n => (n !== item.key));
    const newSelfCheckedNodes = _.remove(selfCheckedNodes, n => (n.key !== item.key));
    if (!isSummury) {
      allParentNodes.map((child) => {
        let newItem = child;
        if (nowSelectNodeBelong.key === newItem.key) {
          newItem = _.remove(newItem.children, n => (n.key === item.key));
        }
        return newItem;
      });
    }
    this.setState({
      allParentNodes,
      checkedKeys: newCheckedKeys,
      selfCheckedNodes: newSelfCheckedNodes,
    }, this.transferTreeState);
  }

  // 拖拽事件
  @autobind
  @logable({ type: 'Click', payload: { name: '拖拽指标$agrs[0]' } })
  onDnd(data) {
    const {
      isSummury,
      allParentNodes,
    } = this.state;
    if (!isSummury) {
      allParentNodes.map((item) => {
        const newItem = item;
        if (newItem.key === data[0].belongKey) {
          newItem.children = data;
        }
        return newItem;
      });
      this.setState({
        allParentNodes,
      }, this.transferTreeState);
    } else {
      this.setState({
        selfCheckedNodes: data,
      }, this.transferTreeState);
    }
  }

  // tooltip
  @autobind
  getTooltipContainer() {
    return document.querySelector(reactApp);
  }

  // 获取出最终选择树的值，传递给外层方法
  @autobind
  transferTreeState(itemNodeStr) {
    const { selfCheckedNodes, isSummury, allParentNodes } = this.state;
    const { saveIndcator } = this.props;
    if (itemNodeStr) {
      const itemNode = document.querySelectorAll(itemNodeStr)[0];
      if (itemNode) {
        this.treeMainRightChild.scrollTop = itemNode.offsetTop - 34;
      } else {
        this.treeMainRightChild.scrollTop = this.treeMainRightChild.scrollHeight;
      }
    }
    this.rcRegisterScrollEvent();
    if (isSummury) {
      const summuryArr = selfCheckedNodes.map(item => item.key);
      // 输出总量指标
      // console.warn('summuryArr', summuryArr);
      this.setState({
        length: summuryArr.length,
      });
      saveIndcator('summury', summuryArr);
    } else {
      const newTemp = _.filter(allParentNodes, o => (o.children.length));
      const detailArr = newTemp.map(item => ({
        categoryKey: item.key,
        detailIndicatorIds: item.children.map(child => child.key),
      }));
      // 输出分类指标
      // console.warn('detailArr', detailArr);
      saveIndcator('detail', detailArr);
    }
  }
  // 点击或者选择的相同操作
  @autobind
  checkOrSelect(obj) {
    // 找出当前点击或者选择的节点信息，并存到 state 中
    const {
      checkTreeArr,
      isSummury,
      allParentNodes,
      selfCheckedNodes,
      expandedKeys,
      expandedChildren,
      length,
    } = this.state;
    const { lengthLimit } = this.props;
    let newSelfCheckedNodes = selfCheckedNodes;
    // 点击的节点信息字符串
    let itemNodeStr;
    let newExpandedChildren;
    const nowSelectNode = findSelectNode(checkTreeArr, obj.key).node;
    const nowSelectNodeBelong = findSelectNode(checkTreeArr, obj.key).belong;

    // 如果找到当前节点，并且当前节点有 子元素，展开子元素并且更新 已展开子元素 的 state
    const allParentNodesKeys = allParentNodes.map(item => (item.key));
    // 取出旧的展开项与二级节点的交集
    const newExpandedKeys = _.intersection(expandedKeys, allParentNodesKeys);
    if (nowSelectNode && nowSelectNode.hasChildren) {
      this.onExpand(_.uniq(_.concat(newExpandedKeys, obj.key)));
      newExpandedChildren = nowSelectNode.children;
    } else {
      let flag = false;
      // 循环展开的子元素数组，判断出是否包含当前点击的节点
      if (expandedChildren.length) {
        expandedChildren.forEach((item) => {
          if (item.key === obj.key) {
            flag = true;
          }
        });
      }
      // 如果不包含，则将展开节点设置为默认值
      if (!flag) {
        this.onExpand(newExpandedKeys);
        // 将已展开的子元素设为空
        newExpandedChildren = [];
      }
    }
    // 触发选中事件时，将所有选中的节点取出来生成生的数组，放到最终传值的数组中
    // 如果是选中事件
    if (obj.type === 'check') {
      // 如果是明细指标，则将选中的节点信息存放到 相应的 父节点下
      if (!isSummury) {
        allParentNodes.map((item) => {
          let newItem = item;
          if (newItem.key === nowSelectNodeBelong.key) {
            itemNodeStr = `.${nowSelectNodeBelong.key}Ref`;
            // 判断是否超过 400
            // 如果现在有这个 title 的 key，直接滚动到 title 的位置
            // 没有这个 title 的 key ，直接滚动到最后的位置
            if (obj.active) {
              newItem.children.push(nowSelectNode);
            } else {
              newItem = _.remove(newItem.children, n => (n.key === obj.key));
            }
          }
          return newItem;
        });
      }
      // 如果是选中状态，添加进去
      if (obj.active) {
        // 如果有长度限制
        if (lengthLimit) {
          if (length >= 9) {
            message.error('最多只能选择 9 个指标');
            return;
          }
        }
        newSelfCheckedNodes.push(nowSelectNode);
      } else {
      // 否则删除
        // console.warn('length', length);
        newSelfCheckedNodes = _.remove(newSelfCheckedNodes, n => (n.key !== obj.key));
      }
      this.setState({
        allParentNodes,
        nowSelectNode,
        selfCheckedNodes: newSelfCheckedNodes,
        selectedKeys: [],
        checkedKeys: obj.keyArr,
        checkedOrSelected: obj.active,
        expandedChildren: newExpandedChildren || expandedChildren,
      }, () => this.transferTreeState(itemNodeStr));
    } else {
      this.setState({
        nowSelectNode,
        selectedKeys: obj.keyArr,
        checkedOrSelected: obj.active,
        expandedChildren: newExpandedChildren || expandedChildren,
      }, this.transferTreeState);
    }
  }
  // 右边子元素的滚动监听事件
  @autobind
  rcRegisterScrollEvent() {
    const rightChild = this.treeMainRightChild;
    const rcScrollHeight = rightChild.scrollHeight;
    if (rcScrollHeight > rcHieght) {
      rightChild.addEventListener('wheel', this.stopSpread, false);
      rightChild.addEventListener('mousewheel', this.stopSpread, false);
      rightChild.addEventListener('DOMMouseScroll', this.stopSpread, false);
    } else {
      rightChild.removeEventListener('wheel', this.stopSpread);
      rightChild.removeEventListener('mousewheel', this.stopSpread);
      rightChild.removeEventListener('DOMMouseScroll', this.stopSpread);
    }
  }

  @autobind
  stopSpread(e = window.event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  @autobind
  registerScrollEvent() {
    const leftChild = this.treeMainLeftChild;
    leftChild.addEventListener('wheel', this.stopSpread, false);
    leftChild.addEventListener('mousewheel', this.stopSpread, false);
    leftChild.addEventListener('DOMMouseScroll', this.stopSpread, false);
  }
  render() {
    const {
      checkTreeArr,
      type,
      isSummury,
      selectedKeys,
      selfCheckedNodes,
      allParentNodes,
      checkedKeys,
      autoExpandParent,
      expandedKeys,
      nowSelectNode,
      showThirdColumn,
      showTitle,
      checkedOrSelected,
      boardType,
    } = this.state;
    const { lengthLimit } = this.props;
    const treeNodeHtml = getTreeNode(checkTreeArr, showThirdColumn);
    // 组成分类下面的父指标的说明文字
    let description = '';
    if (nowSelectNode && nowSelectNode.children) {
      nowSelectNode.children.forEach((item) => {
        description += `${item.name}、`;
      });
    }
    description = _.trimEnd(description, '、');
    return (
      // 树结构整体
      <div className={styles.treeBody}>
        {/* 树结构总标题 */}
        {
          lengthLimit ?
            null
          :
            <div className={styles.treeTitle}>
              <h2 className={styles[`treeTitle${type}`]}>
                {boardKeyName[type].name}
                <Tooltip
                  placement="topLeft"
                  title={boardKeyName[type].title}
                  overlayClassName="visibleRangeToolTip"
                  getPopupContainer={this.getTooltipContainer}
                >
                  <span className={styles.treeTitleSpan} />
                </Tooltip>
              </h2>
            </div>
        }
        {/* 树结构主干布局 */}
        <div className={styles.treeMain}>
          {/* 树结构左边部分 */}
          <div className={styles.treeMainLeft}>
            <h3 className={styles.treeDivNodeTitle}>请选择指标</h3>
            {/* 树结构左边部分子元素 */}
            <div className={[styles[`treeMainLeftContent${boardType}${type}`]]}>
              <div
                ref={(treeMainLeftChild) => { this.treeMainLeftChild = treeMainLeftChild; }}
                className={styles.treeMainLeftChild}
              >
                <Tree
                  checkable
                  checkStrictly
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  checkedKeys={checkedKeys}
                  selectedKeys={selectedKeys}
                  onSelect={this.onSelect}
                  onCheck={this.onCheck}
                  onExpand={this.onExpand}
                >
                  {treeNodeHtml}
                </Tree>
              </div>
              {
                (isSummury && showThirdColumn) ?
                  <div className={styles.treeMainLeftChild}>
                    <div />
                  </div>
                :
                  null
              }
            </div>
          </div>
          {/* 树结构右边部分 */}
          <div className={styles.treeMainRight}>
            <h3 className={styles.treeDivNodeTitle}>
              已选择指标
              <span>(对已选择指标拖动可以改变指标的前后顺序)</span>
            </h3>
            <div
              className={styles.treeMainRightChild}
              ref={(treeMainRightChild) => { this.treeMainRightChild = treeMainRightChild; }}
            >
              {
                isSummury ?
                  <MoveContainer
                    data={selfCheckedNodes}
                    isSum={isSummury}
                    onRemove={this.onRemove}
                    onDnd={this.onDnd}
                  />
                :
                  allParentNodes.map(item => (
                    item.children.length ?
                      <div
                        key={`${item.key}Key`}
                        className={`${item.key}Ref ${styles.treeMainRigthChildTitle}`}
                      >
                        {
                          showTitle ?
                            <h3>{item.name}</h3>
                          :
                            null
                        }
                        {
                          <MoveContainer
                            key={`${item.key}Move`}
                            data={item.children}
                            isSum={isSummury}
                            onRemove={this.onRemove}
                            onDnd={this.onDnd}
                          />
                        }
                      </div>
                    :
                      null
                  ))
              }
            </div>
          </div>
        </div>
        <div className={styles.treeNodeInfo}>
          {
            (nowSelectNode && nowSelectNode.key && checkedOrSelected) ?
              <div>
                <h4>
                  <span>{nowSelectNode.name}：</span>
                  {nowSelectNode.description}
                </h4>
                {
                  (!isSummury && nowSelectNode.children) ?
                    <h4>
                      <span>说明：</span>
                      当前所选为汇总指标，包含以下子项目：{description}
                    </h4>
                  :
                    null
                }
              </div>
            :
              null
          }
        </div>
      </div>
    );
  }
}

