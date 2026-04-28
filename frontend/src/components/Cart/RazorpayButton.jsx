import axios from "axios";
import gpayLogo from "../../assets/gpay.png";

const RazorpayButton = ({ amount }) => {
  const handlePayment = async () => {
    const { data } = await axios.post("/api/razorpay/create-order", {
      amount,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      name: "Kick Store",
      description: "Test Payment",
      order_id: data.id,

      handler: function (response) {
        alert("Payment Successful ✅");
        console.log(response);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
 <button
  onClick={handlePayment}
  className="w-full bg-black text-white py-3 rounded-md font-semibold text-base hover:bg-gray-800 transition flex items-center justify-center gap-3 shadow"
>
  <img
    src={gpayLogo}
    alt="GPay"
    className="h-5 w-auto"
  />
  Pay with UPI 
</button>
  );
};

export default RazorpayButton;