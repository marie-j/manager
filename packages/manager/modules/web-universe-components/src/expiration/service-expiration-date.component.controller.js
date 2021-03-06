import get from 'lodash/get';
import isString from 'lodash/isString';
import angular from 'angular';
import 'moment';

import {
  DEFAULT_TARGET,
  RENEW_URL,
  TERMINATION_URL,
} from './service-expiration-date.component.constant';

export default class {
  /* @ngInject */
  constructor($scope, $rootScope, OvhApiMe) {
    $scope.tr = $rootScope.tr;
    this.OvhApiMe = OvhApiMe;
  }

  $onInit() {
    if (!angular.isObject(this.serviceInfos) || !isString(this.serviceName)) {
      throw new Error('serviceExpirationDate: Missing parameter(s)');
    }

    this.loading = true;
    this.subsidiary = null;

    return this.OvhApiMe.v6()
      .get()
      .$promise.then(({ ovhSubsidiary }) => {
        this.subsidiary = ovhSubsidiary;
        this.orderUrl = `${get(
          RENEW_URL,
          ovhSubsidiary,
          RENEW_URL[DEFAULT_TARGET],
        )}${this.serviceInfos.domain}`;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getCancelTerminationUrl() {
    const url = `${get(
      TERMINATION_URL,
      this.subsidiary,
      TERMINATION_URL[DEFAULT_TARGET],
    )}?searchText=${this.serviceName}`;
    if (isString(this.serviceType)) {
      return `${url}&selectedType=${this.serviceType}`;
    }
    return url;
  }

  getOrderUrl() {
    return this.orderUrl;
  }

  getExpirationClass() {
    if (this.isExpired()) {
      return 'expired';
    }

    if (this.isAutoRenew()) {
      return '';
    }

    const diff = moment(this.serviceInfos.expiration).diff(moment(), 'days');

    if (diff >= 7 && diff <= 15) {
      return 'expired15';
    }
    if (diff >= 1 && diff < 7) {
      return 'expired7';
    }
    if (diff <= 0) {
      return 'expired';
    }
    return '';
  }

  isInAutoRenew() {
    return (
      get(this.serviceInfos, 'renew.automatic') ||
      get(this.serviceInfos, 'renew.forced')
    );
  }

  shouldDeleteAtExpiration() {
    return get(this.serviceInfos, 'renew.deleteAtExpiration');
  }

  isExpired() {
    const diff = moment(this.serviceInfos.expiration).diff(moment(), 'days');
    return (
      this.serviceInfos.expiration &&
      (diff <= 0 || this.serviceInfos.status === 'expired')
    );
  }
}
