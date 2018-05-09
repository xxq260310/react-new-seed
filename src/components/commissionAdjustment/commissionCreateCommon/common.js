/**
 * @Author: sunweibin
 * @Date: 2017-11-08 10:24:52
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-08 13:57:24
 * @description 佣金调整弹出层4个新建通用以及固定的相关代码
 */

import React from 'react';
import _ from 'lodash';
import approvalConfig from '../choiceApprovalUserConfig';
import { seibelConfig } from '../../../config';

const { comsubs: commadj } = seibelConfig;

// 千分号符号
const permil = (
  <span
    style={{
      fontSize: '14px',
      color: '#9b9b9b',
      lineHeight: '26px',
      paddingLeft: '4px',
    }}
  >
    ‰
  </span>
);

// 获取子类型的审批人BtnId
function getApprovalBtnID(key) {
  const { approvalBtnId } = approvalConfig;
  let btnId = '';
  switch (key) {
    case commadj.single:
      btnId = approvalBtnId.single;
      break;
    case commadj.batch:
      btnId = approvalBtnId.batch;
      break;
    case commadj.subscribe:
      btnId = approvalBtnId.sub;
      break;
    case commadj.unsubscribe:
      btnId = approvalBtnId.unsub;
      break;
    default:
      break;
  }
  return btnId;
}

// 选中的资讯订阅父产品数据结构改为提交所需
function changeSubmitscriProList(product, matchInfos) {
  const {
    prodCode,
    prodName,
    approvalFlg,
  } = product;
  const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
  return {
    prodCode,
    aliasName: prodName,
    approvalFlg,
    ...matchInfo,
  };
}

// 将选中的资讯订阅产品数据结构改为提交所需
function changeSubmitSubProList(list, matchInfos) {
  const newSubmitSubscriProList = list.map((product) => {
    const { children } = product;
    const newSubmitSubscribel = changeSubmitscriProList(product, matchInfos);
    if (!_.isEmpty(children)) {
      // 存在子产品
      newSubmitSubscribel.subItem = children.map((item) => {
        const {
          prodCode,
          prodName,
        } = item;
        return {
          prodCode,
          aliasName: prodName,
        };
      });
    }
    return newSubmitSubscribel;
  });
  return newSubmitSubscriProList;
}

// 选中的资讯退订父产品数据结构改为提交所需
function changeSubmitUnscriProList(product) {
  const {
    prodCode,
    prodName,
    approvalFlg,
  } = product;
  return {
    prodCode,
    aliasName: prodName,
    approvalFlg,
  };
}

// 将选中的资讯退订产品数据结构改为提交所需
function changeSubmitUnSubProList(list) {
  const newSubmitUnSubscriProList = list.map((product) => {
    const { children } = product;
    const newSubmitUnSubscribel = changeSubmitUnscriProList(product);
    if (!_.isEmpty(children)) {
      // 存在子产品
      newSubmitUnSubscribel.subItem = children.map((item) => {
        const {
          prodCode,
          prodName,
        } = item;
        return {
          prodCode,
          aliasName: prodName,
        };
      });
    }
    return newSubmitUnSubscribel;
  });
  return newSubmitUnSubscriProList;
}

export default {
  permil,
  getApprovalBtnID,
  changeSubmitSubProList,
  changeSubmitUnSubProList,
};
