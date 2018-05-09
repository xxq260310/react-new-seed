/**
 * @Author: zhuyanwen
 * @Date: 2018-01-30 14:11:19
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-14 17:46:40
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import QuickMenu from './QuickMenu';
import SixMonthEarnings from './SixMonthEarnings';
import MatchArea from './MatchArea';
import { openFspTab } from '../../../utils';
import styles from './customerRow.less';

import maleAvator from './img/icon-avator.png';
import femaleAvator from './img/female-avator.png';
import otherAvator from './img/otherAvator.png';
import iconGeneralGgency from './img/icon-general-agency.png';
import iconProductAgency from './img/icon-product-agency.png';
import iconMoney from './img/icon-money.png';
import iconDiamond from './img/icon-diamond-card.png';
import iconGold from './img/icon-gold-card.png';
import iconSliver from './img/icon-sliver-card.png';
import iconWhiteGold from './img/icon-white-gold.png';
import iconEmpty from './img/icon-empty.png';
import logable, { logPV } from '../../../decorators/logable';

// 客户男女code码
const MALE_CODE = '109001';
const FEMALE_CODE = '109002';

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';
// 产品机构对应的code码
const PROD_CODE = 'prod';

// 客户性质 code 对应 name
const custNatureName = {
  [PER_CODE]: '个人客户',
  [ORG_CODE]: '一般机构',
  [PROD_CODE]: '产品机构',
};

// 风险等级配置
const riskLevelConfig = {
  704010: {
    name: '激',
    title: '激进型',
    colorCls: 'jijin',
  },
  704040: {
    name: '低',
    title: '保守型（最低类别）',
    colorCls: 'zuidi',
  },
  704030: {
    name: '保',
    title: '保守型',
    colorCls: 'baoshou',
  },
  704020: {
    name: '稳',
    title: '稳健型',
    colorCls: 'wenjian',
  },
  704025: {
    name: '谨',
    title: '谨慎型',
    colorCls: 'jinshen',
  },
  704015: {
    name: '积',
    title: '积极型',
    colorCls: 'jiji',
  },
};

// 客户等级的图片源
const rankImgSrcConfig = {
  // 钻石
  805010: iconDiamond,
  // 白金
  805015: iconWhiteGold,
  // 金卡
  805020: iconGold,
  // 银卡
  805025: iconSliver,
  // 理财
  805030: iconMoney,
  // 无
  805040: iconEmpty,
  // 其他
  805999: '',
};

export default class CustomerRow extends PureComponent {
  static propTypes = {
    q: PropTypes.string,
    listItem: PropTypes.object.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    isAllSelect: PropTypes.bool.isRequired,
    selectedIds: PropTypes.array,
    onSendEmail: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    createContact: PropTypes.func.isRequired,
    custEmail: PropTypes.object.isRequired,
    emailCustId: PropTypes.string.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    formatAsset: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
    entertype: PropTypes.string.isRequired,
    goGroupOrTask: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    q: '',
    selectedIds: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '客户列表头像/$props.listItem.name' } })
  toDetail() {
    const { push } = this.props;
    const {
      listItem: {
        pOrO,
        custId,
        rowId,
        ptyId,
      },
    } = this.props;
    // pOrO代表个人客户，机构客户
    const type = (!pOrO || pOrO === PER_CODE) ? PER_CODE : ORG_CODE;
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      forceRefresh: true,
    };
    const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`;
    // TODOTAB: 如何与后端是动态接口
    openFspTab({
      routerAction: push,
      url,
      pathname: '/customerCenter/customerDetail',
      param,
      state: {
        url,
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '客户列表行的check框' } })
  handleSelect() {
    const { onChange, listItem: { custId, name }, handleCheck } = this.props;
    // 手动发送日志
    handleCheck({ custId, name });
    onChange(custId, name);
  }

  @autobind
  @logPV({ pathname: '/modal/createContact', title: '电话联系' })
  createModal(listItem) {
    const { pOrO, custId, name } = listItem;
    const { createContact } = this.props;
    createContact({
      custName: name,
      custId,
      custType: (!pOrO || pOrO === PER_CODE) ? PER_CODE : ORG_CODE,
    });
  }

  // 判断是否为主服务经理
  @autobind
  isMainService() {
    const {
      empInfo,
      listItem: {
        empId,
      },
    } = this.props;
    // 登录者用户中的rowId和客户的主服务经理的工号是否一致
    return empInfo.rowId === empId;
  }

  @autobind
  renderAgeOrOrgName() {
    const { listItem } = this.props;
    if (listItem.pOrO === PER_CODE) {
      // 客户性质为个人
      return <span>{listItem.genderValue}/{listItem.age}岁</span>;
    } else if (listItem.pOrO === ORG_CODE && listItem.orgTypeName) {
      // 客户性质为一般机构
      return <span>{listItem.orgTypeName}</span>;
    } else if (listItem.pOrO === PROD_CODE && listItem.prodTypeCode) {
      // 客户性质为产品机构
      return <span>{listItem.prodTypeCode}</span>;
    }
    return '';
  }

  // 渲染客户头像
  // 区分产品机构、一般机构、个人客户：男、女 ，四种头像
  @autobind
  renderAvator({ genderCode = '', pOrO = '' }) {
    let imgSrc = '';
    if (pOrO === PER_CODE) {
      if (genderCode === MALE_CODE) {
        imgSrc = maleAvator;
      } else if (genderCode === FEMALE_CODE) {
        imgSrc = femaleAvator;
      } else {
        imgSrc = otherAvator;
      }
    } else if (pOrO === ORG_CODE) {
      imgSrc = iconGeneralGgency;
    } else if (pOrO === PROD_CODE) {
      imgSrc = iconProductAgency;
    }
    if (this.isMainService()) {
      return (
        <img
          onClick={this.toDetail}
          className={`${styles.avatorImage} ${styles.clickable}`}
          src={imgSrc}
          alt=""
        />
      );
    }
    return <img className={styles.avatorImage} src={imgSrc} alt="" />;
  }

  renderRankImg(listItem = {}) {
    return rankImgSrcConfig[listItem.levelCode] ?
      <img className={styles.iconMoneyImage} src={rankImgSrcConfig[listItem.levelCode]} alt="" />
      : null;
  }

  // 是否显示快捷菜单
  renderQuickMenu() {
    const {
      listItem,
      toggleServiceRecordModal,
      custEmail,
      onSendEmail,
      emailCustId,
      queryCustUuid,
      condition,
      location,
      entertype,
      goGroupOrTask,
    } = this.props;
    if (this.isMainService()) {
      return (<QuickMenu
        listItem={listItem}
        createModal={this.createModal}
        toggleServiceRecordModal={toggleServiceRecordModal}
        custEmail={custEmail}
        emailCustId={emailCustId}
        onSendEmail={onSendEmail}
        queryCustUuid={queryCustUuid}
        condition={condition}
        location={location}
        entertype={entertype}
        goGroupOrTask={goGroupOrTask}
      />);
    }
    return null;
  }

  // 显示用户名称
  renderCustName() {
    const {
      listItem: {
        name,
      },
    } = this.props;
    if (this.isMainService()) {
      return name ? (
        <span className="name clickable" onClick={this.toDetail}>{name}</span>
      ) : null;
    }
    return <span className="name">{name}</span>;
  }

  render() {
    const { q, listItem, monthlyProfits, isAllSelect, selectedIds,
      custIncomeReqState,
      getCustIncome,
      location,
      dict,
      formatAsset,
      empInfo: { rowId },
    } = this.props;
    const rskLev = _.trim(listItem.riskLvl);
    const str = `${listItem.custId}.${listItem.name}`;
    const isChecked = _.includes(selectedIds, str) || isAllSelect;
    let assetValue = '0';
    let assetUnit = '';
    if (listItem.asset) {
      const obj = formatAsset(listItem.asset);
      assetValue = obj.value;
      assetUnit = obj.unit;
    }
    // 佣金率
    let miniFee = '--';
    if (listItem.miniFee !== null) {
      miniFee = `${(listItem.miniFee * 1000).toFixed(2)}‰`;
    }
    // 归集率
    let hsRate = '--';
    if (listItem.hsRate !== null) {
      hsRate = listItem.hsRate < 0 ?
        Number(listItem.hsRate.toFixed(2)) :
        `${Number((listItem.hsRate * 100).toFixed(2))}%`;
    }
    return (
      <div
        className={styles.customerRow}
      >
        {this.renderQuickMenu()}
        <div className={styles.selectIcon}>
          <Checkbox
            disabled={isAllSelect}
            checked={isChecked}
            onChange={this.handleSelect}
          />
        </div>
        <div
          className={styles.customerRowContent}
        >
          <div className={`${styles.customerRowLeft} clear`}>
            <div className={styles.avatorContent}>
              {this.renderAvator(listItem)}
              <div className={styles.avatorText}>{custNatureName[listItem.pOrO] || ''}</div>
              {
                this.renderRankImg(listItem)
              }
            </div>
          </div>
          <div className={styles.customerRowRight}>
            <div className="row-one">
              {this.renderCustName()}
              <span>{listItem.custId}</span>
              <span className="cutOffLine">|</span>
              {
                listItem.genderValue && listItem.age
                  ? <span>{listItem.genderValue}/{listItem.age}岁</span>
                  : null
              }
              {
                listItem.genderValue && listItem.age
                  ? <span className="cutOffLine">|</span>
                  : null
              }
              <span>
                {`${listItem.openDt.slice(0, 4)}-${listItem.openDt.slice(4, 6)}-${listItem.openDt.slice(6, 8)} 开户`}
              </span>
              {
                (rskLev === '' || rskLev === 'null')
                  ? '' :
                  <div
                    className={`riskLevel ${riskLevelConfig[rskLev].colorCls}`}
                  >
                    <div className="itemText">{`风险等级：${riskLevelConfig[rskLev].title}`}</div>
                    {riskLevelConfig[rskLev].name}
                  </div>
              }
              {listItem.highWorthFlag ? <div className="highWorthFlag">高净值</div> : null}
              {
                listItem.contactFlag ?
                  <div className="iconSingned">
                    签约
                    <div className="itemText">签约客户</div>
                  </div> : null
              }
            </div>
            <div className="row-two">
              <span className="imputation">归集率: <em>{hsRate}</em></span>
              <span className="cutOffLine">|</span>
              <span className="commission">佣金率: <em>{miniFee}</em></span>
              <span className="cutOffLine">|</span>
              <span>总资产:</span>
              <span className="asset">{assetValue}</span>
              <span className="assetunit">{assetUnit}</span>
              <div className={styles.sixMonthEarnings}>
                <SixMonthEarnings
                  listItem={listItem}
                  monthlyProfits={monthlyProfits}
                  custIncomeReqState={custIncomeReqState}
                  getCustIncome={getCustIncome}
                  formatAsset={formatAsset}
                />
              </div>
              <div className="department">
                <span>
                  服务经理：
                  {
                    `${listItem.orgName || '无'}-${listItem.empName || '无'}`
                  }
                </span>
              </div>
            </div>
            <div className={listItem.empId === rowId ? styles.marginInfo : ''}>
              <MatchArea
                q={q}
                dict={dict}
                location={location}
                listItem={listItem}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
