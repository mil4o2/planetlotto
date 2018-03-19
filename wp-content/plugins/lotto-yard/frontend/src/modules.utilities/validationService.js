'use strict'

angular.module('lyApp.utilities')
    .factory('validationService', [function() {
        var service = {
            isValidQuickpickData: isValidQuickpickData,
            validateMinMaxLenght: validateMinMaxLenght,
            validateExpirationDate: validateExpirationDate
        };

        function isValidQuickpickData(count, draws, subscription) {
            if (!isNumeric(draws)) {
                return false;
            }

            if (!isNumeric(count)) {
                return false;
            }

            if (!isNumeric(subscription)) {
                return false;
            }

            var subscriptionValue = +subscription;

            if (subscriptionValue != 0 && subscriptionValue != 1) {
                return false;
            }

            return true;
        }

        function validateMinMaxLenght(model, minLenght, maxLenght) {
            maxLenght = maxLenght ? maxLenght : Number.MAX_SAFE_INTEGER;
            if (!model || model.length < minLenght || model.length > maxLenght) {
                return false;

            }

            return true;
        }

        function validateExpirationDate(month, year) {
            var lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            var expirationDate = year + "-" + month + "-" + lastDay;

            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var creditCardDate = new Date(expirationDate);
            creditCardDate.setHours(0, 0, 0, 0);

            if (creditCardDate == "Invalid Date" || creditCardDate < today) {
                return false;
            }

            return true;
        };

        function isNumeric(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }

        return service
    }]);