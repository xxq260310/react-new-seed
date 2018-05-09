/**
 * @file config/persist.js
 *  redux-persist配置文件
 * @author maoquan(maoquan@htsc.com)
 */

import localForage from 'localforage';

function isLocalStorageSupport() {
  const KEY = 'STORAGE_TEST_KEY';
  try {
    localStorage.setItem(KEY, KEY);
    localStorage.removeItem(KEY);
    return true;
  } catch (e) {
    return false;
  }
}

localForage.config({
  driver: localForage.LOCALSTORAGE,
});

const config = {
  active: false && isLocalStorageSupport(),
  storeConfig: {
    storage: localForage,
  },
  // blacklist: ['routing', 'loading', '@@dva'],
  whitelist: ['global'],
};

export default config;
