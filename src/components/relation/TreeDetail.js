/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <Tree
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Modal } from 'antd';
import _ from 'lodash';

import Icon from '../common/Icon';
import DetailTable from './DetailTable';
import styles from './treeDetail.less';
import logable from '../../decorators/logable';

// detailTable 组件的表格类型
const COMPANY_TABLE = '2';
const CENTER_TABLE = '3';
const TEAM_TABLE = '4';

const confirm = Modal.confirm;
export default class TreeDetail extends Component {
  static propTypes = {
    headerLine: PropTypes.string,
    detail: PropTypes.object,
    category: PropTypes.string,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
  }

  static defaultProps = {
    headerLine: '',
    detail: {},
    category: '',
    onAdd: () => {},
    onDelete: () => {},
    onUpdate: () => {},
  }

  getTitle(defaultTitle, type, title1, title2) {
    let title = defaultTitle || '--';
    if (type === TEAM_TABLE) {
      title = _.isEmpty(title1) ? title : title1;
    } else if (type === CENTER_TABLE) {
      title = _.isEmpty(title2) ? title : title2;
    }
    return title;
  }

  @autobind
  handleDelete(param) {
    const that = this;
    confirm({
      okText: '确定',
      cancelText: '取消',
      title: '确认要删除吗?',
      content: '确认后，操作将不可取消。',
      onOk() { that.props.onDelete(param); },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '负责人' } })
  handleEditClick(obj, flag, category, hasManager) {
    this.props.onUpdate(obj, flag, category, hasManager);
  }

  @autobind
  renderHeader(obj) {
    const { category, headerLine } = this.props;
    const { orgName, postnDesc, login, loginName, postnId } = obj || {};
    const hasManager = !_.isEmpty(postnId);
    const isHiddenManager = _.isEmpty(login) && _.isEmpty(login);
    const title = this.getTitle(headerLine, category, postnDesc, orgName);
    return (
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.managerRow}>
          <div className={styles.info}>{'负责人：'}</div>
          {
            isHiddenManager ? null : (
              <div className={classnames(styles.info, styles.value)}>
                {`${(loginName || '--')}（${(login || '--')}）`}
              </div>
            )
          }
          {
            category === COMPANY_TABLE ? null : (
              <Icon
                type={'beizhu'}
                onClick={() => { this.handleEditClick(obj, true, category, hasManager); }}
                className={styles.editIcon}
              />
            )
          }
        </div>
      </div>
    );
  }

  render() {
    const { detail, category, onDelete, onUpdate, onAdd } = this.props;
    const { postnTree = [], currentPostn } = detail || {};
    const screenHeight = document.documentElement.clientHeight;
    const style = { height: `${(screenHeight - 109)}px` };
    // 给定唯一的key
    const newInfo = _.map(
      postnTree,
      (item, index) => ({ ...item, curId: `${index}` }),
    );
    return (
      <div className={styles.detailContainer} style={style}>
        {this.renderHeader(currentPostn)}
        <DetailTable
          category={category}
          rowKey={'curId'}
          tableData={newInfo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onAdd={onAdd}
        />
      </div>
    );
  }
}
