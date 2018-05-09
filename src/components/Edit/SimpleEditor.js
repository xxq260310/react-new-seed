/**
 * @description 简单的修改编辑器
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Form, Icon, Tooltip } from 'antd';
import _ from 'lodash';

import { responseCode } from '../../config';
import styles from './SimpleEditor.less';
import logable from '../../decorators/logable';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class SimpleEditor extends PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    editorState: PropTypes.bool,
    publishLoading: PropTypes.bool,
    updateLoading: PropTypes.bool,
    originalValue: PropTypes.string.isRequired,
    style: PropTypes.object,
    operateData: PropTypes.object,
    children: PropTypes.element,
    editorValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    editorName: PropTypes.string,
    form: PropTypes.object.isRequired,
    controller: PropTypes.func,
    confirm: PropTypes.func,
  }

  static defaultProps = {
    editable: true,
    editorState: false,
    style: {},
    children: null,
    editorName: '',
    editorValue: '' || {},
    controller: () => {},
    confirm: () => {},
    publishLoading: false,
    updateLoading: false,
    operateData: {},
  }

  constructor(props) {
    super(props);
    const { originalValue, editorState, editorValue } = props;
    this.state = {
      originalValue,
      editorValue,
      editing: editorState,
      editTipVisible: false,
      nameHelp: '不可以为空',
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
      operateData,
      updateLoading: nextUL,
      publishLoading: nextPL,
    } = nextProps;
    const {
      editorState: preEditorState,
      editorValue: preEditor,
      originalValue: preOriginal,
      updateLoading: preUL,
      publishLoading: prePL,
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
    if ((!nextUL && preUL) || (prePL && !nextPL)) {
      // 保存完成
      // 判断看板名称重复
      const { success } = operateData;
      if (!success) {
        // 保存不成功
        const { code, msg } = operateData;
        if (code === responseCode.DUPLICATE_NAME) {
          this.setState({
            nameHelp: msg,
          },
          () => {
            this.setTooltipVisible(true);
          });
        }
      }
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
  @logable({ type: 'Click', payload: { name: '确认图标' } })
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
  @logable({ type: 'Click', payload: { name: '修改图标' } })
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
    const { editable, style, children, editorName } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { originalValue, editing, editorValue, editTipVisible, nameHelp } = this.state;
    const editWrapperClass = classnames({
      [styles.editWrapper]: true,
      [styles.editable]: editable,
      [styles.editing]: editing,
    });
    const editIconClass = classnames({
      [styles.editIcon]: true,
      [styles.showIcon]: editable && !editing,
    });

    const editContentClass = classnames({
      [styles.editContent]: true,
    });

    const editButtonGroupClass = classnames({
      [styles.editButtonGroup]: true,
      [styles.editButtonGroupShow]: editable && editing,
    });

    return (
      <div className={editWrapperClass} style={style} onClick={this.handleEditWrapperClick}>
        <div className={editIconClass}>
          <Icon type="edit" />
        </div>
        {/* 修改取消和确认按钮 */}
        <div className={editButtonGroupClass}>
          <div className={styles.editBt} onClick={this.editorConfirm}><Icon type="check" /></div>
          <div className={styles.editBt} onClick={this.editorCancel}><Icon type="close" /></div>
        </div>
        <div className={editContentClass}>{originalValue}</div>
        {
          React.Children.map(children, child =>
            (<Form>
              <Tooltip
                title={nameHelp}
                visible={editTipVisible}
                overlayClassName={styles.tooltipTop}
                getPopupContainer={this.getTootipPopContainer}
              >
                <FormItem>
                  {
                    getFieldDecorator(editorName, { initialValue: editorValue })(child)
                  }
                </FormItem>
              </Tooltip>
            </Form>))
        }
      </div>
    );
  }
}

