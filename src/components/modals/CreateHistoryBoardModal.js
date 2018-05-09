/**
 * @description 另存为历史看板的Modal
 * @author hongguangqing
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';
import logable from '../../decorators/logable';

const FormItem = Form.Item;
const create = Form.create;
@create()
export default class CreateHistoryBoardModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    modalCaption: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    createBoardConfirm: PropTypes.func.isRequired,
    ownerOrgId: PropTypes.string.isRequired,
    boardId: PropTypes.string,
    boardType: PropTypes.string,
    selectKeys: PropTypes.array.isRequired,
    createLoading: PropTypes.bool.isRequired,
    operateData: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: false,
    boardId: '',
    boardType: '',
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      nameHelp: '不可以为空',
      boardnamettVisible: false, // 看板名称Tooltip显示与否
      modalVisible: visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, operateData, createLoading: nextCL } = nextProps;
    const { visible: preVisible, createLoading: prevCL } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
      });
    }
    if (!nextCL && prevCL) {
      const { success } = operateData;
      // 判断检查看板名称是否已经存在
      if (success) {
        this.closeCreateModal();
      } else {
        // 名称相同，弹提示框
        const { code, msg } = operateData;
        if (code === '-2') {
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

  @autobind
  setTooltipVisible(boardnamettVisible) {
    this.setState({
      boardnamettVisible,
    });
  }

  @autobind
  getTootipPopContainer() {
    const wrapClassName = styles.boardManageModal;
    return document.querySelector(`.createBoard.${wrapClassName} .ant-modal-content .ant-form> .ant-form-item:first-child`);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  closeCreateModal() {
    const { closeModal, modalKey } = this.props;
    // 此处需要将form重置
    this.props.form.resetFields();
    // 隐藏Modal
    closeModal(modalKey);
    this.setTooltipVisible(false);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
  confirmCreateModal() {
    const { form, createBoardConfirm, ownerOrgId, boardType, selectKeys } = this.props;
    // TODO 添加确认按钮处理程序
    const boardname = form.getFieldValue('boardname');
    // 判断看板名称
    if (boardname === '') {
      // 看板名称不能为空
      this.setState({
        nameHelp: '名称不能为空',
      },
      () => {
        this.setTooltipVisible(true);
      });
      return;
    }
    if (/\s+/.test(boardname)) {
      this.setState({
        nameHelp: '名称不能含空格',
      },
      () => {
        this.setTooltipVisible(true);
      });
      return;
    }
    // 调用创建历史对比看板接口
    if (boardType === 'TYPE_LSDB_TGJX') {
      createBoardConfirm({
        ownerOrgId,
        name: boardname,
        boardType,
        coreIndicator: selectKeys,
        investContrastIndicator: ['tgInNum'],
        custContrastIndicator: ['custNum', 'currSignCustNum'],
      });
    } else {
      createBoardConfirm({
        ownerOrgId,
        name: boardname,
        boardType,
        coreIndicator: selectKeys,
        investContrastIndicator: ['ptyMngNum'],
        custContrastIndicator: ['totCustNum', 'pCustNum', 'oCustNum', 'oNoPrdtCustNum', 'oPrdtCustNum', 'InminorCustNum', 'newCustNum'],
      });
    }
  }

  render() {
    const { modalCaption, form } = this.props;
    const { getFieldDecorator } = form;
    const { nameHelp, boardnamettVisible, modalVisible } = this.state;

    const createBoard = classnames({
      [styles.boardManageModal]: true,
      createBoard: true,
    });
    return (
      <Modal
        visible={modalVisible}
        title={modalCaption}
        closeable
        onCancel={this.closeCreateModal}
        wrapClassName={createBoard}
        maskClosable={false}
        footer={[
          <Button key="back" size="large" onClick={this.closeCreateModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.confirmCreateModal}>
            确认
          </Button>,
        ]}
      >
        <div className={styles.modalDelTips}>
          <span>将挑选的指标结果保存为新的看板，请在以下输入框设置新看板名称：</span>
        </div>
        <Form>
          <Tooltip
            title={nameHelp}
            visible={boardnamettVisible}
            getPopupContainer={this.getTootipPopContainer}
            overlayClassName={styles.tooltipTop}
          >
            <FormItem>
              {
                getFieldDecorator(
                  'boardname',
                  {
                    rules: [{ required: true, message: '请输入看板名称' }],
                    initialValue: '',
                  })(
                    <Input placeholder="请输入看板名称" />,
                )
              }
            </FormItem>
          </Tooltip>
        </Form>
      </Modal>
    );
  }
}
