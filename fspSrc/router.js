/**
* @file fspSrc/routes.js
* 前端路由配置文件
* @author zhufeiyang
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  routerRedux,
  Redirect,
} from 'dva/router';

import App from './layouts/Main';
import Empty from '../src/routes/empty/Home';
import FeedBack from '../src/routes/feedback/NewHome';
import CommissionHome from '../src/routes/commission/Home';
import CommissionChangeHome from '../src/routes/commissionChange/Home';
import TemplModal from '../src/routes/templeModal/Home';
import BoardManageHome from '../src/routes/boardManage/Home';
import BoardEditHome from '../src/routes/boardEdit/Home';
import ReportHome from '../src/routes/reports/Home';
import PreviewReport from '../src/routes/reports/PreviewReport';
import HistoryHome from '../src/routes/history/Home';
import CustomerPoolHome from '../src/routes/customerPool/Home';
import ToDo from '../src/routes/customerPool/ToDo';
import CustomerList from '../src/routes/customerPool/CustomerList';
import CustomerGroup from '../src/routes/customerPool/CustomerGroup';
import CreateTask from '../src/routes/customerPool/CreateTask';
import CustomerGroupManage from '../src/routes/customerPool/CustomerGroupManage';
import ViewpointList from '../src/routes/customerPool/ViewpointList';
import ViewpointDetail from '../src/routes/customerPool/ViewpointDetail';
import ServiceLog from '../src/routes/customerPool/ServiceLog';
import TaskFlow from '../src/routes/customerPool/TaskFlow';
import ChannelsTypeProtocol from '../src/routes/channelsTypeProtocol/Home';
import PermissonHome from '../src/routes/permission/Home';
import PermissonEdit from '../src/routes/permission/Edit';
import Contract from '../src/routes/contract/Home';
import Form from '../src/routes/contract/Form';
import ChannelsTypeProtocolEdit from '../src/routes/channelsTypeProtocol/Edit';
import TaskListHome from '../src/routes/taskList/Home';
import Demote from '../src/routes/demote/Home';
import FilialeCustTransfer from '../src/routes/filialeCustTransfer/Home';
import RelationHome from '../src/routes/relation/Home';
import TaskFeedback from '../src/routes/taskFeedback/Home';
import FSPComponent from './routes/fspPage/FSPComponent';
import PreSaleQuery from '../src/routes/preSaleQuery/Home';

const { ConnectedRouter } = routerRedux;

// 路由Collection
const routes = [
  /*  // 任务中心
   { path: '/task/fspmotTask', component: HtmlComponent },
   { path: '/task/fspselfbuildTask', component: HtmlComponent },
   { path: '/task/fspmotService', component: HtmlComponent },
   { path: '/task/fspcustomerHistory', component: HtmlComponent },
   { path: '/task/fspibreport', component: HtmlComponent },
   // 客户中心
   { path: '/customerCenter/fsptest', component: HtmlComponent },
   { path: '/customerCenter/fspcustomerManage', component: HtmlComponent },
   { path: '/customerCenter/fspinvestContract', component: HtmlComponent },
   { path: '/customerCenter/customerGroupManage', component: CustomerGroupManage },
   { path: '/customerCenter/fspcustomerDetail', component: HtmlComponent },
   // 资产配置
   { path: '/asset/fspmainTab', component: HtmlComponent },
   { path: '/asset/fspimplementation', component: HtmlComponent },
   // 产品中心
   { path: '/appCenter/fspproductBase', component: IframeComponent },
   { path: '/appCenter/fspcalendar', component: IframeComponent },
   // 消息中心
   { path: '/messageCenter', component: HtmlComponent },
   // 知识库
   { path: '/knowledges/fspinitmain', component: HtmlComponent },
   // 客户投诉
   { path: '/custcomplaint/fsplistContent', component: HtmlComponent },
   { path: '/custcomplaint/fsppending', component: HtmlComponent },
   { path: '/custcomplaint/fspall', component: HtmlComponent },
   { path: '/custcomplaint/fspnew', component: HtmlComponent },
   { path: '/custcomplaint/fspreport', component: HtmlComponent },
    // 资金业务
    { path: '/bizapply/finance/fspexcessCache', component: HtmlComponent },
    { path: '/bizapply/finance/fspappointDrawTab', component: HtmlComponent },
    { path: '/bizapply/finance/fspappointBook', component: HtmlComponent },
   // 适当性申请
   { path: '/bizapply/priReuqest/fsppriProd', component: HtmlComponent },
   { path: '/bizapply/priReuqest/fspappropriate', component: HtmlComponent },
   // 通道类业务
   { path: '/bizapply/tunnel/fsppbbiz', component: HtmlComponent },
   // 信用业务
   { path: '/bizapply/credit/fsppostApplyManage', component: IframeComponent },
   { path: '/bizapply/credit/fspcreditRequest', component: IframeComponent },
   { path: '/bizapply/credit/fspchangeRequest', component: IframeComponent },
   { path: '/bizapply/credit/fspthought', component: IframeComponent },
   { path: '/bizapply/credit/fspprojectInvest', component: IframeComponent },
   { path: '/bizapply/credit/fspprojectScore', component: IframeComponent },
   { path: '/bizapply/credit/fspriskFollow', component: IframeComponent },
   { path: '/bizapply/credit/fspinitialTrade', component: IframeComponent },
   { path: '/bizapply/credit/fspfollowingSearch', component: IframeComponent },
   // 期权业务
   { path: '/bizapply/option/fspoptionfund', component: HtmlComponent },
   { path: '/bizapply/option/fspoptionResearch', component: HtmlComponent }, */
  // 客户分组管理
  { path: '/customerCenter/customerGroupManage', component: CustomerGroupManage },
  { path: '/customerCenter/customerGroupManage/createTask', component: CreateTask },
  // 绩效视图
  { path: '/report', component: ReportHome },
  // 看板管理
  { path: '/boardManage', component: BoardManageHome },
  // 看板编辑
  { path: '/boardEdit', component: BoardEditHome },
  // 预览视图
  { path: '/preview', component: PreviewReport },
  // 历史记录
  { path: '/history', component: HistoryHome },
  // 反馈管理
  { path: '/feedback', component: FeedBack },
  // 合约佣金
  { path: '/commission', component: CommissionHome },
  // 合约调整
  { path: '/commissionChange', component: CommissionChangeHome },
  // 模态框页面
  { path: '/modal', component: TemplModal },
  { path: '/preSaleQuery', component: PreSaleQuery },
  // 合约认证
  {
    path: '/bizapply/permission',
    component: PermissonHome,
    children: [
      { path: '/edit', component: PermissonEdit },
    ],
  },
  // 自建任务管理
  { path: '/taskCenter/selfbuildTask', component: TaskListHome },
  { path: '/taskCenter/selfbuildTask/createTask', component: CreateTask },
  // 合约详情
  {
    path: '/bizapply/contract',
    component: Contract,
    children: [
      { path: '/form', component: Form },
    ],
  },
  // 协议管理
  {
    path: '/bizapply/channelsTypeProtocol',
    component: ChannelsTypeProtocol,
    children: [
      { path: '/edit', component: ChannelsTypeProtocolEdit },
    ],
  },
  // 用户池
  {
    path: '/customerPool',
    component: CustomerPoolHome,
    children: [
      { path: '/viewpointDetail', component: ViewpointDetail },
      { path: '/viewpointList', component: ViewpointList },
      { path: '/todo', component: ToDo },
      { path: '/list', component: CustomerList },
      { path: '/customerGroup', component: CustomerGroup },
      { path: '/createTask', component: CreateTask },
      { path: '/serviceLog', component: ServiceLog },
      { path: '/taskFlow', component: TaskFlow },
    ],
  },
  {
    path: '/demote',
    component: Demote,
  },
  {
    path: '/filialeCustTransfer',
    component: FilialeCustTransfer,
  },
  {
    path: '/taskFeedback',
    component: TaskFeedback,
  },
  { path: '/relation', component: RelationHome },
  // 不可匹配的路由会显示空白页
  { path: '/empty', component: Empty },
];

// 递归创建路由
function recursiveRouter(routeArray, parentPath = '') {
  return routeArray.map(({ path, component, children }) => {
    const recursivePath = parentPath + path;
    if (!children) {
      return (<Route exact key={recursivePath} path={recursivePath} component={component} />);
    }
    return (
      <Switch key={recursivePath}>
        <Route exact path={recursivePath} component={component} />
        {recursiveRouter(children, recursivePath)}
      </Switch>
    );
  });
}

// 路由器
const Routers = ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <div>
        <Route exact path="/" render={() => (<Redirect to="/customerPool" />)} />
        <Route exact path="/invest" render={() => (<Redirect to="/report" />)} />
        {recursiveRouter(routes)}
        <Route path="/fsp/(.*)" component={FSPComponent} />
        <Route path="*" render={() => (<Redirect to="/empty" />)} />
      </div>
    </App>
  </ConnectedRouter>
);

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default Routers;
