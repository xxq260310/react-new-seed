/*
 * @Description: 附带编辑图标的 input
 * @Author: LiuJianShu
 * @Date: 2017-12-25 14:48:26
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-02-08 10:48:48
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import _ from 'lodash';
import logable from '../../../decorators/logable';

import Icon from '../Icon';
// import Button from '../Button';
import styles from './index.less';

export default class EditInput extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    id: PropTypes.string,
    editCallback: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    onCancel: PropTypes.func,
    maxLen: PropTypes.number,
    data: PropTypes.array,
    idx: PropTypes.number,
    btnGroup: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.element,
      PropTypes.node,
    ]),
  }

  static defaultProps = {
    id: '',
    value: '',
    edit: false,
    btnGroup: '',
    maxLen: 30,
    data: [],
    idx: 0,
    onCancel: () => {},
  }

  constructor(props) {
    super(props);
    const { edit, value } = props;
    this.state = {
      // 编辑状态
      edit,
      // 值
      value,
      // 编辑前的值
      oldValue: value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value: preValue, edit: preEdit } = this.props;
    const { value: nextValue, edit: nextEdit } = nextProps;
    if (preValue !== nextValue) {
      this.setState({
        value: nextValue,
        edit: false,
      });
    }
    if (preEdit !== nextEdit) {
      this.setState({
        edit: nextEdit,
      });
    }
  }

  // 输入框编辑事件
  @autobind
  onChange(e) {
    const { maxLen } = this.props;
    if (e.target.value.length >= maxLen) {
      return;
    }
    this.setState({
      value: e.target.value,
    });
  }

  // 编辑按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '编辑' } })
  onEdit(e) {
    e.stopPropagation();
    const { edit } = this.state;
    this.setState({
      edit: !edit,
    });
  }

  // 提交按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '确定' } })
  onSubmit(e) {
    e.stopPropagation();
    const { value, oldValue } = this.state;
    const { editCallback, id, onCancel, data, idx } = this.props;
    // 传入的 data 是否为空
    const isDataEmpty = _.isEmpty(data);
    // propsValue 值
    const propsValue = !isDataEmpty ? data[idx].name : '';
    // 判断 value 值与 propsValue 是否相等
    const valueIsEqual = isDataEmpty ? false : value === propsValue;
    if (value === oldValue || valueIsEqual) {
      this.setState({
        value: isDataEmpty ? oldValue : propsValue,
        edit: false,
      }, onCancel);
    } else {
      editCallback(value, id);
    }
  }

  // 取消按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  onCancel(e) {
    e.stopPropagation();
    const { oldValue } = this.state;
    const { onCancel } = this.props;
    this.setState({
      value: oldValue,
      edit: false,
    }, onCancel);
  }

  render() {
    const { edit, value } = this.state;
    const { btnGroup } = this.props;
    return (
      <div className={styles.editInput}>
        {
          !edit ?
            <div className={styles.noInput}>
              <em>{value}</em>
              <Icon type="edit" onClick={this.onEdit} title="编辑" />
              {btnGroup}
            </div>
          :
            <div className={styles.hasInput}>
              <Input
                value={value}
                onChange={this.onChange}
                onPressEnter={this.onClick}
                onClick={e => e.stopPropagation()}
              />
              <Icon type="success" onClick={this.onSubmit} title="确定" />
              <Icon type="close" onClick={this.onCancel} title="取消" />
            </div>
        }
      </div>
    );
  }
}
