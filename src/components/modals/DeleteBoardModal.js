/**
 * @description 删除看板的Modal
 * @author sunweibin
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';
import logable from '../../decorators/logable';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class DeleteBoardModal extends PureComponent {
  static propTypes = {
    boardName: PropTypes.string,
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
    boardName: '',
  }

  constructor(props) {
    super(props);
    const { visible, boardName } = props;
    this.state = {
      boardName,
      modalVisible: visible,
      boardnamettVisible: false, // 看板名称Tooltip显示与否
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, boardName } = nextProps;
    const { visible: preVisible } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        boardName,
        modalVisible: visible,
      });
    }
  }

  @autobind
  getTootipPopContainer() {
    const wrapClassName = styles.boardManageModal;
    const selector = `.delBoard.${wrapClassName} .ant-modal-content .ant-form> .ant-form-item:first-child`;
    return document.querySelector(selector);
  }

  @autobind
  setTooltipVisible(boardnamettVisible) {
    this.setState({
      boardnamettVisible,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  closeCreateModal() {
    const { modalKey, closeModal } = this.props;
    // 此处需要将form重置
    this.props.form.resetFields();
    // 隐藏Modal
    closeModal(modalKey);
    this.setTooltipVisible(false);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '删除' } })
  confirmCreateModal() {
    const { form, confirm } = this.props;
    const { boardName } = this.state;
    // TODO 添加确认按钮处理程序
    const delModalName = form.getFieldValue('delModalName');
    // 判断看板名称
    if (_.isEqual(delModalName, boardName)) {
      // 如果相同，则删除看板
      // 隐藏Modal
      confirm();
      this.closeCreateModal();
    } else {
      // 不同则显示提示框
      this.setTooltipVisible(true);
    }
  }

  @autobind
  hideTooltip() {
    this.setTooltipVisible(false);
  }

  render() {
    const { modalVisible, boardnamettVisible, boardName } = this.state;
    const { modalCaption } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 表单布局
    const formItemLayout = {
      wrapperCol: { span: 24 },
      layout: 'horizontal',
    };

    const delBoard = classnames({
      [styles.boardManageModal]: true,
      delBoard: true,
    });

    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
        closeable
        onCancel={this.closeCreateModal}
        wrapClassName={delBoard}
        maskClosable={false}
        footer={[
          <Button key="back" size="large" onClick={this.closeCreateModal}>取消</Button>,
          <Button key="del" className={styles.delDanger} size="large" onClick={this.confirmCreateModal}>
            删除
          </Button>,
        ]}
      >
        <div className={styles.modalDelTips}>
          <span>您选择删除的看板为“</span>
          <strong className={styles.delModalName}>{boardName}</strong>
          <span>”。删除后，可见范围权限的用户将无法查看，且不能恢复，请再次输入看板名称确认：</span>
        </div>
        <Form>
          <Tooltip
            title="名称与选中的看板不符"
            visible={boardnamettVisible}
            getPopupContainer={this.getTootipPopContainer}
            overlayClassName={styles.tooltipTop}
          >
            <FormItem
              {...formItemLayout}
            >
              {
                getFieldDecorator(
                  'delModalName',
                  {
                    initialValue: '',
                  })(
                    <Input
                      type="text"
                      placeholder="请输入看板名称"
                      onFocus={this.hideTooltip}
                    />)
              }
            </FormItem>
          </Tooltip>
        </Form>
      </Modal>
    );
  }
}
