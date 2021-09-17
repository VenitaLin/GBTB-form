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
  useEffect(() => {
    sp.setup({
      spfxContext: props.context,
    });
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
    fetchData();
  }, []);
  return (
    <div>
      <h2>{status}</h2>
      <Bookings
        bookings={bookings}
        status={status}
        siteDetails={props}
        isDisabledNewBookBtn={isDisabledNewBookBtn}
      />
      {/* <GbtbForm siteDetails={props} /> */}
    </div>
  );
};
