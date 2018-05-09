/**
 * @file components/customerPool/CustomerTotal.js
 *  客户池-客户列表总数提示
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CustomerTotal extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    num: PropTypes.number.isRequired,
    bname: PropTypes.string,
  }

  static defaultProps = {
    bname: '',
  }

  render() {
    const { type, num, bname } = this.props;
    let ele;
    switch (type) {
      case 'search':
        ele = <p className="total-num">满足搜索条件的客户<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      case 'association':
        ele = <p className="total-num">满足搜索条件的客户<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      case 'tag':
        ele = <p className="total-num">满足标签条件的客户<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      case 'business':
        ele = <p className="total-num">潜在业务客户<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      case 'custIndicator':
        ele = <p className="total-num">{decodeURIComponent(bname)}<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      case 'numOfCustOpened':
        ele = <p className="total-num">办理{decodeURIComponent(bname)}的客户<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      case 'sightingTelescope':
        ele = <p className="total-num">符合瞄准镜搜索条件的客户<em>&nbsp;{num}&nbsp;</em>户</p>;
        break;
      default: ele = <p className="total-num" />;
    }
    return ele;
  }
}
