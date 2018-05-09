/**
 * @file config/fspContainer.js
 *  获取orgId
 * @author zhushengnan
 */
import _ from 'lodash';

function getOrgId() {
  let val = '';
  if (_.isEmpty(window.forReactPosition)) {
    val = null;
  } else {
    val = window.forReactPosition.orgId;
  }
  return val;
}
const orgId = getOrgId();

export default orgId;
