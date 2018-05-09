/**
 * @description 创建看板的Modal
 * @author sunweibin
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, Select, Tooltip } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import SelfSelect from '../Edit/SelfSelect';
import styles from './modalCommon.less';
import { responseCode } from '../../config';

const FormItem = Form.Item;
const create = Form.create;
const Option = Select.Option;

@create()
export default class CreateBoardModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    ownerOrgId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    allOptions: PropTypes.array.isRequired,
    operateData: PropTypes.object.isRequired,
    createLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      nameHelp: '不可以为空',
      modalVisible: visible,
      boardnamettVisible: false, // 看板名称Tooltip显示与否
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

  @autobind
  getTootipPopContainer() {
    const wrapClassName = styles.boardManageModal;
    return document.querySelector(`.createBoard.${wrapClassName} .ant-modal-content .ant-form> .ant-form-item:first-child`);
  }

  @autobind
  setTooltipVisible(boardnamettVisible) {
    this.setState({
      boardnamettVisible,
    });
  }

  @autobind
  hideToolTip() {
    this.setTooltipVisible(false);
  }

  @autobind
  closeCreateModal() {
    const { modalKey, closeModal } = this.props;
    // 此处需要将form重置
    this.props.form.resetFields();
    // 隐藏Modal
    closeModal(modalKey);
    this.setTooltipVisible(false);
  }

  @autobind
  confirmCreateModal() {
    const { form, ownerOrgId, confirm } = this.props;
    // TODO 添加确认按钮处理程序
    const boardname = form.getFieldValue('boardname');
    const boardType = form.getFieldValue('boardtype');
    const permitOrgIds = form.getFieldValue('visibleRange').currency;
    // 此处的currecy中只有下级，没有本机机构ID
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
    confirm({
      ownerOrgId,
      name: boardname,
      boardType,
      permitOrgIds,
    });
  }

  render() {
    const { modalVisible, boardnamettVisible, nameHelp } = this.state;
    const { modalCaption, allOptions, level } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 表单布局
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      layout: 'horizontal',
    };

    const createBoard = classnames({
      [styles.boardManageModal]: true,
      createBoard: true,
    });

    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
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
        <Form>
          <Tooltip
            title={nameHelp}
            visible={boardnamettVisible}
            getPopupContainer={this.getTootipPopContainer}
            overlayClassName={styles.tooltipTop}
          >
            <FormItem
              {...formItemLayout}
              label="看板名称"
              required
            >
              {
                getFieldDecorator(
                  'boardname',
                  {
                    initialValue: '',
                  })(<Input type="text" placeholder="请输入看板名称" onFocus={this.hideToolTip} />)
              }
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="看板类型"
            required
          >
            {getFieldDecorator(
              'boardtype',
              {
                initialValue: 'TYPE_TGJX',
              })(
                <Select>
                  <Option value="TYPE_TGJX">投顾业绩</Option>
                  <Option value="TYPE_JYYJ">经营业绩</Option>
                </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="可见范围"
            required
            showSearch={false}
          >
            {
              getFieldDecorator(
                'visibleRange',
                {
                  initialValue: {
                    currency: [],
                    label: allOptions[0].name,
                  },
                })(<SelfSelect options={allOptions} level={level} />)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
