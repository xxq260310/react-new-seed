/**
 * @file utils/request
 * @author maoquan(maoquan@htsc.com)
 */

import 'whatwg-fetch';
import _ from 'lodash';

import { request as config, excludeCode, constants } from '../config';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 * @param  {object} options 针对请求在后期需要做的特殊处理
 * options含有属性
 * ignoreCatch boolen， 默认为false，表示需要经过全局Catch，true表示忽略全局捕获
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response, options) {
  const { ignoreCatch = false } = options;
  return response.json().then(
    (res) => {
      // 神策的响应是succeed: true
      const { code, msg, succeed } = res;
      const existExclude = _.findIndex(excludeCode, o => o.code === code) > -1;
      if (!existExclude && !succeed && !ignoreCatch) {
        throw new Error(`${code}${config.ERROR_SEPARATOR}${msg}`);
      }
      return res;
    },
  );
}

function parseText(response) {
  return response.text();
}
/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  console.log(error);
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
const request = (url, options) => {
  const timeoutMessage = constants.inHTSCDomain ? '' : ` - ${url}`;
  return Promise.race([
    fetch(url, { credentials: 'include', ...options })
      .then(checkStatus)
      .then(response => parseJSON(response, options)),
    new Promise(
      (rosolve, reject) => {// eslint-disable-line
        setTimeout(
          () => reject(`请求超时${timeoutMessage}`),
          options.timeout || config.timeout,
        );
      },
    ),
  ]);
};

const myHeaders = new Headers({
  'Content-Type': 'text/html',
});

const fspRequest = (url, options) => (
  Promise.race([
    fetch(url, { credentials: 'include', ...options, myHeaders })
      .then(parseText),
    new Promise(
      (rosolve, reject) => {// eslint-disable-line
        setTimeout(
          () => reject('请求超时'),
          options.timeout || config.timeout,
        );
      },
    ),
  ])
);

/**
 * 发送日志专用, 不考虑超时报错
 */
const logRequest = (url, options) => (
  fetch(url, { credentials: 'include', ...options })
    .then(checkStatus)
);

export default {
  request,
  fspRequest,
  logRequest,
};
