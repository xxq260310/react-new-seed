/*
 * @Description: 汇报关系树
 * @Author: zhangjunli
 * @Date: 2017-12-5 15:02:16
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import EditModal from '../../components/relation/EditModal';
import TreeDetail from '../../components/relation/TreeDetail';
import Tree from '../../components/relation/Tree';
import styles from './home.less';
import { emp } from '../../helper';

// editModal 组件的三种弹框类型
const MANAGER_MODAL = 'manager';
const TEAM_MODAL = 'team';
const MEMBER_MODAL = 'member';
// detailTable 组件的三种表格类型
const COMPANY_TABLE = '2';
const CENTER_TABLE = '3';
const TEAM_TABLE = '4';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  treeInfo: state.relation.treeInfo,
  detailInfo: state.relation.detailInfo,
  managerList: state.relation.managerList,
  menuItem: state.relation.menuItem,
});

const mapDispatchToProps = {
  updateTeam: fetchDataFunction(true, 'relation/updateTeam'),
  addTeam: fetchDataFunction(true, 'relation/addTeam'),
  deleteTeam: fetchDataFunction(true, 'relation/deleteTeam'),
  addMember: fetchDataFunction(true, 'relation/addMember'),
  deleteMember: fetchDataFunction(true, 'relation/deleteMember'),
  setManager: fetchDataFunction(true, 'relation/setManager'),
  updateManager: fetchDataFunction(true, 'relation/updateManager'),
  getDetailInfo: fetchDataFunction(true, 'relation/getDetailInfo'),
  getTreeInfo: fetchDataFunction(true, 'relation/getTreeInfo'),
  searchManager: fetchDataFunction(true, 'relation/searchManager'),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends Component {
  static propTypes = {
    updateTeam: PropTypes.func.isRequired,
    addTeam: PropTypes.func.isRequired,
    deleteTeam: PropTypes.func.isRequired,
    addMember: PropTypes.func.isRequired,
    deleteMember: PropTypes.func.isRequired,
    setManager: PropTypes.func.isRequired,
    updateManager: PropTypes.func.isRequired,
    treeInfo: PropTypes.object,
    getTreeInfo: PropTypes.func.isRequired,
    detailInfo: PropTypes.object,
    getDetailInfo: PropTypes.func.isRequired,
    managerList: PropTypes.object,
    searchManager: PropTypes.func.isRequired,
    menuItem: PropTypes.object,
  }

  static defaultProps = {
    treeInfo: {},
    detailInfo: {},
    managerList: {},
    menuItem: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      editModal: false, // 弹框的控制项
      modalType: '', // 弹框类型，自定义有三种类型
      currentItem: {}, // 当前弹框展示的信息
      searchList: [], // 弹框中搜索框搜索的数据
      companyMenu: {}, // 分公司节点
      centerMenu: {}, // 中心节点
      teamMenu: {}, // 团队节点
      selectMenu: {}, // 当前选中的menu
      flag: '', // 更新 update/新增 add
      detail: {}, // 详情信息
    };
  }

  componentDidMount() {
    const { getTreeInfo } = this.props;
    // 请求菜单树数据
    getTreeInfo({ queryEmpId: emp.getId() });
  }

  componentWillReceiveProps(nextProps) {
    const { managerList, detailInfo } = nextProps;
    if (managerList !== this.props.managerList) {
      const { servicePeopleList = [] } = managerList || {};
      this.setState({ searchList: servicePeopleList });
    }
    if (detailInfo !== this.props.detailInfo) {
      const { currentPostn } = detailInfo || {};
      this.setState({ detail: detailInfo, selectMenu: currentPostn });
    }
  }

  // 关闭弹框时，清空弹框显示相关的数据
  @autobind
  closeModal() {
    this.setState({ editModal: false, currentItem: {}, searchList: [], flag: '' });
  }

  // 选中菜单
  @autobind
  handleSelect(menu) {
    if (_.isEmpty(menu)) {
      return;
    }
    const { postnId, postnTypeCD } = menu;
    const { getDetailInfo } = this.props;
    let stateParam = { centerMenu: menu };
    if (postnTypeCD === COMPANY_TABLE) {
      stateParam = { companyMenu: menu };
    } else if (postnTypeCD === TEAM_TABLE) {
      stateParam = { teamMenu: menu };
    }
    this.setState(
      { ...stateParam, selectMenu: menu, detail: _.isEmpty(postnId) ? {} : this.state.detail },
      () => {
        if (!_.isEmpty(postnId)) {
          getDetailInfo({ postnId });
        }
      },
    );
  }

  // 触发弹框中的搜索框搜索事件
  @autobind
  handleSearch(keyword) {
    // 搜索关键字为空，则不搜索
    if (_.isEmpty(keyword)) {
      return;
    }
    const { searchManager } = this.props;
    searchManager({ keyword });
  }

  @autobind
  refresh(postnId, isRefreshTree = false) {
    const { getTreeInfo, getDetailInfo } = this.props;
    if (isRefreshTree) {
      getTreeInfo({ queryEmpId: emp.getId() });
    }
    getDetailInfo({ ...postnId });
  }

  // 弹框确定事件
  @autobind
  handleOk(param) {
    const { addTeam, addMember, updateManager, updateTeam, setManager } = this.props;
    const { flag, selectMenu, companyMenu, centerMenu, teamMenu, currentItem } = this.state;
    const { postnTypeCD, postnId } = selectMenu || {};
    const { postnId: companyPostnId } = companyMenu || {};
    const { orgId: centerOrgId, postnId: centerPostnId } = centerMenu || {};
    const { orgId: teamOrgId, postnId: teamPostnId, postnTypeCD: teamCD } = teamMenu || {};
    const { postnId: curPostnId } = currentItem || {};
    const { select, modalType, isUpdate, teamName } = param;
    const { ptyMngId, orgId } = select;
    this.setState(
      { editModal: false, searchList: [], currentItem: {}, flag: '' },
      () => {
        // 去重
        if (!isUpdate) {
          return;
        }
        // 责任人弹框
        if (modalType === MANAGER_MODAL) {
          if (flag === 'update') {
            if (!_.isEmpty(postnTypeCD) && postnTypeCD === teamCD) {
              // 更新团队负责人
              updateTeam(
                { postnId, teamEmpId: ptyMngId },
              ).then(
                () => { this.refresh({ postnId }); },
              );
            } else {
              // 更新，是本级的 postnId
              updateManager({ newEmpId: ptyMngId, postnId }).then(
                () => { this.refresh({ postnId }); },
              );
            }
          } else {
            let setPostnId = companyPostnId;
            let setOrgId = centerOrgId;
            if (!_.isEmpty(postnTypeCD) && postnTypeCD === teamCD) {
              setPostnId = centerPostnId;
              setOrgId = teamOrgId;
            }
            // 新建，是上一级的 postnId, 本级的 orgId
            setManager({ cfzxEmpId: ptyMngId, upPosId: setPostnId, cfzxOrgId: setOrgId }).then(
              () => {
                const { menuItem: { empPostnDTO: { postnId: menuPostnId } } } = this.props;
                return this.refresh({ postnId: menuPostnId });
              },
            );
          }
        } else if (modalType === TEAM_MODAL) {
          if (flag === 'add') {
            // 新建，是上一级的 postnId
            addTeam({ teamEmpId: ptyMngId, upPosId: postnId, orgId, teamName }).then(
              () => {
                this.refresh({ postnId }, true);
              },
            );
          } else {
            // 请求更新团队和菜单树数据
            updateTeam(
              { postnId: curPostnId, teamDesc: teamName, teamEmpId: ptyMngId },
            ).then(
              () => { this.refresh({ postnId }, true); },
            );
          }
        } else if (modalType === MEMBER_MODAL) {
          // 请求添加成员和详情数据
          addMember({ teamEmpId: ptyMngId, postnId: teamPostnId }).then(
            () => { this.refresh({ postnId }); },
          );
        }
      },
    );
  }

  // 添加事件弹框（添加团队/添加成员）
  @autobind
  handleAdd(category) {
    this.setState({
      modalType: category === TEAM_TABLE ? MEMBER_MODAL : TEAM_MODAL,
      flag: 'add',
      editModal: true,
    });
  }

  @autobind
  handleDelete(category, item) {
    const { deleteTeam, deleteMember } = this.props;
    const { selectMenu: { postnId: menuPostnId } } = this.state;
    const { postnId, login } = item;
    if (category === CENTER_TABLE) {
      deleteTeam({ postnId }).then(
        () => {
          this.refresh({ postnId: menuPostnId }, true);
        },
      );
    } else if (category === TEAM_TABLE) {
      deleteMember({ teamEmpId: login, postnId }).then(
        () => { this.refresh({ postnId: menuPostnId }); },
      );
    }
  }

  @autobind
  handleUpdate(item, isManagerMdoal = false, hasManager = false) {
    let flag = 'update';
    if (isManagerMdoal && !hasManager) {
      flag = 'add';
    }
    this.setState({
      modalType: isManagerMdoal ? MANAGER_MODAL : TEAM_MODAL,
      currentItem: item,
      editModal: true,
      flag,
    });
  }

  render() {
    const {
      detail,
      modalType,
      editModal,
      currentItem,
      searchList,
      selectMenu: { postnTypeCD, orgName },
    } = this.state;
    const { treeInfo } = this.props;
    return (
      <div className={styles.relationContainer}>
        <Tree
          treeData={treeInfo}
          onSelect={this.handleSelect}
        />
        <TreeDetail
          detail={detail}
          headerLine={orgName}
          category={postnTypeCD}
          onAdd={this.handleAdd}
          onDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
        {
          editModal ? (
            <EditModal
              list={searchList}
              visible={editModal}
              modalType={modalType}
              defultItem={currentItem}
              onOk={this.handleOk}
              onSearch={this.handleSearch}
              onCancel={this.closeModal}
            />
          ) : null
        }
      </div>
    );
  }
}

