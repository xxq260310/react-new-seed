/*
 * @Description: 客户反馈选项维护
 * @Author: LiuJianShu
 * @Date: 2017-12-25 13:59:04
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-03-23 20:35:29
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Collapse, Icon, message } from 'antd';

import Confirm from '../../../components/common/Confirm';
import Button from '../../../components/common/Button';
import EditInput from '../../../components/common/editInput';
import Pagination from '../../common/Pagination';
import styles from './optionsMaintain.less';
import logable from '../../../decorators/logable';

const Panel = Collapse.Panel;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class OptionsMaintain extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    // 查询客户反馈列表
    queryFeedbackList: PropTypes.func.isRequired,
    feedbackData: PropTypes.object.isRequired,
    // 删除客户反馈选项
    delFeedback: PropTypes.func.isRequired,
    // 增加客户反馈选项
    addFeedback: PropTypes.func.isRequired,
    // 编辑客户反馈选项
    modifyFeedback: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 折叠面板当前展开的id
      collapseActiveKey: '',
      addParentClass: false,
      beAddedParentId: '',
    };
  }

  // 同步页码到url
  @autobind
  syncPageDataToUrl() {
    const {
      feedbackData,
      replace,
      location: {
        query,
        pathname,
      },
    } = this.props;
    const feedbackDataPage = feedbackData.page || EMPTY_OBJECT;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: feedbackDataPage.pageNum,
      },
    });
  }

  // 查询客户反馈列表
  @autobind
  queryFeedbackList(pageNum = 1, pageSize = 20) {
    const {
      queryFeedbackList,
    } = this.props;
    queryFeedbackList('', pageNum, pageSize).then(() => {
      this.syncPageDataToUrl();
    });
  }

  // 编辑客户反馈
  @autobind
  editCallback(value, id) {
    // 调用接口
    const {
      modifyFeedback,
      location: {
        query: {
          pageNum,
        },
      },
    } = this.props;
    if (_.isEmpty(value)) {
      message.error('名称不能为空');
      return;
    }
    Confirm({
      content: '修改的反馈信息实时生效，会影响到已反馈的服务记录，是否确认修改？',
      onOk: () => {
        modifyFeedback({
          id,
          name: value,
        }).then(() => {
          this.queryFeedbackList(pageNum);
        });
      },
    });
  }

  // 删除客户反馈
  @autobind
  @logable({ type: 'Click', payload: { name: '删除$args[0]' } })
  deleteConfirm(parentId = '', childId = '', e) {
    const {
      feedbackData,
      delFeedback,
      location: {
        query: {
          pageNum,
        },
      },
    } = this.props;
    const { feedbackList } = feedbackData;
    if (childId) {
      const parentNode = _.find(feedbackList, v => v.id === parentId);
      if (parentNode.childList.length < 2) {
        message.error('必须保留一个子类');
        return;
      }
    }
    if (e) {
      e.stopPropagation();
    }
    Confirm({
      content: '删除的信息在系统中实时生效，会影响到已关联的任务，确认要删除吗？',
      onOk: () => {
        delFeedback({
          id: childId || parentId,
        }).then(() => {
          this.queryFeedbackList(pageNum);
        });
      },
    });
  }

  // 显示对应的添加子类输入框
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '+新增' } })
  showAddChildBox(id) {
    this.setState({
      beAddedParentId: id,
    });
  }

  // 隐藏添加子类输入框
  @autobind
  handleCancelAddChild() {
    this.setState({
      beAddedParentId: '',
    });
  }

  // 添加类
  @autobind
  handleAddClass(name, parentId) {
    const {
      addFeedback,
      location: {
        query: {
          pageNum,
        },
      },
    } = this.props;
    addFeedback({
      parentId,
      name,
    }).then(() => {
      this.queryFeedbackList(pageNum);
      this.setState({
        beAddedParentId: '',
        addParentClass: false,
      });
    });
  }

  // 点击添加父类按钮
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '+反馈类型' } })
  parentAddHandle() {
    this.setState({
      addParentClass: true,
    });
  }

  // 取消添加父类
  @autobind
  handleCancelAddParent() {
    this.setState({
      addParentClass: false,
    });
  }

  // 切换折叠面板
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '切换折叠面板' } })
  handleChangeCollapse(collapseActiveKey) {
    this.setState({
      collapseActiveKey,
    });
  }

  // 翻页
  @autobind
  handlePageChange(pageNum) {
    this.queryFeedbackList(pageNum);
  }

  render() {
    const {
      feedbackData,
    } = this.props;
    const {
      collapseActiveKey,
      beAddedParentId,
      addParentClass,
    } = this.state;
    const feedbackDataPage = feedbackData.page || EMPTY_OBJECT;
    const feedbackList = feedbackData.feedbackList || EMPTY_LIST;
    const collapseProps = {
      activeKey: collapseActiveKey,
      onChange: this.handleChangeCollapse,
      accordion: true,
    };
    const pagination = {
      current: Number(feedbackDataPage.pageNum),
      total: Number(feedbackDataPage.totalCount),
      pageSize: Number(feedbackDataPage.pageSize),
      onChange: this.handlePageChange,
    };
    return (
      <div className={styles.optionsMaintain}>
        <div className={styles.parentAddBtn}>
          <Button type="primary" onClick={this.parentAddHandle}>
            +反馈类型
          </Button>
        </div>
        <h2 className={styles.title}>请在此维护客户反馈字典，客户反馈由两级内容组成，即反馈大类和反馈子类。</h2>
        <div className={styles.addParentClassBox}>
          {
            addParentClass ?
              <EditInput
                edit
                editCallback={this.handleAddClass}
                onCancel={this.handleCancelAddParent}
              />
              :
              null
          }
        </div>
        <Collapse {...collapseProps}>
          {
            feedbackList.map((item, index) => {
              const header = (<div className={styles.header}>
                <EditInput
                  value={item.name}
                  data={feedbackList}
                  idx={index}
                  id={String(item.id)}
                  edit={item.edit}
                  editCallback={this.editCallback}
                />
                <div className={styles.lengthDiv} >
                  {item.length || 0}项
                  <Icon type="up" />
                  <Icon type="down" />
                </div>
                <div>
                  <Icon
                    type="delete"
                    title="删除"
                    onClick={e => this.deleteConfirm(item.id, '', e)}
                  />
                </div>
              </div>);
              return (<Panel header={header} key={`${index + 1}`}>
                <ul>
                  {
                    (item.childList || EMPTY_LIST).map((child) => {
                      const btnGroup = (
                        <Icon
                          type="delete"
                          title="删除"
                          onClick={() => this.deleteConfirm(item.id, child.id)}
                        />
                      );
                      return (
                        <li key={child.id}>
                          <EditInput
                            value={child.name}
                            id={String(child.id)}
                            btnGroup={btnGroup}
                            edit={child.edit}
                            editCallback={this.editCallback}
                          />
                        </li>
                      );
                    })
                  }
                  {
                    beAddedParentId === item.id ?
                      <li>
                        <EditInput
                          edit
                          id={String(item.id)}
                          editCallback={this.handleAddClass}
                          onCancel={this.handleCancelAddChild}
                        />
                      </li>
                      :
                      null
                  }
                  <li>
                    <Button onClick={() => this.showAddChildBox(item.id)}>
                      +
                      新增
                    </Button>
                  </li>
                </ul>
              </Panel>);
            })
          }
        </Collapse>
        <div className={styles.pageBox}>
          <Pagination {...pagination} />
        </div>
      </div>
    );
  }
}
