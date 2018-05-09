/**
 * @file src/components/common/biz/confirm.js
 * @description 通用Confirm函数
 * @author sunweibin
 */
import { Modal } from 'antd';
import _ from 'lodash';

import preDefinedContent from './preDefinedContent';

const confirm = Modal.confirm;

export default function (params) {
  const {
    // 确认框标题
    title = '系统提示',
    // 确认框内容,自定义的
    content = '',
    // 确认框内容,预定义的内容的快捷
    shortCut = 'delete',
    // 确认框类型，用于提示(primary)还是警告(danger)
    type = 'primary',
    // 确认框确认按钮调用
    onOk = () => {},
    // 确认框取消按钮调用
    onCancel = () => {},
  } = params;

  // 判断content和preDefinedContent传了哪个？优先content
  let newContent = content;
  if (_.isEmpty(content)) {
    // 如果content是空，则使用preDefinedContent
    newContent = preDefinedContent[shortCut];
  }

  confirm({
    title,
    content: newContent,
    okType: type,
    okText: '确认',
    cancelText: '取消',
    onOk,
    onCancel,
  });
}
