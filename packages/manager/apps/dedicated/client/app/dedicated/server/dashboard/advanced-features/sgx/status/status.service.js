import includes from 'lodash/includes';
import values from 'lodash/values';

import { STATUS } from '../sgx.constants';

export default class {
  static isSgxStatusValid(value) {
    const isValidValue = includes(values(STATUS), value);

    return !isValidValue && !STATUS[value];
  }

  static buildStatusClassName({ isRunning, status }) {
    if (isRunning) {
      return 'oui-status_warning';
    }

    if (status === STATUS.DISABLED) {
      return 'oui-status_error';
    }

    return 'oui-status_success';
  }

  static buildStatusTextId({ isRunning, status }) {
    if (isRunning) {
      return 'dedicated_server_dashboard_advanced_features_sgx_status_isRunning';
    }

    switch (status) {
      case STATUS.DISABLED:
        return 'dedicated_server_dashboard_advanced_features_sgx_status_disabled';

      case STATUS.ENABLED:
        return 'dedicated_server_dashboard_advanced_features_sgx_status_enabled';

      case STATUS.SOFTWARE_CONTROLLED:
        return 'dedicated_server_dashboard_advanced_features_sgx_status_softwareControlled';

      default:
        throw new Error(
          `The input value ${status} should be of type SgxStatus`,
        );
    }
  }
}
