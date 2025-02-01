/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { UserContext } from '../UserContext';
import Qrcode from 'qrcode';

export default function PaymentSummary() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const defaultTicketState = {
    userid: user ? user._id : '',
    eventid: '',
    ticketDetails: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      eventname: '',
      eventdate: '',
      eventtime: '',
      ticketprice: '',
      qr: '',
    },
  };

  const [ticketDetails, setTicketDetails] = useState(defaultTicketState);

  const [details, setDetails] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    contactNo: '',
  });

  const [payment, setPayment] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/event/${id}/ordersummary/paymentsummary`)
      .then((response) => {
        setEvent(response.data);
        setTicketDetails((prev) => ({
          ...prev,
          eventid: response.data._id,
          ticketDetails: {
            ...prev.ticketDetails,
            eventname: response.data.title,
            eventdate: response.data.eventDate.split('T')[0],
            eventtime: response.data.eventTime,
            ticketprice: response.data.ticketPrice,
          },
        }));
      })
      .catch((error) => console.error('Error fetching event:', error));
  }, [id]);

  //! Input Change Handlers
  const handleChangeDetails = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when user types
  };

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when user types
  };

  //! Validation Function
  const validateInputs = () => {
    let validationErrors = {};

    if (!details.name.trim()) validationErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
      validationErrors.email = 'Invalid email format';
    if (!/^\d{10}$/.test(details.contactNo))
      validationErrors.contactNo = 'Invalid contact number';

    if (!/^\d{16}$/.test(payment.cardNumber))
      validationErrors.cardNumber = 'Card number must be 16 digits';
    if (!/^\d{2}\/\d{2}$/.test(payment.expiryDate))
      validationErrors.expiryDate = 'Use MM/YY format';
    if (!/^\d{3}$/.test(payment.cvv))
      validationErrors.cvv = 'CVV must be 3 digits';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  //! Generate QR Code
  async function generateQRCode(name, eventName) {
    try {
      return await Qrcode.toDataURL(`Event: ${name}\nName: ${eventName}`);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  }

  //! Create Ticket Handler
  const createTicket = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const qrCode = await generateQRCode(
        ticketDetails.ticketDetails.eventname,
        ticketDetails.ticketDetails.name
      );
      const updatedTicketDetails = {
        ...ticketDetails,
        ticketDetails: { ...ticketDetails.ticketDetails, qr: qrCode },
      };

      await axios.post(`/tickets`, updatedTicketDetails);
      alert('Ticket Created');
      setRedirect(true);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  if (redirect) return <Navigate to="/wallet" />;
  if (!event) return '';

  return (
    <div className="flex justify-center mt-12">
      {/* Left Section */}
      <div className="bg-gray-100 shadow-lg p-8 w-2/3 rounded-md">
        <Link
          to={`/event/${event._id}/ordersummary`}
          className="inline-flex items-center text-blue-700 font-bold"
        >
          <IoMdArrowBack className="w-6 h-6 mr-2" /> Back
        </Link>

        {/* User Details */}
        <h2 className="text-xl font-bold mt-6">Your Details</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <input
              type="text"
              name="name"
              value={details.name}
              onChange={handleChangeDetails}
              placeholder="Name"
              className="p-2 border rounded-md w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={details.email}
              onChange={handleChangeDetails}
              placeholder="Email"
              className="p-2 border rounded-md w-full"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="contactNo"
              value={details.contactNo}
              onChange={handleChangeDetails}
              placeholder="Contact No"
              className="p-2 border rounded-md w-full"
            />
            {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo}</p>}
          </div>
        </div>

        {/* Payment Details */}
        <h2 className="text-xl font-bold mt-6">Payment Option</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <input
              type="text"
              name="cardNumber"
              value={payment.cardNumber}
              onChange={handleChangePayment}
              placeholder="Card Number"
              className="p-2 border rounded-md w-full"
            />
            {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
          </div>

          <div>
            <input
              type="text"
              name="expiryDate"
              value={payment.expiryDate}
              onChange={handleChangePayment}
              placeholder="MM/YY"
              className="p-2 border rounded-md w-full"
            />
            {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
          </div>

          <div>
            <input
              type="text"
              name="cvv"
              value={payment.cvv}
              onChange={handleChangePayment}
              placeholder="CVV"
              className="p-2 border rounded-md w-full"
            />
            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
          </div>
        </div>
        <p className="text-sm font-semibold mt-6">Total: LKR. {event.ticketPrice}</p>
        <button onClick={createTicket} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full">
          Make Payment
        </button>
      </div>

      {/* Right Section: Order Summary */}
      <div className="ml-8 p-6 bg-blue-100 w-1/3 rounded-md">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="text-lg font-semibold">{event.title}</p>
        <p>{event.eventDate.split("T")[0]}, {event.eventTime}</p>
        <hr className="my-2 border-gray-400" />
        <p className="font-bold">Total: LKR. {event.ticketPrice}</p>
      </div>

    </div >
  );
}
