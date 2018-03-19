angular.module('lyMyAccount.services')
    .factory('depositHepler', ['lyCart', 'lyCart.utility', function(lyCart, lyCartUtility) {
        var factory = {
            getDepositData: getDepositData,
            paymentSelect: paymentSelect,
            paymentSelectMoreInfo: paymentSelectMoreInfo,
            paymentMethodSelected: paymentMethodSelected,
            getCardData: getCardData,
            getPersonalDetailsData: getPersonalDetailsData
        };


        function getCardData(depositAmount, creditcard, memberId, sessionId) {
            lyCart.setProcessor("CreditCard");
            var lastDay = new Date(parseInt(creditcard.expiration.year), parseInt(creditcard.expiration.month), 0).getDate();
            var expirationDate = creditcard.expiration.year + "-" + creditcard.expiration.month + "-" + lastDay;
            var cardHolderName = creditcard.firstName + ' ' + creditcard.lastName;

            var data = {
                MemberId: memberId,
                SessionId: sessionId,
                Amount: depositAmount,
                ProcessorApi: lyCart.getProcessor(),
                CreditCard: {
                    CardType: lyCartUtility.getCreditCardType(creditcard.CreditCardNumber),
                    CreditCardNumber: creditcard.CreditCardNumber,
                    Cvv: creditcard.Cvv,
                    ExpirationDate: expirationDate,
                    CardHolderName: cardHolderName
                }
            };

            return data;
        }

        function getPersonalDetailsData(user) {
            var birthday;
            if (user.DateOfBirth.year || user.DateOfBirth.month || user.DateOfBirth.day) {
                birthday = new Date(Date.UTC(user.DateOfBirth.year, (parseInt(user.DateOfBirth.month) - 1), user.DateOfBirth.day));
            }

            var personalDetails = {
                MemberId: user.MemberId,
                DateOfBirth: birthday,
                Address: user.Address,
                City: user.ZipCode,
                ZipCode: user.ZipCode
            };

            return personalDetails;
        }

        function paymentMethodSelected(methodId, processor) {
            lyCart.setPaymentMethodId(methodId);
            lyCart.setProcessor(processor);
        }

        function paymentSelect(payment) {
            lyCart.setProcessor(payment.processor);
        }

        function paymentSelectMoreInfo($event, phoneOrEmail, amountToDeposit) {
            $event.preventDefault();
            lyCart.setPhoneOrEmail(phoneOrEmail);
        };

        function getDepositData(amountToDeposit, isDeosit, memberId, sessionId) {
            if (!isDeosit) {
                isDeosit = 'false';
            }

            if (typeof(amountToDeposit) === 'undefined') {
                amountToDeposit = 0;
            }

            var paymentMethodId = lyCart.getPaymentMethodId();

            if (typeof(paymentMethodId) === 'undefined' || paymentMethodId == null || paymentMethodId === "") paymentMethodId = 0;

            var data = {
                MemberId: memberId,
                SessionId: sessionId,
                PaymentMethodId: paymentMethodId,
                Amount: amountToDeposit,
                ProcessorApi: lyCart.getProcessor(),
                PhoneOrEmail: lyCart.getPhoneOrEmail()
            };

            return data;
        }

        return factory;
    }]);