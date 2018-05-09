/**
 * @Author: sunweibin
 * @Date: 2018-01-05 15:20:49
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-12 13:10:25
 * @description 头部导航栏次级菜单子菜单
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';

// import styles from './customLink.less';

function CustomLink({ action, path, url, name }) {
  let link = null;
  switch (action) {
    case 'loadPageInTab':
      link = <Link to={path}>{name}</Link>;
      break;
    case 'loadPageInWindow':
      link = <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>;
      break;
    default:
      link = <span>{name}</span>;
  }
  return link;
}

CustomLink.propTypes = {
  action: PropTypes.string.isRequired,
  path: PropTypes.string,
  url: PropTypes.string,
  name: PropTypes.string.isRequired,
};

CustomLink.defaultProps = {
  action: '',
  path: '',
  url: '',
  name: '菜单名称',
};

export default CustomLink;
