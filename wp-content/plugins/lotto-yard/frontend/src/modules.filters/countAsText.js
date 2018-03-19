'use strict';

angular.module('lyCart.filters')
    .filter('countAsText', ['lyAppTranslationService', function(lyAppTranslationService) {
        return function(item) {
            var translationObject = {};
            lyAppTranslationService.getTranslations(translationObject);
            switch (item.getProductType()) {
                case 3:
                case 15:
                    return item.getNumberOfLinesOrShares() == 1 ? translationObject.translation["Share"] : translationObject.translation["Shares"];
                case 14:
                    return translationObject.translation["QTY"];

                default:
                    return item.getNumberOfLinesOrShares() == 1 ? translationObject.translation["Line"] : translationObject.translation["Lines"];
            }
        }
    }]);