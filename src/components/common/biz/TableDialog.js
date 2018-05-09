/**
 * @description 带table的弹框，统一样式
 * @author zhangjunli
 * Usage:
 * <TableDialog
 *  visible={bool}
 *  columns={array}
 *  title={string}
 *  onSearch={func}
 *  onOk={func}
 *  onCancel={func}
 *  modalKey={string}
 * />
 * visible: 必须的，控制是否出现弹框
 * columns: 必须的，用于table的列标题的定义
 * title：必须的，弹框的title
 * onSearch：必须的，搜索框的回调
 * onOk：必须，按钮的回调事件
 * onCancel：必须，按钮的回调事件
 * modalKey: 必须，容器组件中，控制modal是否出现的key
 * dataSource： 有默认值（空数组），table的内容
 * placeholder：有默认值（空字符串），用于搜索框无内容时的提示文字
 * okText：有默认值（确定），按钮的title
 * cancelText：有默认值（取消），按钮的title
 * rowKey: 有默认值（空字符串，无选中），数据源中对象唯一的标识符，table设置选中用
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Input } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import logable from '../../../decorators/logable';

import styles from './tableDialog.less';

const Search = Input.Search;

export default class TableDialog extends Component {
  static propTypes = {
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    rowKey: PropTypes.string,
    columns: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onSearch: PropTypes.func,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    modalKey: PropTypes.string.isRequired,
    searchShow: PropTypes.bool,
  }

  static defaultProps = {
    dataSource: [],
    placeholder: '',
    okText: '确定',
    cancelText: '取消',
    rowKey: '',
    searchShow: true,
    onSearch: () => {},
  }

  constructor(props) {
    super(props);
    const { dataSource, rowKey } = this.props;
    const defaultConfig = this.defaultSelected(dataSource, rowKey);
    this.state = {
      ...defaultConfig,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { dataSource, rowKey } = nextProps;
    const defaultConfig = this.defaultSelected(dataSource, rowKey);
    this.setState({
      ...defaultConfig,
    });
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '$props.title',
    },
  })
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  defaultSelected(dataSource, rowKey) {
    const defaultSelected = [];
    const defaultSelectedRow = [];
    if (!_.isEmpty(rowKey) && dataSource.length > 0) {
      const firstItem = dataSource[0];
      defaultSelectedRow.push(firstItem);
      defaultSelected.push(firstItem[rowKey]);
    }
    return {
      selectedRowKeys: defaultSelected,
      selectedRows: defaultSelectedRow,
    };
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.okText' } })
  handleOk() {
    const { selectedRows } = this.state;
    const selected = selectedRows.length > 0 ? selectedRows[0] : {};
    // 重置默认值
    const { dataSource, onOk } = this.props;
    const defaultConfig = this.defaultSelected(dataSource);
    this.setState({
      ...defaultConfig,
    }, onOk(selected));
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.cancelText' } })
  handleCancel() {
    const { onCancel, dataSource, modalKey } = this.props;
    // 重置默认值
    const defaultConfig = this.defaultSelected(dataSource);
    this.setState({
      ...defaultConfig,
    }, onCancel(modalKey));
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索' } })
  handleSearch(value) {
    const { onSearch } = this.props;
    onSearch(value);
  }

  render() {
    const {
      selectedRowKeys,
    } = this.state;
    const {
      columns,
      title,
      placeholder,
      okText,
      cancelText,
      dataSource,
      visible,
      rowKey,
      searchShow,
    } = this.props;

    if (!visible) {
      return null;
    }

    const rowSelection = {
      type: 'radio',
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={okText}
        cancelText={cancelText}
        wrapClassName={styles.modalContainer}
      >
        {
          searchShow ?
            <Search
              placeholder={placeholder}
              onSearch={(value) => { this.handleSearch(value); }}
              enterButton
            />
            :
            null
        }
        <Table
          rowKey={record => record[rowKey]}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          // 默认文案配置
          locale={{
            // 空数据时的文案
            emptyText: '暂无数据',
          }}
        />
      </Modal>
    );
  }
}
