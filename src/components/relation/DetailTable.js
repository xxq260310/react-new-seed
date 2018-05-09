/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <DetailTable
 *  treeData={object}
 *  onSelect={func}
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Modal } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from '../common/Icon';
import Button from '../common/Button';
import styles from './detailTable.less';
import logable from '../../decorators/logable';

const confirm = Modal.confirm;
// detailTable 组件的表格类型
const COMPANY_TABLE = '2';
const CENTER_TABLE = '3';
const TEAM_TABLE = '4';

function columnsOne(category) {
  const name = category === COMPANY_TABLE ? 'orgName' : 'postnDesc';
  const manager = category === COMPANY_TABLE ? 'loginName' : 'loginName';
  return [{
    title: '名称',
    key: name,
    dataIndex: name,
    width: '25%',
    render: item => (
      <div className={classnames(styles.column, styles.title)} title={item}>
        {item || '--'}
      </div>
    ),
  }, {
    title: '负责人',
    dataIndex: manager,
    key: manager,
    width: '25%',
    render: item => (
      <div className={classnames(styles.column, styles.manager)} title={item}>
        {item || '--'}
      </div>
    ),
  }];
}

const columnsTwo = [{
  title: '团队数量',
  key: 'teamCount',
  dataIndex: 'teamCount',
  width: '25%',
  render: item => (
    <div className={classnames(styles.column, styles.teamNum)} title={item}>
      {item || '0'}
    </div>
  ),
}, {
  title: '投顾人数',
  dataIndex: 'empCount',
  key: 'empCount',
  width: '25%',
  render: item => (
    <div className={classnames(styles.column, styles.adviserNum)} title={item}>
      {item || '0'}
    </div>
  ),
}];

const columnsTree = [{
  title: '工号',
  key: 'login',
  dataIndex: 'login',
  width: '33%',
  render: item => (
    <div className={classnames(styles.column, styles.code)} title={item}>
      {item || '--'}
    </div>
  ),
}, {
  title: '姓名',
  dataIndex: 'loginName',
  key: 'loginName',
  width: '33%',
  render: item => (
    <div className={classnames(styles.column, styles.name)} title={item}>
      {item || '--'}
    </div>
  ),
}];
const extra = {
  [COMPANY_TABLE]: { title: '下属财富中心' },
  [CENTER_TABLE]: { title: '下属团队', buttonTitle: '添加团队' },
  [TEAM_TABLE]: { buttonTitle: '添加成员' },
};

const actionColumns = (category, action) => {
  const { deleteFunc, updateFunc } = action;
  function deleteClick(type, item) {
    if (_.isFunction(deleteFunc)) {
      deleteFunc(type, item);
    }
  }
  function updateClick(item) {
    if (_.isFunction(updateFunc)) {
      updateFunc(item);
    }
  }
  return {
    title: '操作',
    key: 'action',
    render: (item) => {
      const isCenter = category === CENTER_TABLE;
      return (
        <div className={styles.action}>
          <div className={styles.delete}>
            <Icon
              type={'shanchu'}
              className={styles.deleteIcon}
              onClick={() => { deleteClick(category, item); }}
            />
          </div>
          {
            isCenter ? (
              <div className={styles.update}>
                <Icon
                  type={'beizhu'}
                  className={styles.updateIcon}
                  onClick={() => { updateClick(item); }}
                />
              </div>
            ) : null
          }
        </div>
      );
    },
  };
};

export default class DetailTable extends Component {
  static propTypes = {
    tableData: PropTypes.array,
    category: PropTypes.string,
    rowKey: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tableData: [],
    category: '',
    rowKey: '',
  }

  @autobind
  getColumns(category) {
    if (category === CENTER_TABLE) {
      return [
        ...(columnsOne(category)),
        _.last(columnsTwo),
        actionColumns(
          category,
          { deleteFunc: this.handleDeleteClick, updateFunc: this.handleUpdateClick },
        ),
      ];
    } else if (category === TEAM_TABLE) {
      return [...columnsTree, actionColumns(category, { deleteFunc: this.handleDeleteClick })];
    }
    return [...(columnsOne(category)), ...columnsTwo];
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '删除$args[1]' } })
  handleDeleteClick(category, item) {
    const { onDelete } = this.props;
    confirm({
      okText: '确定',
      cancelText: '取消',
      title: '请确认是否删除?',
      onOk() {
        onDelete(category, item);
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '编辑$args[1]' } })
  handleUpdateClick(item) {
    this.props.onUpdate(item);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加' } })
  handleAddClick(category) {
    this.props.onAdd(category);
  }

  @autobind
  renderExtra() {
    const { category } = this.props;
    if (_.isEmpty(category)) {
      return null;
    }
    const { title, buttonTitle } = extra[category];
    const hasTitle = !_.isEmpty(title);
    const hasBtnTitle = !_.isEmpty(buttonTitle);
    return (
      <div
        className={classnames(
          styles.extra,
          { [styles.memberExtra]: (!hasTitle && hasBtnTitle) },
        )}
      >
        {
          hasTitle ? (
            <div className={styles.title}>{title}</div>
          ) : null
        }
        {
          hasBtnTitle ? (
            <Button
              type="default"
              size="large"
              onClick={() => { this.handleAddClick(category); }}
              className={classnames(styles.btn, { [styles.memberBtn]: (category === TEAM_TABLE) })}
            >
              {buttonTitle}
            </Button>
          ) : null
        }
      </div>
    );
  }

  render() {
    const { category, rowKey, tableData } = this.props;
    const screenHeight = document.documentElement.clientHeight;
    const y = screenHeight - 296;
    return (
      <div className={styles.tableContainer}>
        {this.renderExtra()}
        <div className={styles.table}>
          <Table
            rowKey={record => record[rowKey]}
            columns={this.getColumns(category)}
            dataSource={tableData}
            pagination={false}
            scroll={{ y }}
            // 默认文案配置
            locale={{
              // 空数据时的文案
              emptyText: '暂无数据',
            }}
          />
        </div>
      </div>
    );
  }
}
