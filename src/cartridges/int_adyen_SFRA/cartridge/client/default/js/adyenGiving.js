const adyenGivingNode = document.getElementById('donate-container');

function handleOnDonate(state, component) {
  if (!state.isValid) {
    return;
  }
  const selectedAmount = state.data.amount;
  const donationData = {
    amountValue: selectedAmount.value,
    amountCurrency: selectedAmount.currency,
    orderNo,
    pspReference,
  };

  $.ajax({
    url: 'Adyen-Donate',
    type: 'post',
    data: donationData,
    success() {
      component.setStatus('success');
    },
  });
}

function handleOnCancel(/* state, component */) {
  const adyenGiving = document.getElementById('adyenGiving');
  adyenGiving.style.transition = 'all 3s ease-in-out';
  adyenGiving.style.display = 'none';
  donation.unmount();
}

function getAmounts() {
  try {
    return JSON.parse(donationAmounts);
  } catch (e) {
    return [];
  }
}

const donationConfig = {
  amounts: getAmounts(),
  backgroundUrl: adyenGivingBackgroundUrl,
  description: charityDescription,
  logoUrl: adyenGivingLogoUrl,
  name: charityName,
  url: charityWebsite,
  showCancelButton: true,
  onDonate: handleOnDonate,
  onCancel: handleOnCancel,
};

const checkout = new AdyenCheckout(window.Configuration);
const donation = checkout
  .create('donation', donationConfig)
  .mount(adyenGivingNode);
