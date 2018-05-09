/**
 * @file utils/uploadRequest.js
 * @author yagnquajian
 */
import _ from 'lodash';

function getError(option, xhr) {
  const msg = `cannot post ${option.action} ${xhr.status}'`;
  const err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = option.action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
// }
export default function uploadRequest(option) {
  const xhr = new XMLHttpRequest();

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      option.onProgress(e);
    };
  }

  const formData = new FormData();
  if (option.data) {
    Object.keys(option.data).map(key => (
      formData.append(key, option.data[key])
    ));
  }

  formData.append(option.filename, option.file);
  xhr.onerror = function error(e) {
    option.onError(e);
  };

  xhr.onload = () => {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    const { response } = xhr;
    let code = 0;
    if (!_.isEmpty(response)) {
      code = JSON.parse(response).code || 400;
    }
    if (xhr.status < 200 || xhr.status >= 300 || code !== '0') {
      return option.onError(getError(option, xhr), getBody(xhr));
    }

    option.onSuccess(getBody(xhr));
    return true;
  };

  xhr.open('post', option.action, true);

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  // 火狐浏览器需要单独设置
  headers.Accept = '*/*';

  /* eslint-disable */
  for (const h in headers) {
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  /* eslint-enable */

  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
}
