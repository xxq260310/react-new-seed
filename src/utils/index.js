import apiCreator from './apiCreator';
import request from './request';
import sagaEffects from './sagaEffects';
import {
  dispatchTabPane,
  openRctTab,
  openFspTab,
  openInTab,
  closeRctTab,
  closeFspTab,
  removeTab,
  navToTab,
  navTo,
  linkTo,
  saveTabUrl,
} from './controlPane';

import initFspMethod from './initFspMethod';
import fspGlobal from './fspGlobal';

export default {
  apiCreator,
  request,
  sagaEffects,
  initFspMethod,
  fspGlobal,
  dispatchTabPane,
  openRctTab,
  openFspTab,
  closeRctTab,
  closeFspTab,
  removeTab,
  openInTab,
  navToTab,
  navTo,
  linkTo,
  saveTabUrl,
};
