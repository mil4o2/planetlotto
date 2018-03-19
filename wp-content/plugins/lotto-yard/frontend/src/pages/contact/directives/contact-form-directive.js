'use strict';

angular.module('lyApp.directives')
    .directive('lyContactForm', [
        'lyConstants',
        'lyAppHttpService',
        'lyMyAccountUserService',
        function(
            lyConstants,
            lyAppHttpService,
            lyMyAccountUserService
        ) {
            return {
                restrict: 'A',
                scope: true,
                templateUrl: lyConstants.partialPath + 'contact/templates/contact-form-template.html',
                controller: ['$scope', function($scope) {
                    function calculateSignature(stringToSign, privateKey) {
                        var hash = CryptoJS.HmacSHA1(stringToSign, privateKey);
                        var base64 = hash.toString(CryptoJS.enc.Base64);
                        return encodeURIComponent(base64);
                    }

                    $scope.countryData = jQuery.fn.intlTelInput.getCountryData();
                    $scope.contactModel = { fullname: "", email: "", country: "", phone: "", subject: "", message: "" };

                    //$scope.contactForm = $scope.$parent.acf.contact_form;
                    $scope.contactForm = $scope.$parent.$resolve.pageContent.data[0].acf.contact_form;
                    $scope.fields = $scope.contactForm.fields;
                    
                    $scope.country = {};

                    if (lyConstants.countryCode) {
                        $scope.country.CountryCode = getUserCounty($scope.countryData, lyConstants.countryCode.toLowerCase());

                    } else {
                        lyMyAccountUserService.getCountryCode().then(function(CountryCode) {
                            lyConstants.countryCode = CountryCode;
                            $scope.country.CountryCode = getUserCounty($scope.countryData, lyConstants.countryCode.toLowerCase());
                        })
                    }

                    $scope.submitContactUs = function(contactModel) {
                        $scope.contactModel.country = $scope.country.CountryCode.name;
                        var entries = loadEntries(contactModel);
                        var postUrl = getRequestUrl("POST", 'forms/' + $scope.contactForm.id + '/entries');

                        lyAppHttpService.postDataToCMS(postUrl, entries)
                            .then(function(resp) {
                                $scope.successMessage = true;
                                $scope.contactModel = { fullname: "", email: "", country: "", phone: "", subject: "", message: "" };
                                $scope.contactUsForm.$setPristine();
                                console.log("The entity was added successfully ");
                            }, function(error) {
                                console.log("There was an error while sending the entity to the gravity form");
                            });
                    }

                    $scope.focusInput = function() {
                        $scope.successMessage = false;
                    }

                    function getUserCounty(countryData, currentCode) {
                        return countryData.filter(function(country) {
                            return country.iso2 == currentCode.toLowerCase();
                        })[0];
                    }

                    function getUserCounty(countryData, currentCode) {
                        return countryData.filter(function(country) {
                            return country.iso2 == currentCode.toLowerCase();
                        })[0];
                    }

                    function getRequestUrl(method, route) {
                        var date = new Date,
                            expiration = 3600, // 1 hour
                            unixtime = parseInt(date.getTime() / 1000),
                            future_unixtime = unixtime + expiration,
                            publicKey = lyConstants.gravityFormsKeys.publicKey,
                            privateKey = lyConstants.gravityFormsKeys.privateKey,
                            stringToSign = publicKey + ":" + method + ":" + route + ":" + future_unixtime,
                            signature = calculateSignature(stringToSign, privateKey),
                            requestUrl = lyConstants.wpApiDefinitions.getGravityForms + route + '?api_key=' + publicKey + '&signature=' + signature + '&expires=' + future_unixtime;
                        return requestUrl;
                    }

                    function loadEntries(contactModel) {
                        var entrie = {};
                        if (!Array.isArray($scope.fields)) {
                            return [entrie];
                        }

                        angular.forEach($scope.fields, function(value, key) {
                            entrie[value.id] = contactModel[value.label.replace(' ', '').toLowerCase()];
                        });

                        return [entrie];
                    }
                }]
            }
        }
    ]);
