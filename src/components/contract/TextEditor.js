/**
 * @description 简单的文本展示修改器
 * @author wanghan
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Form, Input } from 'antd';
import _ from 'lodash';

import styles from '../Edit/SimpleEditor.less';
import logable from '../../decorators/logable';
// import styles from './textEditor.less';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class TextEditor extends PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    editorState: PropTypes.bool,
    originalValue: PropTypes.string.isRequired,
    style: PropTypes.object,
    editorValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    editorName: PropTypes.string,
    form: PropTypes.object.isRequired,
    controller: PropTypes.func,
    confirm: PropTypes.func,
    labelName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    editable: true,
    editorState: false,
    style: {},
    editorName: '',
    editorValue: '' || {},
    controller: () => {},
    confirm: () => {},
    labelName: '',
  }

  constructor(props) {
    super(props);
    const { originalValue, editorState, editorValue, labelName } = props;
    this.state = {
      originalValue,
      editorValue,
      editing: editorState,
      editTipVisible: false,
      nameHelp: `${labelName}不可以为空`,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.exitEditState, false);
  }

  componentWillReceiveProps(nextProps) {
    const {
      editorState,
      editorValue,
      originalValue,
    } = nextProps;
    const {
      editorState: preEditorState,
      editorValue: preEditor,
      originalValue: preOriginal,
    } = this.props;
    if (!_.isEqual(preEditorState, editorState)) {
      this.setState({
        editing: editorState,
      });
    }
    if (!_.isEqual(editorValue, preEditor)) {
      this.setState({
        editorValue,
      });
    }
    if (!_.isEqual(originalValue, preOriginal)) {
      this.setState({
        originalValue,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.exitEditState);
  }

  @autobind
  getTootipPopContainer() {
    const wrapper = styles.editWrapper;
    return document.querySelector(`.react-app .${wrapper}`);
  }

  @autobind
  setTooltipVisible(editTipVisible) {
    this.setState({
      editTipVisible,
    });
  }

  @autobind
  editorConfirm(e) {
    // TODO 判断是否进行了修改
    const { controller, confirm, editorName, form, editorValue } = this.props;
    const newValue = form.getFieldValue(editorName);
    let canUpdate = true;
    if (editorName === 'boardNameEditor') {
      // 如果是修改看板名称，则需要验证
      if (newValue === '') {
        // 看板名称不能为空
        this.setState({
          nameHelp: '名称不能为空',
        },
        () => {
          this.setTooltipVisible(true);
        });
        canUpdate = false;
      }
      if (/\s+/.test(newValue)) {
        this.setState({
          nameHelp: '名称不能含空格',
        },
        () => {
          this.setTooltipVisible(true);
        });
        canUpdate = false;
      }
    }
    if (canUpdate) {
      this.setTooltipVisible(false);
      // TODO 判断进行了修改没
      if (!_.isEqual(editorValue, newValue)) {
        confirm({
          key: editorName,
          value: newValue,
        });
      }
      controller(editorName, false);
    }
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  editorCancel(e) {
    const { controller, editorName, form } = this.props;
    this.setTooltipVisible(false);
    form.resetFields();
    controller(editorName, false);
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  enterEditState() {
    const { controller, editorName } = this.props;
    controller(editorName, true);
  }

  @autobind
  exitEditState() {
    const { controller, editorName, form } = this.props;
    this.setTooltipVisible(false);
    form.resetFields();
    controller(editorName, false);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$props.labelName' } })
  handleEditWrapperClick(e) {
    const { form, editorName, editable } = this.props;
    if (!editable) {
      return;
    }
    const editor = form.getFieldInstance(editorName);
    if (editor.focus) {
      editor.focus();
      this.setTooltipVisible(false);
    } else {
      editor.expandSelect();
    }
    this.enterEditState();
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { editable, style, editorName, labelName } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { originalValue, editing, editorValue } = this.state;
    const editWrapperClass = classnames({
      [styles.editWrapper]: true,
      [styles.editable]: editable,
      [styles.editing]: editing,
    });
    const editLabelClass = classnames({
      [styles.editLabel]: true,
    });

    const editContentClass = classnames({
      [styles.editContent]: true,
    });

    return (
      <div>
        <div className={editLabelClass}>
          <strong >{labelName }：</strong>
        </div>
        <div className={editWrapperClass} style={style} onClick={this.handleEditWrapperClick}>
          <div className={editContentClass}>{originalValue}</div>
          <FormItem
            hasFeedback
          >
            {getFieldDecorator(editorName, {
              rules: [{ required: true, message: '请输入{labelName}!', whitespace: true }],
              initialValue: editorValue,
            })(
              <Input style={{ width: 120 }} onBlur={this.editorConfirm} />,
            )}
          </FormItem>
        </div>
      </div>
    );
  }
}

