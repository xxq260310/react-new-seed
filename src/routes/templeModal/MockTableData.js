
/**
 * @description 组件的mock数据
 * @author zhangjunli
 */
import React from 'react';
import classnames from 'classnames';

import styles from './mockTableData.less';

export const confirmData = [
  ['待审批人', '002332'],
  ['待审意见', '通过通过通过通过通过通过通过通过过通过通过通过通过通过通过过通过通过通过'],
  ['审送对象', '002332'],
];

export const employeeData = [{
  id: 'HTSC001234',
  name: '王某某',
  depart: '南京长江路证券营业部',
}, {
  id: 'HTSC002234',
  name: '王某某',
  depart: '南京长江路证券营业部',
}, {
  id: 'HTSC003234',
  name: '王某某',
  depart: '南京长江路证券营业部',
}, {
  id: 'HTSC004234',
  name: '王某某',
  depart: '南京长江路证券营业部',
}, {
  id: 'HTSC005234',
  name: '王某某',
  depart: '南京长江路证券营业部',
}];

export const employeeColumns = [{
  title: '工号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '所属部门',
  dataIndex: 'depart',
  key: 'depart',
}];

export const subscribelData = [{
  key: '1',
  productName: '福享套餐1',
  productCode: 'TC02',
  type: '综合定价产品',
  rate: '0.0001',
}, {
  key: '2',
  productName: '持仓异动提醒2持仓异动提醒2持仓异动提醒2',
  productCode: 'SP0258',
  type: '综合定价产品',
  rate: '0.0006',
}, {
  key: '3',
  productName: '研报掘金3',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0005',
}, {
  key: '4',
  productName: '乐享套餐4持仓异动提醒2持仓异动提醒2',
  productCode: 'TC03',
  type: '综合定价产品',
  rate: '0.0003',
}, {
  key: '5',
  productName: '行业投资组合精选5',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0004',
}, {
  key: '6',
  productName: '福享套餐6',
  productCode: 'TC02',
  type: '综合定价产品',
  rate: '0.0009',
}, {
  key: '7',
  productName: '持仓异动提醒7',
  productCode: 'SP0258',
  type: '综合定价产品',
  rate: '0.0003',
}, {
  key: '8',
  productName: '研报掘金8',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0007',
}, {
  key: '9',
  productName: '乐享套餐9',
  productCode: 'TC03',
  type: '综合定价产品',
  rate: '0.0001',
}, {
  key: '10',
  productName: '行业投资组合精选10',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0002',
}];

export const data = [{
  key: '11',
  productName: '福享套餐11',
  productCode: 'TC02',
  type: '综合定价产品',
  rate: '0.0007',
}, {
  key: '12',
  productName: '持仓异动提醒12',
  productCode: 'SP0258',
  type: '综合定价产品',
  rate: '0.0001',
}, {
  key: '13',
  productName: '研报掘金13',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0008',
}, {
  key: '14',
  productName: '乐享套餐14',
  productCode: 'TC03',
  type: '综合定价产品',
  rate: '0.0003',
}, {
  key: '15',
  productName: '行业投资组合精选15行业投资组合5',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0005',
}, {
  key: '16',
  productName: '福享套餐16',
  productCode: 'TC02',
  type: '综合定价产品',
  rate: '0.0003',
}, {
  key: '17',
  productName: '持仓异动提醒17',
  productCode: 'SP0258',
  type: '综合定价产品',
  rate: '0.0009',
}, {
  key: '18',
  productName: '研报掘金18',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0006',
}, {
  key: '19',
  productName: '乐享套餐19',
  productCode: 'TC03',
  type: '综合定价产品',
  rate: '0.0001',
}, {
  key: '20',
  productName: '行业投资组合精选20',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0002',
}];

export const unsubcribeData = [{
  key: '11',
  productName: '福享套餐11',
  productCode: 'TC02',
  type: '综合定价产品',
  rate: '0.0005',
  children: [{
    key: '111',
    productName: '持仓异动提醒111',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'Y',
    disable: 'Y',
  }, {
    key: '112',
    productName: '福享套餐112',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'N',
    disable: 'N',
  }, {
    key: '113',
    productName: '持仓异动提醒113',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'Y',
    disable: 'Y',
  }],
}, {
  key: '12',
  productName: '持仓异动提醒12',
  productCode: 'SP0258',
  type: '综合定价产品',
  rate: '0.0001',
}, {
  key: '13',
  productName: '研报掘金13',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0006',
  children: [{
    key: '131',
    productName: '研报掘金套餐131',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'Y',
    disable: 'N',
  }, {
    key: '132',
    productName: '福享套餐132',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'Y',
    disable: 'Y',
  }, {
    key: '133',
    productName: '福享套餐133',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'N',
    disable: 'N',
  }],
}, {
  key: '14',
  productName: '乐享套餐14',
  productCode: 'TC03',
  type: '综合定价产品',
  rate: '0.0001',
}, {
  key: '15',
  productName: '行业投资组合精选15行业投资组合5',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0004',
  children: [{
    key: '151',
    productName: '福享套餐151',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'N',
    disable: 'N',
  }, {
    key: '152',
    productName: '福享套餐152',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'N',
    disable: 'N',
  }, {
    key: '153',
    productName: '福享套餐113',
    productCode: 'TC02',
    type: '综合定价产品',
    default: 'Y',
    disable: 'N',
  }],
}, {
  key: '16',
  productName: '福享套餐16',
  productCode: 'TC02',
  type: '综合定价产品',
  rate: '0.0008',
}, {
  key: '17',
  productName: '持仓异动提醒17',
  productCode: 'SP0258',
  type: '综合定价产品',
  rate: '0.0002',
}, {
  key: '18',
  productName: '研报掘金18',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0003',
}, {
  key: '19',
  productName: '乐享套餐19',
  productCode: 'TC03',
  type: '综合定价产品',
  rate: '0.0007',
}, {
  key: '20',
  productName: '行业投资组合精选20',
  productCode: 'SP0449',
  type: '综合定价产品',
  rate: '0.0009',
}];

export const productColumns = [
  {
    title: '产品代码',
    key: 'productCode',
    dataIndex: 'productCode',
    width: '15%',
    /* render: item => (
      <div className={classnames(styles.column, styles.productCode)} title={item}>
        {item}
      </div>
    ), */
  }, {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '30%',
    render: (item, record) => {
      console.log('########record############', record);
      return (
        <div className={classnames(styles.column, styles.productName)} title={item}>
          {item}
        </div>
      );
    },
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: '25%',
    render: item => (
      <div className={classnames(styles.column, styles.type)} title={item}>
        {item}
      </div>
    ),
  }, {
    title: '佣金率',
    dataIndex: 'rate',
    key: 'rate',
    width: '15%',
    render: item => (
      <div className={classnames(styles.column, styles.rate)} title={item}>
        {item}
      </div>
    ),
  },
];
/*
* 套路：要求table的td内容 不换行，打点显示的做法是：
* 1.在column数组的对应对象上，添加render属性，如上，添加div标签
* 2.设置div的样式为不换行，打点（参考对应的mockTableData.less文件）
* 设置div样式width套路：
* 1.当确定内容小于列宽时，可用百分比设置width，比如：width：90%（因为相邻的td，之前没有间距。可通过此，设置间距）
* 2.确定内容有大于列宽时，只能用值设置width，比如：width：150px（如果此处用百分比，会造成列头和列值不对齐）
*table 的对齐问题：
* 1.通常情况下，在column中，设置了width，发现列头（header）和列值仍不对齐，
*   原因是列值得的宽度 > 列头的宽度（此时要对齐：要么扩大列头宽度，要么缩小列值宽度）
* 2.横向滑动case下，修改column中的width，发现列头（header）的宽度，并没有改变，
*   原因是所有列头（header）之和 > scroll.x，此时扩大scroll.x即可
*/
