/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-21 14:01:43
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-30 17:39:43
 * 信息提示框
 */
import { Modal } from 'antd';

const info = Modal.info;

export default function (params) {
  const { content } = params;

  info({
    title: '系统提示',
    content,
    okText: '确认',
  });
}
