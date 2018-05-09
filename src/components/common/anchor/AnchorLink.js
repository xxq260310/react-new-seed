/* eslint-disable */
/** 搬运至antd/Anchor,解决导航时改变hash的问题,所以不做代码检查 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import logable from '../../../decorators/logable';

export default class AnchorLink extends PureComponent {
  static proptypes = {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    title: PropTypes.string,
    activeLink: PropTypes.string,
  }
  static defaultProps = {
    prefixCls: 'ant-anchor',
    href: '#',
  };

  constructor(props) {
    super(props);
    this.state = {
      activeLink: props.activeLink,
    };
  }
  static contextTypes = {
    antAnchor: PropTypes.object,
  };

  componentWillReceiveProps(nextProps) {
    const { activeLink: preAnchor } = this.props;
    const { activeLink } = nextProps;
    if (preAnchor !== activeLink) {
      this.setState({
        activeLink,
      });
    }
  }

  componentDidMount() {
    this.context.antAnchor.registerLink(this.props.href);
  }

  componentWillUnmount() {
    this.context.antAnchor.unregisterLink(this.props.href);
  }

  @logable({ type: 'Click', payload: { name: '$props.title' } })
  handleClick = (e) => {
    e.preventDefault();
    this.context.antAnchor.scrollTo(this.props.href);
  }

  render() {
    const {
      prefixCls,
      href,
      title,
      children,
    } = this.props;
    const { activeLink } = this.state;
    const active = activeLink === href;
    const wrapperClassName = classNames(`${prefixCls}-link`, {
      [`${prefixCls}-link-active`]: active,
    });
    const titleClassName = classNames(`${prefixCls}-link-title`, {
      [`${prefixCls}-link-title-active`]: active,
    });
    return (
      <div className={wrapperClassName}>
        <a
          className={titleClassName}
          href={href}
          title={typeof title === 'string' ? title : ''}
          onClick={this.handleClick}
        >
          {title}
        </a>
        {children}
      </div>
    );
  }
}