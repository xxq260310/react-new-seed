/**
 * @file common/Pagination/index.js
 *  分页组件
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Pagination } from 'antd';
import styles from './index.less';
import logable from '../../../decorators/logable';

const PAGE_SENVEN = 7;
const PAGE_EIGHT = 8;
const PAGE_NINE = 9;

function renderTotal(total) {
  /*  return total !== 0 ? `第${range[0]}-${range[1]}条，共${total}条` : `共${total}条`; */
  return `共${total}条`;
}

// 每页最多40条记录
// 最极端的情况下pageSize最小也只会设置成5
function renderPageSizeOptions(pageSize) {
  const maxOption = Math.ceil(40 / pageSize);
  const pageSizeOptionsArray = [];
  for (let i = 1; i <= maxOption; i++) {
    pageSizeOptionsArray.push((pageSize * i).toString());
  }
  return pageSizeOptionsArray;
}

// 是否应该隐藏最后一页的按钮

function shouldHideLastButton(current, pageSize, total) {
  // 当最后一页与当前页相差2页时显示最后一页
  // 注意如果要改动这里的SHOW_NUMBER,
  // 必须测试下面的shouldFixPagination, shouldHiddenPage是否工作正常
  const SHOW_NUMBER = 2;
  const totalPageNumber = pageSize && (total / pageSize);
  // 当总页码不超过6的时候是可以放下的，而且也不会有性能问题，不需要隐藏
  if (totalPageNumber > 6 && (totalPageNumber - current) > SHOW_NUMBER) {
    return true;
  }

  return false;
}

// 当使用短版的页码表示
// 修正10页以内，也就是总页数为 7， 8， 9 时， antd会显示全部页码
// 从而导致的页码折行问题
function shouldFixPagination(current, totalPageNumber, needFixPageNum, isShortPageList) {
  if (isShortPageList &&
    (totalPageNumber >= needFixPageNum) &&
    (totalPageNumber <= PAGE_NINE)) {
    if (needFixPageNum === PAGE_SENVEN && current > 4) {
      return true;
    }
    if (needFixPageNum === PAGE_EIGHT && current > 5) {
      return true;
    }
    if (needFixPageNum === PAGE_NINE && current > 6) {
      return true;
    }
  }
  return false;
}

function shouldHiddenPage(current, totalPageNumber, isShortPageList, needHiddenPageNum) {
  if (isShortPageList && totalPageNumber <= PAGE_NINE) {
    if (totalPageNumber >= PAGE_EIGHT && current < 5) {
      return true;
    }
    if (totalPageNumber === PAGE_NINE
      && current === 5 &&
      needHiddenPageNum === PAGE_EIGHT) {
      return true;
    }
  }
  return false;
}

export default class PaginationComponent extends PureComponent {
  static propTypes = {
    current: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    showSizeChanger: PropTypes.bool,
    isHideLastButton: PropTypes.bool,
    isShortPageList: PropTypes.bool,
    // 如果为true， 就不要加commonPage了，历史遗留问题，默认false
    useClearStyle: PropTypes.bool,
    // 给pagination组件的class name,继承antd的className
    wrapClassName: PropTypes.string,
    // 给pagination组件的key,继承antd的pagination
    paginationKey: PropTypes.string,
  };
  static defaultProps = {
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: false,
    isHideLastButton: false, // 默认情况下不隐藏最后一页
    isShortPageList: false, // 默认情况下使用标准长度的分页列表
    onChange: _.noop,
    onShowSizeChange: _.noop,
    useClearStyle: false,
    wrapClassName: '',
    paginationKey: '',
  };

  constructor(props) {
    super(props);
    const { current, pageSize, total, isHideLastButton } = props;
    this.state = isHideLastButton ? {
      current,
      shouldHideLastButton: shouldHideLastButton(current, pageSize, total),
    } : { current };
  }

  // 之所以这里写这个生命周期，是为了应对当props请求的数据在组件初始化以后才到来时，
  // 可以控制最后一页的按钮显示，以及当前页
  componentWillReceiveProps(nextProps) {
    const { isHideLastButton, total: prevTotal, current: prevCurrent } = this.props;
    const { current, pageSize, total } = nextProps;

    // props.total发生变化就更新组件
    if (total !== prevTotal) {
      if (isHideLastButton) {
        this.setState({
          current,
          shouldHideLastButton: shouldHideLastButton(current, pageSize, total),
        });
      } else {
        this.setState({ current });
      }
    } else if (current === 1 && prevCurrent > 1) { // 这里是为了处理模态框关闭重新进入时，将页码置为1
      this.setState({
        current,
      });
    }
  }

  // 之所以这里声明这个，是因为部分页面对该组件的使用不恰当，导致组件过多渲染，
  // 分页切换时，出现卡顿，样式不同步问题，使用该函数修正此类问题
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.current !== this.state.current || nextProps.total !== this.props.total) {
      return true;
    }
    return false;
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'Page为$args[0]' } })
  handlePageChange(page, pageSize) {
    const { total, onChange, isHideLastButton } = this.props;
    if (isHideLastButton) {
      this.setState({
        current: page,
        shouldHideLastButton: shouldHideLastButton(page, pageSize, total),
      });
    } else {
      this.setState({
        current: page,
      });
    }
    onChange(page, pageSize);
  }


  @autobind
  @logable({ type: 'Click', payload: { name: 'PageSize为$args[1]' } })
  handlePageSizeChange(current, size) {
    const { total, onShowSizeChange, isHideLastButton } = this.props;
    if (isHideLastButton) {
      this.setState({
        current,
        shouldHideLastButton: shouldHideLastButton(current, size, total),
      });
    } else {
      this.setState({
        current,
      });
    }
    onShowSizeChange(current, size);
  }

  render() {
    const {
      pageSize,
      isShortPageList,
      total,
      useClearStyle,
      wrapClassName,
      paginationKey,
    } = this.props;
    const { current } = this.state;

    const totalPageNumber = pageSize && Math.ceil((total / pageSize));

    return (
      <div
        className={classnames({
          commonPage: true,
          [styles.commonPage]: useClearStyle === false,
          [styles.hidden]: total === 0,
          [styles.shortPageList]: isShortPageList,
          [styles.hideLastButton]: this.state.shouldHideLastButton,
          [styles.fixTotalPage7]:
          shouldFixPagination(current, totalPageNumber, PAGE_SENVEN, isShortPageList),
          [styles.fixTotalPage8]:
          shouldFixPagination(current, totalPageNumber, PAGE_EIGHT, isShortPageList),
          [styles.hiddenPage7]:
          shouldHiddenPage(current, totalPageNumber, isShortPageList, PAGE_SENVEN),
          [styles.fixTotalPage9]:
          shouldFixPagination(current, totalPageNumber, PAGE_NINE, isShortPageList),
          [styles.hiddenPage8]:
          shouldHiddenPage(current, totalPageNumber, isShortPageList, PAGE_EIGHT),
        })}
      >
        <Pagination
          key={paginationKey}
          {...this.props}
          showTotal={renderTotal}
          pageSizeOptions={renderPageSizeOptions(pageSize)}
          onChange={this.handlePageChange}
          onShowSizeChange={this.handlePageSizeChange}
          current={current}
          className={wrapClassName}
        />
      </div>
    );
  }
}
