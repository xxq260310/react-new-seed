/**
 * Button/index.js Button组件，封装antd-mobile提供的button
 * Usage:
 * import Button from 'xx/Button';
 * <Button
    type="primary"
    size="default"
    loading
    className="xxx"
   >
    完成
   </Button>
 *  type,shape,size,loading,disabled等，与antd的Button组件用法相同
 *  type可选值为 primary dashed danger或者不设
 *  size可选值为 small large 或者不设
 *  loading设置按钮载入状态
 *  className:不必要，按钮有特殊样式需求的时候通过此参数修改
 * @author honggaungqing
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';

import './index.less';

export default function Button(props) {
  const { className } = props;
  return (
    <span className="commonBtn">
      <AntButton {...props} className={className} />
    </span>
  );
}
Button.propTypes = {
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
};
