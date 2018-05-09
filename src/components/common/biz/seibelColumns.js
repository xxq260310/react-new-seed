/**
 * @file seibelColumns.js
 *  seibel 构造表格的列数据
 * @author honggaunqging
 */
import _ from 'lodash';
import React from 'react';
import Icon from '../Icon';
import Tag from '../tag';

export default function seibelColumns(props) {
  const { pageName, type, pageData } = props;
  const { subType, status, operationList } = pageData;

  const operateType = _.filter(operationList, v => v.label !== '全部');

  // 后台返回的类型字段转化为对应的中文显示
  const changeTypeDisplay = (st, options) => {
    if (st && !_.isEmpty(st) && st === options.pageType) {
      return options.pageName || '无';
    }
    return '无';
  };

  // 后台返回的子类型字段、状态字段转化为对应的中文显示
  const changeDisplay = (st, options) => {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || {};
      return nowStatus.label || '无';
    }
    return '无';
  };

  const columns = [{
    width: '60%',
    render: (text, record) => (
      <div className="leftSection">
        <div className="id">
          <Icon type={type} className="seibelListIcon" />
          <span className="serialNumber">编号{record.id || '暂无'}</span>
          {
            (pageName === 'channelsTypeProtocol' && record.business2) ?
              <span className="type">{changeDisplay(record.business2, operateType)}</span>
            :
              <span className="type">{changeTypeDisplay(record.type, pageData)}</span>
          }
        </div>
        <div className="subType">{changeDisplay(record.subType, subType)}</div>
        <div className="drafter">拟稿人：<span className="drafterName">{record.empName}({record.empId})</span>{`${record.orgName || ''}` || '无'}</div>
      </div>
      ),
  }, {
    width: '40%',
    render: (text, record) => (
      <div className="rightSection">
        <div className="tagArea">
          {(pageName === 'contract' && record.business2) ? <Tag type="yellow" text={changeDisplay(record.business2, operateType)} /> : null}
          <Tag type="blue" text={changeDisplay(record.status, status)} />
        </div>
        <div className="date">{(record.createTime && record.createTime.slice(0, 10)) || '无'}</div>
        {
          record.subType === '0202' ?
          (
            <div className="cust">共{record.business2 || 0}人,已完成{record.business3 || 0}人</div>
          )
          :
          (
            <div className="cust">客户：{record.custName || '无'}({record.custNumber || '无'})</div>
          )
        }
      </div>
    ),
  }];

  return columns;
}
