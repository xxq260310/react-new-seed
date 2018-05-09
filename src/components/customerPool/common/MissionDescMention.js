
import _ from 'lodash';

export default function replaceMissionDesc(templetDesc = '', replacement = '') {
  // 替换瞄准镜标签的任务提示正则表达式
  const missionDescRegexp1 = /该客户筛选自\$瞄准镜标签#[a-zA-Z0-9]+#/;
  // 替换普通标签的任务提示正则表达式
  const missionDescRegexp2 = /该客户筛选自[a-zA-Z0-9]+,/;

  // 将选择的标签信息塞入任务提示，如果任务提示之前存在某一个标签的信息，那么只替换这个标签的位置，
  // 否则，则直接insert
  let newMissionDesc = templetDesc;
  if (newMissionDesc) {
    if (missionDescRegexp1.test(newMissionDesc)) {
      // 来自瞄准镜
      newMissionDesc = _.replace(newMissionDesc, missionDescRegexp1, replacement);
    } else if (missionDescRegexp2.test(newMissionDesc)) {
      // 来自普通标签
      newMissionDesc = _.replace(newMissionDesc, missionDescRegexp2, replacement);
    } else {
      // 直接附加
      newMissionDesc = `${newMissionDesc}${replacement}`;
    }
  }

  return newMissionDesc;
}
