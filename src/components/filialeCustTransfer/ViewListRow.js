/**
 * @Author: hongguangqing
 * @Description: 分公司人工划转ViewListRow
 * @Date: 2018-01-29 14:25:26
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-29 16:05:32
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Tag from '../common/tag';
import Icon from '../common/Icon';
import styles from './viewListRow.less';

const SINGLECUSTTRANSFER = '0701'; // 单客户人工划转
// 后台返回的类型字段转化为对应的中文显示
const changeTypeDisplay = (st, options) => {
  if (st && !_.isEmpty(st) && st === options.pageType) {
    return options.pageName || '无';
  }
  return '无';
};

// 后台返回的子类型字段、状态字段转化为对应的中文显示
const changeDisplay = (st, options) => {
  if (st && !_.isEmpty(st)) {
    const nowStatus = _.find(options, o => o.value === st) || {};
    return nowStatus.label || '无';
  }
  return '无';
};

export default function ViewListRow(props) {
  const {
    data,
    type,
    pageData,
    active,
    onClick,
    index,
  } = props;
  if (_.isEmpty(data)) return null;
  const { status } = pageData;
  const appItemCls = cx({
    [styles.appItem]: true,
    [styles.active]: active,
  });
  const appIconCls = cx({
    [styles.appIcon]: true,
    [styles.active]: active,
  });
  const serialCls = cx({
    [styles.serialNumber]: true,
    [styles.active]: active,
  });
  const typeCls = cx({
    [styles.type]: true,
    [styles.active]: active,
  });
  const secondLineCls = cx({
    [styles.secondLine]: true,
    [styles.active]: active,
  });
  const thirdLineCls = cx({
    [styles.thirdLine]: true,
    [styles.active]: active,
  });
  const tagBlueType = cx({
    blue: !active,
    transparent: active,
  });
  function handleClick() {
    onClick(data, index);
  }
  return (
    <div className={appItemCls} onClick={handleClick}>
      {/* 第一行 */}
      <div className={styles.itemHeader}>
        <div className={styles.title}>
          <Icon type={type} className={appIconCls} />
          <span className={serialCls}>编号{data.id || '暂无'}</span>
        </div>
        <div className={styles.tagArea}>
          <Tag type={tagBlueType} text={changeDisplay(data.status, status)} />
        </div>
      </div>
      {/* 第二行 */}
      <div className={secondLineCls}>
        <span className={typeCls}>{changeTypeDisplay(data.type, pageData)}</span>
        <div className={styles.date}>{(data.createTime && data.createTime.slice(0, 10)) || '无'}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>
          拟稿人：<span className={styles.drafterName}>{data.empName}({data.empId})</span>{`${data.orgName || ''}` || '无'}
        </div>
        {
          data.subType !== SINGLECUSTTRANSFER ?
          null :
          <div className={styles.customer}>
            客户：<span>{data.custName || '无'}({data.custNumber || '无'})</span>
          </div>
        }
      </div>
    </div>
  );
}

ViewListRow.propTypes = {
  data: PropTypes.object.isRequired,
  pageName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
