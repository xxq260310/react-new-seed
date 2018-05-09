import React from 'react';
import PropTypes from 'prop-types';
import style from './style.less';

export default function TextLayout(props) {
  return (
    <div
      className={style.mlcContentList}
    >
      <span className={style.mlcContentListTitle}>{props.title}：</span>
      <span className={style.mlcContentListCon}>{props.content}</span>
    </div>
  );
}

TextLayout.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
};
TextLayout.defaultProps = {
  content: '',
};

