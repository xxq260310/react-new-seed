/**
 * @file feedback/FeedbackUser.js
 *  问题反馈-备注
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';

const EMPTY_OBJECT = {};
export default class FeedbackUser extends PureComponent {
  static propTypes = {
    fbuser: PropTypes.object,
  }
  static defaultProps = {
    fbuser: EMPTY_OBJECT,
  }
  constructor(props) {
    super(props);
    const { fbuser = EMPTY_OBJECT } = this.props || EMPTY_OBJECT;
    this.state = {
      data: fbuser,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { fbuser: preData } = this.props;
    const { fbuser = EMPTY_OBJECT } = nextProps;
    if (fbuser !== preData) {
      this.setState({
        data: fbuser,
      });
    }
  }
  render() {
    const { data = EMPTY_OBJECT } = this.state;
    const { empId, name, l1, l2, l3, cellPhone, eMailAddr } = data;
    return (
      <div>
        <ul className="property_list clearfix">
          <li className="item">
            <div className="wrap value_word">
              <strong className="name">员工号：</strong>
              <span className="value">{empId || '无'}</span>
            </div>
          </li>
          <li className="item item-right">
            <div className="wrap value_word">
              <strong className="name">用户：</strong>
              <span className="value">{name || '无'}</span>
            </div>
          </li>
          <li className="item">
            <div className="wrap value_word">
              <strong className="name">部门：</strong>
              <span className="value">{l1}{l2}{l3}</span>
            </div>
          </li>
          <li className="item item-right">
            <div className="wrap value_word">
              <strong className="name">联系电话：</strong>
              <span className="value">{cellPhone || '无'}</span>
            </div>
          </li>
          <li className="item">
            <div className="wrap value_word">
              <strong className="name">邮箱：</strong>
              <span className="value">{eMailAddr || '无'}</span>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
