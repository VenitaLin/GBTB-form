import * as React from "react";
import { GbtbForm } from "./GbtbForm";
import * as App from "./GbtbFormApp";
import { Bookings } from "./GbtbBookings";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp";

export const HomePage = (props) => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("ready");

  useEffect(() => {
    sp.setup({
      spfxContext: props.context,
    });
    const fetchData = async () => {
      try {
        setStatus("loading");
        let bookingsList = await App.getBookings(props.GbtbListName);
        setBookings(bookingsList);
        setStatus("ready");
      } catch (e) {
        setStatus("error");
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>{status}</h2>
      <Bookings bookings={bookings} status={status} />
      <GbtbForm siteDetails={props} />
    </div>
  );
};
