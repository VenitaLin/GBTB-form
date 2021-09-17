import * as React from "react";
import { GbtbForm } from "./GbtbForm";
import * as App from "./GbtbFormApp";
import { Bookings } from "./GbtbBookings";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp";

export const HomePage = (props) => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("ready");
  const [isDisabledNewBookBtn, setIsDisabledNewBookBtn] = useState(false);
  const fetchData = async () => {
    try {
      setStatus("loading");
      await App.getBookings(props.GbtbListName).then((bookingsList) => {
        setBookings(bookingsList);
        setIsDisabledNewBookBtn(App.isDisabledNewBookingBtn(bookingsList));
      });
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  };
  const updateCancelBooking = () => {
    fetchData();
  };
  const updateNewBooking = () => {
    fetchData();
  };
  useEffect(() => {
    sp.setup({
      spfxContext: props.context,
    });
    fetchData();
  }, []);
  return (
    <div>
      <h2>{status}</h2>
      <Bookings
        updateCancelBooking={updateCancelBooking}
        updateNewBooking={updateNewBooking}
        bookings={bookings}
        status={status}
        siteDetails={props}
        isDisabledNewBookBtn={isDisabledNewBookBtn}
        isFormShown={!isDisabledNewBookBtn}
      />
      {/* <GbtbForm siteDetails={props} /> */}
    </div>
  );
};
