/*
 * @Author: sunweibin
 * @Date: 2017-10-25 15:55:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-15 14:00:48
 */
import _ from 'lodash';

function convertNY2ZN(v) {
  if (_.isEmpty(v)) {
    return '';
  }
  return v === 'N' ? '否' : '是';
}

function changeProductJson(product) {
  const { riskMatch, termMatch, prodMatch, prodCode, aliasName, agrType, prodCommission } = product;
  const prodCom = _.isEmpty(prodCommission) ? {} : { prodCommission };
  return {
    key: prodCode,
    // 产品代码
    prodCode,
    // 产品名称
    aliasName,
    // 签署确认书类型
    agrType,
    // 风险是否匹配
    riskMatch: convertNY2ZN(riskMatch),
    // 期限是否匹配
    termMatch: convertNY2ZN(termMatch),
    // 产品是否匹配
    prodMatch: convertNY2ZN(prodMatch),
    ...prodCom,
  };
}

function changeSubProductJson(product) {
  const { riskMatch, termMatch, prodMatch, prodCode, aliasName, agrType, prodCommission } = product;
  const prodCom = _.isEmpty(prodCommission) ? {} : { prodCommission };
  const proList = _.isEmpty(riskMatch) ? {
    key: prodCode,
    // 产品代码
    prodCode,
    // 产品名称
    aliasName,
    // 签署确认书类型
    agrType,
  } : {
    key: prodCode,
    // 产品代码
    prodCode,
    // 产品名称
    aliasName,
    // 签署确认书类型
    agrType,
    // 风险是否匹配
    riskMatch: convertNY2ZN(riskMatch),
    // 期限是否匹配
    termMatch: convertNY2ZN(termMatch),
    // 产品是否匹配
    prodMatch: convertNY2ZN(prodMatch),
  };
  return {
    ...prodCom,
    ...proList,
  };
}

const detailConfig = {
  // 客户信息表头
  custTableColumns: [
    {
      dataIndex: 'custNum',
      key: 'custNum',
      title: '经纪客户号',
    },
    {
      dataIndex: 'custName',
      key: 'custName',
      title: '客户名称',
    },
    {
      dataIndex: 'custLevel',
      key: 'custLevel',
      title: '客户等级',
    },
    {
      dataIndex: 'openDivisinoName',
      key: 'openDivisinoName',
      title: '开户营业部',
    },
    {
      dataIndex: 'serManager',
      key: 'serManager',
      title: '服务经理',
    },
  ],
  // 单佣金中的产品表头
  singleProColumns: [
    {
      dataIndex: 'prodCode',
      key: 'prodCode',
      title: '产品代码',
      width: '140px',
    },
    {
      dataIndex: 'aliasName',
      key: 'aliasName',
      title: '产品名称',
    },
    {
      dataIndex: 'prodCommission',
      key: 'prodCommission',
      title: '佣金率(‰)',
    },
    {
      dataIndex: 'riskMatch',
      key: 'riskMatch',
      title: '风险是否匹配',
    },
    {
      dataIndex: 'termMatch',
      key: 'termMatch',
      title: '期限是否匹配',
    },
    {
      dataIndex: 'prodMatch',
      key: 'prodMatch',
      title: '产品是否匹配',
    },
    {
      dataIndex: 'agrType',
      key: 'agrType',
      title: '签署确认书类型',
    },
  ],
  // 资讯中的产品表头
  advisoryProColumns: [
    {
      dataIndex: 'prodCode',
      key: 'prodCode',
      title: '产品代码',
    },
    {
      dataIndex: 'aliasName',
      key: 'aliasName',
      title: '产品名称',
    },
    {
      dataIndex: 'riskMatch',
      key: 'riskMatch',
      title: '风险是否匹配',
    },
    {
      dataIndex: 'termMatch',
      key: 'termMatch',
      title: '期限是否匹配',
    },
    {
      dataIndex: 'prodMatch',
      key: 'prodMatch',
      title: '投资品种是否匹配',
    },
    {
      dataIndex: 'agrType',
      key: 'agrType',
      title: '签署确认书类型',
    },
  ],
  // 创建客户表格数据
  createCustTableData(data) {
    const selfData = _.cloneDeep(data);
    const {
      custNum,
      custName,
      custLevel,
      openDivisinoName,
      serviceManager,
      serviceManagerLogin,
    } = selfData;
    return [{
      key: custNum,
      custNum,
      custName,
      custLevel,
      openDivisinoName,
      serManager: `${serviceManager}(${serviceManagerLogin})`,
    }];
  },
  // 创建产品表数据
  createProTableData(data) {
    const newProductLiet = data.map((product) => {
      const { subItem } = product;
      const newProduct = changeProductJson(product);
      let children = null;
      if (!_.isEmpty(subItem)) {
        // 存在子产品
        children = subItem.map(changeProductJson);
        return { ...newProduct, children };
      }
      return newProduct;
    });
    return newProductLiet;
  },
  // 创建咨讯订阅和退订产品表数据
  createSubProTableData(data) {
    const newProductLiet = data.map((product) => {
      const { subItem } = product;
      const newProduct = changeSubProductJson(product);
      let children = null;
      if (!_.isEmpty(subItem)) {
        // 存在子产品
        children = subItem.map(changeSubProductJson);
        return { ...newProduct, children };
      }
      return newProduct;
    });
    return newProductLiet;
  },
};

export default detailConfig;
