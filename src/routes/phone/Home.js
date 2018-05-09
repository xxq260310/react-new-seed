/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-12 16:31:46
 */

import React, { PureComponent } from 'react';
import Phone from '../../components/common/phone';
import withRouter from '../../decorators/withRouter';

@withRouter
export default class PhoneHome extends PureComponent {
  render() {
    return (
      <div>
        <Phone
          phoneNum="17766097715"
          custType="per"
          style={{ fontSize: '40px', color: 'red' }}
        />
      </div>
    );
  }
}
