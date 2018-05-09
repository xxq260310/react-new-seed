/*
 * @fileOverview config/pageConfig.js
 * @author sunweibin
 * @description 用于设置合作合约、佣金调整、私密客户的page Type
 * 以及各个子类型和状态配置项
 *
 * 现阶段子类型(subType)与状态(status)不做联动
 *
*/
// TableTransfer 组件传入columns 需要引入;
import React from 'react';

const TableTransferColumn = item => (
  <div title={item}>
    {item}
  </div>
);

const pageConfig = {
  // 权限分配
  permission: {
    pageName: '权限申请',
    pageType: '01', // 查询列表接口中的type值
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '私密客户设置',
        value: '0103',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ], // 状态
      },
      {
        show: true,
        label: '私密客户取消',
        value: '0102',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '私密客户交易信息权限分配',
        value: '0101',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
    ], // 子类型
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
    ],
  },
  // 佣金调整
  commission: {
    pageName: '服务订购',
    pageType: '02',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '佣金调整',
        value: '0201',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
          {
            show: true,
            label: '佣金待处理',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '批量佣金调整',
        value: '0202',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '资讯订阅',
        value: '0203',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '资讯退订',
        value: '0204',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
        ],
      },
    ],
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
    ],
  },
  // 合作合约
  contract: {
    pageName: '合作合约',
    pageType: '03',
    subscribe: '1',
    unsubscribe: '2',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '受限股解禁',
        value: '0301',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
    ],
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
    ],
    operationList: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '订购',
        value: '1',
      },
      {
        show: true,
        label: '退订',
        value: '2',
      },
    ],
    titleList: [
      {
        dataIndex: 'termsDisplayName',
        key: 'termsDisplayName',
        title: '条款名称',
      },
      {
        dataIndex: 'paraDisplayName',
        key: 'paraDisplayName',
        title: '明细参数',
      },
      {
        dataIndex: 'paraVal',
        key: 'paraVal',
        title: '值',
        width: 90,
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '合作部门',
      },
    ],
  },
  // 通道类型协议
  channelsTypeProtocol: {
    pageName: '通道类型协议',
    pageType: '05',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '高速通道类协议',
        value: '0501',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          }, {
            show: true,
            label: '协议退订',
            value: '2',
          }, {
            show: true,
            label: '协议续订',
            value: '3',
          },
        ],
      },
      {
        show: true,
        label: '紫金快车道协议',
        value: '0502',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          }, {
            show: true,
            label: '协议退订',
            value: '2',
          }, {
            show: true,
            label: '协议续订',
            value: '3',
          }, {
            show: true,
            label: '新增或删除下挂客户',
            value: '4',
          },
        ],
      },
      {
        show: true,
        label: '套利软件',
        value: '0503',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          },
        ],
      },
      {
        show: true,
        label: '期权软件',
        value: '0504',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          },
        ],
      },
    ],
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
    ],
    operationList: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '协议订购',
        value: 'Subscribe',
      },
      {
        show: true,
        label: '协议退订',
        value: 'Unsubscribe',
      },
      {
        show: true,
        label: '协议续订',
        value: 'Renewal',
      },
      {
        show: true,
        label: '新增或删除下挂客户',
        value: 'AddDel',
      },
    ],
    businessType: [
      {
        show: true,
        label: '开通权限',
        value: '1',
      }, {
        show: true,
        label: '开通软件',
        value: '2',
      }, {
        show: true,
        label: '开通软件+权限',
        value: '3',
      }, {
        show: true,
        label: '软件续用',
        value: '4',
      }, {
        show: true,
        label: '套利软件',
        value: '5',
      },
    ],
    // 协议产品表格表头数组
    protocolProductTitleList: [
      {
        dataIndex: 'prodCode',
        key: 'prodCode',
        title: '产品代码',
        width: 100,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'prodName',
        key: 'prodName',
        title: '产品名称',
        width: 120,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'prodTypeName',
        key: 'prodTypeName',
        title: '产品类型',
        width: 110,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'prodSubTypeName',
        key: 'prodSubTypeName',
        title: '子类型',
        width: 110,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'riskMatchFlag',
        key: 'riskMatchFlag',
        title: '风险是否匹配',
        width: 110,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'termMatchFlag',
        key: 'termMatchFlag',
        title: '期限是否匹配',
        width: 110,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'varietyMatchFlag',
        key: 'varietyMatchFlag',
        title: '投资品种是否匹配',
        width: 130,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'confirmType',
        key: 'confirmType',
        title: '签署确认书类型',
        width: 120,
        render: TableTransferColumn,
      },
      {
        dataIndex: 'price',
        key: 'price',
        title: '价格',
        width: 60,
        render: TableTransferColumn,
      },
    ],
    // 协议条款表格表头数组
    protocolClauseTitleList: [
      {
        dataIndex: 'terms',
        key: 'terms',
        title: '条款名称',
      },
      {
        dataIndex: 'param',
        key: 'param',
        title: '明细参数',
      },
      {
        dataIndex: 'paraVal',
        key: 'paraVal',
        title: '值(元)',
      },
      {
        dataIndex: 'preCondition',
        key: 'preCondition',
        title: '前提条件',
      },
      {
        dataIndex: 'furturePromotion',
        key: 'furturePromotion',
        title: '未来承诺',
      },
    ],
    // 下挂客户
    underCustTitleList: [
      {
        dataIndex: 'subCustType',
        key: 'subCustType',
        title: '客户类型',
      },
      {
        dataIndex: 'econNum',
        key: 'econNum',
        title: '经纪客户号',
      },
      {
        dataIndex: 'custName',
        key: 'custName',
        title: '客户名称',
      },
      {
        dataIndex: 'custStatus',
        key: 'custStatus',
        title: '状态',
      },
    ],
    // 附件类型
    attachmentMap: [
      {
        type: 'sqb',
        title: '申请表',
        show: true,
        length: 0,
      },
      {
        type: 'yxzl',
        title: '影像资料',
        show: true,
        length: 0,
      },
      {
        type: 'sqwts',
        title: '授权委托书',
        show: true,
        length: 0,
      },
      {
        type: 'jzdcb',
        title: '尽职调查表',
        show: true,
        length: 0,
      },
      {
        type: 'fwxy',
        title: '服务协议',
        show: true,
        length: 0,
      },
      {
        type: 'cns',
        title: '承诺书',
        show: true,
        length: 0,
      },
      {
        type: 'qt',
        title: '其他',
        show: true,
        length: 0,
      },
    ],
  },
  // 进行佣金调整子类型比对需要用到的数据
  comsubs: {
    noSelected: '', // 用户未选择子类型的情况
    single: '0201', // 单佣金调整
    batch: '0202', // 批量佣金调整
    subscribe: '0203', // 资讯订阅
    unsubscribe: '0204', // 资讯退订
  },
  // 分公司客户划转
  filialeCustTransfer: {
    pageName: '分公司客户人工划转',
    pageType: '07', // 查询列表接口中的type值
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
      {
        show: true,
        label: '失败',
        value: '05',
      },
    ],
    titleList: [
      {
        dataIndex: 'brokerNumber',
        key: 'brokerNumber',
        title: '经纪客户号',
      },
      {
        dataIndex: 'custName',
        key: 'custName',
        title: '客户名称',
      },
      {
        dataIndex: 'orgName',
        key: 'orgName',
        title: '原服务营业部',
      },
      {
        dataIndex: 'empName',
        key: 'empName',
        title: '原服务经理',
      },
      {
        dataIndex: 'newOrgName',
        key: 'newOrgName',
        title: '新服务营业部',
      },
      {
        dataIndex: 'newEmpId',
        key: 'newEmpId',
        title: '新服务经理',
      },
    ],
    approvalColumns: [
      {
        title: '工号',
        dataIndex: 'login',
        key: 'login',
      }, {
        title: '姓名',
        dataIndex: 'empName',
        key: 'empName',
      }, {
        title: '所属营业部',
        dataIndex: 'occupation',
        key: 'occupation',
      },
    ],
  },
  // 自建任务列表
  tasklist: {
    pageName: '自建任务列表',
    pageType: '04',
    type: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '产品营销',
        value: 'ProdMarketing',
      },
      {
        show: true,
        label: '产品售后',
        value: 'AfterSales',
      },
      {
        show: true,
        label: '业务推荐',
        value: 'BusinessRecomm',
      },
      {
        show: true,
        label: '账户服务',
        value: 'AccoutService',
      },
      {
        show: true,
        label: '交易服务',
        value: 'TradeService',
      },
      {
        show: true,
        label: '活动关怀',
        value: 'ActiveCare',
      },
    ],
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
    ],
  },
  // 客户反馈
  customerFeedback: {
    parentTitleList: [
      {
        dataIndex: 'name',
        key: 'name',
        title: '一级反馈',
      },
    ],
    childTitleList: [
      {
        dataIndex: 'name',
        key: 'name',
        title: '二级反馈',
      },
    ],
  },
};

export default pageConfig;
