/**
 * @file components/customerPool/home/Funney.js
 * @author zhangjunli
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';

import IECharts from '../../IECharts';
import styles from './funney.less';
import { openFspTab } from '../../../utils';

// 服务客户数的 key
const SERVICE_CUST_NUM = 'custNum';

function getDataConfig(data) {
  return data.map(item => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      normal: {
        color: item.bgColor,
      },
    },
  }));
}

function linkToList(item, push) {
  if (item.key !== SERVICE_CUST_NUM) {
    return;
  }
  openFspTab({
    routerAction: push,
    url: '/customer/manage/showCustManageTabWin',
    param: {
      id: 'FSP_CUST_TAB_CENTER_MANAGE',
      title: '客户管理',
      forceRefresh: true,
    },
  });
}

function renderIntro(data, push) {
  return _.map(
    data,
    (item, index) => (
      <div className={styles.row} key={`row${index}`}>
        <div
          className={`${item.key === SERVICE_CUST_NUM ? styles.canClick : ''} ${styles.count1}`}
          onClick={() => linkToList(item, push)}
        >
          <Popover
            title={`${item.value}`}
            content={item.description}
            placement="bottom"
            mouseEnterDelay={0.2}
            overlayStyle={{ maxWidth: '320px' }}
          >
            {item.value}
          </Popover>
        </div>
        <div className={styles.count2}>
          <span>/</span>
          <Popover
            title={`${item.property}${item.unit}`}
            content={item.propertyDesc}
            placement="bottom"
            mouseEnterDelay={0.2}
            overlayStyle={{ maxWidth: '320px' }}
          >
            <span>{item.property}</span>
            <span>{item.unit}</span>
          </Popover>
        </div>
      </div>
    ),
  );
}

function Funney({ dataSource, push }) {
  const { data, color } = dataSource;
  const funnelOption = {
    series: [
      {
        name: '漏斗图',
        type: 'funnel',
        left: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        min: _.last(data).value,
        max: _.head(data).value,
        minSize: '20%',
        maxSize: '100%',
        sort: 'none',
        label: {
          normal: {
            show: true,
            position: 'inside',
            fontSize: 12,
            color,
          },
        },
        itemStyle: {
          normal: {
            borderWidth: 0,
          },
        },
        data: getDataConfig(data),
      },
    ],
  };

  const onReady = (instance) => {
    instance.on('click', (arg) => {
      if (arg.componentType !== 'series') {
        return;
      }
      // 点击'服务客户数'时，跳转到 客户中心 > 客户管理 页面
      if (arg.name === '服务客户数') {
        openFspTab({
          routerAction: push,
          url: '/customer/manage/showCustManageTabWin',
          param: {
            id: 'FSP_CUST_TAB_CENTER_MANAGE',
            title: '客户管理',
            forceRefresh: true,
          },
          pathname: '/fsp/customerCenter/customerManage',
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.uintRow}>
        <div />
        <div>{'户数/资产'}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <IECharts
            onReady={onReady}
            option={funnelOption}
            resizable
            style={{
              height: '102px',
            }}
          />
        </div>
        <div className={styles.right}>
          {renderIntro(data, push)}
        </div>
      </div>
    </div>
  );
}

Funney.propTypes = {
  dataSource: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
};

export default Funney;
