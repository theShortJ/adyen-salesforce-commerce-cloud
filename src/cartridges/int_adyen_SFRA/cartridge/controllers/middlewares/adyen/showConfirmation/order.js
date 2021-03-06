const Transaction = require('dw/system/Transaction');
const URLUtils = require('dw/web/URLUtils');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');
const { clearForms } = require('../../../utils/index');

function handleOrderConfirm(
  order,
  orderModel,
  adyenPaymentInstrument,
  result,
  { res, next },
) {
  Transaction.wrap(() => {
    order.custom.Adyen_CustomerEmail = JSON.stringify(orderModel);
    AdyenHelper.savePaymentDetails(adyenPaymentInstrument, order, result);
  });

  clearForms();
  res.redirect(
    URLUtils.url(
      'Order-Confirm',
      'ID',
      order.orderNo,
      'token',
      order.orderToken,
    ).toString(),
  );
  return next();
}

module.exports = handleOrderConfirm;
