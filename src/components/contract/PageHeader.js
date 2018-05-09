/**
 * @file Pageheader.js
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect, Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import Icon from '../common/Icon';
import Button from '../common/Button';
import { permissionOptions } from '../../config';
import logable, { logPV } from '../../decorators/logable';

import styles from '../../components/style/jiraLayout.less';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      commonModal: false,
    };
  }

  @autobind
  onOk(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  @autobind
  onChange = (value) => {
    console.log(arguments);
    this.setState({ value });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '合约名称',
      value: '$args[0]',
    },
  })
  handleContractChange(value) {
    this.onChange(value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '拟稿人',
      value: '$args[0]',
    },
  })
  handleDrafterChange(value) {
    this.onChange(value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '部门',
      value: '$args[0]',
    },
  })
  handleDepartmentChange(value) {
    this.onChange(value);
  }

  @autobind
  handleSelectChange(name, key) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: _.isArray(key) ? key.join(',') : key,
      },
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[1]',
    },
  })
  handleSelectSubtype(name, key) {
    this.handleSelectChange(name, key);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleSelectStatus(name, key) {
    this.handleSelectChange(name, key);
  }

  @autobind
  @logPV({ pathname: '/modal/createModal', title: '' })
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  render() {
    const typeOptions = permissionOptions.typeOptions;
    const stateOptions = permissionOptions.stateOptions;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );
    const { location: { query: {
      subType,
      status,
    } } } = this.props;
    const { commonModal } = this.state;
    const newModalProps = {
      modalKey: 'commonModal',
      title: '这是一个弹出层',
      onOk: this.onOk,
      closeModal: this.closeModal,
      visible: commonModal,
      size: 'large',
      children: 'tanchuang',
    };
    return (
      <div className={styles.pageCommonHeader}>
        <TreeSelect
          showSearch
          style={{ width: '10%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="合约名称"
          allowClear
          treeDefaultExpandAll
          onChange={this.handleContractChange}
          searchPlaceholder="合约编号/合约名称/客户号/客户名称"
        />

        子类型:
        <Select
          style={{ width: '12%' }}
          placeholder="全部"
          value={subType}
          onChange={key => this.handleSelectSubtype('subType', key)}
          allowClear
        >
          {getSelectOption(typeOptions)}
        </Select>

        状态:
        <Select
          style={{ width: '8%' }}
          placeholder="全部"
          value={status}
          onChange={key => this.handleSelectStatus('status', key)}
          allowClear
        >
          {getSelectOption(stateOptions)}
        </Select>

        拟稿人:
        <TreeSelect
          showSearch
          style={{ width: '10%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="全部"
          allowClear
          treeDefaultExpandAll
          onChange={this.handleDrafterChange}
        >
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>

        部门:
        <TreeSelect
          showSearch
          style={{ width: '10%' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="全部"
          allowClear
          treeDefaultExpandAll
          onChange={this.handleDepartmentChange}
        >
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
        <Button type="primary" onClick={() => this.showModal('commonModal')}><Icon type="jia" />新建</Button>
        <CommonModal {...newModalProps} />
      </div>
    );
  }
}
