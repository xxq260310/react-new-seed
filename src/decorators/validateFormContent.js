/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-14 13:26:52
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-22 11:02:42
 * 校验表单内容
 */

import _ from 'lodash';
import { regxp } from '../helper';

export default {};

export const validateFormContent = (target, name, descriptor) => {
  const origin = descriptor.value;

  return {
    ...descriptor,
    value(...args) {
      if (_.isEmpty(args)) {
        return false;
      }
      const {
        executionType,
        taskType,
        isFormError,
        taskName,
        timelyIntervalValue,
        serviceStrategySuggestion,
        serviceStrategyString,
      } = args[0];
      let isShowErrorExcuteType = false;
      let isShowErrorTaskType = false;
      let isShowErrorIntervalValue = false;
      let isShowErrorStrategySuggestion = false;
      let isShowErrorTaskName = false;
      if (_.isEmpty(executionType) || executionType === '请选择' || executionType === '暂无数据') {
        this.setState({
          isShowErrorExcuteType: true,
        });
        isShowErrorExcuteType = true;
      }
      if (_.isEmpty(taskType) || taskType === '请选择' || taskType === '暂无数据') {
        this.setState({
          isShowErrorTaskType: true,
        });
        isShowErrorTaskType = true;
      }
      if (!regxp.positiveInteger.test(timelyIntervalValue)
        || Number(timelyIntervalValue) <= 0
        || Number(timelyIntervalValue) > 365) {
        this.setState({
          isShowErrorIntervalValue: true,
        });
        isShowErrorIntervalValue = true;
      }
      if (_.isEmpty(taskName)
        || taskName.length > 30) {
        this.setState({
          isShowErrorTaskName: true,
        });
        isShowErrorTaskName = true;
      }
      if (_.isEmpty(serviceStrategyString)
        || serviceStrategySuggestion.length > 1000) {
        this.setState({
          isShowErrorStrategySuggestion: true,
        });
        isShowErrorStrategySuggestion = true;
      }
      if (isFormError
        || isShowErrorIntervalValue
        || isShowErrorStrategySuggestion
        || isShowErrorTaskName
        || isShowErrorExcuteType
        || isShowErrorTaskType) {
        return false;
      }
      // 校验通过，去掉错误提示
      this.setState({
        isShowErrorTaskSubType: false,
        isShowErrorTaskType: false,
        isShowErrorExcuteType: false,
        isShowErrorIntervalValue: false,
        isShowErrorStrategySuggestion: false,
        isShowErrorTaskName: false,
      });
      origin.apply(this, args);
      return true;
    },
  };
};
