import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './billing-type.component';

const moduleName = 'ovhManagerPciProjectKubernetesBillingType';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('billingType', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
