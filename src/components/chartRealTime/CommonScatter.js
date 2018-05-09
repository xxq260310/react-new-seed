/**
 * by xuxiaoqin
 * CommonScatter.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import IECharts from '../IECharts';

export default function CommonScatter(props) {
  const {
    onScatterHover,
    onScatterLeave,
    scatterOptions,
    onDispatch,
  } = props;

  return (
    <IECharts
      option={scatterOptions}
      resizable
      style={{
        height: '360px',
        width: '100%',
      }}
      onEvents={{
        mouseover: onScatterHover,
        mouseout: onScatterLeave,
      }}
      onDispatch={onDispatch}
    />
  );
}

CommonScatter.propTypes = {
  scatterOptions: PropTypes.object,
  scatterElemHeight: PropTypes.number.isRequired,
  onScatterHover: PropTypes.func.isRequired,
  onScatterLeave: PropTypes.func.isRequired,
  onDispatch: PropTypes.object,
};

CommonScatter.defaultProps = {
  scatterOptions: {},
  onDispatch: {},
};
