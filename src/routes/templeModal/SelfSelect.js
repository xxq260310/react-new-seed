/**
 * @description 自定义下拉选项
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Checkbox, Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { dom } from '../../helper';
import styles from './SelfSelect.less';

const CheckboxGroup = Checkbox.Group;

export default class SelfSelect extends PureComponent {
  static propTypes = {
    value: PropTypes.array, // 初始值
    options: PropTypes.array.isRequired, // 全部的选项
    onChange: PropTypes.func, // 改版form表单的值得方法
    level: PropTypes.string.isRequired, // 用户的级别
    style: PropTypes.object, // 用户的级别
  }

  static defaultProps = {
    style: { height: '35px' },
    onChange: () => {},
    value: [],
  }

  constructor(props) {
    super(props);
    // 此value为Form组件使用getFieldDecorator方式的initialValue传递过来的初始值
    const value = props.value || [];
    const chldrenOptions = props.options.slice(1);
    this.state = {
      visibleRangeNames: this.getVisibleRangeNames(value, true),
      expand: false,
      groupCheckedList: value, // 所有分公司/营业部，选中的checkbox的列表
      checkAll: value.length === chldrenOptions.length, // 全选按钮的状态
    };
  }

  componentWillReceiveProps(nextProps) {
    // 此处需要将恢复到默认值状态
    const { value } = nextProps;
    const { value: preValue, options } = this.props;
    const chldrenOptions = options.slice(1);
    // 通过判断当前选中的值的变化
    if ('value' in nextProps && !_.isEqual(value, preValue)) {
      // const value = nextProps.value;
      this.setState({
        groupCheckedList: value,
        checkAll: chldrenOptions.length === value,
        visibleRangeNames: this.getVisibleRangeNames(value, true),
      });
    }
  }

  @autobind
  getAllCheckboxObj() {
    const { level } = this.props;
    if (level === '1') {
      return {
        id: 'all',
        name: '所有分公司',
      };
    } else if (level === '2') {
      return {
        id: 'all',
        name: '所有营业部',
      };
    }
    return {
      id: 'all',
      name: '',
    };
  }

  @autobind
  getVisibleRangeNames(groupCheckedList, flag) {
    const { options } = this.props;
    const names = [options[0].name];
    if (options.length > 1 && Array.isArray(groupCheckedList)) {
      const chldrenOptions = options.slice(1);
      if (groupCheckedList.length === chldrenOptions.length) {
        names.push(this.getAllCheckboxObj().name);
      } else {
        const filterNames = _.filter(options, o => _.includes(groupCheckedList, o.id));
        filterNames.forEach(item => names.push(item.name));
      }
    }
    const labelShowName = names.join('/');
    if (flag) {
      return labelShowName;
    }
    this.setState({
      visibleRangeNames: labelShowName,
    });
    return '';
  }

  @autobind
  triggerChange(groupCheckedList) {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(groupCheckedList);
    }
  }

  @autobind
  handleAllCheckboxChange(e) {
    const { options } = this.props;
    const childrenOptions = options.slice(1).map(item => item.id);
    this.setState({
      groupCheckedList: e.target.checked ? childrenOptions : [],
      checkAll: e.target.checked,
    },
    () => {
      const { groupCheckedList } = this.state;
      this.getVisibleRangeNames(groupCheckedList);
      // 需要触发Form组件getFieldDecorator方式设置的onChange方式
      this.triggerChange(groupCheckedList);
    });
  }

  @autobind
  handleCheckboxGroupChange(groupCheckedList) {
    const { options } = this.props;
    const childrenOptions = options.slice(1);
    this.setState({
      groupCheckedList,
      checkAll: groupCheckedList.length === childrenOptions.length,
    });
    this.getVisibleRangeNames(groupCheckedList);
    // 需要触发Form组件getFieldDecorator方式设置的onChange方式
    this.triggerChange(groupCheckedList);
  }

  @autobind
  stopClick(e) {
    e.stopPropagation();
  }

  // 收起下拉列表
  @autobind
  unExpandSelfSelect(e) {
    const targetHasClass = dom.hasClass(e.target, 'checkbox');
    const parentHasClass = dom.hasClass(e.target.parentNode, 'checkbox');
    if (targetHasClass || parentHasClass) {
      return;
    }
    this.setState({
      expand: false,
    });
    document.removeEventListener('click', this.unExpandSelfSelect);
  }
  // 打开下拉列表
  @autobind
  expandSelect() {
    this.setState({
      expand: true,
    });
    document.addEventListener('click', this.unExpandSelfSelect, false);
  }

  render() {
    const { options, style } = this.props;
    const firstRequiredCheck = options[0];
    const { expand, checkAll, groupCheckedList, visibleRangeNames } = this.state;
    const iconType = expand ? 'up' : 'down';
    const selfSelectHd = classnames({
      [styles.selfSelectHeader]: true,
      [styles.selfSelectHdActive]: expand,
    });
    const selfSelectBd = classnames({
      [styles.show]: expand,
      [styles.selfSelectBody]: true,
    });

    const selectHDLineHeight = Number.parseFloat(style.height) - 2;
    return (
      <div className={styles.selfSelect} style={style}>
        <div
          className={selfSelectHd}
          onClick={this.expandSelect}
          style={{
            lineHeight: `${selectHDLineHeight}px`,
          }}
        >
          <div className={styles.selectNames}>{visibleRangeNames}</div>
          <span className={styles.selfSelectArrow}><Icon type={iconType} /></span>
        </div>
        <div className={selfSelectBd}>
          <Checkbox
            value={firstRequiredCheck.id}
            defaultChecked
            disabled
          >
            {firstRequiredCheck.name}
          </Checkbox>
          <Checkbox
            value="all"
            onChange={this.handleAllCheckboxChange}
            checked={checkAll}
          >
            {this.getAllCheckboxObj().name}
          </Checkbox>
          <CheckboxGroup
            value={groupCheckedList}
            onChange={this.handleCheckboxGroupChange}
          >
            <Row>
              {
                options.slice(1).map(
                  item =>
                    (
                      <Col key={item.id} span={24}>
                        <Checkbox value={item.id}>{item.name}</Checkbox>
                      </Col>
                    ),
                )
              }
            </Row>
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}

