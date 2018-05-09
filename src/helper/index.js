import check from './check';
import data from './data';
import dom from './dom';
import dva from './dva';
import emp from './emp';
import env from './env';
import event from './event';
import number from './number';
import os from './os';
import org from './org';
import permission from './permission';
import regxp from './regexp';
import time from './time';
import url from './url';
import encode from './encode';
import fsp from './fsp';

function getIconType(name) {
  const fullName = name.split('.');
  const suffix = fullName[fullName.length - 1];
  let iconType = '';

  switch (true) {
    case /jpg|jpeg|png/.test(suffix):
      iconType = 'tupian-';
      break;
    case /docx?/.test(suffix):
      iconType = 'word';
      break;
    case /xlsx?/.test(suffix):
      iconType = 'excel2';
      break;
    case /pptx?/.test(suffix):
      iconType = 'ppt';
      break;
    case /mp3|wav/.test(suffix):
      iconType = 'yinpinwenjian';
      break;
    case /mov|mp4|avi|3gp|wmv/.test(suffix):
      iconType = 'shipinwenjian';
      break;
    case /txt/.test(suffix):
      iconType = 'txt';
      break;
    case /csv/.test(suffix):
      iconType = 'CSV';
      break;
    default:
      iconType = 'qitawenjian';
  }
  return iconType;
}

export default {
  check,
  data,
  dom,
  dva,
  emp,
  env,
  event,
  number,
  os,
  org,
  permission,
  regxp,
  time,
  url,
  encode,
  getIconType,
  fsp,
};
