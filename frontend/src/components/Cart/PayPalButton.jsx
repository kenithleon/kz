import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";

const PayPalCheckoutButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        createOrder={async () => {
          try {
            const { data } = await axios.post(
              "http://localhost:9000/api/paypal/create-order",
              {
                amount: parseFloat(amount).toFixed(2),
              }
            );

            return data.id;
          } catch (err) {
            console.error("Create Error:", err.response?.data || err);
            onError(err);
          }
        }}

        onApprove={async (data) => {
          try {
            const res = await axios.post(
              `http://localhost:9000/api/paypal/capture-order/${data.orderID}`
            );

            onSuccess(res.data);
          } catch (err) {
            console.error("Capture Error:", err.response?.data || err);
            onError(err);
          }
        }}

        onError={(err) => {
          console.error("❌ PayPal Error:", err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;