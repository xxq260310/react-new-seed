/**
 * @file components/chart/ChartBase.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ChartBase extends Component {
  static propTypes = {
    hasChart: PropTypes.bool,
  };

  static defaultProps = {
    hasChart: false,
  };

  constructor(props) {
    super(props);
    if (this.props.hasChart !== true) {
      throw new Error('There is no Chart wrapper.');
    }
  }

  render() {
    return null;
  }
}
