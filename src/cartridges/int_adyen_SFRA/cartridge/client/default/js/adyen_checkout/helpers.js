const store = require('../../../../store');

function assignPaymentMethodValue() {
  const adyenPaymentMethod = document.querySelector('#adyenPaymentMethodName');
  adyenPaymentMethod.value = document.querySelector(
    `#lb_${store.selectedMethod}`,
  ).innerHTML;
}

/**
 * Makes an ajax call to the controller function PaymentFromComponent.
 * Used by certain payment methods like paypal
 */
function paymentFromComponent(data, component) {
  $.ajax({
    url: 'Adyen-PaymentFromComponent',
    type: 'post',
    data: {
      data: JSON.stringify(data),
      paymentMethod: document.querySelector('#adyenPaymentMethodName').value,
    },
    success(data) {
      if (data.fullResponse?.action) {
        component.handleAction(data.fullResponse.action);
      } else {
        document.querySelector('#showConfirmationForm').submit();
      }
    },
  }).fail(() => {});
}

function resetPaymentMethod() {
  $('#requiredBrandCode').hide();
  $('#selectedIssuer').val('');
  $('#adyenIssuerName').val('');
  $('#dateOfBirth').val('');
  $('#telephoneNumber').val('');
  $('#gender').val('');
  $('#bankAccountOwnerName').val('');
  $('#bankAccountNumber').val('');
  $('#bankLocationId').val('');
  $('.additionalFields').hide();
}

/**
 * Changes the "display" attribute of the selected method from hidden to visible
 */
function displaySelectedMethod(type) {
  store.selectedMethod = type;
  resetPaymentMethod();
  if (type !== 'paypal') {
    document.querySelector('button[value="submit-payment"]').disabled = false;
  } else {
    document.querySelector('button[value="submit-payment"]').disabled = true;
  }
  document
    .querySelector(`#component_${type}`)
    .setAttribute('style', 'display:block');
}

function showInputError(input) {
  input.classList.add('adyen-checkout__input--error');
}
function validateAch() {
  const inputs = document.querySelectorAll('#component_ach > input');
  const filteredInputs = Object.values(inputs).filter(
    ({ value }) => !value?.length,
  );
  filteredInputs.forEach(showInputError);

  return !filteredInputs.length;
}

function validateRatepay() {
  const input = document.querySelector('#dateOfBirthInput');
  const inputIsFilled = input.value?.length;
  if (!inputIsFilled) {
    showInputError(input);
  }
  return !!inputIsFilled;
}

function displayValidationErrors() {
  store.selectedPayment.node.showValidation();
  return false;
}

const selectedMethods = {
  ach: validateAch,
  ratepay: validateRatepay,
};

function doCustomValidation() {
  return store.selectedMethod in selectedMethods
    ? selectedMethods[store.selectedMethod]()
    : true;
}

function showValidation() {
  return store.selectedPaymentIsValid
    ? doCustomValidation()
    : displayValidationErrors();
}

module.exports = {
  assignPaymentMethodValue,
  paymentFromComponent,
  resetPaymentMethod,
  displaySelectedMethod,
  showValidation,
};
