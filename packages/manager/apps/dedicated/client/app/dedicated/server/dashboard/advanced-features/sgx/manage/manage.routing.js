import DedicatedServerDashboardSgxManage from './manage.service';
import { STATUS } from '../sgx.constants';
import { TYPES } from './confirmation/confirmation.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.sgx.manage', {
    params: {
      goBack: null,
    },
    url: '/manage',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerDashboardSgxManage',
      },
    },
    resolve: {
      backButtonText: /* @ngInject */ ($transition$) => {
        if ($transition$.params().goBack) {
          return 'dedicated_server_dashboard_advanced_features_sgx_manage_back_button_presentation';
        }

        return 'dedicated_server_dashboard_advanced_features_sgx_manage_back_button_dashboard';
      },
      initialActivationMode: /* @ngInject */ (biosSettingsSgx) =>
        biosSettingsSgx.status,
      activationModeValues: /* @ngInject */ (schema) =>
        DedicatedServerDashboardSgxManage.buildActivationMode(schema),
      biosSettingsSgx: /* @ngInject */ ($http, serverName) =>
        $http
          .get(`/dedicated/server/${serverName}/biosSettings/sgx`)
          .then((sgx) => sgx.data),
      initialPrmrr: /* @ngInject */ (biosSettingsSgx) => biosSettingsSgx.prmrr,
      prmrrValues: /* @ngInject */ ($http, serverName) =>
        $http
          .get(`/dedicated/server/${serverName}/biosSettings`)
          .then((biosSettings) =>
            DedicatedServerDashboardSgxManage.buildPrmrr(
              biosSettings.data.supportedSettings.sgxOptions.prmrr,
            ),
          ),

      goBack: /* @ngInject */ ($state, $transition$) => (
        params = {},
        transitionParams,
      ) =>
        ($transition$.params().goBack &&
          $transition$.params().goBack(params, transitionParams)) ||
        $state.go('app.dedicated.server.dashboard', params, transitionParams),
      goToConfirm: /* @ngInject */ ($state) => (activationMode, prmrr) =>
        $state.go('app.dedicated.server.dashboard.sgx.manage.confirmation', {
          activationMode,
          prmrr,
          type:
            activationMode === STATUS.DISABLED
              ? TYPES.DEACTIVATION
              : TYPES.ACTIVATION,
        }),
    },
  });
};
