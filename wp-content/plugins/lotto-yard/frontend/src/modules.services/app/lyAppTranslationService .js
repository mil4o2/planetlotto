 'use strict';

 angular.module('lyApp.services')
     .service('lyAppTranslationService', [
         'lyConstants',
         function(
             lyConstants
         ) {
             this.getTranslations = function($scope) {
                 $scope.translation = lyConstants.translationObject;
             };
             this.getErrorMessages = function() {
                 return lyConstants.errorMessagesObject;
             };
             this.getErrorMessage = function(respMsg) {
                 var msg;
                 if (Array.isArray(respMsg)) {
                     msg = this.getErrorMessageByKey(respMsg[0].ErrorMessage);
                 } else {

                     msg = this.getErrorMessageByKey(respMsg);
                 }

                 return msg;
             }
             this.getErrorMessageByKey = function(key) {
                 var msg;
                 if (lyConstants.errorMessagesObject[key] !== undefined) {
                     msg = lyConstants.errorMessagesObject[key]
                 } else {
                     msg = lyConstants.errorMessagesObject['default']
                 }

                 return msg;
             }
         }
     ])