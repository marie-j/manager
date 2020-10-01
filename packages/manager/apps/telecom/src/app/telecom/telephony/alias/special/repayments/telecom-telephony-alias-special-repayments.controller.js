import get from 'lodash/get';
import partition from 'lodash/partition';
import orderBy from 'lodash/orderBy';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasSpecialRepaymentsCtrl',
  class TelecomTelephonyAliasSpecialRepaymentsCtrl {
    constructor(
      $state,
      $stateParams,
      TucToast,
      OvhApiTelephony,
      TELEPHONY_REPAYMENT_CONSUMPTION,
    ) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.TucToast = TucToast;
      this.OvhApiTelephony = OvhApiTelephony;
      this.TELEPHONY_REPAYMENT_CONSUMPTION = TELEPHONY_REPAYMENT_CONSUMPTION;
    }

    $onInit() {
      this.repayments = [];
      this.repaymentsInfos = {
        availableRepayments: null,
        pendingRepayments: null,
        feesToPay: null,
      };

      this.loading = true;
      this.decimalPrecision = 1000;

      return this.OvhApiTelephony.Service()
        .RepaymentConsumption()
        .Aapi()
        .repayment({
          billingAccount: this.$stateParams.billingAccount,
        })
        .$promise.then((repayments) => {
          this.allRepayments = repayments;
          this.repayments = repayments.slice(
            0,
            this.TELEPHONY_REPAYMENT_CONSUMPTION.limit,
          );

          let otherRepayments = [];
          [this.repaymentsInfos.feesToPay, otherRepayments] = partition(
            this.repayments,
            ({ isFee }) => isFee,
          );

          [
            this.repaymentsInfos.availableRepayments,
            this.repaymentsInfos.pendingRepayments,
          ] = partition(otherRepayments, ({ repayable }) => repayable);
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_special_repayments_get_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    getRepayementsTotalPrice(repayments) {
      return (
        Math.round(
          repayments.reduce((total, repayment) => total + repayment.price, 0) *
            this.decimalPrecision,
        ) / this.decimalPrecision
      );
    }

    onSortChanged($sort) {
      if (
        this.allRepayments.length < this.TELEPHONY_REPAYMENT_CONSUMPTION.limit
      ) {
        return;
      }

      this.repayments = orderBy(
        this.allRepayments,
        [$sort.name],
        [$sort.order],
      ).slice(0, this.TELEPHONY_REPAYMENT_CONSUMPTION.limit);
    }

    onPageChanged($pagination) {
      if (
        this.allRepayments.length < this.TELEPHONY_REPAYMENT_CONSUMPTION.limit
      ) {
        return;
      }

      this.repayments = this.allRepayments.slice(
        $pagination.offset - 1,
        this.TELEPHONY_REPAYMENT_CONSUMPTION.limit,
      );
    }
  },
);
