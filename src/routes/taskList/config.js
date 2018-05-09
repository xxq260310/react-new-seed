import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

const EXECUTOR = 'executor'; // 执行者视图
const INITIATOR = 'initiator'; // 创造者视图
const CONTROLLER = 'controller'; // 管理者视图

const SYSTEMCODE = '102330'; // 理财平台系统编号

const STATE_ALL_CODE = 'all'; // 任务状态 为所有状态时的对应的code
const STATE_PROCESSING_CODE = '10'; // 审批中编号
const STATE_REJECT_CODE = '20'; // 驳回编号
const STATE_CLOSE_CODE = '30'; // 终止编号
const STATE_WAITEXECUTE_CODE = '40'; // 等待执行编号
const STATE_EXECUTE_CODE = '50'; // 执行中编号
const STATE_RESULTTRACK_CODE = '60'; // 结果跟踪编号
const STATE_FINISHED_CODE = '70'; // 结束编号
const STATE_COMPLETED_CODE = '80'; // 已完成编号
const STATE_COMPLETED_NAME = '已完成'; // 已完成显示文字
const STATUS_MANAGER_VIEW = [
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_FINISHED_CODE,
];
const STATUS_EXECUTOR_VIEW = [
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_FINISHED_CODE,
  STATE_COMPLETED_CODE,
];

const chooseMissionView = [
  {
    show: true,
    label: '我创建的任务',
    value: 'initiator',
  },
  {
    show: true,
    label: '我执行的任务',
    value: 'executor',
  },
  {
    show: true,
    label: '我部门的任务',
    value: 'controller',
  },
];

// 添加服务记录时，入参服务状态完成的编号,
const POSTCOMPLETED_CODE = '30';

const currentDate = moment(new Date());
const beforeCurrentDate60Days = moment(currentDate).subtract(60, 'days');
const afterCurrentDate60Days = moment(currentDate).add(60, 'days');

export default {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  chooseMissionView,
  currentDate,
  beforeCurrentDate60Days,
  afterCurrentDate60Days,
  dateFormat,
  STATE_PROCESSING_CODE,
  STATE_REJECT_CODE,
  STATE_CLOSE_CODE,
  STATE_WAITEXECUTE_CODE,
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_FINISHED_CODE,
  STATE_COMPLETED_CODE,
  STATE_COMPLETED_NAME,
  STATUS_MANAGER_VIEW,
  STATUS_EXECUTOR_VIEW,
  SYSTEMCODE,
  POSTCOMPLETED_CODE,
  STATE_ALL_CODE,
};
