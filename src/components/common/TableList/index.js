import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './tablelist.less';
import Icon from '../Icon';

// 私密客户取消
const PERMISSION_CUST_CANCLE = '0102';
export default class TableList extends PureComponent {
  static propTypes = {
    info: PropTypes.array,
    statusType: PropTypes.string.isRequired,
    onEmitUpdateValue: PropTypes.func,
    subType: PropTypes.string,
  }

  static defaultProps = {
    info: [],
    onEmitUpdateValue: null,
    subType: '',
  }

  get eleList() {
    const { statusType, onEmitUpdateValue, info } = this.props;
    const result = info.map((item, index) => {
      const callBack = () => {
        onEmitUpdateValue(item);
      };
      const key = `tableList-${index}`;
      return (
        <li
          key={key}
          className={style.spServerPersonelItem}
        >
          <span
            className="flex-base_2 text-center"
          >{item.ptyMngId}</span>
          <span
            className="flex-base_2 text-center"
          >
            <span
              className={item.isMain === 'true' ? style.mainManager : ''}
            >{item.ptyMngName}</span>
          </span>
          <span
            className="flex-base_2 text-center"
          >{item.job}</span>
          <span
            className="flex-base_3 text-center"
          >{item.businessDepartment}</span>
          <div
            className={classnames(['text-center',
              { 'flex-base_0': statusType === 'ready' || this.props.subType === PERMISSION_CUST_CANCLE },
              { 'flex-base_1': statusType !== 'ready' },
            ])}
          >
            <span key={`delete-${item.ptyMngId}`}>
              <Icon type="shanchu" onClick={callBack} />
            </span>
          </div>
        </li>
      );
    });
    return result;
  }

  render() {
    return (
      <ul className={style.spServerPersonel}>
        <li
          className={classnames([style.spServerPersonelItem, style.firstItem])}
        >
          <span
            className="flex-base_2 text-center"
          >工号</span>
          <span
            className="flex-base_2 text-center"
          >姓名</span>
          <span
            className="flex-base_2 text-center"
          >职位</span>
          <span
            className="flex-base_3 text-center"
          >所属营业部</span>
          <span
            className={classnames(['text-center',
              { 'flex-base_0': this.props.statusType === 'ready' || this.props.subType === PERMISSION_CUST_CANCLE },
              { 'flex-base_1': this.props.statusType !== 'ready' },
            ])}
          >操作</span>
        </li>
        {this.eleList}
      </ul>
    );
  }
}
