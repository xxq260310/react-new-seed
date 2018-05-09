/*
* @Description: 新建合约条款 弹层
* @Author: XuWenKang
* @Date:   2017-09-27 17:10:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-24 17:00:08
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, message } from 'antd';
import _ from 'lodash';
import CommonModal from '../../components/common/biz/CommonModal';
import InfoForm from '../common/infoForm';
import Select from '../../components/common/Select';
import AutoComplete from '../common/similarAutoComplete';
import styles from './addClause.less';
import logable from '../../decorators/logable';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
export default class EditForm extends PureComponent {
  static propTypes = {
    // 点击确认的回调
    onConfirm: PropTypes.func.isRequired,
    // 条款名称列表
    clauseNameList: PropTypes.array.isRequired,
    // 部门列表
    departmentList: PropTypes.array.isRequired,
    // 是否显示弹框
    isShow: PropTypes.bool.isRequired,
    // 关闭弹框的回调
    onCloseModal: PropTypes.func.isRequired,
    // 根据关键词搜索部门
    searchDepartment: PropTypes.func.isRequired,
    // 默认数据
    defaultData: PropTypes.object,
    // 是否是编辑
    edit: PropTypes.bool,
    // 清除部门数据
    clearDepartmentData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    defaultData: EMPTY_OBJECT,
    edit: false,
  }

  constructor(props) {
    super(props);
    const { defaultData, defaultData: { data, index }, edit } = props;
    let clauseName = EMPTY_OBJECT;
    let detailParam = EMPTY_OBJECT;
    let department = EMPTY_OBJECT;
    let value = '';
    let editIndex = '';
    if (!_.isEmpty(defaultData)) {
      clauseName = {
        termVal: data.termsDisplayName,
        value: data.termsName,
      };
      detailParam = {
        val: data.paraDisplayName,
        value: data.paraName,
      };
      value = data.paraVal;
      department = {
        name: data.divName,
        value: data.divIntegrationId,
      };
      editIndex = index;
    }
    this.state = {
      clauseName,
      detailParam,
      value,
      department,
      detailParamList: EMPTY_ARRAY, // 明细参数列表
      editIndex,
      edit,
    };
  }

  componentWillUnmount() {
    const { clearDepartmentData } = this.props;
    clearDepartmentData();
  }

  @autobind
  onOk() {
    const {
      clauseName,
      detailParam,
      value,
      department,
      edit,
      editIndex,
    } = this.state;
    if (!clauseName.value) {
      message.error('请选择条款名称');
      return;
    }
    if (!detailParam.value) {
      message.error('请选择明细参数');
      return;
    }
    if (!value) {
      message.error('请输入值');
      return;
    }
    if (!department.value) {
      message.error('请选择合作部门');
      return;
    }
    const termItem = {
      // 条款名称
      termsDisplayName: clauseName.termVal,
      // 条款 ID
      termsName: clauseName.value,
      // 明细参数名称
      paraDisplayName: detailParam.val,
      // 明细参数 ID
      paraName: detailParam.value,
      // 值
      paraVal: value,
      // 合作部门名称
      divName: department.name,
      // 合作部门 ID
      divIntegrationId: department.value,
    };
    const termData = {
      edit,
      editIndex,
      termItem,
    };
    this.props.onConfirm(termData);
    this.resetData();
  }

  @autobind
  closeModal() {
    this.props.onCloseModal();
    this.resetData();
  }

  // Select Change方法
  @autobind
  handleSelectChange(key, value) {
    if (key === 'clauseName') {
      const { clauseNameList } = this.props;
      const clauseName = _.filter(clauseNameList, v => v.value === value)[0];
      const detailParamList = clauseName.param;
      this.setState({
        ...this.state,
        clauseName,
        detailParamList,
        detailParam: EMPTY_OBJECT,
      });
    } else if (key === 'detailParam') {
      const { detailParamList } = this.state;
      const detailParam = _.filter(detailParamList, v => v.value === value)[0];
      this.setState({
        ...this.state,
        detailParam,
      });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '条款名称',
      value: '$args[1]',
    },
  })
  handleSelectClause(key, value) {
    this.handleSelectChange(key, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '明细参数',
      value: '$args[1]',
    },
  })
  handleSelectDetail(key, value) {
    this.handleSelectChange(key, value);
  }

  // 选择部门
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '合作部门',
      value: '$args[0].name',
    },
  })
  handleSelectDepartment(v) {
    this.setState({
      ...this.state,
      department: v,
    });
  }

  // 筛选部门
  @autobind
  handleSearchDepartment(v) {
    this.props.searchDepartment(v);
  }

  // 修改值
  @autobind
  changeValue(e) {
    this.setState({
      ...this.state,
      value: e.target.value,
    });
  }

  // 重置数据
  @autobind
  resetData() {
    this.setState({
      clauseName: EMPTY_OBJECT,
      detailParam: EMPTY_OBJECT,
      value: '',
      department: EMPTY_OBJECT,
      detailParamList: EMPTY_ARRAY,
    }, () => {
      if (this.selectDivComponent) {
        this.selectDivComponent.clearValue();
      }
    });
  }

  render() {
    const clasueProps = {
      modalKey: 'editFormModal',
      title: '新建合约条款',
      onOk: this.onOk,
      closeModal: this.closeModal,
      visible: this.props.isShow,
      size: 'normal',
      zIndex: 1001,
      wrapClassName: 'addClauseWrap',
    };
    const { clauseNameList, departmentList } = this.props;
    const {
      clauseName,
      detailParamList,
      detailParam,
      value,
      department,
    } = this.state;
    return (
      <div className={styles.addClauseBox}>
        <CommonModal {...clasueProps} >
          <div className={styles.editWrapper}>
            <InfoForm label="条款名称" required>
              <Select
                name="clauseName"
                data={clauseNameList}
                value={clauseName.value || ''}
                onChange={this.handleSelectClause}
              />
            </InfoForm>
            <InfoForm label="明细参数" required>
              <Select
                name="detailParam"
                data={detailParamList}
                value={detailParam.val || ''}
                onChange={this.handleSelectDetail}
              />
            </InfoForm>
            <InfoForm label="值" required>
              <Input
                onChange={this.changeValue}
                value={value}
              />
            </InfoForm>
            <InfoForm label="合作部门" required>
              <AutoComplete
                placeholder="合作部门"
                showObjKey="name"
                defaultSearchValue={department.name || ''}
                searchList={departmentList}
                onSelect={this.handleSelectDepartment}
                onSearch={this.handleSearchDepartment}
                ref={selectDivComponent => this.selectDivComponent = selectDivComponent}
              />
            </InfoForm>
          </div>
        </CommonModal>
      </div>
    );
  }
}
