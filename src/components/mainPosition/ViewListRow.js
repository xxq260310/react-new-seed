/**
 * @Author: hongguangqing
 * @Description: 服务经理主职位设置的ViewListRow
 * @Date: 2018-02-26 13:23:53
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-02-28 14:45:31
 */


import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Tag from '../common/tag';
import Icon from '../common/Icon';
import styles from './viewListRow.less';

export default function ViewListRow(props) {
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

  const {
    data,
    type,
    active,
    onClick,
    index,
    pageData,
  } = props;
  const { status } = pageData;
  if (_.isEmpty(data)) return null;
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
        <div className={styles.customer}>
          服务经理：<span>{data.ptyMngName || '无'}({data.ptyMngId || '无'})</span>
        </div>
      </div>
    </div>
  );
}

ViewListRow.propTypes = {
  pageData: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  pageName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
