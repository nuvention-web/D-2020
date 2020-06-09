import React from "react";
import StripeCheckout from "react-stripe-checkout";

const StripeCheckoutButton = ({ price }) => {
  // Stripe want value in Cents
  const priceForStripe = price * 100;
  const publishableKey = "pk_test_yj9wEzSYqUUxXmZWt5j0Th0600yk2p1ufq";
  const onToken = (token) => {
    console.log(token);
    alert("Payment Successful");
    // Actually make firebase bill the customer
  };
  return (
    <StripeCheckout
      label="Sign Up for Monthly Subscription"
      name="Tendon"
      billingAddress
      shippingAddress
      image="/img/tendonlogo.png"
      description={`Your monthly subscription fee: $${price}`}
      amount={priceForStripe}
      panelLabel="Sign Up for Monthly Subscription"
      token={onToken}
      stripeKey={publishableKey}
      disabled
    />
  );
};

export default StripeCheckoutButton;
