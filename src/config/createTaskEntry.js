export default {};

// returnTaskFromToDoList是待办，审批驳回之后，编辑自建任务信息界面
// returnTaskFromTaskList是创建者视图，审批驳回之后，编辑自建任务信息界面
// custGroupList是客户分组
// pieEntry是管理者视图的饼图
// progressEntry是管理者视图的进度条
// custGroupList, 客户分组管理

export const RETURN_TASK_FROM_TODOLIST = 'returnTaskFromToDoList';

export const RETURN_TASK_FROM_TASKLIST = 'returnTaskFromTaskList';

export const CUST_GROUP_LIST = 'custGroupList';

export const PIE_ENTRY = 'pieEntry';

export const PROGRESS_ENTRY = 'progressEntry';

export const createTaskEntrySource = [
  RETURN_TASK_FROM_TODOLIST,
  RETURN_TASK_FROM_TASKLIST,
  CUST_GROUP_LIST,
  PIE_ENTRY,
  PROGRESS_ENTRY,
];

export const returnTaskEntrySource = [
  RETURN_TASK_FROM_TODOLIST,
  RETURN_TASK_FROM_TASKLIST,
];
